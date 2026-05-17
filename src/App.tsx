import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  ChevronLeft, 
  Send, 
  Bot,
  Archive,
  Fish as FishIcon,
  Mail,
  Smartphone,
  Battery,
  Check,
  Wifi,
  Signal,
  Palette,
  Phone,
  Camera,
  Gamepad2,
  Trophy,
  Ghost,
  Play,
  X,
  MessageSquare,
  ShoppingBag,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Twitter,
  Plus,
  Minus,
  User as UserIcon,
  Search,
  Lock,
  Unlock,
  Book,
  UtensilsCrossed,
  Wallet as WalletIcon,
  Leaf,
  Camera as CameraIcon,
  ChevronRight,
  Sparkles,
  Users,
  Heart,
  Trash2,
  Smile,
  Info,
  CheckCircle2,
  Reply,
  Layers,
  Circle,
  ClipboardList,
  RotateCw,
  RotateCcw,
  MapPin,
  Eye,
  Disc,
  Coins,
  Droplets,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Activity,
  ChevronDown,
  ChevronUp,
  Gift as GiftIcon,
  Globe,
  Key,
  Grid,
  Image,
  Maximize,
  Minimize,
  Download,
  Upload,
  User
} from 'lucide-react';
import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";

const getIconColor = (id: AppId) => {
  const colors: Record<string, string> = {
    messages: '#007AFF',
    settings: '#8E8E93',
    store: '#FF9500',
    kitchen: '#FF2D55',
    wallet: '#5856D6',
    garden: '#34C759',
    photos: '#FF9500',
    characters: '#AF52DE',
    warehouse: '#5856D6',
    fishing: '#007AFF',
    wheel: '#FFD60A',
    dex: '#FF3B30',
    moments: '#FF2D55',
    game: '#5856D6'
  };
  return colors[id] || '#8E8E93';
};

const getIconElement = (id: AppId) => {
  switch (id) {
    case 'messages': return <MessageCircle />;
    case 'settings': return <SettingsIcon />;
    case 'store': return <ShoppingBag />;
    case 'kitchen': return <UtensilsCrossed />;
    case 'wallet': return <WalletIcon />;
    case 'garden': return <Leaf />;
    case 'photos': return <Mail />;
    case 'characters': return <Users />;
    case 'warehouse': return <Archive />;
    case 'fishing': return <FishIcon />;
    case 'wheel': return <Disc />;
    case 'dex': return <BookOpen />;
    case 'moments': return <CameraIcon />;
    case 'game': return <Gamepad2 />;
    default: return <Smartphone />;
  }
};

const BUBBLE_PRESETS = [
  { name: '經典深藍', css: 'background: linear-gradient(135deg, #007AFF, #0056b3); color: white; border-radius: 18px 18px 2px 18px; border: none; shadow: none;' },
  { name: '浪漫粉嫩', css: 'background: linear-gradient(135deg, #FF9A9E, #FAD0C4); color: white; border-radius: 18px 18px 2px 18px; border: none; shadow: none;' },
  { name: '極簡透白', css: 'background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: inherit; border-radius: 18px;' },
  { name: '霓虹電綠', css: 'background: #000; color: #39FF14; border: 2px solid #39FF14; box-shadow: 0 0 8px #39FF14; font-weight: bold; border-radius: 10px;' },
  { name: '工業炭黑', css: 'background: #1c1c1e; border: 1px solid #3a3a3c; color: #fff; border-radius: 15px;' },
  { name: '優雅淡紫', css: 'background: #E6E6FA; color: #4B0082; border: 1px solid #D8BFD8; border-radius: 20px;' },
  { name: '復古牛皮', css: 'background: #f5deb3; color: #5d4037; border: 1px solid #d2b48c; border-radius: 4px;' },
  { name: '玻璃擬態', css: 'background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);' }
];

const ANIMAL_EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🕊', '🐇', '🐁', '🐀', '🐿', '🦔'];
function getRandomAnimalEmoji() { return ANIMAL_EMOJIS[Math.floor(Math.random() * ANIMAL_EMOJIS.length)]; }

const AvatarImage = ({ src, className }: { src: string, className?: string }) => {
  const isEmoji = src && src.length <= 4;
  if (isEmoji) {
    return (
      <div className={`${className} flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-3xl select-none`}>
        {src}
      </div>
    );
  }
  return <img src={src} className={className} />;
};

enum ScreenState { Locked = 'locked', Home = 'home', AppOpen = 'app-open' }
enum Language { ZH_TW = 'zh-TW', ZH_CN = 'zh-CN', EN = 'en', JA = 'ja' }

const TRANSLATIONS = {
  [Language.ZH_TW]: {
    settings: '設定',
    general: '語言',
    privacy: '存檔',
    language: '內建語言',
    appearance: '背景圖片與外觀',
    icons: '圖示與自定義名稱',
    aiConfig: 'AI 助手與 API 設定',
    reset: '重置玩家資料',
    exportSave: '導出存檔',
    importSave: '導入存檔',
    fullscreen: '全屏幕模式',
    search: '搜尋',
    appleID: 'Apple ID, iCloud, 媒體與購買項目',
    messages: '訊息',
    store: '商城',
    kitchen: '廚房',
    wallet: '錢包',
    garden: '花園',
    photos: '信箱',
    characters: '角色',
    warehouse: '倉庫',
    fishing: '釣魚',
    wheel: '每日轉盤',
    dex: '圖鑑',
    moments: '朋友圈',
    game: '遊戲',
    back: '返回',
    save: '儲存',
    cancel: '取消',
    confirm: '確定',
    success: '成功',
    error: '錯誤',
    importSuccess: '導入成功！',
    importError: '導入失敗，格式錯誤',
    resetConfirmTitle: '重置玩家資料',
    resetConfirmDesc: '確定要重置所有玩家資料嗎？這將刪除包含釣魚、花園、訊息、角色紀錄以及錢包金幣。此操作無法復原。',
    name: '姓名',
    signature: '簽名',
    age: '年齡',
    gender: '性別',
    signaturePlaceholder: '請輸入個人簽名',
    photoChange: '更換大頭照',
    clickToChange: '點擊大頭照更換',
    wallpaper: '背景圖片',
    lockScreen: '鎖定螢幕',
    homeScreen: '主畫面',
    darkMode: '深色模式',
    iconAndName: '更換圖示與名稱',
    changeIcon: '更換圖示',
    softwareVersion: '軟體版本'
  },
  [Language.ZH_CN]: {
    settings: '设置',
    general: '语言',
    privacy: '存档',
    language: '内置语言',
    appearance: '背景图片与外观',
    icons: '图标与自定义名称',
    aiConfig: 'AI 助手与 API 设置',
    reset: '重置玩家数据',
    exportSave: '导出存档',
    importSave: '导入存档',
    fullscreen: '全屏幕模式',
    search: '搜索',
    appleID: 'Apple ID, iCloud, 媒体与购买项目',
    messages: '消息',
    store: '商城',
    kitchen: '厨房',
    wallet: '钱包',
    garden: '花园',
    photos: '邮箱',
    characters: '角色',
    warehouse: '仓库',
    fishing: '钓鱼',
    wheel: '每日转盘',
    dex: '图鉴',
    moments: '朋友圈',
    game: '游戏',
    back: '返回',
    save: '保存',
    cancel: '取消',
    confirm: '確定',
    success: '成功',
    error: '错误',
    importSuccess: '导入成功！',
    importError: '导入失败，格式错误',
    resetConfirmTitle: '重置玩家数据',
    resetConfirmDesc: '确定要重置所有玩家数据吗？这将删除包含钓鱼、花园、消息、角色记录以及钱包金币。此操作无法恢复。',
    name: '姓名',
    signature: '签名',
    age: '年龄',
    gender: '性别',
    signaturePlaceholder: '请输入个人签名',
    photoChange: '更换头像',
    clickToChange: '点击头像更换',
    wallpaper: '背景图片',
    lockScreen: '锁定屏幕',
    homeScreen: '主画面',
    darkMode: '深色模式',
    iconAndName: '更换图标与名称',
    changeIcon: '更换图标',
    softwareVersion: '软件版本'
  },
  [Language.EN]: {
    settings: 'Settings',
    general: 'Language',
    privacy: 'Save',
    language: 'Built-in Language',
    appearance: 'Wallpaper & Appearance',
    icons: 'Icons & Names',
    aiConfig: 'AI Assistant & API',
    reset: 'Reset Player Data',
    exportSave: 'Export Save',
    importSave: 'Import Save',
    fullscreen: 'Full Screen Mode',
    search: 'Search',
    appleID: 'Apple ID, iCloud, Media & Purchases',
    messages: 'Messages',
    store: 'Store',
    kitchen: 'Kitchen',
    wallet: 'Wallet',
    garden: 'Garden',
    photos: 'Mail',
    characters: 'Characters',
    warehouse: 'Warehouse',
    fishing: 'Fishing',
    wheel: 'Daily Spin',
    dex: 'Pokédex',
    moments: 'Moments',
    game: 'Game',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',
    importSuccess: 'Import successful!',
    importError: 'Import failed, invalid format',
    resetConfirmTitle: 'Reset Player Data',
    resetConfirmDesc: 'Are you sure you want to reset all player data? This will delete fishing, garden, messages, character records, and wallet coins. This action cannot be undone.',
    name: 'Name',
    signature: 'Signature',
    age: 'Age',
    gender: 'Gender',
    signaturePlaceholder: 'Enter your signature',
    photoChange: 'Change Photo',
    clickToChange: 'Click to change photo',
    wallpaper: 'Wallpaper',
    lockScreen: 'Lock Screen',
    homeScreen: 'Home Screen',
    darkMode: 'Dark Mode',
    iconAndName: 'Change Icon & Name',
    changeIcon: 'Change Icon',
    softwareVersion: 'Software Version'
  },
  [Language.JA]: {
    settings: '設定',
    general: '言語',
    privacy: 'セーブ',
    language: '内蔵言語',
    appearance: '壁紙と外観',
    icons: 'アイコンと名前',
    aiConfig: 'AI アシスタントと API',
    reset: 'プレイヤーデータをリセット',
    exportSave: 'セーブデータをエクスポート',
    importSave: 'セーブデータをインポート',
    fullscreen: 'フルスクリーンモード',
    search: '検索',
    appleID: 'Apple ID, iCloud, メディアと購入',
    messages: 'メッセージ',
    store: 'ショップ',
    kitchen: 'キッチン',
    wallet: '財布',
    garden: '庭',
    photos: 'メール',
    characters: 'キャラクター',
    warehouse: '倉庫',
    fishing: '釣り',
    wheel: 'デイリースピン',
    dex: '図鑑',
    moments: 'モーメンツ',
    game: 'ゲーム',
    back: '戻る',
    save: '保存',
    cancel: 'キャンセル',
    confirm: '確認',
    success: '成功',
    error: 'エラー',
    importSuccess: 'インポートに成功しました！',
    importError: 'インポートに失敗しました。形式が正しくありません',
    resetConfirmTitle: 'プレイヤーデータをリセット',
    resetConfirmDesc: 'すべてのプレイヤーデータをリセットしてもよろしいですか？釣り、庭、メッセージ、キャラクターの記録、財布のコインが削除されます。この操作は取り消せません。',
    name: '名前',
    signature: '署名',
    age: '年齢',
    gender: '性別',
    signaturePlaceholder: '署名を入力してください',
    photoChange: '写真を変更',
    clickToChange: '写真をクリックして変更',
    wallpaper: '壁紙',
    lockScreen: 'ロック画面',
    homeScreen: 'ホーム画面',
    darkMode: 'ダークモード',
    iconAndName: 'アイコンと名前を変更',
    changeIcon: 'アイコンを変更',
    softwareVersion: 'ソフトウェアバージョン'
  }
};

const LOCALES = {
  [Language.ZH_TW]: 'zh-TW',
  [Language.ZH_CN]: 'zh-CN',
  [Language.EN]: 'en-US',
  [Language.JA]: 'ja-JP',
};
type AppId = 'messages' | 'settings' | 'store' | 'kitchen' | 'wallet' | 'garden' | 'photos' | 'characters' | 'warehouse' | 'fishing' | 'wheel' | 'dex' | 'moments' | 'game';

interface Message { role: 'user' | 'model'; text: string; id?: string; replyTo?: string; }
interface MomentGroup { id: string; name: string; characterIds: string[]; coverImage?: string; }
interface MomentComment { id: string; authorId: string; text: string; timestamp: number; }
interface MomentPost { id: string; groupId: string; authorId: string; text: string; imageUrl?: string; timestamp: number; likes: string[]; comments: MomentComment[]; }
interface ReceivedGift { id: string; giftId: string; senderId: string; senderName: string; timestamp: number; }
interface Memo { id: string; text: string; completed: boolean; }
interface UserProfile { name: string; age: string; gender: string; avatar: string; signature: string; walletBalance?: number; }
interface AISettings {
  apiKey: string;
  model: string;
  baseUrl: string; // 新增這一行，讓程式知道有「網址」這個欄位
}

// Game Types
type GameType = 'uno' | 'oldmaid' | 'charades';

interface UnoCard {
  id: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'wild';
  value: string; // 0-9, skip, reverse, draw2, draw4, wild
}

interface GamePlayer {
  id: string; // 'user' or character id
  name: string;
  avatar: string;
  hand: any[];
}
interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  title: string;
  timestamp: string;
  to?: string; // character name if transfer
}

interface Letter {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  deliveryTime: number;
  isRead: boolean;
  senderName: string;
}

interface Character {
  id: string;
  name: string;
  gender: string;
  age: string;
  personality: string;
  habits: string;
  signature: string;
  settings: string;
  avatar: string;
  favorability: number;
  messages: Message[];
  memos: Memo[];
  minResponseTime: number;
  maxResponseTime: number;
  maxMessagesPerTurn: number;
  chatBackground?: string;
  isChatHidden?: boolean;
  myBubbleCss?: string;
  theirBubbleCss?: string;
  charNickname?: string;
  userNickname?: string;
  relationship?: string;
  location?: string;
  locationInterval?: number;
  walletBalance?: number;
  proactiveInterval?: number; // In hours, 0 means disabled
  lastInteractionTime?: number; // Timestamp
  transactions?: Transaction[];
  proactiveFishing?: boolean;
  proactiveGarden?: boolean;
  autoSellFish?: boolean;
  canTransferToUser?: boolean;
  canUseStickers?: boolean;
  canSendGifts?: boolean;
  canPat?: boolean;
  customPrompt?: string;
  socialStatus?: string;
  activityLogs?: string[];
}

interface Fish {
  id: string;
  name: string;
  rarity: '一般' | '稀有' | '史詩' | '傳說';
  icon: string;
}

interface Trash {
  name: string;
  icon: string;
  priceRange: [number, number];
}

const FISH_TYPES: Fish[] = [
  { id: 'f1', name: '孔雀魚', rarity: '一般', icon: '🐟' }, { id: 'f2', name: '吳郭魚', rarity: '一般', icon: '🐟' },
  { id: 'f3', name: '秋刀魚', rarity: '一般', icon: '🐟' }, { id: 'f4', name: '沙丁魚', rarity: '一般', icon: '🐟' },
  { id: 'f5', name: '鯖魚', rarity: '一般', icon: '🐟' }, { id: 'f6', name: '白帶魚', rarity: '一般', icon: '🐟' },
  { id: 'f7', name: '虱目魚', rarity: '一般', icon: '🐟' }, { id: 'f8', name: '鯉魚', rarity: '一般', icon: '🐟' },
  { id: 'f9', name: '黑鮪魚', rarity: '一般', icon: '🐟' }, { id: 'f10', name: '鱸魚', rarity: '一般', icon: '🐟' },
  { id: 'f11', name: '小丑魚', rarity: '一般', icon: '🐠' }, { id: 'f12', name: '比目魚', rarity: '一般', icon: '🐟' },
  { id: 'f13', name: '鯰魚', rarity: '一般', icon: '🐟' }, { id: 'f14', name: '草魚', rarity: '一般', icon: '🐟' },
  { id: 'f15', name: '黃魚', rarity: '一般', icon: '🐟' },
  { id: 'f16', name: '石斑魚', rarity: '稀有', icon: '🐡' }, { id: 'f17', name: '旗魚', rarity: '稀有', icon: '🦈' },
  { id: 'f18', name: '曼波魚', rarity: '稀有', icon: '🐡' }, { id: 'f19', name: '河豚', rarity: '稀有', icon: '🐡' },
  { id: 'f20', name: '劍魚', rarity: '稀有', icon: '🦈' }, { id: 'f21', name: '鯛魚', rarity: '稀有', icon: '🐟' },
  { id: 'f22', name: '海馬', rarity: '稀有', icon: '🐉' }, { id: 'f23', name: '魟魚', rarity: '稀有', icon: '🥏' },
  { id: 'f24', name: '章魚', rarity: '稀有', icon: '🐙' }, { id: 'f25', name: '烏賊', rarity: '稀有', icon: '🦑' },
  { id: 'f26', name: '大白鯊', rarity: '史詩', icon: '🦈' }, { id: 'f27', name: '虎鯨', rarity: '史詩', icon: '🐋' },
  { id: 'f28', name: '鯨鯊', rarity: '史詩', icon: '🦈' }, { id: 'f29', name: '抹香鯨', rarity: '史詩', icon: '🐳' },
  { id: 'f30', name: '皇帶魚', rarity: '史詩', icon: '🐉' },
  { id: 'f31', name: '黃金龍魚', rarity: '傳說', icon: '🐉' }, { id: 'f32', name: '深海大王烏賊', rarity: '傳說', icon: '🦑' }
];

const TRASH_TYPES: Trash[] = [
  { name: '破舊的襪子', icon: '🧦', priceRange: [1, 2] },
  { name: '魚骨頭', icon: '🦴', priceRange: [1, 3] },
  { name: '破鞋子', icon: '👞', priceRange: [1, 2] },
  { name: '濕透的帽子', icon: '🧢', priceRange: [1, 3] },
  { name: '空鋁罐', icon: '🥫', priceRange: [1, 2] },
  { name: '生鏽的鐵罐', icon: '🛢️', priceRange: [1, 3] },
  { name: '海草糾纏的樹枝', icon: '🌿', priceRange: [1, 2] }
];

interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
}

const POSSIBLE_GIFTS: Gift[] = [
  { id: 'g1', name: '鮮花', icon: '🌹', price: 50 },
  { id: 'g2', name: '巧克力', icon: '🍫', price: 80 },
  { id: 'g3', name: '泰迪熊', icon: '🧸', price: 200 },
  { id: 'g4', name: '鑽石', icon: '💎', price: 1000 },
  { id: 'g5', name: '遊戲機', icon: '🎮', price: 500 },
  { id: 'g6', name: '精裝書', icon: '📚', price: 120 },
  { id: 'g7', name: '高級茶葉', icon: '🍵', price: 150 },
  { id: 'g8', name: '調色盤', icon: '🎨', price: 100 },
  { id: 'g9', name: '圍巾', icon: '🧣', price: 180 },
  { id: 'g10', name: '運動鞋', icon: '👟', price: 250 },
  { id: 'g11', name: '墨鏡', icon: '🕶', price: 90 },
  { id: 'g12', name: '手錶', icon: '⌚', price: 400 },
  { id: 'g13', name: '戒指', icon: '💍', price: 800 },
  { id: 'g14', name: '吉他', icon: '🎸', price: 350 },
  { id: 'g15', name: '相機', icon: '📸', price: 450 },
  { id: 'g16', name: '香氛蠟燭', icon: '🕯️', price: 70 },
  { id: 'g17', name: '精緻蛋糕', icon: '🍰', price: 60 },
  { id: 'g18', name: '紅酒', icon: '🍷', price: 300 },
  { id: 'g19', name: '拼圖', icon: '🧩', price: 40 },
  { id: 'g20', name: '滑板', icon: '🛹', price: 220 }
].map(g => ({ ...g, id: `gift_${g.id}` }));

