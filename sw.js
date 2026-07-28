
// [SỬA] Không cache index.html — luôn ưu tiên tải bản mới nhất từ mạng
// mỗi khi mở app. Nếu mất mạng mới rơi về bản cũ đã lưu (dự phòng).
const CACHE_NAME = 'myphong-shell-v1';

self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        // Lấy thành công từ mạng -> lưu tạm 1 bản dự phòng, trả về bản mới nhất
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, resClone); });
        return res;
      })
      .catch(function () {
        // Mất mạng -> dùng bản cũ đã lưu tạm (nếu có), còn hơn không có gì
        return caches.match(e.request);
      })
  );
});
