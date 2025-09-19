import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Plus, 
  Pin, 
  Archive, 
  ArchiveRestore,
  Edit3,
  Send,
  Search,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Hash,
  User,
  Copy,
  Reply,
  Trash2,
  X
} from 'lucide-react'
import './ConversationPage.css'
import { apiPath } from '../config'
import api from '../services/chatService'
import echoService from '../services/echo'
import { testApiConnection, testAuthenticatedEndpoint } from '../utils/apiTest'

// Shared helper: normalize backend response and perform user search
const normalizeUserList = (res) => {
  return res && res.data ? res.data : (Array.isArray(res) ? res : [])
}

const performUserSearch = async (token, q) => {
  if (!q || q.length < 2) return []
  try {
    const res = await api.searchUsers(q)
    return normalizeUserList(res)
  } catch (err) {
    console.error('performUserSearch failed', err)
    return []
  }
}

function Sidebar({ conversations, onSelect, selectedId, onCreate, onPin, onUnpin, onArchive, onUnarchive }) {
  const [open, setOpen] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  console.log('Sidebar received conversations:', conversations.map(c => ({id: c.id, name: c.name, pinned: c.pinned, archived: c.archieved})))
  
  // Separate active and archived conversations
  const activeConversations = conversations.filter(c => !c.archieved)
  const archivedConversations = conversations.filter(c => c.archieved)
  
  // Filter conversations based on search query
  const filteredActiveConversations = activeConversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Sort active conversations: pinned first, then by updated_at or id
  const sortedActiveConversations = [...filteredActiveConversations].sort((a, b) => {
    // Convert null to false for comparison
    const aPinned = Boolean(a.pinned)
    const bPinned = Boolean(b.pinned)
    
    if (aPinned && !bPinned) return -1
    if (!aPinned && bPinned) return 1
    return 0 // Keep original order for same pin status
  })
  
  console.log('Sidebar sorted active conversations:', sortedActiveConversations.map(c => ({id: c.id, name: c.name, pinned: c.pinned})))
  
  return (
    <motion.aside 
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="modern-sidebar"
    >
      <div className="sidebar-header">
        <div className="sidebar-title">
          <MessageCircle className="sidebar-icon" />
          <h2>Conversations</h2>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-create"
          onClick={() => setOpen(s => !s)}
        >
          <Plus size={16} />
          {open ? 'Cancel' : 'New'}
        </motion.button>
      </div>

      <div className="search-section">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NewConversationForm onCreate={onCreate} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="conversations-section">
        <AnimatePresence>
          {sortedActiveConversations.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`conversation-item ${selectedId === c.id ? 'active' : ''} ${c.pinned ? 'pinned' : ''}`}
              onClick={() => onSelect(c)}
            >
              <div className="conversation-content">
                <div className="conversation-avatar">
                  {c.type === 'group' ? <Users size={18} /> : <User size={18} />}
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">
                    {c.pinned && <Pin size={14} className="pin-indicator" />}
                    {c.name}
                    {c.type === 'private' && (
                      <User size={12} className="conversation-type-icon private" title="Private conversation" />
                    )}
                    {c.type === 'group' && (
                      <Users size={12} className="conversation-type-icon group" title="Group conversation" />
                    )}
                  </div>
                  <div className="conversation-meta">
                    {c.last_message ? (
                      <span className="last-message">
                        {c.last_message.content && c.last_message.content.length > 40 
                          ? c.last_message.content.slice(0, 40) + '...'
                          : c.last_message.content || 'No content'
                        }
                      </span>
                    ) : (
                      <span className="no-message-placeholder">
                        No messages yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="conversation-actions">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`action-btn pin-btn ${c.pinned ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('🔘 Pin button clicked for conv:', c.id, 'current pinned status:', c.pinned)
                    c.pinned ? onUnpin(c.id) : onPin(c.id)
                  }}
                  title={c.pinned ? 'Unpin conversation' : 'Pin conversation'}
                >
                  <Pin size={14} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="action-btn archive-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Archive this conversation?')) {
                      onArchive(c.id)
                    }
                  }}
                  title="Archive conversation"
                >
                  <Archive size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {archivedConversations.length > 0 && (
        <div className="archived-section">
          <motion.div 
            className="archived-header" 
            onClick={() => setShowArchived(!showArchived)}
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
          >
            <div className="archived-title">
              {showArchived ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Archive size={16} />
              <span>Archived ({archivedConversations.length})</span>
            </div>
          </motion.div>
          <AnimatePresence>
            {showArchived && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="archived-list"
              >
                {archivedConversations.map((c, index) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`conversation-item archived ${selectedId === c.id ? 'active' : ''}`}
                    onClick={() => onSelect(c)}
                  >
                    <div className="conversation-content">
                      <div className="conversation-avatar archived">
                        <Archive size={16} />
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-name">{c.name}</div>
                        <div className="conversation-meta">
                          <span className="archived-label">Archived</span>
                        </div>
                      </div>
                    </div>
                    <div className="conversation-actions">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="action-btn restore-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm('Unarchive this conversation?')) {
                            onUnarchive(c.id)
                          }
                        }}
                        title="Unarchive conversation"
                      >
                        <ArchiveRestore size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.aside>
  )
}

function NewConversationForm({ onCreate }) {
  const [name, setName] = useState('')
  const [backendErrors, setBackendErrors] = useState({})
  const [nameError, setNameError] = useState('')
  const [type, setType] = useState('private')
  const [usersRaw, setUsersRaw] = useState('')
  const [isGroup, setIsGroup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  const submit = async (e) => {
    e.preventDefault()
    // client-side validation for group name (derived from usersRaw)
    if (isGroup && !name.trim()) {
      setNameError('Group name is required')
      return
    }
    setLoading(true)
    try {
      await onCreate({ name, type, users_raw: usersRaw })
      setName('')
      setNameError('')
      setUsersRaw('')
      setBackendErrors({})
    } catch (err) {
      console.error(err)
      // Laravel returns 422 with { message, errors }
      if (err.status === 422 && err.body && err.body.errors) {
        setBackendErrors(err.body.errors)
      } else if (err.body && err.body.message) {
        alert(err.body.message)
      } else {
        alert('Failed to create conversation')
      }
    } finally { setLoading(false) }
  }

  // Helper: extract the current query (text after last comma)
  const currentQuery = (value) => {
    const parts = value.split(',')
    return parts[parts.length - 1].trim()
  }

  // perform search (used by debounced effect and onFocus)
  const doSearch = async (q) => {
    setSearching(true)
    try {
      const list = await performUserSearch(token, q)
      setSuggestions(list)
      setShowSuggestions(list.length > 0)
    } finally {
      setSearching(false)
    }
  }

  // Debounced search when the users input changes
  useEffect(() => {
    const q = currentQuery(usersRaw)
    const id = setTimeout(() => { doSearch(q) }, 300)
    return () => clearTimeout(id)
  }, [usersRaw, token])

  // determine if this should be a group based on number of usernames entered
  useEffect(() => {
    const parts = usersRaw.split(',').map(p => p.trim()).filter(Boolean)
    const group = parts.length > 1
    setIsGroup(group)
    // always set type based on users list: group if >1, otherwise private
    setType(group ? 'group' : 'private')
    if (!group) {
      setNameError('')
      setBackendErrors(prev => { const copy = { ...prev }; delete copy.name; return copy })
    }
  }, [usersRaw])

  const applySuggestion = (username) => {
    // replace the last segment with the selected username and add a trailing comma+space
    const parts = usersRaw.split(',')
    parts[parts.length - 1] = ` ${username}`
    const newVal = parts.map(p => p.trim()).filter(Boolean).join(', ') + ', '
    setUsersRaw(newVal)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="new-conversation-form"
    >
      <div className="form-header">
        <MessageCircle size={18} />
        <span>Create New Conversation</span>
      </div>

      <form onSubmit={submit} className="form-content">
        {isGroup && (
          <div className="form-group">
            <div className="group-badge">
              <Users size={14} />
              <span>Group Chat</span>
            </div>
          </div>
        )}

        {isGroup && (
          <div className="form-group">
            <input
              placeholder="Enter group name"
              value={name}
              onChange={e => { 
                setName(e.target.value); 
                if (nameError) setNameError(''); 
                if (backendErrors.name) setBackendErrors(prev => { 
                  const copy = { ...prev }; 
                  delete copy.name; 
                  return copy 
                }) 
              }}
              className={`form-input ${nameError || backendErrors.name ? 'error' : ''}`}
              aria-invalid={!!nameError || !!backendErrors.name}
            />
            {nameError && <div className="field-error">{nameError}</div>}
            {backendErrors.name && <div className="field-error">{backendErrors.name.join(' ')}</div>}
          </div>
        )}

        <div className="form-group">
          <div className="input-wrapper">
            <Search className="input-icon" size={16} />
            <input
              placeholder="Search and add users (comma separated)"
              value={usersRaw}
              onChange={e => { 
                setUsersRaw(e.target.value); 
                if (backendErrors.users_raw) setBackendErrors(prev => { 
                  const copy = { ...prev }; 
                  delete copy.users_raw; 
                  return copy 
                }) 
              }}
              onFocus={() => { 
                const q = currentQuery(usersRaw); 
                if (q.length >= 2) doSearch(q); 
                else if (suggestions.length) setShowSuggestions(true) 
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className={`form-input ${backendErrors.users_raw ? 'error' : ''}`}
            />
            {searching && (
              <div className="search-loading">
                <div className="spinner"></div>
              </div>
            )}
          </div>
          {backendErrors.users_raw && <div className="field-error">{backendErrors.users_raw.join(' ')}</div>}
          
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="user-suggestions"
              >
                {suggestions.map(u => (
                  <motion.div
                    key={u.id}
                    whileHover={{ backgroundColor: 'var(--primary-50)' }}
                    className="suggestion-item"
                    onMouseDown={() => applySuggestion(u.username)}
                  >
                    <div className="suggestion-avatar">
                      <User size={16} />
                    </div>
                    <div className="suggestion-info">
                      <div className="suggestion-username">{u.username}</div>
                      <div className="suggestion-name">{u.name}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          type="submit" 
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="btn-submit"
        >
          {loading ? (
            <>
              <div className="spinner small"></div>
              Creating...
            </>
          ) : (
            <>
              <Plus size={16} />
              Create Conversation
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

function EditableConversationName({ conversation, onUpdateName }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(conversation.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setName(conversation.name)
  }, [conversation.name])

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty')
      return
    }
    if (name.trim() === conversation.name) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      await onUpdateName(conversation.id, name.trim())
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update name', err)
      if (err.body && err.body.message) {
        setError(err.body.message)
      } else {
        setError('Failed to update conversation name')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setName(conversation.name)
    setIsEditing(false)
    setError('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (conversation.type !== 'group') {
    return (
      <div className="conversation-title">
        <h2>{conversation.name}</h2>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="editable-name editing">
        <div className="edit-input-wrapper">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            disabled={loading}
            maxLength={250}
            className={`edit-input ${error ? 'error' : ''}`}
            autoFocus
          />
          {loading && (
            <div className="edit-loading">
              <div className="spinner small"></div>
            </div>
          )}
        </div>
        {error && <div className="edit-error">{error}</div>}
      </div>
    )
  }

  return (
    <motion.div 
      className="editable-name"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
    >
      <h2 
        onClick={() => setIsEditing(true)}
        className="editable-title"
        title="Click to edit conversation name"
      >
        {conversation.name}
        <Edit3 size={16} className="edit-icon" />
      </h2>
    </motion.div>
  )
}

function ChatPane({ conversation, currentUser, onLeave, onAddUser, onUpdateName, onPin, onUnpin, onArchive, onUnarchive }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [messagesError, setMessagesError] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editingContent, setEditingContent] = useState('')
  const [editingMessage, setEditingMessage] = useState(false)
  const [contextMenu, setContextMenu] = useState(null) // For right-click menu
  const [replyToMessage, setReplyToMessage] = useState(null) // For reply functionality
  const [deletingMessage, setDeletingMessage] = useState(false) // For delete loading state
  const [copiedMessageId, setCopiedMessageId] = useState(null) // For copy feedback
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  // Auto-resize edit textarea when content changes
  useEffect(() => {
    if (editingMessageId && editingContent) {
      const textarea = document.querySelector('.edit-message-input')
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'
      }
    }
  }, [editingMessageId, editingContent])

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversation || !conversation.id || !token) {
      setMessages([])
      return
    }

    const loadMessages = async () => {
      console.log('📥 Loading messages for conversation:', conversation.id)
      setLoadingMessages(true)
      setMessagesError('')
      try {
        const response = await api.getMessages(conversation.id)
        console.log('📨 Messages API response:', response)
        
        if (response.success && response.data) {
          // The API returns messages directly in response.data (Array), not response.data.messages
          const messages = Array.isArray(response.data) ? response.data : (response.data.messages || [])
          console.log('✅ Loaded messages:', messages.length, 'messages')
          
          // Add edit/delete permissions to messages
          const messagesWithPermissions = messages.map(msg => {
            console.log('📝 Message loaded:', { 
              id: msg.id, 
              content: msg.content?.substring(0, 50) + '...', 
              is_edited: msg.is_edited,
              created_at: msg.created_at,
              updated_at: msg.updated_at
            })
            
            return {
              ...msg,
              canEditOrDelete: currentUser && String(currentUser.id) === String(msg.user_id)
            }
          })
          
          setMessages(messagesWithPermissions)
        } else {
          console.warn('❌ No messages data in response:', response)
          setMessages([])
        }
      } catch (err) {
        console.error('❌ Failed to load messages:', err)
        setMessagesError('Failed to load messages')
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }

    loadMessages()
  }, [conversation?.id, token])

  // Real-time subscriptions: message.sent and message.updated
  useEffect(() => {
    let unsubscribed = false
    if (!conversation || !conversation.id) return

    const handlers = {
      sent: (payload) => {
        try {
          console.log('📡 Received message.sent payload:', payload)
          const incoming = payload.message || payload
          // Add canEditOrDelete flag
          incoming.canEditOrDelete = currentUser && String(currentUser.id) === String(incoming.user_id)

          setMessages(prev => {
            // If message already exists (by id), ignore
            if (prev.some(m => String(m.id) === String(incoming.id))) return prev
            return [...prev, incoming]
          })
        } catch (err) {
          console.error('Error handling message.sent', err)
        }
      },
      updated: (payload) => {
        try {
          console.log('📡 Received message.updated payload:', payload)
          const incoming = payload.message || payload
          setMessages(prev => prev.map(m => String(m.id) === String(incoming.id) ? { ...m, ...incoming } : m))
        } catch (err) {
          console.error('Error handling message.updated', err)
        }
      }
    }

    // Subscribe using echo service (guarded)
    const canSubscribe = echoService && typeof echoService.subscribeConversation === 'function'

    if (canSubscribe) {
      (async () => {
        try {
          const ch = await echoService.subscribeConversation(conversation.id, handlers)
          if (!ch) {
            console.warn('Live subscription unavailable, falling back to polling')
            // Optionally: fetch messages to ensure we're up-to-date
            try {
              const res = await api.getMessages(conversation.id)
              if (res && res.success && res.data) {
                const msgs = Array.isArray(res.data) ? res.data : (res.data.messages || [])
                setMessages(msgs.map(m => ({ ...m, canEditOrDelete: currentUser && String(currentUser.id) === String(m.user_id) })))
              }
            } catch (err) {
              console.error('Failed fallback refresh after subscribe failure', err)
            }
          }
        } catch (err) {
          console.error('Error during subscribeConversation:', err)
        }
      })()
    } else {
      console.warn('echoService.subscribeConversation not available; skipping live subscription')
    }

    return () => {
      if (!conversation || !conversation.id) return
      try {
        if (echoService && typeof echoService.unsubscribeConversation === 'function') {
          echoService.unsubscribeConversation(conversation.id)
        } else {
          console.warn('echoService.unsubscribeConversation not available; nothing to cleanup')
        }
      } catch (err) {
        console.error('Error during unsubscribeConversation cleanup', err)
      }
      unsubscribed = true
    }
  }, [conversation?.id, currentUser?.id])

  // Auto-scroll to bottom when messages change (only if user is near bottom)
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container && messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      
      if (isNearBottom || messages.some(msg => msg.sending)) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Debug functionality
  const runApiTests = async () => {
    console.log('=== API Connectivity Tests ===')
    
    // Test 1: Basic connectivity
    const healthTest = await testApiConnection()
    console.log('Health test result:', healthTest)
    
    // Test 2: Authentication
    const authTest = await testAuthenticatedEndpoint()
    console.log('Auth test result:', authTest)
    
    // Test 3: Check current config
    console.log('Current API base:', apiPath())
    console.log('Current token exists:', !!(localStorage.getItem('token') || sessionStorage.getItem('token')))
    
    // Test 4: Test message endpoints if conversation is selected
    if (selected?.id) {
      console.log('=== Testing Message Endpoints ===')
      try {
        const messagesResponse = await api.getMessages(selected.id)
        console.log('Messages test result:', messagesResponse)
      } catch (err) {
        console.error('Messages test failed:', err)
      }
    }
    
    alert(`API Tests Complete!\nCheck console for details.\n\nHealth: ${healthTest.success}\nAuth: ${authTest.success}`)
  }

  const debugRefreshMessages = async () => {
    if (!selected?.id) {
      alert('No conversation selected')
      return
    }
    
    console.log('🔄 Debug: Manually refreshing messages...')
    try {
      const response = await api.getMessages(selected.id)
      console.log('Debug refresh response:', response)
      if (response.success && response.data) {
        setMessages(response.data.messages || [])
        alert(`Refreshed ${response.data.messages?.length || 0} messages`)
      }
    } catch (err) {
      console.error('Debug refresh failed:', err)
      alert('Failed to refresh messages: ' + err.message)
    }
  }

  // Keyboard shortcut for debug panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        setShowDebugPanel(prev => !prev)
      }
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault()
        runApiTests()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim() || conversation.archieved || !conversation?.id || sendingMessage) return
    
    const messageContent = message.trim()
    console.log('📤 Sending message:', {
      content: messageContent,
      conversationId: conversation.id,
      userId: currentUser?.id,
      replyToMessageId: replyToMessage?.id
    })
    
    setMessage('') // Clear input immediately for better UX
    setReplyToMessage(null) // Clear reply state
    setSendingMessage(true)
    
    // Add optimistic message to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      user_id: currentUser?.id,
      user: currentUser,
      created_at: new Date().toISOString(),
      is_ai_response: false,
      is_read: false,
      is_edited: false,
      sending: true, // Flag to show loading state
      canEditOrDelete: true, // User can edit their own messages
      reply_to_message_id: replyToMessage?.id || null,
      reply_to_message: replyToMessage || null
    }
    
    console.log('➕ Adding optimistic message:', optimisticMessage)
    setMessages(prev => [...prev, optimisticMessage])
    
    try {
      console.log('🔄 Making API call to send message...')
      
      // Prepare message data for API
      const messageData = { content: messageContent }
      if (replyToMessage) {
        messageData.reply_to_message_id = replyToMessage.id
      }
      
      const response = await api.sendMessage(conversation.id, messageData)
      console.log('📥 Send message API response:', response)
      
      if (response.success && response.data) {
        console.log('✅ Message sent successfully, replacing optimistic message with:', response.data)
        // Replace optimistic message with real message from server
        setMessages(prev => prev.map(msg => 
          msg.id === optimisticMessage.id ? {
            ...response.data,
            canEditOrDelete: currentUser && response.data.user_id === currentUser.id
          } : msg
        ))
        
        // Optional: Reload messages to ensure sync with backend
        console.log('🔄 Reloading messages to verify persistence...')
        setTimeout(async () => {
          try {
            const refreshResponse = await api.getMessages(conversation.id)
            if (refreshResponse.success && refreshResponse.data) {
              const refreshedMessages = Array.isArray(refreshResponse.data) ? refreshResponse.data : (refreshResponse.data.messages || [])
              console.log('🔄 Refreshed messages after send:', refreshedMessages.length)
            }
          } catch (err) {
            console.error('Failed to refresh messages:', err)
          }
        }, 1000) // Wait 1 second then refresh
        
      } else {
        console.error('❌ Send message failed - no success/data in response:', response)
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
        setMessage(messageContent) // Restore message in input
        if (replyToMessage) {
          setReplyToMessage(replyToMessage) // Restore reply state
        }
      }
    } catch (err) {
      console.error('❌ Failed to send message:', err)
      // Remove optimistic message and restore input
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
      setMessage(messageContent)
      if (replyToMessage) {
        setReplyToMessage(replyToMessage) // Restore reply state
      }
      // You could show an error toast here
    } finally {
      setSendingMessage(false)
    }
  }

  const handleEditMessage = (msg) => {
    console.log('✏️ Starting edit for message:', msg.id, 'Content:', msg.content)
    console.log('📝 Message object:', msg)
    
    // Set editing state
    setEditingMessageId(msg.id)
    setEditingContent(msg.content || '')
    
    // Auto-resize the textarea after content is set
    setTimeout(() => {
      const textarea = document.querySelector('.edit-message-input')
      if (textarea) {
        console.log('📏 Auto-resizing textarea with content:', msg.content)
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'
        textarea.focus() // Focus the textarea for immediate editing
      }
    }, 100) // Increased timeout to ensure DOM is updated
  }

  const handleCancelEdit = () => {
    console.log('❌ Cancelling edit')
    setEditingMessageId(null)
    setEditingContent('')
  }

  const handleSaveEdit = async () => {
    if (!editingContent.trim() || !editingMessageId || editingMessage) {
      console.log('❌ Cannot save edit:', { 
        hasContent: !!editingContent.trim(), 
        hasMessageId: !!editingMessageId, 
        isEditing: editingMessage 
      })
      return
    }
    
    const newContent = editingContent.trim()
    const originalMessage = messages.find(m => m.id === editingMessageId)
    
    // Check if content actually changed
    if (originalMessage && originalMessage.content === newContent) {
      console.log('� No changes detected, cancelling edit')
      setEditingMessageId(null)
      setEditingContent('')
      return
    }
    
    console.log('�💾 Saving edit for message:', editingMessageId)
    console.log('📝 Original content:', originalMessage?.content)
    console.log('📝 New content:', newContent)
    
    setEditingMessage(true)
    
    try {
      const response = await api.editMessage(conversation.id, editingMessageId, newContent)
      console.log('📥 Edit message API response:', response)
      
      if (response && (response.success === true || response.status === 'success' || response.data)) {
        console.log('✅ Message edited successfully')
        
        // Update the message with the new content and ensure edited status
        setMessages(prev => prev.map(msg => {
          if (msg.id === editingMessageId) {
            const updatedMessage = { 
              ...msg, 
              content: newContent,
              is_edited: true,
              updated_at: new Date().toISOString()
            }
            
            // If API response has message data, use it but ensure is_edited is true
            if (response.data && response.data.message) {
              Object.assign(updatedMessage, response.data.message, { is_edited: true })
            }
            
            console.log('📝 Updated message:', updatedMessage)
            return updatedMessage
          }
          return msg
        }))
        
        // Clear editing state
        setEditingMessageId(null)
        setEditingContent('')
        
        console.log('✅ Edit completed successfully')
      } else {
        console.error('❌ Edit message failed:', response)
        alert('Failed to edit message. Please try again.')
      }
    } catch (err) {
      console.error('❌ Failed to edit message:', err)
      alert('Error editing message: ' + err.message)
    } finally {
      setEditingMessage(false)
    }
  }

  // Context menu handlers
  const handleRightClick = (event, msg) => {
    event.preventDefault()
    event.stopPropagation()
    
    console.log('🖱️ Right-click detected:', {
      messageId: msg.id,
      target: event.target.tagName + (event.target.className ? '.' + event.target.className : ''),
      isMyMessage: isMyMessage(msg),
      clientX: event.clientX,
      clientY: event.clientY
    })
    
    // Calculate position to ensure menu stays within viewport
    const menuWidth = 180
    const menuHeight = 200
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let x = event.clientX
    let y = event.clientY
    
    // Adjust if menu would go off-screen
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10
    }
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10
    }
    
    setContextMenu({
      x: x,
      y: y,
      messageId: msg.id,
      message: msg
    })
    
    console.log('✅ Context menu opened at adjusted position:', { x, y })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleDeleteMessage = async (messageId) => {
    if (!messageId || deletingMessage) {
      console.log('❌ Cannot delete message:', { 
        hasMessageId: !!messageId, 
        isDeleting: deletingMessage 
      })
      return
    }

    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this message? This action cannot be undone.')
    if (!confirmed) {
      console.log('❌ Delete cancelled by user')
      return
    }

    console.log('🗑️ Deleting message:', messageId)
    setDeletingMessage(true)
    
    try {
      const response = await api.deleteMessage(conversation.id, messageId)
      console.log('📥 Delete message API response:', response)
      
      if (response && (response.success === true || response.status === 'success' || response.data)) {
        console.log('✅ Message deleted successfully')
        
        // Remove the message from local state
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        
        // Close context menu if it's open for this message
        if (contextMenu && contextMenu.messageId === messageId) {
          closeContextMenu()
        }
        
        console.log('✅ Delete completed successfully')
      } else {
        console.error('❌ Delete message failed:', response)
        alert('Failed to delete message. Please try again.')
      }
    } catch (err) {
      console.error('❌ Failed to delete message:', err)
      alert('Error deleting message: ' + err.message)
    } finally {
      setDeletingMessage(false)
    }
  }

  const handleReplyToMessage = (message) => {
    console.log('↩️ Setting reply to message:', message.id)
    setReplyToMessage(message)
    
    // Focus the message input
    setTimeout(() => {
      const messageInput = document.querySelector('.message-input')
      if (messageInput) {
        messageInput.focus()
      }
    }, 100)
    
    closeContextMenu()
  }

  const handleContextAction = (action, message) => {
    console.log('🎯 Context action:', action, 'for message:', message.id)
    
    switch (action) {
      case 'edit':
        console.log('✏️ Edit action triggered for message:', message.id)
        handleEditMessage(message)
        break
      case 'delete':
        console.log('🗑️ Delete action triggered for message:', message.id)
        handleDeleteMessage(message.id)
        break
      default:
        console.log('❓ Unknown action:', action)
        closeContextMenu()
    }
  }

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        closeContextMenu()
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [contextMenu])

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  }

  const isMyMessage = (msg) => {
    // If currentUser hasn't loaded yet, don't classify any messages as "sent"
    // This prevents the flash of incorrectly styled messages
    if (!currentUser?.id || !msg.user_id) {
      return false
    }
    
    // Handle both string and number comparisons
    const currentUserId = String(currentUser.id)
    const msgUserId = String(msg.user_id)
    return currentUserId === msgUserId
  }
  
  if (!conversation) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="chat-empty-state"
      >
        <div className="empty-content">
          <MessageCircle size={64} className="empty-icon" />
          <h3>Welcome to PalAi</h3>
          <p>Select a conversation to start chatting or create a new one</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="chat-pane"
    >
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="conversation-avatar large">
            {conversation.type === 'group' ? <Users size={24} /> : <User size={24} />}
          </div>
          <div className="conversation-details">
            <EditableConversationName conversation={conversation} onUpdateName={onUpdateName} />
            {conversation.archieved && (
              <div className="archived-status">
                <Archive size={16} />
                <span>This conversation is archived</span>
              </div>
            )}
            {currentUser && (
              <div className="user-status">
                <div className="status-indicator online"></div>
                <span>Signed in as {currentUser.name || currentUser.username || currentUser.email}</span>
              </div>
            )}
          </div>
        </div>
        <div className="chat-actions">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`action-btn ${conversation.pinned ? 'active' : ''}`}
            onClick={() => conversation.pinned ? onUnpin(conversation.id) : onPin(conversation.id)}
            title={conversation.pinned ? 'Unpin conversation' : 'Pin conversation'}
            disabled={conversation.archieved}
          >
            <Pin size={18} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-btn"
            onClick={() => {
              if (conversation.archieved) {
                if (window.confirm('Unarchive this conversation?')) {
                  onUnarchive(conversation.id)
                }
              } else {
                if (window.confirm('Archive this conversation?')) {
                  onArchive(conversation.id)
                }
              }
            }}
            title={conversation.archieved ? 'Unarchive conversation' : 'Archive conversation'}
          >
            {conversation.archieved ? <ArchiveRestore size={18} /> : <Archive size={18} />}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-btn danger"
            onClick={() => { 
              if (window.confirm('Leave this conversation?')) { 
                onLeave && onLeave(conversation.id) 
              } 
            }}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>

      <div className="chat-body">
        {conversation.archieved && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="archived-notice"
          >
            <Archive size={20} />
            <div>
              <strong>This conversation is archived.</strong>
              <p>Unarchive it to send new messages.</p>
            </div>
          </motion.div>
        )}
        
        <div className="messages-container" ref={messagesContainerRef}>
          {loadingMessages ? (
            <div className="messages-loading">
              <div className="loading-spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : messagesError ? (
            <div className="messages-error">
              <MessageCircle size={32} />
              <p>{messagesError}</p>
              <button 
                onClick={() => {
                  setMessages([])
                  setMessagesError('')
                  // Trigger reload by changing a dependency
                  const loadMessages = async () => {
                    setLoadingMessages(true)
                    try {
                      const response = await api.getMessages(conversation.id)
                      if (response.success && response.data) {
                        setMessages(response.data.messages || [])
                      }
                    } catch (err) {
                      setMessagesError('Failed to load messages')
                    } finally {
                      setLoadingMessages(false)
                    }
                  }
                  loadMessages()
                }}
                className="btn-retry"
              >
                Try Again
              </button>
            </div>
          ) : messages.length > 0 ? (
            <>
              <AnimatePresence>
                {messages.map((msg, index) => {
                  return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`message-bubble ${isMyMessage(msg) ? 'sent' : 'received'} ${msg.sending ? 'sending' : ''} ${msg.is_ai_response ? 'ai-response' : ''}`}
                    onContextMenu={(e) => handleRightClick(e, msg)}
                    onContextMenuCapture={(e) => handleRightClick(e, msg)}
                    onDoubleClick={() => {
                      // Double-click to reply
                      setReplyToMessage(msg)
                      console.log('💬 Reply to message set via double-click:', msg.content.substring(0, 30) + '...')
                    }}
                    style={{ cursor: 'default' }}
                  >
                  {!isMyMessage(msg) && (
                    <div className="message-avatar">
                      <User size={16} />
                    </div>
                  )}
                  <div className="message-content">
                    {/* Reply indicator - show if this message is a reply */}
                    {msg.reply_to_message && (
                      <div className="reply-indicator">
                        <div className="reply-line"></div>
                        <div className="replied-message">
                          <div className="replied-user">
                            {msg.reply_to_message.user?.name || msg.reply_to_message.user?.username || 'User'}
                          </div>
                          <div className="replied-content">
                            {msg.reply_to_message.content.length > 100 
                              ? msg.reply_to_message.content.substring(0, 100) + '...'
                              : msg.reply_to_message.content
                            }
                          </div>
                        </div>
                      </div>
                    )}

                    {!isMyMessage(msg) && (
                      <div className="message-sender">
                        {msg.user?.name || msg.user?.username || 'Unknown User'}
                      </div>
                    )}
                    
                    {/* Inline Action Buttons */}
                    {!msg.sending && (
                      <div className="message-actions">
                        {isMyMessage(msg) && (
                          <>
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => handleEditMessage(msg)}
                              title="Edit message"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteMessage(msg.id)}
                              disabled={deletingMessage}
                              title="Delete message"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <div className="message-body">
                      {/* Copy icon in top-right corner */}
                      <button 
                        className={`copy-icon-btn ${copiedMessageId === msg.id ? 'copied' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(msg.content)
                          setCopiedMessageId(msg.id)
                          setTimeout(() => setCopiedMessageId(null), 1500)
                          console.log('📋 Copied message content to clipboard')
                        }}
                        title={copiedMessageId === msg.id ? "Copied!" : "Copy message"}
                      >
                        <Copy size={12} />
                      </button>
                      {editingMessageId === msg.id ? (
                        <div className="edit-message-form">
                          <textarea
                            value={editingContent}
                            onChange={(e) => {
                              setEditingContent(e.target.value)
                              // Auto-resize textarea
                              e.target.style.height = 'auto'
                              e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
                            }}
                            className="edit-message-input"
                            rows={3}
                            disabled={editingMessage}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSaveEdit()
                              } else if (e.key === 'Escape') {
                                handleCancelEdit()
                              }
                            }}
                          />
                          <div className="edit-message-actions">
                            <button 
                              onClick={handleCancelEdit} 
                              className="edit-btn-cancel"
                              disabled={editingMessage}
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleSaveEdit} 
                              className="edit-btn-save"
                              disabled={editingMessage || !editingContent.trim()}
                            >
                              {editingMessage ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="message-text">
                            {msg.content}
                            {msg.sending && (
                              <span className="sending-indicator" title="Sending...">
                                <div className="sending-spinner"></div>
                              </span>
                            )}
                            {msg.is_edited && (
                              <span className="edited-indicator" title="This message was edited">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                                edited
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="message-meta">
                      <span className="message-time">
                        {msg.created_at_human || formatMessageTime(msg.created_at)}
                      </span>
                    </div>
                    
                    {/* AI Responses */}
                    {msg.ai_responses && msg.ai_responses.length > 0 && (
                      <div className="ai-responses">
                        {msg.ai_responses.map((aiResponse) => (
                          <motion.div
                            key={aiResponse.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ai-response"
                          >
                            <div className="ai-response-header">
                              <div className="ai-badge">
                                <Hash size={12} />
                                <span>{aiResponse.model_name || 'AI'}</span>
                              </div>
                              <span className="ai-timestamp">
                                {aiResponse.created_at_human}
                              </span>
                            </div>
                            <div className="ai-response-content">
                              {aiResponse.response_text}
                            </div>
                            <div className="ai-response-footer">
                              <span className="ai-generator">
                                Generated by {aiResponse.generated_by_user?.name || 'Unknown'}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    {/* Read Receipts */}
                    {msg.read_by && msg.read_by.length > 0 && isMyMessage(msg) && (
                      <div className="read-receipts">
                        <div className="read-receipts-label">
                          Read by {msg.read_by.length} {msg.read_by.length === 1 ? 'person' : 'people'}:
                        </div>
                        <div className="read-receipts-list">
                          {msg.read_by.map((reader) => (
                            <div key={reader.user_id} className="read-receipt">
                              <span className="reader-name">{reader.user_name}</span>
                              <span className="read-time">{reader.read_at_human}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {isMyMessage(msg) && (
                    <div className="message-avatar sent">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
                  )
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="no-messages">
              <MessageCircle size={32} />
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>

      <div className="chat-input-section">
        {/* Reply Preview */}
        {replyToMessage && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="reply-preview"
          >
            <div className="reply-preview-content">
              <div className="reply-preview-indicator">
                <div className="reply-line"></div>
                <span className="reply-label">Replying to {replyToMessage.user?.name || replyToMessage.user?.username || 'User'}</span>
              </div>
              <div className="reply-preview-message">
                {replyToMessage.content.length > 150 
                  ? replyToMessage.content.substring(0, 150) + '...'
                  : replyToMessage.content
                }
              </div>
            </div>
            <button 
              className="reply-cancel-btn"
              onClick={cancelReply}
              title="Cancel reply"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        <div className="chat-input-container">
          <div className="input-wrapper">
            <textarea 
              placeholder={conversation.archieved ? "Unarchive to send messages..." : "Type your message..."} 
              disabled={conversation.archieved}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                // Auto-resize textarea
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              className="message-input"
              rows={1}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <motion.button 
              whileHover={{ scale: conversation.archieved ? 1 : 1.05 }}
              whileTap={{ scale: conversation.archieved ? 1 : 0.95 }}
              className={`send-btn ${sendingMessage ? 'sending' : ''}`}
              disabled={conversation.archieved || !message.trim() || sendingMessage}
              onClick={handleSendMessage}
            >
              {sendingMessage ? (
                <div className="sending-spinner-btn"></div>
              ) : (
                <Send size={18} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Add user to conversation panel (only for group conversations and not archived) */}
      {conversation.type === 'group' && !conversation.archieved && (
        <AddUserPanel 
          conversation={conversation} 
          onAddUser={(userId) => { 
            if (window.confirm('Add selected user to this conversation?')) { 
              onAddUser && onAddUser(conversation.id, userId) 
            } 
          }} 
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="message-context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Only show edit and delete for user's own messages */}
          {contextMenu.message && isMyMessage(contextMenu.message) && (
            <>
              <div className="context-menu-item" onClick={() => handleContextAction('edit', contextMenu.message)}>
                <div className="context-menu-icon">
                  <Edit3 size={16} />
                </div>
                <span>Edit</span>
              </div>
              <div className="context-menu-item delete" onClick={() => handleContextAction('delete', contextMenu.message)}>
                <div className="context-menu-icon">
                  <Trash2 size={16} />
                </div>
                <span>Delete</span>
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}

function AddUserPanel({ conversation, onAddUser }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  const doSearch = async (q) => {
    setSearching(true)
    try {
      const list = await performUserSearch(token, q)
      setSuggestions(list)
      setShowSuggestions(list.length > 0)
    } finally { setSearching(false) }
  }

  useEffect(() => {
    const id = setTimeout(() => { doSearch(query) }, 300)
    return () => clearTimeout(id)
  }, [query])

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      className="add-user-panel"
    >
      <div className="panel-header">
        <Users size={18} />
        <span>Add users to this conversation</span>
      </div>
      <div className="panel-content">
        <div className="search-wrapper">
          <Search className="search-icon" size={16} />
          <input
            placeholder="Search username to add..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { 
              if (query.length >= 2) doSearch(query); 
              else if (suggestions.length) setShowSuggestions(true) 
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="search-input"
          />
          {searching && (
            <div className="search-loading">
              <div className="spinner small"></div>
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="user-suggestions"
            >
              {suggestions.map(u => (
                <motion.div
                  key={u.id}
                  whileHover={{ backgroundColor: 'var(--primary-50)' }}
                  className="suggestion-item"
                  onMouseDown={() => { 
                    setQuery(''); 
                    setSuggestions([]); 
                    setShowSuggestions(false); 
                    onAddUser(u.id) 
                  }}
                >
                  <div className="suggestion-avatar">
                    <User size={16} />
                  </div>
                  <div className="suggestion-info">
                    <div className="suggestion-username">{u.username}</div>
                    <div className="suggestion-name">{u.name}</div>
                  </div>
                  <Plus size={14} className="add-icon" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function ConversationPage() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }
  const token = getToken()

  const load = useCallback(async (signal) => {
    console.log('Starting load function, token exists:', !!token)
    if (!token) {
      console.warn('No token found, skipping API calls')
      setLoading(false) // Important: Set loading to false even when no token
      return
    }
    try {
      console.log('Making API call to getConversations...')
      const data = await api.getConversations()
      console.log('Raw API response:', data)
      
      // resource collection returns data array - normalize
      const items = Array.isArray(data) ? data : (data.data || [])
      
      // Normalize pinned and archived values from null to false
      const normalizedItems = items.map(conv => ({
        ...conv,
        pinned: Boolean(conv.pinned), // Convert null/undefined to false, true stays true
        archieved: Boolean(conv.archieved) // Convert null/undefined to false, true stays true
      }))
      
      console.log('Processed conversations with pinned and archived status:', normalizedItems.map(c => ({id: c.id, name: c.name, pinned: c.pinned, archived: c.archieved})))
      setConversations(normalizedItems)
      if (normalizedItems.length) setSelected(normalizedItems[0])
    } catch (err) {
      console.error('Error in load function:', err)
      setConversations([]) // Set empty array on error
    } finally { 
      setLoading(false) 
    }
  }, [token])

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    
    // Ensure loading state doesn't persist indefinitely
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Loading timeout reached, forcing loading to false')
        setLoading(false)
      }
    }, 10000) // 10 second timeout
    
    load(controller.signal)
    
    // fetch current user
    ;(async () => {
      if (!token) {
        console.warn('No token found, redirecting to login')
        // not authenticated - send to login
        navigate('/login')
        return
      }
      try {
        console.log('Fetching current user...')
        const user = await api.getCurrentUser()
        console.log('✅ Current user loaded:', user?.name || user?.username)
        setCurrentUser(user?.data || user)
      } catch (err) {
        console.error('failed to load user', err)
        // If authentication fails, redirect to login
        if (err.status === 401) {
          console.log('Authentication failed, redirecting to login')
          navigate('/login')
        }
      }
    })()
    
    return () => { 
      mounted = false
      controller.abort()
      clearTimeout(loadingTimeout)
    }
  }, [load, token, navigate])

  const handleSelect = (c) => setSelected(c)

  const handleLeave = async (conversationId) => {
    const token = getToken()
    if (!token) { alert('Not authenticated'); return }
    try {
      await api.leaveConversation(conversationId)
      // remove conversation from list
      setConversations(prev => prev.filter(c => c.id !== conversationId))
      // clear selection if it was the one left
      setSelected(prev => (prev && prev.id === conversationId ? null : prev))
    } catch (err) {
      console.error('Failed to leave', err)
      alert('Failed to leave conversation')
    }
  }

  const handleAddUser = async (conversationId, userId) => {
    const token = getToken()
    if (!token) { alert('Not authenticated'); return }
    try {
      const res = await api.addUserToConversation(conversationId, userId)
      // backend may return the updated conversation resource under data or as the body
      const updated = res.data || res
      // replace conversation in state
      setConversations(prev => prev.map(c => c.id === updated.id ? updated : c))
      // if the currently selected conversation is the same, update it too
      setSelected(prev => (prev && prev.id === updated.id ? updated : prev))
      alert('User added to conversation')
    } catch (err) {
      console.error('Failed to add user', err)
      if (err.status === 422 && err.body && err.body.errors) {
        alert(Object.values(err.body.errors).flat().join('\n'))
      } else if (err.body && err.body.message) {
        alert(err.body.message)
      } else {
        alert('Failed to add user to conversation')
      }
    }
  }

  const handleCreate = async (payload) => {
    if (!token) throw new Error('No auth token')
    const res = await api.createConversation(payload)
    const conv = res.data || res
    setConversations(prev => [conv, ...prev])
    setSelected(conv)
  }

  const handleUpdateName = async (conversationId, newName) => {
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    
    await api.updateConversationName(conversationId, newName)
    
    // Update the conversation in the list
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, name: newName } : c
    ))
    
    // Update selected conversation if it's the same one
    setSelected(prev => 
      prev && prev.id === conversationId ? { ...prev, name: newName } : prev
    )
  }

  const handlePinConversation = async (conversationId) => {
    const token = getToken()
    if (!token) { alert('Not authenticated'); return }
    
    console.log('🚀 STARTING PIN PROCESS for conversation:', conversationId)
    
    try {
      const result = await api.pinConversation(conversationId)
      console.log('Pin result:', result)
      
      // Check if the response indicates failure
      if (result && result.success === false) {
        alert(`Failed to pin conversation: ${result.message}`)
        return
      }
      
      console.log('✅ Pin successful, updating state...')
      
      // Success - update the conversation in the list
      setConversations(prev => {
        console.log('🔥 STATE UPDATE: Current conversations:', prev.length)
        const updated = prev.map(c => {
          if (c.id == conversationId) {
            console.log(`🔥 UPDATING conversation ${c.id} from pinned: ${c.pinned} to pinned: true`)
            return { ...c, pinned: true }
          }
          return c
        })
        console.log('🔥 STATE UPDATE: Updated conversations:', updated.filter(c => c.pinned).length, 'pinned')
        return updated
      })
      
      // Update selected conversation if it matches
      setSelected(prev => 
        prev && prev.id == conversationId ? { ...prev, pinned: true } : prev
      )
      
      console.log('✅ State update complete')
      
      // Force a small delay and then log the current state
      setTimeout(() => {
        console.log('🔥 STATE CHECK after timeout:', conversations.find(c => c.id == conversationId)?.pinned)
      }, 100)
      
    } catch (err) {
      console.error('Failed to pin conversation', err)
      console.error('Error status:', err.status)
      console.error('Error body:', err.body)
      alert(`Failed to pin conversation: ${err.body?.message || err.message}`)
    }
  }

  const handleUnpinConversation = async (conversationId) => {
    const token = getToken()
    if (!token) { alert('Not authenticated'); return }
    
    console.log('🚀 STARTING UNPIN PROCESS for conversation:', conversationId)
    
    try {
      const result = await api.unpinConversation(conversationId)
      console.log('Unpin result:', result)
      
      // Check if the response indicates failure
      if (result && result.success === false) {
        alert(`Failed to unpin conversation: ${result.message}`)
        return
      }
      
      console.log('✅ Unpin successful, updating state...')
      
      // Success - update the conversation in the list
      setConversations(prev => {
        console.log('🔥 UNPIN STATE UPDATE: Current conversations:', prev.length)
        const updated = prev.map(c => {
          if (c.id == conversationId) {
            console.log(`🔥 UNPINNING conversation ${c.id} from pinned: ${c.pinned} to pinned: false`)
            return { ...c, pinned: false }
          }
          return c
        })
        console.log('🔥 UNPIN STATE UPDATE: Updated conversations:', updated.filter(c => c.pinned).length, 'pinned')
        return updated
      })
      
      // Update selected conversation if it matches
      setSelected(prev => prev && prev.id == conversationId ? { ...prev, pinned: false } : prev)
      
      console.log('✅ Unpin state update complete')
      
    } catch (err) {
      console.error('Failed to unpin conversation', err)
      console.error('Error status:', err.status)
      console.error('Error body:', err.body)
      alert(`Failed to unpin conversation: ${err.body?.message || err.message}`)
    }
  }

  const handleArchiveConversation = async (conversationId) => {
    const token = getToken()
    if (!token) { alert('Not authenticated'); return }
    
    console.log('🚀 STARTING ARCHIVE PROCESS for conversation:', conversationId)
    
    try {
      const result = await api.archiveConversation(conversationId)
      console.log('Archive result:', result)
      
      // Check if the response indicates failure
      if (result && result.success === false) {
        alert(`Failed to archive conversation: ${result.message}`)
        return
      }
      
      console.log('✅ Archive successful, updating state...')
      
      // Success - update the conversation in the list (set to archived)
      setConversations(prev => {
        console.log('🔥 ARCHIVE STATE UPDATE: Current conversations:', prev.length)
        const updated = prev.map(c => {
          if (c.id == conversationId) {
            console.log(`🔥 ARCHIVING conversation ${c.id} from archived: ${c.archieved} to archived: true`)
            return { ...c, archieved: true, pinned: false } // Unpin when archiving
          }
          return c
        })
        console.log('🔥 ARCHIVE STATE UPDATE: Updated conversations:', updated.filter(c => c.archieved).length, 'archived')
        return updated
      })
      
      // Update selected conversation if it matches
      setSelected(prev => {
        if (prev && prev.id == conversationId) {
          return { ...prev, archieved: true, pinned: false }
        }
        return prev
      })
      
      console.log('✅ Archive state update complete')
      
    } catch (err) {
      console.error('Failed to archive conversation', err)
      console.error('Error status:', err.status)
      console.error('Error body:', err.body)
      alert(`Failed to archive conversation: ${err.body?.message || err.message}`)
    }
  }

  const handleUnarchiveConversation = async (conversationId) => {
    const token = getToken()
    if (!token) { alert('Not authenticated'); return }
    
    console.log('🚀 STARTING UNARCHIVE PROCESS for conversation:', conversationId)
    
    try {
      const result = await api.unarchiveConversation(conversationId)
      console.log('Unarchive result:', result)
      
      // Check if the response indicates failure
      if (result && result.success === false) {
        alert(`Failed to unarchive conversation: ${result.message}`)
        return
      }
      
      console.log('✅ Unarchive successful, updating state...')
      
      // Success - update the conversation in the list (set to not archived)
      setConversations(prev => {
        console.log('🔥 UNARCHIVE STATE UPDATE: Current conversations:', prev.length)
        const updated = prev.map(c => {
          if (c.id == conversationId) {
            console.log(`🔥 UNARCHIVING conversation ${c.id} from archived: ${c.archieved} to archived: false`)
            return { ...c, archieved: false }
          }
          return c
        })
        console.log('🔥 UNARCHIVE STATE UPDATE: Updated conversations:', updated.filter(c => !c.archieved).length, 'active')
        return updated
      })
      
      // Update selected conversation if it matches
      setSelected(prev => {
        if (prev && prev.id == conversationId) {
          return { ...prev, archieved: false }
        }
        return prev
      })
      
      console.log('✅ Unarchive state update complete')
      
    } catch (err) {
      console.error('Failed to unarchive conversation', err)
      console.error('Error status:', err.status)
      console.error('Error body:', err.body)
      alert(`Failed to unarchive conversation: ${err.body?.message || err.message}`)
    }
  }

  if (loading) {
    console.log('ConversationPage: Rendering loading state')
    return (
      <div className="conversation-page loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading conversations...</h3>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  console.log('ConversationPage: Rendering main content', {
    conversationsCount: conversations.length,
    selectedConversation: selected?.id,
    currentUser: currentUser?.id
  })

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="conversation-page"
    >
      {/* Debug info */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        background: 'rgba(0,0,0,0.1)', 
        padding: '5px', 
        fontSize: '12px',
        zIndex: 10000
      }}>
        Debug: {conversations.length} conversations, loading: {loading.toString()}
      </div>
      
      <Sidebar 
        conversations={conversations} 
        onSelect={handleSelect} 
        selectedId={selected?.id} 
        onCreate={handleCreate} 
        onPin={handlePinConversation} 
        onUnpin={handleUnpinConversation} 
        onArchive={handleArchiveConversation} 
        onUnarchive={handleUnarchiveConversation} 
      />
      <main className="conversation-main">
        <ChatPane 
          conversation={selected} 
          currentUser={currentUser} 
          onLeave={handleLeave} 
          onAddUser={handleAddUser} 
          onUpdateName={handleUpdateName} 
          onPin={handlePinConversation} 
          onUnpin={handleUnpinConversation} 
          onArchive={handleArchiveConversation} 
          onUnarchive={handleUnarchiveConversation} 
        />
      </main>

      {/* Debug Panel - Toggle with Ctrl+D, Run tests with Ctrl+T */}
      {showDebugPanel && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          zIndex: 9999,
          maxWidth: '300px',
          fontSize: '12px'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>API Debug Panel</h4>
          <p>Press Ctrl+T to run API tests</p>
          <p>API Base: {apiPath()}</p>
          <p>Token: {!!(localStorage.getItem('token') || sessionStorage.getItem('token')) ? 'Present' : 'Missing'}</p>
          <p>Selected: {selected?.name || 'None'}</p>
          <button 
            onClick={runApiTests}
            style={{ marginTop: '10px', padding: '5px 10px', fontSize: '12px' }}
          >
            Run Tests
          </button>
          <button 
            onClick={debugRefreshMessages}
            style={{ marginTop: '5px', marginLeft: '5px', padding: '5px 10px', fontSize: '12px' }}
          >
            Refresh Messages
          </button>
          <button 
            onClick={() => setShowDebugPanel(false)}
            style={{ marginTop: '5px', marginLeft: '5px', padding: '5px 10px', fontSize: '12px' }}
          >
            Close
          </button>
        </div>
      )}
    </motion.div>
  )
}
