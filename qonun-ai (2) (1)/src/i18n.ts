import { Language } from './types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    chat: string;
    codes: string;
    calculator: string;
    rights: string;
    admin: string;
    deviceMode: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    loginTab: string;
    registerTab: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    avatarLabel: string;
    uploadFromGallery: string;
    orChoosePreset: string;
    adminKeyLabel: string;
    adminKeyPlaceholder: string;
    submitRegister: string;
    submitLogin: string;
    logout: string;
    guest: string;
    alreadyHaveAccount: string;
    noAccount: string;
    usernameTaken: string;
    registrationSuccess: string;
    welcomeAdmin: string;
  };
  chat: {
    welcomeTitle: string;
    welcomeDesc: string;
    disclaimer: string;
    inputPlaceholder: string;
    sendButton: string;
    voiceActive: string;
    voiceListening: string;
    voiceUnsupported: string;
    stopAudio: string;
    playAudio: string;
    copied: string;
    copy: string;
    samplePromptsTitle: string;
    prompt1: string; // The user's exact example: theft from home
    prompt2: string; // Speeding fine
    prompt3: string; // Divorce and child support
    prompt4: string; // Labor rights / unpaid wages
    prompt5: string; // Detained by militia
    consultationTitle: string;
    analyzingLaw: string;
    articlesCited: string;
    historyTitle: string;
    newChat: string;
    noHistory: string;
    searchHistory: string;
    clearHistory: string;
    deleteChat: string;
    messagesCount: string;
  };
  calc: {
    title: string;
    subtitle: string;
    indicatorValue: string;
    enterIndicators: string;
    calculate: string;
    totalFine: string;
    presetsTitle: string;
    speedingFine: string;
    tintedWindows: string;
    redLight: string;
    traditionsLaw: string;
    noSeatbelt: string;
  };
  rights: {
    title: string;
    subtitle: string;
    rule1Title: string;
    rule1Desc: string;
    rule2Title: string;
    rule2Desc: string;
    rule3Title: string;
    rule3Desc: string;
    rule4Title: string;
    rule4Desc: string;
    rule5Title: string;
    rule5Desc: string;
  };
  admin: {
    title: string;
    subtitle: string;
    onlyForOwner: string;
    onlineUsers: string;
    totalVisits: string;
    registeredUsers: string;
    consultationsCount: string;
    livePresence: string;
    userAudit: string;
    recentQueries: string;
    announcementManager: string;
    announcementPlaceholder: string;
    broadcastBtn: string;
    announcementUpdated: string;
    role: string;
    joined: string;
    status: string;
    lastActive: string;
  };
}

