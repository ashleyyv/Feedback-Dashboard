import React from 'react';
import { Box, Typography, Paper, Grid, Button, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { mockFeedbackData } from '../api/mockData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Define columns for the DataGrid
const columns = [
  { 
    field: 'summary', 
    headerName: 'Feedback Item', 
    flex: 1.5,
    renderCell: (params) => (
      <Typography sx={{ color: 'text.primary', fontSize: '0.9rem' }}>
        {params.value}
      </Typography>
    )
  },
  { 
    field: 'category', 
    headerName: 'Category', 
    flex: 1,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        size="small"
        sx={{ 
          backgroundColor: 'primary.main', 
          color: 'black',
          fontWeight: 'bold'
        }}
      />
    )
  },
  { 
    field: 'alignment', 
    headerName: 'Alignment Score', 
    flex: 1,
    renderCell: (params) => (
      <Typography sx={{ 
        color: params.value > 0.8 ? '#4caf50' : params.value > 0.6 ? '#ff9800' : '#f44336',
        fontWeight: 'bold'
      }}>
        {(params.value * 100).toFixed(0)}%
      </Typography>
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    flex: 1,
    renderCell: (params) => {
      const getStatusColor = (status) => {
        switch(status) {
          case 'Critical': return '#f44336';
          case 'High Priority': return '#ff9800';
          case 'In Progress': return '#2196f3';
          case 'Resolved': return '#4caf50';
          default: return '#9e9e9e';
        }
      };
      return (
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            backgroundColor: getStatusColor(params.value),
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      );
    }
  },
  { 
    field: 'region', 
    headerName: 'Region', 
    flex: 1,
    renderCell: (params) => (
      <Typography sx={{ color: 'text.secondary' }}>
        {params.value}
      </Typography>
    )
  },
];

export default function DashboardPage() {
  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            component={Link} 
            to="/portfolio" 
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'primary.main', mr: 3 }}
          >
            Back to Portfolio
          </Button>
          <Typography variant="h4" sx={{ color: 'primary.main', textShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}>
            Dashboard: Global Feedback Intelligence
          </Typography>
        </Box>
        <Button 
          component={Link} 
          to="/" 
          variant="outlined"
          sx={{ 
            borderColor: 'primary.main',
            color: 'primary.main',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 255, 0.1)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            }
          }}
        >
          Home
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Section 1: Feedback Triage & Prioritization */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 2, 
            height: '600px', 
            backgroundColor: 'background.paper',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
              Feedback Triage & Prioritization
            </Typography>
            <DataGrid
              rows={mockFeedbackData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
              sx={{ 
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'rgba(0, 255, 255, 0.1)',
                  borderBottom: '2px solid #00ffff',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
                '& .MuiCheckbox-root': {
                  color: 'primary.main',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgba(0, 255, 255, 0.05)',
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Section 2 & 3: Heatmap and Filters */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 2, 
            height: '300px', 
            backgroundColor: 'background.paper',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
          }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Feedback Activity Heatmap
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%'}}>
              <Typography sx={{color: 'text.secondary', fontStyle: 'italic'}}>
                📊 Interactive heatmap visualization coming soon
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 2, 
            height: '300px', 
            backgroundColor: 'background.paper',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
          }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Global & Temporal Filters
            </Typography>
             <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%'}}>
              <Typography sx={{color: 'text.secondary', fontStyle: 'italic'}}>
                🔍 Advanced filtering controls coming soon
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
