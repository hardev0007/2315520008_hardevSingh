import React from 'react'
import { AppBar as MuiAppBar, Toolbar, Typography, Drawer, Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

const DRAWER_WIDTH = 240

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Priority Inbox', path: '/priority' }
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Notifications
          </Typography>
        </Toolbar>
      </MuiAppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', mt: 8 }
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map(item => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  )
}