interface Crop {
  id: string;
  name: string;
  icon: string;
  growthTime: number; // in hours
  sellPrice: number;
}

const CROP_TYPES: Crop[] = [
  { id: 'c1', name: '小麥', icon: '🌾', growthTime: 1, sellPrice: 50 },
  { id: 'c2', name: '玉米', icon: '🌽', growthTime: 2, sellPrice: 80 },
  { id: 'c3', name: '紅蘿蔔', icon: '🥕', growthTime: 3, sellPrice: 120 },
  { id: 'c4', name: '番茄', icon: '🍅', growthTime: 4, sellPrice: 150 },
  { id: 'c5', name: '馬鈴薯', icon: '🥔', growthTime: 5, sellPrice: 200 },
  { id: 'c6', name: '茄子', icon: '🍆', growthTime: 6, sellPrice: 250 },
  { id: 'c7', name: '南瓜', icon: '🎃', growthTime: 7, sellPrice: 300 },
  { id: 'c8', name: '鳳梨', icon: '🍍', growthTime: 8, sellPrice: 350 },
  { id: 'c9', name: '西瓜', icon: '🍉', growthTime: 9, sellPrice: 400 },
  { id: 'c10', name: '葡萄', icon: '🍇', growthTime: 10, sellPrice: 450 },
  { id: 'c11', name: '草莓', icon: '🍓', growthTime: 11, sellPrice: 500 },
  { id: 'c12', name: '櫻桃', icon: '🍒', growthTime: 12, sellPrice: 550 },
  { id: 'c13', name: '蜜桃', icon: '🍑', growthTime: 13, sellPrice: 600 },
  { id: 'c14', name: '芒果', icon: '🥭', growthTime: 14, sellPrice: 650 },
  { id: 'c15', name: '檸檬', icon: '🍋', growthTime: 15, sellPrice: 700 },
  { id: 'c16', name: '梨子', icon: '🍐', growthTime: 16, sellPrice: 750 },
  { id: 'c17', name: '蘋果', icon: '🍎', growthTime: 17, sellPrice: 800 },
  { id: 'c18', name: '奇異果', icon: '🥝', growthTime: 18, sellPrice: 850 },
  { id: 'c19', name: '番薯', icon: '🍠', growthTime: 19, sellPrice: 900 },
  { id: 'c20', name: '椰子', icon: '🥥', growthTime: 20, sellPrice: 950 },
  { id: 'c21', name: '向日葵', icon: '🌻', growthTime: 10, sellPrice: 1000 },
  { id: 'c22', name: '玫瑰', icon: '🌹', growthTime: 12, sellPrice: 1200 },
  { id: 'c23', name: '鬱金香', icon: '🌷', growthTime: 8, sellPrice: 900 },
  { id: 'c24', name: '香菇', icon: '🍄', growthTime: 5, sellPrice: 300 },
  { id: 'c25', name: '大蒜', icon: '🧄', growthTime: 6, sellPrice: 400 },
  { id: 'c26', name: '洋蔥', icon: '🧅', growthTime: 6, sellPrice: 400 },
  { id: 'c27', name: '白菜', icon: '🥬', growthTime: 4, sellPrice: 300 },
  { id: 'c28', name: '花椰菜', icon: '🥦', growthTime: 7, sellPrice: 500 },
  { id: 'c29', name: '辣椒', icon: '🌶️', growthTime: 3, sellPrice: 200 },
  { id: 'c30', name: '黃瓜', icon: '🥒', growthTime: 5, sellPrice: 350 }
];

interface GardenPatch {
  id: number;
  status: 'locked' | 'empty' | 'growing' | 'ready' | 'dead';
  cropId?: string;
  plantedTime?: number;
  lastWateredTime?: number;
  needsWatering?: boolean;
  waterCount?: number;
}


