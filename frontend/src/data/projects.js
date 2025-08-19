// src/data/projects.js

export const dummyProjects = [
  {
    id: 'proj-001',
    initials: 'DT',
    name: 'Downtown Tower Construction',
    client: 'Turner Construction',
    status: 'On Track',
    healthMetrics: ['On Schedule', 'Within Budget'],
    progress: {
      label: 'Schedule Completion',
      percentage: 65,
    },
    issues: {
      safety: 0,
      schedule: 2,
      budget: 1,
      quality: 0,
    },
    keyResource: {
      label: 'Open RFIs',
      count: 3,
    },
    location: {
      address: '123 Main St, Metropolis, USA',
      docsUrl: '#',
    },
  },
  {
    id: 'proj-002',
    initials: 'HW',
    name: 'Highway 7 Expansion',
    client: 'Granite Corp',
    status: 'At Risk',
    healthMetrics: ['Schedule Delayed', 'Budget Concern'],
    progress: {
      label: 'Schedule Completion',
      percentage: 45,
    },
    issues: {
      safety: 1,
      schedule: 5,
      budget: 3,
      quality: 2,
    },
    keyResource: {
      label: 'Pending Changes',
      count: 8,
    },
    location: {
      address: '456 Oak Ave, Gotham, USA',
      docsUrl: '#',
    },
  },
  {
    id: 'proj-003',
    initials: 'MP',
    name: 'Metro Plaza Renovation',
    client: 'BuildRight Inc.',
    status: 'Critical',
    healthMetrics: ['OSHA Violation', 'Over Budget'],
    progress: {
      label: 'Budget Spent',
      percentage: 115,
    },
    issues: {
      safety: 3,
      schedule: 8,
      budget: 5,
      quality: 4,
    },
    keyResource: {
      label: 'Pending Changes',
      count: 5,
    },
    location: {
      address: '789 Pine Ln, Star City, USA',
      docsUrl: '#',
    },
  },
  {
    id: 'proj-004',
    initials: 'SP',
    name: 'Solar Panel Farm',
    client: 'Future Energy Co.',
    status: 'On Track',
    healthMetrics: ['Ahead of Schedule', 'Under Budget'],
    progress: {
      label: 'Schedule Completion',
      percentage: 80,
    },
    issues: {
      safety: 0,
      schedule: 0,
      budget: 0,
      quality: 1,
    },
    keyResource: {
      label: 'Open RFIs',
      count: 1,
    },
    location: {
      address: '101 Sun Blvd, Radiant, USA',
      docsUrl: '#',
    },
  },
];
