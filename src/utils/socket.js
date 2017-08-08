import io from 'socket.io-client';

export let socket;

export function initSocket() {
  return new Promise(resolve => {
    socket = io('', { path: '/ws' });

    socket.on('clientId', () => {
      resolve();
    });
  });
}
