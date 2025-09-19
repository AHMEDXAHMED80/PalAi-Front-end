// Lightweight Echo initializer for Vite + Laravel Broadcast
// Exports: getEcho(), subscribeConversation(conversationId, handlers), unsubscribeConversation(conversationId)
// Uses import.meta.env.VITE_PUSHER_* environment variables.
let EchoInstance = null

async function loadDependencies() {
  // dynamic imports so dev builds that don't use Echo won't fail
  const [modEcho, modPusher] = await Promise.all([
    import('laravel-echo'),
    import('pusher-js')
  ])

  // Support different bundler/module shapes
  const EchoCtor = modEcho && (modEcho.default || modEcho.Echo || modEcho)
  const PusherCtor = modPusher && (modPusher.default || modPusher)

  return { Echo: EchoCtor, Pusher: PusherCtor }
}

function buildEchoOptions(Pusher) {
  const key = import.meta.env.VITE_PUSHER_APP_KEY || ''
  const host = import.meta.env.VITE_PUSHER_HOST || window.location.hostname
  const port = import.meta.env.VITE_PUSHER_PORT || ''
  const scheme = import.meta.env.VITE_PUSHER_SCHEME || window.location.protocol.replace(':', '')
  // Use a dedicated frontend auth endpoint env var. Keep VITE_PUSHER_PATH for server websocket path only.
  const authEndpoint = import.meta.env.VITE_PUSHER_AUTH_ENDPOINT || '/broadcasting/auth'
  // Removed cluster option for self-hosted websockets (laravel-websockets/soketi)

  const options = {
    broadcaster: 'pusher',
    key,
    wsHost: host,
    wsPort: parseInt(port || (scheme === 'https' ? '443' : '80'), 10),
    wssPort: parseInt(port || (scheme === 'https' ? '443' : '80'), 10),
    forceTLS: (scheme === 'https' || scheme === 'https:'),
    enabledTransports: ['ws', 'wss'],
    authEndpoint,
    auth: {
      headers: {
        // include common headers; if you use Bearer tokens store them in localStorage under 'token'
        ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
      }
    }
  }

  return options
}

export async function getEcho() {
  if (EchoInstance) return EchoInstance
  try {
    const { Echo: EchoCtor, Pusher } = await loadDependencies()
    if (!EchoCtor) throw new Error('laravel-echo not available')
    const opts = buildEchoOptions(Pusher)
    // Pusher needs to be attached to window for Echo to use
    // Some bundles expect window.Pusher to exist
    if (Pusher) window.Pusher = Pusher
    // Enable Pusher debug logs to console for troubleshooting
    if (Pusher) window.Pusher.logToConsole = true

    // Some Echo builds expect `new Echo(options)` while others accept an object with client
    // We prefer the standard constructor
    EchoInstance = new EchoCtor(opts)
    return EchoInstance
  } catch (err) {
    // when pusher/echo isn't installed or import fails, gracefully return null
    console.warn('Echo init failed:', err)
    EchoInstance = null
    return null
  }
}

const channelMap = new Map()

export async function subscribeConversation(conversationId, handlers = {}) {
  if (!conversationId) return null
  const echo = await getEcho()
  if (!echo) return null

  const channelKey = `conversation.${conversationId}`
  // avoid duplicate subscriptions
  if (channelMap.has(channelKey)) return channelMap.get(channelKey)

  try {
    const channel = echo.private(channelKey)
    if (handlers.sent && typeof channel.listen === 'function') channel.listen('message.sent', handlers.sent)
    if (handlers.updated && typeof channel.listen === 'function') channel.listen('message.updated', handlers.updated)

    channelMap.set(channelKey, channel)
    return channel
  } catch (err) {
    console.warn('subscribeConversation failed', err)
    return null
  }
}

export async function unsubscribeConversation(conversationId) {
  if (!conversationId) return
  const channelKey = `conversation.${conversationId}`
  const channel = channelMap.get(channelKey)
  if (!channel) return
  try {
    // stop listening if available
    if (typeof channel.stopListening === 'function') {
      try { channel.stopListening('message.sent') } catch (e) {}
      try { channel.stopListening('message.updated') } catch (e) {}
    }

    // prefer Echo.leave(channelName) to properly leave the channel
    const echo = await getEcho()
    if (echo && typeof echo.leave === 'function') {
      try { echo.leave(channelKey) } catch (e) {}
    }
  } catch (err) {
    // ignore
  }
  channelMap.delete(channelKey)
}

export default {
  getEcho,
  subscribeConversation,
  unsubscribeConversation
}
