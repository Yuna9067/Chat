const usersList = document.querySelector('#users-list');

export function renderUsers(users, currentUserId) {
  usersList.innerHTML = '';

  users.forEach((user) => {
    const item = document.createElement('li');
    item.textContent = user.id === currentUserId ? `${user.name} (You)` : user.name;

    usersList.append(item);
  });
}

export function removeUser(userId) {
  const users = Array.from(usersList.children);

  const userElement = users.find((item) => item.dataset.id === userId);

  if (userElement) {
    userElement.remove();
  }
}