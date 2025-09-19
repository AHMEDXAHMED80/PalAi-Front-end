import { apiPath } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

const handleApiResponse = async (response, errorMessage = 'API request failed') => {
  // Check if response is HTML (likely an error page)
  const contentType = response.headers.get('content-type')
  
  if (!response.ok) {
    // Try to get error details
    let errorDetails = `${errorMessage} (${response.status})`
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json()
        errorDetails = errorData.message || errorDetails
      } catch (e) {
        // Ignore JSON parse errors
      }
    } else {
      // If we get HTML instead of JSON, it's likely a server error or auth issue
      if (response.status === 401) {
        errorDetails = 'Authentication failed. Please log in again.'
        // Optionally redirect to login page
        // window.location.href = '/login'
      } else {
        errorDetails = `Server error (${response.status}). Please check if the API server is running.`
      }
    }
    
    const error = new Error(errorDetails)
    error.status = response.status
    throw error
  }
  
  // Parse JSON response
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  } else {
    throw new Error('Server returned non-JSON response. Please check API server configuration.')
  }
}

const api = {
  // Get all conversations
  getConversations: async () => {
    try {
      const response = await fetch(apiPath('/conversations'), {
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to fetch conversations')
    } catch (error) {
      console.error('getConversations error:', error)
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await fetch(apiPath('/user'), {
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to fetch current user')
    } catch (error) {
      console.error('getCurrentUser error:', error)
      throw error
    }
  },

  // Search users
  searchUsers: async (query) => {
    try {
      const response = await fetch(apiPath(`/conversations/search-users?query=${encodeURIComponent(query)}`), {
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to search users')
    } catch (error) {
      console.error('searchUsers error:', error)
      throw error
    }
  },

  // Leave conversation
  leaveConversation: async (conversationId) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/leave`), {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to leave conversation')
    } catch (error) {
      console.error('leaveConversation error:', error)
      throw error
    }
  },

  // Add user to conversation
  addUserToConversation: async (conversationId, userId) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/add-user/${userId}`), {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to add user to conversation')
    } catch (error) {
      console.error('addUserToConversation error:', error)
      throw error
    }
  },

  // Create conversation
  createConversation: async (payload) => {
    try {
      const response = await fetch(apiPath('/conversations'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })
      return await handleApiResponse(response, 'Failed to create conversation')
    } catch (error) {
      console.error('createConversation error:', error)
      throw error
    }
  },

  // Update conversation name
  updateConversationName: async (conversationId, name) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/update-name`), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name })
      })
      return await handleApiResponse(response, 'Failed to update conversation name')
    } catch (error) {
      console.error('updateConversationName error:', error)
      throw error
    }
  },

  // Pin conversation
  pinConversation: async (conversationId) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/pin`), {
        method: 'PATCH',
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to pin conversation')
    } catch (error) {
      console.error('pinConversation error:', error)
      throw error
    }
  },

  // Unpin conversation
  unpinConversation: async (conversationId) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/unpin`), {
        method: 'PATCH',
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to unpin conversation')
    } catch (error) {
      console.error('unpinConversation error:', error)
      throw error
    }
  },

  // Archive conversation
  archiveConversation: async (conversationId) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/archive`), {
        method: 'PATCH',
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to archive conversation')
    } catch (error) {
      console.error('archiveConversation error:', error)
      throw error
    }
  },

  // Unarchive conversation
  unarchiveConversation: async (conversationId) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/unarchive`), {
        method: 'PATCH',
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to unarchive conversation')
    } catch (error) {
      console.error('unarchiveConversation error:', error)
      throw error
    }
  },

  // Get conversation messages
  getMessages: async (conversationId) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/messages`), {
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to fetch messages')
    } catch (error) {
      console.error('getMessages error:', error)
      throw error
    }
  },

  // Send a message
  sendMessage: async (conversationId, messageData) => {
    try {
      // Handle both string content and object with reply_to_message_id
      const requestBody = typeof messageData === 'string' 
        ? { content: messageData.trim() }
        : {
            content: messageData.content.trim(),
            ...(messageData.reply_to_message_id && { reply_to_message_id: messageData.reply_to_message_id })
          }
      
      const response = await fetch(apiPath(`/conversations/${conversationId}/messages`), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody)
      })
      return await handleApiResponse(response, 'Failed to send message')
    } catch (error) {
      console.error('sendMessage error:', error)
      throw error
    }
  },

  // Edit a message
  editMessage: async (conversationId, messageId, content) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/messages/${messageId}`), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: content.trim()
        })
      })
      return await handleApiResponse(response, 'Failed to edit message')
    } catch (error) {
      console.error('editMessage error:', error)
      throw error
    }
  },

  // Delete a message
  deleteMessage: async (conversationId, messageId) => {
    try {
      const response = await fetch(apiPath(`/conversations/${conversationId}/messages/${messageId}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      return await handleApiResponse(response, 'Failed to delete message')
    } catch (error) {
      console.error('deleteMessage error:', error)
      throw error
    }
  }
}

export default api