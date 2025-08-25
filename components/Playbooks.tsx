'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { 
  X, 
  Plus, 
  Search,
  BookOpen,
  Code,
  Tag,
  Copy,
  Edit,
  Star,
  Filter,
  Sparkles,
  Zap,
  Clock,
  User,
  Database
} from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface Playbook {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
  author: string
  createdAt: Date
  updatedAt: Date
  usageCount: number
  isStarred: boolean
  category: 'auth' | 'api' | 'database' | 'ui' | 'deployment' | 'other'
}

interface PlaybooksProps {
  isOpen: boolean
  onClose: () => void
  onInsert?: (content: string) => void
}

const mockPlaybooks: Playbook[] = [
  {
    id: '1',
    title: 'Xano Auth + Retries',
    description: 'Complete authentication setup with retry logic and error handling',
    content: `# Xano Authentication Setup

## 1. API Key Configuration
\`\`\`javascript
const API_KEY = process.env.XANO_API_KEY;
const BASE_URL = 'https://your-workspace.xano.app/api:your-api';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': \`Bearer \${API_KEY}\`
};
\`\`\`

## 2. Authentication Functions
\`\`\`javascript
async function authenticateUser(email, password) {
  try {
    const response = await fetch(\`\${BASE_URL}/auth/login\`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}
\`\`\`

## 3. Retry Logic
\`\`\`javascript
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
\`\`\``,
    tags: ['xano', 'auth', 'retry', 'api'],
    author: 'John Doe',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    usageCount: 42,
    isStarred: true,
    category: 'auth'
  },
  {
    id: '2',
    title: 'OpenAI API Integration',
    description: 'Streaming chat completions with proper error handling',
    content: `# OpenAI API Integration

## 1. Setup
\`\`\`javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
\`\`\`

## 2. Streaming Chat
\`\`\`javascript
async function streamChat(messages) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('OpenAI error:', error);
    throw error;
  }
}
\`\`\``,
    tags: ['openai', 'streaming', 'chat', 'api'],
    author: 'Jane Smith',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    usageCount: 28,
    isStarred: false,
    category: 'api'
  },
  {
    id: '3',
    title: 'Database Schema Migration',
    description: 'Safe database migrations with rollback support',
    content: `# Database Migration Pattern

## 1. Migration Structure
\`\`\`sql
-- Migration: 001_create_users_table.sql
BEGIN;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Rollback
-- DROP TABLE users;

COMMIT;
\`\`\`

## 2. Migration Runner
\`\`\`javascript
async function runMigration(migrationFile) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const sql = await fs.readFile(migrationFile, 'utf8');
    await client.query(sql);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
\`\`\``,
    tags: ['database', 'migration', 'sql', 'rollback'],
    author: 'Mike Johnson',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    usageCount: 15,
    isStarred: false,
    category: 'database'
  }
]

export function Playbooks({ isOpen, onClose, onInsert }: PlaybooksProps) {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(mockPlaybooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'name'>('recent')

  const categories = [
    { id: 'all', name: 'All', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'auth', name: 'Authentication', icon: <Zap className="w-4 h-4" /> },
    { id: 'api', name: 'API Integration', icon: <Code className="w-4 h-4" /> },
    { id: 'database', name: 'Database', icon: <Database className="w-4 h-4" /> },
    { id: 'ui', name: 'UI/UX', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'deployment', name: 'Deployment', icon: <Zap className="w-4 h-4" /> }
  ]

  const filteredPlaybooks = playbooks
    .filter(playbook => 
      (selectedCategory === 'all' || playbook.category === selectedCategory) &&
      (playbook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       playbook.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       playbook.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usageCount - a.usageCount
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

  const insertPlaybook = (playbook: Playbook) => {
    if (onInsert) {
      onInsert(playbook.content)
    }
    onClose()
  }

  const toggleStar = (playbookId: string) => {
    setPlaybooks(prev => 
      prev.map(p => 
        p.id === playbookId ? { ...p, isStarred: !p.isStarred } : p
      )
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 500, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-l bg-muted/30 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b bg-background">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Playbooks</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('create')}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {viewMode === 'list' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search playbooks..."
                    className="pl-10"
                  />
                </div>
                
                {/* Categories */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center space-x-2 whitespace-nowrap"
                    >
                      {category.icon}
                      <span>{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'list' && (
              <div className="p-6 space-y-4">
                {/* Sort Options */}
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {filteredPlaybooks.length} playbook{filteredPlaybooks.length !== 1 ? 's' : ''}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-sm border rounded-lg px-2 py-1 bg-background"
                    >
                      <option value="recent">Recent</option>
                      <option value="popular">Popular</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>

                {/* Playbooks List */}
                <div className="space-y-3">
                  {filteredPlaybooks.map((playbook) => (
                    <Card
                      key={playbook.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedPlaybook(playbook)
                        setViewMode('detail')
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-sm">{playbook.title}</h4>
                              {playbook.isStarred && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {playbook.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{playbook.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatRelativeTime(playbook.updatedAt)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Zap className="w-3 h-3" />
                                  <span>{playbook.usageCount} uses</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {playbook.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 text-xs bg-muted rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {playbook.tags.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{playbook.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'detail' && selectedPlaybook && (
              <div className="p-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="mb-4"
                >
                  ← Back to playbooks
                </Button>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{selectedPlaybook.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedPlaybook.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStar(selectedPlaybook.id)}
                      >
                        <Star className={cn(
                          "w-4 h-4",
                          selectedPlaybook.isStarred && "text-yellow-500 fill-current"
                        )} />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <Button onClick={() => insertPlaybook(selectedPlaybook)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Insert into Chat
                      </Button>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{selectedPlaybook.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated {formatRelativeTime(selectedPlaybook.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>{selectedPlaybook.usageCount} uses</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      {selectedPlaybook.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-muted rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Content</h4>
                    <Card>
                      <CardContent className="p-4">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {selectedPlaybook.content}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'create' && (
              <div className="p-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="mb-4"
                >
                  ← Back to playbooks
                </Button>

                <div className="space-y-4">
                  <h3 className="font-medium">Create New Playbook</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Enter playbook title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Input placeholder="Brief description of the playbook" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Content</label>
                      <textarea
                        className="w-full h-32 p-3 border rounded-2xl resize-none"
                        placeholder="Enter the playbook content (markdown supported)"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tags</label>
                      <Input placeholder="Enter tags separated by commas" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Create Playbook</Button>
                      <Button variant="outline">Save as Draft</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
