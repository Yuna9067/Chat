const authModal = document.querySelector('#auth-modal');
const authForm = document.querySelector('#auth-form');
const nicknameInput = document.querySelector('#nickname-input');
const authError = document.querySelector('#auth-error');
const chat = document.querySelector('#chat');

export function showAuthModal() {
  authModal.classList.remove('hidden');
  chat.classList.add('hidden');
  nicknameInput.focus();
}

export function hideAuthModal() {
  authModal.classList.add('hidden');
  chat.classList.remove('hidden');
}

export function showAuthError(message) {
  authError.textContent = message;
  authError.classList.remove('hidden');
  nicknameInput.focus();
}

export function hideAuthError() {
  authError.classList.add('hidden');
}

export function initAuth(onSubmit) {
  authForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nickname = nicknameInput.value.trim();

    if (!nickname) {
      showAuthError('Введите никнейм');
      return;
    }

    onSubmit(nickname);
  });
}