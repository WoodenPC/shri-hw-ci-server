import { injectManifest } from 'workbox-build';

const buildSW = () => {
  injectManifest({
    swSrc: 'workers/cache/swTemplate.js',
    swDest: 'build/service-worker.js',
    globDirectory: 'build',
  })
    .then(({ warnings }) => {
      warnings.forEach(console.warn);
    })
    .catch(console.error);
};

buildSW();
