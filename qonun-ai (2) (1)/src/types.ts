export type Language = 'tg' | 'ru' | 'en' | 'uz';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  avatar: string;
  createdAt?: string;
  lastActive?: string;
  consultationsCount?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  articlesCited?: string[];
  isAudioPlaying?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  language: Language;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface OnlineUserSession {
  username: string;
  avatar: string;
  role: string;
  lastSeenSecondsAgo: number;
}

export interface AdminStats {
  onlineCount: number;
  totalVisits: number;
  totalRegisteredUsers: number;
  totalQueries: number;
  activeUsersList: OnlineUserSession[];
  registeredUsersList: User[];
  recentQueries: {
    id: string;
    username: string;
    prompt: string;
    category: string;
    language: string;
    timestamp: string;
    responseSnippet: string;
  }[];
  announcement?: {
    id: string;
    text: string;
    date: string;
    active: boolean;
  } | null;
}

export interface CodeHighlight {
  article: string;
  nameTg: string;
  sanction: string;
}

export interface LegalCode {
  id: string;
  titleTg: string;
  titleRu: string;
  titleEn: string;
  titleUz: string;
  year: string;
  articlesCount: string;
  highlights: CodeHighlight[];
}
