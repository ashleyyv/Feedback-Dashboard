'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Upload,
  Settings,
  Search,
  Filter
} from 'lucide-react'
import DashboardHeader from '../components/dashboard-header'

interface FeedbackItem {
  id: string
  feedback_text: string
  category: string
  priority_score: number
  sentiment_score: number
  date: string
  source_type: string
}

export default function Dashboard() {
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setFeedbackData([
        {
          id: '1',
          feedback_text: 'The user interface is very intuitive and easy to navigate',
          category: 'User Interface',
          priority_score: 8.5,
          sentiment_score: 0.8,
          date: '2024-01-15',
          source_type: 'support'
        },
        {
          id: '2',
          feedback_text: 'The application is too slow and takes forever to load',
          category: 'Performance',
          priority_score: 9.2,
          sentiment_score: -0.6,
          date: '2024-01-14',
          source_type: 'support'
        },
        {
          id: '3',
          feedback_text: 'Great features but needs better mobile support',
          category: 'Mobile',
          priority_score: 7.8,
          sentiment_score: 0.4,
          date: '2024-01-13',
          source_type: 'sales'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredData = feedbackData.filter(item => {
    const matchesSearch = item.feedback_text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(feedbackData.map(item => item.category)))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Feedback Dashboard</h1>
          <p className="text-gray-600">Analyze and manage customer feedback effectively</p>
        </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{feedbackData.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {(feedbackData.reduce((acc, item) => acc + item.priority_score, 0) / feedbackData.length).toFixed(1)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.from(new Set(feedbackData.map(item => item.category))).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sources</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.from(new Set(feedbackData.map(item => item.source_type))).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Feedback</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-900">{item.category}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.sentiment_score > 0 ? 'bg-green-100 text-green-800' : 
                    item.sentiment_score < 0 ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.sentiment_score > 0 ? 'Positive' : 
                     item.sentiment_score < 0 ? 'Negative' : 'Neutral'}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Priority: {item.priority_score}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{item.feedback_text}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{item.source_type}</span>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}
