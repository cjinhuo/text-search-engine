if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/text-search-engine/sw.js', { scope: '/text-search-engine/' })})}