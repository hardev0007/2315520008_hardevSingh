# Notification System Design

This document outlines a simple priority-based notification pipeline used by the Roll Number project.

Backend: Express API exposes endpoints and proxy APIs to the external evaluation service.
Algorithms: `MinHeap` + `PriorityInbox` for deterministic priority ordering.
Frontend: React + MUI dashboard showing tables, cards, filters, pagination and priority inbox.

Stage 2 — Schema (PostgreSQL)

CREATE TABLE statements:

```sql
CREATE TABLE students (
	id SERIAL PRIMARY KEY,
	student_id INTEGER UNIQUE NOT NULL,
	first_name TEXT,
	last_name TEXT,
	email TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE notifications (
	id BIGSERIAL PRIMARY KEY,
	notification_id TEXT UNIQUE,
	student_id INTEGER REFERENCES students(student_id),
	notification_type TEXT NOT NULL,
	content JSONB,
	is_read BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE notification_reads (
	id BIGSERIAL PRIMARY KEY,
	notification_id BIGINT REFERENCES notifications(id),
	student_id INTEGER,
	read_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

Indexes:

```sql
CREATE INDEX idx_notifications_student_created ON notifications(student_id, created_at DESC);
CREATE INDEX idx_notifications_type_created ON notifications(notification_type, created_at DESC);
CREATE INDEX idx_notifications_isread_created ON notifications(is_read, created_at DESC);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

Partitioning strategy:

- Partition `notifications` by RANGE on `created_at` (monthly partitions) to keep active partitions small and make deletes/archival efficient.
- Maintain indexes per partition.

Scaling strategy:

- Use read replicas for serving read-heavy dashboards and listing queries.
- Use Redis as a caching layer for recent notifications and the Top-N priority inbox.
- Offload heavy analytical queries to a data warehouse (daily ETL into Snowflake/BigQuery).

Example SQL queries

1) Insert notification

```sql
INSERT INTO notifications(notification_id, student_id, notification_type, content)
VALUES('uuid-123', 1042, 'Placement', '{"title": "New placement"}')
;
```

2) Top unread notifications per student (simple):

```sql
SELECT * FROM notifications
WHERE student_id = $1
AND is_read = false
ORDER BY created_at DESC
LIMIT 10;
```

Stage 3 — Query analysis

Query to analyze:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

- Correctness: This returns all unread notifications for student 1042 ordered oldest-first.
- Performance issues: A sequential scan or poor index choice will make this slow for large tables. Sorting after selection can be expensive if many rows match.
- Indexing strategy: Create a composite index on (student_id, is_read, created_at). A suitable index is: `CREATE INDEX idx_notifications_student_isread_createdat ON notifications (student_id, is_read, created_at DESC);`
- Complexity: Using the index, the query becomes O(log N) to locate range + O(k) to scan matching rows, where k is number of unread rows for the student.

Optimized query (oldest-first but efficient):

```sql
CREATE INDEX IF NOT EXISTS idx_notifications_student_isread_createdat ON notifications (student_id, is_read, created_at ASC);

SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at ASC
LIMIT 100;
```

Query: Students receiving Placement notifications in last 7 days

```sql
SELECT DISTINCT s.student_id, s.email
FROM students s
JOIN notifications n ON n.student_id = s.student_id
WHERE n.notification_type = 'Placement'
AND n.created_at >= now() - interval '7 days';
```

Stage 4 — Scalability architecture

- Redis: caching recent notifications, Top-N priority, and session/tokens. Use TTLs and cache warming for hot students.
- Read replicas: offload reads to replicas; write master handles inserts and outbox pattern for multi-system consistency.
- WebSocket: push real-time notifications via a dedicated realtime service (socket.io or native WS), with Redis pub/sub to fan-out across nodes.
- CQRS: Separate read model (denormalized for fast dashboard queries) and write model (transactional). Use change-data-capture or outbox to update read model.
- Cache invalidation: Use write-through or event-driven invalidation (on insert, publish event to invalidate or update cache). Short TTLs for non-critical caches.
- Notification aggregation: batch similar notifications per student (e.g., group multiple result updates) to reduce noise.

Stage 5 — Notify All redesign (50000 students)

- Use event-driven architecture with Kafka (or RabbitMQ) topics: `notifications.generated`, `notifications.delivery`.
- Use Outbox pattern: write notification rows and an outbox row in same DB transaction; a separate delivery worker reads outbox and publishes to Kafka.
- Consumers:
	- Email delivery service consumes and attempts to send emails; on failure it retries with exponential backoff; after N retries it sends to Dead Letter Queue (DLQ).
	- In-app service writes notification rows and pushes websocket messages.

Pseudocode (producer -> outbox -> kafka -> consumers):

```pseudo
BEGIN TRANSACTION
INSERT INTO notifications(...)
INSERT INTO outbox(event_type='notification', payload=...)
COMMIT

OutboxWorker:
	poll outbox
	publish to kafka topic `notifications.generated`
	mark outbox row processed

EmailConsumer:
	on message
		try send email
		if success ack
		else retry with backoff
		if retries exceed threshold send to DLQ

InAppConsumer:
	on message
		write in-app notification rows for student
		push websocket event via Redis pub/sub
```

Stage 6 — Top 10 Priority Inbox implementation notes

- Priority mapping:
	- Placement = 3
	- Result = 2
	- Event = 1
- Ranking uses weight and recency; we compute `score = weight * W + createdAt` where `W` is a large multiplier.
- MinHeap stores the top N (10) smallest element at root so we can maintain size and eject smallest.
- Complexity: O(N log K) where N = number of unread notifications scanned and K = 10.

Implementation: See `backend/src/algorithms/MinHeap.js` and `backend/src/algorithms/PriorityInbox.js` for concrete code.

Further notes

- This design is a pragmatic balance between correctness and simplicity for the assessment. In a real production system, more concerns apply: security, observability, multi-tenancy, and per-tenant rate-limits.

