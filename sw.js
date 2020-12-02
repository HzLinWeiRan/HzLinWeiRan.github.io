importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js");
var cacheStorageKey = 'minimal-pwa-1'
var cacheList=[
  '/',
  'index.html',
  'manifest.json',
  'main3.css',
  'test.png',
  'test2.jpg'
]


self.addEventListener('install',e =>{
    console.log('install')
    e.waitUntil(
        caches.open(cacheStorageKey)
        .then(cache => cache.addAll(cacheList))
        .then(() => self.skipWaiting())
    )
})

self.addEventListener('fetch',function(e){
    console.log('fetch')
    e.respondWith(
        caches.match(e.request).then(function(response){
            if (e.request.url.endsWith('.png')) {
                return fetch('test2.jpg')
            }

            if(response != null){
                console.log('fetch response')
                return response
            }
            return fetch(e.request.url)
        })
    )
})
self.addEventListener('activate',function(e){

    console.log('activate')
    e.waitUntil(
        //获取所有cache名称
        caches.keys().then(cacheNames => {
            return Promise.all(
                // 获取所有不同于当前版本名称cache下的内容
                cacheNames.filter(cacheNames => {
                    return cacheNames !== cacheStorageKey
                }).map(cacheNames => {
                    return caches.delete(cacheNames)
                })
            )
        }).then(() => {
            return self.clients.claim()
        })
    )
})