self.addEventListener('install', () => {
  console.log('push notifications sw installed');
});

self.addEventListener('push', (event: any) => {
  const data = event.data.json();
  console.log('Got push', data);

  event.waitUntil(
    //@ts-ignore
    registration
      .showNotification(data.title, {
        body: 'Уведомление об окончании сборки',
        icon:
          'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/finish_flag-512.png',
      })
      .then((ev: any) => {
        console.log(ev);
      })
      .catch((err: any) => {
        console.log(err);
      })
  );
});
