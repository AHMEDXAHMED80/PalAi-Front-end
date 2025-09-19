import { apiPath } from '../config'

// Simple API connectivity test
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...')
    console.log('API base path:', apiPath())
    
    // Test basic connectivity without authentication
    const response = await fetch(apiPath('/health'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Health check response status:', response.status)
    console.log('Health check response headers:', Object.fromEntries(response.headers.entries()))
    
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('Health check response data:', data)
      return { success: true, data }
    } else {
      const text = await response.text()
      console.log('Health check response (non-JSON):', text.substring(0, 200))
      return { success: false, error: 'Non-JSON response from server', response: text.substring(0, 200) }
    }
  } catch (error) {
    console.error('API connectivity test failed:', error)
    return { success: false, error: error.message }
  }
}

// Test with authentication
export const testAuthenticatedEndpoint = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) {
      return { success: false, error: 'No authentication token found' }
    }
    
    console.log('Testing authenticated endpoint...')
    const response = await fetch(apiPath('/user'), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('User endpoint response status:', response.status)
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('User endpoint response data:', data)
      return { success: response.ok, data, status: response.status }
    } else {
      const text = await response.text()
      console.log('User endpoint response (non-JSON):', text.substring(0, 200))
      return { 
        success: false, 
        error: 'Non-JSON response from authenticated endpoint', 
        response: text.substring(0, 200),
        status: response.status
      }
    }
  } catch (error) {
    console.error('Authenticated endpoint test failed:', error)
    return { success: false, error: error.message }
  }
}
