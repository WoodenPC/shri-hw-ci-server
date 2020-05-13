import { axiosPush } from 'utils/axiosPush';

const publicVapidKey =
  'BBzTQeNBK_2hO3TDtnsl3NoGdU65Dy8s3-RCggh6e8MCWuDWf0xcG2IGux3quKOUKk-nfA38XukmhG_LEQpBWm0';

export async function registerPushWorker() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register(
      `${process.env.PUBLIC_URL}/swPush.js`,
      { scope: '/buildHistory' }
    );
    await subscribe(registration);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribe(registration: ServiceWorkerRegistration) {
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  console.log('subscribe init', subscription);
  await axiosPush.post('/subscribe', {
    data: JSON.stringify(subscription),
  });
}
