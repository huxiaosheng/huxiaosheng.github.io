const staticAssets = ["./", "./app.css", "./app.js"];

self.addEventListener("install", async event => {
    const cache = await caches.open("v1");
    cache.addAll(staticAssets);
});

self.addEventListener("fetch", async event => {

    /**
 * 每次任何被 service worker 控制的资源被请求到时，都会触发 fetch 事件，
 * 这些资源包括了指定的 scope 内的文档，和这些文档内引用的其他任何资源
 * （比如 index.html 发起了一个跨域的请求来嵌入一个图片，这个也会通过 service worker 。）
 * respondWith() 方法来劫持我们的 HTTP 响应
 */
    event.respondWith(caches.match(event.request).then(function (response) {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                /**
                 * 为什么要克隆response？
                 * 因为这里的response 只能被读取一次，所以需要克隆一次，一个返回给浏览器，一个发送到缓存中
                 */
                let responseClone = response.clone();

                caches.open('v1').then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                 console.log('fetch error');
            });
        }
    }));


    // const req = event.request;
    // const url = new URL(req.url);

    // if (url.origin === location.origin) {
    //     debugger
    //     event.respondWith(cacheFirst(req));
    // } else {
    //     debugger
    //     event.respondWith(networkFirst(req));
    // }
});

// async function cacheFirst(req) {
//     const cachedResponse = await caches.match(req);
//     return cachedResponse || fetch(req);
// }

// async function networkFirst(req) {
//     const cache = await caches.open("topics-dynamic");
//     try {
//         const res = await fetch(req);
//         cache.put(req, res.clone());
//         return res;
//     } catch (error) {
//         return await cache.match(req);
//     }
// }