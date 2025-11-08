const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-500 animate-slide-up z-50 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('opacity-0', 'translate-y-[-1rem]');
    setTimeout(() => document.body.removeChild(notification), 500);
  }, 3000);
};

export const NotificationService = {
  success: (message: string) => showNotification(message, 'success'),
  error: (message: string) => showNotification(message, 'error')
};