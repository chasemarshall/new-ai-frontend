'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { 
  X, 
  FileText, 
  Code, 
  GitBranch, 
  Clock, 
  User,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Copy,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DiffViewerProps {
  isOpen: boolean
  onClose: () => void
  leftContent?: string
  rightContent?: string
  leftTitle?: string
  rightTitle?: string
  type?: 'text' | 'json' | 'code'
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  lineNumber?: number
}

export function DiffViewer({ 
  isOpen, 
  onClose, 
  leftContent = '', 
  rightContent = '', 
  leftTitle = 'Original',
  rightTitle = 'Modified',
  type = 'text'
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')
  const [showLineNumbers, setShowLineNumbers] = useState(true)

  // Simple diff algorithm (in production, use a proper diff library)
  const computeDiff = (left: string, right: string): DiffLine[] => {
    const leftLines = left.split('\n')
    const rightLines = right.split('\n')
    const diff: DiffLine[] = []
    
    const maxLines = Math.max(leftLines.length, rightLines.length)
    
    for (let i = 0; i < maxLines; i++) {
      const leftLine = leftLines[i] || ''
      const rightLine = rightLines[i] || ''
      
      if (leftLine === rightLine) {
        diff.push({ type: 'unchanged', content: leftLine, lineNumber: i + 1 })
      } else {
        if (leftLine) {
          diff.push({ type: 'removed', content: leftLine, lineNumber: i + 1 })
        }
        if (rightLine) {
          diff.push({ type: 'added', content: rightLine, lineNumber: i + 1 })
        }
      }
    }
    
    return diff
  }

  const diffLines = computeDiff(leftContent, rightContent)

  const getLineClass = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-500/10 border-l-2 border-green-500'
      case 'removed':
        return 'bg-red-500/10 border-l-2 border-red-500'
      default:
        return ''
    }
  }

  const getLineIcon = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'removed':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />
    }
  }

  const copyDiff = () => {
    const diffText = diffLines
      .map(line => `${line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} ${line.content}`)
      .join('\n')
    navigator.clipboard.writeText(diffText)
  }

  const downloadDiff = () => {
    const diffText = diffLines
      .map(line => `${line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} ${line.content}`)
      .join('\n')
    const blob = new Blob([diffText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diff.patch'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-7xl h-[80vh] bg-background rounded-3xl border shadow-soft-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-500/10">
                  <GitBranch className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Diff Viewer</h2>
                  <p className="text-sm text-muted-foreground">
                    Compare versions and changes
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'split' ? 'unified' : 'split')}
                >
                  {viewMode === 'split' ? 'Unified' : 'Split'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLineNumbers(!showLineNumbers)}
                >
                  {showLineNumbers ? 'Hide' : 'Show'} Lines
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyDiff}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadDiff}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Diff Content */}
            <div className="flex-1 overflow-hidden">
              {viewMode === 'split' ? (
                <div className="grid grid-cols-2 h-full">
                  {/* Left Panel */}
                  <div className="border-r">
                    <div className="p-4 border-b bg-muted/30">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{leftTitle}</span>
                      </div>
                    </div>
                    <div className="h-full overflow-auto">
                      <pre className="p-4 font-mono text-sm">
                        {leftContent.split('\n').map((line, index) => (
                          <div
                            key={index}
                            className={cn(
                              'flex items-start space-x-2 py-0.5',
                              showLineNumbers && 'pl-8'
                            )}
                          >
                            {showLineNumbers && (
                              <span className="text-muted-foreground text-xs select-none w-8 text-right">
                                {index + 1}
                              </span>
                            )}
                            <span className="flex-1">{line || ' '}</span>
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>

                  {/* Right Panel */}
                  <div>
                    <div className="p-4 border-b bg-muted/30">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{rightTitle}</span>
                      </div>
                    </div>
                    <div className="h-full overflow-auto">
                      <pre className="p-4 font-mono text-sm">
                        {rightContent.split('\n').map((line, index) => (
                          <div
                            key={index}
                            className={cn(
                              'flex items-start space-x-2 py-0.5',
                              showLineNumbers && 'pl-8'
                            )}
                          >
                            {showLineNumbers && (
                              <span className="text-muted-foreground text-xs select-none w-8 text-right">
                                {index + 1}
                              </span>
                            )}
                            <span className="flex-1">{line || ' '}</span>
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <div className="p-4">
                    <pre className="font-mono text-sm">
                      {diffLines.map((line, index) => (
                        <div
                          key={index}
                          className={cn(
                            'flex items-start space-x-2 py-0.5',
                            getLineClass(line.type),
                            showLineNumbers && 'pl-8'
                          )}
                        >
                          {showLineNumbers && (
                            <span className="text-muted-foreground text-xs select-none w-8 text-right">
                              {line.lineNumber}
                            </span>
                          )}
                          <span className="flex-shrink-0 mt-1">
                            {getLineIcon(line.type)}
                          </span>
                          <span className="flex-1">{line.content || ' '}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/30 rounded-b-3xl">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>{diffLines.filter(l => l.type === 'added').length} additions</span>
                  <span>{diffLines.filter(l => l.type === 'removed').length} deletions</span>
                  <span>{diffLines.filter(l => l.type === 'unchanged').length} unchanged</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Press ⇧D to toggle</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Global diff viewer hook
export function useDiffViewer() {
  const [isOpen, setIsOpen] = useState(false)
  const [diffData, setDiffData] = useState<{
    leftContent: string
    rightContent: string
    leftTitle: string
    rightTitle: string
    type: 'text' | 'json' | 'code'
  }>({
    leftContent: '',
    rightContent: '',
    leftTitle: 'Original',
    rightTitle: 'Modified',
    type: 'text'
  })

  const showDiff = (data: typeof diffData) => {
    setDiffData(data)
    setIsOpen(true)
  }

  return { isOpen, setIsOpen, diffData, showDiff }
}
