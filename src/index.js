import './style.css';

import { createConnection, sendMessage } from './ws.js';
import {
  showAuthModal,
  hideAuthModal,
  showAuthError,
  hideAuthError,
  initAuth,
} from './auth.js';
import { renderUsers } from './users.js';
import { renderMessage } from './messages.js';

const API_URL = 'http://localhost:3000';

let socket = null;
let currentUserId = null;
let currentNickname = null;


function handleOpen() {
  console.log('WebSocket соединение установлено');
}


function handleMessage(event) {
  let data;

  try {
    data = JSON.parse(event.data);
  } catch (error) {
    console.error('Некорректный JSON от сервера', error);
    return;
  }

  if (Array.isArray(data)) {
    renderUsers(data, currentUserId);
    return;
  }

  if (data.type === 'send') {
    renderMessage(
      {
        user: {
          id: currentUserId,
          name: currentNickname,
        },
        message: data.message,
      },
      currentUserId
    );

    return;
  }

  console.warn('Неизвестный тип сообщения:', data.type);
}


function handleClose() {
  const status = document.querySelector('#connection-status');

  if (status) {
    status.classList.remove('hidden');
  }

  socket = null;
  currentUserId = null;
  currentNickname = null;

  showAuthModal();
}


function handleError(error) {
  console.error('Ошибка WebSocket:', error);
}


async function registerUser(nickname) {
  try {
    const response = await fetch(`${API_URL}/new-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nickname,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.status !== 'ok') {
      showAuthError(result.message || 'Не удалось зарегистрироваться');
      return;
    }

    currentUserId = result.user.id;
    currentNickname = result.user.name;

    hideAuthError();
    hideAuthModal();
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    showAuthError('Сервер недоступен');
  }
}


function initMessageForm() {
  const messageForm = document.querySelector('#message-form');
  const messageInput = document.querySelector('#message-input');

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
      return;
    }

    const sent = sendMessage(socket, {
      type: 'send',
      message,
    });

    if (sent) {
      messageInput.value = '';
      messageInput.focus();
    }
  });
}


function connect() {
  if (socket) {
    socket.close();
  }

  socket = createConnection({
    onOpen: handleOpen,
    onMessage: handleMessage,
    onClose: handleClose,
    onError: handleError,
  });
}


function init() {
  connect();

  showAuthModal();
  initAuth(registerUser);
  initMessageForm();
}


document.addEventListener('DOMContentLoaded', init);