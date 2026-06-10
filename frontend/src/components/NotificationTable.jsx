import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'

export default function NotificationTable({ items }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Read</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography align="center" sx={{ py: 2 }}>No notifications</Typography>
              </TableCell>
            </TableRow>
          )}
          {items.map(item => (
            <TableRow key={item.id || item._id || JSON.stringify(item)}>
              <TableCell>{item.id || item._id}</TableCell>
              <TableCell>{item.notification_type || item.type}</TableCell>
              <TableCell>{item.content || item.message || item.body}</TableCell>
              <TableCell>{new Date(item.createdAt || item.created_at || Date.now()).toLocaleString()}</TableCell>
              <TableCell>{item.isRead ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
