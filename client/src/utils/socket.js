import io from 'socket.io-client';

let socketId;
export default socketId;

export function initSocket() {
  const socket = io('', { path: '/ws' });

  socket.on('clientId', data => {
    socketId = data.id;
  });
}
