const WS_URL = 'ws://localhost:3000';

export function createConnection(handlers) {
  const socket = new WebSocket(WS_URL);

  socket.addEventListener('open', handlers.onOpen);
  socket.addEventListener('message', handlers.onMessage);
  socket.addEventListener('close', handlers.onClose);
  socket.addEventListener('error', handlers.onError);

  return socket;
}

export function sendMessage(socket, data) {
  if (socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  socket.send(JSON.stringify(data));
  return true;
}