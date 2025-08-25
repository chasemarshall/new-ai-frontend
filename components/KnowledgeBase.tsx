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
  Globe,
  FileText,
  Database,
  Link,
  ExternalLink,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Copy,
  Tag
} from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface KbSource {
  id: string
  url: string
  title: string
  type: 'url' | 'pdf' | 'document'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  chunks: KbChunk[]
}

interface KbChunk {
  id: string
  title: string
  content: string
  url: string
  score?: number
}

interface KnowledgeBaseProps {
  isOpen: boolean
  onClose: () => void
}

const mockSources: KbSource[] = [
  {
    id: '1',
    url: 'https://docs.xano.com/docs/authentication',
    title: 'Xano Authentication Documentation',
    type: 'url',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    chunks: [
      {
        id: 'c1',
        title: 'API Authentication',
        content: 'Xano provides multiple authentication methods including API keys, JWT tokens, and OAuth...',
        url: 'https://docs.xano.com/docs/authentication#api-keys'
      },
      {
        id: 'c2',
        title: 'User Authentication',
        content: 'For user authentication, you can use email/password, social logins, or custom authentication...',
        url: 'https://docs.xano.com/docs/authentication#user-auth'
      }
    ]
  },
  {
    id: '2',
    url: 'https://openai.com/api/documentation',
    title: 'OpenAI API Documentation',
    type: 'url',
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    chunks: [
      {
        id: 'c3',
        title: 'Chat Completions',
        content: 'The chat completions API allows you to build conversational AI applications...',
        url: 'https://openai.com/api/documentation#chat-completions'
      }
    ]
  },
  {
    id: '3',
    url: 'project-requirements.pdf',
    title: 'Project Requirements Document',
    type: 'pdf',
    status: 'processing',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    chunks: []
  }
]

export function KnowledgeBase({ isOpen, onClose }: KnowledgeBaseProps) {
  const [sources, setSources] = useState<KbSource[]>(mockSources)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState<KbSource | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'add'>('list')
  const [newSourceUrl, setNewSourceUrl] = useState('')

  const filteredSources = sources.filter(source =>
    source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: KbSource['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: KbSource['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-500/10'
      case 'processing':
        return 'text-blue-500 bg-blue-500/10'
      case 'failed':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getTypeIcon = (type: KbSource['type']) => {
    switch (type) {
      case 'url':
        return <Globe className="w-4 h-4" />
      case 'pdf':
        return <FileText className="w-4 h-4" />
      case 'document':
        return <Database className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const addSource = () => {
    if (!newSourceUrl.trim()) return

    const newSource: KbSource = {
      id: Date.now().toString(),
      url: newSourceUrl,
      title: newSourceUrl,
      type: 'url',
      status: 'pending',
      createdAt: new Date(),
      chunks: []
    }

    setSources(prev => [newSource, ...prev])
    setNewSourceUrl('')
    setViewMode('list')
  }

  const searchKnowledgeBase = () => {
    // Simulate search with citations
    console.log('Searching knowledge base for:', searchTerm)
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
              <h2 className="text-lg font-semibold">Knowledge Base</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('add')}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {viewMode === 'list' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sources..."
                  className="pl-10"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'list' && (
              <div className="p-6 space-y-4">
                {/* Search Results */}
                {searchTerm && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Search Results</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {sources.flatMap(source => 
                            source.chunks
                              .filter(chunk => 
                                chunk.content.toLowerCase().includes(searchTerm.toLowerCase())
                              )
                              .map(chunk => (
                                <div key={chunk.id} className="border-l-2 border-primary/20 pl-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-sm">{chunk.title}</h4>
                                    <Button variant="ghost" size="sm">
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {chunk.content}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <Link className="w-3 h-3" />
                                    <span>{chunk.url}</span>
                                    <span>•</span>
                                    <span>Score: {chunk.score || 0.85}</span>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Sources */}
                <div>
                  <h3 className="font-medium mb-3">Sources</h3>
                  <div className="space-y-3">
                    {filteredSources.map((source) => (
                      <Card
                        key={source.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setSelectedSource(source)
                          setViewMode('detail')
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={cn(
                              "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
                              getStatusColor(source.status)
                            )}>
                              {getTypeIcon(source.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{source.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-muted-foreground truncate">
                                  {source.url}
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(source.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                {getStatusIcon(source.status)}
                                <span className="text-xs text-muted-foreground capitalize">
                                  {source.status}
                                </span>
                                {source.chunks.length > 0 && (
                                  <>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      {source.chunks.length} chunks
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'add' && (
              <div className="p-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="mb-4"
                >
                  ← Back to sources
                </Button>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Add Source</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">URL or File</label>
                        <Input
                          value={newSourceUrl}
                          onChange={(e) => setNewSourceUrl(e.target.value)}
                          placeholder="https://docs.example.com or upload a file"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button onClick={addSource} disabled={!newSourceUrl.trim()}>
                          Add Source
                        </Button>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Supported Sources</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Web pages and documentation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>PDF documents</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4" />
                        <span>Markdown and text files</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'detail' && selectedSource && (
              <div className="p-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="mb-4"
                >
                  ← Back to sources
                </Button>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center",
                        getStatusColor(selectedSource.status)
                      )}>
                        {getTypeIcon(selectedSource.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{selectedSource.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Added {formatRelativeTime(selectedSource.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <Button size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Source
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Content Chunks</h4>
                    <div className="space-y-3">
                      {selectedSource.chunks.map((chunk) => (
                        <Card key={chunk.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-sm">{chunk.title}</h5>
                              <Button variant="ghost" size="sm">
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {chunk.content}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Link className="w-3 h-3" />
                              <span>{chunk.url}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
