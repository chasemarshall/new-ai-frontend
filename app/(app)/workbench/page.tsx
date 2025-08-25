'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card, CardContent } from '@/components/Card'
import { KeyboardShortcuts, useKeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { DiffViewer, useDiffViewer } from '@/components/DiffViewer'
import { ArtifactDrawer } from '@/components/ArtifactDrawer'
import { KnowledgeBase } from '@/components/KnowledgeBase'
import { Playbooks } from '@/components/Playbooks'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ChatHistory } from '@/components/ChatHistory'
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Code, 
  Database,
  Search,
  Plus,
  Sparkles,
  Zap,
  Clock,
  DollarSign,
  BookOpen,
  Menu,
  X,
  MessageSquare,
  Paperclip,
  Image,
  Globe,
  Brain
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
  tokens?: number
  cost?: number
}

interface Model {
  id: string
  name: string
  provider: string
  maxTokens: number
  costPer1kTokens: number
}

const models: Model[] = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', maxTokens: 8192, costPer1kTokens: 0.03 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', maxTokens: 4096, costPer1kTokens: 0.002 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', maxTokens: 200000, costPer1kTokens: 0.015 },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', maxTokens: 200000, costPer1kTokens: 0.003 },
]

const placeholders = [
  "Ask anything...",
  "You have the world's knowledge at your fingertips. Ask something.",
  "What would you like to know?",
  "I'm here to help. What's on your mind?"
]

type PanelType = 'model' | 'artifacts' | 'knowledge' | 'playbooks' | null

