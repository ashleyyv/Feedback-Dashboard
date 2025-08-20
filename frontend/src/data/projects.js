// src/data/projects.js

export const dummyProjects = [
  {
    id: 'bloomberg-terminal',
    initials: 'BT',
    name: 'Bloomberg Terminal',
    client: 'Professional Traders & Analysts',
    status: 'Critical',
    healthMetrics: ['UX Performance', 'Trading Tools'],
    progress: {
      label: 'User Satisfaction',
      percentage: 92,
    },
    issues: {
      safety: 0,
      schedule: 1,
      budget: 0,
      quality: 2,
    },
    keyResource: {
      label: 'Active Users',
      count: 325000,
    },
    location: {
      address: 'Financial Markets Worldwide',
      docsUrl: '#',
    },
  },
  {
    id: 'bloomberg-api',
    initials: 'BA',
    name: 'Bloomberg API',
    client: 'Financial Institutions',
    status: 'On Track',
    healthMetrics: ['API Performance', 'Integration Success'],
    progress: {
      label: 'API Uptime',
      percentage: 99.9,
    },
    issues: {
      safety: 0,
      schedule: 0,
      budget: 1,
      quality: 0,
    },
    keyResource: {
      label: 'API Calls/Day',
      count: 15000000,
    },
    location: {
      address: 'Global Financial Systems',
      docsUrl: '#',
    },
  },
  {
    id: 'bloomberg-news-analytics',
    initials: 'BN',
    name: 'News, Research & Analytics',
    client: 'Investment Professionals',
    status: 'On Track',
    healthMetrics: ['Content Quality', 'Analytics Accuracy'],
    progress: {
      label: 'Content Engagement',
      percentage: 87,
    },
    issues: {
      safety: 0,
      schedule: 1,
      budget: 0,
      quality: 1,
    },
    keyResource: {
      label: 'Daily Articles',
      count: 5000,
    },
    location: {
      address: 'Global Financial News',
      docsUrl: '#',
    },
  },
  {
    id: 'bloomberg-core-systems',
    initials: 'BC',
    name: 'Core Systems',
    client: 'All Bloomberg Users',
    status: 'At Risk',
    healthMetrics: ['Authentication', 'Billing', 'Support'],
    progress: {
      label: 'System Reliability',
      percentage: 98.5,
    },
    issues: {
      safety: 1,
      schedule: 2,
      budget: 0,
      quality: 1,
    },
    keyResource: {
      label: 'Support Tickets',
      count: 1250,
    },
    location: {
      address: 'Bloomberg Infrastructure',
      docsUrl: '#',
    },
  },
];