const MailboxApp = ({ 
  isDarkMode, 
  goHome, 
  letters, 
  setLetters, 
  characters,
  userProfile 
}: { 
  isDarkMode: boolean, 
  goHome: () => void, 
  letters: Letter[], 
  setLetters: React.Dispatch<React.SetStateAction<Letter[]>>,
  characters: Character[],
  userProfile: UserProfile
}) => {
  const [tab, setTab] = useState<'write' | 'inbox'>('write');
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const inbox = letters.filter(l => l.receiverId === 'user').sort((a, b) => b.timestamp - a.timestamp);

  const handleToggleChar = (id: string) => {
    setSelectedCharIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSendAll = () => {
    if (selectedCharIds.length === 0 || !content.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      const newLetters: Letter[] = selectedCharIds.map(charId => {
        const char = characters.find(c => c.id === charId);
        return {
          id: Math.random().toString(36).substr(2, 9),
          senderId: 'user',
          receiverId: charId,
          content: `給 ${char?.name || '朋友'}：\n\n${content}`,
          timestamp: Date.now(),
          deliveryTime: Date.now() + 3600000, 
          isRead: false,
          senderName: userProfile.name
        };
      });
      setLetters(prev => [...prev, ...newLetters]);
      setContent('');
      setSelectedCharIds([]);
      setIsSending(false);
      alert(`${newLetters.length} 封信件已投遞！`);
    }, 1000);
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-orange-50 text-amber-900' : 'bg-orange-50 text-amber-900'} overflow-hidden relative`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')]"></div>
      
      <div className="px-4 pt-16 pb-3 flex items-center justify-between border-b border-amber-200 z-10">
        <div className="flex gap-2">
          <button onClick={() => setTab('write')} className={`px-3 py-1 rounded-full text-xs font-bold ${tab === 'write' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-700'}`}>書信撰寫</button>
          <button onClick={() => setTab('inbox')} className={`px-3 py-1 rounded-full text-xs font-bold ${tab === 'inbox' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-700'}`}>查看信箱</button>
        </div>
        <button onClick={goHome} className="text-amber-600 font-medium">關閉</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 z-10">
        {tab === 'write' ? (
          <div className="bg-white/60 p-6 rounded-lg shadow-sm border border-amber-100 flex flex-col min-h-[300px]">
            <span className="text-sm font-bold opacity-60 mb-2">收件人 (多選)：</span>
            <div className="flex flex-wrap gap-2 mb-4">
              {characters.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => handleToggleChar(c.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border ${selectedCharIds.includes(c.id) ? 'bg-amber-600 text-white' : 'bg-transparent border-amber-200 text-amber-700'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <textarea 
              className="flex-1 bg-transparent w-full resize-none outline-none text-sm leading-relaxed"
              placeholder="在此寫下想說的話..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <button onClick={handleSendAll} className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-full font-bold">一鍵投遞</button>
          </div>
        ) : (
          <div className="space-y-4">
            {inbox.map(l => (
              <div key={l.id} className="p-4 bg-white rounded-lg border border-amber-200">
                <p className="font-bold text-sm">來自：{l.senderName}</p>
                <p className="text-xs">{l.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FishingApp = ({ isDarkMode, goHome, onCatchFish, onCatchTrash }: { isDarkMode: boolean, goHome: () => void, onCatchFish: (id: string) => void, onCatchTrash: (coins: number) => void }) => {
  const [isFishing, setIsFishing] = useState(false);
  const [bobberPos, setBobberPos] = useState(0);
  const requestRef = useRef<number>();
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const speedRef = useRef(2);

  const [resultModal, setResultModal] = useState<{type: 'fish' | 'trash', msg: string, sub?: string} | null>(null);

  const animate = () => {
    posRef.current += dirRef.current * speedRef.current;
    if (posRef.current >= 100) {
      posRef.current = 100;
      dirRef.current = -1;
      speedRef.current = 3.0 + Math.random() * 2;
    } else if (posRef.current <= 0) {
      posRef.current = 0;
      dirRef.current = 1;
      speedRef.current = 3.0 + Math.random() * 2;
    }
    setBobberPos(posRef.current);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isFishing) {
      requestRef.current = requestAnimationFrame(animate);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isFishing]);

  const handleStart = () => {
    setResultModal(null);
    posRef.current = 0;
    dirRef.current = 1;
    speedRef.current = 3.0 + Math.random();
    setBobberPos(0);
    setIsFishing(true);
  };

  const handleCatch = () => {
    setIsFishing(false);
    const pos = posRef.current;
    
    // zones: 0-20 red, 20-40 orange, 40-60 green, 60-80 orange, 80-100 red
    // Green: 40 to 60
    if (pos >= 40 && pos <= 60) {
      // Catch fish
      const roll = Math.random();
      let pool = [];
      if (roll < 0.65) pool = FISH_TYPES.filter(f => f.rarity === '一般');
      else if (roll < 0.95) pool = FISH_TYPES.filter(f => f.rarity === '稀有');
      else if (roll < 0.99) pool = FISH_TYPES.filter(f => f.rarity === '史詩');
      else pool = FISH_TYPES.filter(f => f.rarity === '傳說');
      
      const fish = pool[Math.floor(Math.random() * pool.length)] || FISH_TYPES[0];
      onCatchFish(fish.id);
      setResultModal({ type: 'fish', msg: `釣到了 ${fish.name}!`, sub: `稀有度: ${fish.rarity}` });
    } else {
      // Catch trash
      const trash = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
      const coins = Math.floor(Math.random() * (trash.priceRange[1] - trash.priceRange[0] + 1)) + trash.priceRange[0];
      onCatchTrash(coins);
      setResultModal({ type: 'trash', msg: `釣到了 ${trash.name}`, sub: `獲得了 ${coins} 金幣` });
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-blue-950 text-white' : 'bg-blue-50 text-blue-900'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex items-center justify-between border-b ${isDarkMode ? 'border-blue-900' : 'border-blue-200'}`}>
        <h2 className="text-2xl font-bold flex items-center gap-2"><FishIcon /> 釣魚</h2>
        <button onClick={goHome} className="text-[#76DE84] font-medium">關閉</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-12 relative overflow-hidden">
        {/* Background ocean waves mock */}
        <div className="absolute inset-0 opacity-10 flex flex-col justify-end pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-auto"><path fill="currentColor" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        </div>

        {/* Fishing Slider */}
        <div className="w-full max-w-sm relative h-12 bg-neutral-200 rounded-full overflow-hidden shadow-inner border-2 border-neutral-300">
          {/* Zones */}
          <div className="absolute top-0 left-0 h-full w-[20%] bg-red-400 opacity-80" />
          <div className="absolute top-0 left-[20%] h-full w-[20%] bg-orange-400 opacity-80" />
          <div className="absolute top-0 left-[40%] h-full w-[20%] bg-green-500 opacity-90 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
          <div className="absolute top-0 left-[60%] h-full w-[20%] bg-orange-400 opacity-80" />
          <div className="absolute top-0 left-[80%] h-full w-[20%] bg-red-400 opacity-80" />
          
          {/* Bobber Indicator */}
          <div 
            className="absolute top-0 h-full w-2 bg-black shadow-[0_0_5px_rgba(0,0,0,0.5)] z-10 transition-none"
            style={{ left: `${bobberPos}%`, transform: 'translateX(-50%)' }}
          />
          {/* Fish icon following bobber */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 z-20 text-xl transition-none"
            style={{ left: `${bobberPos}%`, transform: 'translate(-50%, -50%)', scaleX: dirRef.current === 1 ? -1 : 1 }}
          >
            🐟
          </div>
        </div>

        {/* Actions */}
        <div className="z-10 mt-8">
          {isFishing ? (
            <button 
              onClick={handleCatch}
              className="w-48 h-48 rounded-full bg-blue-500 hover:bg-blue-600 border-8 border-blue-300 text-white font-black text-3xl shadow-2xl active:scale-95 transition-transform"
            >
              拉竿！
            </button>
          ) : (
             <button 
              onClick={handleStart}
              className="px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
            >
              開始釣魚
            </button>
          )}
        </div>

        <p className="text-sm opacity-60 text-center px-6 z-10 font-medium">
          魚標（🐟）到達中間 <span className="text-green-500 font-bold">綠色區塊</span> 時點擊「拉竿」！<br/>
          紅色/橘色區塊只會釣到垃圾（隨機獲得金幣）。
        </p>
      </div>

      {resultModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-xs ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} rounded-3xl p-6 text-center shadow-2xl`}
          >
            <div className="text-6xl mb-4 animate-bounce">
              {resultModal.type === 'fish' ? '🎉' : '🗑️'}
            </div>
            <h3 className="text-2xl font-black mb-2">{resultModal.msg}</h3>
            <p className={`text-sm mb-6 ${resultModal.type === 'fish' ? 'text-orange-500 font-bold' : 'text-neutral-500'}`}>
              {resultModal.sub}
            </p>
            <button 
              onClick={() => setResultModal(null)}
              className="w-full py-3 bg-[#76DE84] hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
            >
              繼續
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const DexApp = ({ isDarkMode, goHome }: { isDarkMode: boolean, goHome: () => void }) => {
  const [activeTab, setActiveTab] = useState<'fish' | 'crops'>('fish');
  const [expandedRarity, setExpandedRarity] = useState<string | null>(null);

  const rarities = ['一般', '稀有', '史詩', '傳說'];
  const categorizedFish = rarities.reduce((acc, r) => {
    acc[r] = FISH_TYPES.filter(f => f.rarity === r);
    return acc;
  }, {} as Record<string, typeof FISH_TYPES>);

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-200'} bg-opacity-80 backdrop-blur-md z-10 sticky top-0`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen /> 圖鑑</h2>
          <button onClick={goHome} className="text-[#76DE84] font-medium">關閉</button>
        </div>
        <div className={`flex p-1 rounded-xl w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-gray-200'}`}>
          <button 
            onClick={() => setActiveTab('fish')} 
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${activeTab === 'fish' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            魚貨
          </button>
          <button 
            onClick={() => setActiveTab('crops')} 
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${activeTab === 'crops' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            作物
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'fish' && (
          <div className="space-y-4">
            {rarities.map(rarity => {
              const items = categorizedFish[rarity];
              if (items.length === 0) return null;
              
              let rarityColor = 'text-white bg-gray-500';
              if (rarity === '稀有') rarityColor = 'text-white bg-blue-500';
              if (rarity === '史詩') rarityColor = 'text-white bg-purple-500';
              if (rarity === '傳說') rarityColor = 'text-white bg-orange-500';

              return (
                <div key={rarity} className={`rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} overflow-hidden`}>
                  <button 
                    onClick={() => setExpandedRarity(expandedRarity === rarity ? null : rarity)}
                    className={`w-full p-4 flex justify-between items-center ${rarityColor}`}
                  >
                    <span className="font-bold text-lg">{rarity}等級</span>
                    <span className="text-sm font-medium">{items.length} 種</span>
                  </button>
                  {expandedRarity === rarity && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3">
                      {items.map(info => (
                        <div key={info.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-gray-50'} shadow-sm relative`}>
                          <div className="text-4xl mb-2">{info.icon}</div>
                          <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'crops' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-8">
            {CROP_TYPES.map(info => (
              <div key={info.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm relative`}>
                <div className="text-4xl mb-2">{info.icon}</div>
                <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface Recipe {
  id: string;
  name: string;
  description: string;
  icon: string;
  ingredients: { name: string; amount: number }[];
  type: 'fish' | 'crop';
}

const RECIPES: Recipe[] = [
  // Fish Recipes
  { id: 'r1', name: '烤吳郭魚', description: '外皮焦香的鹽烤吳郭魚，簡單又美味的家常料理。', icon: '🐟', ingredients: [{ name: '吳郭魚', amount: 1 }], type: 'fish' },
  { id: 'r2', name: '鯉魚湯', description: '溫補養生的鯉魚熬湯，滋味鮮甜。', icon: '🍲', ingredients: [{ name: '鯉魚', amount: 1 }], type: 'fish' },
  { id: 'r3', name: '鹽烤鯖魚', description: '富含油脂的鯖魚，撒點鹽巴烘烤就非常迷人。', icon: '🐠', ingredients: [{ name: '鯖魚', amount: 1 }], type: 'fish' },
  { id: 'r4', name: '鮭魚生魚片', description: '新鮮肥美的鮭魚切片，入口即化。', icon: '🍣', ingredients: [{ name: '鮭魚', amount: 1 }], type: 'fish' },
  { id: 'r5', name: '鮪魚肚', description: '上等鮪魚肚肉，豐富的油脂讓口感極佳。', icon: '🍱', ingredients: [{ name: '黑鮪魚', amount: 1 }], type: 'fish' },
  { id: 'r6', name: '糖醋小丑魚', description: '酸甜開胃的糖醋做法，魚肉與番茄完美結合。', icon: '🥘', ingredients: [{ name: '小丑魚', amount: 1 }, { name: '番茄', amount: 1 }], type: 'fish' },
  { id: 'r7', name: '皇帶魚湯', description: '稀有海產熬製的高級湯品，聽說能帶來好運。', icon: '🍲', ingredients: [{ name: '皇帶魚', amount: 1 }], type: 'fish' },
  { id: 'r8', name: '烤腔棘魚', description: '活化石般的珍稀魚類，用簡單炭烤保留原始風味。', icon: '🍢', ingredients: [{ name: '腔棘魚', amount: 1 }], type: 'fish' },
  { id: 'r19', name: '紅燒石斑魚', description: '皮 Q 肉潤的石斑魚，搭配蔥蒜紅燒最是下飯。', icon: '🥘', ingredients: [{ name: '石斑魚', amount: 1 }], type: 'fish' },
  { id: 'r20', name: '香煎旗魚排', description: '口感紮實如肉類的旗魚排，擠上一點檸檬汁更清爽。', icon: '🥩', ingredients: [{ name: '旗魚', amount: 1 }, { name: '檸檬', amount: 1 }], type: 'fish' },
  { id: 'r21', name: '涼拌曼波魚', description: '富含膠質的曼波魚皮，涼拌後口感爽脆滑溜。', icon: '🥣', ingredients: [{ name: '曼波魚', amount: 1 }], type: 'fish' },
  { id: 'r22', name: '河豚生魚片', description: '極致鮮美的珍饈，需經過高超技術處理的藝術料理。', icon: '🍱', ingredients: [{ name: '河豚', amount: 1 }], type: 'fish' },
  { id: 'r23', name: '章魚小丸子', description: 'Q彈章魚塊裹上麵糊烘烤，淋上美乃滋與柴魚片。', icon: '🍡', ingredients: [{ name: '章魚', amount: 1 }, { name: '小麥', amount: 1 }], type: 'fish' },
  { id: 'r24', name: '香酥炸烏賊圈', description: '外酥內嫩的黃金烏賊圈，配上特製沾醬停不下來。', icon: '🍤', ingredients: [{ name: '烏賊', amount: 1 }], type: 'fish' },
  { id: 'r25', name: '清蒸鱸魚', description: '以清蒸保留鱸魚最原始的鮮甜，滋潤養生。', icon: '🐟', ingredients: [{ name: '鱸魚', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'fish' },
  { id: 'r26', name: '黃金龍魚羹', description: '傳說中能增加福氣的高級料理，湯頭如黃金般亮眼。', icon: '🍜', ingredients: [{ name: '黃金龍魚', amount: 1 }], type: 'fish' },
  
  // Crop Recipes
  { id: 'r9', name: '麵包', description: '用小麥研磨烘焙的金黃麵包，香氣撲鼻。', icon: '🍞', ingredients: [{ name: '小麥', amount: 2 }], type: 'crop' },
  { id: 'r10', name: '烤玉米', description: '刷上特製醬汁烤到微焦的玉米，夜市經典美味。', icon: '🌽', ingredients: [{ name: '玉米', amount: 1 }], type: 'crop' },
  { id: 'r11', name: '紅蘿蔔汁', description: '現榨新鮮紅蘿蔔汁，健康又營養滿分。', icon: '🥕', ingredients: [{ name: '紅蘿蔔', amount: 1 }], type: 'crop' },
  { id: 'r12', name: '番茄湯', description: '濃郁酸甜的番茄熬湯，開胃好選擇。', icon: '🥣', ingredients: [{ name: '番茄', amount: 2 }], type: 'crop' },
  { id: 'r13', name: '烤馬鈴薯', description: '帶皮烤熟的鬆軟馬鈴薯，搭配奶油最對味。', icon: '🥔', ingredients: [{ name: '馬鈴薯', amount: 1 }], type: 'crop' },
  { id: 'r14', name: '南瓜湯', description: '顏色金黃的濃郁南瓜湯，口感滑順香甜。', icon: '🎃', ingredients: [{ name: '南瓜', amount: 1 }], type: 'crop' },
  { id: 'r15', name: '草莓果醬', description: '新鮮草莓熬煮的手工果醬，搭配麵包最合適。', icon: '🍓', ingredients: [{ name: '草莓', amount: 2 }], type: 'crop' },
  { id: 'r16', name: '蘋果派', description: '酸甜蘋果餡配上酥脆派皮，經典的下午茶甜點。', icon: '🥧', ingredients: [{ name: '蘋果', amount: 1 }, { name: '小麥', amount: 1 }], type: 'crop' },
  { id: 'r17', name: '西瓜汁', description: '冰透的西瓜打成汁，夏日解暑最佳良伴。', icon: '🍉', ingredients: [{ name: '西瓜', amount: 1 }], type: 'crop' },
  { id: 'r18', name: '蒜炒高麗菜', description: '爆香大蒜與清脆白菜的快炒，簡單美味。', icon: '🥗', ingredients: [{ name: '白菜', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'crop' },
  { id: 'r27', name: '魚香茄子', description: '茄子軟嫩入味，雖無實魚卻有濃厚鮮香味。', icon: '🍆', ingredients: [{ name: '茄子', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'crop' },
  { id: 'r28', name: '蜜汁鳳梨酥', description: '鳳梨與小麥製作的經典點心，甜而不膩。', icon: '🍍', ingredients: [{ name: '鳳梨', amount: 1 }, { name: '小麥', amount: 1 }], type: 'crop' },
  { id: 'r29', name: '櫻桃慕斯', description: '點綴著新鮮櫻桃的精緻慕斯，酸甜誘人。', icon: '🍒', ingredients: [{ name: '櫻桃', amount: 1 }], type: 'crop' },
  { id: 'r30', name: '草莓蜜桃塔', description: '草莓與蜜桃的完美組合，充滿少女心。', icon: '🥧', ingredients: [{ name: '草莓', amount: 1 }, { name: '蜜桃', amount: 1 }], type: 'crop' },
  { id: 'r31', name: '檸檬乳酪蛋糕', description: '清新的檸檬香氣搭配濃郁乳酪，口感綿密。', icon: '🍰', ingredients: [{ name: '檸檬', amount: 1 }, { name: '小麥', amount: 1 }], type: 'crop' },
  { id: 'r32', name: '向日葵種子餅', description: '酥脆的穀物小食，營養又富有口感。', icon: '🍪', ingredients: [{ name: '向日葵', amount: 1 }, { name: '小麥', amount: 1 }], type: 'crop' },
  { id: 'r33', name: '奶油蘑菇濃湯', description: '香濃的奶油底帶出香菇的野味精華。', icon: '🥣', ingredients: [{ name: '香菇', amount: 2 }], type: 'crop' },
  { id: 'r34', name: '涼拌手拍小黃瓜', description: '爽脆清潤，是夏日最棒的開胃涼菜。', icon: '🥒', ingredients: [{ name: '黃瓜', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'crop' },
  { id: 'r35', name: '烤番薯', description: '簡單烘烤即出的甜蜜香氣，溫暖人心。', icon: '🍠', ingredients: [{ name: '番薯', amount: 1 }], type: 'crop' },
  { id: 'r36', name: '芒果沙拉', description: '新鮮芒果切丁拌入蔬果，充滿熱帶氣息。', icon: '🥗', ingredients: [{ name: '芒果', amount: 1 }], type: 'crop' },
];

const KitchenApp = ({ 
  isDarkMode, 
  goHome,
  warehouseItems,
  setWarehouseItems,
  characters,
  setCharacters
}: { 
  isDarkMode: boolean;
  goHome: () => void;
  warehouseItems: {id: string, amount: number}[];
  setWarehouseItems: React.Dispatch<React.SetStateAction<{id: string, amount: number}[]>>;
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const fishRecipes = RECIPES.filter(r => r.type === 'fish');
  const cropRecipes = RECIPES.filter(r => r.type === 'crop');

  const getPageContent = () => {
    const list = currentPage === 0 ? fishRecipes : cropRecipes;
    const mid = Math.ceil(list.length / 2);
    const leftCol = list.slice(0, mid);
    const rightCol = list.slice(mid);
    return { leftCol, rightCol };
  };

  const getInventoryItem = (name: string) => {
    const fish = FISH_TYPES.find(f => f.name === name);
    const crop = CROP_TYPES.find(c => c.name === name);
    const item = fish || crop;
    if (!item) return { id: '', total: 0 };
    const stock = warehouseItems.find(w => w.id === item.id);
    return { id: item.id, total: stock ? stock.amount : 0 };
  };

  const cookRecipe = () => {
    if (!selectedRecipe) return;
    
    // Deduct items
    setWarehouseItems(prev => {
      let newItems = [...prev];
      for (const ing of selectedRecipe.ingredients) {
        const itemInfo = getInventoryItem(ing.name);
        if (itemInfo.id) {
          const itemIdx = newItems.findIndex(i => i.id === itemInfo.id);
          if (itemIdx > -1) {
            newItems[itemIdx] = { ...newItems[itemIdx], amount: newItems[itemIdx].amount - ing.amount };
          }
        }
      }
      return newItems.filter(i => i.amount > 0);
    });

    setShowGiftModal(true);
  };

  const giveGiftTo = (characterId: string) => {
    setCharacters(prev => prev.map(c => 
      c.id === characterId 
        ? { ...c, favorability: c.favorability + 10 }
        : c
    ));
    setShowGiftModal(false);
    setSelectedRecipe(null);
  };

  if (selectedRecipe) {
    const canCook = selectedRecipe.ingredients.every(ing => getInventoryItem(ing.name).total >= ing.amount);

    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1a1510] text-[#e0c9a3]' : 'bg-[#f4e4bc] text-black'} overflow-hidden`}>
        <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#382818] bg-[#2a1a0f]/80' : 'border-[#d4c49c] bg-[#f4e4bc]/80'} backdrop-blur-md z-10 sticky top-0`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2"><UtensilsCrossed /> 料理製作</h2>
            <button onClick={() => setSelectedRecipe(null)} className="text-[#76DE84] font-medium">返回</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center">
          <div className={`w-full max-w-md rounded-2xl p-6 ${isDarkMode ? 'bg-[#2a1a0f] border border-[#3a2a18]' : 'bg-[#fdf5e6] shadow-xl border border-amber-900/10'}`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedRecipe.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{selectedRecipe.name}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-[#cba677]' : 'text-[#8b5a2b]'}`}>{selectedRecipe.description}</p>
            </div>

            <div className={`rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-[#1a1510]' : 'bg-[#f4e4bc]/50'}`}>
              <h4 className="font-bold mb-3 border-b border-dashed pb-2">所需材料</h4>
              <div className="space-y-3">
                {selectedRecipe.ingredients.map((ing, idx) => {
                  const inventory = getInventoryItem(ing.name);
                  const hasEnough = inventory.total >= ing.amount;
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm font-medium">
                      <span>{ing.name} x{ing.amount}</span>
                      <span className={`${hasEnough ? (isDarkMode ? 'text-green-400' : 'text-green-700') : 'text-red-500'}`}>
                        庫存: {inventory.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={cookRecipe}
              disabled={!canCook}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${canCook ? 'bg-[#FF9500] text-white hover:bg-[#ff8800]' : (isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-300 text-gray-500')}`}
            >
              製作料理
            </button>
          </div>
        </div>

        {showGiftModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl p-6 ${isDarkMode ? 'bg-[#2a1a0f]' : 'bg-white'} shadow-2xl`}>
              <h3 className="text-xl font-bold text-center mb-4">要把做好的【{selectedRecipe.name}】送給誰？</h3>
              {characters.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">目前還沒有認識的角色哦！</p>
                  <button onClick={() => {setShowGiftModal(false); setSelectedRecipe(null);}} className="text-[#76DE84] font-bold">自己吃掉 (完成)</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                  {characters.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => giveGiftTo(c.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-[#3a2a18] bg-[#1a1510]' : 'hover:bg-amber-50 bg-[#fdf5e6]'}`}
                    >
                      <div className="text-3xl">{c.avatar}</div>
                      <div className="flex-1 text-left">
                        <div className="text-[10px] opacity-40 italic mb-1">將料理贈送給</div>
                        <div className="font-bold text-lg text-amber-900 dark:text-amber-200">{c.name}</div>
                        <div className="text-xs text-pink-500 font-bold">💖 當前好感度: {c.favorability}</div>
                      </div>
                      <ArrowRight size={20} className="text-[#FF9500]" />
                    </button>
                  ))}
                  <button onClick={() => {setShowGiftModal(false); setSelectedRecipe(null);}} className={`w-full text-center py-3 mt-4 text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    不送了，自己吃掉
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const { leftCol, rightCol } = getPageContent();

  const renderRecipe = (r: Recipe) => (
    <button key={r.id} onClick={() => setSelectedRecipe(r)} className="w-full text-left mb-4 p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{r.icon}</span>
          <span className="font-bold text-[#5c3a21] dark:text-[#e0c9a3] text-sm md:text-base">{r.name}</span>
        </div>
        <ArrowRight size={16} className="text-amber-900/40 dark:text-amber-100/40" />
      </div>
      <div className="text-xs text-[#8b5a2b] dark:text-[#cba677] pl-8">
        - {r.ingredients.map(i => `${i.name} x${i.amount}`).join(', ')}
      </div>
    </button>
  );

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1a1510] text-[#e0c9a3]' : 'bg-[#f4e4bc] text-black'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#382818] bg-[#2a1a0f]/80' : 'border-[#d4c49c] bg-[#f4e4bc]/80'} backdrop-blur-md z-10 sticky top-0`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-[#e0c9a3]' : 'text-[#8b4513]'}`}><UtensilsCrossed /> 食譜</h2>
          <button onClick={goHome} className="text-[#76DE84] font-medium">關閉</button>
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col items-center justify-center relative ${isDarkMode ? 'bg-[#1a1510]' : 'bg-[#f4e4bc]/50'}`}>
        <div className={`w-full max-w-2xl h-[90%] relative shadow-2xl rounded-sm flex ring-1 ${isDarkMode ? 'bg-[#2a1a08] ring-black' : 'bg-[#fdf5e6] ring-amber-900/10'}`}>
          {/* Middle spine shadow */}
          <div className="absolute inset-y-0 left-1/2 w-8 -ml-4 bg-gradient-to-r from-black/5 via-black/10 to-black/5 z-10 pointer-events-none"></div>
          
          {/* Left Page */}
          <div className={`flex-1 p-3 sm:p-6 border-r relative overflow-y-auto page-scroll ${isDarkMode ? 'border-[#3a2a18]' : 'border-[#d4c49c]/50'}`}>
             <h3 className={`text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 border-b-2 border-dashed pb-2 ${isDarkMode ? 'text-[#cba677] border-[#cba677]/30' : 'text-[#8b4513] border-[#8b4513]/30'}`}>
               {currentPage === 0 ? '魚貨料理' : '作物料理'}
             </h3>
             <div className="space-y-2">
               {leftCol.map(renderRecipe)}
             </div>
          </div>
          
          {/* Right Page */}
          <div className="flex-1 p-3 sm:p-6 relative overflow-y-auto page-scroll">
             <h3 className={`text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 border-b-2 border-dashed pb-2 ${isDarkMode ? 'text-[#cba677] border-[#cba677]/30' : 'text-[#8b4513] border-[#8b4513]/30'}`}>
               {currentPage === 0 ? '更多海寶' : '更多珍饈'}
             </h3>
             <div className="space-y-2 pb-12">
               {rightCol.map(renderRecipe)}
             </div>
             
             {/* Flip button */}
             <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20">
               {currentPage === 0 ? (
                 <button onClick={() => setCurrentPage(1)} className={`flex items-center gap-1 transition-colors animate-pulse p-2 rounded-full ${isDarkMode ? 'text-[#cba677] bg-[#3a2a18]/50 hover:text-white' : 'text-[#8b4513] bg-amber-200/50 hover:text-amber-900'}`}>
                   <ArrowRight size={24} />
                 </button>
               ) : (
                 <button onClick={() => setCurrentPage(0)} className={`flex items-center gap-1 transition-colors p-2 rounded-full ${isDarkMode ? 'text-[#cba677] bg-[#3a2a18]/50 hover:text-white' : 'text-[#8b4513] bg-amber-200/50 hover:text-amber-900'}`}>
                   <ArrowLeft size={24} />
                 </button>
               )}
             </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .page-scroll::-webkit-scrollbar { width: 4px; }
        .page-scroll::-webkit-scrollbar-track { background: transparent; }
        .page-scroll::-webkit-scrollbar-thumb { background: rgba(139, 69, 19, 0.2); border-radius: 4px; }
      `}} />
    </div>
  );
};

const Header = ({ title, onBack, isDarkMode }: { title: string, onBack: () => void, isDarkMode: boolean }) => (
  <div className={`px-4 pt-16 pb-3 flex items-center border-b ${isDarkMode ? 'bg-[#1c1c1e] border-[#38383a]' : 'bg-[#f2f2f7] border-neutral-200'} sticky top-0 z-10`}>
    <button onClick={onBack} className="text-[#76DE84] flex items-center gap-0.5 font-medium transition-colors"><ChevronLeft size={20} strokeWidth={2.5} /> 返回</button>
    <h2 className={`flex-1 text-center font-bold mr-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>{title}</h2>
  </div>
);

const StoreApp = ({ walletBalance, setWalletBalance, addTransaction, setWarehouseItems, dailyStoreItems, isDarkMode, goHome, warehouseItems, characters, setCharacters }: any) => {
  const [activeCategory, setActiveCategory] = useState<'fish' | 'crops' | 'gifts'>('fish');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sellAmount, setSellAmount] = useState<string>('1');

  const buyItem = (id: string, name: string, price: number, icon: string) => {
    if (walletBalance >= price) {
      setWalletBalance((p: number) => p - price);
      addTransaction('expense', price, `購買 ${name}`);
      setWarehouseItems((prev: any) => {
        const existing = prev.find((i: any) => i.id === id);
        if (existing) return prev.map((i: any) => i.id === id ? { ...i, amount: i.amount + 1 } : i);
        return [...prev, { id, amount: 1 }];
      });
    }
  };

  const currentItems = activeCategory === 'fish' 
    ? dailyStoreItems.fish.map((item: any) => ({ ...item, ...FISH_TYPES.find(f => f.id === item.id) }))
    : activeCategory === 'crops'
    ? dailyStoreItems.crops.map((item: any) => ({ ...item, ...CROP_TYPES.find(c => c.id === item.id) }))
    : dailyStoreItems.gifts.map((item: any) => ({ ...item, ...POSSIBLE_GIFTS.find(g => g.id === item.id) }));

  const ownedAmount = selectedItem ? (warehouseItems.find((i: any) => i.id === selectedItem.id)?.amount || 0) : 0;

  if (selectedItem) {
    const isGift = selectedItem.id.startsWith('gift');

    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden`}>
        <Header title={selectedItem.name} onBack={() => { setSelectedItem(null); setSellAmount('1'); }} isDarkMode={isDarkMode} />
        <div className="flex-1 overflow-y-auto p-6 space-y-8 flex flex-col items-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-8xl mt-8 drop-shadow-xl">
            {selectedItem.icon}
          </motion.div>
          
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black">{selectedItem.name}</h3>
            <div className={`px-4 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/40'}`}>
              目前擁有: {ownedAmount}
            </div>
          </div>

          <div className={`w-full p-6 rounded-[32px] ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} shadow-sm space-y-6`}>
            {!isGift ? (
              <>
                <div className="flex flex-col items-center gap-4">
                  <span className="text-xs font-bold opacity-30 uppercase tracking-widest">販售單價: ${selectedItem.price}</span>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setSellAmount(prev => Math.max(1, parseInt(prev || '0') - 1).toString())}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-[#f2f2f7]'}`}
                    >
                      <Minus size={24} />
                    </button>
                    <input 
                      type="number" 
                      value={sellAmount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val)) setSellAmount('');
                        else setSellAmount(Math.min(ownedAmount, Math.max(1, val)).toString());
                      }}
                      className="w-20 text-center text-4xl font-black bg-transparent outline-none"
                    />
                    <button 
                      onClick={() => setSellAmount(prev => Math.min(ownedAmount, parseInt(prev || '0') + 1).toString())}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-[#f2f2f7]'}`}
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold opacity-40">總收益估計</span>
                    <span className="text-2xl font-black text-[#76DE84]">${selectedItem.price * (parseInt(sellAmount) || 0)}</span>
                  </div>
                  <button 
                    disabled={ownedAmount === 0 || !sellAmount || parseInt(sellAmount) === 0}
                    onClick={() => {
                      const amount = parseInt(sellAmount);
                      const totalPrice = selectedItem.price * amount;
                      setWalletBalance((p: number) => p + totalPrice);
                      addTransaction('income', totalPrice, `販售 ${amount} 個 ${selectedItem.name}`);
                      setWarehouseItems((prev: any) => {
                        return prev.map((i: any) => i.id === selectedItem.id ? { ...i, amount: i.amount - amount } : i).filter((i: any) => i.amount > 0);
                      });
                      setSelectedItem(null);
                      setSellAmount('1');
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-xl transition-all active:scale-95 ${ownedAmount === 0 ? 'bg-neutral-300 text-neutral-500 opacity-50' : 'bg-[#76DE84] text-white shadow-lg'}`}
                  >
                    立即販售
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold opacity-30 uppercase tracking-widest">購買價格</span>
                  <div className="text-4xl font-black text-[#FF2D55]">${selectedItem.price}</div>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold opacity-40 border-l-2 border-[#FF2D55] pl-2">選擇贈送對象</span>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {characters.map((char: Character) => (
                      <button 
                        key={char.id}
                        onClick={() => {
                          if (walletBalance >= selectedItem.price) {
                            setWalletBalance((p: number) => p - selectedItem.price);
                            addTransaction('expense', selectedItem.price, `購買 ${selectedItem.name} 贈送給 ${char.name}`);
                            const favorGain = Math.ceil(selectedItem.price / 10);
                            setCharacters((prev: any) => prev.map((c: any) => c.id === char.id ? { 
                              ...c, 
                              favorability: (c.favorability || 0) + favorGain,
                              messages: [...c.messages, { role: 'user', text: `[收到禮物] ${selectedItem.icon} ${selectedItem.name}` }]
                            } : c));
                            setSelectedItem(null);
                          }
                        }}
                        disabled={walletBalance < selectedItem.price}
                        className={`p-3 rounded-2xl border text-sm font-bold flex flex-col items-center gap-2 transition-all active:scale-95 ${isDarkMode ? 'bg-[#2c2c2e] border-white/5' : 'bg-gray-50 border-neutral-100'} ${walletBalance < selectedItem.price ? 'opacity-30' : 'hover:border-[#FF2D55]/30'}`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                          <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[9px] opacity-40 italic">贈送給</div>
                        <div className="truncate w-full text-center">{char.name}</div>
                      </button>
                    ))}
                    {characters.length === 0 && <div className="col-span-2 py-4 text-center text-xs opacity-40">尚無角色可贈送</div>}
                  </div>
                  
                  {walletBalance < selectedItem.price && (
                    <p className="text-center text-[10px] text-red-500 font-bold">餘額不足</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden`}>
      <Header title="商城" onBack={goHome} isDarkMode={isDarkMode} />
      
      <div className="p-4 space-y-4 overflow-y-auto pb-20">
        <div className={`p-5 rounded-3xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} flex flex-col items-center justify-center gap-1 border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} shadow-sm`}>
          <span className="font-bold opacity-30 uppercase text-[10px] tracking-[0.2em]">Wallet Balance</span>
          <span className="text-3xl font-black text-[#76DE84] tracking-tighter">${walletBalance}</span>
        </div>

        <div className={`flex p-1 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-gray-200'}`}>
          {(['fish', 'crops', 'gifts'] as const).map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeCategory === cat ? (isDarkMode ? 'bg-[#3a3a3c] text-white shadow-lg' : 'bg-white text-black shadow-sm') : 'text-neutral-500'}`}
            >
              {cat === 'fish' ? '鮮魚' : cat === 'crops' ? '作物' : '禮物'}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold border-l-4 border-[#76DE84] pl-3 text-sm">
              {activeCategory === 'fish' ? '每日魚貨' : activeCategory === 'crops' ? '鮮採作物' : '精選禮物'}
            </h3>
            <div className="flex items-center gap-1 bg-[#76DE84]/10 px-2 py-0.5 rounded-full">
              <Sparkles size={10} className="text-[#76DE84]" />
              <span className="text-[10px] font-bold text-[#76DE84]">每日更新</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentItems.map((s: any) => (
              <button 
                key={s.id}
                onClick={() => setSelectedItem(s)}
                className={`p-4 rounded-3xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} group hover:border-[#76DE84]/30`}
              >
                <div className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">{s.icon}</div>
                <div className="font-bold text-xs truncate w-full text-center">{s.name}</div>
                <div className="w-full flex items-center justify-center gap-1">
                  <span className="text-[10px] opacity-30 font-bold">$</span>
                  <span className="font-black text-lg text-[#76DE84] tracking-tight">{s.price}</span>
                </div>
                <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/5 text-white/40' : 'bg-neutral-100 text-neutral-400'}`}>
                  {activeCategory === 'gifts' ? '點擊購買' : '點擊販售'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const WalletApp = ({ walletBalance, transactions, isDarkMode, goHome, setActiveApp }: { walletBalance: number, transactions: Transaction[], isDarkMode: boolean, goHome: () => void, setActiveApp: (id: AppId) => void }) => {
  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-6 flex flex-col gap-6 bg-opacity-80 backdrop-blur-md z-10 sticky top-0`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5856D6] flex items-center justify-center text-white text-inherit">
              <WalletIcon size={20} />
            </div>
            錢包
          </h2>
          <button onClick={goHome} className="text-[#76DE84] font-medium">關閉</button>
        </div>
        
        <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm flex flex-col items-center justify-center gap-2 border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
          <span className="text-xs font-bold opacity-40 uppercase tracking-widest">目前餘額</span>
          <div className="text-5xl font-black text-[#5856D6] tracking-tighter">
            ${walletBalance}
          </div>
          <div className="px-3 py-1 bg-[#5856D6]/10 text-[#5856D6] rounded-full text-[10px] font-bold mt-2">
            AI 經濟系統已啟用
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveApp('messages')}
            className={`flex-1 py-3 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} shadow-sm flex items-center justify-center gap-2 group active:scale-95 transition-transform`}
          >
            <div className="w-6 h-6 rounded-full bg-[#AF52DE] flex items-center justify-center text-white"><Send size={12} /></div>
            <span className="text-xs font-bold">立即轉帳</span>
          </button>
          <button 
            onClick={() => setActiveApp('store')}
            className={`flex-1 py-3 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} shadow-sm flex items-center justify-center gap-2 group active:scale-95 transition-transform`}
          >
            <div className="w-6 h-6 rounded-full bg-[#76DE84] flex items-center justify-center text-white"><ShoppingBag size={12} /></div>
            <span className="text-xs font-bold">前往商城</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-bold opacity-60 flex items-center gap-2 text-sm">
            <ClipboardList size={16} />
            交易紀錄
          </h3>
          <span className="text-[10px] opacity-30 font-mono">HISTORY</span>
        </div>
        
        {transactions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-20 gap-4">
            <WalletIcon size={48} />
            <p className="text-sm font-bold">尚無任何交易紀錄</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={tx.id}
                className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} flex items-center justify-between shadow-sm border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'income' ? 'bg-green-500/10 text-green-500' : 
                    tx.type === 'expense' ? 'bg-red-500/10 text-red-500' : 
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {tx.type === 'income' ? <Plus size={20} /> : tx.type === 'expense' ? <ShoppingBag size={20} /> : <Send size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{tx.title}</h4>
                    <p className="text-[10px] opacity-40">{tx.timestamp}{tx.to ? ` ➔ ${tx.to}` : ''}</p>
                  </div>
                </div>
                <div className={`font-black text-lg ${
                   tx.type === 'income' ? 'text-green-500' : 
                   tx.type === 'expense' ? 'text-red-500' : 
                   'text-orange-500'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WarehouseApp = ({ warehouseItems, receivedGifts, isDarkMode, goHome, onSell }: { warehouseItems: {id: string, amount: number}[], receivedGifts: ReceivedGift[], isDarkMode: boolean, goHome: () => void, onSell: (id: string, name: string, price: number) => void }) => {
  const [activeTab, setActiveTab] = useState<'fish' | 'crops' | 'gifts' | 'received'>('fish');
  const [expandedRarity, setExpandedRarity] = useState<string | null>(null);
  const getFishInfo = (id: string) => FISH_TYPES.find(f => f.id === id);
  const getCropInfo = (id: string) => CROP_TYPES.find(c => c.id === id);
  const getGiftInfo = (id: string) => POSSIBLE_GIFTS.find(g => g.id === id);

  const fishItems = warehouseItems.filter(item => item.id.startsWith('f'));
  const cropItems = warehouseItems.filter(item => item.id.startsWith('c'));
  const giftItems = warehouseItems.filter(item => item.id.startsWith('gift'));

  const rarities = ['一般', '稀有', '史詩', '傳說'];
  const getFishPrice = (rarity: string) => {
    switch(rarity) {
      case '一般': return 100;
      case '稀有': return 500;
      case '史詩': return 2000;
      case '傳說': return 10000;
      default: return 50;
    }
  };

  const categorizedFish = rarities.reduce((acc, r) => {
    acc[r] = fishItems.filter(item => getFishInfo(item.id)?.rarity === r);
    return acc;
  }, {} as Record<string, typeof warehouseItems>);

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-200'} bg-opacity-80 backdrop-blur-md z-10 sticky top-0`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Archive /> 倉庫</h2>
          <button onClick={goHome} className="text-[#76DE84] font-medium">關閉</button>
        </div>
        <div className={`flex p-1 rounded-xl w-full gap-1 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-gray-200'} overflow-x-auto whitespace-nowrap`}>
          <button 
            onClick={() => setActiveTab('fish')} 
            className={`flex-1 min-w-[60px] py-1.5 text-sm font-medium rounded-lg ${activeTab === 'fish' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            魚貨
          </button>
          <button 
            onClick={() => setActiveTab('crops')} 
            className={`flex-1 min-w-[60px] py-1.5 text-sm font-medium rounded-lg ${activeTab === 'crops' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            作物
          </button>
          <button 
            onClick={() => setActiveTab('gifts')} 
            className={`flex-1 min-w-[60px] py-1.5 text-sm font-medium rounded-lg ${activeTab === 'gifts' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            素材
          </button>
          <button 
            onClick={() => setActiveTab('received')} 
            className={`flex-1 min-w-[60px] py-1.5 text-sm font-medium rounded-lg ${activeTab === 'received' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            禮物
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'fish' && (
          fishItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
              <Archive size={48} />
              <p>沒有魚貨，快去釣魚吧！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rarities.map(rarity => {
                const items = categorizedFish[rarity];
                if (items.length === 0) return null;
                
                let rarityColor = 'text-white bg-gray-500';
                if (rarity === '稀有') rarityColor = 'text-white bg-blue-500';
                if (rarity === '史詩') rarityColor = 'text-white bg-purple-500';
                if (rarity === '傳說') rarityColor = 'text-white bg-orange-500';

                return (
                  <div key={rarity} className={`rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} overflow-hidden`}>
                    <button 
                      onClick={() => setExpandedRarity(expandedRarity === rarity ? null : rarity)}
                      className={`w-full p-4 flex justify-between items-center ${rarityColor}`}
                    >
                      <span className="font-bold text-lg">{rarity}等級</span>
                      <span className="text-sm font-medium">{items.length} 種</span>
                    </button>
                    {expandedRarity === rarity && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3">
                        {items.map(item => {
                          const info = getFishInfo(item.id);
                          if (!info) return null;
                          return (
                            <div key={item.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-gray-50'} shadow-sm relative group`}>
                              <div className="text-4xl mb-2">{info.icon}</div>
                              <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
                              <div className="absolute top-1 right-2 text-[10px] font-black opacity-40">
                                x{item.amount}
                              </div>
                              <button 
                                onClick={() => onSell(item.id, info.name, getFishPrice(info.rarity))}
                                className="mt-2 w-full py-1 bg-[#5856D6] text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                出售 ${getFishPrice(info.rarity)}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
        
        {activeTab === 'crops' && (
          cropItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
              <Archive size={48} />
              <p>沒有作物，快去花園種植吧！</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-8">
              {cropItems.map(item => {
                const info = getCropInfo(item.id);
                if (!info) return null;
                return (
                  <div key={item.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm relative group`}>
                    <div className="text-4xl mb-2">{info.icon}</div>
                    <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
                    <div className="absolute top-1 right-2 text-[10px] font-black opacity-40">
                      x{item.amount}
                    </div>
                    <button 
                      onClick={() => onSell(item.id, info.name, info.sellPrice)}
                      className="mt-2 w-full py-1 bg-[#4CD964] text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      出售 ${info.sellPrice}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

        {activeTab === 'gifts' && (
          giftItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
              <Archive size={48} />
              <p>沒有收集到素材唷...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-8">
              {giftItems.map(item => {
                const info = getGiftInfo(item.id);
                if (!info) return null;
                return (
                  <div key={item.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm relative group`}>
                    <div className="text-4xl mb-2">{info.icon}</div>
                    <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
                    <div className="absolute top-1 right-2 text-[10px] font-black opacity-40">
                      x{item.amount}
                    </div>
                    <button 
                      onClick={() => onSell(item.id, info.name, Math.floor(info.price * 0.4))}
                      className="mt-2 w-full py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      出售 ${Math.floor(info.price * 0.4)}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

        {activeTab === 'received' && (
          receivedGifts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
              <GiftIcon size={48} />
              <p>還沒收到過贈禮唷...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
              {receivedGifts.map(rg => {
                const info = getGiftInfo(rg.giftId);
                if (!info) return null;
                return (
                  <div key={rg.id} className={`flex flex-col items-center justify-center p-4 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm relative border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
                    <div className="text-4xl mb-2">{info.icon}</div>
                    <div className="text-xs font-bold text-center mb-1">{info.name}</div>
                    <div className="text-[10px] text-[#FF2D55] font-bold">來自: {rg.senderName}</div>
                    <div className="text-[8px] opacity-30 mt-1">{new Date(rg.timestamp).toLocaleDateString()}</div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};


const MomentsApp = ({
  momentGroups, setMomentGroups,
  momentPosts, setMomentPosts,
  characters, userProfile, isDarkMode, goHome
}: any) => {
  const [activeGroupId, setActiveGroupId] = useState(momentGroups.length > 0 ? momentGroups[0].id : 'group1');
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isEditingGroups, setIsEditingGroups] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const momentGroupCoverInputRef = useRef<HTMLInputElement>(null);

  const activeGroup = momentGroups.find((g: any) => g.id === activeGroupId) || momentGroups[0];
  const groupPosts = momentPosts.filter((p: any) => p.groupId === activeGroupId).sort((a: any, b: any) => b.timestamp - a.timestamp);

  const handleGroupCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const newCover = event.target.result;
          setMomentGroups((prev: any) => prev.map((g: any) => g.id === activeGroupId ? { ...g, coverImage: newCover } : g));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getAuthorInfo = (id: string) => {
    if (id === 'user') return { name: userProfile.name, avatar: userProfile.avatar, isUser: true };
    const char = characters.find((c: any) => c.id === id);
    if (char) return { name: char.name, avatar: char.avatar, isUser: false };
    return { name: '未知', avatar: '❓', isUser: false };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setNewPostImage(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePost = () => {
    if (!newPostText.trim() && !newPostImage) return;
    const newPost: MomentPost = {
      id: Date.now().toString(),
      groupId: activeGroupId,
      authorId: 'user',
      text: newPostText,
      imageUrl: newPostImage || undefined,
      timestamp: Date.now(),
      likes: [],
      comments: []
    };
    setMomentPosts((prev: any) => [newPost, ...prev]);
    setNewPostText('');
    setNewPostImage(null);
  };

  const handleLike = (postId: string) => {
    setMomentPosts((prev: any) => prev.map((p: any) => {
      if (p.id === postId) {
        const hasLiked = p.likes.includes('user');
        return {
          ...p,
          likes: hasLiked ? p.likes.filter((id: any) => id !== 'user') : [...p.likes, 'user']
        };
      }
      return p;
    }));
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;
    setMomentPosts((prev: any) => prev.map((p: any) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, {
            id: Date.now().toString(),
            authorId: 'user',
            text: commentText,
            timestamp: Date.now()
          }]
        };
      }
      return p;
    }));
    setCommentingOn(null);
    setCommentText('');
  };

  const toggleCharacterInGroup = (charId: string) => {
    setMomentGroups((prev: any) => prev.map((g: any) => {
      if (g.id === activeGroupId) {
        const hasChar = g.characterIds.includes(charId);
        return {
          ...g,
          characterIds: hasChar ? g.characterIds.filter((id: any) => id !== charId) : [...g.characterIds, charId]
        };
      }
      return g;
    }));
  };

  if (isEditingGroups) {
    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-neutral-50 text-black'}`}>
        <div className={`px-4 pt-16 pb-4 flex items-center justify-between border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-200'}`}>
          <button onClick={() => setIsEditingGroups(false)} className="text-[#76DE84] font-medium flex items-center"><ChevronLeft size={20} /> 返回</button>
          <h2 className="font-bold text-lg">設定 {activeGroup.name}</h2>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
               <label className="text-xs font-black uppercase tracking-wider opacity-40">封面圖片</label>
               <button 
                 onClick={() => momentGroupCoverInputRef.current?.click()}
                 className="text-[10px] font-bold bg-[#76DE84] text-white px-3 py-1 rounded-full shadow-sm active:scale-95 transition-transform"
               >
                 更換封面
               </button>
               <input 
                 type="file"
                 accept="image/*"
                 ref={momentGroupCoverInputRef}
                 className="hidden"
                 onChange={handleGroupCoverUpload}
               />
             </div>
             <div className={`w-full aspect-video rounded-3xl overflow-hidden border-2 ${isDarkMode ? 'border-white/10' : 'border-black/5'} shadow-inner relative group`}>
               <img 
                 src={activeGroup.coverImage || userProfile.avatar} 
                 className="w-full h-full object-cover" 
                 alt="Cover preview"
               />
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <Camera className="text-white" size={32} />
               </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold opacity-50 pl-2">朋友圈名稱</label>
            <input 
              className={`w-full px-4 py-3 rounded-xl outline-none ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} shadow-sm`}
              value={activeGroup.name}
              onChange={e => setMomentGroups((prev: any) => prev.map((g: any) => g.id === activeGroupId ? { ...g, name: e.target.value } : g))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold opacity-50 pl-2">允許加入的角色</label>
            <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'}`}>
              {characters.map((char: any) => {
                const isSelected = activeGroup.characterIds.includes(char.id);
                return (
                  <div key={char.id} className="p-3 flex items-center justify-between" onClick={() => toggleCharacterInGroup(char.id)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                        <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium">{char.name}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isSelected ? 'bg-[#76DE84] border-[#76DE84]' : 'border-neutral-300'}`}>
                      {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full bg-neutral-100 ${isDarkMode ? 'bg-black text-white' : 'bg-neutral-100 text-black'}`}>
      <div className={`relative px-4 pt-16 pb-4 flex items-center justify-between z-20 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'}`}>
        <button onClick={goHome} className="text-[#76DE84] font-medium z-10 w-16">主畫面</button>
        <div className="flex-1 flex justify-center relative">
          <button 
            onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
            className="font-bold text-lg flex items-center gap-1 active:opacity-70 transition-opacity"
          >
            {activeGroup?.name || '朋友圈'} 
            {isGroupDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {isGroupDropdownOpen && (
            <div className={`absolute top-full mt-2 w-48 rounded-xl shadow-xl border overflow-hidden ${isDarkMode ? 'bg-[#1c1c1e] border-white/10' : 'bg-white border-black/10'} origin-top animate-in fade-in zoom-in-95 duration-100`}>
              {momentGroups.map((g: any) => (
                 <button
                   key={g.id}
                   onClick={() => { setActiveGroupId(g.id); setIsGroupDropdownOpen(false); }}
                   className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between ${activeGroupId === g.id ? 'text-[#76DE84] font-bold' : ''} ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-colors`}
                 >
                   {g.name}
                   {activeGroupId === g.id && <Check size={16} />}
                 </button>
              ))}
              <div className={`border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                <button
                  onClick={() => setIsEditingGroups(true)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-colors`}
                >
                  <SettingsIcon size={16} /> 朋友圈設定
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-16 flex justify-end">
          <button className="opacity-0 cursor-default"><Plus size={24} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto w-full relative z-0">
        {/* Cover Photo */}
        <div className={`w-full aspect-square md:aspect-[4/3] relative ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-300'}`}>
          <img 
            src={activeGroup.coverImage || userProfile.avatar} 
            alt="cover" 
            className="w-full h-full object-cover filter blur-[1px] brightness-90 transition-all duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
          <div className="absolute right-4 -bottom-10 flex items-end gap-3 z-10 w-full justify-end">
            <span className="font-bold text-lg text-white drop-shadow-md pb-2">{userProfile.name}</span>
            <div className="w-20 h-20 rounded-2xl bg-white p-0.5 shadow-lg">
              <AvatarImage src={userProfile.avatar} className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className={`mt-14 mx-4 mb-4 p-4 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm flex flex-col gap-3 group`}>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 shrink-0">
               <AvatarImage src={userProfile.avatar} className="w-full h-full object-cover" />
            </div>
             <input 
                type="text"
                placeholder="分享新鮮事..."
                className="flex-1 outline-none text-sm bg-transparent"
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePost()}
             />
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="p-2 rounded-full hover:bg-black/5 text-[#576b95] transition-colors"
             >
               <Camera size={20} />
             </button>
             <input 
               type="file" 
               accept="image/*"
               ref={fileInputRef}
               className="hidden"
               onChange={handleImageUpload}
             />
             <button 
               onClick={handlePost}
               disabled={!newPostText.trim() && !newPostImage}
               className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${(newPostText.trim() || newPostImage) ? 'bg-[#76DE84] text-white hover:bg-[#60ce6e]' : 'bg-neutral-200 text-neutral-400'}`}
             >
               發布
             </button>
          </div>
          {newPostImage && (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden ml-13">
              <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setNewPostImage(null)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
              >
                <Plus className="rotate-45" size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Posts Feed */}
        <div className="divide-y pb-20">
          {groupPosts.map((post: any) => {
            const author = getAuthorInfo(post.authorId);
            const userLiked = post.likes.includes('user');
            return (
              <div key={post.id} className="p-4 flex gap-3">
                 <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                   <AvatarImage src={author.avatar} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#576b95] text-[15px]">{author.name}</h4>
                    <p className="text-[15px] leading-relaxed mt-1 break-words whitespace-pre-wrap">{post.text}</p>
                    {post.imageUrl && (
                      <div className="mt-2 max-w-[200px] max-h-[200px] rounded-lg overflow-hidden">
                        <img src={post.imageUrl} alt="Post image" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs opacity-50 relative">
                       <span>{new Date(post.timestamp).toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                       <div className="flex gap-4">
                         <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 hover:opacity-80">
                           <motion.div whileTap={{ scale: 0.5 }} animate={userLiked ? { scale: [1, 1.2, 1] } : {}}>
                             <Heart size={16} className={userLiked ? 'fill-[#FF2D55] text-[#FF2D55]' : ''} />
                           </motion.div>
                         </button>
                         <button onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)} className="flex items-center gap-1 hover:opacity-80">
                           <MessageCircle size={16} />
                         </button>
                       </div>
                    </div>

                    {/* Reactions & Comments Region */}
                    {(post.likes.length > 0 || post.comments.length > 0) && (
                      <div className={`mt-3 p-3 rounded-lg flex flex-col gap-2 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-black/5'} text-[13px]`}>
                        {/* Likes */}
                        {post.likes.length > 0 && (
                          <div className="flex items-start gap-2 border-b border-black/5 pb-2">
                             <Heart size={12} className="shrink-0 mt-0.5 text-[#FF2D55] fill-[#FF2D55]" />
                             <div className="flex flex-wrap gap-1 font-bold text-[#576b95]">
                               {post.likes.map((l: string, i: number) => (
                                 <span key={i}>{getAuthorInfo(l).name}{i < post.likes.length - 1 ? ', ' : ''}</span>
                               ))}
                             </div>
                          </div>
                        )}
                        {/* Comments */}
                        {post.comments.length > 0 && (
                           <div className="flex flex-col gap-1.5 pt-1">
                             {post.comments.map((comment: any) => (
                               <div key={comment.id} className="leading-snug">
                                 <span className="font-bold text-[#576b95] cursor-pointer">{getAuthorInfo(comment.authorId).name}</span>
                                 <span className="mx-1">:</span>
                                 <span className="break-words">{comment.text}</span>
                               </div>
                             ))}
                           </div>
                        )}
                      </div>
                    )}
                    
                    {/* Comment Input */}
                    {commentingOn === post.id && (
                      <div className="mt-3 flex gap-2">
                        <input 
                          autoFocus
                          type="text"
                          placeholder="評論..."
                          className={`flex-1 text-sm rounded-lg px-3 py-2 outline-none ${isDarkMode ? 'bg-[#1c1c1e] text-white border border-[#38383a]' : 'bg-white text-black border border-neutral-200'} shadow-sm`}
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                        />
                        <button 
                          onClick={() => handleComment(post.id)}
                          disabled={!commentText.trim()}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${commentText.trim() ? 'bg-[#76DE84] text-white' : 'bg-neutral-200 text-neutral-400'}`}
                        >
                          發送
                        </button>
                      </div>
                    )}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

  const CountdownTimer = ({ plantedTime, growthHours }: { plantedTime: number, growthHours: number }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const end = plantedTime + growthHours * 60 * 60 * 1000;
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [plantedTime, growthHours]);

  return <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded-full mt-2 block shadow-sm border border-black/20">{timeLeft}</span>;
}

const GardenApp = ({ 
  patches, 
  isDarkMode, 
  goHome, 
  onUnlockPatch, 
  onPlant, 
  onWater, 
  onHarvest 
}: { 
  patches: GardenPatch[], 
  isDarkMode: boolean, 
  goHome: () => void,
  onUnlockPatch: (id: number) => void,
  onPlant: (id: number) => void,
  onWater: (id: number) => void,
  onHarvest: (id: number) => void
}) => {
  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#2a1b14] text-amber-50' : 'bg-[#e8ece1] text-[#3e2723]'} overflow-hidden relative`}>
      {/* Decorative background dirt/grass texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3e2723 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className={`px-4 pt-16 pb-4 flex items-center justify-between border-b ${isDarkMode ? 'border-[#4a3424] bg-[#2a1b14]/80' : 'border-[#c5ceb6] bg-[#e8ece1]/80'} backdrop-blur-md z-10 sticky top-0 shadow-sm`}>
        <h2 className="text-2xl font-black flex items-center gap-2"><Leaf className="text-emerald-500" /> <span style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>種植花園</span></h2>
        <button onClick={goHome} className="text-[#76DE84] font-bold bg-[#76DE84]/10 px-3 py-1.5 rounded-full text-sm">關閉</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 z-0">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {patches.map(patch => {
            const crop = patch.cropId ? CROP_TYPES.find(c => c.id === patch.cropId) : null;
            return (
              <div key={patch.id} className="relative aspect-square">
                {/* Soil background layered look */}
                <div className={`absolute inset-0 rounded-[2rem] border-b-8 ${isDarkMode ? 'bg-[#3e2723] border-[#1e1008]' : 'bg-[#795548] border-[#4e342e]'} shadow-inner`}></div>
                <div className={`absolute inset-2 rounded-[1.5rem] border-t-8 ${isDarkMode ? 'bg-[#4e342e] border-[#5d4037]/50' : 'bg-[#8d6e63] border-[#a1887f]/50'}`}></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                  {patch.status === 'locked' && (
                    <button onClick={() => onUnlockPatch(patch.id)} className="text-center group flex flex-col items-center justify-center h-full w-full">
                      <div className="bg-black/30 p-4 rounded-full mb-2 group-active:scale-95 transition-transform backdrop-blur-sm">
                        <Lock size={28} className="text-white/80" />
                      </div>
                      <span className="text-xs font-bold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">300金幣解鎖</span>
                    </button>
                  )}
                  {patch.status === 'empty' && (
                    <button onClick={() => onPlant(patch.id)} className="text-center group flex flex-col items-center justify-center h-full w-full">
                      <div className="bg-white/20 p-4 rounded-full mb-2 group-active:scale-95 transition-transform backdrop-blur-sm border border-white/30 shadow-sm">
                        <Plus size={32} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">種植作物</span>
                    </button>
                  )}
                  {patch.status === 'growing' && (
                    <div className="text-center relative flex flex-col items-center justify-center h-full w-full">
                      <div className="text-5xl filter drop-shadow-md pb-2 transform transition-transform animate-pulse">🌱</div>
                      {patch.needsWatering && (
                        <button onClick={() => onWater(patch.id)} className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-2.5 shadow-lg border-2 border-white animate-bounce">
                          <Droplets size={18} color="white" strokeWidth={3} />
                        </button>
                      )}
                      <CountdownTimer plantedTime={patch.plantedTime || 0} growthHours={crop?.growthTime || 0} />
                    </div>
                  )}
                  {patch.status === 'ready' && (
                     <button onClick={() => onHarvest(patch.id)} className="text-center group flex flex-col items-center justify-center h-full w-full">
                       <span className="text-6xl filter drop-shadow-xl group-active:scale-90 transition-transform">{crop?.icon}</span>
                       <span className="text-xs font-bold text-white bg-emerald-500/90 px-3 py-1 rounded-full mt-2 shadow-sm border border-white/20 whitespace-nowrap">點擊收成!</span>
                     </button>
                  )}
                  {patch.status === 'dead' && (
                    <button onClick={() => onHarvest(patch.id)} className="text-center flex flex-col items-center justify-center h-full w-full group">
                      <span className="text-5xl opacity-80 filter sepia grayscale group-active:scale-90 transition-transform">🥀</span>
                      <span className="text-[10px] font-bold text-white bg-red-500/80 px-2 py-0.5 rounded-full mt-2">枯萎了...</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

const GameApp = ({ 
  characters, 
  userProfile, 
  isDarkMode, 
  goHome, 
  aiSettings, 
  walletBalance, 
  setWalletBalance, 
  setCharacters, 
  addTransaction,
  callUniversalAI // <--- 1. 新增這一個屬性
}: { 
  characters: Character[], 
  userProfile: UserProfile, 
  isDarkMode: boolean, 
  goHome: () => void, 
  aiSettings: AISettings, 
  walletBalance: number, 
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>, 
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>, 
  addTransaction: (type: 'income' | 'expense' | 'transfer', amount: number, title: string) => void,
  callUniversalAI: (history: any[], systemPrompt: string) => Promise<string> // <--- 2. 新增這行類型定義
}) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'ended'>('setup');
  const [isAutoMode, setIsAutoMode] = useState(false);
  
  // UNO State
  const [unoDeck, setUnoDeck] = useState<UnoCard[]>([]);
  const [unoDiscard, setUnoDiscard] = useState<UnoCard[]>([]);
  const [unoPlayers, setUnoPlayers] = useState<GamePlayer[]>([]);
  const [unoTurn, setUnoTurn] = useState(0);
  const [unoDirection, setUnoDirection] = useState(1); // 1 or -1
  const [unoWinner, setUnoWinner] = useState<string | null>(null);

  // Old Maid State
  const [omPlayers, setOmPlayers] = useState<GamePlayer[]>([]);
  const [omTurn, setOmTurn] = useState(0);
  const [omWinner, setOmWinner] = useState<string | null>(null);

  // Charades State
  const [charadesPlayers, setCharadesPlayers] = useState<GamePlayer[]>([]);
  const [charadesTopic, setCharadesTopic] = useState('');
  const [charadesDescriberIdx, setCharadesDescriberIdx] = useState(0);
  const [charadesChat, setCharadesChat] = useState<{author: string, text: string}[]>([]);
  const [charadesInput, setCharadesInput] = useState('');
  const [charadesRound, setCharadesRound] = useState(1);
  const [charadesScores, setCharadesScores] = useState<Record<string, number>>({});
  const [charadesWinner, setCharadesWinner] = useState<string | null>(null);


  const resetAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveGame(null);
    setSelectedChars([]);
    setGameState('setup');
    setUnoDeck([]);
    setUnoDiscard([]);
    setUnoPlayers([]);
    setUnoTurn(0);
    setUnoWinner(null);
    setOmPlayers([]);
    setUnoDirection(1);
    setCharadesChat([]);
    setCharadesRound(1);
    setCharadesScores({});
    setCharadesWinner(null);
  };

  // --- UNO LOGIC ---
  const initUno = () => {
    const colors: UnoCard['color'][] = ['red', 'blue', 'green', 'yellow'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
    let deck: UnoCard[] = [];
    colors.forEach(c => {
      values.forEach(v => {
        deck.push({ id: Math.random().toString(), color: c, value: v });
        if (v !== '0') deck.push({ id: Math.random().toString(), color: c, value: v });
      });
    });
    for (let i = 0; i < 4; i++) {
      deck.push({ id: Math.random().toString(), color: 'wild', value: 'wild' });
      deck.push({ id: Math.random().toString(), color: 'wild', value: 'draw4' });
    }
    deck = deck.sort(() => Math.random() - 0.5);

    const players: GamePlayer[] = [
      { id: 'user', name: userProfile.name, avatar: userProfile.avatar, hand: deck.splice(0, 7) },
      ...selectedChars.map(id => {
        const c = characters.find(char => char.id === id);
        return { id, name: c?.name || '', avatar: c?.avatar || '', hand: deck.splice(0, 7) };
      })
    ];

    setUnoDeck(deck);
    setUnoDiscard([deck.pop()!]);
    setUnoPlayers(players);
    setUnoTurn(Math.floor(Math.random() * players.length));
    setGameState('playing');
  };

  const playUnoCard = (playerIdx: number, cardIdx: number) => {
    if (unoTurn !== playerIdx || unoPlayers.length === 0) return;
    const player = unoPlayers[playerIdx];
    if (!player || !player.hand) return;

    const card = player.hand[cardIdx];
    if (!card) return;

    const top = unoDiscard[unoDiscard.length - 1];
    if (!top) return;

    const canPlay = card.color === 'wild' || card.color === top.color || card.value === top.value;
    if (!canPlay) return;

    const newHand = [...player.hand];
    newHand.splice(cardIdx, 1);
    
    const newPlayers = [...unoPlayers];
    newPlayers[playerIdx] = { ...player, hand: newHand };
    
    setUnoDiscard(prev => [...prev, card]);
    setUnoPlayers(newPlayers);

    if (newHand.length === 0) {
      let maxCards = -1;
      let loser = player;
      newPlayers.forEach((p) => {
        if (p.hand.length > maxCards) {
          maxCards = p.hand.length;
          loser = p;
        }
      });
      
      const penalty = Math.floor(Math.random() * 50) + 10;
      
      // deduct from loser
      if (loser.id === 'user') {
        setWalletBalance(prev => Math.max(0, prev - penalty));
        addTransaction('expense', penalty, `玩 UNO 輸了`);
      } else {
        setCharacters(prev => prev.map(c => c.id === loser.id ? { ...c, walletBalance: Math.max(0, (c.walletBalance || 0) - penalty) } : c));
      }

      // add to winner
      if (player.id === 'user') {
        setWalletBalance(prev => prev + penalty);
        addTransaction('income', penalty, `玩 UNO 贏了`);
      } else {
        setCharacters(prev => prev.map(c => c.id === player.id ? { ...c, walletBalance: (c.walletBalance || 0) + penalty } : c));
      }

      setUnoWinner(`${player.name} 獲勝！${loser.name} 輸給贏家 $${penalty}`);
      setGameState('ended');
      return;
    }

    // Effect logic
    let nextTurn = (unoTurn + unoDirection + unoPlayers.length) % unoPlayers.length;
    if (card.value === 'skip') {
      nextTurn = (nextTurn + unoDirection + unoPlayers.length) % unoPlayers.length;
    } else if (card.value === 'reverse') {
      if (unoPlayers.length === 2) {
        nextTurn = unoTurn; // Basically a skip
      } else {
        setUnoDirection(d => d * -1);
        nextTurn = (unoTurn - unoDirection + unoPlayers.length) % unoPlayers.length;
      }
    }
    
    let currentDeck = [...unoDeck];
    // Notice: we previously did setUnoDiscard(prev => [...prev, card]); before.
    // So currentDiscard doesn't technically include `card` yet unless we do it here.
    // But `setUnoDiscard` will just append `card` at the end on the next render.
    // However, if we shuffle discard back into deck, we might accidentally use old discard state.
    // To be perfectly safe, let's use a local discard variable.
    let currentDiscard = [...unoDiscard, card];

    if (card.value === 'draw2' || card.value === 'draw4') {
      const targetIdx = nextTurn;
      const count = card.value === 'draw4' ? 4 : 2;
      const cards: UnoCard[] = [];
      for (let i = 0; i < count; i++) {
        if (currentDeck.length === 0) {
          if (currentDiscard.length > 1) {
            const top = currentDiscard.pop()!;
            currentDeck = currentDiscard.sort(() => Math.random() - 0.5);
            currentDiscard = [top];
          }
        }
        if (currentDeck.length > 0) cards.push(currentDeck.pop()!);
      }
      newPlayers[targetIdx] = { 
        ...newPlayers[targetIdx], 
        hand: [...newPlayers[targetIdx].hand, ...cards] 
      };
      nextTurn = (nextTurn + unoDirection + unoPlayers.length) % unoPlayers.length;
    }

    setUnoDeck(currentDeck);
    
    // We update discard to the new array, overriding the `setUnoDiscard(prev => [...prev, card]);`
    setUnoDiscard(currentDiscard);
    setUnoTurn(nextTurn);
  };

  const drawUnoCard = (playerIdx: number) => {
    if (unoTurn !== playerIdx) return;
    
    let currentDeck = [...unoDeck];
    let currentDiscard = [...unoDiscard];

    if (currentDeck.length === 0) {
      if (currentDiscard.length <= 1) {
        setUnoTurn((unoTurn + unoDirection + unoPlayers.length) % unoPlayers.length);
        return;
      }
      const top = currentDiscard.pop()!;
      currentDeck = currentDiscard.sort(() => Math.random() - 0.5);
      currentDiscard = [top];
    }
    
    if (currentDeck.length > 0) {
      const card = currentDeck.pop()!;
      setUnoDeck(currentDeck);
      setUnoDiscard(currentDiscard);
      setUnoPlayers(prev => {
        const next = [...prev];
        next[playerIdx] = { ...next[playerIdx], hand: [...next[playerIdx].hand, card] };
        return next;
      });
      setUnoTurn((unoTurn + unoDirection + unoPlayers.length) % unoPlayers.length);
    }
  };

// AI Uno move (安全檢查版)
  useEffect(() => {
    // 1. 確保遊戲正在進行且陣列中有玩家
    if (activeGame === 'uno' && gameState === 'playing' && unoPlayers.length > 0) {
      const currentPlayer = unoPlayers[unoTurn];
      
      // 2. 如果當前玩家不存在，先不執行
      if (!currentPlayer) return;

      // 3. 判斷是否為 AI 輪次或自動模式
      if (currentPlayer.id !== 'user' || isAutoMode) {
        const isUserTurn = currentPlayer.id === 'user';
        const timer = setTimeout(() => {
          const top = unoDiscard[unoDiscard.length - 1];
          if (!top) return;
          
          const playableIdx = currentPlayer.hand.findIndex(c => 
            c.color === 'wild' || c.color === top.color || c.value === top.value
          );
          
          if (playableIdx !== -1) {
            playUnoCard(unoTurn, playableIdx);
          } else {
            drawUnoCard(unoTurn);
          }
        }, isUserTurn ? 2000 : 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [unoTurn, gameState, activeGame, isAutoMode, unoPlayers, unoDiscard]); // 補齊依賴項

  // --- OLD MAID LOGIC ---
  const initOldMaid = () => {
    const basePlayers = [
      { id: 'user', name: userProfile.name, avatar: userProfile.avatar, hand: [] as string[] },
      ...selectedChars.map(id => {
        const c = characters.find(char => char.id === id);
        return { id, name: c?.name || '', avatar: c?.avatar || '', hand: [] as string[] };
      })
    ];

    const pairsNeeded = Math.floor((5 * basePlayers.length) / 2);
    const symbols = ['♠A','♠2','♠3','♠4','♠5','♠6','♠7','♠8','♠9','♠10','♠J','♠Q','♠K', '♥A','♥2','♥3'];
    let deck: string[] = [];
    for(let i=0; i<pairsNeeded; i++) {
        deck.push(symbols[i]);
        deck.push(symbols[i]);
    }
    deck.push('🃏'); // Add Joker
    deck = deck.sort(() => Math.random() - 0.5);

    while(deck.length > 0) {
      basePlayers.forEach(p => {
        if (deck.length > 0) p.hand.push(deck.pop()!);
      });
    }

    // Auto remove pairs
    const players = basePlayers.map(p => {
      let h = [...p.hand];
      const counts: any = {};
      h.forEach(v => counts[v] = (counts[v] || 0) + 1);
      const newHand: string[] = [];
      Object.keys(counts).forEach(v => {
        if (v === '🃏') newHand.push('🃏');
        else {
          for(let i = 0; i < counts[v] % 2; i++) newHand.push(v);
        }
      });
      return { ...p, hand: newHand };
    });

    setOmPlayers(players);
    setUnoTurn(Math.floor(Math.random() * players.length));
    setGameState('playing');
  };

  const omDraw = (fromIdx: number, cardIdx: number) => {
    const toIdx = unoTurn; // Reuse unoTurn for current turn tracker
    const fromP = omPlayers[fromIdx];
    const toP = omPlayers[toIdx];
    if (!fromP || !toP) return;

    const card = fromP.hand[cardIdx];

    const newFromHand = [...fromP.hand];
    newFromHand.splice(cardIdx, 1);
    
    let newToHand = [...toP.hand];
    const pairIdx = newToHand.indexOf(card);
    if (pairIdx !== -1 && card !== '🃏') {
      newToHand.splice(pairIdx, 1);
    } else {
      newToHand.push(card);
    }

    const newPlayers = [...omPlayers];
    newPlayers[fromIdx] = { ...fromP, hand: newFromHand };
    newPlayers[toIdx] = { ...toP, hand: newToHand };
    
    setOmPlayers(newPlayers);
    const nextTurn = (toIdx + 1) % newPlayers.length;
    setUnoTurn(nextTurn);

    // Check if anyone lost (only Joker left)
    const activePlayers = newPlayers.filter(p => p.hand.length > 0);
    if (activePlayers.length === 1) {
      const loser = activePlayers[0];
      const winner = newPlayers.find(p => p.id !== loser.id)!; // First to finish or any other
      
      const penalty = Math.floor(Math.random() * 50) + 10;
      
      if (loser.id === 'user') {
        setWalletBalance(prev => Math.max(0, prev - penalty));
        addTransaction('expense', penalty, `抽鬼牌輸了`);
      } else {
        setCharacters(prev => prev.map(c => c.id === loser.id ? { ...c, walletBalance: Math.max(0, (c.walletBalance || 0) - penalty) } : c));
      }

      const winnerIdToCredit = newPlayers.find(p => p.hand.length === 0)?.id || winner.id;
      if (winnerIdToCredit === 'user') {
        setWalletBalance(prev => prev + penalty);
        addTransaction('income', penalty, `抽鬼牌贏了`);
      } else {
        setCharacters(prev => prev.map(c => c.id === winnerIdToCredit ? { ...c, walletBalance: (c.walletBalance || 0) + penalty } : c));
      }

      setOmWinner(`${loser.name} 是大輸家 (扣除 $${penalty})`);
      setGameState('ended');
    }
  };

// AI Old Maid (修改版)
  useEffect(() => {
    // 加上 omPlayers.length > 0 的檢查
    if (activeGame === 'oldmaid' && gameState === 'playing' && omPlayers.length > 0) {
      const currentPlayer = omPlayers[unoTurn];
      if (!currentPlayer) return; // 如果找不到當前玩家，安全退出

      if (currentPlayer.id !== 'user' || isAutoMode) {
        const isUserTurn = currentPlayer.id === 'user';
        const timer = setTimeout(() => {
          const fromIdx = (unoTurn + omPlayers.length - 1) % omPlayers.length;
          
          // 確保來源玩家存在且手上有牌
          if (omPlayers[fromIdx] && omPlayers[fromIdx].hand.length > 0) {
            const randIdx = Math.floor(Math.random() * omPlayers[fromIdx].hand.length);
            omDraw(fromIdx, randIdx);
          } else {
            setUnoTurn((unoTurn + 1) % omPlayers.length);
          }
        }, isUserTurn ? 2500 : 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [unoTurn, gameState, activeGame, isAutoMode, omPlayers]); // 補上依賴項

  // --- CHARADES LOGIC ---
  const TOPICS = ['蘋果', '跑步', '刷牙', '超人', '鋼琴', '大象', '煮飯', '睡覺', '游泳', '貓咪'];
  
  const initCharades = () => {
    const players: GamePlayer[] = [
      { id: 'user', name: userProfile.name, avatar: userProfile.avatar, hand: [] },
      ...selectedChars.map(id => {
        const c = characters.find(char => char.id === id);
        return { id, name: c?.name || '', avatar: c?.avatar || '', hand: [] };
      })
    ];
    setCharadesPlayers(players);
    const initialScores: Record<string, number> = {};
    players.forEach(p => initialScores[p.id] = 0);
    setCharadesScores(initialScores);
    setCharadesRound(1);
    setGameState('playing');
    setCharadesDescriberIdx(0);
    startNewRound(0, players, 1);
  };

  const startNewRound = (descIdx: number, players: GamePlayer[], round: number) => {
    if (round > 10) {
      endCharadesGame(players);
      return;
    }
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    setCharadesTopic(topic);
    setCharadesRound(round);
    setCharadesChat([{ author: '系統', text: `第 ${round}/10 輪開始！描述者是 ${players[descIdx].name}。` }]);
    if (players[descIdx].id !== 'user') {
      simulateAiDescriber(players[descIdx], topic);
    } else if (isAutoMode) {
      setTimeout(() => {
        simulateAiDescriber(players[descIdx], topic);
      }, 2000);
    }
  };

// AI guessing for user in Charades (修改版)
  useEffect(() => {
    // 加上 charadesPlayers.length > 0 的檢查
    if (activeGame === 'charades' && gameState === 'playing' && charadesPlayers.length > 0) {
      const currentDescriber = charadesPlayers[charadesDescriberIdx];
      if (!currentDescriber) return; // 安全檢查

      if (isAutoMode && currentDescriber.id !== 'user') {
        const timer = setInterval(() => {
          if (Math.random() > 0.7) {
            handleCharadesGuess(charadesTopic);
          }
        }, 5000);
        return () => clearInterval(timer);
      }
    }
  }, [activeGame, gameState, isAutoMode, charadesDescriberIdx, charadesTopic, charadesPlayers]);

const endCharadesGame = (players: GamePlayer[]) => {
    // 安全檢查：如果沒有玩家資料，直接返回不執行
    if (!players || players.length === 0) return;

    let maxScore = -1;
    let minScore = 999;
    let winner = players[0];
    let loser = players[0];
    
    players.forEach(p => {
      const score = charadesScores[p.id] || 0;
      if (score > maxScore) { maxScore = score; winner = p; }
      if (score < minScore) { minScore = score; loser = p; }
    });
    
    const penalty = Math.floor(Math.random() * 50) + 10;
    
    if (loser.id === 'user') {
      setWalletBalance(prev => Math.max(0, prev - penalty));
      addTransaction('expense', penalty, `你說我猜輸了`);
    } else {
      setCharacters(prev => prev.map(c => c.id === loser.id ? { ...c, walletBalance: Math.max(0, (c.walletBalance || 0) - penalty) } : c));
    }

    if (winner.id === 'user') {
      setWalletBalance(prev => prev + penalty);
      addTransaction('income', penalty, `你說我猜贏了`);
    } else {
      setCharacters(prev => prev.map(c => c.id === winner.id ? { ...c, walletBalance: (c.walletBalance || 0) + penalty } : c));
    }

    setCharadesWinner(`${winner.name} 獲勝！猜中 ${maxScore} 題。\n${loser.name} 輸給贏家 $${penalty}。`);
    setGameState('ended');
  };

const simulateAiDescriber = async (char: GamePlayer, topic: string) => {
    const charData = characters.find(c => c.id === char.id);
    const systemPrompt = `你現在扮演一個角色：${charData?.name}。背景性格：${charData?.personality}。
你正在和朋友玩「你說我猜」。題目是：${topic}。
請用你的性格和說法描述這個題目，但絕對不能提到「${topic}」以及包含在裡面的字。
長度約10-20個字。保持口吻。不要輸出引號。`;
    
    try {
      // 改用傳進來的 callUniversalAI 函數
      const text = await callUniversalAI([], systemPrompt);
      if (text) {
        setCharadesChat(prev => [...prev, { author: char.name, text: text.trim() }]);
      }
    } catch (e) {
      console.error("Game AI Error:", e);
      setCharadesChat(prev => [...prev, { author: char.name, text: `提示：這跟「${topic[0]}」開頭的東西有關喔... (連線失敗)` }]);
    }
  };

  const handleCharadesGuess = async (text: string) => {
    setCharadesChat(prev => [...prev, { author: userProfile.name, text }]);
    setCharadesInput('');

    if (text === charadesTopic) {
      setCharadesScores(prev => ({ ...prev, 'user': (prev['user'] || 0) + 1 }));
      setCharadesChat(prev => [...prev, { author: '系統', text: `恭喜！猜對了！答案是 ${charadesTopic}。` }]);
      setTimeout(() => {
        const nextIdx = (charadesDescriberIdx + 1) % charadesPlayers.length;
        setCharadesDescriberIdx(nextIdx);
        startNewRound(nextIdx, charadesPlayers, charadesRound + 1);
      }, 3000);
    } else {
      // AI check guess
      setTimeout(() => {
        setCharadesChat(prev => [...prev, { author: '系統', text: "不對喔，再猜猜看！" }]);
      }, 1000);
    }
  };

  const handleCharadesDescribe = (text: string) => {
    setCharadesChat(prev => [...prev, { author: userProfile.name, text }]);
    setCharadesInput('');
    // System checks if user leaked
    if (text.includes(charadesTopic)) {
      setCharadesChat(prev => [...prev, { author: '系統', text: "哎呀！你提到題目了，這回合沒人猜中！" }]);
      setTimeout(() => {
        const nextIdx = (charadesDescriberIdx + 1) % charadesPlayers.length;
        setCharadesDescriberIdx(nextIdx);
        startNewRound(nextIdx, charadesPlayers, charadesRound + 1);
      }, 3000);
    } else {
      // Simulate AI guessing your description
      setTimeout(() => {
        const randomChar = charadesPlayers[1 + Math.floor(Math.random() * (charadesPlayers.length - 1))];
        if (Math.random() > 0.4) {
          // AI guesses correctly
          setCharadesScores(prev => ({ ...prev, [randomChar.id]: (prev[randomChar.id] || 0) + 1 }));
          setCharadesChat(prev => [...prev, { author: randomChar.name, text: charadesTopic }]);
          setTimeout(() => {
             setCharadesChat(prev => [...prev, { author: '系統', text: `${randomChar.name} 猜對了！答案是 ${charadesTopic}。` }]);
             setTimeout(() => {
               const nextIdx = (charadesDescriberIdx + 1) % charadesPlayers.length;
               setCharadesDescriberIdx(nextIdx);
               startNewRound(nextIdx, charadesPlayers, charadesRound + 1);
             }, 3000);
          }, 500);
        } else {
          setCharadesChat(prev => [...prev, { author: randomChar.name, text: '是...什麼啊？' }]);
        }
      }, 2000);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-neutral-100 text-black'} overflow-hidden`}>
      {/* Console Shell Header */}
      <div className="bg-neutral-800 p-4 border-b-4 border-neutral-900 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-white font-black italic tracking-tighter text-xl underline decoration-indigo-500 underline-offset-4">G-STATION</h2>
        </div>
        <button onClick={goHome} className="text-neutral-400 hover:text-white transition-colors"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto page-scroll relative">
        {gameState === 'setup' && !activeGame && (
          <div className="h-full flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
              <button 
                onClick={() => setActiveGame('uno')}
                className="bg-red-600 hover:bg-red-700 p-6 rounded-3xl shadow-[0_8px_0_#991b1b] active:translate-y-2 active:shadow-none transition-all flex items-center justify-between group"
              >
                <div className="text-left">
                  <div className="text-white font-black text-3xl italic">UNO</div>
                  <div className="text-red-200 text-xs font-bold uppercase tracking-widest mt-1">經典卡牌對決</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white"><Play fill="currentColor" /></div>
              </button>

              <button 
                onClick={() => setActiveGame('oldmaid')}
                className="bg-indigo-600 hover:bg-indigo-700 p-6 rounded-3xl shadow-[0_8px_0_#3730a3] active:translate-y-2 active:shadow-none transition-all flex items-center justify-between group"
              >
                <div className="text-left">
                  <div className="text-white font-black text-3xl italic">抽鬼牌</div>
                  <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">心機躲貓貓</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white"><Ghost fill="currentColor" /></div>
              </button>

              <button 
                onClick={() => setActiveGame('charades')}
                className="bg-amber-500 hover:bg-amber-600 p-6 rounded-3xl shadow-[0_8px_0_#92400e] active:translate-y-2 active:shadow-none transition-all flex items-center justify-between group"
              >
                <div className="text-left">
                  <div className="text-white font-black text-3xl italic">你說我猜</div>
                  <div className="text-amber-100 text-xs font-bold uppercase tracking-widest mt-1">語音與默契</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white"><MessageSquare fill="currentColor" /></div>
              </button>
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-30 mt-10">Select Your Game To Start</p>
          </div>
        )}

        {gameState === 'setup' && activeGame && (
          <div className="h-full p-6 flex flex-col items-center justify-center space-y-6">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">邀請夥伴 (1-3位)</h3>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {characters.map(c => (
                <button 
                  key={c.id}
                  onClick={() => handleToggleChar(c.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${selectedCharIds.includes(c.id) ? 'bg-amber-600 border-amber-600 text-white' : 'bg-transparent border-amber-200 text-amber-700'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className={`p-4 rounded-2xl w-full max-w-xs flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
              <div className="flex flex-col">
                <span className="text-sm font-bold">託管模式 (由 AI 代打)</span>
                <span className="text-[10px] opacity-40">讓角色們自主活動，您僅在旁觀戰</span>
              </div>
              <button 
                onClick={() => setIsAutoMode(!isAutoMode)}
                className={`w-12 h-6 rounded-full relative transition-all ${isAutoMode ? 'bg-[#76DE84]' : 'bg-neutral-600'}`}
              >
                <motion.div 
                  animate={{ x: isAutoMode ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setActiveGame(null)} className="px-8 py-3 rounded-full bg-neutral-300 font-bold text-sm">返回</button>
              <button 
                onClick={() => activeGame === 'uno' ? initUno() : activeGame === 'oldmaid' ? initOldMaid() : initCharades()}
                disabled={selectedChars.length === 0}
                className={`px-12 py-3 rounded-full font-black italic tracking-tighter text-lg shadow-lg ${selectedChars.length === 0 ? 'bg-neutral-400 opacity-50 cursor-not-allowed' : 'bg-indigo-600 text-white animate-bounce'}`}
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && activeGame === 'uno' && (
          <div className="h-full flex flex-col p-4 space-y-4">
            <div className="flex justify-between items-center px-2">
              <div className="flex gap-2">
                 <button 
                  onClick={() => setIsAutoMode(!isAutoMode)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${isAutoMode ? 'bg-[#76DE84] text-white border-[#76DE84]' : 'bg-white/10 text-neutral-400 border-neutral-700'}`}
                >
                  {isAutoMode ? '🤖 自動託管中' : '🎮 手動控制'}
                </button>
              </div>
              <button onClick={resetAll} className="p-1 rounded-full bg-white/10 text-white/40"><RotateCcw size={14} /></button>
            </div>
            <div className="flex justify-around items-start">
              {unoPlayers.map((p, i) => (
                <div key={p.id} className={`flex flex-col items-center transition-all ${unoTurn === i ? 'scale-110 opacity-100 ring-4 ring-indigo-500 rounded-2xl p-2' : 'opacity-50'}`}>
                  <div className="text-3xl mb-1">{p.avatar}</div>
                  <div className="text-[10px] font-bold">{p.name}</div>
                  <div className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full mt-1">HAND: {p.hand.length}</div>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="flex items-center gap-8">
                <button onClick={() => drawUnoCard(unoTurn)} className="w-24 h-36 bg-indigo-900 rounded-xl border-4 border-indigo-700 shadow-2xl flex items-center justify-center text-white font-black text-xl italic hover:rotate-3 transition-transform">
                  UNO
                </button>
                {unoDiscard.length > 0 && (
                  <div className={`w-24 h-36 rounded-xl border-4 flex flex-col items-center justify-center shadow-2xl transition-all duration-500 ${unoDiscard[unoDiscard.length-1].color === 'red' ? 'bg-red-500 border-red-300' : unoDiscard[unoDiscard.length-1].color === 'blue' ? 'bg-blue-500 border-blue-300' : unoDiscard[unoDiscard.length-1].color === 'green' ? 'bg-green-500 border-green-300' : unoDiscard[unoDiscard.length-1].color === 'yellow' ? 'bg-yellow-500 border-yellow-300' : 'bg-neutral-800 border-neutral-600'}`}>
                    <div className="text-white font-black text-2xl drop-shadow-md">{unoDiscard[unoDiscard.length-1].value}</div>
                  </div>
                )}
              </div>
              <div className="text-xs font-black italic text-indigo-500 animate-pulse">
                {unoDirection === 1 ? '顺時針方向' : '逆時針方向'}
              </div>
            </div>

            <div className="bg-black/10 p-4 rounded-3xl overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-2">
                {unoPlayers.find(p => p.id === 'user')?.hand.map((card, idx) => (
                  <button 
                    key={card.id}
                    onClick={() => playUnoCard(unoPlayers.findIndex(p => p.id === 'user'), idx)}
                    className={`w-16 h-24 rounded-lg flex flex-col items-center justify-center border-2 shadow-lg transition-transform hover:-translate-y-4 ${card.color === 'red' ? 'bg-red-500 border-red-300' : card.color === 'blue' ? 'bg-blue-500 border-blue-300' : card.color === 'green' ? 'bg-green-500 border-green-300' : card.color === 'yellow' ? 'bg-yellow-500 border-yellow-300' : 'bg-neutral-800 border-neutral-600 text-white'}`}
                  >
                    <div className="font-black text-xl">{card.value}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && activeGame === 'oldmaid' && (
          <div className="h-full flex flex-col p-4">
            <div className="flex justify-between items-center px-2 mb-4">
              <div className="flex gap-2">
                 <button 
                  onClick={() => setIsAutoMode(!isAutoMode)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${isAutoMode ? 'bg-[#76DE84] text-white border-[#76DE84]' : 'bg-white/10 text-neutral-400 border-neutral-700'}`}
                >
                  {isAutoMode ? '🤖 自動託管中' : '🎮 手動控制'}
                </button>
              </div>
              <button onClick={resetAll} className="p-1 rounded-full bg-white/10 text-white/40"><RotateCcw size={14} /></button>
            </div>
             <div className="flex justify-around items-start mb-10">
              {omPlayers.map((p, i) => (
                <div key={p.id} className={`flex flex-col items-center transition-all ${unoTurn === i ? 'scale-110 opacity-100 ring-4 ring-indigo-500 rounded-2xl p-2' : 'opacity-50'}`}>
                  <div className="text-3xl mb-1">{p.avatar}</div>
                  <div className="text-[10px] font-bold">{p.name}</div>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center bg-black/5 rounded-3xl m-4 p-8 border-4 border-dashed border-black/10">
              <div className="mb-4 text-xs font-bold opacity-40 uppercase">從鄰居抽取一張牌：</div>
              <div className="flex gap-2 justify-center flex-wrap">
                {omPlayers.length > 0 && omPlayers[(unoTurn + omPlayers.length - 1) % omPlayers.length]?.hand.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => omPlayers[unoTurn]?.id === 'user' && omDraw((unoTurn + omPlayers.length - 1) % omPlayers.length, idx)}
                    className="w-12 h-20 bg-indigo-800 rounded-lg shadow-lg border-2 border-indigo-600 animate-in zoom-in duration-300"
                  />
                ))}
              </div>
            </div>

            <div className="p-4 overflow-x-auto bg-black/20 rounded-t-3xl">
              <div className="flex gap-1 justify-center min-w-max">
                {omPlayers.find(p => p.id === 'user')?.hand.map((card, idx) => (
                  <div key={idx} className="w-14 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border-2 border-neutral-200">
                    <div className="font-bold text-xl">{card}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && activeGame === 'charades' && (
          <div className="h-full flex flex-col pt-4">
            <div className="flex justify-between items-center px-4 mb-2">
              <div className="flex gap-2">
                 <button 
                  onClick={() => setIsAutoMode(!isAutoMode)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${isAutoMode ? 'bg-[#76DE84] text-white border-[#76DE84]' : 'bg-white/10 text-neutral-400 border-neutral-700'}`}
                >
                  {isAutoMode ? '🤖 自動託管中' : '🎮 手動控制'}
                </button>
              </div>
              <button onClick={resetAll} className="p-1 rounded-full bg-white/10 text-white/40"><RotateCcw size={14} /></button>
            </div>
             <div className="flex justify-around items-start px-4">
              {charadesPlayers.map((p, i) => (
                <div key={p.id} className={`flex flex-col items-center transition-all ${charadesDescriberIdx === i ? 'scale-110 opacity-100' : 'opacity-40'}`}>
                  <div className="text-3xl">{p.avatar}</div>
                  <div className="text-[10px] font-bold mt-1">{p.name}</div>
                  {charadesDescriberIdx === i && <div className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full mt-1 font-black italic">描述者</div>}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto page-scroll p-4 space-y-4">
               {charadesChat.map((chat, idx) => (
                 <div key={idx} className={`flex flex-col ${chat.author === '系統' ? 'items-center' : chat.author === userProfile.name ? 'items-end' : 'items-start'}`}>
                   <div className="text-[10px] font-bold opacity-40 mb-1 px-2">{chat.author}</div>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm ${chat.author === '系統' ? 'bg-amber-100 text-amber-800 border border-amber-200 text-center italic' : chat.author === userProfile.name ? 'bg-indigo-600 text-white' : 'bg-white text-black'}`}>
                     {chat.text}
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-white border-t-4 border-neutral-200">
               {charadesPlayers[charadesDescriberIdx].id === 'user' ? (
                 <div className="space-y-4">
                   <div className="p-3 bg-red-500 text-white rounded-2xl text-center font-black italic">
                      題目：{charadesTopic}
                   </div>
                   <div className="flex gap-2">
                     <input 
                       className="flex-1 outline-none p-3 bg-neutral-100 rounded-2xl text-sm"
                       placeholder="描述你的題目..."
                       value={charadesInput}
                       onChange={e => setCharadesInput(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && handleCharadesDescribe(charadesInput)}
                     />
                     <button onClick={() => handleCharadesDescribe(charadesInput)} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                       <Send size={20} />
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="flex gap-2">
                   <input 
                     className="flex-1 outline-none p-3 bg-neutral-100 rounded-2xl text-sm"
                     placeholder="你的猜測是..."
                     value={charadesInput}
                     onChange={e => setCharadesInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleCharadesGuess(charadesInput)}
                   />
                   <button onClick={() => handleCharadesGuess(charadesInput)} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                      <Send size={20} />
                   </button>
                 </div>
               )}
            </div>
          </div>
        )}

        {gameState === 'ended' && (
          <div className="h-full flex flex-col items-center justify-center space-y-10 bg-indigo-900 text-white p-8 animate-in fade-in zoom-in duration-1000">
             <div className="text-center space-y-2">
                <Trophy size={80} className="mx-auto text-amber-400 drop-shadow-glow" />
                <h2 className="text-4xl font-black italic tracking-tighter uppercase mt-4">GAME OVER</h2>
                <p className="text-xl font-bold opacity-90 whitespace-pre-wrap">{activeGame === 'uno' ? unoWinner : activeGame === 'oldmaid' ? omWinner : charadesWinner}</p>
             </div>
             <button onClick={resetAll} className="px-12 py-4 bg-white text-indigo-900 rounded-full font-black italic text-lg shadow-[0_6px_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all">
                PLAY AGAIN
             </button>
          </div>
        )}
      </div>

      {/* Console D-Pad / Buttons mockup footer */}
      <div className="h-24 bg-neutral-800 border-t-4 border-neutral-900 flex items-center justify-between px-8 relative overflow-hidden">
        <div className="flex flex-col items-center gap-1 opacity-20">
          <div className="w-10 h-10 border-4 border-neutral-600 rounded-full" />
          <div className="text-[8px] font-bold text-neutral-400">ANALOG</div>
        </div>
        <div className="flex gap-4">
           <div className="w-4 h-12 bg-neutral-700 rotate-45 rounded-full" />
           <div className="w-4 h-12 bg-neutral-700 rotate-45 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2 rotate-12">
          <div className="w-8 h-8 rounded-full bg-red-600 shadow-inner" />
          <div className="w-8 h-8 rounded-full bg-indigo-600 shadow-inner" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-black italic text-neutral-600 tracking-widest uppercase">High Performance Portable System</div>
      </div>
    </div>
  );
};

export default function App() {
// --- 1. 所有的變數宣告 (useState & useRef) - 確保每個只出現一次 ---
  const [screenState, setScreenState] = useState<ScreenState>(ScreenState.Locked);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState<Language>(Language.ZH_TW);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const [typingChatId, setTypingChatId] = useState<string | null>(null);

  // 設定與轉盤專用狀態
  const [editingCharId, setEditingCharId] = useState<string | null>(null);
  const [wheelSpins, setWheelSpins] = useState(3); // 初始次數設為 3
  const [settingsTab, setSettingsTab] = useState<'main' | 'general' | 'appearance' | 'privacy' | 'icons' | 'aiConfig'>('main');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const wheelRewards = [10, 50, 100, 200, 50, 100, 0, 50];

  const [lockWallpaper, setLockWallpaper] = useState<string>("https://storage.googleapis.com/fun-app-assets/user-uploads/input_file_0.png");
  const [homeWallpaper, setHomeWallpaper] = useState<string>("https://storage.googleapis.com/fun-app-assets/user-uploads/input_file_0.png");

  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: '使用者', age: '', gender: '', avatar: '🥕', signature: '今天也是美好的一天' 
  });

  const [walletBalance, setWalletBalance] = useState(300);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [aiSettings, setAiSettings] = useState<AISettings>({ 
    apiKey: '', model: 'gemini-1.5-flash', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/'
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [warehouseItems, setWarehouseItems] = useState<{id: string, amount: number}[]>([]);
  const [gardenPatches, setGardenPatches] = useState<GardenPatch[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i, status: i < 4 ? 'empty' : 'locked' }))
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [receivedGifts, setReceivedGifts] = useState<ReceivedGift[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);

  const [momentGroups, setMomentGroups] = useState<MomentGroup[]>([
    { id: 'group1', name: '朋友圈1', characterIds: [] },
    { id: 'group2', name: '朋友圈2', characterIds: [] }
  ]);
  const [momentPosts, setMomentPosts] = useState<MomentPost[]>([]);
  const [dailyStoreItems, setDailyStoreItems] = useState<any>({ fish: [], crops: [], gifts: [] });

  const [customIcons, setCustomIcons] = useState<Record<string, string>>({});
  const [appNames, setAppNames] = useState<Record<string, string>>({});
  const [installedApps, setInstalledApps] = useState<AppId[]>(['messages', 'settings', 'store', 'kitchen', 'wallet', 'garden', 'photos', 'characters', 'warehouse', 'fishing', 'wheel', 'dex', 'moments', 'game']);
  const [dockApps, setDockApps] = useState<AppId[]>(['messages']);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // --- 2. 所有的功能函式 ---

  // 初始化商城
  useEffect(() => {
    const shuffle = (arr: any[]) => [...arr].sort(() => 0.5 - Math.random());
    setDailyStoreItems({
      fish: shuffle(FISH_TYPES).slice(0, 6).map(f => ({ id: f.id, price: 100 })),
      crops: shuffle(CROP_TYPES).slice(0, 6).map(c => ({ id: c.id, price: c.sellPrice })),
      gifts: shuffle(POSSIBLE_GIFTS).slice(0, 6).map(g => ({ id: g.id, price: g.price }))
    });
  }, []);

  const addTransaction = (type: 'income' | 'expense' | 'transfer', amount: number, title: string) => {
    const newTx: Transaction = { id: Date.now().toString(), type, amount, title, timestamp: new Date().toLocaleString() };
    setTransactions(prev => [newTx, ...prev]);
  };

  const removeApp = (id: AppId) => setInstalledApps(prev => prev.filter(a => a !== id));
  const removeDockApp = (id: AppId) => setDockApps(prev => prev.filter(a => a !== id));
  const addApp = (id: AppId) => { setInstalledApps(prev => [...prev, id]); setIsAddingApp(false); };
  const goHome = () => { setScreenState(ScreenState.Home); setActiveApp(null); setSelectedChatId(null); setIsJiggling(false); setSettingsTab('main'); };
  const openApp = (app: AppId) => { if (!isJiggling) { setActiveApp(app); setScreenState(ScreenState.AppOpen); } };

  const onUnlockPatch = (id: number) => {
    if (walletBalance >= 300) {
      setWalletBalance(prev => prev - 300);
      addTransaction('expense', 300, '解鎖花園土堆');
      setGardenPatches(prev => prev.map(p => p.id === id ? { ...p, status: 'empty' } : p));
    }
  };

  const onPlant = (id: number) => {
    const crop = CROP_TYPES[Math.floor(Math.random() * CROP_TYPES.length)];
    setGardenPatches(prev => prev.map(p => p.id === id ? { ...p, status: 'growing', cropId: crop.id, plantedTime: Date.now(), needsWatering: false } : p));
  };

  const onWater = (id: number) => {
    setGardenPatches(prev => prev.map(p => p.id === id ? { ...p, lastWateredTime: Date.now(), needsWatering: false } : p));
  };

  const onHarvest = (id: number) => {
    setGardenPatches(prev => prev.map(p => {
      if (p.id === id && p.cropId) {
        setWarehouseItems(items => {
          const existing = items.find(i => i.id === p.cropId);
          return existing ? items.map(i => i.id === p.cropId ? { ...i, amount: i.amount + 1 } : i) : [...items, { id: p.cropId!, amount: 1 }];
        });
        return { ...p, status: 'empty', cropId: undefined };
      }
      return p;
    }));
  };

  const onCatchFish = (id: string) => {
    setWarehouseItems(prev => {
      const existing = prev.find(i => i.id === id);
      return existing ? prev.map(i => i.id === id ? { ...i, amount: i.amount + 1 } : i) : [...prev, { id, amount: 1 }];
    });
  };

  const onCatchTrash = (coins: number) => {
    setWalletBalance(prev => prev + coins);
    addTransaction('income', coins, '釣魚獲得金幣');
  };

  const onSell = (id: string, name: string, price: number) => {
    setWarehouseItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.amount > 0) {
        setWalletBalance(b => b + price);
        addTransaction('income', price, `出售 ${name}`);
        return item.amount === 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, amount: i.amount - 1 } : i);
      }
      return prev;
    });
  };

  const callUniversalAI = async (history: Message[], systemPrompt: string) => {
    if (!aiSettings.apiKey) return "請輸入 API Key";
    try {
      const url = `${aiSettings.baseUrl.replace(/\/$/, '')}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${aiSettings.apiKey}` },
        body: JSON.stringify({
          model: aiSettings.model,
          messages: [{ role: "system", content: systemPrompt }, ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text }))],
          temperature: 0.7,
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) { return "AI 連線失敗"; }
  };

  // --- 3. App 專用渲染函式 (恢復原本的精緻設計) ---

  const renderMessagesApp = () => {
    if (selectedChatId) {
      const char = characters.find(c => c.id === selectedChatId);
      if (!char) return null;
      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-neutral-50 text-black'}`}>
          <div className={`px-4 pt-16 pb-3 flex items-center border-b ${isDarkMode ? 'bg-[#1c1c1e]/80 border-[#38383a]' : 'bg-white/80 border-neutral-200'} backdrop-blur-md sticky top-0 z-10`}>
            <button onClick={() => setSelectedChatId(null)} className="text-[#76DE84] flex items-center font-bold"><ChevronLeft size={20} /> 訊息</button>
            <div className="flex-1 flex flex-col items-center mr-10">
              <span className="font-bold">{char.name}</span>
              <span className="text-[10px] text-[#76DE84]">在線上</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {char.messages.map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-[20px] text-sm ${m.role === 'user' ? 'bg-[#007AFF] text-white rounded-tr-none' : (isDarkMode ? 'bg-[#3a3a3c] text-white rounded-tl-none' : 'bg-white shadow-sm rounded-tl-none')}`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>
          <div className={`p-4 pb-10 border-t ${isDarkMode ? 'bg-[#1c1c1e] border-[#38383a]' : 'bg-white border-neutral-100'} flex gap-2`}>
            <input 
              className={`flex-1 rounded-full px-4 py-2 text-sm outline-none ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-neutral-100'}`}
              placeholder="iMessage"
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  if (!target.value) return;
                  const text = target.value;
                  target.value = '';
                  setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, messages: [...c.messages, { role: 'user', text } as Message] } : c));
                  const response = await callUniversalAI([...char.messages, { role: 'user', text }], char.settings);
                  setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, messages: [...c.messages, { role: 'user', text }, { role: 'model', text: response } as Message] } : c));
                }
              }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="px-6 pt-16 pb-3 text-3xl font-black">訊息</div>
        <div className="flex-1 overflow-y-auto">
          {characters.map(c => (
            <div key={c.id} onClick={() => setSelectedChatId(c.id)} className={`px-4 py-3 flex items-center gap-3 border-b ${isDarkMode ? 'border-white/5 active:bg-white/5' : 'border-neutral-100 active:bg-neutral-50'}`}>
              <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-200 shrink-0 text-2xl flex items-center justify-center border border-white/10">
                <AvatarImage src={c.avatar} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-[15px]">{c.name}</span>
                  <span className="text-xs opacity-40">現在</span>
                </div>
                <div className="text-sm opacity-50 truncate">{c.messages[c.messages.length - 1]?.text || '尚無訊息'}</div>
              </div>
            </div>
          ))}
          {characters.length === 0 && <div className="p-20 text-center text-neutral-400">尚無聯絡人</div>}
        </div>
      </div>
    );
  };

const renderSettings = () => {
    const t = TRANSLATIONS[language];

    // --- 子頁面渲染邏輯 ---
    if (settingsTab !== 'main') {
      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
          <Header title={t[settingsTab as keyof typeof t] || '設定'} onBack={() => setSettingsTab('main')} isDarkMode={isDarkMode} />
          <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
            
            {/* 個人資料編輯 */}
            {settingsTab === 'general' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center py-4">
                  <div className="w-20 h-20 rounded-full bg-neutral-200 shadow-inner mb-2 overflow-hidden flex items-center justify-center text-4xl border-2 border-white">
                    <AvatarImage src={userProfile.avatar} />
                  </div>
                  <button onClick={() => {
                    const icon = prompt('輸入新的 Emoji 或頭像網址', userProfile.avatar);
                    if(icon) setUserProfile({...userProfile, avatar: icon});
                  }} className="text-[#76DE84] text-xs font-bold">更換大頭照</button>
                </div>
                <div className={`rounded-xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white divide-neutral-100'}`}>
                  <ProfileInput label="你的姓名" value={userProfile.name} isDark={isDarkMode} onChange={v => setUserProfile({...userProfile, name: v})} />
                  <ProfileInput label="個人簽名" value={userProfile.signature} isDark={isDarkMode} onChange={v => setUserProfile({...userProfile, signature: v})} />
                </div>
                <div className="px-4 text-xs text-neutral-500">這些資訊將用於與 AI 角色互動時的稱呼。</div>
              </div>
            )}

            {/* API 設定 */}
            {settingsTab === 'aiConfig' && (
              <div className="space-y-6">
                <div className={`rounded-xl p-4 space-y-4 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                  <div>
                    <label className="text-[10px] font-bold opacity-40 uppercase block mb-1">API Endpoint (網址)</label>
                    <input className="w-full bg-transparent outline-none text-sm border-b border-neutral-500/20 pb-1" value={aiSettings.baseUrl} onChange={e => setAiSettings({...aiSettings, baseUrl: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold opacity-40 uppercase block mb-1">API Key (金鑰)</label>
                    <input type="password" placeholder="sk-..." className="w-full bg-transparent outline-none text-sm border-b border-neutral-500/20 pb-1" value={aiSettings.apiKey} onChange={e => setAiSettings({...aiSettings, apiKey: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold opacity-40 uppercase block mb-1">模型名稱 (Model)</label>
                    <input className="w-full bg-transparent outline-none text-sm border-b border-neutral-500/20 pb-1" value={aiSettings.model} onChange={e => setAiSettings({...aiSettings, model: e.target.value})} />
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 px-2 italic">※ 預設支援 OpenAI 格式。若使用 Gemini 請確保網址正確。</p>
              </div>
            )}

            {/* 更換圖示與名稱 */}
            {settingsTab === 'icons' && (
              <div className="space-y-4">
                {installedApps.map(appId => (
                  <div key={appId} className={`p-4 rounded-xl flex items-center gap-4 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'}`}>
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-neutral-200">
                      {customIcons[appId] ? <img src={customIcons[appId]} className="w-full h-full object-cover" /> : getIconElement(appId)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input className="font-bold text-sm bg-transparent outline-none w-full" value={appNames[appId] || appId} 
                        onChange={e => setAppNames({...appNames, [appId]: e.target.value})} placeholder="修改 App 名稱" />
                      <input className="text-[10px] opacity-40 bg-transparent outline-none w-full" value={customIcons[appId] || ''} 
                        onChange={e => setCustomIcons({...customIcons, [appId]: e.target.value})} placeholder="輸入圖示網址 (留空預設)" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 背景圖片與全屏 */}
            {settingsTab === 'appearance' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <WallpaperThumb label="鎖定畫面" src={lockWallpaper} onClick={() => {const u = prompt('網址?', lockWallpaper); if(u) setLockWallpaper(u)}} />
                  <WallpaperThumb label="主畫面" src={homeWallpaper} onClick={() => {const u = prompt('網址?', homeWallpaper); if(u) setHomeWallpaper(u)}} />
                </div>
                <div className={`rounded-xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white divide-neutral-100'}`}>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white"><Maximize size={18} /></div>
                      <span className="text-sm font-medium">沈浸式全螢幕模式</span>
                    </div>
                    <button onClick={() => setIsFullScreen(!isFullScreen)} className={`w-12 h-6 rounded-full relative transition-colors ${isFullScreen ? 'bg-[#76DE84]' : 'bg-neutral-300'}`}>
                      <motion.div animate={{ x: isFullScreen ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-center text-neutral-500 italic">※ 全螢幕模式將移除手機邊框，適合在行動裝置上使用。</p>
              </div>
            )}

            {/* 存檔管理 */}
            {settingsTab === 'privacy' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => {
                    const data = JSON.stringify({ userProfile, walletBalance, characters, warehouseItems, transactions, customIcons, appNames });
                    navigator.clipboard.writeText(data);
                    alert("存檔代碼已複製到剪貼簿！");
                  }} className="flex flex-col items-center gap-2 p-6 bg-blue-500 text-white rounded-3xl active:scale-95 transition-transform">
                    <Download size={32} />
                    <span className="font-bold text-sm">導出存檔</span>
                  </button>
                  <button onClick={() => {
                    const code = prompt("請貼上導出的存檔代碼：");
                    if(code) {
                      try {
                        const parsed = JSON.parse(code);
                        if(parsed.userProfile) {
                          setUserProfile(parsed.userProfile);
                          setWalletBalance(parsed.walletBalance || 0);
                          setCharacters(parsed.characters || []);
                          setWarehouseItems(parsed.warehouseItems || []);
                          alert("導入成功！");
                          location.reload();
                        }
                      } catch(e) { alert("無效的代碼！"); }
                    }
                  }} className="flex flex-col items-center gap-2 p-6 bg-emerald-500 text-white rounded-3xl active:scale-95 transition-transform">
                    <Upload size={32} />
                    <span className="font-bold text-sm">導入存檔</span>
                  </button>
                </div>
                <div className={`rounded-xl p-4 border-2 border-red-500/20 text-center ${isDarkMode ? 'bg-red-500/5' : 'bg-red-50'}`}>
                   <button onClick={() => { if(confirm("這將刪除所有數據，確定嗎？")) { localStorage.clear(); location.reload(); }}} className="text-red-500 font-bold text-sm">重置所有玩家資料</button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- 設定主頁面 ---
    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
        <div className="px-6 pt-16 pb-3 text-3xl font-black">{t.settings}</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* 個人資料入口 (頂部) */}
          <div onClick={() => setSettingsTab('general')} className={`p-4 rounded-2xl flex items-center gap-4 active:opacity-70 transition-opacity ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
            <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 border-2 border-white">
              <AvatarImage src={userProfile.avatar} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight">{userProfile.name}</h3>
              <p className="text-xs opacity-50 truncate w-48">{userProfile.signature || '編輯個人資料'}</p>
            </div>
            <ChevronRight size={20} className="opacity-20" />
          </div>

          <div className={`rounded-xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white divide-neutral-100'}`}>
            <SettingsRow icon={<Key size={18} color="white" />} iconBg="#8E8E93" label="AI 助手與 API 設定" onClick={() => setSettingsTab('aiConfig')} />
            <SettingsRow icon={<Grid size={18} color="white" />} iconBg="#AF52DE" label="更換圖示與自定義名稱" onClick={() => setSettingsTab('icons')} />
            <SettingsRow icon={<Image size={18} color="white" />} iconBg="#FF2D55" label="背景圖片與外觀" onClick={() => setSettingsTab('appearance')} />
            <SettingsRow icon={<Download size={18} color="white" />} iconBg="#007AFF" label="存檔與導入/導出" onClick={() => setSettingsTab('privacy')} />
          </div>

          <div className="text-center pb-10">
            <span className="text-[10px] opacity-20 font-mono tracking-widest uppercase">System Version 2.0.1</span>
          </div>
        </div>
      </div>
    );
  };

const renderWheelApp = () => {
    const handleSpin = () => {
      // 檢查次數
      if (wheelSpins <= 0) {
        alert("今日抽獎次數已用完囉！");
        return;
      }
      if (isSpinning) return;

      setIsSpinning(true);
      setWheelSpins(prev => prev - 1); // 扣除次數

      const randomDeg = 1800 + Math.floor(Math.random() * 360);
      setWheelRotation(prev => prev + randomDeg);
      
      setTimeout(() => {
        setIsSpinning(false);
        const actualDeg = (wheelRotation + randomDeg) % 360;
        const rewardIdx = Math.floor(((360 - actualDeg) % 360) / (360 / wheelRewards.length));
        const amount = wheelRewards[rewardIdx];
        setWalletBalance(prev => prev + amount);
        addTransaction('income', amount, '每日轉盤獎勵');
        alert(`恭喜獲得 $${amount} 金幣！`);
      }, 4000);
    };

    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-6 pt-20 ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-amber-50 text-amber-900'}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black italic tracking-tighter">DAILY SPIN</h2>
          <div className="mt-2 bg-amber-200/50 px-4 py-1 rounded-full inline-block">
             <span className="text-xs font-bold text-amber-800">今日剩餘次數：{wheelSpins} / 3</span>
          </div>
        </div>
        
        <div className="relative">
          <motion.div animate={{ rotate: wheelRotation }} transition={{ duration: 4, ease: [0.13, 0, 0, 1] }} className="w-72 h-72 rounded-full border-[10px] border-amber-600 relative overflow-hidden shadow-2xl bg-white">
            {wheelRewards.map((r, i) => (
              <div key={i} className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom flex flex-col items-center" style={{ transform: `translateX(-50%) rotate(${i * (360/wheelRewards.length)}deg)` }}>
                <span className="mt-2 text-[10px] font-black text-amber-800">${r}</span>
              </div>
            ))}
          </motion.div>
          {/* 指針 */}
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600 z-10 drop-shadow-md" />
        </div>

        <button 
          onClick={handleSpin} 
          disabled={isSpinning || wheelSpins <= 0} 
          className={`mt-14 px-12 py-4 rounded-full font-black text-xl shadow-xl transition-all active:scale-95 ${
            (isSpinning || wheelSpins <= 0) ? 'bg-neutral-400' : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {isSpinning ? 'SPINNING...' : wheelSpins <= 0 ? 'TOMORROW' : 'SPIN NOW'}
        </button>
      </div>
    );
  };

const renderCharacters = () => {
    // 如果有選中角色，則顯示「編輯頁面」
    if (editingCharId) {
      const char = characters.find(c => c.id === editingCharId);
      if (!char) return null;
      
      const updateChar = (field: keyof Character, value: any) => {
        setCharacters(prev => prev.map(c => c.id === editingCharId ? { ...c, [field]: value } : c));
      };

      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
          <Header title="編輯角色" onBack={() => setEditingCharId(null)} isDarkMode={isDarkMode} />
          <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
            {/* 大頭照 */}
            <div className="flex flex-col items-center py-6">
              <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center text-5xl border-4 border-white shadow-lg mb-2 overflow-hidden">
                <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => {
                const icon = prompt('輸入 Emoji 或圖片網址', char.avatar);
                if(icon) updateChar('avatar', icon);
              }} className="text-[#76DE84] text-sm font-bold">更換頭像</button>
            </div>

            {/* 基本資料區 */}
            <div className={`rounded-xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-[#38383a]' : 'bg-white divide-neutral-100'}`}>
              <ProfileInput label="姓名" value={char.name} isDark={isDarkMode} onChange={v => updateChar('name', v)} />
              <ProfileInput label="性別" value={char.gender} isDark={isDarkMode} onChange={v => updateChar('gender', v)} />
              <ProfileInput label="年齡" value={char.age} isDark={isDarkMode} onChange={v => updateChar('age', v)} />
              <ProfileInput label="好感度" value={char.favorability.toString()} isDark={isDarkMode} onChange={v => updateChar('favorability', parseInt(v) || 0)} />
            </div>

            {/* 性格與簽名 */}
            <div className={`rounded-xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-[#38383a]' : 'bg-white divide-neutral-100'}`}>
              <div className="px-5 py-3">
                <label className="text-xs font-bold opacity-40 block mb-1">個性設定</label>
                <input className="w-full bg-transparent outline-none text-sm" value={char.personality} onChange={e => updateChar('personality', e.target.value)} />
              </div>
              <div className="px-5 py-3">
                <label className="text-xs font-bold opacity-40 block mb-1">個人簽名</label>
                <input className="w-full bg-transparent outline-none text-sm" value={char.signature} onChange={e => updateChar('signature', e.target.value)} />
              </div>
            </div>

            {/* AI 核心指令 */}
            <div className={`rounded-xl p-5 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'}`}>
              <label className="text-xs font-bold opacity-40 block mb-2">AI 系統提示語 (System Prompt)</label>
              <textarea 
                className="w-full h-32 bg-transparent outline-none text-sm resize-none"
                value={char.settings}
                onChange={e => updateChar('settings', e.target.value)}
                placeholder="例如：你現在是一個傲嬌的妹妹..."
              />
            </div>

            <button onClick={() => {
              if(confirm('確定要刪除此角色嗎？')) {
                setCharacters(prev => prev.filter(c => c.id !== editingCharId));
                setEditingCharId(null);
              }
            }} className="w-full py-4 text-red-500 font-bold">刪除角色</button>
          </div>
        </div>
      );
    }

    // 角色列表頁面
    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
        <div className="px-6 pt-16 pb-3 flex justify-between items-center">
          <span className="text-3xl font-black text-[#76DE84]">CHARACTERS</span>
          <button onClick={() => {
            const newId = Date.now().toString();
            const newChar: Character = {
              id: newId, name: '新角色', avatar: '🐱', gender: '女', age: '18',
              personality: '溫柔', habits: '', signature: '很高興認識你',
              settings: '你是一個親切的聊天對象。', favorability: 0, messages: [], memos: [],
              minResponseTime: 1, maxResponseTime: 3, maxMessagesPerTurn: 1
            };
            setCharacters([...characters, newChar]);
            setEditingCharId(newId); // 新增後直接進入編輯頁
          }} className="w-10 h-10 rounded-full bg-[#76DE84] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
            <Plus size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {characters.map(c => (
            <div key={c.id} onClick={() => setEditingCharId(c.id)} className={`p-4 rounded-3xl flex items-center gap-4 active:scale-[0.98] transition-all border ${isDarkMode ? 'bg-[#1c1c1e] border-white/5' : 'bg-white border-neutral-100 shadow-sm'}`}>
              <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center text-2xl border border-white/10">
                 <AvatarImage src={c.avatar} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{c.name}</div>
                <div className="text-xs opacity-40 italic">{c.signature || '這傢伙很懶，什麼都沒留'}</div>
              </div>
              <div className="text-right">
                 <div className="text-pink-500 font-black text-sm">❤️ {c.favorability}</div>
                 <ChevronRight size={16} className="ml-auto opacity-20" />
              </div>
            </div>
          ))}
          {characters.length === 0 && <div className="p-20 text-center text-neutral-400">目前空空如也，點擊上方 + 創造新角色</div>}
        </div>
      </div>
    );
  };

  // --- 4. 渲染切換器 ---
  const renderAppContent = () => {
    switch (activeApp) {
      case 'messages': return renderMessagesApp();
      case 'settings': return renderSettings();
      case 'wheel': return renderWheelApp();
      case 'characters': return renderCharacters();
      case 'game': return <GameApp characters={characters} userProfile={userProfile} isDarkMode={isDarkMode} goHome={goHome} aiSettings={aiSettings} walletBalance={walletBalance} setWalletBalance={setWalletBalance} setCharacters={setCharacters} addTransaction={addTransaction} callUniversalAI={callUniversalAI} />;
      case 'garden': return <GardenApp patches={gardenPatches} isDarkMode={isDarkMode} goHome={goHome} onUnlockPatch={onUnlockPatch} onPlant={onPlant} onWater={onWater} onHarvest={onHarvest} />;
      case 'kitchen': return <KitchenApp isDarkMode={isDarkMode} goHome={goHome} warehouseItems={warehouseItems} setWarehouseItems={setWarehouseItems} characters={characters} setCharacters={setCharacters} />;
      case 'store': return <StoreApp walletBalance={walletBalance} setWalletBalance={setWalletBalance} addTransaction={addTransaction} setWarehouseItems={setWarehouseItems} dailyStoreItems={dailyStoreItems} isDarkMode={isDarkMode} goHome={goHome} warehouseItems={warehouseItems} characters={characters} setCharacters={setCharacters} />;
      case 'wallet': return <WalletApp walletBalance={walletBalance} transactions={transactions} isDarkMode={isDarkMode} goHome={goHome} setActiveApp={setActiveApp} />;
      case 'warehouse': return <WarehouseApp warehouseItems={warehouseItems} receivedGifts={receivedGifts} isDarkMode={isDarkMode} goHome={goHome} onSell={onSell} />;
      case 'fishing': return <FishingApp isDarkMode={isDarkMode} goHome={goHome} onCatchFish={onCatchFish} onCatchTrash={onCatchTrash} />;
      case 'photos': return <MailboxApp isDarkMode={isDarkMode} goHome={goHome} letters={letters} setLetters={setLetters} characters={characters} userProfile={userProfile} />;
      case 'dex': return <DexApp isDarkMode={isDarkMode} goHome={goHome} />;
      case 'moments': return <MomentsApp momentGroups={momentGroups} setMomentGroups={setMomentGroups} momentPosts={momentPosts} setMomentPosts={setMomentPosts} characters={characters} userProfile={userProfile} isDarkMode={isDarkMode} goHome={goHome} />;
      default: return <div className="p-20 text-center">App 內容載入中...</div>;
    }
  };

  // --- 5. 最後的畫面 Return ---
return (
    <div className={`min-h-screen bg-[#F0F0F0] flex items-center justify-center transition-all duration-700 ${isFullScreen ? 'p-0 bg-black' : 'p-4'}`}>
      <div 
        style={isFullScreen ? { 
          maxWidth: '100%', 
          height: '100vh', 
          borderRadius: '0', 
          borderWidth: '0' 
        } : {}}
        className={`relative w-full max-w-[375px] h-[812px] bg-black rounded-[55px] border-[12px] border-neutral-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-700`}
      >

        <AnimatePresence mode="wait">
          {screenState === ScreenState.Locked && (
            <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -812 }} className="flex-1 bg-cover bg-center flex flex-col items-center justify-between py-20" style={{ backgroundImage: `url(${lockWallpaper})` }}>
              <div className="text-white text-center">
                <Lock size={20} className="mx-auto mb-2 opacity-80" />
                <h1 className="text-7xl font-thin tracking-tighter">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                <p className="text-xl font-medium opacity-90">{currentTime.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
              </div>
              <button onClick={() => setScreenState(ScreenState.Home)} className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg"><Unlock size={28} /></button>
            </motion.div>
          )}

          {screenState === ScreenState.Home && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex-1 bg-cover bg-center relative" style={{ backgroundImage: `url(${homeWallpaper})` }}
              onPointerDown={(e) => e.target === e.currentTarget && setIsJiggling(false)}>
              <div className="grid grid-cols-4 gap-4 p-6 pt-24">
                {installedApps.map((id) => (
                  <AppIcon key={id} id={id} label={appNames[id] || id} color={getIconColor(id)} icon={getIconElement(id)} isDarkMode={isDarkMode} isJiggling={isJiggling} onClick={() => openApp(id)} onRemove={() => removeApp(id)} />
                ))}
              </div>
              <div className="absolute bottom-6 left-3 right-3 h-[90px] bg-white/20 backdrop-blur-3xl rounded-[35px] flex items-center justify-around px-4 border border-white/20 z-30">
                {dockApps.map(id => (
                  <AppIcon key={id} id={id} label="" color={getIconColor(id)} icon={getIconElement(id)} isDarkMode={isDarkMode} isJiggling={isJiggling} onClick={() => openApp(id)} onRemove={() => removeDockApp(id)} />
                ))}
              </div>
            </motion.div>
          )}

          {screenState === ScreenState.AppOpen && (
            <motion.div key="app" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="flex-1 bg-white z-50 overflow-hidden flex flex-col rounded-t-[40px]">
              {renderAppContent()}
              <div onClick={goHome} className="h-1.5 w-36 bg-black/10 rounded-full mx-auto my-2 cursor-pointer hover:bg-black/20 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        {screenState === ScreenState.Home && (
          <div onClick={goHome} className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/40 rounded-full z-[100] cursor-pointer hover:bg-white/60 transition-colors" />
        )}
      </div>
    </div>
  );
}

// --- 輔助小組件 (定義在 App 外面，確保只出現一次) ---

const ProfileInput = ({ label, value, isDark, onChange }: any) => (
  <div className="px-5 py-3 flex items-center"><span className="w-20 text-sm font-medium">{label}</span>
    <input className={`flex-1 text-sm outline-none bg-transparent ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} value={value} onChange={e => onChange(e.target.value)} placeholder={`請輸入${label}`} /></div>
);

const WallpaperThumb = ({ label, src, onClick }: any) => (
  <div className="flex flex-col items-center gap-2 text-black"><span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{label}</span>
    <div className="w-24 h-48 bg-neutral-200 rounded-xl overflow-hidden border-2 border-white shadow-sm relative group cursor-pointer" onClick={onClick}>
      <img src={src} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Plus /></div></div></div>
);

const SettingsRow = ({ icon, iconBg, label, onClick }: any) => (
  <div onClick={onClick} className="px-5 py-3 flex items-center gap-3 cursor-pointer active:bg-neutral-800/10 transition-colors">
    <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center" style={{ backgroundColor: iconBg }}>{icon}</div>
    <span className="flex-1 font-medium text-sm">{label}</span><ChevronRight className="text-neutral-400" size={16} /></div>
);

const AppIcon = ({ id, label, color, icon, isDarkMode, isJiggling, customSrc, onClick, onRemove }: any) => (
  <div className={`flex flex-col items-center relative ${label === "" ? "" : "gap-1"}`}>
    <motion.button 
      animate={isJiggling ? { rotate: [0, -1, 1, -1, 0] } : {}}
      transition={isJiggling ? { repeat: Infinity, duration: 0.2 } : {}}
      whileTap={{ scale: 0.9 }} 
      onClick={isJiggling ? undefined : onClick} 
      className={`${label === "" ? "w-[60px] h-[60px]" : "w-[62px] h-[62px]"} rounded-[15px] flex items-center justify-center shadow-lg overflow-hidden border border-white/30 backdrop-blur-md bg-white/20`}
    >
      {customSrc ? (
        <img src={customSrc} className="w-full h-full object-cover" />
      ) : (
        <div className={isDarkMode ? "text-white" : "text-black"}>
          {React.cloneElement(icon as React.ReactElement, { size: label === "" ? 28 : 30 })}
        </div>
      )}
    </motion.button>
    {label !== "" && <span className="text-[11px] font-medium text-white drop-shadow-md truncate w-16 text-center">{label}</span>}
    {isJiggling && (
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-sm z-20">
        <Plus size={14} className="rotate-45" />
      </button>
    )}
  </div>
);
