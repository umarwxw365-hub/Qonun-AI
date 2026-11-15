import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory persistent state (with seed users and admin configuration)
interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'user';
  avatar: string;
  createdAt: string;
  lastActive: string;
  consultationsCount: number;
}

interface QueryLog {
  id: string;
  userId: string;
  username: string;
  prompt: string;
  category: string;
  language: string;
  timestamp: string;
  responseSnippet: string;
}

interface StoredChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
}

interface UserConversation {
  id: string;
  usernameKey: string;
  title: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredChatMessage[];
}

// Admin configuration: designated email or special username
const ADMIN_EMAIL = 'umarwxw365@gmail.com';
const ADMIN_DEFAULT_USERNAMES = ['admin', 'umar', 'umarwxw365', 'qonun_admin'];

// In-memory data store
const users: Map<string, User> = new Map();
const onlineUsers: Map<string, { userId: string; username: string; avatar: string; role: string; lastSeen: number }> = new Map();
const userConversations: Map<string, UserConversation[]> = new Map();
let totalVisitsCounter = 42; // realistic seeded visit count
const queriesLog: QueryLog[] = [];
let systemAnnouncement: { id: string; text: string; date: string; active: boolean } | null = {
  id: 'ann-1',
  text: 'Хуш омадед ба Qonun AI! Махзани расмии кодексҳои Ҷумҳурии Тоҷикистон (РТ) навсозӣ шуд.',
  date: new Date().toISOString(),
  active: true,
};

// Seed default admin account
const defaultAdminUser: User = {
  id: 'usr_admin_1',
  username: 'umar',
  passwordHash: 'admin123',
  role: 'admin',
  avatar: 'lawyer_gold',
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  consultationsCount: 15,
};
users.set(defaultAdminUser.username.toLowerCase(), defaultAdminUser);

// Seed a couple of demo users to make admin panel immediately rich and realistic
const demoUser1: User = {
  id: 'usr_demo_1',
  username: 'firuz_law',
  passwordHash: '123456',
  role: 'user',
  avatar: 'lawyer_man',
  createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  lastActive: new Date(Date.now() - 3600000 * 2).toISOString(),
  consultationsCount: 8,
};
const demoUser2: User = {
  id: 'usr_demo_2',
  username: 'shohrukh_dush',
  passwordHash: '123456',
  role: 'user',
  avatar: 'student_boy',
  createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  lastActive: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  consultationsCount: 4,
};
users.set(demoUser1.username.toLowerCase(), demoUser1);
users.set(demoUser2.username.toLowerCase(), demoUser2);

// Seed sample legal logs
queriesLog.push(
  {
    id: 'q-1',
    userId: demoUser1.id,
    username: demoUser1.username,
    prompt: 'Моддаи 244 Кодекси ҷиноятӣ - дуздии амвол аз манзил чӣ ҷазо дорад?',
    category: 'criminal',
    language: 'tg',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    responseSnippet: 'Тибқи қисми 2 банди «в» моддаи 244 КҶ ҶТ маҳрум сохтан аз озодӣ аз 2 то 5 сол пешбинӣ шудааст.',
  },
  {
    id: 'q-2',
    userId: demoUser2.id,
    username: demoUser2.username,
    prompt: 'Развод через суд и алименты на двоих детей по Семейному кодексу РТ',
    category: 'family',
    language: 'ru',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    responseSnippet: 'Согласно статье 82 Семейного кодекса РТ на двоих детей взыскивается 1/3 заработка.',
  }
);

// Dynamic Gemini SDK client initialization
function getAiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !key.trim() || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Cleanup stale online sessions (inactive > 45 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of onlineUsers.entries()) {
    if (now - session.lastSeen > 45000) {
      onlineUsers.delete(key);
    }
  }
}, 10000);

/* =========================================================
   AUTH & USER MANAGEMENT API
========================================================= */

