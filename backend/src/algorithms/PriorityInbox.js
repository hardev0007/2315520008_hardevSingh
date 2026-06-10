const MinHeap = require('./MinHeap')

class PriorityInbox {
  constructor(capacity = 10) {
    this.heap = new MinHeap()
    this.capacity = capacity
  }

  _score(notification) {
    const weights = {
      Placement: 3,
      Result: 2,
      Event: 1,
      placement: 3,
      result: 2,
      event: 1
    }
    const type = notification.notification_type || notification.type || notification.category || ''
    const weight = weights[type] || 0
    const createdAt = notification.createdAt || notification.created_at || notification.timestamp || notification.time || Date.now()
    const ts = (new Date(createdAt)).getTime() || Date.now()
    const score = (weight * 1e14) + ts
    return score
  }

  pushNotification(notification) {
    const score = this._score(notification)
    this.heap.push({ score, value: notification })
    if (this.heap.size() > this.capacity) this.heap.pop()
  }

  top() {
    // extract items and sort descending
    const items = []
    while (this.heap.size() > 0) {
      const it = this.heap.pop()
      if (it) items.push(it.value || it)
    }
    // items are popped from smallest to largest; reverse to largest-first
    return items.reverse()
  }

  size() {
    return this.heap.size()
  }
}

module.exports = PriorityInbox
