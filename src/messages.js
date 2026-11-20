const messagesList = document.querySelector('#messages-list');

export function renderMessage(message, currentUserId) {
  const isOwn = message.user.id === currentUserId;

  const messageElement = document.createElement('div');
  messageElement.className = isOwn ? 'message message--own' : 'message message--other';

  const author = document.createElement('span');
  author.className = 'message-author';
  author.textContent = isOwn ? 'You' : message.user.name;

  const text = document.createElement('p');
  text.className = 'message-text';
  text.textContent = message.message;

  messageElement.append(author, text);
  messagesList.append(messageElement);

  messagesList.scrollTop = messagesList.scrollHeight;
}