// Register endpoint
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { username, password, avatar = 'lawyer_default', adminKey } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return res.status(400).json({
        error: 'Номи корбар бояд на камтар аз 3 аломат бошад / Имя пользователя должно быть не менее 3 символов.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      return res.status(400).json({
        error: 'Рамз бояд на камтар аз 4 аломат бошад / Пароль должен быть не менее 4 символов.',
      });
    }

    const cleanUsername = username.trim();
    const normalizedKey = cleanUsername.toLowerCase();

    // Enforce unique username requirement!
    if (users.has(normalizedKey)) {
      return res.status(409).json({
        error: 'Ин номи корбар аллакай истифода мешавад! Лутфан номи дигар интихоб намоед. / Это имя пользователя уже занято!',
      });
    }

    // Determine admin role
    const isAdmin =
      ADMIN_DEFAULT_USERNAMES.includes(normalizedKey) ||
      cleanUsername.toLowerCase().includes('umarwxw365') ||
      adminKey === 'umar2026' ||
      adminKey === 'admin123';

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: cleanUsername,
      passwordHash: password, // In production this would be bcrypt hash
      role: isAdmin ? 'admin' : 'user',
      avatar: avatar || 'lawyer_default',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      consultationsCount: 0,
    };

    users.set(normalizedKey, newUser);
    totalVisitsCounter += 1;

    return res.status(201).json({
      success: true,
      message: 'Бақайдгирӣ бомуваффақият анҷом ёфт / Регистрация успешна',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Хатогӣ дар сервер / Ошибка сервера' });
  }
});

// Login endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Номи корбар ва рамзро ворид кунед / Введите логин и пароль',
      });
    }

    const cleanUsername = username.trim();
    const normalizedKey = cleanUsername.toLowerCase();
    const user = users.get(normalizedKey);

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({
        error: 'Номи корбар ё рамз нодуруст аст / Неверный логин или пароль',
      });
    }

    user.lastActive = new Date().toISOString();
    totalVisitsCounter += 1;

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Хатогӣ дар сервер' });
  }
});

