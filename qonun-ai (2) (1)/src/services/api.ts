import { AdminStats, Language, LegalCode, User } from '../types';

export async function registerUser(payload: {
  username: string;
  password: string;
  avatar: string;
  adminKey?: string;
}): Promise<{ success: boolean; user: User; error?: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Хатогӣ дар бақайдгирӣ');
  }
  return data;
}

export async function loginUser(payload: {
  username: string;
  password: string;
}): Promise<{ success: boolean; user: User; error?: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Хатогӣ дар воридшавӣ');
  }
  return data;
}

export async function sendHeartbeat(payload: {
  sessionId: string;
  userId?: string;
  username?: string;
  avatar?: string;
  role?: string;
}): Promise<{ onlineCount: number }> {
  try {
    const res = await fetch('/api/analytics/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { onlineCount: 1 };
  }
}

export async function fetchAdminStats(auth: {
  adminKey?: string;
  role?: string;
  username?: string;
}): Promise<AdminStats> {
  const res = await fetch('/api/admin/stats', {
    method: 'GET',
    headers: {
      'x-admin-key': auth.adminKey || '',
      'x-user-role': auth.role || 'user',
      'x-username': encodeURIComponent(auth.username || ''),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Дастрасӣ маҳдуд аст');
  }
  return data.stats;
}

export async function setAdminAnnouncement(payload: {
  text: string;
  active: boolean;
  adminKey?: string;
  role?: string;
}): Promise<any> {
  const res = await fetch('/api/admin/announcement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': payload.role || 'user',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Хатогӣ дар интишори эълон');
  return data;
}

export async function fetchAnnouncement(): Promise<{ text: string; active: boolean } | null> {
  try {
    const res = await fetch('/api/announcement');
    const data = await res.json();
    return data.announcement;
  } catch {
    return null;
  }
}

export async function askLegalAI(payload: {
  prompt: string;
  language: Language;
  history?: any[];
  username?: string;
  userId?: string;
  sessionId?: string | null;
}): Promise<{ reply: string; category: string; consultationId: string; sessionId?: string | null }> {
  const res = await fetch('/api/chat/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Хатогӣ дар баррасии савол');
  }
  return data;
}

export async function fetchChatHistory(user: User): Promise<any[]> {
  try {
    const res = await fetch('/api/chat/history', {
      method: 'GET',
      headers: {
        'x-user-id': user.id,
        'x-username': encodeURIComponent(user.username),
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.conversations || [];
  } catch {
    return [];
  }
}

export async function deleteChatSession(user: User, sessionId: string): Promise<any[]> {
  const res = await fetch(`/api/chat/history/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': user.id,
      'x-username': encodeURIComponent(user.username),
    },
  });
  const data = await res.json();
  return data.conversations || [];
}

export async function clearChatHistory(user: User): Promise<void> {
  await fetch('/api/chat/history', {
    method: 'DELETE',
    headers: {
      'x-user-id': user.id,
      'x-username': encodeURIComponent(user.username),
    },
  });
}

export async function fetchCodes(): Promise<LegalCode[]> {
  try {
    const res = await fetch('/api/codes/list');
    const data = await res.json();
    return data.codes || [];
  } catch {
    return [];
  }
}
