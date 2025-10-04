// Service Worker for AGI Cosmic PWA
const CACHE_NAME = 'agi-cosmic-v1.0.0';
const STATIC_CACHE_NAME = 'agi-cosmic-static-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/chat\/sessions/,
  /\/api\/auth\/me/,
  /\/api\/ai\/status/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      // Cache dynamic content
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Cache opened');
        return cache;
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      self.clients.claim();
    })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Skip non-GET requests
  if (method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.includes('/api/')) {
    // API requests - network first, then cache
    event.respondWith(handleApiRequest(request));
  } else if (url.includes('.js') || url.includes('.css') || url.includes('.woff')) {
    // Static assets - cache first
    event.respondWith(handleStaticAssets(request));
  } else {
    // HTML pages - network first with cache fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests - Network first strategy
async function handleApiRequest(request) {
  const cacheName = CACHE_NAME;
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for:', request.url);
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Offline - please check your internet connection',
        offline: true
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Handle static assets - Cache first strategy
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Handle page requests - Network first with cache fallback
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for page:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/index.html');
  }
}

// Background sync for chat messages
self.addEventListener('sync', (event) => {
  if (event.tag === 'chat-sync') {
    event.waitUntil(syncChatMessages());
  }
});

async function syncChatMessages() {
  console.log('Service Worker: Syncing chat messages...');
  
  try {
    // Get pending messages from IndexedDB
    const pendingMessages = await getPendingMessages();
    
    for (const message of pendingMessages) {
      try {
        const response = await fetch('/api/chat/sessions/' + message.sessionId + '/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + message.token
          },
          body: JSON.stringify({
            message: message.content,
            context: message.context
          })
        });
        
        if (response.ok) {
          await removePendingMessage(message.id);
          console.log('Service Worker: Message synced successfully');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync message:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'agi-cosmic-notification',
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open AGI Cosmic'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AGI Cosmic', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Helper functions for IndexedDB operations
async function getPendingMessages() {
  // Implementation would use IndexedDB to store/retrieve pending messages
  return [];
}

async function removePendingMessage(messageId) {
  // Implementation would remove message from IndexedDB
  console.log('Service Worker: Removing pending message:', messageId);
}

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded successfully');