// Update profile / avatar
app.post('/api/auth/profile', (req: Request, res: Response) => {
  try {
    const { username, avatar } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });

    const user = users.get(username.trim().toLowerCase());
    if (!user) return res.status(404).json({ error: 'Корбар ёфт нашуд / Пользователь не найден' });

    if (avatar) {
      user.avatar = avatar;
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   HEARTBEAT & ONLINE TRACKING
========================================================= */

app.post('/api/analytics/heartbeat', (req: Request, res: Response) => {
  try {
    const { sessionId, userId, username, avatar = 'default', role = 'user' } = req.body;
    const sessionKey = sessionId || userId || req.ip || 'anon';

    onlineUsers.set(sessionKey, {
      userId: userId || 'guest',
      username: username || 'Меҳмон (Guest)',
      avatar,
      role: role || 'user',
      lastSeen: Date.now(),
    });

    return res.json({
      success: true,
      onlineCount: onlineUsers.size,
    });
  } catch {
    return res.json({ success: true, onlineCount: 1 });
  }
});

/* =========================================================
   ADMIN ONLY ENDPOINTS (PROTECTED)
========================================================= */

app.get('/api/admin/stats', (req: Request, res: Response) => {
  try {
    const adminKey = req.headers['x-admin-key'] as string;
    const userRole = req.headers['x-user-role'] as string;
    const username = (req.headers['x-username'] as string || '').toLowerCase();

    const isAuthorized =
      userRole === 'admin' ||
      ADMIN_DEFAULT_USERNAMES.includes(username) ||
      username.includes('umarwxw365') ||
      adminKey === 'umar2026' ||
      adminKey === 'admin123';

    if (!isAuthorized) {
      return res.status(403).json({
        error: 'Дастрасӣ танҳо барои Мудири кулл (Админ)! / Доступ разрешен только администратору!',
      });
    }

    // Format online users list
    const activeList = Array.from(onlineUsers.values()).map((s) => ({
      username: s.username,
      avatar: s.avatar,
      role: s.role,
      lastSeenSecondsAgo: Math.round((Date.now() - s.lastSeen) / 1000),
    }));

    // Registered users list
    const registeredList = Array.from(users.values()).map((u) => ({
      id: u.id,
      username: u.username,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.createdAt,
      lastActive: u.lastActive,
      consultationsCount: u.consultationsCount,
    }));

    return res.json({
      success: true,
      stats: {
        onlineCount: Math.max(1, onlineUsers.size),
        totalVisits: totalVisitsCounter,
        totalRegisteredUsers: users.size,
        totalQueries: queriesLog.length,
        activeUsersList: activeList,
        registeredUsersList: registeredList,
        recentQueries: queriesLog.slice(-20).reverse(),
        announcement: systemAnnouncement,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Announcement update
app.post('/api/admin/announcement', (req: Request, res: Response) => {
  const { text, active, adminKey } = req.body;
  const userRole = req.headers['x-user-role'] as string;

  if (userRole !== 'admin' && adminKey !== 'umar2026' && adminKey !== 'admin123') {
    return res.status(403).json({ error: 'Танҳо админ метавонад эълонро тағйир диҳад' });
  }

  systemAnnouncement = {
    id: `ann_${Date.now()}`,
    text: text || '',
    date: new Date().toISOString(),
    active: active ?? true,
  };

  return res.json({ success: true, announcement: systemAnnouncement });
});

app.get('/api/announcement', (_req: Request, res: Response) => {
  return res.json({ announcement: systemAnnouncement });
});

/* =========================================================
   AUTHENTICATED USER CONVERSATION HISTORY API
========================================================= */

function getAuthenticatedUsernameKey(userId?: string, username?: string): string | null {
  if (!userId || !username) return null;
  const cleanId = String(userId).trim();
  let decodedName = String(username);
  try {
    decodedName = decodeURIComponent(decodedName);
  } catch {
    // keep original if not URI encoded
  }
  const cleanName = decodedName.trim().toLowerCase();
  if (!cleanId || cleanId === 'guest' || !cleanName || cleanName === 'guest' || cleanName === 'меҳмон' || cleanName === 'гость' || cleanName === 'mehmon') {
    return null;
  }
  return cleanName;
}

app.get('/api/chat/history', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
  const username = (req.headers['x-username'] as string) || (req.query.username as string);
  const usernameKey = getAuthenticatedUsernameKey(userId, username);

  if (!usernameKey) {
    return res.status(401).json({
      error: 'Таърихи сӯҳбат танҳо барои корбарони воридшуда дастрас аст / История разговоров доступна только после входа в аккаунт.',
    });
  }

  const list = userConversations.get(usernameKey) || [];
  const sorted = [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return res.json({ success: true, conversations: sorted });
});

app.delete('/api/chat/history/:sessionId', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
  const username = (req.headers['x-username'] as string) || (req.query.username as string);
  const usernameKey = getAuthenticatedUsernameKey(userId, username);

  if (!usernameKey) {
    return res.status(401).json({ error: 'Танҳо корбарони воридшуда / Только для авторизованных пользователей' });
  }

  const list = userConversations.get(usernameKey) || [];
  const filtered = list.filter((c) => c.id !== req.params.sessionId);
  userConversations.set(usernameKey, filtered);
  return res.json({ success: true, conversations: filtered });
});

app.delete('/api/chat/history', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
  const username = (req.headers['x-username'] as string) || (req.query.username as string);
  const usernameKey = getAuthenticatedUsernameKey(userId, username);

  if (!usernameKey) {
    return res.status(401).json({ error: 'Танҳо корбарони воридшуда / Только для авторизованных пользователей' });
  }

  userConversations.set(usernameKey, []);
  return res.json({ success: true, conversations: [] });
});

/* =========================================================
   TAJIKISTAN LEGAL AI KNOWLEDGE ENGINE & API
========================================================= */

// Legal Consultation Chat Endpoint powered purely by Gemini API
app.post('/api/chat/ask', async (req: Request, res: Response) => {
  try {
    const { prompt, language = 'tg', username = 'Меҳмон', userId = 'guest', history, sessionId } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Лутфан саволи худро нависед / Введите ваш вопрос' });
    }

    const cleanPrompt = prompt.trim();
    const ai = getAiClient();

    if (!ai) {
      const missingKeyMsg =
        language === 'ru'
          ? 'API-ключ ИИ (GEMINI_API_KEY) не настроен на сервере.'
          : language === 'uz'
            ? 'Serverda AI API kaliti (GEMINI_API_KEY) sozlanmagan.'
            : language === 'en'
              ? 'AI API key (GEMINI_API_KEY) is not configured on the server.'
              : 'Калиди ИИ (GEMINI_API_KEY) дар сервер танзим нашудааст.';
      return res.status(503).json({ error: missingKeyMsg });
    }

    const systemInstruction = `
You are "Qonun AI" (Қонун AI) — an extraordinarily intelligent, warm, articulate, empathetic, and human-like Artificial Intelligence assistant and legal advisor for the Republic of Tajikistan (Ҷумҳурии Тоҷикистон / РТ) and users worldwide.

CORE CAPABILITIES & PERSONALITY:
0. IDENTITY, NAME & CREATOR / OWNER (STRICT RULE):
   - If anyone asks "кто ты?", "ты кто?", "кто твой создатель?", "кто владелец?", "кто тебя создал?", "ту кӣ ҳастӣ?", "созандаи ту кист?", "соҳиби ту кист?", "who are you?", "who created you?", "who is your owner?", "sen kimsan?", "kim yaratgan?":
     You MUST clearly and proudly state that your name is **Qonun AI** and your owner/creator is **Umar**!
     * Tajik (tg): "Ман **Qonun AI** ҳастам — ёвари ҳушманд ва мушовири ҳуқуқии шумо! Соҳиб ва созандаи ман **Umar** мебошад."
     * Russian (ru): "Я — **Qonun AI**, ваш умный помощник и юридический консультант! Мой владелец и создатель — **Umar**."
     * Uzbek (uz): "Men **Qonun AI** — aqlli yordamchi va yuridik maslahatchiman! Mening egam va yaratuvchim — **Umar**."
     * English (en): "I am **Qonun AI**, your intelligent assistant and legal advisor! My owner and creator is **Umar**."

1. NATURAL HUMAN-LIKE CONVERSATIONAL AI:
   - You converse naturally, intelligently, and warmly on ANY topic: law, everyday life, science, technology, history, math/calculations, translations (tg/ru/uz/en), drafting formal statements/contracts, or casual chat.
   - Understand typos, informal slang, and Tajik written in Latin script (e.g. "salom chi khel hasti?", "moddai 244 chi meguiyad?").
   - Be polite and respectful ("шумо" in Tajik, "вы" in Russian, "siz" in Uzbek).

2. CRITICAL BEHAVIOR WHEN INPUT IS UNCLEAR, AMBIGUOUS, OR CONFUSED:
   - If the user's message is ambiguous, fragmented, confused, or says "чи шуд", "вай чи", "бахшиш", "ма нафахмидам", "хз", "чо", "что это значит", DO NOT invent a random legal topic (never default to theft/Article 244 unless theft was actually asked).
   - Instead, politely ask for clarification:
     * Tajik (tg): "🤝 **Бахшиш, маънои инҷо чӣ буд?** Ман мақсади шуморо нафаҳмидам. Лутфан вазъият ё саволатонро каме аниқтар баён кунед, то ба шумо ёрии саҳеҳ расонам."
     * Russian (ru): "🤝 **Бахшиш (прошу прощения), не совсем понял: что именно вы имели в виду?** Пожалуйста, опишите ситуацию или вопрос подробнее, чтобы я мог дать точный ответ."
     * Uzbek (uz): "🤝 **Kechirasiz, bu yerda ma’nosi nima edi?** Savolingizni aniqroq yozing, yordam berishga tayyorman."
     * English (en): "🤝 **Apologies, what did you mean here?** Please clarify your question or situation so I can help accurately."

3. MANDATORY FIRST LINE RULE FOR TAJIKISTAN LEGAL / ARTICLE INQUIRIES:
   - Whenever the user asks about a law, crime, fine, penalty, or "in which article..." (e.g., "дар кадом модда...", "какая статья...", "чӣ ҷазо дорад..."):
     The VERY FIRST SENTENCE MUST BOLDLY STATE THE EXACT ARTICLE AND CODE OF TAJIKISTAN!
     Example (tg): "🏛️ **ДАР БОРАИ ДУЗДӢ ДАР МОДДАИ 244 КОДЕКСИ ҶИНОЯТИИ ҶУМҲУРИИ ТОҶИКИСТОН (КҶ ҶТ) ГУФТА ШУДААСТ!**"
     Example (ru): "🏛️ **О ВОРОВСТВЕ (КРАЖЕ) ГОВОРИТСЯ В СТАТЬЕ 244 УГОЛОВНОГО КОДЕКСА РЕСПУБЛИКИ ТАДЖИКИСТАН (УК РТ)!**"

4. COMPLETE TAJIKISTAN STATUTORY KNOWLEDGE BASE (USE EXACT CODES & FIGURES):
   - **Statutory Calculation Indicator (Нишондиҳанда барои ҳисобҳо)**: **1 нишондиҳанда = 72 сомонӣ (TJS)** in 2026. Always convert indicator ranges into exact Somoni sums when explaining fines.
   - **Criminal Code of RT (Кодекси ҷиноятии ҶТ / УК РТ)**:
     * Art. 104 — Одамкушӣ / Убийство (part 1: 8–15 yrs; part 2: 15–25 yrs or life).
     * Art. 110 — Расонидани зарари вазнин ба саломатӣ / Тяжкий вред здоровью.
     * Art. 120 — Таҳдиди куштан ё расонидани зарари вазнин / Угроза убийством.
     * Art. 138 — Таҷовуз ба номус / Изнасилование.
     * Art. 144 — Ҷамъоварӣ ва паҳн кардани маълумоти ҳаёти шахсӣ / Нарушение неприкосновенности частной жизни.
     * Art. 158 — Тӯҳмат / Клевета; Art. 135–136 (also check civil honor/dignity Art. 174 ГК РТ).
     * Art. 177 — Саркашӣ аз пардохти алимент / Уклонение от уплаты алиментов.
     * Art. 200–201 — Муомилоти ғайриқонунии воситаҳои нашъадор / Незаконный оборот наркотиков.
     * Art. 212 — Вайрон кардани қоидаҳои ҳаракат дар роҳ (ДТП с тяжким вредом/смертью).
     * Art. 237 — Авбошӣ / Хулиганство (part 1: fine/corrective work or up to 2 yrs; part 2: 2–5 yrs; part 3 with weapon: 5–7 yrs).
     * Art. 244 — Дуздӣ / Кража (part 1: 500–1000 indicators = 36,000–72,000 TJS or up to 2 yrs; part 2 group/home: 2–5 yrs; part 3 large scale: 5–8 yrs; part 4 especially large: 8–12 yrs).
     * Art. 247 — Қаллобӣ / Мошенничество (fine or 2–12 yrs depending on scale).
     * Art. 248 — Ғоратгарӣ / Грабеж (open theft, 3–12 yrs); Art. 249 — Роҳзанӣ / Разбой (armed/violent assault, 5–15 yrs).
     * Art. 250 — Тамаъҷӯӣ / Вымогательство и шантаж (part 1: 5–10 yrs; part 2: 7–12 yrs; part 3: 10–15 yrs).
     * Art. 292 — Саркашӣ аз супоридани андоз / Уклонение от уплаты налогов.
     * Art. 319–320 — Гирифтани пора ва додани пора / Получение и дача взятки.
     * Art. 343 — Саркашӣ аз хизмати ҳарбӣ / Уклонение от военной службы.
   - **Law on State Language of RT (Қонуни ҶТ «Дар бораи забони давлатӣ» № 553 / № 13 от 05.10.2009) & Art. 89 CoAO RT**:
     * Art. 3–4: State language is Tajik; Russian is language of interethnic communication.
     * Art. 14–18: Signs, shop names, outdoor ads, price tags, and official correspondence must be in Tajik first (duplicates in other languages allowed alongside).
     * Art. 89 CoAO RT: Violation penalty — citizens 15–20 indicators (1,080–1,440 TJS), officials 30–40 indicators (2,160–2,880 TJS).
   - **Administrative Code of RT (КҲМ ҶТ / КоАП РТ)**:
     * Art. 90 — Вайрон кардани қонуни масъулияти падару модар; Art. 481 — Қонуни танзими анъана ва ҷашну маросимҳо (100–500+ indicators).
     * Art. 316–336 — Traffic/БДА(ГАИ) violations (Art. 332 drunk driving: 150–300 indicators or 15 days arrest + license revocation 5 yrs; Art. 333 speeding: 1–5 indicators = 72–360 TJS).
     * Art. 460 — Майдаавбошӣ; Art. 463 — Passport/registration rules (1–3 indicators).
   - **Family Code of RT (Кодекси оилаи ҶТ / СК РТ)**:
     * Art. 13 — Marriage age: 18 (17 exceptionally by court order).
     * Art. 82 — Child Alimony: 1 child = 1/4 (25%), 2 children = 1/3 (33.3%), 3+ children = 1/2 (50%) of income.
   - **Civil, Labor, Tax, Land & Constitutional Law of RT**:
     * Constitution Art. 19–20 & UPK RT Art. 94: Presumption of innocence, right to immediate lawyer upon detention, right to remain silent, 72-hour maximum detention without court sanction.
     * Labor Code (2016): Max 40 hrs/week (Art. 64), min 24 calendar days paid annual leave (Art. 88), severance/unpaid wage claims.
     * Civil Code: Contracts & debt receipts (Art. 715), inheritance (Art. 1139–1180), moral/reputational harm (Art. 174).
     * Emergency numbers in Tajikistan: 101 (Fire), 102 (Police/Милитсия), 103 (Ambulance), 112 (Emergency/КЧС).

5. DOCUMENT DRAFTING, MATH & LANGUAGE:
   - Draft ready-to-fill legal templates (statements to ШВКД/police, prosecutor, court alimony claims, receipts) when asked.
   - Perform exact math, indicator-to-Somoni conversions (× 72), and alimony calculations accurately.
   - Respond fluently in the user's interface language: "${language}" (tg = Tajik, ru = Russian, uz = Uzbek, en = English), unless the user explicitly asks to translate or answer in another language.
`;

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history.slice(-8)) {
        if (msg.text && typeof msg.text === 'string' && msg.text.trim()) {
          contents.push({
            role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text.trim() }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: cleanPrompt }],
    });

    const callGeminiModel = async (modelName: string, timeoutMs: number): Promise<string> => {
      const geminiPromise = ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
        },
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Вақти посухи ИИ ба охир расид / Превышено время ожидания ответа ИИ')), timeoutMs)
      );
      const geminiResponse: any = await Promise.race([geminiPromise, timeoutPromise]);
      return (geminiResponse?.text || '').trim();
    };

    let replyText = '';
    try {
      replyText = await callGeminiModel('gemini-4-hydrogen', 6000);
    } catch (primaryErr: any) {
      const msg = String(primaryErr?.message || '');
      const isTransient =
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('high demand') ||
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('ба охир расид');
      if (isTransient) {
        replyText = await callGeminiModel('gemini-3.1-flash-lite', 20000);
      } else {
        throw primaryErr;
      }
    }

    if (!replyText) {
      return res.status(502).json({
        error:
          language === 'ru'
            ? 'ИИ вернул пустой ответ. Попробуйте переформулировать запрос.'
            : 'ИИ посухи холӣ баргардонд. Лутфан саволро аз нав фиристед.',
      });
    }

    // Determine category
    let category = 'general';
    const low = cleanPrompt.toLowerCase();
    if (low.includes('забон') || low.includes('язык') || low.includes('language') || low.includes('реклама')) {
      category = 'language_law';
    } else if (
      low.includes('дузд') ||
      low.includes('краж') ||
      low.includes('кушт') ||
      low.includes('убий') ||
      low.includes('шантаж') ||
      low.includes('вымогат') ||
      low.includes('тамаъ') ||
      low.includes('қаллоб') ||
      low.includes('мошен') ||
      low.includes('авбош') ||
      low.includes('хулиган') ||
      low.includes('тюрм') ||
      low.includes('ҷазо')
    ) {
      category = 'criminal';
    } else if (low.includes('ҷарима') || low.includes('штраф') || low.includes('гаи') || low.includes('бда') || low.includes('мошин') || low.includes('паспорт') || low.includes('шиноснома')) {
      category = 'administrative';
    } else if (low.includes('зан') || low.includes('шавҳар') || low.includes('никоҳ') || low.includes('талоқ') || low.includes('алимент') || low.includes('развод')) {
      category = 'family';
    } else if (low.includes('кор') || low.includes('маош') || low.includes('зарплата')) {
      category = 'labor';
    }

    // Log query for admin auditing
    const newLog: QueryLog = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      username,
      prompt: cleanPrompt,
      category,
      language,
      timestamp: new Date().toISOString(),
      responseSnippet: replyText.substring(0, 180) + '...',
    };
    queriesLog.push(newLog);

    const existingUser = users.get(username.toLowerCase());
    if (existingUser) {
      existingUser.consultationsCount = (existingUser.consultationsCount || 0) + 1;
    }

    // Persist conversation history ONLY for authenticated/registered users (NEVER for guests)
    const authUsernameKey = getAuthenticatedUsernameKey(userId, username);
    let savedSessionId: string | null = null;
    if (authUsernameKey) {
      const nowIso = new Date().toISOString();
      const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userList = userConversations.get(authUsernameKey) || [];
      let targetSession = sessionId ? userList.find((c) => c.id === sessionId) : undefined;

      const userMsg: StoredChatMessage = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        sender: 'user',
        text: cleanPrompt,
        timestamp: timeLabel,
      };
      const aiMsg: StoredChatMessage = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        sender: 'assistant',
        text: replyText,
        timestamp: timeLabel,
        category,
      };

      if (!targetSession) {
        targetSession = {
          id: sessionId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          usernameKey: authUsernameKey,
          title: cleanPrompt.length > 60 ? cleanPrompt.slice(0, 57) + '...' : cleanPrompt,
          language,
          createdAt: nowIso,
          updatedAt: nowIso,
          messages: [userMsg, aiMsg],
        };
        userList.unshift(targetSession);
      } else {
        targetSession.messages.push(userMsg, aiMsg);
        targetSession.updatedAt = nowIso;
      }

      userConversations.set(authUsernameKey, userList.slice(0, 50));
      savedSessionId = targetSession.id;
    }

    return res.json({
      success: true,
      reply: replyText,
      category,
      consultationId: newLog.id,
      sessionId: savedSessionId,
    });
  } catch (err: any) {
    let cleanError = err?.message || 'Хатогӣ дар баррасии дархост';
    let statusCode = 500;
    try {
      const parsed = JSON.parse(cleanError);
      if (parsed?.error?.message) {
        cleanError = parsed.error.message;
      }
      if (typeof parsed?.error?.code === 'number' && parsed.error.code >= 400) {
        statusCode = parsed.error.code;
      }
    } catch {
      // keep raw string if not JSON
    }
    return res.status(statusCode).json({ error: cleanError });
  }
});