export default function WorkbenchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today? You can ask me anything, and I\'ll do my best to assist you.',
      timestamp: new Date(),
      model: 'gpt-4'
    }
  ])
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState<Model>(models[0])
  const [isLoading, setIsLoading] = useState(false)
  const [activePanel, setActivePanel] = useState<PanelType>(null)
  const [showChatHistory, setShowChatHistory] = useState(true)
  const [currentChatId, setCurrentChatId] = useState('current')
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [placeholderText, setPlaceholderText] = useState(placeholders[0])
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [bloomProgress, setBloomProgress] = useState(1)
  const [modelSearchQuery, setModelSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Keyboard shortcuts
  const { isOpen: isKeyboardOpen, setIsOpen: setKeyboardOpen } = useKeyboardShortcuts()
  const { isOpen: isDiffOpen, setIsOpen: setDiffOpen, showDiff, diffData } = useDiffViewer()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Placeholder rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Smooth left-to-right bloom for placeholder
  useEffect(() => {
    let interval: NodeJS.Timeout
    let bloomTimeout: NodeJS.Timeout
    let charIndex = 0
    let isCancelled = false

    function showPlaceholder(text: string) {
      setPlaceholderText(text)
      setBloomProgress(0)
      let progress = 0
      function animateBloom() {
        if (isCancelled) return
        progress += 0.05
        setBloomProgress(Math.min(progress, 1))
        if (progress < 1) {
          bloomTimeout = setTimeout(animateBloom, 16)
        }
      }
      animateBloom()
    }

    showPlaceholder(placeholders[currentPlaceholderIndex])
    interval = setInterval(() => {
      const nextIndex = (currentPlaceholderIndex + 1) % placeholders.length
      setCurrentPlaceholderIndex(nextIndex)
      showPlaceholder(placeholders[nextIndex])
    }, 9000)

    return () => {
      isCancelled = true
      clearTimeout(bloomTimeout)
      clearInterval(interval)
    }
  }, [currentPlaceholderIndex])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you said: "${input}". This is a simulated response from ${selectedModel.name}. In a real implementation, this would be an actual API call to the selected model with full context and capabilities.`,
        timestamp: new Date(),
        model: selectedModel.id,
        tokens: Math.floor(input.length / 4) + 50,
        cost: ((Math.floor(input.length / 4) + 50) * selectedModel.costPer1kTokens) / 1000
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        e.preventDefault()
        showDiff({
          leftContent: 'Original content here...\nThis is the old version.',
          rightContent: 'Modified content here...\nThis is the new version.',
          leftTitle: 'Version 1.0',
          rightTitle: 'Version 1.1',
          type: 'text'
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showDiff])

  const estimatedTokens = Math.floor(input.length / 4)
  const estimatedCost = (estimatedTokens * selectedModel.costPer1kTokens) / 1000

  const handleNewChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today? You can ask me anything, and I\'ll do my best to assist you.',
      timestamp: new Date(),
      model: 'gpt-4'
    }])
    setCurrentChatId('new-' + Date.now())
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    // In a real app, this would load the chat history
  }

  const openPanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
    model.provider.toLowerCase().includes(modelSearchQuery.toLowerCase())
  )

  return (
    <div className="chat-container">
      {/* Chat History Sidebar */}
      <AnimatePresence>
        {showChatHistory && (
          <ChatHistory
            isOpen={showChatHistory}
            onClose={() => setShowChatHistory(false)}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            currentChatId={currentChatId}
          />
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 sm:p-6 border-b bg-card/50 backdrop-blur-sm z-30 relative">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="sm:hidden"
            >
              {showChatHistory ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="hidden sm:flex"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <h1 className="mobile-heading font-semibold">AI Workbench</h1>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openPanel('model')}
              className="hidden sm:flex"
            >
              <Brain className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openPanel('artifacts')}
              className="hidden sm:flex"
            >
              <FileText className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openPanel('knowledge')}
              className="hidden sm:flex"
            >
              <Database className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openPanel('playbooks')}
              className="hidden sm:flex"
            >
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Model Switcher - Slides under navbar */}
        <AnimatePresence>
          {activePanel === 'model' && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="panel-container"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Model & Settings</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActivePanel(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={modelSearchQuery}
                    onChange={(e) => setModelSearchQuery(e.target.value)}
                    placeholder="Search models..."
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-3">
                  {filteredModels.map((model) => (
                    <Card
                      key={model.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        selectedModel.id === model.id
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        setSelectedModel(model)
                        setActivePanel(null)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{model.name}</h4>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {model.provider}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>{model.maxTokens.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>${model.costPer1kTokens}/1k</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="chat-messages">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-full sm:max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <Card className={`${message.role === 'user' ? 'message-user' : 'message-assistant'} max-w-full`}>
                    <CardContent className="p-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      
                      {message.model && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                            <span className="bg-muted px-2 py-1 rounded-full text-xs">
                              {message.model}
                            </span>
                            {message.tokens && (
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3" />
                                <span>{message.tokens} tokens</span>
                              </div>
                            )}
                            {message.cost && (
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-3 h-3" />
                                <span>${message.cost.toFixed(4)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-full sm:max-w-3xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <Card className="message-assistant">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Area - PROPER ROUNDED PILL */}
        <div className="floating-input-container">
          <div className="floating-input p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      className="pill-input w-full"
                      disabled={isLoading}
                      style={{height: '56px', minHeight: '56px', lineHeight: '1.5'}}
                    />
                    {(!isInputFocused && !input) && (
                      <span
                        className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none select-none text-muted-foreground transition-all duration-300"
                        style={{
                          fontWeight: 500,
                          fontSize: '1rem',
                          letterSpacing: '0.01em',
                          background: `linear-gradient(90deg, currentColor ${bloomProgress*100}%, transparent ${bloomProgress*100}%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          transition: 'background 0.5s cubic-bezier(.4,0,.2,1)'
                        }}
                      >
                        {placeholderText}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          // Handle file upload
                        }}
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          // Handle image upload
                        }}
                      >
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          // Handle web search
                        }}
                      >
                        <Globe className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {estimatedTokens} tokens
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        ${estimatedCost.toFixed(4)}
                      </span>
                      <span className="hidden sm:inline text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        ⌘K to search
                      </span>
                      <span className="hidden sm:inline text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        ⇧D for diff
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center h-[56px]">
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    loading={isLoading}
                    size="lg"
                    className="rounded-full h-12 w-12 p-0 flex-shrink-0 flex items-center justify-center"
                    style={{marginLeft: '0'}}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Panels - Push down from below navbar, always fully visible */}
      <AnimatePresence>
        {activePanel === 'artifacts' && (
          <motion.div
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -32, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="panel-container rounded-3xl mt-4 shadow-lg border border-border bg-card/95 flex flex-col w-full max-w-screen-sm right-0 left-auto overflow-y-auto"
            style={{top: '4.5rem', padding: '0 0 2rem 0', minWidth: 0, boxSizing: 'border-box'}}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b">
              <h3 className="text-lg font-semibold">Artifacts</h3>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-muted hover:bg-muted/70 shadow focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setActivePanel(null)}
                aria-label="Close Artifacts"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 min-w-0">
              <ArtifactDrawer 
                isOpen={activePanel === 'artifacts'} 
                onClose={() => setActivePanel(null)} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'knowledge' && (
          <motion.div
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -32, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="panel-container rounded-3xl mt-4 shadow-lg border border-border bg-card/95 flex flex-col w-full max-w-screen-sm right-0 left-auto overflow-y-auto"
            style={{top: '4.5rem', padding: '0 0 2rem 0', minWidth: 0, boxSizing: 'border-box'}}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b">
              <h3 className="text-lg font-semibold">Knowledge Base</h3>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-muted hover:bg-muted/70 shadow focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setActivePanel(null)}
                aria-label="Close Knowledge Base"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 min-w-0">
              <KnowledgeBase 
                isOpen={activePanel === 'knowledge'} 
                onClose={() => setActivePanel(null)} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'playbooks' && (
          <motion.div
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -32, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="panel-container rounded-3xl mt-4 shadow-lg border border-border bg-card/95 flex flex-col w-full max-w-screen-sm right-0 left-auto overflow-y-auto"
            style={{top: '4.5rem', padding: '0 0 2rem 0', minWidth: 0, boxSizing: 'border-box'}}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b">
              <h3 className="text-lg font-semibold">Playbooks</h3>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-muted hover:bg-muted/70 shadow focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setActivePanel(null)}
                aria-label="Close Playbooks"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 min-w-0">
              <Playbooks 
                isOpen={activePanel === 'playbooks'} 
                onClose={() => setActivePanel(null)}
                onInsert={(content) => {
                  setInput(content)
                  setActivePanel(null)
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Components */}
      <KeyboardShortcuts 
        isOpen={isKeyboardOpen} 
        onClose={() => setKeyboardOpen(false)} 
      />
      <DiffViewer 
        isOpen={isDiffOpen} 
        onClose={() => setDiffOpen(false)}
        leftContent={diffData.leftContent}
        rightContent={diffData.rightContent}
        leftTitle={diffData.leftTitle}
        rightTitle={diffData.rightTitle}
        type={diffData.type}
      />
    </div>
  )
}
