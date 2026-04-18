const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
const RENDER_BACKEND_URL = 'https://ai-prompt-library-poun.onrender.com';

const isLocalhost = typeof window !== 'undefined' && LOCAL_HOSTS.has(window.location.hostname);

export const API_BASE_URL = isLocalhost ? '/api' : `${RENDER_BACKEND_URL}/api`;
