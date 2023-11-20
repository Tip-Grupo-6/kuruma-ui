self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: './icon.png',
    };
    event.waitUntil(
        self.registration.showNotification('Kuruma', options)
    );
});