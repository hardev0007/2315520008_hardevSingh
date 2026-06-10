import React from 'react'
import { Box, TextField, MenuItem, Button } from '@mui/material'

const types = ['', 'Placement', 'Result', 'Event']

export default function Filters({ filters, setFilters, onApply }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        select
        label="Type"
        value={filters.notification_type || ''}
        onChange={e => setFilters({ ...filters, notification_type: e.target.value })}
        size="small"
      >
        {types.map(t => (
          <MenuItem key={t} value={t}>{t || 'All'}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Limit"
        type="number"
        value={filters.limit || 10}
        onChange={e => setFilters({ ...filters, limit: Number(e.target.value) })}
        size="small"
      />
      <Button variant="contained" onClick={onApply}>Apply</Button>
    </Box>
  )
}