export const translations: Record<Language, Translations> = {
  tg: {
    appName: 'Qonun AI',
    appSubtitle: 'Ҳушёри ҳуқуқии Ҷумҳурии Тоҷикистон',
    tagline: 'Машварат оид ба кодексҳо ва қонунҳои РТ бо забони тоҷикӣ',
    nav: {
      chat: 'Машварати ИИ',
      codes: 'Махзани Кодексҳо',
      calculator: 'Ҳисобкунаки ҷарима',
      rights: 'Ҳуқуқ ҳангоми боздошт',
      admin: 'Панели Мудир (Админ)',
      deviceMode: 'Намуди экран',
    },
    auth: {
      loginTitle: 'Воридшавӣ ба Qonun AI',
      registerTitle: 'Бақайдгирии корбари нав',
      loginTab: 'Воридшавӣ',
      registerTab: 'Бақайдгирӣ',
      usernameLabel: 'Номи корбар (Username)',
      usernamePlaceholder: 'Масалан: dilshod_law, umar, rustam',
      passwordLabel: 'Рамзи махфӣ (Парол)',
      passwordPlaceholder: 'Ҳадди ақал 4 аломат',
      avatarLabel: 'Интихоби расми профил (Аватар)',
      uploadFromGallery: 'Аз галереяи телефон/компютер бор кунед',
      orChoosePreset: 'Ё аватари омодаро интихоб кунед',
      adminKeyLabel: 'Калиди мудир (ихтиёрӣ барои Админ)',
      adminKeyPlaceholder: 'Барои соҳиби барнома',
      submitRegister: 'Эҷод кардани ҳисоб',
      submitLogin: 'Ворид шудан',
      logout: 'Баромадан',
      guest: 'Меҳмон',
      alreadyHaveAccount: 'Аллакай ҳисоб доред? Ворид шавед',
      noAccount: 'Ҳисоб надоред? Ба қайд гиред',
      usernameTaken: 'Ин номи корбар аллакай ба қайд гирифта шудааст! Лутфан дигар ном гузоред.',
      registrationSuccess: 'Шумо бомуваффақият сабти ном шудед!',
      welcomeAdmin: 'Хуш омадед, Мудири муҳтарам! Шумо ҳуқуқи админӣ доред.',
    },
    chat: {
      welcomeTitle: 'Салом! Саволи ҳуқуқии худро диҳед',
      welcomeDesc: 'Ман донишманди қонунҳо ва кодексҳои Ҷумҳурии Тоҷикистон ҳастам. Вазъияти худро шарҳ диҳед, ман мувофиқи моддаҳои расмӣ ва ҷазоҳои пешбинишуда машварат медиҳам.',
      disclaimer: 'Огоҳинома: Ин машварати ҳуқуқии автоматикунонидашудаи зеҳни сунъӣ буда, адвокати расмиро дар мурофиаи судӣ иваз намекунад.',
      inputPlaceholder: 'Саволи худро нависед (масалан: ман аз хона дуздӣ кардам, ҷазо чӣ гуна аст?)...',
      sendButton: 'Пурсидан',
      voiceActive: 'Сабти овоз фаъол аст...',
      voiceListening: 'Гӯш карда истодаам...',
      voiceUnsupported: 'Браузери шумо сабти овозро пуштибонӣ намекунад.',
      stopAudio: 'Қатъи хондан',
      playAudio: 'Гӯш кардан (Овоз)',
      copied: 'Нусхабардорӣ шуд!',
      copy: 'Нусха гирифтан',
      samplePromptsTitle: 'Саволҳои маъмули ҳуқуқӣ дар Тоҷикистон:',
      prompt1: 'Ман аз хонаи касе дуздӣ кардам, тибқи қонуни Тоҷикистон ба ман чӣ ҷазо таҳдид мекунад?',
      prompt2: 'Ҷарима барои баланд кардани суръати ҳаракат дар роҳ чанд сомонӣ аст?',
      prompt3: 'Ҳангоми талоқ ва ҷудошавӣ алимент барои 2 фарзанд чӣ гуна ҳисоб мешавад?',
      prompt4: 'Корфармо 3 моҳ боз маош намедиҳад, тибқи Кодекси меҳнати ҶТ чӣ кор кунам?',
      prompt5: 'Агар маро кормандони милитсия дар кӯча боздошт кунанд, ман чӣ ҳуқуқҳо дорам?',
      consultationTitle: 'Хулосаи расмии ҳуқуқӣ',
      analyzingLaw: 'Дар ҳоли ҷустуҷӯ ва таҳлили кодексҳои Ҷумҳурии Тоҷикистон...',
      articlesCited: 'Моддаҳои зикршудаи қонун',
      historyTitle: 'Таърихи сӯҳбатҳо',
      newChat: 'Сӯҳбати нав',
      noHistory: 'Ҳоло ягон сӯҳбати сабтшуда нест.',
      searchHistory: 'Ҷустуҷӯ дар таърихи сӯҳбатҳо...',
      clearHistory: 'Тоза кардани таърих',
      deleteChat: 'Нест кардан',
      messagesCount: 'паём',
    },
    calc: {
      title: 'Ҳисобкунаки ҷарима ва боҷҳои давлатӣ дар РТ',
      subtitle: 'Дар Тоҷикистон ҷаримаҳо бар асоси «Нишондиҳанда барои ҳисобҳо» муайян карда мешаванд.',
      indicatorValue: '1 нишондиҳанда барои ҳисобҳо = 72 сомонӣ (соли 2026)',
      enterIndicators: 'Миқдори нишондиҳандаро ворид кунед:',
      calculate: 'Ҳисоб кардан',
      totalFine: 'Маблағи умумии ҷарима:',
      presetsTitle: 'Ҷаримаҳои маъмул дар ҶТ:',
      speedingFine: 'Суръати барзиёд (аз 20 то 40 км/соат): 2 нишондиҳанда',
      tintedWindows: 'Сиёҳкунии шишаҳо бе иҷозатнома: 15-20 нишондиҳанда',
      redLight: 'Гузаштан аз чароғаки сурх: 3 нишондиҳанда',
      traditionsLaw: 'Вайрон кардани Қонуни танзим (тӯйҳо): 100-200 нишондиҳанда',
      noSeatbelt: 'Бе камарбанди бехатарӣ рондан: 1 нишондиҳанда',
    },
    rights: {
      title: 'Ҳуқуқҳои шаҳрванд ҳангоми боздошт аз ҷониби милитсия',
      subtitle: 'Тибқи Конститутсияи ҶТ ва Кодекси мурофиавии ҷиноятии ҶТ (КМҶ ҶТ)',
      rule1Title: '1. Ҳуқуқ ба хомӯшӣ (Моддаи 20 Конститутсия)',
      rule1Desc: 'Ҳеҷ кас вазифадор нест, ки ба муқобили худаш ва хешовандони наздикаш баёнот диҳад. То омадани адвокат метавонед хомӯш бимонед.',
      rule2Title: '2. Ҳуқуқ ба вакили мудофеъ (Адвокат)',
      rule2Desc: 'Аз лаҳзаи аввали дастгир шудан шумо ҳақ доред адвокати шахсӣ талаб кунед ё аз давлат адвокати ройгон пурсед.',
      rule3Title: '3. Ҳуқуқ ба занги телефонӣ ба наздикон',
      rule3Desc: 'Кормандони мақомот вазифадоранд дар давоми 3 соат ба наздикони шумо дар бораи ҷойи нигоҳдории шумо хабар диҳанд.',
      rule4Title: '4. Тартиб додани протоколи боздошт',
      rule4Desc: 'Протокол бояд на дертар аз 3 соат пас аз овардан ба шуъба тартиб дода шуда, ҳуқуқҳо фаҳмонида шаванд.',
      rule5Title: '5. Манъи шиканҷа ва таҳқир (Моддаи 18 Конститутсия)',
      rule5Desc: 'Ҳеҷ кас набояд ба шиканҷа, зӯроварӣ ва муносибати бераҳмона гирифтор карда шавад. Ҳама гуна баёноти бо зӯр гирифташуда эътибори қонунӣ надорад.',
    },
    admin: {
      title: 'Панели идоракунии Мудири кулл (Админ)',
      subtitle: 'Ин маълумот ва омор ТАНҲО барои Шумо (соҳиби замима) намоён аст.',
      onlyForOwner: 'Ҳуқуқи дастрасии махсус: Танҳо Шумо',
      onlineUsers: 'Корбарони онлайн дар ин лаҳза',
      totalVisits: 'Ҳамагӣ боздидҳо (Заходов)',
      registeredUsers: 'Корбарони бақайдгирифташуда',
      consultationsCount: 'Ҳамагӣ саволҳои ҳуқуқӣ',
      livePresence: 'Фаъолияти зиндаи корбарон',
      userAudit: 'Рӯйхати ҳамаи ҳисобҳои корбарон',
      recentQueries: 'Саволҳои охирини додашуда ба ИИ',
      announcementManager: 'Идоракунии эълони расмии саросарӣ',
      announcementPlaceholder: 'Матни эълонро барои ҳамаи корбарони барнома нависед...',
      broadcastBtn: 'Интишори эълон дар экран',
      announcementUpdated: 'Эълон бомуваффақият нав карда шуд!',
      role: 'Мақом',
      joined: 'Санаи сабт',
      status: 'Вазъият',
      lastActive: 'Охирин фаъолият',
    },
  },
  ru: {
    appName: 'Qonun AI',
    appSubtitle: 'Юрист ИИ по законам Республики Таджикистан',
    tagline: 'Консультация по законам и кодексам РТ на 4 языках',
    nav: {
      chat: 'Консультация ИИ',
      codes: 'База Кодексов',
      calculator: 'Калькулятор штрафов',
      rights: 'Права при задержании',
      admin: 'Панель Админа',
      deviceMode: 'Вид устройства',
    },
    auth: {
      loginTitle: 'Вход в Qonun AI',
      registerTitle: 'Регистрация пользователя',
      loginTab: 'Вход',
      registerTab: 'Регистрация',
      usernameLabel: 'Имя пользователя (Логин)',
      usernamePlaceholder: 'Например: dilshod, umar, lawyer_rt',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Не менее 4 символов',
      avatarLabel: 'Выберите аватар профиля',
      uploadFromGallery: 'Загрузить фото из галереи устройства',
      orChoosePreset: 'Или выберите готовый аватар',
      adminKeyLabel: 'Секретный ключ админа (только для владельца)',
      adminKeyPlaceholder: 'Для владельца приложения',
      submitRegister: 'Создать аккаунт',
      submitLogin: 'Войти',
      logout: 'Выйти',
      guest: 'Гость',
      alreadyHaveAccount: 'Уже есть аккаунт? Войти',
      noAccount: 'Нет аккаунта? Зарегистрироваться',
      usernameTaken: 'Это имя пользователя уже занято! Придумайте другое имя.',
      registrationSuccess: 'Вы успешно зарегистрированы!',
      welcomeAdmin: 'Добро пожаловать, Администратор! У вас полные права.',
    },
    chat: {
      welcomeTitle: 'Здравствуйте! Задайте юридический вопрос',
      welcomeDesc: 'Я знаю все законы и кодексы Республики Таджикистан (Уголовный, Гражданский, Семейный, КоАП, Трудовой). Опишите вашу ситуацию, и я назову статью и наказание.',
      disclaimer: 'Внимание: Данный сервис предоставляет автоматизированную юридическую справку ИИ и не заменяет адвоката в судебном заседании.',
      inputPlaceholder: 'Напишите ваш вопрос (например: я воровал чужое дома что мне грозит?)...',
      sendButton: 'Спросить',
      voiceActive: 'Запись голоса активна...',
      voiceListening: 'Слушаю вас...',
      voiceUnsupported: 'Ваш браузер не поддерживает голосовой ввод.',
      stopAudio: 'Остановить',
      playAudio: 'Озвучить ответ',
      copied: 'Скопировано в буфер!',
      copy: 'Скопировать',
      samplePromptsTitle: 'Популярные вопросы по законам Таджикистана:',
      prompt1: 'Я украл чужое имущество из дома (воровал чужое дома), что мне грозит по закону РТ?',
      prompt2: 'Какой штраф в сомони за превышение скорости на дороге в Таджикистане?',
      prompt3: 'Как начисляются алименты на двоих детей при разводе по Семейному кодексу РТ?',
      prompt4: 'Работодатель не платит зарплату 3 месяца, куда жаловаться по Трудовому кодексу?',
      prompt5: 'Что делать и какие права есть при задержании сотрудниками милиции?',
      consultationTitle: 'Правовое заключение',
      analyzingLaw: 'Анализирую статьи кодексов Республики Таджикистан...',
      articlesCited: 'Применимые статьи законодательства',
      historyTitle: 'История разговоров',
      newChat: 'Новый чат',
      noHistory: 'У вас пока нет сохранённых разговоров.',
      searchHistory: 'Поиск по истории разговоров...',
      clearHistory: 'Очистить историю',
      deleteChat: 'Удалить',
      messagesCount: 'сообщ.',
    },
    calc: {
      title: 'Калькулятор штрафов и пошлин в РТ',
      subtitle: 'В Таджикистане штрафы рассчитываются в «показателях для расчетов».',
      indicatorValue: '1 показатель для расчетов = 72 сомони (в 2026 г.)',
      enterIndicators: 'Введите количество показателей:',
      calculate: 'Рассчитать',
      totalFine: 'Сумма штрафа в сомони:',
      presetsTitle: 'Частые штрафы в Республике Таджикистан:',
      speedingFine: 'Превышение скорости (20-40 км/ч): 2 показателя',
      tintedWindows: 'Тонировка стекол без разрешения: 15-20 показателей',
      redLight: 'Проезд на красный свет: 3 показателя',
      traditionsLaw: 'Нарушение Закона об упорядочении традиций: 100-200 показателей',
      noSeatbelt: 'Езда без ремня безопасности: 1 показатель',
    },
    rights: {
      title: 'Права гражданина при задержании милицией в Таджикистане',
      subtitle: 'На основе Конституции РТ и Уголовно-процессуального кодекса РТ',
      rule1Title: '1. Право хранить молчание (Статья 20 Конституции РТ)',
      rule1Desc: 'Никто не обязан свидетельствовать против себя и близких родственников. Вы имеете право не давать показаний до прибытия адвоката.',
      rule2Title: '2. Право на защитника (Адвоката)',
      rule2Desc: 'С момента фактического задержания вы вправе требовать присутствия вашего адвоката или предоставления бесплатного дежурного защитника.',
      rule3Title: '3. Право на телефонный звонок',
      rule3Desc: 'Орган дознания обязан в течение 3 часов уведомить родственников о месте вашего нахождения.',
      rule4Title: '4. Протокол задержания в течение 3 часов',
      rule4Desc: 'Протокол должен быть составлен не позднее 3 часов после доставки в отдел с разъяснением всех прав.',
      rule5Title: '5. Абсолютный запрет пыток (Статья 18 Конституции РТ)',
      rule5Desc: 'Пытки, жестокое обращение строго запрещены законом. Принудительно выбитые признания юридической силы не имеют.',
    },
    admin: {
      title: 'Панель управления Владельца (Админа)',
      subtitle: 'Эта секретная статистика отображается ТОЛЬКО для Вас.',
      onlyForOwner: 'Эксклюзивный доступ: Только Владелец',
      onlineUsers: 'Пользователей онлайн прямо сейчас',
      totalVisits: 'Всего заходов (Визитов)',
      registeredUsers: 'Всего зарегистрированных аккаунтов',
      consultationsCount: 'Всего задано вопросов юристу',
      livePresence: 'Активные пользователи в реальном времени',
      userAudit: 'Реестр всех учетных записей',
      recentQueries: 'Последние вопросы пользователей к ИИ',
      announcementManager: 'Управление общесистемным объявлением',
      announcementPlaceholder: 'Текст объявления для всех пользователей...',
      broadcastBtn: 'Опубликовать объявление',
      announcementUpdated: 'Объявление успешно обновлено!',
      role: 'Роль',
      joined: 'Дата регистрации',
      status: 'Статус',
      lastActive: 'Активность',
    },
  },
  en: {
    appName: 'Qonun AI',
    appSubtitle: 'Legal AI for the Republic of Tajikistan',
    tagline: 'Legal consultation on RT codes and statutory penalties in 4 languages',
    nav: {
      chat: 'AI Consultation',
      codes: 'Codes Directory',
      calculator: 'Fine Calculator',
      rights: 'Rights Under Detention',
      admin: 'Admin Panel',
      deviceMode: 'Device View',
    },
    auth: {
      loginTitle: 'Sign In to Qonun AI',
      registerTitle: 'Create New Account',
      loginTab: 'Login',
      registerTab: 'Register',
      usernameLabel: 'Username',
      usernamePlaceholder: 'e.g. tajik_expert, umar',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 4 characters',
      avatarLabel: 'Profile Avatar',
      uploadFromGallery: 'Upload photo from device gallery',
      orChoosePreset: 'Or select a preset avatar',
      adminKeyLabel: 'Admin Secret Key (optional)',
      adminKeyPlaceholder: 'For the owner',
      submitRegister: 'Create Account',
      submitLogin: 'Sign In',
      logout: 'Log Out',
      guest: 'Guest',
      alreadyHaveAccount: 'Already have an account? Sign in',
      noAccount: "Don't have an account? Register",
      usernameTaken: 'This username is already taken! Please choose another one.',
      registrationSuccess: 'Account created successfully!',
      welcomeAdmin: 'Welcome, Administrator! You have full owner rights.',
    },
    chat: {
      welcomeTitle: 'Hello! Ask your legal question',
      welcomeDesc: 'I specialize in the Criminal, Civil, Administrative, and Family Codes of the Republic of Tajikistan. Describe your situation to receive statutory articles and penalties.',
      disclaimer: 'Disclaimer: This is an automated AI legal guide and does not replace representation by a licensed lawyer in court.',
      inputPlaceholder: 'Ask your question (e.g., I stole property from a house, what penalty do I face?)...',
      sendButton: 'Ask',
      voiceActive: 'Voice recording active...',
      voiceListening: 'Listening...',
      voiceUnsupported: 'Speech recognition is not supported in this browser.',
      stopAudio: 'Stop Audio',
      playAudio: 'Listen to Answer',
      copied: 'Copied to clipboard!',
      copy: 'Copy',
      samplePromptsTitle: 'Common legal inquiries in Tajikistan:',
      prompt1: 'I stole property by breaking into someone’s house, what prison term do I face in Tajikistan?',
      prompt2: 'What is the fine for driving 30 km/h over the speed limit in Dushanbe?',
      prompt3: 'How is child support calculated for two children upon divorce in Tajikistan?',
      prompt4: 'My employer has withheld salary for 3 months, what are my rights under RT Labor Code?',
      prompt5: 'What are my constitutional rights if stopped and detained by the police?',
      consultationTitle: 'Legal Assessment',
      analyzingLaw: 'Searching and analyzing Tajikistan Codes...',
      articlesCited: 'Applicable Legal Articles',
      historyTitle: 'Chat History',
      newChat: 'New Chat',
      noHistory: 'No saved conversations yet.',
      searchHistory: 'Search conversation history...',
      clearHistory: 'Clear History',
      deleteChat: 'Delete',
      messagesCount: 'msgs',
    },
    calc: {
      title: 'Tajikistan Penalty & Fine Calculator',
      subtitle: 'Fines in Tajikistan are measured in official "Calculation Indicators" (Нишондиҳанда барои ҳисобҳо).',
      indicatorValue: '1 Calculation Indicator = 72 Somoni (TJS in 2026)',
      enterIndicators: 'Enter number of calculation indicators:',
      calculate: 'Calculate',
      totalFine: 'Total Fine Amount in Somoni:',
      presetsTitle: 'Standard Fines in RT:',
      speedingFine: 'Speeding (20-40 km/h): 2 indicators',
      tintedWindows: 'Tinted windows without permit: 15-20 indicators',
      redLight: 'Running a red traffic light: 3 indicators',
      traditionsLaw: 'Violation of Traditions Regulation Act: 100-200 indicators',
      noSeatbelt: 'Driving without seatbelt: 1 indicator',
    },
    rights: {
      title: 'Citizen Rights During Detention by Police in Tajikistan',
      subtitle: 'Guaranteed by the RT Constitution and Criminal Procedure Code',
      rule1Title: '1. Right to Remain Silent (Article 20 Constitution)',
      rule1Desc: 'You are not obligated to testify against yourself or family members. You may refuse to answer questions until an attorney arrives.',
      rule2Title: '2. Right to Defense Counsel (Lawyer)',
      rule2Desc: 'From the exact moment of physical detention, you have the statutory right to a private attorney or a state-appointed public defender.',
      rule3Title: '3. Right to a Phone Call to Relatives',
      rule3Desc: 'Law enforcement is legally obligated to inform your relatives of your location within 3 hours.',
      rule4Title: '4. Detention Protocol Within 3 Hours',
      rule4Desc: 'A formal detention protocol detailing reasons and rights must be drafted within 3 hours of arrival at the station.',
      rule5Title: '5. Absolute Ban on Torture & Abuse (Article 18 Constitution)',
      rule5Desc: 'Torture or physical pressure is strictly prohibited. Coerced confessions have zero legal validity under RT law.',
    },
    admin: {
      title: 'Owner Admin Dashboard',
      subtitle: 'This real-time traffic & online analytics view is visible ONLY to You.',
      onlyForOwner: 'Owner Access Only',
      onlineUsers: 'Users Online Right Now',
      totalVisits: 'Total App Visits & Sessions',
      registeredUsers: 'Total Registered Accounts',
      consultationsCount: 'Total Legal Inquiries Answered',
      livePresence: 'Real-Time User Activity',
      userAudit: 'All Registered User Accounts',
      recentQueries: 'Recent Inquiries Processed by AI',
      announcementManager: 'Global Announcement Manager',
      announcementPlaceholder: 'Write an announcement to broadcast to all users...',
      broadcastBtn: 'Broadcast to All Users',
      announcementUpdated: 'Global announcement updated successfully!',
      role: 'Role',
      joined: 'Joined',
      status: 'Status',
      lastActive: 'Last Active',
    },
  },
  uz: {
    appName: 'Qonun AI',
    appSubtitle: 'Tojikiston Respublikasi qonunlari bo‘yicha sun’iy intellekt',
    tagline: 'Tojikiston kodekslari va qonunlari bo‘yicha 4 tilda professional maslahat',
    nav: {
      chat: 'AI Maslahati',
      codes: 'Kodekslar bazasi',
      calculator: 'Jarima hisoblagich',
      rights: 'Qo‘lga olinganda huquqlar',
      admin: 'Admin paneli',
      deviceMode: 'Qurilma ko‘rinishi',
    },
    auth: {
      loginTitle: 'Qonun AI tizimiga kirish',
      registerTitle: 'Foydalanuvchi ro‘yxatdan o‘tishi',
      loginTab: 'Kirish',
      registerTab: 'Ro‘yxatdan o‘tish',
      usernameLabel: 'Foydalanuvchi nomi (Login)',
      usernamePlaceholder: 'Masalan: umar, jurist_uz, dilshod',
      passwordLabel: 'Parol',
      passwordPlaceholder: 'Kamida 4 ta belgi',
      avatarLabel: 'Profil avatari',
      uploadFromGallery: 'Telefon galereyasidan rasm yuklash',
      orChoosePreset: 'Yoki tayyor avatarni tanlang',
      adminKeyLabel: 'Admin maxfiy kaliti (faqat egasi uchun)',
      adminKeyPlaceholder: 'Ilova egasi uchun',
      submitRegister: 'Hisob yaratish',
      submitLogin: 'Kirish',
      logout: 'Chiqish',
      guest: 'Mehmon',
      alreadyHaveAccount: 'Hisobingiz bormi? Kirish',
      noAccount: 'Hisobingiz yo‘qmi? Ro‘yxatdan o‘tish',
      usernameTaken: 'Bu foydalanuvchi nomi band! Boshqa nom tanlang.',
      registrationSuccess: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!',
      welcomeAdmin: 'Xush kelibsiz, Administrator! Sizda to‘liq admin huquqlari mavjud.',
    },
    chat: {
      welcomeTitle: 'Assalomu alaykum! Yuridik savolingizni bering',
      welcomeDesc: 'Men Tojikiston Respublikasining Jinoyat, Fuqarolik, Oila va Ma’muriy kodekslarini bilaman. Vaziyatingizni yozing, men qonun moddasi va jazoni tushuntiraman.',
      disclaimer: 'Ogohlantirish: Bu sun’iy intellektning avtomatlashtirilgan yuridik ma’lumotnomasi bo‘lib, sudda advokat o‘rnini bosmaydi.',
      inputPlaceholder: 'Savolingizni yozing (masalan: men birovning uyidan o‘g‘rilik qildim, menga nima bo‘ladi?)...',
      sendButton: 'So‘rash',
      voiceActive: 'Ovoz yozilmoqda...',
      voiceListening: 'Tinglayapman...',
      voiceUnsupported: 'Brauzeringiz ovoz bilan kiritishni qo‘llab-quvvatlamaydi.',
      stopAudio: 'To‘xtatish',
      playAudio: 'Ovozda tinglash',
      copied: 'Nusxa olindi!',
      copy: 'Nusxalash',
      samplePromptsTitle: 'Tojikiston qonunlari bo‘yicha ommabop savollar:',
      prompt1: 'Men birovning uyiga kirib o‘g‘rilik qildim, Tojikiston qonunlariga ko‘ra qancha jazo beriladi?',
      prompt2: 'Tojikiston yo‘llarida tezlikni oshirganlik uchun jarima qancha somoniy?',
      prompt3: 'Ajrashganda 2 ta bola uchun aliment qanday hisoblanadi?',
      prompt4: 'Ish beruvchi 3 oydan beri maosh bermayapti, Mehnat kodeksi bo‘yicha nima qilish kerak?',
      prompt5: 'Militsiya xodimlari ko‘chada to‘xtatib qo‘lga olganda qanday huquqlarim bor?',
      consultationTitle: 'Yuridik xulosa',
      analyzingLaw: 'Tojikiston Respublikasi kodekslari tahlil qilinmoqda...',
      articlesCited: 'Qo‘llaniladigan qonun moddalari',
      historyTitle: 'Suhbatlar tarixi',
      newChat: 'Yangi suhbat',
      noHistory: 'Hozircha saqlangan suhbatlar yo‘q.',
      searchHistory: 'Suhbatlar tarixidan qidirish...',
      clearHistory: 'Tarixni tozalash',
      deleteChat: 'O‘chirish',
      messagesCount: 'xabar',
    },
    calc: {
      title: 'Tojikistonda jarimalar hisoblagichi',
      subtitle: 'Tojikistonda jarimalar «hisob-kitob ko‘rsatkichi» asosida belgilanadi.',
      indicatorValue: '1 hisob-kitob ko‘rsatkichi = 72 somoniy (2026 yilda)',
      enterIndicators: 'Ko‘rsatkichlar sonini kiriting:',
      calculate: 'Hisoblash',
      totalFine: 'Jarima summasi (somoniyda):',
      presetsTitle: 'TR dagi odatiy jarimalar:',
      speedingFine: 'Tezlikni oshirish (20-40 km/s): 2 ko‘rsatkich',
      tintedWindows: 'Ruxsatsiz oynalarni qoraytirish: 15-20 ko‘rsatkich',
      redLight: 'Qizil chiroqdan o‘tish: 3 ko‘rsatkich',
      traditionsLaw: 'Urf-odatlarni tartibga solish qonunini buzish: 100-200 ko‘rsatkich',
      noSeatbelt: 'Xavfsizlik kamarini taqmaslik: 1 ko‘rsatkich',
    },
    rights: {
      title: 'Tojikistonda militsiya ushlab turganda fuqaro huquqlari',
      subtitle: 'TR Konstitutsiyasi va Jinoyat-protsessual kodeksiga asosan',
      rule1Title: '1. Sukut saqlash huquqi (TR Konstitutsiyasi 20-moddasi)',
      rule1Desc: 'Hech kim o‘ziga va yaqin qarindoshlariga qarshi ko‘rsatma berishga majbur emas. Advokat kelguncha gapirmaslik huquqiga egasiz.',
      rule2Title: '2. Himoyachi (Advokat) talab qilish huquqi',
      rule2Desc: 'Qo‘lga olingan dastlabki daqiqadan boshlab shaxsiy advokat yoki davlat hisobidan bepul navbatchi advokat talab qilishingiz mumkin.',
      rule3Title: '3. Yaqinlarga telefon qilish huquqi',
      rule3Desc: 'Tergov idorasi 3 soat ichida yaqinlaringizga siz qayerda ekanligingiz haqida xabar berishga majbur.',
      rule4Title: '4. 3 soat ichida bayonnoma tuzish',
      rule4Desc: 'Bo‘limga keltirilgandan so‘ng 3 soatdan kechiktirmay barcha huquqlar tushuntirilgan holda bayonnoma tuzilishi shart.',
      rule5Title: '5. Qiynoqlarni mutlaq taqiqlash (18-modda)',
      rule5Desc: 'Qiynoq va shafqatsiz muomala qat’iyan man etiladi. Majburiy olingan iqrorliklar qonuniy kuchga ega emas.',
    },
    admin: {
      title: 'Ilova Egasi (Admin) Boshqaruv Paneli',
      subtitle: 'Ushbu statistika va ma’lumotlar FAQAT Siz uchun ko‘rinadi.',
      onlyForOwner: 'Eksklyuziv kirish: Faqat Egasiga',
      onlineUsers: 'Ayni damda onlayn foydalanuvchilar',
      totalVisits: 'Jami tashriflar soni (Kirishlar)',
      registeredUsers: 'Ro‘yxatdan o‘tgan hisoblar',
      consultationsCount: 'Berilgan yuridik maslahatlar',
      livePresence: 'Real vaqtdagi faollik',
      userAudit: 'Barcha foydalanuvchilar ro‘yxati',
      recentQueries: 'Foydalanuvchilar tomonidan berilgan so‘nggi savollar',
      announcementManager: 'Umumiy e’lonni boshqarish',
      announcementPlaceholder: 'Barcha foydalanuvchilar uchun e’lon matnini yozing...',
      broadcastBtn: 'E’lonni chop etish',
      announcementUpdated: 'E’lon muvaffaqiyatli yangilandi!',
      role: 'Lavozim',
      joined: 'Qo‘shilgan sana',
      status: 'Holat',
      lastActive: 'Oxirgi faollik',
    },
  },
};
