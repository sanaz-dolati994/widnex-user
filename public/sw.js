try {
	const CACHE_NAME = 'ce-v1'
	const RUNTIME = 'runtime'
	const urlsToCache = ['/', 'offline.html']

	const self = this

	// install sw
	self.addEventListener('install', (event) => {
		event
			.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
			.then(self.skipWaiting())
	})

	// listen for requests
	self.addEventListener('fetch', (event) => {
		// Skip cross-origin requests, like those for Google Analytics.
		if (event.request.url.startsWith(self.location.origin)) {
			event.respondWith(
				caches.match(event.request).then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse
					}

					return caches.open(RUNTIME).then((cache) => {
						return fetch(event.request, {}).then((response) => {
							// Put a copy of the response in the runtime cache.
							return cache.put(event.request, response.clone()).then(() => {
								return response
							})
						})
					})
				})
			)
		}
	})

	// activate sw
	self.addEventListener('activate', (event) => {
		const currentCaches = [CACHE_NAME, RUNTIME]
		event.waitUntil(
			caches
				.keys()
				.then((cacheNames) => {
					return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
				})
				.then((cachesToDelete) => {
					return Promise.all(
						cachesToDelete.map((cacheToDelete) => {
							return caches.delete(cacheToDelete)
						})
					)
				})
				.then(() => self.clients.claim())
		)
	})
} catch (err) {
	console.log(err)
}
