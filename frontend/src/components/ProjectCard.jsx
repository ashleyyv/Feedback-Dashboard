import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions,
  Avatar, 
  Box, 
  Typography, 
  Chip,
  LinearProgress,
  IconButton,
  Paper
} from '@mui/material';
import {
  Security as ShieldAlert,
  Timeline as GanttChartSquare,
  AttachMoney as DollarSign,
  CheckCircle,
  LocationOn,
  Description
} from '@mui/icons-material';

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'On Track': return '#4caf50';
      case 'At Risk': return '#ff9800';
      case 'Critical': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage > 100) return '#f44336';
    if (percentage > 80) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Card sx={{ 
      height: '100%',
      backgroundColor: 'background.paper',
      border: '1px solid rgba(0, 255, 255, 0.2)',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
        transform: 'translateY(-2px)'
      }
    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            color: 'black',
            fontWeight: 'bold'
          }}>
            {project.initials}
          </Avatar>
        }
        title={
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '1rem' }}>
            {project.name}
          </Typography>
        }
        subheader={
          <Chip 
            label={project.client} 
            size="small"
            sx={{ 
              backgroundColor: 'rgba(0, 255, 255, 0.1)',
              color: 'primary.main',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              mt: 0.5
            }}
          />
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: getStatusColor(project.status),
                boxShadow: `0 0 10px ${getStatusColor(project.status)}`
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {project.status}
            </Typography>
          </Box>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        {/* Health Metrics */}
        <Box sx={{ mb: 2 }}>
          {project.healthMetrics.map((metric, index) => (
            <Chip
              key={index}
              label={metric}
              size="small"
              sx={{ 
                mr: 1, 
                mb: 1,
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                color: 'primary.main',
                fontSize: '0.7rem'
              }}
            />
          ))}
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              {project.progress.label}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: getProgressColor(project.progress.percentage),
              fontWeight: 'bold',
              fontSize: '0.8rem'
            }}>
              {project.progress.percentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(project.progress.percentage, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProgressColor(project.progress.percentage),
                borderRadius: 4
              }
            }}
          />
        </Box>

        {/* Issues Grid */}
        <Paper sx={{ 
          p: 1, 
          mb: 2, 
          backgroundColor: 'rgba(0, 255, 255, 0.02)',
          border: '1px solid rgba(0, 255, 255, 0.1)'
        }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1, display: 'block' }}>
            Issue Summary
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 1
          }}>
            <Box sx={{ textAlign: 'center', p: 0.5 }}>
              <ShieldAlert sx={{ 
                color: project.issues.safety > 0 ? '#f44336' : '#4caf50', 
                fontSize: 16,
                mb: 0.5 
              }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                Safety
              </Typography>
              <Typography variant="caption" sx={{ 
                color: project.issues.safety > 0 ? '#f44336' : '#4caf50',
                fontWeight: 'bold',
                display: 'block',
                fontSize: '0.7rem'
              }}>
                {project.issues.safety}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 0.5 }}>
              <GanttChartSquare sx={{ 
                color: project.issues.schedule > 0 ? '#ff9800' : '#4caf50', 
                fontSize: 16,
                mb: 0.5 
              }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                Schedule
              </Typography>
              <Typography variant="caption" sx={{ 
                color: project.issues.schedule > 0 ? '#ff9800' : '#4caf50',
                fontWeight: 'bold',
                display: 'block',
                fontSize: '0.7rem'
              }}>
                {project.issues.schedule}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 0.5 }}>
              <DollarSign sx={{ 
                color: project.issues.budget > 0 ? '#f44336' : '#4caf50', 
                fontSize: 16,
                mb: 0.5 
              }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                Budget
              </Typography>
              <Typography variant="caption" sx={{ 
                color: project.issues.budget > 0 ? '#f44336' : '#4caf50',
                fontWeight: 'bold',
                display: 'block',
                fontSize: '0.7rem'
              }}>
                {project.issues.budget}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 0.5 }}>
              <CheckCircle sx={{ 
                color: project.issues.quality > 0 ? '#ff9800' : '#4caf50', 
                fontSize: 16,
                mb: 0.5 
              }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                Quality
              </Typography>
              <Typography variant="caption" sx={{ 
                color: project.issues.quality > 0 ? '#ff9800' : '#4caf50',
                fontWeight: 'bold',
                display: 'block',
                fontSize: '0.7rem'
              }}>
                {project.issues.quality}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Key Resource */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 1,
          backgroundColor: 'rgba(0, 255, 255, 0.05)',
          borderRadius: 1,
          border: '1px solid rgba(0, 255, 255, 0.1)'
        }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            {project.keyResource.label}
          </Typography>
          <Chip
            label={project.keyResource.count}
            size="small"
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <LocationOn sx={{ color: 'primary.main', fontSize: 16 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1, fontSize: '0.7rem' }}>
            {project.location.address}
          </Typography>
          <IconButton size="small" sx={{ color: 'primary.main' }}>
            <Description sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
