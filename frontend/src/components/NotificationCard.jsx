import React from 'react'
import { Card, CardContent, Typography, Chip } from '@mui/material'

export default function NotificationCard({ item }) {
  const type = item.notification_type || item.type || item.category || 'Unknown'
  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="subtitle2">{type}</Typography>
        <Typography variant="body1">{item.content || item.message || item.body || JSON.stringify(item)}</Typography>
        <Chip label={item.isRead ? 'Read' : 'Unread'} size="small" sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  )
}
