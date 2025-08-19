import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Globe from '../components/globe/Globe';
import { Button, Typography, Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transformations
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  return (
    <Box ref={containerRef} sx={{ height: '200vh', position: 'relative' }}>
      <Box sx={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Globe Section */}
        <motion.div 
          style={{ 
            scale: globeScale, 
            opacity: globeOpacity,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          <Globe />
        </motion.div>

        {/* Overlay Content */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 2,
            backgroundColor: 'rgba(10, 25, 47, 0.3)', // Semi-transparent overlay
          }}
        >
          <motion.div style={{ y: contentY }}>
            <Typography variant="h1" sx={{ color: 'primary.main', mb: 2, textShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}>
              Global Feedback Intelligence
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
              Aggregate, Analyze, and Act on User Feedback from Across the World.
            </Typography>
            <Button
              component={Link}
              to="/portfolio"
              variant="contained"
              size="large"
              sx={{ 
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                }
              }}
            >
              Enter Portfolio
            </Button>
            <Box sx={{ mt: 10 }}>
              <Typography sx={{ color: 'text.secondary' }}>Scroll to Explore</Typography>
              <ArrowDownwardIcon sx={{ color: 'primary.main', mt: 1 }}/>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