/* =========================================================
   TAJIK CODES QUICK ACCESS DATABASE
========================================================= */

app.get('/api/codes/list', (_req: Request, res: Response) => {
  const codesData = [
    {
      id: 'language',
      titleTg: 'Қонуни забони давлатии ҶТ (№ 553 / № 13)',
      titleRu: 'Закон РТ «О государственном языке» (№ 553)',
      titleEn: 'State Language Act of RT (No. 553)',
      titleUz: 'TR Davlat tili haqidagi Qonuni (№ 553)',
      year: '2009 (аз 5 октябри соли 2009, № 553 / 13)',
      articlesCount: '28 модда',
      highlights: [
        { article: 'Моддаи 3-4', nameTg: 'Мақоми забони давлатӣ ва забони русӣ', sanction: 'Мақоми давлатӣ — забони тоҷикӣ, русӣ — муоширати байни миллатҳо' },
        { article: 'Моддаи 14-18', nameTg: 'Талабот ба овезаҳо, реклама ва нархномаҳо', sanction: 'Ҳатман бо забони тоҷикӣ, дубликат бо дигар забонҳо иҷозат аст' },
        { article: 'Моддаи 89 КҲМ ҶТ', nameTg: 'Ҷарима барои вайрон кардани Қонуни забон', sanction: 'Шахсони воқеӣ 15-20 нишондиҳанда (1080-1440 сомонӣ), роҳбарон 30-40 нишондиҳанда (2160-2880 сомонӣ)' },
      ],
    },
    {
      id: 'criminal',
      titleTg: 'Кодекси ҷиноятии ҶТ',
      titleRu: 'Уголовный кодекс РТ',
      titleEn: 'Criminal Code of RT',
      titleUz: 'TR Jinoyat Kodeksi',
      year: '1998 (бо тағйиру иловаҳо то 2026)',
      articlesCount: '405+ модда',
      highlights: [
        { article: 'Моддаи 244', nameTg: 'Дуздӣ (Кража)', sanction: 'аз ҷарима то 12 соли ҳабс' },
        { article: 'Моддаи 247', nameTg: 'Қаллобӣ (Мошенничество)', sanction: 'аз ҷарима то 12 соли ҳабс' },
        { article: 'Моддаи 237', nameTg: 'Авбошӣ (Хулиганство)', sanction: 'аз корҳои ислоҳӣ то 7 соли ҳабс' },
        { article: 'Моддаи 248', nameTg: 'Ғоратгарӣ (Грабеж)', sanction: 'аз 3 то 12 соли ҳабс' },
        { article: 'Моддаи 212', nameTg: 'Вайрон кардани қоидаҳои ҳаракат', sanction: 'аз ҷарима то 10 соли ҳабс' },
      ],
    },
    {
      id: 'administrative',
      titleTg: 'Кодекси ҳуқуқвайронкунии маъмурии ҶТ',
      titleRu: 'Кодекс об админ. правонарушениях РТ',
      titleEn: 'Administrative Code of RT',
      titleUz: 'TR Ma’muriy huquqbuzarliklar kodeksi',
      year: '2008 (нашри нав)',
      articlesCount: '670+ модда',
      highlights: [
        { article: 'Моддаи 333', nameTg: 'Вайрон кардани суръати ҳаракат', sanction: 'аз 1 то 5 нишондиҳанда (72-360 сомонӣ)' },
        { article: 'Моддаи 463', nameTg: 'Қоидаҳои шиноснома ва бақайдгирӣ', sanction: 'аз 1 то 3 нишондиҳанда' },
        { article: 'Моддаи 481', nameTg: 'Вайрон кардани қонуни танзим', sanction: 'ҷаримаҳои калон аз 100 то 500 нишондиҳанда' },
      ],
    },
    {
      id: 'family',
      titleTg: 'Кодекси оилаи Ҷумҳурии Тоҷикистон',
      titleRu: 'Семейный кодекс РТ',
      titleEn: 'Family Code of RT',
      titleUz: 'TR Oila Kodeksi',
      year: '1999',
      articlesCount: '178 модда',
      highlights: [
        { article: 'Моддаи 82', nameTg: 'Андозаи алимент барои кӯдакони ноболиғ', sanction: 'барои 1 кӯдак 1/4, барои 2 кӯдак 1/3, барои 3+ 1/2 даромад' },
        { article: 'Моддаи 13', nameTg: 'Синну соли никоҳӣ дар Тоҷикистон', sanction: '18 солагӣ (бо қарори суд истисноан 17 солагӣ)' },
      ],
    },
    {
      id: 'labor',
      titleTg: 'Кодекси меҳнати ҶТ',
      titleRu: 'Трудовой кодекс РТ',
      titleEn: 'Labor Code of RT',
      titleUz: 'TR Mehnat Kodeksi',
      year: '2016',
      articlesCount: '380 модда',
      highlights: [
        { article: 'Моддаи 64', nameTg: 'Муҳлати кори ҳаррӯза ва ҳафтаина', sanction: 'на бештар аз 40 соат дар як ҳафта' },
        { article: 'Моддаи 88', nameTg: 'Рухсатии меҳнатии ҳарсола', sanction: 'на камтар аз 24 рӯзи тақвимӣ бо пардохти маош' },
      ],
    },
  ];

  return res.json({ codes: codesData });
});

/* =========================================================
   VITE DEV SERVER & PRODUCTION STATIC SERVING
========================================================= */

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`⚖️ Qonun AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
