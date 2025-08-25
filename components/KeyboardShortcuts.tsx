'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Command } from 'cmdk'
import { Button } from './Button'
import { 
  Search, 
  FileText, 
  Code, 
  Database, 
  Settings, 
  Bot, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  Command as CommandIcon
} from 'lucide-react'

interface ShortcutItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  shortcut?: string
}

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const shortcuts: ShortcutItem[] = [
    {
      id: 'new-chat',
      title: 'New Chat',
      description: 'Start a new conversation',
      icon: <Bot className="w-4 h-4" />,
      action: () => {
        console.log('New chat')
        onClose()
      },
      shortcut: '⌘N'
    },
    {
      id: 'search-artifacts',
      title: 'Search Artifacts',
      description: 'Find artifacts and versions',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        console.log('Search artifacts')
        onClose()
      },
      shortcut: '⌘A'
    },
    {
      id: 'search-code',
      title: 'Search Code',
      description: 'Search through code snippets',
      icon: <Code className="w-4 h-4" />,
      action: () => {
        console.log('Search code')
        onClose()
      },
      shortcut: '⌘C'
    },
    {
      id: 'search-kb',
      title: 'Search Knowledge Base',
      description: 'Search knowledge base sources',
      icon: <Database className="w-4 h-4" />,
      action: () => {
        console.log('Search KB')
        onClose()
      },
      shortcut: '⌘K'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Open application settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => {
        console.log('Settings')
        onClose()
      },
      shortcut: '⌘,'
    },
    {
      id: 'diff-view',
      title: 'Diff View',
      description: 'Compare versions and changes',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => {
        console.log('Diff view')
        onClose()
      },
      shortcut: '⇧D'
    }
  ]

  const filteredShortcuts = shortcuts.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredShortcuts.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredShortcuts.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredShortcuts[selectedIndex]) {
            filteredShortcuts[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredShortcuts, selectedIndex, onClose])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-2xl mx-4 bg-background rounded-3xl border shadow-soft-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10">
                  <CommandIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">Command Palette</h2>
                  <p className="text-sm text-muted-foreground">
                    Search and execute commands
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                {filteredShortcuts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center space-x-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      index === selectedIndex
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={item.action}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                    {item.shortcut && (
                      <div className="flex-shrink-0">
                        <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded-lg">
                          {item.shortcut}
                        </kbd>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {filteredShortcuts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No commands found</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-muted/30 rounded-b-3xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>↑↓ to navigate</span>
                  <span>↵ to select</span>
                  <span>esc to close</span>
                </div>
                <span>{filteredShortcuts.length} commands</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Global keyboard shortcut hook
export function useKeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { isOpen, setIsOpen }
}
