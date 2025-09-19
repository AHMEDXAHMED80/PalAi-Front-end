Echo setup (frontend)

This project uses Laravel Echo + Pusher (pusher-js) for real-time broadcasts.

Required Vite env vars (set in .env or your hosting env):
- VITE_PUSHER_APP_KEY - pusher app key
- VITE_PUSHER_HOST - websocket host (e.g. 127.0.0.1 or your server)
- VITE_PUSHER_PORT - websocket port (usually 6001 for laravel-websockets or 6001/443)
- VITE_PUSHER_SCHEME - http or https
- VITE_PUSHER_PATH - auth endpoint path, default '/broadcasting/auth'
- Optional: VITE_PUSHER_APP_CLUSTER

Auth considerations:
- If your backend uses Sanctum cookie-based auth, ensure the browser is authenticated (CSRF + cookies) and Echo's auth endpoint will use the cookies automatically.
- If your backend uses Bearer tokens, store the token in localStorage under 'token' (the echo helper will include Authorization: Bearer <token>). You can change this behavior in src/services/echo.js.

Files added:
- src/services/echo.js - lazy-initializes laravel-echo and exposes subscribeConversation/unsubscribeConversation helpers.

Quick manual test (Laravel):
1. In tinker or a controller, trigger the MessageSent event with a Message model instance that has been saved.

   // Example tinker flow
   $message = App\Models\Message::find(123); // ensure it's persisted
   event(new App\Events\MessageSent($message));

2. Confirm the frontend console prints the payload and that messages appear in the conversation.

If subscriptions fail with 401 during /broadcasting/auth, check your auth method and ensure Echo's auth headers match your backend expectations.
