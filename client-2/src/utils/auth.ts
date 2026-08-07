const buildCookie = (name: string, value: string, maxAge = 60 * 60 * 24 * 7) => {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
};

export const setAuthCookies = (token: string, username: string, role: string) => {
  if (typeof document === 'undefined') return;

  buildCookie('authToken', token);
  buildCookie('authUsername', username);
  buildCookie('authRole', role);
};

export const getCookie = (name: string) => {
  if (typeof document === 'undefined') return '';

  return document.cookie
    .split('; ')
    .map((cookie) => cookie.split('='))
    .reduce<Record<string, string>>((acc, [key, value]) => {
      acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
      return acc;
    }, {})[name] || '';
};

export const clearAuthCookies = () => {
  if (typeof document === 'undefined') return;

  ['authToken', 'authUsername', 'authRole'].forEach((name) => {
    document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; samesite=lax`;
  });
};
