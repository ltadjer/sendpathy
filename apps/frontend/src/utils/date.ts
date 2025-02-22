export function formatDate(dateString: string): string {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString).toLocaleDateString('fr-FR', options);
  return date.charAt(0).toUpperCase() + date.slice(1);
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}