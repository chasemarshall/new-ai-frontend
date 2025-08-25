'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { 
  X, 
  FileText, 
  Code, 
  Database, 
  Plus, 
  Search,
  GitBranch,
  Clock,
  User,
  MoreVertical,
  Download,
  Copy,
  History,
  Tag,
  Star
} from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface Artifact {
  id: string
  name: string
  type: 'markdown' | 'code' | 'json' | 'binary'
  latestVersion: string
  updatedAt: Date
  versions: ArtifactVersion[]
}

interface ArtifactVersion {
  id: string
  number: number
  title: string
  summary: string
  createdAt: Date
  author: string
  isMain: boolean
  tags: string[]
}

interface ArtifactDrawerProps {
  isOpen: boolean
  onClose: () => void
  artifacts?: Artifact[]
}

const mockArtifacts: Artifact[] = [
  {
    id: '1',
    name: 'API Integration Guide',
    type: 'markdown',
    latestVersion: 'v3.2.1',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    versions: [
      {
        id: 'v1',
        number: 1,
        title: 'Initial API integration',
        summary: 'Basic authentication and endpoints',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        author: 'John Doe',
        isMain: true,
        tags: ['api', 'auth']
      },
      {
        id: 'v2',
        number: 2,
        title: 'Added retry logic',
        summary: 'Implemented exponential backoff',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        author: 'Jane Smith',
        isMain: false,
        tags: ['retry', 'resilience']
      },
      {
        id: 'v3',
        number: 3,
        title: 'Rate limiting support',
        summary: 'Added rate limiting and throttling',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        author: 'John Doe',
        isMain: false,
        tags: ['rate-limit', 'performance']
      }
    ]
  },
  {
    id: '2',
    name: 'Database Schema',
    type: 'code',
    latestVersion: 'v2.0.0',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    versions: [
      {
        id: 'v1',
        number: 1,
        title: 'Initial schema',
        summary: 'Basic user and project tables',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        author: 'Jane Smith',
        isMain: true,
        tags: ['database', 'schema']
      },
      {
        id: 'v2',
        number: 2,
        title: 'Added audit tables',
        summary: 'Audit logging and versioning',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        author: 'John Doe',
        isMain: false,
        tags: ['audit', 'logging']
      }
    ]
  }
]

export function ArtifactDrawer({ isOpen, onClose, artifacts = mockArtifacts }: ArtifactDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')

  const filteredArtifacts = artifacts.filter(artifact =>
    artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeIcon = (type: Artifact['type']) => {
    switch (type) {
      case 'markdown':
        return <FileText className="w-4 h-4" />
      case 'code':
        return <Code className="w-4 h-4" />
      case 'json':
        return <Database className="w-4 h-4" />
      case 'binary':
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: Artifact['type']) => {
    switch (type) {
      case 'markdown':
        return 'text-blue-500 bg-blue-500/10'
      case 'code':
        return 'text-green-500 bg-green-500/10'
      case 'json':
        return 'text-purple-500 bg-purple-500/10'
      case 'binary':
        return 'text-orange-500 bg-orange-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 400, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-l bg-muted/30 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b bg-background">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Artifacts</h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search artifacts..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'list' ? (
              <div className="p-6 space-y-3">
                {filteredArtifacts.map((artifact) => (
                  <Card
                    key={artifact.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedArtifact(artifact)
                      setViewMode('detail')
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
                          getTypeColor(artifact.type)
                        )}>
                          {getTypeIcon(artifact.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{artifact.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {artifact.latestVersion}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(artifact.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : selectedArtifact && (
              <div className="p-6">
                {/* Back button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="mb-4"
                >
                  ← Back to artifacts
                </Button>

                {/* Artifact header */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center",
                      getTypeColor(selectedArtifact.type)
                    )}>
                      {getTypeIcon(selectedArtifact.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{selectedArtifact.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedArtifact.latestVersion} • Updated {formatRelativeTime(selectedArtifact.updatedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </Button>
                  </div>
                </div>

                {/* Versions */}
                <div>
                  <h4 className="font-medium mb-3">Versions</h4>
                  <div className="space-y-2">
                    {selectedArtifact.versions.map((version) => (
                      <Card
                        key={version.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          version.isMain ? "ring-2 ring-primary/20 bg-primary/5" : "hover:bg-muted/50"
                        )}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-medium text-sm">{version.title}</h5>
                                {version.isMain && (
                                  <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                    Main
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {version.summary}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{version.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatRelativeTime(version.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {version.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-muted rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
