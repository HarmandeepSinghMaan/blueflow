import React from 'react'
import { Container, Box, Typography } from '@mui/material'

export default function Settings() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>Settings</Typography>
        <Typography variant="body1">Edit user and company details here.</Typography>
      </Box>
    </Container>
  )
}