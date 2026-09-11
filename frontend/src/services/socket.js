import { io } from 'socket.io-client';

const SOCKET_URL = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Sanskriti Socket.io Real-Time Engine:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.warn('🔌 Socket.io disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ Socket.io connection warning:', err.message);
    });
  }
  return socket;
}

export function joinChatRoom(applicationId) {
  if (!applicationId) return;
  const s = getSocket();
  if (s.connected) {
    s.emit('join_room', applicationId);
  } else {
    s.once('connect', () => {
      s.emit('join_room', applicationId);
    });
  }
}

export function leaveChatRoom(applicationId) {
  if (!applicationId || !socket) return;
  socket.emit('leave_room', applicationId);
}

export function sendChatMessage(applicationId, chatMessage) {
  const s = getSocket();
  s.emit('send_message', { applicationId, chatMessage });
}

export function sendTypingStatus(applicationId, sender, isTyping) {
  const s = getSocket();
  s.emit('typing_status', { applicationId, sender, isTyping });
}

export function onReceiveMessage(callback) {
  const s = getSocket();
  s.off('receive_message');
  s.on('receive_message', callback);
}

export function onUserTyping(callback) {
  const s = getSocket();
  s.off('user_typing');
  s.on('user_typing', callback);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
