import React, { useEffect, useState } from 'react'
import { Container, Typography, CircularProgress, Box, Grid, Card, CardContent, Chip } from '@mui/material'
import { fetchPriority } from '../services/api'

export default function PriorityInboxPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [top, setTop] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPriority({})
        setTop(data.top || [])
      } catch (err) {
        setError(err.message || 'Failed to load priority inbox')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getPriorityColor = (type) => {
    if (type === 'Placement' || type === 'placement') return 'error'
    if (type === 'Result' || type === 'result') return 'warning'
    return 'info'
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>Top 10 Priority Inbox</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          {top.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" sx={{ py: 2 }}>No priority notifications</Typography>
            </Grid>
          )}
          {top.map((item, idx) => (
            <Grid item xs={12} md={6} key={item.id || item._id || idx}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">#{idx + 1}</Typography>
                    <Chip label={item.notification_type} color={getPriorityColor(item.notification_type)} size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>{item.content || item.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(item.createdAt || item.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
