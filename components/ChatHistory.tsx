'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'
import { Input } from './Input'
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'

interface Chat {
  id: string
  title: string
  timestamp: Date
}

interface ChatHistoryProps {
  isOpen: boolean
  onClose: () => void
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  currentChatId?: string
}

const mockChats: Chat[] = [
  {
    id: '1',
    title: 'React Performance Optimization',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    title: 'CSS Grid Layout',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    title: 'Next.js App Router',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: '5',
    title: 'AI Integration Ideas',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  }
]

function formatTimestamp(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function ChatHistory({ isOpen, onClose, onSelectChat, onNewChat, currentChatId }: ChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)

  const filteredChats = mockChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isMinimized) {
    return (
      <motion.div
        initial={{ width: 320 }}
        animate={{ width: 60 }}
        className="border-r bg-card/50 backdrop-blur-sm flex flex-col"
      >
        <div className="p-3 border-b flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(false)}
            className="rounded-full bg-muted hover:bg-muted/70 shadow focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Expand chat history"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center space-y-2 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="rounded-full bg-muted hover:bg-muted/70 shadow focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="New chat"
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-muted hover:bg-muted/70 shadow focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Search chats"
            onClick={() => {}}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-2 border-t flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-muted hover:bg-muted/70 shadow focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Profile"
            onClick={() => {}}
          >
            <span className="font-bold text-primary">U</span>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 320 }}
      exit={{ width: 0 }}
      className="border-r bg-card/50 backdrop-blur-sm flex flex-col"
    >
      {/* Pills for New Chat and Search Chats */}
      <div className="flex flex-col gap-2 p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="rounded-full bg-muted hover:bg-muted/70 shadow focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Minimize chat history"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
        <Button
          onClick={onNewChat}
          className="w-full btn-pill text-base font-medium shadow hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary"
          size="lg"
        >
          New Chat
        </Button>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="btn-pill w-full px-4 py-3 text-base font-medium shadow hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto pt-4">
        <AnimatePresence>
          {filteredChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`chat-tile mx-4 mb-2 ${currentChatId === chat.id ? 'active' : ''} flex items-center gap-3 rounded-2xl px-4 py-3 bg-card hover:bg-muted/60 transition-colors duration-200 shadow focus-within:ring-2 focus-within:ring-primary cursor-pointer`}
              onClick={() => onSelectChat(chat.id)}
              tabIndex={0}
              style={{cursor: 'pointer'}}
            >
              <span className="font-medium text-base truncate flex-1">{chat.title}</span>
              <span className="text-xs text-muted-foreground min-w-[60px] text-right font-semibold">{formatTimestamp(chat.timestamp)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredChats.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chats found</p>
          </div>
        )}
      </div>
      {/* User Profile Button */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start btn-pill shadow hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => {
            // Handle user profile
          }}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
            {/* Replace with user avatar if available */}
            <span className="font-bold text-primary">U</span>
          </div>
          Profile & Settings
        </Button>
      </div>
    </motion.div>
  )
}
