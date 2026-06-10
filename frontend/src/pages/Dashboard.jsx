import React, { useEffect, useState } from 'react'
import { Container, Typography, CircularProgress, Box, Grid, Card, CardContent, Chip } from '@mui/material'
import { fetchNotifications, fetchUnread, fetchPriority } from '../services/api'
import NotificationTable from '../components/NotificationTable'
import NotificationCard from '../components/NotificationCard'
import Filters from '../components/Filters'
import PaginationControls from '../components/PaginationControls'

export default function Dashboard() {
  const [filters, setFilters] = useState({ limit: 10 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [top, setTop] = useState([])
  const [stats, setStats] = useState({ unreadCount: 0, totalCount: 0 })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchNotifications({ ...filters, page })
      const list = Array.isArray(data) ? data : (data.notifications || data.items || [])
      setItems(list)

      // Get unread count
      const unreadData = await fetchUnread({})
      const unreadList = Array.isArray(unreadData) ? unreadData : (unreadData.notifications || [])
      setStats({ unreadCount: unreadList.length, totalCount: list.length })

      // Get top priority
      const p = await fetchPriority({})
      setTop(p.top || [])
    } catch (err) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filters, page])

  return (
    <Container sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Notifications Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Card sx={{ minWidth: 150 }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary">Unread</Typography>
              <Typography variant="h6">{stats.unreadCount}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 150 }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary">Total</Typography>
              <Typography variant="h6">{stats.totalCount}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Filters filters={filters} setFilters={setFilters} onApply={() => setPage(1)} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <NotificationTable items={items} />
              <PaginationControls page={page} setPage={setPage} hasMore={items.length === (filters.limit || 10)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 1 }}>Top 10 Priority</Typography>
              {top.length === 0 ? (
                <Typography variant="body2">No priority notifications</Typography>
              ) : (
                top.map(t => <NotificationCard key={t.id || t._id || JSON.stringify(t)} item={t} />)
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}
