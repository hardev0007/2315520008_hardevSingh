import React from 'react'
import { Box, Button } from '@mui/material'

export default function PaginationControls({ page, setPage, hasMore }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
      <Button disabled={!hasMore} onClick={() => setPage(page + 1)}>Next</Button>
    </Box>
  )
}
