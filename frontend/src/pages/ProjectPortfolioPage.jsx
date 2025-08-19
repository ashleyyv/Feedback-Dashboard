import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Description as DocumentIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  BarChart as AnalyticsIcon,
  Link as LinkIcon,
  LightMode as LightModeIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  Help as HelpIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import ProjectCard from '../components/ProjectCard';
import { dummyProjects } from '../data/projects';

const drawerWidth = 240;

export default function ProjectPortfolioPage() {
  const [viewMode, setViewMode] = useState('list');

  const menuItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', active: true },
    { icon: <PersonIcon />, text: 'Users' },
    { icon: <SettingsIcon />, text: 'Settings' },
    { icon: <DocumentIcon />, text: 'Documents' },
    { icon: <MoneyIcon />, text: 'Finance' },
    { icon: <InventoryIcon />, text: 'Inventory' },
    { icon: <AnalyticsIcon />, text: 'Analytics' },
    { icon: <LinkIcon />, text: 'Integrations' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid rgba(0, 255, 255, 0.2)',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 255, 255, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main', 
              color: 'black',
              fontWeight: 'bold',
              width: 40,
              height: 40
            }}>
              D
            </Avatar>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Denovers
            </Typography>
          </Box>
        </Box>
        
        <List sx={{ pt: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              button
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                backgroundColor: item.active ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 255, 0.05)',
                }
              }}
            >
              <ListItemIcon sx={{ color: item.active ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: item.active ? 'primary.main' : 'text.secondary',
                    fontWeight: item.active ? 'bold' : 'normal'
                  } 
                }} 
              />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ mt: 'auto', p: 2 }}>
          <IconButton sx={{ color: 'text.secondary' }}>
            <LightModeIcon />
          </IconButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
        {/* Content Area */}
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              Project Portfolios
            </Typography>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  '& fieldset': {
                    borderColor: 'rgba(0, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Project Type</InputLabel>
              <Select
                label="Project Type"
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="construction">Construction</MenuItem>
                <MenuItem value="renovation">Renovation</MenuItem>
                <MenuItem value="expansion">Expansion</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Location</InputLabel>
              <Select
                label="Location"
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem value="all">All Locations</MenuItem>
                <MenuItem value="north">North America</MenuItem>
                <MenuItem value="europe">Europe</MenuItem>
                <MenuItem value="asia">Asia Pacific</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Status</InputLabel>
              <Select
                label="Status"
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="on-track">On Track</MenuItem>
                <MenuItem value="at-risk">At Risk</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Project Cards Grid */}
          <Grid container spacing={2}>
            {dummyProjects.map((project) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={project.id}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
