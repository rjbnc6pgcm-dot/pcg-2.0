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
  Gift as GiftIcon
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";


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
interface AISettings { apiKey: string; model: string; }

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
  const outbox = letters.filter(l => l.senderId === 'user').sort((a, b) => b.timestamp - a.timestamp);

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
      alert(`${newLetters.length} 封信件已投遞！角色將在一小時後收到。`);
    }, 1000);
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-orange-50 text-amber-900' : 'bg-orange-50 text-amber-900'} overflow-hidden relative`}>
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')]"></div>
      
      <div className={`px-4 pt-16 pb-3 flex items-center justify-between border-b border-amber-200 z-10`}>
        <div className="flex gap-2">
          <button 
            onClick={() => setTab('write')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${tab === 'write' ? 'bg-amber-600 text-white shadow-lg' : 'bg-amber-200 text-amber-700'}`}
          >
            書信撰寫
          </button>
          <button 
            onClick={() => setTab('inbox')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${tab === 'inbox' ? 'bg-amber-600 text-white shadow-lg' : 'bg-amber-200 text-amber-700'}`}
          >
            查看信箱 {inbox.filter(l => !l.isRead).length > 0 && <span className="bg-red-500 text-white rounded-full px-1.5 ml-1 animate-pulse">{inbox.filter(l => !l.isRead).length}</span>}
          </button>
        </div>
        <button onClick={goHome} className="text-amber-600 font-medium">關閉</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 z-10">
        {tab === 'write' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white/60 p-6 rounded-lg shadow-sm border border-amber-100 min-h-[300px] flex flex-col">
              <div className="flex flex-col gap-2 mb-4 border-b border-amber-100 pb-2">
                <span className="text-sm font-bold opacity-60">收件人 (多選)：</span>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pt-1">
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
              </div>
              <textarea 
                className="flex-1 bg-transparent w-full resize-none outline-none text-sm leading-relaxed placeholder:text-amber-800/30"
                placeholder="在此寫下想說的話..."
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{ backgroundImage: 'linear-gradient(transparent, transparent 27px, #E5E7EB 27px)', backgroundSize: '100% 28px', lineHeight: '28px' }}
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] opacity-40">已選擇 {selectedCharIds.length} 位收件人</span>
                <button 
                  onClick={handleSendAll}
                  disabled={selectedCharIds.length === 0 || !content.trim() || isSending}
                  className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${selectedCharIds.length === 0 || !content.trim() || isSending ? 'bg-gray-300 text-gray-500' : 'bg-amber-600 text-white hover:bg-amber-700 shadow-md transform active:scale-95'}`}
                >
                  {isSending ? '寄送中...' : <><Send size={14} /> 一鍵投遞</>}
                </button>
              </div>
            </div>
            <div className="text-[10px] text-center opacity-40 italic">※ 信件將於一小時後送達對方手中</div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {inbox.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <Mail size={48} />
                <p className="mt-2 text-sm">信箱空空的...</p>
              </div>
            ) : (
              inbox.map(l => (
                <motion.div 
                  key={l.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    if (!l.isRead) {
                      setLetters(prev => prev.map(prevL => prevL.id === l.id ? { ...prevL, isRead: true } : prevL));
                    }
                  }}
                  className={`p-4 rounded-lg border shadow-sm transition-all cursor-pointer ${l.isRead ? 'bg-white/40 border-amber-100 opacity-60' : 'bg-white border-amber-200 ring-1 ring-amber-400/20'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-amber-900 flex items-center gap-1">
                      {!l.isRead && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                      來自：{l.senderName}
                    </span>
                    <span className="text-[10px] opacity-40">{new Date(l.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-3 whitespace-pre-wrap">{l.content}</p>
                </motion.div>
              ))
            )}
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

export default function App() {
  const [screenState, setScreenState] = useState<ScreenState>(ScreenState.Locked);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState<Language>(Language.ZH_TW);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const t = (key: keyof typeof TRANSLATIONS[Language.ZH_TW]) => {
    return TRANSLATIONS[language][key] || key;
  };
  
  // Customization States
  const [lockWallpaper, setLockWallpaper] = useState<string>("https://storage.googleapis.com/fun-app-assets/user-uploads/input_file_0.png");
  const [homeWallpaper, setHomeWallpaper] = useState<string>("https://storage.googleapis.com/fun-app-assets/user-uploads/input_file_0.png");
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: '使用者', 
    age: '', 
    gender: '', 
    avatar: '🥕',
    signature: '今天也是美好的一天' 
  });
  const [aiSettings, setAiSettings] = useState<AISettings>({ 
    apiKey: process.env.GEMINI_API_KEY || '', 
    model: 'gemini-flash-latest' 
  });
  const [customIcons, setCustomIcons] = useState<Record<string, string>>({});
  const [appNames, setAppNames] = useState<Record<string, string>>({
    messages: '訊息',
    store: '商城',
    settings: '設定',
    kitchen: '廚房',
    wallet: '錢包',
    garden: '花園',
    photos: '信箱',
    characters: '角色',
    warehouse: '倉庫',
    fishing: '釣魚',
    wheel: '每日轉盤',
    game: '遊戲',
    dex: '圖鑑',
    moments: '朋友圈'
  });
  const [installedApps, setInstalledApps] = useState<AppId[]>(['messages', 'settings', 'store', 'kitchen', 'wallet', 'garden', 'photos', 'characters', 'warehouse', 'fishing', 'wheel', 'dex', 'moments', 'game']);
  const [dockApps, setDockApps] = useState<AppId[]>(['messages']);
  
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


const GameApp = ({ characters, userProfile, isDarkMode, goHome, aiSettings, walletBalance, setWalletBalance, setCharacters, addTransaction }: { characters: Character[], userProfile: UserProfile, isDarkMode: boolean, goHome: () => void, aiSettings: AISettings, walletBalance: number, setWalletBalance: React.Dispatch<React.SetStateAction<number>>, setCharacters: React.Dispatch<React.SetStateAction<Character[]>>, addTransaction: (type: 'income' | 'expense' | 'transfer', amount: number, title: string) => void }) => {
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
    if (unoTurn !== playerIdx) return;
    const player = unoPlayers[playerIdx];
    const card = player.hand[cardIdx];
    const top = unoDiscard[unoDiscard.length - 1];

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

  // AI Uno move
  useEffect(() => {
    if (activeGame === 'uno' && gameState === 'playing' && (unoPlayers[unoTurn]?.id !== 'user' || isAutoMode)) {
      const isUserTurn = unoPlayers[unoTurn]?.id === 'user';
      const timer = setTimeout(() => {
        const p = unoPlayers[unoTurn];
        if (!p) return;
        const top = unoDiscard[unoDiscard.length - 1];
        if (!top) return;
        const playableIdx = p.hand.findIndex(c => c.color === 'wild' || c.color === top.color || c.value === top.value);
        if (playableIdx !== -1) playUnoCard(unoTurn, playableIdx);
        else drawUnoCard(unoTurn);
      }, isUserTurn ? 2000 : 1500);
      return () => clearTimeout(timer);
    }
  }, [unoTurn, gameState, activeGame, isAutoMode]);

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

  // AI Old Maid
  useEffect(() => {
    if (activeGame === 'oldmaid' && gameState === 'playing' && (omPlayers[unoTurn]?.id !== 'user' || isAutoMode)) {
      const isUserTurn = omPlayers[unoTurn]?.id === 'user';
      const timer = setTimeout(() => {
        const fromIdx = (unoTurn + omPlayers.length - 1) % omPlayers.length;
        if (omPlayers[fromIdx].hand.length > 0) {
          const randIdx = Math.floor(Math.random() * omPlayers[fromIdx].hand.length);
          omDraw(fromIdx, randIdx);
        } else {
          setUnoTurn((unoTurn + 1) % omPlayers.length);
        }
      }, isUserTurn ? 2500 : 2000);
      return () => clearTimeout(timer);
    }
  }, [unoTurn, gameState, activeGame, isAutoMode]);

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

  // AI guessing for user in Charades
  useEffect(() => {
    if (activeGame === 'charades' && gameState === 'playing' && isAutoMode && charadesPlayers[charadesDescriberIdx]?.id !== 'user') {
      // If user is guessing and in auto mode, give a 30% chance to guess right every 5 seconds
      const timer = setInterval(() => {
        if (Math.random() > 0.7) {
          handleCharadesGuess(charadesTopic);
        }
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeGame, gameState, isAutoMode, charadesDescriberIdx, charadesTopic]);

  const endCharadesGame = (players: GamePlayer[]) => {
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
長度約10-20個字。保持口吻。`;
    
    try {
      const gAI = new GoogleGenAI({ apiKey: aiSettings.apiKey || process.env.GEMINI_API_KEY || '' });
      const result = await gAI.models.generateContent({
        model: aiSettings.model,
        contents: [{ role: 'user', parts: [{ text: "請描述題目：" }] }],
        config: { 
          maxOutputTokens: 50,
          systemInstruction: systemPrompt 
        }
      });
      const text = result.text;
      if (text) {
        setCharadesChat(prev => [...prev, { author: char.name, text: text.trim() }]);
      }
    } catch (e) {
      setCharadesChat(prev => [...prev, { author: char.name, text: `提示：它圓圓的，紅色的... (AI 錯誤)` }]);
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
                  onClick={() => setSelectedChars(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : (prev.length < 3 ? [...prev, c.id] : prev))}
                  className={`p-4 rounded-3xl border-4 transition-all flex flex-col items-center gap-2 ${selectedChars.includes(c.id) ? 'bg-indigo-500 border-indigo-300 scale-105' : 'bg-white/10 border-transparent opacity-60'}`}
                >
                  <div className="text-4xl">{c.avatar}</div>
                  <div className="text-xs font-bold">{c.name}</div>
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
  const [dailyStoreItems, setDailyStoreItems] = useState<{
    fish: { id: string, price: number }[],
    crops: { id: string, price: number }[],
    gifts: { id: string, price: number }[]
  }>({ fish: [], crops: [], gifts: [] });
  const [lastStoreReset, setLastStoreReset] = useState<string>('');
  const [wheelRewards, setWheelRewards] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [input, setInput] = useState('');
  const [stackedMessages, setStackedMessages] = useState<string[]>([]);
  const [typingChatId, setTypingChatId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [settingsSubPage, setSettingsSubPage] = useState<'main' | 'profile' | 'wallpaper' | 'icons' | 'language' | 'save'>('main');

  const exportData = () => {
    const data = {
      installedApps, dockApps, appNames, userProfile, characters, messages, warehouseItems, 
      gardenPatches, walletBalance, transactions, customIcons, aiSettings, receivedGifts, 
      letters, wheelSpins, isDarkMode, language, homeWallpaper, lockWallpaper
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phone_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.installedApps) setInstalledApps(data.installedApps);
        if (data.dockApps) setDockApps(data.dockApps);
        if (data.appNames) setAppNames(data.appNames);
        if (data.userProfile) setUserProfile(data.userProfile);
        if (data.characters) setCharacters(data.characters);
        if (data.messages) setMessages(data.messages);
        if (data.warehouseItems) setWarehouseItems(data.warehouseItems);
        if (data.gardenPatches) setGardenPatches(data.gardenPatches);
        if (data.walletBalance !== undefined) setWalletBalance(data.walletBalance);
        if (data.transactions) setTransactions(data.transactions);
        if (data.customIcons) setCustomIcons(data.customIcons);
        if (data.aiSettings) setAiSettings(data.aiSettings);
        if (data.receivedGifts) setReceivedGifts(data.receivedGifts);
        if (data.letters) setLetters(data.letters);
        if (data.wheelSpins !== undefined) setWheelSpins(data.wheelSpins);
        if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
        if (data.language) setLanguage(data.language);
        if (data.homeWallpaper) setHomeWallpaper(data.homeWallpaper);
        if (data.lockWallpaper) setLockWallpaper(data.lockWallpaper);
        alert(t('importSuccess'));
      } catch (err) {
        alert(t('importError'));
      }
    };
    reader.readAsText(file);
  };
  const [characterSubPage, setCharacterSubPage] = useState<'list' | 'add' | 'details' | 'edit' | 'peeper'>('list');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCharIds, setSelectedCharIds] = useState<Set<string>>(new Set());
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isChatConfigOpen, setIsChatConfigOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);
  const [previewChatBg, setPreviewChatBg] = useState<string | null>(null);
  const [emojiPickerTab, setEmojiPickerTab] = useState<'stickers' | 'nudge' | 'memo'>('stickers');
  const [nudgeInput, setNudgeInput] = useState('');
  const [memoInput, setMemoInput] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftConfirmItem, setGiftConfirmItem] = useState<any>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(300);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [receivedGifts, setReceivedGifts] = useState<ReceivedGift[]>([]);
  const [momentGroups, setMomentGroups] = useState<MomentGroup[]>([
    { id: 'group1', name: '朋友圈1', characterIds: [] },
    { id: 'group2', name: '朋友圈2', characterIds: [] }
  ]);
  const [momentPosts, setMomentPosts] = useState<MomentPost[]>([]);
  const [lastLetterCheck, setLastLetterCheck] = useState<number>(0);
  const [warehouseItems, setWarehouseItems] = useState<{id: string, amount: number}[]>([]);
  const [gardenPatches, setGardenPatches] = useState<GardenPatch[]>(
    Array.from({ length: 8 }, (_, i) => ({ 
      id: i, 
      status: i < 4 ? 'empty' : 'locked' 
    }))
  );
  const [isJiggling, setIsJiggling] = useState(false);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const onUnlockPatch = (id: number) => {
    if (walletBalance >= 300) {
      setWalletBalance(prev => prev - 300);
      addTransaction('expense', 300, '解鎖花園土堆');
      setGardenPatches(prev => prev.map(p => p.id === id ? { ...p, status: 'empty' } : p));
    }
  };

  const onPlant = (id: number) => {
    const crop = CROP_TYPES[Math.floor(Math.random() * CROP_TYPES.length)];
    setGardenPatches(prev => prev.map(p => p.id === id ? { 
      ...p, 
      status: 'growing', 
      cropId: crop.id, 
      plantedTime: Date.now(), 
      lastWateredTime: Date.now(),
      needsWatering: false,
      waterCount: 0
    } : p));
  };
  
  const onWater = (id: number) => {
    setGardenPatches(prev => prev.map(p => p.id === id ? { 
      ...p, 
      lastWateredTime: Date.now(), 
      needsWatering: false,
      waterCount: (p.waterCount || 0) + 1
    } : p));
  };

  const onHarvest = (id: number) => {
    setGardenPatches(prev => prev.map(p => {
      if (p.id === id) {
        if (p.status === 'ready' && p.cropId) {
          setWarehouseItems(items => {
            const existing = items.find(i => i.id === p.cropId);
            if (existing) {
              return items.map(i => i.id === p.cropId ? { ...i, amount: i.amount + 1 } : i);
            }
            return [...items, { id: p.cropId!, amount: 1 }];
          });
        }
        return { ...p, status: 'empty', cropId: undefined, waterCount: 0 };
      }
      return p;
    }));
  };

  // Add a timer to check for needsWatering
  useEffect(() => {
    const interval = setInterval(() => {
       setGardenPatches(prev => {
         let changed = false;
         const next = prev.map(p => {
           if (p.status === 'growing') {
             const timeSincePlanted = Date.now() - (p.plantedTime || 0);
             const crop = CROP_TYPES.find(c => c.id === p.cropId)!;
             const totalDuration = crop.growthTime * 60 * 60 * 1000;
             
             if (timeSincePlanted >= totalDuration) {
               changed = true;
               return { ...p, status: 'ready', needsWatering: false };
             }
             
             const progress = timeSincePlanted / totalDuration;
             const requiredWaterings = crop.growthTime >= 10 ? 2 : 1;
             const currentWaterCount = p.waterCount || 0;
             
             let shouldNeedWatering = false;
             if (requiredWaterings === 1 && currentWaterCount === 0 && progress >= 0.5) {
               shouldNeedWatering = true;
             } else if (requiredWaterings === 2) {
               if (currentWaterCount === 0 && progress >= 0.33) shouldNeedWatering = true;
               if (currentWaterCount === 1 && progress >= 0.66) shouldNeedWatering = true;
             }
             
             if (shouldNeedWatering && !p.needsWatering) {
               changed = true;
               return { ...p, needsWatering: true, lastWateredTime: Date.now() };
             }
             
             // Die if not watered for 2 hours
             if (p.needsWatering && (Date.now() - (p.lastWateredTime || 0)) > 2 * 60 * 60 * 1000) {
               changed = true;
               return { ...p, status: 'dead', needsWatering: false };
             }
           }
           return p;
         });
         return changed ? next : prev;
       });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [stickers, setStickers] = useState<string[]>([]);
  const stickerInputRef = useRef<HTMLInputElement>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const checkProactive = async () => {
      const now = Date.now();
      const currentChars = [...characters];

      for (let i = 0; i < currentChars.length; i++) {
        const char = currentChars[i];
        if (char.proactiveInterval && char.proactiveInterval > 0) {
          const lastInteraction = char.lastInteractionTime || 0;
          const threshold = char.proactiveInterval * 3600 * 1000;
          
          if (now - lastInteraction > threshold) {
            setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, lastInteractionTime: now } : c));
            
            try {
              setTypingChatId(char.id);
              const systemPrompt = `你現在扮演一個角色：
角色姓名：${char.name}
性格設定：${char.personality}
對話風格：${char.customPrompt || '無'}
妳對他的暱稱：${char.charNickname || '無'}
他對妳的暱稱：${char.userNickname || '無'}
妳與他的關係：${char.relationship || '無'}
情況：使用者已經超過 ${char.proactiveInterval} 小時沒有理你了。
任務：請你主動傳訊息找他聊天。可以是關心、分享或是撒嬌，必須符合你的性格。
要求：
1. 像通訊軟體一樣聊天，多用短句。
2. 沉浸於角色設定。
3. 嚴格遵守設定的「對話風格」。
4. 使用者的姓名是 ${userProfile.name}。`;

              const charHistory = char.messages.slice(-10).map(m => ({ 
                role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model', 
                parts: [{ text: m.text }] 
              }));

              const gAI = new GoogleGenAI({ apiKey: aiSettings.apiKey || process.env.GEMINI_API_KEY || '' });
              const result = await gAI.models.generateContent({
                model: "gemini-flash-latest",
                contents: [
                  { role: 'user', parts: [{ text: systemPrompt + "\n\n請開始你的主動對話。" }] },
                  ...charHistory
                ],
                config: { systemInstruction: systemPrompt }
              });

              if (result.text) {
                const sentences = result.text.split(/[。\n\r?!]/).filter(s => s.trim().length > 0);
                
                let currentMsgs = char.messages;
                for (const sentence of sentences) {
                  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
                  const newMsg: Message = { 
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    role: 'model', 
                    text: sentence.trim() 
                  };
                  currentMsgs = [...currentMsgs, newMsg];
                  setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, messages: currentMsgs } : c));
                }
              }
            } catch (e) {
              console.error("Proactive failed", e);
            } finally {
              setTypingChatId(null);
            }
          }
        }
      }
    };

    const checkInterval = setInterval(checkProactive, 60000); 
    return () => clearInterval(checkInterval);
  }, [characters, userProfile.name]);

  useEffect(() => {
    const checkGifts = async () => {
      const now = Date.now();
      setCharacters(prev => {
        let changed = false;
        const next = prev.map(char => {
          // 5% chance every 10 mins (if this check runs frequently, we should lower chance)
          // Since checkInterval is 60s, let's make it 1% chance every check
          const hasEnoughMoney = (char.walletBalance || 0) >= 40;
          const randomChance = Math.random() < 0.01; 

          if (hasEnoughMoney && randomChance) {
            const affordableGifts = POSSIBLE_GIFTS.filter(g => g.price <= (char.walletBalance || 0));
            if (affordableGifts.length > 0) {
              const gift = affordableGifts[Math.floor(Math.random() * affordableGifts.length)];
              changed = true;
              
              const newMsg: Message = {
                id: Date.now().toString() + 'g' + Math.random().toString(36).substr(2, 5),
                role: 'model',
                text: `[贈送禮物] 嘿，剛才在路上看到 ${gift.name} ${gift.icon}，覺得很適合你，就買下來送給你囉！希望能給你一個驚喜！`
              };

              const charTx: Transaction = {
                id: Date.now().toString() + 'gx' + Math.random().toString(36).substr(2, 5),
                type: 'expense',
                amount: gift.price,
                title: `購買 ${gift.name} 贈送給 ${userProfile.name}`,
                timestamp: new Date().toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              };

              // Add item to received gifts
              setReceivedGifts(prev => [...prev, {
                id: Date.now().toString() + 'rg' + Math.random().toString(36).substr(2, 5),
                giftId: gift.id,
                senderId: char.id,
                senderName: char.name,
                timestamp: Date.now()
              }]);

              return {
                ...char,
                walletBalance: (char.walletBalance || 0) - gift.price,
                transactions: [charTx, ...(char.transactions || [])],
                messages: [...char.messages, newMsg]
              };
            }
          }
          return char;
        });
        return changed ? next : prev;
      });
    };

    const giftInterval = setInterval(checkGifts, 60000);
    return () => clearInterval(giftInterval);
  }, [userProfile.name]);

  useEffect(() => {
    const checkLetters = () => {
      const now = Date.now();
      const oneHour = 3600000;
      
      // Hourly check for characters sending letters to user
      if (now - lastLetterCheck >= oneHour) {
        setLastLetterCheck(now);
        
        setLetters(prev => {
          let newLetters = [...prev];
          characters.forEach(char => {
            if (Math.random() < 0.3) {
              const letterId = Math.random().toString(36).substr(2, 9);
              const templates = [
                `親愛的 ${userProfile.name}：\n最近還好嗎？剛剛看到一朵很漂亮的花，就想到你了。希望能分一點好運給你！`,
                `給 ${userProfile.name}：\n今天在散步的時候看到一個很像你的雲朵，覺得很有趣。你有空的話要不要一起去冒險？`,
                `致 ${userProfile.name}：\n謝謝你一直以來的照顧。這封信沒什麼特別的事，只是想告訴你，有你陪著真的很開心。`,
                `哈囉 ${userProfile.name}！\n我剛剛做了一個關於我們的夢，夢到我們一起去釣到了傳說中的大魚！哈哈！`,
                `${userProfile.name} 收：\n今天的心情像太陽一樣燦爛，希望你也是。記得要按時吃飯、早點休息喔。`
              ];
              const content = templates[Math.floor(Math.random() * templates.length)];
              
              newLetters.push({
                id: letterId,
                senderId: char.id,
                receiverId: 'user',
                content: content,
                timestamp: now,
                deliveryTime: now, // Sent immediately from character
                isRead: false,
                senderName: char.name
              });
            }
          });
          return newLetters;
        });
      }

      // Check for user-sent letters that have reached delivery time
      setLetters(prev => {
        let changed = false;
        const next = prev.map(l => {
          if (l.senderId === 'user' && !l.isRead && now >= l.deliveryTime) {
            // "Deliver" to character (e.g. increase favorability slightly)
            const charId = l.receiverId;
            setCharacters(chars => chars.map(c => {
              if (c.id === charId) {
                const logEntry = `收到來信：來自 ${userProfile.name} 的信件已送達`;
                return { 
                  ...c, 
                  favorability: c.favorability + 10,
                  activityLogs: [logEntry, ...(c.activityLogs || [])].slice(0, 20)
                };
              }
              return c;
            }));
            changed = true;
            return { ...l, isRead: true }; // Mark as "delivered" in user's outbox record
          }
          return l;
        });
        return changed ? next : prev;
      });
    };

    const interval = setInterval(checkLetters, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [characters, userProfile.name, lastLetterCheck]);

  useEffect(() => {
    const doAutoFishing = () => {
      setCharacters(prev => {
        let changed = false;
        const next = prev.map(char => {
          if (char.proactiveFishing && Math.random() < 0.05) { // 5% chance every 1 minute
            const fish = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
            changed = true;
            const logEntry = `探索釣魚：獲得 1 條${fish.name} ${fish.icon}`;
            return {
              ...char,
              activityLogs: [logEntry, ...(char.activityLogs || [])].slice(0, 20)
            };
          }
          return char;
        });
        return changed ? next : prev;
      });
    };
    const interval = setInterval(doAutoFishing, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const doAutoGardening = () => {
      setGardenPatches(prevPatches => {
        let patchesChanged = false;
        const nextPatches = prevPatches.map(patch => {
          if (patch.status === 'growing' && patch.needsWatering) {
            // Check if any character has proactiveGarden enabled
            const proactiveChars = characters.filter(c => c.proactiveGarden);
            if (proactiveChars.length > 0 && Math.random() < 0.8) {
              const char = proactiveChars[Math.floor(Math.random() * proactiveChars.length)];
              patchesChanged = true;
              
              const now = new Date();
              const timeStr = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
              const logEntry = `花園助手：角色 ${char.name} 於 ${timeStr} 主動幫忙澆水`;
              
              const charTx: Transaction = {
                id: Date.now().toString() + 'w' + Math.random().toString(36).substr(2, 5),
                type: 'income',
                amount: 5,
                title: `花園助手獎勵 (幫助澆水)`,
                timestamp: new Date().toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              };
              
              setCharacters(prevChars => prevChars.map(c => 
                c.id === char.id ? { 
                  ...c, 
                  activityLogs: [logEntry, ...(c.activityLogs || [])].slice(0, 20),
                  walletBalance: (c.walletBalance || 0) + 5,
                  transactions: [charTx, ...(c.transactions || [])]
                } : c
              ));

              return {
                ...patch,
                lastWateredTime: Date.now(),
                needsWatering: false,
                waterCount: (patch.waterCount || 0) + 1
              };
            }
          }
          return patch;
        });
        return patchesChanged ? nextPatches : prevPatches;
      });
    };

    const doAutoSelling = () => {
      setCharacters(prevChars => {
        let charsChanged = false;
        const nextChars = prevChars.map(char => {
          if (char.autoSellFish && Math.random() < 0.1) { // 10% chance to check for selling every minute
            // Check if they have any logs indicating they caught fish
            const fishLogs = (char.activityLogs || []).filter(log => log.includes('獲得 1 條'));
            if (fishLogs.length > 0) {
              charsChanged = true;
              
              let totalIncome = 0;
              let soldCount = 0;
              const soldDetails: string[] = [];
              
              // Process logs to "sell" the fish
              const newLogs = (char.activityLogs || []).filter(log => {
                if (log.includes('獲得 1 條')) {
                  const match = log.match(/獲得 1 條(.*) (.*)/);
                  if (match) {
                    const fishName = match[1];
                    // Find price from daily store
                    const storeItem = dailyStoreItems.fish.find(f => {
                       const fType = FISH_TYPES.find(ft => ft.id === f.id);
                       return fType && fType.name === fishName;
                    });
                    
                    const price = storeItem ? storeItem.price : 50; // Default price if not in store today
                    totalIncome += price;
                    soldCount++;
                    soldDetails.push(`${fishName}`);
                    return false; // Remove this log as it's "sold"
                  }
                }
                return true;
              });

              if (soldCount > 0) {
                const grouped = soldDetails.reduce((acc, name) => {
                  acc[name] = (acc[name] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const summary = Object.entries(grouped).map(([name, count]) => `${count}條${name}`).join('、');
                const sellLog = `自動販售：角色販售 ${summary} 獲得 ${totalIncome} 金幣`;
                
                const charTx: Transaction = {
                  id: Date.now().toString() + 'as' + Math.random().toString(36).substr(2, 5),
                  type: 'income',
                  amount: totalIncome,
                  title: `自動販售魚貨 (${summary})`,
                  timestamp: new Date().toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                };

                return {
                  ...char,
                  walletBalance: (char.walletBalance || 0) + totalIncome,
                  transactions: [charTx, ...(char.transactions || [])],
                  activityLogs: [sellLog, ...newLogs].slice(0, 20)
                };
              }
            }
          }
          return char;
        });
        return charsChanged ? nextChars : prevChars;
      });
    };

    const gardenInterval = setInterval(doAutoGardening, 60000);
    const sellInterval = setInterval(doAutoSelling, 60000);
    return () => {
      clearInterval(gardenInterval);
      clearInterval(sellInterval);
    };
  }, [characters, dailyStoreItems]);

  const [newChar, setNewChar] = useState<Partial<Character>>({
    name: '', gender: '', age: '', personality: '', habits: '', signature: '', settings: '', avatar: getRandomAnimalEmoji(), favorability: 0,
    minResponseTime: 3, maxResponseTime: 35, maxMessagesPerTurn: 3, proactiveInterval: 0, lastInteractionTime: Date.now(),
    chatBackground: '', myBubbleCss: '', theirBubbleCss: '',
    charNickname: '', userNickname: '', relationship: '', location: '', locationInterval: 1,
    walletBalance: 0, transactions: [], proactiveFishing: false, proactiveGarden: false, activityLogs: [], customPrompt: '', socialStatus: ''
  });

  const lockWallRef = useRef<HTMLInputElement>(null);
  const homeWallRef = useRef<HTMLInputElement>(null);
  const avatarWallRef = useRef<HTMLInputElement>(null);
  const charAvatarRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [targetIconId, setTargetIconId] = useState<AppId | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [systemMemos, setSystemMemos] = useState<Memo[]>([]);
  const [isSystemChatHidden, setIsSystemChatHidden] = useState(false);
  const [wheelSpins, setWheelSpins] = useState(3);
  const [lastWheelReset, setLastWheelReset] = useState('');

  const sendNudge = (character: Character) => {
    if (selectedChatId === 'system') return;
    const nudgeText = `拍了拍他的 ${nudgeInput || '...'}`;
    const nudgeMsg: Message = { role: 'user', text: `[拍一拍] ${nudgeText}` };
    setCharacters(prev => prev.map(c => c.id === character.id ? { ...c, messages: [...c.messages, nudgeMsg] } : c));
    setIsEmojiPickerOpen(false);
    setNudgeInput('');
  };

  const addTransaction = (type: 'income' | 'expense' | 'transfer', amount: number, title: string, to?: string) => {
    const newTx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type,
      amount,
      title,
      timestamp: new Date().toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      to
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const onSell = (id: string, name: string, price: number) => {
    setWarehouseItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.amount > 0) {
        setWalletBalance(b => b + price);
        addTransaction('income', price, `出售 ${name}`);
        if (existing.amount === 1) return prev.filter(i => i.id !== id);
        return prev.map(i => i.id === id ? { ...i, amount: i.amount - 1 } : i);
      }
      return prev;
    });
  };

  const addMemo = (chatId: string) => {
    if (!memoInput.trim()) return;
    const newMemo: Memo = { id: Date.now().toString(), text: memoInput, completed: false };
    if (chatId === 'system') {
      setSystemMemos(prev => [...prev, newMemo]);
    } else {
      setCharacters(prev => prev.map(c => c.id === chatId ? { ...c, memos: [...(c.memos || []), newMemo] } : c));
    }
    setMemoInput('');
  };

  const toggleMemo = (chatId: string, memoId: string) => {
    if (chatId === 'system') {
      setSystemMemos(prev => prev.map(m => m.id === memoId ? { ...m, completed: !m.completed } : m));
    } else {
      setCharacters(prev => prev.map(c => c.id === chatId ? { ...c, memos: (c.memos || []).map(m => m.id === memoId ? { ...m, completed: !m.completed } : m) } : c));
    }
  };

  const deleteMemo = (chatId: string, memoId: string) => {
    if (chatId === 'system') {
      setSystemMemos(prev => prev.filter(m => m.id !== memoId));
    } else {
      setCharacters(prev => prev.map(c => c.id === chatId ? { ...c, memos: (c.memos || []).filter(m => m.id !== memoId) } : c));
    }
  };

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Persistence state
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const doAutoMoments = async () => {
      // Each minute there's roughly a 1% chance (about 50% per hour) that a character might post to a group they're in.
      if (!isLoaded || characters.length === 0 || momentGroups.length === 0) return;
      
      for (const char of characters) {
        // ~1% chance to act per minute
        if (Math.random() < 0.015) {
          const eligibleGroups = momentGroups.filter(g => g.characterIds.includes(char.id));
          if (eligibleGroups.length > 0) {
            // Pick a random group
            const targetGroup = eligibleGroups[Math.floor(Math.random() * eligibleGroups.length)];
            
            try {
              const systemPrompt = `你現在扮演一個角色：
角色姓名：${char.name}
性格設定：${char.personality}
對話風格：${char.customPrompt || '無'}
社交狀況：${char.socialStatus || '無'}
任務：你在「${targetGroup.name}」朋友圈發布了一篇新文。請根據你的性格、風格和社交狀況，隨機發布一段短文分享你的生活、心情或吐槽。如果社交狀況中有特別在意的人或事，可以稍微提及。
要求：
1. 長度在1到3句話以內，就像真實的社交媒體貼文。
2. 保持角色設定和對話風格。
3. 不要包含任何開場白或解釋語，直接輸出貼文內容。`;

              const gAI = new GoogleGenAI({ apiKey: aiSettings.apiKey || process.env.GEMINI_API_KEY || '' });
              const result = await gAI.models.generateContent({
                model: "gemini-flash-latest",
                contents: [{ role: 'user', parts: [{ text: "請直接給出你的朋友圈貼文內容：" }] }],
                config: { systemInstruction: systemPrompt }
              });

              if (result.text) {
                const newPost: MomentPost = {
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                  groupId: targetGroup.id,
                  authorId: char.id,
                  text: result.text.trim(),
                  timestamp: Date.now(),
                  likes: [],
                  comments: []
                };
                setMomentPosts(prev => [newPost, ...prev]);
                
                const logEntry = `發表了一篇朋友圈貼文`;
                setCharacters(prev => prev.map(c => c.id === char.id ? { 
                  ...c, 
                  activityLogs: [logEntry, ...(c.activityLogs || [])].slice(0, 20)
                } : c));
              }
            } catch (e) {
              console.error("Auto moment post failed:", e);
            }
          }
        } else if (Math.random() < 0.02) { // 2% chance per minute to randomly like/comment on a recent post
           const eligibleGroups = momentGroups.filter(g => g.characterIds.includes(char.id));
           const groupIds = eligibleGroups.map(g => g.id);
           const eligiblePosts = momentPosts.filter(p => groupIds.includes(p.groupId) && p.authorId !== char.id);
           
           if (eligiblePosts.length > 0) {
             const targetPost = eligiblePosts[Math.floor(Math.random() * Math.min(5, eligiblePosts.length))]; // Pick from recent 5
             if (Math.random() < 0.5) {
               // Like
               if (!targetPost.likes.includes(char.id)) {
                 setMomentPosts(prev => prev.map(p => p.id === targetPost.id ? { ...p, likes: [...p.likes, char.id] } : p));
               }
             } else {
               // Comment
               try {
                  const targetAuthorName = targetPost.authorId === 'user' ? '使用者(你)' : (characters.find(c => c.id === targetPost.authorId)?.name || '未知使用者');
                  const systemPrompt = `你現在扮演一個角色：
角色姓名：${char.name}
性格設定：${char.personality}
對話風格：${char.customPrompt || '無'}
社交狀況：${char.socialStatus || '無'}
任務：你在朋友圈看到 ${targetAuthorName} 的貼文：「${targetPost.text}」。請根據你的性格、風格和社交狀況，發表一句簡短的評論。如果社交狀況中提到你與發文者的關係（例如交惡或交好），請在評論中表現出來。
要求：
1. 長度在1到2句話以內。
2. 保持角色設定和對話風格。
3. 不要包含任何開場白或解釋語，直接輸出評論內容。`;

                  const gAI = new GoogleGenAI({ apiKey: aiSettings.apiKey || process.env.GEMINI_API_KEY || '' });
                  const result = await gAI.models.generateContent({
                    model: "gemini-flash-latest",
                    contents: [{ role: 'user', parts: [{ text: "請直接給出你的評論內容：" }] }],
                    config: { systemInstruction: systemPrompt }
                  });

                  if (result.text && result.text.trim().length > 0) {
                     setMomentPosts(prev => prev.map(p => {
                       if (p.id === targetPost.id) {
                         return {
                           ...p,
                           comments: [...p.comments, {
                             id: Date.now().toString() + Math.random().toString(36).substr(2,5),
                             authorId: char.id,
                             text: result.text.trim(),
                             timestamp: Date.now()
                           }]
                         };
                       }
                       return p;
                     }));
                  }
               } catch(e) {
                 console.error("Auto moment comment failed", e);
               }
             }
           }
        }
      }
    };

    const interval = setInterval(doAutoMoments, 60000);
    return () => clearInterval(interval);
  }, [characters, momentGroups, momentPosts, isLoaded]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ais_app_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.userProfile) setUserProfile(data.userProfile);
        if (data.characters) setCharacters(data.characters);
        if (data.stickers) setStickers(data.stickers);
        if (data.lockWallpaper) setLockWallpaper(data.lockWallpaper);
        if (data.homeWallpaper) setHomeWallpaper(data.homeWallpaper);
        if (data.customIcons) setCustomIcons(data.customIcons);
        if (data.installedApps) {
          let apps = data.installedApps.filter((a: string) => a !== 'beautify' && a !== 'phone');
          if (!apps.includes('wheel')) apps.push('wheel');
          if (!apps.includes('fishing')) apps.push('fishing');
          if (!apps.includes('warehouse')) apps.push('warehouse');
          if (!apps.includes('dex')) apps.push('dex');
          if (!apps.includes('moments')) apps.push('moments');
          if (!apps.includes('game')) apps.push('game');
          setInstalledApps(apps);
        }
        if (data.dockApps) setDockApps(data.dockApps.filter((a: string) => a !== 'phone'));
        if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
        if (data.messages) setMessages(data.messages);
        if (data.appNames) {
          const { beautify, diary, phone, ...rest } = data.appNames;
          setAppNames({ ...rest, wheel: '每日轉盤', warehouse: '倉庫', fishing: '釣魚', dex: '圖鑑', moments: '朋友圈', game: '遊戲' });
        }
        if (data.walletBalance !== undefined) setWalletBalance(data.walletBalance);
        if (data.transactions) setTransactions(data.transactions);
        if (data.warehouseItems) setWarehouseItems(data.warehouseItems);
        if (data.gardenPatches) setGardenPatches(data.gardenPatches);
        if (data.momentGroups) setMomentGroups(data.momentGroups);
        if (data.momentPosts) setMomentPosts(data.momentPosts);
        if (data.receivedGifts) setReceivedGifts(data.receivedGifts);
        if (data.letters) setLetters(data.letters);
      }
    } catch (e) {
      console.error("Failed to load persistence data", e);
    }
    setIsLoaded(true);
  }, []);

  // Migration and Persistence
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const saved = localStorage.getItem('ais_app_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.systemMemos) setSystemMemos(data.systemMemos);
        if (data.isSystemChatHidden !== undefined) setIsSystemChatHidden(data.isSystemChatHidden);
        if (data.wheelSpins !== undefined) setWheelSpins(data.wheelSpins);
        if (data.lastWheelReset) setLastWheelReset(data.lastWheelReset);
        if (data.lastStoreReset) setLastStoreReset(data.lastStoreReset);
        if (data.dailyStoreItems) setDailyStoreItems(data.dailyStoreItems);
        if (data.wheelRewards) setWheelRewards(data.wheelRewards);
      }
    } catch (e) {}

    // Midnight Check & Daily Spin Reset
    const today = new Date().toLocaleDateString();
    
    setLastStoreReset(prev => {
      if (prev !== today) {
        // Random 8 fish
        const randomFish = [...FISH_TYPES].sort(() => 0.5 - Math.random()).slice(0, 8).map(f => {
          let price = Math.floor(Math.random() * 141) + 10; // 10-150
          if (f.rarity === '史詩' || f.rarity === '傳說') {
            price = Math.floor(Math.random() * 200) + 151; // 151-350
          }
          return { id: f.id, price };
        });

        // Random 8 crops
        const randomCrops = [...CROP_TYPES].sort(() => 0.5 - Math.random()).slice(0, 8).map(c => ({
          id: c.id,
          price: Math.floor(Math.random() * 141) + 10 // 10-150
        }));

        // Random 8 gifts
        const randomGifts = [...POSSIBLE_GIFTS].sort(() => 0.5 - Math.random()).slice(0, 8).map(g => ({
          id: g.id,
          price: g.price 
        }));

        setDailyStoreItems({ fish: randomFish, crops: randomCrops, gifts: randomGifts });
        return today;
      }
      return prev;
    });

    setLastWheelReset(prev => {
      if (prev !== today) {
        setWheelSpins(3);
        const dailyRewards = Array.from({ length: 7 }, () => Math.floor(Math.random() * 11) + 10);
        setWheelRewards(dailyRewards);
        return today;
      }
      return prev;
    });
    
    // Migrate old default avatars to emojis
    const oldUserDefault = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150';
    const oldCharDefault = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=150';

    if (userProfile.avatar === oldUserDefault) {
      setUserProfile(prev => ({ ...prev, avatar: '🥕' }));
    }

    setCharacters(prev => prev.map(c => {
      if (c.avatar === oldCharDefault) {
        return { ...c, avatar: getRandomAnimalEmoji() };
      }
      return c;
    }));
  }, [isLoaded]);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    const data = {
      userProfile,
      characters,
      stickers,
      lockWallpaper,
      homeWallpaper,
      customIcons,
      appNames,
      installedApps,
      dockApps,
      isDarkMode,
      messages,
      systemMemos,
      isSystemChatHidden,
      wheelSpins,
      lastWheelReset,
      lastStoreReset,
      dailyStoreItems,
      wheelRewards,
      walletBalance,
      transactions,
      warehouseItems,
      gardenPatches,
      momentGroups,
      momentPosts,
      receivedGifts,
      letters
    };
    localStorage.setItem('ais_app_data', JSON.stringify(data));
  }, [
    isLoaded,
    userProfile,
    characters,
    stickers,
    lockWallpaper,
    homeWallpaper,
    customIcons,
    appNames,
    installedApps,
    dockApps,
    isDarkMode,
    messages,
    walletBalance,
    warehouseItems,
    gardenPatches,
    systemMemos,
    isSystemChatHidden,
    wheelSpins,
    lastWheelReset,
    wheelRewards,
    momentGroups,
    momentPosts,
    receivedGifts,
    letters
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, characters, selectedChatId]);

  const handleSendMessage = async (text?: string | string[]) => {
    const textArray = typeof text === 'string' ? [text.trim()] : (text ? text.filter(t => t.trim()) : [input.trim()]);
    if (textArray.length === 0) return;

    const userMsgs: Message[] = textArray.map(t => ({ role: 'user', text: t }));
    const currentMessages = [...messages, ...userMsgs];
    setMessages(currentMessages);
    
    if (typeof text === 'string' || !text) setInput('');
    else setStackedMessages([]);

    setTypingChatId('system');
    try {
      const gAI = new GoogleGenAI({ apiKey: aiSettings.apiKey || process.env.GEMINI_API_KEY || '' });
      const response = await gAI.models.generateContent({
        model: "gemini-flash-latest",
        contents: currentMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: { systemInstruction: `你是一個住在 iPhone 裡的 AI 助手。
你的回覆風格：
1. 像真人一樣說話，口語化、親切、現代且有禮貌。
2. 保持簡潔，盡量使用短句。
3. 避免一次輸出大段文字，如果是複雜的回答，請分成多個連貫的小短句。
目前使用者姓名是 ${userProfile.name}。` }
      });
      
      if (response.text) {
        // Split by major punctuation while keeping them
        const sentences = response.text.split(/([。！？\n])/).reduce((acc: string[], val, i) => {
          if (i % 2 === 0) acc.push(val);
          else if (acc.length > 0) acc[acc.length - 1] += val;
          return acc;
        }, []).filter(s => s.trim().length > 0);

        for (const sentence of sentences) {
          setTypingChatId('system');
          await new Promise(r => setTimeout(r, 600 + Math.random() * 800)); // Typing delay
          setMessages(prev => [...prev, { role: 'model', text: sentence.trim() }]);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "機器人似乎遇到了問題，請檢查您的 API 金鑰。 " + (error instanceof Error ? error.message : "") }]);
    } finally { setTypingChatId(null); }
  };

  const handleCharacterChat = async (character: Character, text: string | string[]) => {
    const textArray = typeof text === 'string' ? [text.trim()] : text.filter(t => t.trim());
    if (textArray.length === 0) return;

    const userMsgs: Message[] = textArray.map((t, idx) => ({ 
      role: 'user' as const, 
      text: t,
      replyTo: (idx === 0 && replyingTo) ? (replyingTo.role === 'user' ? `你: ${replyingTo.text}` : `${character.name}: ${replyingTo.text}`) : undefined
    }));
    const currentHistory = [...character.messages, ...userMsgs];

    const uncompletedMemos = (character.memos || []).filter(m => !m.completed).map(m => m.text);
    const memoContext = uncompletedMemos.length > 0 
      ? `\n\n注意：使用者目前有以下「待辦備忘錄」尚未完成：\n${uncompletedMemos.map(t => `- ${t}`).join('\n')}\n請你在對話中「自然且符合你設定的語氣和性格」地適時提醒或關心使用者這些事情的進度，不要太刻意，要像朋友或伴侶間的閒聊提醒。`
      : "";
    
    const replyContext = replyingTo ? `\n\n使用者現在「標註」並回覆了你之前的一條訊息：\n「${replyingTo.text}」\n請你在回覆時，針對這條被標註的訊息進行回話。` : "";

    const userText = typeof text === 'string' ? text : text.join(' ');
    const mentionsGift = userText.includes('禮物') || userText.includes('送我');
    const walletContext = mentionsGift ? `\n\n目前你的錢包裡有 $${character.walletBalance || 0}。如果你想買禮物送給使用者，請在回覆訊息的開頭加上「[贈送禮物] <禮物名稱> <圖標>」。可選清單：${POSSIBLE_GIFTS.filter(g => g.price <= (character.walletBalance || 0)).map(g => `${g.name}(${g.price})`).join(', ')}。購買後會自動扣除對應金額。` : "";

    setCharacters(prev => prev.map(c => 
      c.id === character.id ? { ...c, messages: currentHistory, lastInteractionTime: Date.now() } : c
    ));
    
    if (typeof text === 'string') setInput('');
    else setStackedMessages([]);
    setReplyingTo(null);

    setTypingChatId(character.id);

    try {
      const systemPrompt = `你現在扮演一個角色：
角色姓名：${character.name}
妳對他的暱稱：${character.charNickname || '無'}
他對妳的暱稱：${character.userNickname || '無'}
妳與他的關係：${character.relationship || '無'}
出沒區域：${character.location || '未知'}
個性：${character.personality}
習性：${character.habits}
對話風格：${character.customPrompt || '無'}
好感度：${character.favorability} (好感度越高，說話語氣可以越親暱)
${memoContext}${replyContext}${walletContext}

對話風格要求：
1. 嚴格遵守角色設定的性格和說話方式，特別是「對話風格」的設定。
2. 妳對使用者的暱稱必須是「${character.userNickname || userProfile.name}」。
3. 妳與使用者的關係是「${character.relationship || '陌生人'}」，請根據此關係調整語態。
4. 像在通訊軟體聊天一樣，多用短句。
5. 避免長篇大論，盡量分段表達。
6. 自然地使用語助詞，口語化。
請以這個角色的口吻和使用者對話。使用者姓名是 ${userProfile.name}。`;

      const gAI = new GoogleGenAI({ apiKey: aiSettings.apiKey || process.env.GEMINI_API_KEY || '' });
      const response = await gAI.models.generateContent({
        model: "gemini-flash-latest",
        contents: currentHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: { systemInstruction: systemPrompt }
      });

      // Increase favorability slightly on each successful interaction (randomly between 1-5, no limit)
      setCharacters(prev => prev.map(c => 
        c.id === character.id ? { ...c, favorability: (c.favorability || 0) + (Math.floor(Math.random() * 5) + 1) } : c
      ));

      if (response.text) {
        const fullSentences = response.text.split(/([。！？\n])/).reduce((acc: string[], val, i) => {
          if (i % 2 === 0) acc.push(val);
          else if (acc.length > 0) acc[acc.length - 1] += val;
          return acc;
        }, []).filter(s => s.trim().length > 0);

        // Respect maxMessagesPerTurn
        let sentences = fullSentences.slice(0, character.maxMessagesPerTurn || 3);

        const applyRandomFeatures = () => {
          if (character.canTransferToUser && Math.random() < 0.5 && (character.walletBalance || 0) > 0) {
            const amount = Math.floor(Math.random() * (character.walletBalance || 0)) + 1;
            sentences.push(`[轉帳給使用者] ${amount}`);
          }

          if (character.canUseStickers && Math.random() < 0.5 && stickers.length > 0) {
            const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
            sentences.push(`[貼圖] ${randomSticker}`);
          }

          if (character.canSendGifts && Math.random() < 0.3) {
            const availableGifts = dailyStoreItems.gifts.map(dg => POSSIBLE_GIFTS.find(g => g.id === dg.id)).filter(Boolean) as Gift[];
            const affordableGifts = availableGifts.filter(g => g.price <= (character.walletBalance || 0));
            if (affordableGifts.length > 0) {
              const gift = affordableGifts[Math.floor(Math.random() * affordableGifts.length)];
              sentences.push(`[贈送禮物] ${gift.name}`);
            }
          }

          if (character.canPat && Math.random() < 0.3) {
            sentences.push(`[拍一拍] 角色${character.name}拍了拍你的頭。`);
          }
        };
        applyRandomFeatures();

        const minDelay = (character.minResponseTime || 1) * 1000;
        const maxDelay = (character.maxResponseTime || 30) * 1000;

        for (let i = 0; i < sentences.length; i++) {
          setTypingChatId(character.id);
          
          // Initial delay for the first message, staggered for subsequent ones
          const waitTime = i === 0 
            ? minDelay + Math.random() * (maxDelay - minDelay)
            : 500 + Math.random() * 1000; 

          await new Promise(r => setTimeout(r, waitTime));
          
          const sentence = sentences[i].trim();
          let processedChar = character;

          if (sentence.includes('[贈送禮物]')) {
            const match = sentence.match(/\[贈送禮物\]\s*([^ \n\r\t]+)/);
            if (match) {
              const giftName = match[1];
              const gift = POSSIBLE_GIFTS.find(g => g.name === giftName || giftName.includes(g.name));
              if (gift && (character.walletBalance || 0) >= gift.price) {
                setWarehouseItems(prevW => {
                  const existing = prevW.find(w => w.id === gift.id);
                  if (existing) return prevW.map(w => w.id === gift.id ? { ...w, amount: w.amount + 1 } : w);
                  return [...prevW, { id: gift.id, amount: 1 }];
                });
              }
            }
          } else if (sentence.startsWith('[轉帳給使用者]')) {
            const match = sentence.match(/\[轉帳給使用者\]\s*(\d+)/);
            if (match) {
              const amount = parseInt(match[1]);
              setWalletBalance(p => p + amount);
              addTransaction('income', amount, `來自 ${character.name} 的轉帳`);
            }
          }

          setCharacters(prev => prev.map(c => {
            if (c.id === character.id) {
              const isGift = sentence.includes('[贈送禮物]');
              const isTransfer = sentence.startsWith('[轉帳給使用者]');
              let newBalance = c.walletBalance || 0;
              let newTransactions = c.transactions || [];

              if (isGift) {
                const match = sentence.match(/\[贈送禮物\]\s*([^ \n\r\t]+)/);
                if (match) {
                  const giftName = match[1];
                  const gift = POSSIBLE_GIFTS.find(g => g.name === giftName || giftName.includes(g.name));
                  if (gift && newBalance >= gift.price) {
                    newBalance -= gift.price;
                    const charTx: Transaction = {
                      id: Date.now().toString() + 'cgx' + Math.random().toString(36).substr(2, 5),
                      type: 'expense',
                      amount: gift.price,
                      title: `購買 ${gift.name} 贈送給 ${userProfile.name}`,
                      timestamp: new Date().toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    };
                    newTransactions = [charTx, ...newTransactions];
                  }
                }
              } else if (isTransfer) {
                const match = sentence.match(/\[轉帳給使用者\]\s*(\d+)/);
                if (match) {
                  const amount = parseInt(match[1]);
                  if (newBalance >= amount) {
                    newBalance -= amount;
                    const charTx: Transaction = {
                      id: Date.now().toString() + 'ctx' + Math.random().toString(36).substr(2, 5),
                      type: 'transfer',
                      amount: amount,
                      title: `轉帳給 ${userProfile.name}`,
                      timestamp: new Date().toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    };
                    newTransactions = [charTx, ...newTransactions];
                  }
                }
              }

              let finalSentence = sentence;
              if (isTransfer) {
                const match = sentence.match(/\[轉帳給使用者\]\s*(\d+)/);
                if (match) {
                  const amount = parseInt(match[1]);
                  finalSentence = `\u200B[轉帳] 角色${c.name}轉帳$${amount}，請查收。`;
                }
              } else if (isGift) {
                const match = sentence.match(/\[贈送禮物\]\s*([^ \n\r\t]+)/);
                if (match) {
                   finalSentence = `\u200B[贈禮] 角色${c.name}贈送禮物${match[1]}，請查收。`;
                }
              }

              return { 
                ...c, 
                walletBalance: newBalance,
                transactions: newTransactions,
                messages: [...c.messages, { 
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                  role: 'model', 
                  text: finalSentence
                }] 
              };
            }
            return c;
          }));
        }
      }
    } catch (error) {
      console.error(error);
      setCharacters(prev => prev.map(c => 
        c.id === character.id ? { ...c, messages: [...c.messages, { role: 'model', text: "系統異常：" + (error instanceof Error ? error.message : "") }] } : c
      ));
    } finally { setTypingChatId(null); }
  };

  const openApp = (app: AppId) => {
    if (isJiggling) return;
    setActiveApp(app);
    setScreenState(ScreenState.AppOpen);
    setSettingsSubPage('main');
    setSelectedChatId(null);
    setIsChatConfigOpen(false);
    setPreviewChatBg(null);
  };

  const goHome = () => {
    setScreenState(ScreenState.Home);
    setActiveApp(null);
    setIsJiggling(false);
    setSelectedChatId(null);
    setIsChatConfigOpen(false);
    setPreviewChatBg(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleHomePointerDown = (id?: AppId) => {
    if (isJiggling) return;
    longPressTimer.current = setTimeout(() => {
      setIsJiggling(true);
    }, 800);
  };

  const handleHomePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const swapApps = (draggedId: AppId, targetId: AppId, list: AppId[], setList: (l: AppId[]) => void) => {
    const fromIndex = list.indexOf(draggedId);
    const toIndex = list.indexOf(targetId);
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      const newList = [...list];
      newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, draggedId);
      setList(newList);
    }
  };

  const addApp = (app: AppId) => {
    if (!installedApps.includes(app) && !dockApps.includes(app)) {
      setInstalledApps(prev => [...prev, app]);
    }
    setIsAddingApp(false);
  };

  const getIconColor = (id: AppId) => {
    switch(id) {
      case 'messages': return '#76DE84';
      case 'settings': return '#AEAEB2';
      case 'store': return '#76DE84';
      case 'kitchen': return '#FF9500';
      case 'wallet': return '#5856D6';
      case 'garden': return '#4CD964';
      case 'photos': return '#5AC8FA';
      case 'characters': return '#AF52DE';
      case 'warehouse': return '#8E8E93';
      case 'fishing': return '#76DE84';
      case 'game': return '#6366f1';
      case 'wheel': return '#FF9500';
      case 'dex': return '#FF2D55';
      case 'moments': return '#34C759';
      default: return '#AEAEB2';
    }
  };

  const getIconElement = (id: AppId) => {
    const iconColorClass = "text-inherit";
    switch (id) {
      case 'messages': return <MessageCircle className={iconColorClass} size={30} />;
      case 'settings': return <SettingsIcon className={iconColorClass} size={30} />;
      case 'store': return <ShoppingBag className={iconColorClass} size={30} />;
      case 'kitchen': return <UtensilsCrossed className={iconColorClass} size={30} />;
      case 'wallet': return <WalletIcon className={iconColorClass} size={30} />;
      case 'garden': return <Leaf className={iconColorClass} size={30} />;
      case 'photos': return <Mail className={iconColorClass} size={30} />;
      case 'characters': return <Users className={iconColorClass} size={30} />;
      case 'warehouse': return <Archive className={iconColorClass} size={30} />;
      case 'fishing': return <FishIcon className={iconColorClass} size={30} />;
      case 'game': return <Gamepad2 className={iconColorClass} size={30} />;
      case 'wheel': return <Disc className={iconColorClass} size={30} />;
      case 'dex': return <BookOpen className={iconColorClass} size={30} />;
      case 'moments': return <Camera className={iconColorClass} size={30} />;
      default: return <Smartphone className={iconColorClass} size={30} />;
    }
  };

  const removeApp = (app: AppId) => {
    setInstalledApps(prev => prev.filter(a => a !== app));
  };

  const removeDockApp = (app: AppId) => {
    setDockApps(prev => prev.filter(a => a !== app));
  };

  const renderSettings = () => {
    if (settingsSubPage === 'ai-config' as any) return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <Header title="AI 助手設定" onBack={() => setSettingsSubPage('main')} isDarkMode={isDarkMode} />
        <div className="p-4 space-y-6">
          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-4 shadow-sm space-y-4`}>
            <div>
              <label className="text-xs font-bold text-neutral-400 block mb-1 uppercase px-1">Gemini API 金鑰</label>
              <input 
                type="password"
                className={`w-full text-sm outline-none px-4 py-3 rounded-lg ${isDarkMode ? 'bg-black/40 text-white border border-[#38383a]' : 'bg-neutral-50 text-black border border-neutral-100'}`}
                value={aiSettings.apiKey}
                onChange={e => setAiSettings(p => ({ ...p, apiKey: e.target.value }))}
                placeholder="在此輸入您的 Gemini API Key"
              />
              <p className="text-[10px] text-neutral-400 mt-2 px-1 leading-relaxed">
                您的 API 金鑰將儲存在此 App 的狀態中。若要獲取金鑰，請訪問 Google AI Studio。
              </p>
            </div>
            
            <div className="pt-2">
              <label className="text-xs font-bold text-neutral-400 block mb-1 uppercase px-1">模型選擇</label>
              <select 
                className={`w-full text-sm outline-none px-4 py-3 rounded-lg appearance-none ${isDarkMode ? 'bg-black/40 text-white border border-[#38383a]' : 'bg-neutral-50 text-black border border-neutral-100'}`}
                value={aiSettings.model}
                onChange={e => setAiSettings(p => ({ ...p, model: e.target.value }))}
              >
                <option value="gemini-flash-latest">Gemini Flash (快速)</option>
                <option value="gemini-3.1-pro-preview">Gemini Pro (強大)</option>
                <option value="gemini-3.1-flash-lite">Gemini Flash Lite (更輕量)</option>
              </select>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">AI 機器人狀態</h4>
                <p className={`text-xs ${aiSettings.apiKey ? 'text-green-500' : 'text-neutral-400'}`}>
                  {aiSettings.apiKey ? '● 已就緒' : '○ 尚未設定'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (settingsSubPage === 'profile') return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <Header title="個人資料" onBack={() => setSettingsSubPage('main')} isDarkMode={isDarkMode} />
        <div className="p-4 space-y-4">
          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-6 flex flex-col items-center gap-4`}>
              <div 
                className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200 border-4 border-neutral-100 shadow-sm cursor-pointer group relative"
                onClick={() => avatarWallRef.current?.click()}
              >
                <AvatarImage src={userProfile.avatar} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <CameraIcon size={24} />
                </div>
              </div>
            <p className="text-xs text-neutral-400">點擊大頭照更換</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'} overflow-hidden`}>
            <ProfileInput label="姓名" value={userProfile.name} isDark={isDarkMode} onChange={v => setUserProfile(p => ({ ...p, name: v }))} />
            <div className="px-5 py-3 flex items-center">
              <span className="w-20 text-sm font-medium">簽名</span>
              <input 
                className={`flex-1 text-sm outline-none bg-transparent ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`} 
                value={userProfile.signature} 
                onChange={e => setUserProfile(p => ({ ...p, signature: e.target.value }))} 
                placeholder="請輸入個人簽名" 
              />
            </div>
            <ProfileInput label="年齡" value={userProfile.age} isDark={isDarkMode} onChange={v => setUserProfile(p => ({ ...p, age: v }))} />
            <ProfileInput label="性別" value={userProfile.gender} isDark={isDarkMode} onChange={v => setUserProfile(p => ({ ...p, gender: v }))} />
          </div>
          <input type="file" hidden ref={avatarWallRef} accept="image/*" onChange={e => handleImageUpload(e, (url) => setUserProfile(p => ({ ...p, avatar: url })))} />
        </div>
      </div>
    );

    if (settingsSubPage === 'wallpaper') return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
        <Header title={t('appearance')} onBack={() => setSettingsSubPage('main')} isDarkMode={isDarkMode} />
        <div className="p-6 flex flex-col items-center gap-6">
          <div className="flex gap-6">
            <WallpaperThumb label={t('lockScreen')} src={lockWallpaper} onClick={() => lockWallRef.current?.click()} />
            <WallpaperThumb label={t('homeScreen')} src={homeWallpaper} onClick={() => homeWallRef.current?.click()} />
          </div>
          
          <div className="w-full space-y-2">
            <div className={`w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-4 flex items-center justify-between`}>
              <span className="font-medium">{t('darkMode')}</span>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${isDarkMode ? 'bg-[#34C759]' : 'bg-neutral-200'}`}
              >
                <motion.div 
                  animate={{ x: isDarkMode ? 20 : 2 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <div className={`w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-4 flex items-center justify-between`}>
              <span className="font-medium text-indigo-500 font-bold">{t('fullscreen')}</span>
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${isFullScreen ? 'bg-[#5856D6]' : 'bg-neutral-200'}`}
              >
                <motion.div 
                  animate={{ x: isFullScreen ? 20 : 2 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>

          <input type="file" hidden ref={lockWallRef} accept="image/*" onChange={e => handleImageUpload(e, setLockWallpaper)} />
          <input type="file" hidden ref={homeWallRef} accept="image/*" onChange={e => handleImageUpload(e, setHomeWallpaper)} />
        </div>
      </div>
    );

    if (settingsSubPage === 'language') return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
        <Header title={t('general')} onBack={() => setSettingsSubPage('main')} isDarkMode={isDarkMode} />
        <div className="p-4">
          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl overflow-hidden divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'}`}>
            {[
              { label: '繁體中文', value: Language.ZH_TW },
              { label: '简体中文', value: Language.ZH_CN },
              { label: 'English', value: Language.EN },
              { label: '日本語', value: Language.JA },
            ].map((lang) => (
              <button 
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className="w-full px-5 py-4 flex items-center justify-between active:bg-neutral-100/10 transition-colors"
              >
                <span className={`font-medium ${language === lang.value ? 'text-[#76DE84]' : ''}`}>{lang.label}</span>
                {language === lang.value && <Check size={18} className="text-[#76DE84]" />}
              </button>
            ))}
          </div>
          <p className="p-4 text-xs opacity-50 leading-relaxed">選擇語言後，小手機內的所有文字（包含 App 名稱、按鈕、食譜內容等）將會自動切換為該語言。</p>
        </div>
      </div>
    );

    if (settingsSubPage === 'save') return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
        <Header title={t('privacy')} onBack={() => setSettingsSubPage('main')} isDarkMode={isDarkMode} />
        <div className="p-4 space-y-6">
          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl overflow-hidden shadow-sm`}>
            <button 
              onClick={exportData}
              className="w-full py-4 px-5 flex items-center justify-between active:bg-neutral-100/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white"><ArrowRight size={18} className="rotate-90" /></div>
                <span className="font-bold">{t('exportSave')}</span>
              </div>
              <ChevronRight size={18} className="opacity-30 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className={`h-[1px] mx-5 ${isDarkMode ? 'bg-[#38383a]' : 'bg-neutral-100'}`} />
            <button 
              onClick={() => importInputRef.current?.click()}
              className="w-full py-4 px-5 flex items-center justify-between active:bg-neutral-100/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white"><ArrowRight size={18} className="-rotate-90" /></div>
                <span className="font-bold">{t('importSave')}</span>
              </div>
              <ChevronRight size={18} className="opacity-30 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="px-4 text-xs opacity-50 leading-relaxed text-center">您可以將小手機內的所有數據導出為 JSON 檔案，或從外部導入存檔以恢復資料。</p>
          <input type="file" hidden ref={importInputRef} accept=".json" onChange={importData} />
        </div>
      </div>
    );

    if (settingsSubPage === 'icons') return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <Header title="更換圖示與名稱" onBack={() => setSettingsSubPage('main')} isDarkMode={isDarkMode} />
        <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} m-4 rounded-xl divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'}`}>
          {(Object.keys(appNames) as AppId[]).map(id => (
            <div key={id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                    {customIcons[id] ? <img src={customIcons[id]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-neutral-400 capitalize">{id[0]}</div>}
                  </div>
                  <input 
                    className="bg-transparent border-none outline-none font-medium" 
                    value={appNames[id]} 
                    onChange={e => setAppNames(p => ({ ...p, [id]: e.target.value }))}
                  />
                </div>
                <button onClick={() => { setTargetIconId(id); iconInputRef.current?.click(); }} className="text-[#76DE84] text-xs font-bold">更換圖示</button>
              </div>
            </div>
          ))}
        </div>
        <input type="file" hidden ref={iconInputRef} accept="image/*" onChange={e => targetIconId && handleImageUpload(e, url => setCustomIcons(p => ({ ...p, [targetIconId]: url })))} />
      </div>
    );

    return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <div className="px-5 pt-12 pb-20">
          <h2 className={`text-3xl font-extrabold mb-5 px-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{t('settings')}</h2>
          
          {/* Search Bar Placeholder */}
          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white/80'} backdrop-blur-md rounded-xl px-3 py-2 flex gap-2 mb-6 text-neutral-400 items-center`}>
            <Search size={16} /> 
            <span className="text-sm">{t('search')}</span>
          </div>
          
          {/* iCloud Profile Section */}
          <div onClick={() => setSettingsSubPage('profile')} className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-3 flex items-center gap-4 mb-6 shadow-sm active:opacity-70 transition-opacity cursor-pointer`}>
            <div 
              className="w-14 h-14 bg-neutral-300 rounded-full flex items-center justify-center text-white overflow-hidden border border-white/10"
            >
                <AvatarImage src={userProfile.avatar} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{userProfile.name}</h3>
              <p className="text-[11px] opacity-60">{t('appleID')}</p>
            </div>
            <ChevronRight className="text-neutral-300" size={18} />
          </div>

          {/* Settings Groups */}
          <div className="space-y-6">
            <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl overflow-hidden divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'} shadow-sm`}>
              <SettingsRow icon={<Bot className="text-white" size={18} />} iconBg="#76DE84" label={t('aiConfig')} onClick={() => setSettingsSubPage('ai-config' as any)} />
              <SettingsRow icon={<ImageIcon className="text-white" size={18} />} iconBg="#34C759" label={t('appearance')} onClick={() => setSettingsSubPage('wallpaper')} />
              <SettingsRow icon={<Palette className="text-white" size={18} />} iconBg="#FF9500" label={t('icons')} onClick={() => setSettingsSubPage('icons')} />
            </div>

            <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl overflow-hidden divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'} shadow-sm`}>
              <SettingsRow icon={<SettingsIcon className="text-white" size={18} />} iconBg="#8E8E93" label={t('general')} onClick={() => setSettingsSubPage('language')} />
              <SettingsRow icon={<Lock className="text-white" size={18} />} iconBg="#5856D6" label={t('privacy')} onClick={() => setSettingsSubPage('save')} />
            </div>
            
            <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl overflow-hidden shadow-sm mt-6`}>
              <button 
                onClick={() => setIsResetConfirmOpen(true)}
                className="w-full py-3 px-4 text-center text-red-500 font-semibold active:bg-neutral-100/10"
              >
                {t('reset')}
              </button>
            </div>
          </div>
          
          {isResetConfirmOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className={`${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} rounded-2xl w-full max-w-[300px] overflow-hidden shadow-2xl`}>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold mb-2 text-red-500">重置玩家資料</h3>
                  <p className="text-sm opacity-80 leading-relaxed">確定要重置所有玩家資料嗎？這將刪除包含釣魚、花園、訊息、角色紀錄以及錢包金幣。此操作無法復原。</p>
                </div>
                <div className={`flex border-t ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-200'}`}>
                  <button 
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="flex-1 py-3 text-center border-r border-inherit active:bg-neutral-100/10"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      setWarehouseItems([]);
                      setGardenPatches(Array.from({ length: 8 }, (_, i) => ({ id: i, status: i < 4 ? 'empty' : 'locked' })));
                      setMessages([]);
                      setCharacters([]);
                      setWalletBalance(300);
                      setTransactions([]);
                      setIsResetConfirmOpen(false);
                    }}
                    className="flex-1 py-3 text-center font-bold text-red-500 active:bg-neutral-100/10"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <p className="mt-12 text-center text-[10px] opacity-30 font-mono">{t('softwareVersion')}: 17.4.1 (21E236)</p>
        </div>
      </div>
    );
  };

  const renderCharacters = () => {
    if (characterSubPage === 'add' || (characterSubPage === 'edit' && selectedCharacter)) {
      const isEdit = characterSubPage === 'edit';
      const charToEdit = isEdit ? characters.find(c => c.id === selectedCharacter?.id) || newChar : newChar;

      return (
        <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} h-full`}>
          <Header title={isEdit ? "修改角色" : "製作角色"} onBack={() => setCharacterSubPage(isEdit ? 'details' : 'list')} isDarkMode={isDarkMode} />
          <div className="p-4 space-y-4 overflow-y-auto pb-20">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden bg-neutral-200 border-2 border-white shadow-md cursor-pointer group relative"
                onClick={() => charAvatarRef.current?.click()}
              >
                <AvatarImage src={isEdit ? charToEdit.avatar : newChar.avatar} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <CameraIcon size={20} />
                </div>
              </div>
              <button 
                className="text-xs text-[#76DE84] font-medium"
                onClick={() => charAvatarRef.current?.click()}
              >
                更換角色照片
              </button>
              <input 
                type="file" 
                hidden 
                ref={charAvatarRef} 
                accept="image/*" 
                onChange={e => handleImageUpload(e, (url) => {
                  if (isEdit) {
                    setCharacters(prev => prev.map(c => c.id === selectedCharacter?.id ? { ...c, avatar: url } : c));
                  } else {
                    setNewChar(prev => ({ ...prev, avatar: url }));
                  }
                })} 
              />
            </div>
            
            <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'} overflow-hidden shadow-sm`}>
              {[
                { label: '姓名', key: 'name', placeholder: '例如：艾莉絲' },
                { label: '性別', key: 'gender', placeholder: '例如：女' },
                { label: '年齡', key: 'age', placeholder: '例如：20' },
                { label: '性格簽名', key: 'signature', placeholder: '一句話介紹自己' },
                { label: '基本設定', key: 'settings', placeholder: '角色的背景故事或詳細設定' },
                { label: '妳對他的暱稱', key: 'charNickname', placeholder: '例如：笨蛋、親愛的' },
                { label: '他對妳的暱稱', key: 'userNickname', placeholder: '例如：主人、小貓' },
                { label: '妳與他的關係', key: 'relationship', placeholder: '例如：青梅竹馬、僕人' },
                { label: '出沒區域', key: 'location', placeholder: '例如：學校後花園' },
                { label: '個性', key: 'personality', placeholder: '例如：溫柔、聰明' },
                { label: '習性', key: 'habits', placeholder: '例如：喜歡喝下午茶' },
                { label: '對話風格', key: 'customPrompt', placeholder: '例如：傲嬌、毒舌、常使用貼圖' },
                { label: '社交狀況', key: 'socialStatus', placeholder: '例如：與XX關係良好、常去釣魚' },
                { label: '好感度', key: 'favorability', placeholder: '0 - 100', type: 'number' },
              ].map((item) => (
                <div key={item.key} className="px-5 py-3 flex items-center">
                  <span className="w-20 text-sm font-medium">{item.label}</span>
                  <input 
                    type="text"
                    inputMode={item.type === 'number' ? 'numeric' : 'text'}
                    className={`flex-1 text-sm outline-none bg-transparent ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`} 
                    value={isEdit ? (charToEdit as any)[item.key] : ((newChar as any)[item.key] === 0 && item.type === 'number' ? '' : (newChar as any)[item.key])} 
                    onChange={e => {
                      const val = item.type === 'number' ? (e.target.value === '' ? 0 : parseInt(e.target.value) || 0) : e.target.value;
                      if (isEdit) {
                        setCharacters(prev => prev.map(c => c.id === selectedCharacter?.id ? { ...c, [item.key]: val } : c));
                      } else {
                        setNewChar(prev => ({ ...prev, [item.key]: val }));
                      }
                    }}
                    placeholder={item.placeholder}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 px-1 py-1">
              {/* Removed Location Interval slider from here */}
            </div>

            <button 
              onClick={() => {
                if (isEdit) {
                  setCharacterSubPage('details');
                } else {
                  if (!newChar.name) {
                    alert('請輸入角色姓名');
                    return;
                  }
                  const char: Character = {
                    id: Date.now().toString(),
                    name: newChar.name || '無名',
                    gender: newChar.gender || '未知',
                    age: newChar.age || '未知',
                    personality: newChar.personality || '普通',
                    habits: newChar.habits || '無',
                    customPrompt: newChar.customPrompt || '',
                    socialStatus: newChar.socialStatus || '',
                    signature: newChar.signature || '',
                    settings: newChar.settings || '',
                    avatar: newChar.avatar || getRandomAnimalEmoji(),
                    favorability: Number(newChar.favorability) || 0,
                    messages: [],
                    memos: [],
                    minResponseTime: newChar.minResponseTime || 3,
                    maxResponseTime: newChar.maxResponseTime || 35,
                    maxMessagesPerTurn: newChar.maxMessagesPerTurn || 3,
                    chatBackground: newChar.chatBackground || '',
                    myBubbleCss: newChar.myBubbleCss || '',
                    theirBubbleCss: newChar.theirBubbleCss || '',
                    charNickname: newChar.charNickname || '',
                    userNickname: newChar.userNickname || '',
                    relationship: newChar.relationship || '',
                    location: newChar.location || '',
                    locationInterval: newChar.locationInterval || 1,
                    walletBalance: 300
                  };
                  setCharacters(prev => [...prev, char]);
                  setNewChar({
                    name: '', gender: '', age: '', personality: '', habits: '', signature: '', settings: '', avatar: getRandomAnimalEmoji(), favorability: 0,
                    minResponseTime: 3, maxResponseTime: 35, maxMessagesPerTurn: 3,
                    chatBackground: '', myBubbleCss: '', theirBubbleCss: '',
                    charNickname: '', userNickname: '', relationship: '', location: '', locationInterval: 1
                  });
                  setCharacterSubPage('list');
                }
              }}
              className="w-full py-4 bg-[#76DE84] text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform mt-4"
            >
              {isEdit ? "更新完成" : "完成製作"}
            </button>
          </div>
        </div>
      );
    }

    if (characterSubPage === 'details' && selectedCharacter) {
      const char = characters.find(c => c.id === selectedCharacter.id) || selectedCharacter;
      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
          <div className={`px-4 pt-16 pb-3 flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'bg-black' : 'bg-[#f2f2f7]'}`}>
            <button onClick={() => setCharacterSubPage('list')} className="text-[#76DE84] flex items-center gap-0.5 font-medium"><ChevronLeft size={20} />返回</button>
            <h2 className="font-bold">角色簡介</h2>
            <button onClick={() => setCharacterSubPage('edit')} className="text-[#76DE84] font-medium px-2">修改</button>
          </div>

          <div className="flex flex-col items-center mt-6 px-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4">
              <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{char.name}</h3>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#FF2D55]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Heart size={14} className="fill-[#FF2D55] text-[#FF2D55]" />
                <span className="text-sm font-bold text-[#FF2D55]">{char.favorability}</span>
              </div>
              <span className="text-xs opacity-40">好感度</span>
            </div>

            <div className={`w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-2xl p-6 shadow-sm space-y-6 mb-10`}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">性別</label>
                  <p className="font-medium">{char.gender}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">年齡</label>
                  <p className="font-medium">{char.age} 歲</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">妳對他的暱稱</label>
                  <p className="font-medium">{char.charNickname || '無'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">他對妳的暱稱</label>
                  <p className="font-medium">{char.userNickname || '無'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">妳與他的關係</label>
                  <p className="font-medium">{char.relationship || '無'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">出沒地點</label>
                  <p className="font-medium">{char.location || '未知'}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">個性簽名</label>
                <div className="flex items-center gap-2">
                  <input 
                    className={`flex-1 text-sm font-medium leading-relaxed italic border-b border-dashed ${isDarkMode ? 'bg-transparent border-white/20 text-white' : 'bg-transparent border-black/10 text-black'} outline-none`}
                    value={char.signature}
                    onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, signature: e.target.value } : c))}
                    placeholder="點擊修改個性簽名..."
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">管理與監視</label>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setSelectedCharacter(char);
                      setCharacterSubPage('peeper');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#5856D6]/10 text-[#5856D6] rounded-xl font-bold text-sm active:scale-95 transition-transform"
                  >
                    <Eye size={18} />
                    偷窺者模式
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">個性</label>
                <p className="font-medium leading-relaxed">{char.personality}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">習性</label>
                <p className="font-medium leading-relaxed">{char.habits}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">對話風格</label>
                <p className="font-medium leading-relaxed opacity-80">{char.customPrompt || '無'}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">社交狀況</label>
                <p className="font-medium leading-relaxed opacity-80">{char.socialStatus || '無'}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">基本設定</label>
                <p className="font-medium leading-relaxed text-sm opacity-80">{char.settings}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (characterSubPage === 'peeper' && selectedCharacter) {
      const char = characters.find(c => c.id === selectedCharacter.id) || selectedCharacter;
      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
          <Header title="偷窺者模式" onBack={() => setCharacterSubPage('details')} isDarkMode={isDarkMode} />
          <div className="p-6 space-y-6">
            <div className={`p-6 rounded-[32px] ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-xl border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} flex flex-col items-center gap-4 text-center`}>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#5856D6] shadow-lg">
                <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-xl">{char.name} 的隱私錢包</h4>
                <p className="text-xs opacity-40 mt-1 uppercase tracking-tighter">Authorized Access Only</p>
              </div>
              <div className="py-8 w-full">
                <div className="text-5xl font-black text-[#5856D6] tracking-tighter drop-shadow-sm">
                  ${char.walletBalance !== undefined ? char.walletBalance : 300}
                </div>
                <div className="text-[10px] font-bold opacity-30 mt-2 uppercase tracking-[0.2em]">Current Balance</div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} border flex items-start gap-3`}>
              <div className="text-red-500 mt-0.5"><Info size={16} /></div>
              <p className="text-[11px] leading-relaxed opacity-60">
                警告：偷窺者模式僅供監視角色財務狀況之用。任何未經授權的修改可能會導致角色關係破裂或 AI 意識崩潰。
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
                <div className="text-[10px] font-bold opacity-30 uppercase mb-1">今日收入</div>
                <div className="text-lg font-bold text-green-500">+$0</div>
              </div>
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
                <div className="text-[10px] font-bold opacity-30 uppercase mb-1">今日支出</div>
                <div className="text-lg font-bold text-red-500">-$0</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} relative`}>
        <div className={`px-4 pt-16 pb-3 flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-md`}>
          <div className="flex items-center gap-2">
            {!isSelectionMode ? (
              <button 
                onClick={() => setCharacterSubPage('add')} 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-[#76DE84] active:scale-90 transition-transform ${isDarkMode ? 'bg-white/10' : 'bg-neutral-100'}`}
              >
                <Plus size={24} />
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (selectedCharIds.size === characters.length) {
                    setSelectedCharIds(new Set());
                  } else {
                    setSelectedCharIds(new Set(characters.map(c => c.id)));
                  }
                }}
                className="text-[#76DE84] font-medium text-sm"
              >
                {selectedCharIds.size === characters.length ? '取消全選' : '全選'}
              </button>
            )}
          </div>
          <h2 className="text-lg font-bold">AI 夥伴</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedCharIds(new Set());
              }} 
              className="text-[#76DE84] font-medium px-2"
            >
              {isSelectionMode ? '取消' : '選取'}
            </button>
            {!isSelectionMode && (
              <button onClick={goHome} className="text-[#76DE84] font-medium px-2">關閉</button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {!isSelectionMode && (
            <div className="relative">
              <div className={`absolute inset-y-0 left-3 flex items-center text-neutral-400`}><Search size={16} /></div>
              <input className={`w-full ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} rounded-xl py-3 pl-10 pr-4 text-sm outline-none shadow-sm border ${isDarkMode ? 'border-transparent' : 'border-neutral-100'}`} placeholder="搜尋角色檔案" />
            </div>
          )}

          <div className={`flex flex-col gap-3 ${isSelectionMode ? 'pb-32' : 'pb-20'}`}>
            {characters.map(char => {
              const isSelected = selectedCharIds.has(char.id);
              return (
                <motion.div 
                  key={char.id} 
                  layoutId={`char-${char.id}`}
                  onClick={() => {
                    if (isSelectionMode) {
                      const next = new Set(selectedCharIds);
                      if (next.has(char.id)) next.delete(char.id);
                      else next.add(char.id);
                      setSelectedCharIds(next);
                    } else {
                      setSelectedCharacter(char);
                      setCharacterSubPage('details');
                    }
                  }}
                  className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-[24px] p-4 flex items-center gap-4 shadow-sm border ${isSelectionMode && selectedCharIds.has(char.id) ? 'border-[#76DE84] bg-[#76DE84]/5' : (isDarkMode ? 'border-white/5' : 'border-neutral-100')} group overflow-hidden relative transition-all active:scale-98`}
                >
                  {isSelectionMode && (
                    <div className="absolute top-2 left-2 size-5 rounded-full border-2 border-[#76DE84] flex items-center justify-center p-0.5 z-10 bg-inherit">
                      {isSelected && <div className="w-full h-full bg-[#76DE84] rounded-full" />}
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-1 bg-[#FF2D55]/10 px-1.5 py-0.5 rounded-full">
                      <Heart size={8} className="fill-[#FF2D55] text-[#FF2D55]" />
                      <span className="text-[9px] text-[#FF2D55] font-bold">{char.favorability}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg truncate">{char.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#76DE84]/10 text-[#76DE84] font-medium shrink-0">{char.gender}</span>
                    </div>
                    <p className={`text-xs opacity-60 line-clamp-2 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {char.signature || "這個角色還沒有個性簽名..."}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isConfirmingDelete && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-[28px] p-6 w-full max-w-xs shadow-2xl space-y-4`}
              >
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold">確定要刪除嗎？</h3>
                  <p className="text-xs opacity-50">刪除後將無法原復這 {selectedCharIds.size} 個角色夥伴。</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      setCharacters(prev => prev.filter(c => !selectedCharIds.has(c.id)));
                      setSelectedCharIds(new Set());
                      setIsSelectionMode(false);
                      setIsConfirmingDelete(false);
                    }}
                    className="w-full py-3 bg-[#FF2D55] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF2D55]/20 active:scale-95 transition-transform"
                  >
                    確認刪除
                  </button>
                  <button 
                    onClick={() => setIsConfirmingDelete(false)}
                    className={`w-full py-3 ${isDarkMode ? 'bg-white/10' : 'bg-neutral-100'} rounded-xl font-bold text-sm active:scale-95 transition-transform`}
                  >
                    取消
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Toolbar */}
        <AnimatePresence>
          {isSelectionMode && selectedCharIds.size > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-6 left-4 right-4 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border border-neutral-200 dark:border-[#38383a] rounded-3xl p-4 shadow-2xl z-20 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold opacity-40">已選取</span>
                <span className="text-lg font-black text-[#76DE84]">{selectedCharIds.size} <span className="text-sm font-medium opacity-60">個角色</span></span>
              </div>
              <button 
                onClick={() => setIsConfirmingDelete(true)}
                className="bg-[#FF2D55] text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#FF2D55]/20 active:scale-95 transition-transform flex items-center gap-2"
              >
                <Trash2 size={16} />
                刪除
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderWheelApp = () => {
    const handleSpin = () => {
      if (wheelSpins <= 0 || isSpinning) return;
      setIsSpinning(true);
      
      const segments = 7;
      const spinCount = 5 + Math.floor(Math.random() * 5); // 5-10 spins
      const targetIndex = Math.floor(Math.random() * segments);
      const degreePerSegment = 360 / segments;
      
      const targetRotation = wheelRotation + spinCount * 360 + (segments - targetIndex) * degreePerSegment;
      
      setWheelRotation(targetRotation);

      setTimeout(() => {
        const reward = wheelRewards[targetIndex];
        setWalletBalance(prev => prev + reward);
        addTransaction('income', reward, '每日轉盤獎勵');
        setWheelSpins(prev => prev - 1);
        setIsSpinning(false);
      }, 4000);
    };

    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden pb-20`}>
        <Header title="每日轉盤" onBack={goHome} isDarkMode={isDarkMode} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <div className="text-center space-y-2">
            <div className="inline-block px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-full mb-2 animate-pulse">LUCKY EVENT</div>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Daily Jewel Spin</h3>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="text-center">
                <p className="text-[10px] opacity-40 uppercase font-black">今日剩餘</p>
                <p className="text-xl font-black text-orange-500">{wheelSpins} <span className="text-xs">次</span></p>
              </div>
              <div className="w-px h-8 bg-neutral-500/20" />
              <div className="text-center">
                <p className="text-[10px] opacity-40 uppercase font-black">錢包餘額</p>
                <p className="text-xl font-black text-[#5856D6]">${walletBalance}</p>
              </div>
            </div>
          </div>

          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 text-orange-500 drop-shadow-lg">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-current" />
            </div>

            <motion.div 
              className="w-full h-full rounded-full border-8 border-[#1c1c1e] shadow-2xl relative overflow-hidden bg-[#1c1c1e]"
              animate={{ rotate: wheelRotation }}
              transition={{ duration: 4, ease: [0.15, 0, 0, 1] }}
            >
              {wheelRewards.map((reward, i) => (
                <div 
                  key={i}
                  className="absolute top-0 left-0 w-full h-full origin-center"
                  style={{ transform: `rotate(${(360/7) * i}deg)` }}
                >
                  <div 
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-1/2 origin-bottom flex flex-col items-center pt-8 ${i % 2 === 0 ? 'text-white' : 'text-orange-300'}`}
                    style={{ 
                      clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                      backgroundColor: i % 2 === 0 ? '#2c2c2e' : '#3a3a3c'
                    }}
                  >
                    <span className="text-lg font-black tracking-tighter">${reward}</span>
                    <Coins size={16} className="mt-1 opacity-60" />
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 m-auto w-12 h-12 bg-[#1c1c1e] border-4 border-[#3a3a3c] rounded-full z-10 flex items-center justify-center shadow-inner">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              </div>
            </motion.div>
          </div>

          <div className="w-full space-y-4">
            <button 
              onClick={handleSpin}
              disabled={isSpinning || wheelSpins <= 0}
              className={`w-full py-5 rounded-[24px] font-black text-xl tracking-tighter uppercase transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95
                ${isSpinning || wheelSpins <= 0 
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                  : 'bg-orange-500 text-white shadow-orange-500/30 hover:bg-orange-600'}`}
            >
              {isSpinning ? (
                <>旋轉中 <RotateCw size={24} className="animate-spin" /></>
              ) : (
                <>立即抽獎 <Disc size={24} /></>
              )}
            </button>
            <p className="text-[10px] text-center opacity-30 font-bold uppercase tracking-widest leading-relaxed">
              公平公正開獎 • 每日 00:00 自動刷新次數<br />
              格位金幣額度亦會每日隨機調整
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAppContent = () => {
    switch (activeApp) {
      case 'messages': {
        if (!selectedChatId) {
          return (
            <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
              <div className={`px-4 pt-16 pb-3 flex items-center justify-between border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'}`}>
                <h2 className="text-2xl font-bold">訊息</h2>
                <button onClick={goHome} className="text-[#76DE84] font-medium">關閉</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* System AI Chat Room */}
                {!isSystemChatHidden && (
                  <div className="relative overflow-hidden border-b border-neutral-100/10">
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -80, right: 0 }}
                      dragElastic={0.1}
                      onClick={() => setSelectedChatId('system')}
                      className={`relative z-10 px-4 py-4 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-black active:bg-neutral-800' : 'bg-white active:bg-neutral-50'} border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-50'}`}
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                        <Bot size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold">AI 助手</h3>
                          <span className="text-xs opacity-40">現在</span>
                        </div>
                        <p className="text-sm opacity-60 truncate">
                          {messages.length > 0 ? messages[messages.length - 1].text : "哈囉！有什麼我可以幫您的嗎？"}
                        </p>
                      </div>
                    </motion.div>
                    <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-[#FF3B30] text-white">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessages([]);
                          setSystemMemos([]);
                          setIsSystemChatHidden(true);
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <Trash2 size={20} />
                        <span className="text-[10px] font-bold">刪除</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Character Chat Rooms */}
                {characters.filter(c => !c.isChatHidden).map(char => (
                  <div key={char.id} className="relative overflow-hidden border-b border-neutral-100/10">
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -80, right: 0 }}
                      dragElastic={0.1}
                      onClick={() => setSelectedChatId(char.id)}
                      className={`relative z-10 px-4 py-4 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-black active:bg-neutral-800' : 'bg-white active:bg-neutral-50'} border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-50'}`}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-neutral-100/10">
                        <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold">{char.name}</h3>
                          <span className="text-xs opacity-40">現在</span>
                        </div>
                        <p className="text-sm opacity-60 truncate">
                          {char.messages.length > 0 ? char.messages[char.messages.length - 1].text : "點擊開始聊天"}
                        </p>
                      </div>
                    </motion.div>
                    <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-[#FF3B30] text-white">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, messages: [], memos: [], isChatHidden: true } : c));
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <Trash2 size={20} />
                        <span className="text-[10px] font-bold">刪除</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Move constant calculations up to be shared
        const isSystem = selectedChatId === 'system';
        const char = characters.find(c => c.id === selectedChatId);

        if (isChatConfigOpen && char) {
          return (
            <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
              <Header title={`${char.name} 聊天設定`} onBack={() => { setIsChatConfigOpen(false); setPreviewChatBg(null); }} isDarkMode={isDarkMode} />
              <div className="p-4 space-y-6 overflow-y-auto">
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{char.name}</h3>
                    <p className="text-xs opacity-40 mt-1">{char.signature}</p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-2xl p-5 space-y-6 shadow-sm border ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'}`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>回覆速度調整</span>
                      <Sparkles size={14} />
                    </div>
                    
                    <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>最快回覆時間</span>
                      <span className="text-[#76DE84] font-bold">{char.minResponseTime}s</span>
                    </div>
                    <input 
                      type="range" min="1" max="30" 
                      value={char.minResponseTime} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, minResponseTime: val } : c));
                      }}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#76DE84]"
                    />
                    </div>

                    <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>最慢回覆時間</span>
                      <span className="text-[#76DE84] font-bold">{char.maxResponseTime}s</span>
                    </div>
                    <input 
                      type="range" min="1" max="60" 
                      value={char.maxResponseTime} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, maxResponseTime: val } : c));
                      }}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#76DE84]"
                    />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>訊息連續傳送上限</span>
                      <MessageCircle size={14} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>一次最多可傳幾條</span>
                      <span className="text-[#76DE84] font-bold">{char.maxMessagesPerTurn} 條</span>
                    </div>
                    <input 
                      type="range" min="1" max="8" 
                      value={char.maxMessagesPerTurn} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, maxMessagesPerTurn: val } : c));
                      }}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#76DE84]"
                    />
                    <p className="text-[10px] opacity-40 text-center italic mt-2">設定越高，角色一次傳來的短句就越多</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>所在地更換頻率</span>
                      <MapPin size={14} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>改變間隔</span>
                      <span className="text-[#FF9500] font-bold">{char.locationInterval || 1} 小時</span>
                    </div>
                    <input 
                      type="range" min="1" max="24" step="1"
                      value={char.locationInterval || 1}
                      onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, locationInterval: parseInt(e.target.value) } : c))}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#FF9500]"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>主動傳送訊息頻率</span>
                      <Bot size={14} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>閒置多久後發送</span>
                      <span className="text-blue-500 font-bold">{char.proactiveInterval ? `${char.proactiveInterval} 小時` : '已關閉'}</span>
                    </div>
                    <input 
                      type="range" min="0" max="24" step="1"
                      value={char.proactiveInterval || 0}
                      onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, proactiveInterval: parseInt(e.target.value) } : c))}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <p className="text-[10px] opacity-40 text-center italic mt-2">當你長時間沒回話時，角色會主動傳訊息找你</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>自動參與 APP 互動</span>
                      <Activity size={14} />
                    </div>
                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">參與釣魚互動</span>
                        <span className="text-[10px] opacity-40 italic">允許角色在閒置時進入釣魚 APP</span>
                      </div>
                      <button 
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, proactiveFishing: !c.proactiveFishing } : c))}
                        className={`w-10 h-5 rounded-full relative transition-all ${char.proactiveFishing ? 'bg-[#76DE84]' : 'bg-neutral-600'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${char.proactiveFishing ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">自動售出魚貨</span>
                        <span className="text-[10px] opacity-40 italic">依據當天市場價格自動售出釣到的魚貨</span>
                      </div>
                      <button 
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, autoSellFish: !c.autoSellFish } : c))}
                        className={`w-10 h-5 rounded-full relative transition-all ${char.autoSellFish ? 'bg-[#76DE84]' : 'bg-neutral-600'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${char.autoSellFish ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">自動澆水</span>
                        <span className="text-[10px] opacity-40 italic">允許角色在作物需要時有 80% 機率主動澆水</span>
                      </div>
                      <button 
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, proactiveGarden: !c.proactiveGarden } : c))}
                        className={`w-10 h-5 rounded-full relative transition-all ${char.proactiveGarden ? 'bg-[#76DE84]' : 'bg-neutral-600'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${char.proactiveGarden ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">允許角色轉帳</span>
                        <span className="text-[10px] opacity-40 italic">有 50% 機率在聊天時將金幣轉帳給使用者</span>
                      </div>
                      <button 
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, canTransferToUser: !c.canTransferToUser } : c))}
                        className={`w-10 h-5 rounded-full relative transition-all ${char.canTransferToUser ? 'bg-[#76DE84]' : 'bg-neutral-600'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${char.canTransferToUser ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">共用貼圖庫</span>
                        <span className="text-[10px] opacity-40 italic">允許角色在聊天中使用貼圖庫裡儲存的貼圖</span>
                      </div>
                      <button 
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, canUseStickers: !c.canUseStickers } : c))}
                        className={`w-10 h-5 rounded-full relative transition-all ${char.canUseStickers ? 'bg-[#76DE84]' : 'bg-neutral-600'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${char.canUseStickers ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">允許角色贈禮</span>
                        <span className="text-[10px] opacity-40 italic">允許角色購買當日商城的禮物並贈送</span>
                      </div>
                      <button 
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, canSendGifts: !c.canSendGifts } : c))}
                        className={`w-10 h-5 rounded-full relative transition-all ${char.canSendGifts ? 'bg-[#76DE84]' : 'bg-neutral-600'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${char.canSendGifts ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">允許拍一拍</span>
                        <span className="text-[10px] opacity-40 italic">允許角色在聊天時拍一拍你</span>
                      </div>
                      <button 
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, canPat: !c.canPat } : c))}
                        className={`w-10 h-5 rounded-full relative transition-all ${char.canPat ? 'bg-[#76DE84]' : 'bg-neutral-600'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${char.canPat ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>偷窺者模式 (金幣流向)</span>
                      <TrendingUp size={14} />
                    </div>
                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-black/20' : 'bg-neutral-50'} space-y-4`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs opacity-50">當前金幣餘額</span>
                        <span className="text-xl font-black text-[#FF9500]">${char.walletBalance || 0}</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold opacity-30 uppercase">近期交易紀錄</label>
                        <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
                          {(!char.transactions || char.transactions.length === 0) ? (
                            <p className="text-[10px] opacity-30 text-center py-4 italic">暫無金幣異動記錄</p>
                          ) : (
                            char.transactions.map(tx => (
                              <div key={tx.id} className={`flex justify-between items-center p-2.5 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white'} shadow-sm gap-2`}>
                                <div className="flex flex-col flex-1">
                                  <span className="text-xs font-bold leading-tight text-amber-600 dark:text-amber-400">{tx.title}</span>
                                  <span className="text-[9px] opacity-40 mt-1">{tx.timestamp}</span>
                                </div>
                                <span className={`text-sm font-black shrink-0 ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                  {tx.type === 'income' ? '+' : '-'}${tx.amount}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <label className="text-[10px] font-bold opacity-30 uppercase">近期動態紀錄</label>
                        <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                          {(!char.activityLogs || char.activityLogs.length === 0) ? (
                            <p className="text-[10px] opacity-30 text-center py-2 italic">暫無動態紀錄</p>
                          ) : (
                            char.activityLogs.map((log, lIdx) => (
                              <div key={lIdx} className="text-[10px] opacity-60 flex gap-2 items-start">
                                <span className="text-[#76DE84]">●</span>
                                <span>{log}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>聊天室美化</span>
                      <Sparkles size={14} />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">聊天背景圖</label>
                        <div className="flex gap-2">
                          <input 
                            className={`flex-1 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'} border rounded-lg px-3 py-2 text-xs`}
                            placeholder="輸入圖片 URL"
                            value={previewChatBg !== null ? previewChatBg : (char.chatBackground || '')}
                            onChange={(e) => setPreviewChatBg(e.target.value)}
                          />
                          <button 
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setPreviewChatBg(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              };
                              input.click();
                            }}
                            className="bg-[#76DE84] text-white text-[10px] px-3 rounded-lg font-bold"
                          >
                            上傳
                          </button>
                        </div>
                      </div>

                      {previewChatBg !== null && (
                        <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'} space-y-3`}>
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">背景預覽</p>
                            <button onClick={() => setPreviewChatBg(null)} className="text-[10px] hover:text-red-500 transition-colors">清除預覽</button>
                          </div>
                          <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/20">
                            <img src={previewChatBg} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                if (previewChatBg) {
                                   setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, chatBackground: previewChatBg } : c));
                                   setPreviewChatBg(null);
                                }
                              }}
                              className="flex-1 py-1.5 bg-[#76DE84] text-white text-xs font-bold rounded-lg shadow-sm"
                            >
                              套用此背景
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium">我的氣泡 CSS 代碼</label>
                      <textarea 
                        className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'} border rounded-lg px-3 py-2 text-[10px] font-mono h-20 outline-none`}
                        placeholder="例如: background: linear-gradient(45deg, #76DE84, #5856D6); border-radius: 20px 20px 0 20px;"
                        value={char.myBubbleCss || ''}
                        onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, myBubbleCss: e.target.value } : c))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium">對方的氣泡 CSS 代碼</label>
                      <textarea 
                        className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'} border rounded-lg px-3 py-2 text-[10px] font-mono h-20 outline-none`}
                        placeholder="例如: background: white; color: black; border: 2px solid #EEE;"
                        value={char.theirBubbleCss || ''}
                        onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, theirBubbleCss: e.target.value } : c))}
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-bold opacity-30 text-center uppercase tracking-widest">— 氣泡樣式預設 —</p>
                      <div className="grid grid-cols-2 gap-2">
                        {BUBBLE_PRESETS.map((p, idx) => (
                          <div key={idx} className={`${isDarkMode ? 'bg-white/5' : 'bg-neutral-100'} p-2 rounded-xl flex flex-col gap-2`}>
                            <div className="text-[10px] font-bold text-center opacity-60">{p.name}</div>
                            <div className="grid grid-cols-2 gap-1">
                              <button 
                                onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, myBubbleCss: p.css } : c))}
                                className="bg-[#76DE84] text-white text-[8px] py-1 rounded-md font-bold active:scale-95 transition-transform"
                              >
                                套用我
                              </button>
                              <button 
                                onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, theirBubbleCss: p.css } : c))}
                                className="bg-[#AF52DE] text-white text-[8px] py-1 rounded-md font-bold active:scale-95 transition-transform"
                              >
                                套用他
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => { setIsChatConfigOpen(false); setPreviewChatBg(null); }}
                  className="w-full py-4 bg-[#76DE84] text-white rounded-2xl font-bold shadow-lg shadow-[#76DE84]/20 active:scale-95 transition-transform"
                >
                  確認修改
                </button>
              </div>
            </div>
          );
        }

        if (!isSystem && !char) { setSelectedChatId(null); return null; }

        const chatName = isSystem ? "AI 助手" : char!.name;
        const chatAvatar = isSystem ? null : char!.avatar;
        const chatMessages = isSystem ? messages : char!.messages;

        // Dynamic status logic
        const getStatus = () => {
          if (isSystem) return "在線";
          const statuses = ["在線", "忙碌", "吃飯中", "睡覺中", "玩遊戲中", "發呆中"];
          return statuses[Math.floor((Date.now() / 3600000 + parseInt(char!.id.slice(-2))) % statuses.length)];
        };
        const status = getStatus();

        const getLocation = () => {
          if (isSystem) return "";
          const locString = char?.location || '未知地點';
          const interval = (char?.locationInterval || 1) * 3600000; // hours to ms
          const locs = locString.split(/[，,、\s]+/).filter(l => l.trim().length > 0);
          if (locs.length <= 1) return locString;
          // Change location based on time using the user-defined interval
          return locs[Math.floor((Date.now() / interval + parseInt(char!.id.slice(-2))) % locs.length)];
        };
        const location = getLocation();

        return (
          <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} relative`}>
            <div className={`px-4 pt-16 pb-3 border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'} flex items-center justify-between sticky top-0 bg-inherit z-10`}>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedChatId(null)} className="text-[#76DE84] flex items-center gap-0.5 font-medium shrink-0">
                  <ChevronLeft size={20} />
                  返回
                </button>
                <div className="flex items-center ml-2 gap-2">
                  {isSystem ? (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]"><Bot size={22} /></div>
                  ) : (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-100 shadow-sm relative">
                      <AvatarImage src={chatAvatar!} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold truncate max-w-[120px]">{chatName}</span>
                    {!isSystem && (
                      <div className="flex flex-col">
                        <span className="text-[9px] opacity-50 flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${status === '在線' ? 'bg-green-500' : 'bg-orange-500'}`} />
                          {status}
                        </span>
                        <span className="text-[9px] opacity-40">{location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isSystem && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsGiftModalOpen(true)}
                      className="text-[#FF2D55] active:scale-90 transition-transform"
                    >
                      <Heart size={20} />
                    </button>
                    <button 
                      onClick={() => setIsTransferModalOpen(true)}
                      className="text-[#FF9500] active:scale-90 transition-transform"
                    >
                      <WalletIcon size={20} />
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => !isSystem && setIsChatConfigOpen(true)}
                  className={`text-[#76DE84] transition-opacity ${isSystem ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`}
                >
                  <Info size={20} />
                </button>
              </div>
            </div>

            {/* System Alert Modal */}
            <AnimatePresence>
              {systemAlert && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className={`${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 items-center shadow-2xl`}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#76DE84]/20 text-[#76DE84] flex items-center justify-center mb-2">
                       <Check size={32} strokeWidth={3} />
                    </div>
                    <h3 className="font-bold text-lg text-center tracking-wide">{systemAlert}</h3>
                    <button 
                      onClick={() => setSystemAlert(null)}
                      className="w-full py-3 bg-[#76DE84] text-white rounded-xl font-bold active:scale-95 transition-transform"
                    >
                      確定
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gift Modal */}
            <AnimatePresence>
              {isGiftModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className={`${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]`}
                  >
                    {!giftConfirmItem ? (
                      <>
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                            <Heart className="text-[#FF2D55] fill-[#FF2D55]" size={20} />
                            贈送物品
                          </h3>
                          <p className="text-xs opacity-50 mt-1">從倉庫中選擇要贈送給 {chatName} 的魚貨或作物</p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                          {warehouseItems.filter(i => (i.id.startsWith('f') || i.id.startsWith('c')) && i.amount > 0).length === 0 ? (
                            <div className="py-10 text-center opacity-30">
                              <ShoppingBag className="mx-auto mb-2" size={40} />
                              <p className="text-sm font-bold">目前倉庫沒有魚或作物</p>
                              <p className="text-[10px]">去釣魚或種田獲取後再來吧！</p>
                            </div>
                          ) : (
                            warehouseItems.filter(i => (i.id.startsWith('f') || i.id.startsWith('c')) && i.amount > 0).map(item => {
                              const isFish = item.id.startsWith('f');
                              const info = isFish 
                                ? FISH_TYPES.find(f => f.id === item.id) 
                                : CROP_TYPES.find(c => c.id === item.id);
                              
                              if (!info) return null;

                              return (
                                <button 
                                  key={item.id}
                                  onClick={() => setGiftConfirmItem({ ...info, originalId: item.id })}
                                  className={`w-full p-4 rounded-2xl ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-neutral-50 hover:bg-neutral-100'} flex items-center justify-between transition-colors group`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-3xl group-hover:scale-110 transition-transform">{info.icon}</span>
                                    <div className="text-left">
                                      <div className="font-bold text-sm">{info.name}</div>
                                      <div className="text-[10px] opacity-40">擁有數量: {item.amount}</div>
                                    </div>
                                  </div>
                                  <div className="text-[#FF2D55] font-black text-xs">選擇</div>
                                </button>
                              );
                            })
                          )}
                        </div>

                        <button 
                          onClick={() => {
                            setIsGiftModalOpen(false);
                            setGiftConfirmItem(null);
                          }}
                          className={`mt-6 py-3 rounded-xl font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-neutral-100 text-black'} active:scale-95 transition-transform`}
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <div className="text-6xl mb-4 animate-bounce">{giftConfirmItem.icon}</div>
                        <h3 className="text-xl font-bold mb-2">確定要贈送 {giftConfirmItem.name} 嗎？</h3>
                        <p className="text-sm opacity-50 text-center mb-8">贈送後將從倉庫扣除 1 個此物品，並增加與 {chatName} 的好感度。</p>
                        
                        <div className="flex w-full gap-3">
                          <button 
                            onClick={() => setGiftConfirmItem(null)}
                            className={`flex-1 py-3 rounded-xl font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-neutral-100 text-black'} active:scale-95 transition-transform`}
                          >
                            選別的
                          </button>
                          <button 
                            onClick={() => {
                              // Gift logic
                              const item = warehouseItems.find(i => i.id === giftConfirmItem.originalId);
                              if (item && item.amount > 0) {
                                setWarehouseItems(prev => prev.map(i => i.id === item.id ? { ...i, amount: i.amount - 1 } : i).filter(i => i.amount > 0));
                                
                                // Calculate favor gain
                                let favorGain = 5;
                                if (giftConfirmItem.originalId.startsWith('f')) {
                                  const fish = giftConfirmItem as Fish;
                                  if (fish.rarity === '稀有') favorGain = 10;
                                  else if (fish.rarity === '史詩') favorGain = 25;
                                  else if (fish.rarity === '傳說') favorGain = 50;
                                } else {
                                  const crop = giftConfirmItem as Crop;
                                  favorGain = Math.ceil(crop.sellPrice / 20);
                                }

                                setCharacters(prev => prev.map(c => c.id === char!.id ? { 
                                  ...c, 
                                  favorability: (c.favorability || 0) + favorGain,
                                  messages: [...c.messages, { role: 'user', text: `[贈送] ${giftConfirmItem.icon} ${giftConfirmItem.name}` }]
                                } : c));
                              }
                              setGiftConfirmItem(null);
                              setIsGiftModalOpen(false);
                            }}
                            className="flex-1 py-3 bg-[#FF2D55] text-white rounded-xl font-bold shadow-lg shadow-[#FF2D55]/20 active:scale-95 transition-transform"
                          >
                            確定贈送
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transfer Modal */}
            <AnimatePresence>
              {isTransferModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className={`${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} w-full rounded-3xl p-6 shadow-2xl space-y-6`}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#FF9500] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FF9500]/20">
                        <WalletIcon size={32} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold">轉帳給 {chatName}</h3>
                      <p className="text-sm opacity-50 mt-1">錢包餘額：${walletBalance}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold opacity-40 uppercase px-1">輸入金額</label>
                      <input 
                        type="number"
                        placeholder="0"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className={`w-full text-2xl font-bold text-center py-4 rounded-2xl outline-none border-2 transition-colors ${isDarkMode ? 'bg-black/40 border-white/5 focus:border-[#FF9500]' : 'bg-neutral-50 border-neutral-100 focus:border-[#FF9500]'}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => { setIsTransferModalOpen(false); setTransferAmount(''); }}
                        className={`py-3 rounded-xl font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-neutral-100 text-black'} active:scale-95 transition-transform`}
                      >
                        取消
                      </button>
                      <button 
                        disabled={!transferAmount || parseInt(transferAmount) <= 0 || parseInt(transferAmount) > walletBalance}
                        onClick={() => {
                          const amount = parseInt(transferAmount);
                          setWalletBalance(prev => prev - amount);
                          addTransaction('transfer', amount, `轉帳給 ${chatName}`, chatName);
                          setCharacters(prev => prev.map(c => {
                            if (c.id === char!.id) {
                              const charTx: Transaction = {
                                id: Date.now().toString() + 'c' + Math.random().toString(36).substr(2, 5),
                                type: 'income',
                                amount: amount,
                                title: `收到來自 ${userProfile.name} 的轉帳`,
                                timestamp: new Date().toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                              };
                              return { 
                                ...c, 
                                favorability: (c.favorability || 0) + Math.ceil(amount / 100), 
                                walletBalance: (c.walletBalance || 0) + amount,
                                transactions: [charTx, ...(c.transactions || [])]
                              };
                            }
                            return c;
                          }));
                          
                          // Add a fake system message about transfer
                          const transferMsg: Message = { role: 'user', text: `[系統通知] 成功轉帳 $${amount} 給 ${chatName}` };
                          setCharacters(prev => prev.map(c => c.id === char!.id ? { ...c, messages: [...c.messages, transferMsg] } : c));
                          
                          setIsTransferModalOpen(false);
                          setTransferAmount('');
                        }}
                        className={`py-3 rounded-xl font-bold bg-[#FF9500] text-white shadow-lg shadow-[#FF9500]/20 active:scale-95 transition-transform disabled:opacity-20 disabled:cursor-not-allowed`}
                      >
                        確認轉帳
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/10 relative" 
              style={char?.chatBackground ? { backgroundImage: `url(${char.chatBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              onClick={() => setIsEmojiPickerOpen(false)}
            >
              {char?.chatBackground && <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none" />}
              <div className="relative z-1">
                {chatMessages.length === 0 && (
                  <div className={`text-center py-10 opacity-40 text-sm ${char?.chatBackground ? 'text-white' : ''}`}>與 {chatName} 開始對話吧！</div>
                )}
                <div className="space-y-4">
                  {chatMessages.map((m, i) => {
                    const isSticker = m.text.startsWith('[貼圖] ');
                    const stickerUrl = isSticker ? m.text.replace('[貼圖] ', '') : null;
                    const isGift = m.text.includes('[贈禮]');
                    const isTransfer = m.text.includes('[轉帳]');
                    const hasReply = m.replyTo;
                    
                    // Custom CSS logic
                    let customStyle: React.CSSProperties = {};
                    if (m.role === 'user' && char?.myBubbleCss) {
                      try {
                        const styleParts = char.myBubbleCss.split(';').filter(p => p.includes(':'));
                        styleParts.forEach(part => {
                          const [key, value] = part.split(':').map(s => s.trim());
                          const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as any;
                          customStyle[camelKey] = value;
                        });
                      } catch (e) { console.error("Bubble CSS Error", e); }
                    } else if (m.role === 'model' && char?.theirBubbleCss) {
                      try {
                        const styleParts = char.theirBubbleCss.split(';').filter(p => p.includes(':'));
                        styleParts.forEach(part => {
                          const [key, value] = part.split(':').map(s => s.trim());
                          const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as any;
                          customStyle[camelKey] = value;
                        });
                      } catch (e) { console.error("Bubble CSS Error", e); }
                    }

                    return (
                      <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {hasReply && (
                          <div className={`text-[10px] opacity-40 mb-1 flex items-center gap-1 ${m.role === 'user' ? 'mr-2' : 'ml-2'}`}>
                            <Reply size={10} className="rotate-180" />
                            <span className="truncate max-w-[150px]">回覆: {m.replyTo}</span>
                          </div>
                        )}
                        <div className={`flex group items-center gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} cursor-pointer`} onClick={() => setReplyingTo(m)}>
                          {isSticker ? (
                            <div className={`max-w-[150px] p-1 rounded-xl transition-transform active:scale-95 ${m.role === 'user' ? 'bg-[#76DE84]/10' : ''}`}>
                              <img src={stickerUrl!} className="w-full h-auto rounded-lg object-contain" alt="Sticker" />
                            </div>
                          ) : (
                            <div 
                              style={customStyle}
                              onClick={(e) => {
                                if (isGift) { e.stopPropagation(); setSystemAlert('收下禮物'); }
                                else if (isTransfer) { e.stopPropagation(); setSystemAlert('收下轉帳'); }
                              }}
                              className={`max-w-[80%] px-4 py-2 rounded-[20px] text-[15px] shadow-sm relative ${Object.entries(customStyle).length > 0 ? '' : (m.role === 'user' ? 'bg-[#76DE84] text-white rounded-tr-none' : (isDarkMode ? 'bg-[#1c1c1e] text-white border border-[#38383a] rounded-tl-none' : 'bg-neutral-100 text-black rounded-tl-none'))} ${(isGift || isTransfer) ? 'ring-2 ring-amber-400 cursor-pointer active:scale-95 transition-transform' : ''}`}
                            >
                              {m.text}
                            </div>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setReplyingTo(m); }}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full ${isDarkMode ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-black/5 text-neutral-500'}`}
                            title="回覆"
                          >
                            <Reply size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {typingChatId === selectedChatId && <div className="text-[10px] text-neutral-400 ml-2 animate-pulse mb-4">{chatName} 正在輸入...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* Emoji/Sticker Picker */}
            <AnimatePresence>
              {isEmojiPickerOpen && (
                <motion.div
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 200, opacity: 0 }}
                  className={`absolute bottom-[80px] left-4 right-4 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} border ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'} rounded-3xl p-4 shadow-xl z-20 flex flex-col gap-4 max-h-[350px]`}
                >
                  <div className="flex items-center gap-4 border-b border-neutral-100/10 pb-2">
                    <button 
                      onClick={() => setEmojiPickerTab('stickers')}
                      className={`text-xs font-bold uppercase tracking-widest transition-opacity ${emojiPickerTab === 'stickers' ? 'opacity-100 underline decoration-2 underline-offset-4 decoration-[#76DE84]' : 'opacity-30 hover:opacity-50'}`}
                    >
                      表情與貼圖
                    </button>
                    <button 
                      onClick={() => setEmojiPickerTab('nudge')}
                      className={`text-xs font-bold uppercase tracking-widest transition-opacity ${emojiPickerTab === 'nudge' ? 'opacity-100 underline decoration-2 underline-offset-4 decoration-[#76DE84]' : 'opacity-30 hover:opacity-50'}`}
                    >
                      拍一拍
                    </button>
                    <button 
                      onClick={() => setEmojiPickerTab('memo')}
                      className={`text-xs font-bold uppercase tracking-widest transition-opacity ${emojiPickerTab === 'memo' ? 'opacity-100 underline decoration-2 underline-offset-4 decoration-[#76DE84]' : 'opacity-30 hover:opacity-50'}`}
                    >
                      備忘錄
                    </button>
                    <div className="flex-1" />
                    {emojiPickerTab === 'stickers' && (
                      <button 
                        onClick={() => stickerInputRef.current?.click()}
                        className="text-[10px] bg-[#76DE84]/10 text-[#76DE84] px-2 py-1 rounded-full font-bold active:scale-90 transition-transform"
                      >
                        + 新增貼圖
                      </button>
                    )}
                    <input 
                      type="file" 
                      hidden 
                      ref={stickerInputRef} 
                      accept="image/*" 
                      onChange={e => handleImageUpload(e, (url) => setStickers(prev => [url, ...prev]))} 
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto min-h-[200px]">
                    {emojiPickerTab === 'stickers' ? (
                      <div>
                        <p className="text-[10px] font-bold opacity-30 mb-2">我的貼圖</p>
                        {stickers.length === 0 ? (
                          <div className="text-center py-8 opacity-30 text-xs">尚無貼圖，點擊上方按鈕新增</div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2">
                            {stickers.map((s, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => {
                                  if (isSystem) {
                                    setInput("");
                                    const stickerMsg: Message = { role: 'user', text: `[貼圖] ${s}` };
                                    setMessages(prev => [...prev, stickerMsg]);
                                  } else {
                                    setInput("");
                                    const stickerMsg: Message = { role: 'user', text: `[貼圖] ${s}` };
                                    setCharacters(prev => prev.map(c => c.id === char!.id ? { ...c, messages: [...c.messages, stickerMsg] } : c));
                                  }
                                  setIsEmojiPickerOpen(false);
                                }}
                                className="aspect-square rounded-lg overflow-hidden bg-neutral-100 hover:scale-105 transition-transform"
                              >
                                <img src={s} className="w-full h-full object-contain p-1" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : emojiPickerTab === 'nudge' ? (
                      <div className="flex flex-col gap-4 py-4">
                        <div className="text-center space-y-2">
                          <p className="text-sm font-medium opacity-70">你想拍拍 {chatName} 的哪裡？</p>
                          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-neutral-50'} border border-neutral-100/10`}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs opacity-40 shrink-0">拍一拍他的...</span>
                              <input 
                                type="text"
                                value={nudgeInput}
                                onChange={(e) => setNudgeInput(e.target.value)}
                                placeholder="頭、肩膀、肚子..."
                                className="flex-1 bg-transparent border-none outline-none text-sm font-bold"
                                onKeyDown={(e) => e.key === 'Enter' && sendNudge(char!)}
                              />
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => sendNudge(char!)}
                          disabled={isSystem}
                          className="w-full py-3 bg-[#76DE84] text-white rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-20 shadow-lg shadow-[#76DE84]/20"
                        >
                          發送拍一拍
                        </button>
                        <div className="text-[10px] text-center opacity-30 px-6">
                        就像微信的拍一拍功能一樣，讓對方知道你在找他。
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 py-2 h-full">
                        <div className="flex items-center gap-2">
                          <input 
                            className={`flex-1 ${isDarkMode ? 'bg-black/40 text-white' : 'bg-neutral-50 text-black'} border-none outline-none px-4 py-3 rounded-xl text-sm font-medium`}
                            placeholder="新增備忘錄..."
                            value={memoInput}
                            onChange={(e) => setMemoInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addMemo(selectedChatId!)}
                          />
                          <button 
                            onClick={() => addMemo(selectedChatId!)}
                            className="w-10 h-10 bg-[#34C759] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#34C759]/20 active:scale-90 transition-transform"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pb-10">
                          {(isSystem ? systemMemos : (char?.memos || [])).length === 0 ? (
                            <div className="text-center py-10 opacity-30 text-xs">尚無備忘錄</div>
                          ) : (
                            (isSystem ? systemMemos : (char?.memos || [])).map(m => (
                              <div key={m.id} className="relative overflow-hidden rounded-xl">
                                <motion.div 
                                  drag="x"
                                  dragConstraints={{ left: -60, right: 0 }}
                                  dragElastic={0.1}
                                  className={`relative z-10 flex items-center gap-3 p-3 ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-neutral-50'} rounded-xl group`}
                                >
                                  <button 
                                    onClick={() => toggleMemo(selectedChatId!, m.id)}
                                    className={`shrink-0 transition-colors ${m.completed ? 'text-[#34C759]' : 'text-neutral-300'}`}
                                  >
                                    {m.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                  </button>
                                  <span className={`text-sm flex-1 ${m.completed ? 'line-through opacity-30' : ''}`}>
                                    {m.text}
                                  </span>
                                </motion.div>
                                <div className="absolute inset-y-0 right-0 w-[60px] bg-[#FF3B30] flex items-center justify-center text-white">
                                  <button onClick={() => deleteMemo(selectedChatId!, m.id)} className="p-2">
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`p-4 flex flex-col gap-3 border-t ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'}`}>
              {replyingTo && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`px-4 py-2 rounded-2xl flex items-center justify-between gap-3 text-xs border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'}`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Reply size={12} className="text-[#76DE84] shrink-0" />
                    <div className="truncate">
                      <span className="font-bold opacity-50 mr-1">{replyingTo.role === 'user' ? '你' : chatName}:</span>
                      <span className="opacity-70">{replyingTo.text}</span>
                    </div>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="opacity-40 hover:opacity-100"><Trash2 size={14} /></button>
                </motion.div>
              )}
              {stackedMessages.length > 0 && (
                <div className="flex gap-2 py-1 overflow-x-auto no-scrollbar">
                  {stackedMessages.map((msg, idx) => (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={idx}
                      className={`px-3 py-1.5 rounded-2xl text-[10px] font-bold whitespace-nowrap shrink-0 flex items-center gap-2 ${isDarkMode ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/40'}`}
                    >
                      <span className="truncate max-w-[80px]">{msg}</span>
                      <button 
                        onClick={() => setStackedMessages(prev => prev.filter((_, i) => i !== idx))}
                        className="hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                  <button 
                    onClick={() => setStackedMessages([])}
                    className="px-3 py-1.5 rounded-2xl text-[10px] font-bold text-red-500 bg-red-500/10"
                  >
                    全部清除
                  </button>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <button 
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isEmojiPickerOpen ? 'bg-[#76DE84] text-white' : (isDarkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-neutral-500 hover:bg-neutral-100')}`}
                >
                  <Smile size={24} />
                </button>
                <div className="flex-1 relative flex items-center">
                  <input 
                    className={`w-full ${isDarkMode ? 'bg-[#1c1c1e] text-white border-[#38383a]' : 'bg-[#F1F3F5] text-black border-transparent'} border rounded-full pl-4 pr-10 py-2 text-sm outline-none`} 
                    placeholder="iMessage" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onFocus={() => setIsEmojiPickerOpen(false)}
                    onKeyPress={e => e.key === 'Enter' && (isSystem ? handleSendMessage(input) : handleCharacterChat(char!, input))} 
                  />
                  <button 
                    disabled={!input.trim()}
                    onClick={() => {
                      if (input.trim()) {
                        setStackedMessages(prev => [...prev, input.trim()]);
                        setInput('');
                      }
                    }}
                    className={`absolute right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${!input.trim() ? 'opacity-20 pointer-events-none' : 'text-[#76DE84] hover:bg-[#76DE84]/10 active:scale-90'}`}
                  >
                    <Layers size={18} />
                    {stackedMessages.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                        {stackedMessages.length}
                      </span>
                    )}
                  </button>
                </div>
                <button 
                  onClick={() => {
                    if (stackedMessages.length > 0) {
                      isSystem ? handleSendMessage(stackedMessages) : handleCharacterChat(char!, stackedMessages);
                    } else {
                      isSystem ? handleSendMessage(input) : handleCharacterChat(char!, input);
                    }
                  }} 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform ${stackedMessages.length > 0 ? 'bg-orange-400' : 'bg-[#76DE84]'}`}
                >
                  {stackedMessages.length > 0 ? <Send size={18} /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </div>
        );
      }
      case 'kitchen': return <KitchenApp 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
        warehouseItems={warehouseItems}
        setWarehouseItems={setWarehouseItems}
        characters={characters}
        setCharacters={setCharacters}
      />;
      case 'store': return <StoreApp 
        walletBalance={walletBalance}
        setWalletBalance={setWalletBalance}
        addTransaction={addTransaction}
        setWarehouseItems={setWarehouseItems}
        dailyStoreItems={dailyStoreItems}
        isDarkMode={isDarkMode}
        goHome={goHome}
        warehouseItems={warehouseItems}
        characters={characters}
        setCharacters={setCharacters}
      />;
      case 'settings': return renderSettings();
      case 'characters': return renderCharacters();
      case 'wheel': return renderWheelApp();
      case 'moments': return <MomentsApp 
        momentGroups={momentGroups} setMomentGroups={setMomentGroups}
        momentPosts={momentPosts} setMomentPosts={setMomentPosts}
        characters={characters} userProfile={userProfile}
        isDarkMode={isDarkMode} goHome={goHome} 
      />;
      case 'fishing': return <FishingApp 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
        onCatchFish={(id) => {
          setWarehouseItems(prev => {
            const existing = prev.find(i => i.id === id);
            if (existing) return prev.map(i => i.id === id ? { ...i, amount: i.amount + 1 } : i);
            return [...prev, { id, amount: 1 }];
          });
        }} 
        onCatchTrash={(coins) => {
          setWalletBalance(prev => prev + coins);
          addTransaction('income', coins, '釣魚獲得金幣');
        }} 
      />;
      case 'wallet': return <WalletApp 
        walletBalance={walletBalance}
        transactions={transactions}
        isDarkMode={isDarkMode}
        goHome={goHome}
        setActiveApp={setActiveApp}
      />;
      case 'garden': return <GardenApp 
        patches={gardenPatches}
        isDarkMode={isDarkMode}
        goHome={goHome}
        onUnlockPatch={onUnlockPatch}
        onPlant={onPlant}
        onWater={onWater}
        onHarvest={onHarvest}
      />;
      case 'warehouse': return <WarehouseApp 
        warehouseItems={warehouseItems} 
        receivedGifts={receivedGifts}
        isDarkMode={isDarkMode} 
        goHome={goHome} 
        onSell={onSell}
      />;
      case 'game': return <GameApp 
        characters={characters}
        userProfile={userProfile}
        isDarkMode={isDarkMode}
        goHome={goHome}
        aiSettings={aiSettings}
        walletBalance={walletBalance}
        setWalletBalance={setWalletBalance}
        setCharacters={setCharacters}
        addTransaction={addTransaction}
      />;
      case 'photos': return <MailboxApp 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
        letters={letters}
        setLetters={setLetters}
        characters={characters}
        userProfile={userProfile}
      />;
      case 'dex': return <DexApp 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
      />;
      default: return (
        <div className={`flex-1 flex flex-col items-center justify-center pt-20 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
          <div className="animate-bounce mb-4"><Smartphone size={48} className="text-[#76DE84]" /></div>
          <h2 className="text-xl font-bold capitalize">{appNames[activeApp || ''] || activeApp}</h2>
          <p className="text-xs opacity-50 mt-2">App 已啟動</p>
        </div>
      );
    }
  };

  useEffect(() => {
    setAppNames(prev => {
      const next = { ...prev };
      (Object.keys(next) as AppId[]).forEach(id => {
        if (TRANSLATIONS[language][id as keyof typeof TRANSLATIONS[Language.ZH_TW]]) {
          next[id] = TRANSLATIONS[language][id as keyof typeof TRANSLATIONS[Language.ZH_TW]] as string;
        }
      });
      return next;
    });
  }, [language]);

  return (
    <div className={`min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4 font-sans text-neutral-800 transition-all duration-500 ${isFullScreen ? 'p-0 bg-black' : ''}`}>
      <div 
        style={isFullScreen ? { maxWidth: '100%', height: '100vh', borderRadius: '0', borderWidth: '0' } : {}}
        className={`relative w-full max-w-[375px] h-[812px] bg-black rounded-[55px] border-[12px] border-neutral-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-500`}
      >
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-11 px-6 flex justify-between items-end pb-1.5 z-[100] pointer-events-none">
          <span className="text-[14px] font-semibold text-white">{currentTime.toLocaleTimeString(LOCALES[language], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl" />
          <div className="flex gap-1.5 items-center text-white"><Signal size={16} /> <Wifi size={16} /> <Battery size={20} /></div>
        </div>

        <AnimatePresence mode="wait">
          {screenState === ScreenState.Locked && (
            <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -812 }} 
              className="relative flex-1 flex flex-col items-center bg-cover bg-center" 
              style={{ 
                backgroundColor: lockWallpaper === "grey-cross" ? "#2c2c2e" : "transparent",
                backgroundImage: lockWallpaper === "grey-cross" 
                  ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 15h2v10h-2zM15 19h10v2h-10z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")` 
                  : `url(${lockWallpaper})` 
              }}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 mt-16 text-center text-white"><Lock size={20} className="mx-auto mb-2 opacity-80" />
                <h1 className="text-7xl font-thin tracking-tighter mb-1">{currentTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                <p className="text-xl font-medium opacity-90">{currentTime.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}</p></div>
              <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center z-10">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setScreenState(ScreenState.Home)} 
                  className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 text-white shadow-lg"><Unlock size={28} /></motion.button>
                <p className="mt-4 text-white/60 text-sm font-medium animate-pulse">向上輕掃解鎖</p></div>
            </motion.div>
          )}

          {screenState === ScreenState.Home && (
            <motion.div 
              key="home" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, scale: 1.1 }} 
              className="relative flex-1 flex flex-col bg-cover bg-center select-none" 
              style={{ 
                backgroundColor: homeWallpaper === "grey-cross" ? "#1c1c1e" : "transparent",
                backgroundImage: homeWallpaper === "grey-cross" 
                  ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 15h2v10h-2zM15 19h10v2h-10z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")` 
                  : `url(${homeWallpaper})` 
              }}
              onPointerDown={(e) => {
                if (isJiggling) {
                  // If clicking background (not an app), stop jiggling
                  if (e.target === e.currentTarget) setIsJiggling(false);
                } else {
                  handleHomePointerDown();
                }
              }}
              onPointerUp={handleHomePointerUp}
              onPointerLeave={handleHomePointerUp}
            >
              <div className="absolute inset-0 bg-black/5" />
              
              {/* App Grid */}
              <div 
                className="relative z-10 p-6 pt-24 flex-1"
                onPointerUp={() => {
                  if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                  }
                }}
              >
                <div 
                  className="grid grid-cols-4 gap-x-4 gap-y-8 auto-rows-max"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="popLayout">
                    {installedApps.map((id, index) => (
                      <motion.div
                        key={id}
                        layout
                        layoutId={id}
                        drag={isJiggling}
                        dragListener={isJiggling}
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.9}
                        whileDrag={{ 
                          scale: 1.1, 
                          zIndex: 50,
                          transition: { duration: 0.1 } 
                        }}
                        onDrag={(_, info) => {
                          if (!isJiggling) return;
                          
                          // Simplified 2D grid reordering logic
                          // We calculate the target index based on drag position
                          // 4 columns, roughly 80px width per column, 100px height per row
                          const col = Math.min(3, Math.max(0, Math.floor((info.point.x - 24) / 80)));
                          const row = Math.max(0, Math.floor((info.point.y - 120) / 110));
                          
                          // Convert col/row to index
                          // If profile-widget is at top, it takes 4 slots
                          let targetIndex = row * 4 + col;
                          
                          // Limit targetIndex to array bounds
                          targetIndex = Math.min(installedApps.length - 1, Math.max(0, targetIndex));
                          
                          if (targetIndex !== index) {
                            const newList = [...installedApps];
                            const [movedItem] = newList.splice(index, 1);
                            newList.splice(targetIndex, 0, movedItem);
                            setInstalledApps(newList);
                          }
                        }}
                        onDragEnd={(_, info) => {
                          if (!isJiggling) return;
                          // Check if dragged to dock (bottom of screen)
                          // Screen height is 812, dock is at bottom ~700
                          if (info.point.y > 680 && dockApps.length < 4) {
                            setInstalledApps(prev => prev.filter(a => a !== id));
                            setDockApps(prev => [...prev, id]);
                          }
                        }}
                        className="touch-none"
                      >
                        <AppIcon 
                          id={id} 
                          label={appNames[id]} 
                          color={getIconColor(id)} 
                          icon={getIconElement(id)} 
                          isDarkMode={isDarkMode}
                          isJiggling={isJiggling}
                          customSrc={customIcons[id]} 
                          onClick={() => openApp(id)} 
                          onRemove={() => removeApp(id)}
                        />
                      </motion.div>
                    ))}
                    {/* Add App Button */}
                    {isJiggling && (
                      <motion.div 
                        key="add-btn"
                        layout
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsAddingApp(true); }}
                          className="w-[62px] h-[62px] rounded-[15px] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white active:scale-90 transition-transform"
                        >
                          <Plus size={32} />
                        </button>
                        <span className="text-[11px] font-medium text-white">加入</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Stop Jiggle Button if active */}
              {isJiggling && (
                <div className="absolute top-14 right-6 z-[200]">
                  <button onClick={() => setIsJiggling(false)} className="bg-white/20 backdrop-blur-xl px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20 active:opacity-50">完成</button>
                </div>
              )}

              {/* Add App Modal */}
              <AnimatePresence>
                {isAddingApp && (
                  <motion.div 
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md z-[300] flex flex-col pt-20 px-6 rounded-t-[40px]"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-white">App 資料庫</h2>
                      <button onClick={() => setIsAddingApp(false)} className="text-[#76DE84] font-bold">取消</button>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {(Object.keys(appNames) as AppId[]).filter(id => !installedApps.includes(id) && !dockApps.includes(id)).map(id => (
                        <div key={id} onClick={() => addApp(id)} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-all">
                          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-white overflow-hidden shadow-lg">
                            {customIcons[id] ? <img src={customIcons[id]} className="w-full h-full object-cover" /> : (
                              <div className="flex flex-col items-center">
                                {id === 'store' && <ShoppingBag size={28} />}
                                {id === 'messages' && <MessageCircle size={28} />}
                                {id === 'kitchen' && <UtensilsCrossed size={28} />}
                                {id === 'wallet' && <WalletIcon size={28} />}
                                {id === 'garden' && <Leaf size={28} />}
                                {id === 'photos' && <Mail size={28} />}
                                {id === 'characters' && <Users size={28} />}
                                {id === 'warehouse' && <Archive size={28} />}
                                {id === 'fishing' && <FishIcon size={28} />}
                                {id === 'wheel' && <Disc size={28} />}
                                {id === 'dex' && <BookOpen size={28} />}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-white/80">{appNames[id] || id}</span>
                        </div>
                      ))}
                    </div>
                    {(installedApps.length + dockApps.length) === 6 && (
                      <div className="mt-20 text-center text-white/40 text-sm">所有 App 都已加入主畫面</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Dock */}
              <div className={`absolute bottom-6 left-3 right-3 h-[90px] ${isDarkMode ? 'bg-black/30' : 'bg-white/20'} backdrop-blur-3xl rounded-[35px] flex items-center justify-center p-2 border border-white/20 gap-3 z-30`}>
                <div 
                  className="flex items-center gap-3"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="popLayout">
                    {dockApps.map((id, index) => (
                      <motion.div 
                        key={id} 
                        layout
                        layoutId={id}
                        drag={isJiggling}
                        dragListener={isJiggling}
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.9}
                        whileDrag={{ 
                          scale: 1.2, 
                          zIndex: 50,
                          transition: { duration: 0.1 }
                        }}
                        onDrag={(_, info) => {
                          if (!isJiggling) return;
                          
                          // Dock reordering logic (horizontal)
                          // Dock items are roughly 60px wide + 12px gap
                          const targetIndex = Math.min(dockApps.length - 1, Math.max(0, Math.floor((info.point.x - 40) / 75)));
                          
                          if (targetIndex !== index) {
                            const newList = [...dockApps];
                            const [movedItem] = newList.splice(index, 1);
                            newList.splice(targetIndex, 0, movedItem);
                            setDockApps(newList);
                          }
                        }}
                        onDragEnd={(_, info) => {
                          if (!isJiggling) return;
                          if (info.point.y < 600) {
                            setInstalledApps(prev => [...prev, id]);
                            setDockApps(prev => prev.filter(a => a !== id));
                          }
                        }}
                        className="touch-none"
                      >
                        <AppIcon 
                          id={id} 
                          label="" 
                          color={getIconColor(id)} 
                          icon={getIconElement(id)} 
                          isDarkMode={isDarkMode}
                          isJiggling={isJiggling}
                          customSrc={customIcons[id]} 
                          onClick={() => openApp(id)} 
                          onRemove={() => removeDockApp(id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {screenState === ScreenState.AppOpen && (
            <motion.div key="app" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="flex-1 flex flex-col bg-white z-50 rounded-t-[40px] overflow-hidden">
              {renderAppContent()}
              <div onClick={goHome} className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-black/10 rounded-full z-[100] cursor-pointer hover:bg-black/20" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation Indicator Overlay for Home Screen */}
        {screenState === ScreenState.Home && (
          <div onClick={goHome} className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/40 rounded-full z-[100] cursor-pointer hover:bg-white/60 transition-colors" />
        )}
      </div>
    </div>
  );
}

const ProfileInput = ({ label, value, isDark, onChange }: { label: string, value: string, isDark: boolean, onChange: (v: string) => void }) => (
  <div className="px-5 py-3 flex items-center"><span className="w-20 text-sm font-medium">{label}</span>
    <input className={`flex-1 text-sm outline-none bg-transparent ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} value={value} onChange={e => onChange(e.target.value)} placeholder={`請輸入${label}`} /></div>
);

const WallpaperThumb = ({ label, src, onClick }: { label: string, src: string, onClick: () => void }) => (
  <div className="flex flex-col items-center gap-2 text-black"><span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{label}</span>
    <div className="w-24 h-48 bg-neutral-200 rounded-xl overflow-hidden border-2 border-white shadow-sm relative group cursor-pointer" onClick={onClick}>
      <img src={src} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Plus /></div></div></div>
);

const SettingsRow = ({ icon, iconBg, label, onClick }: { icon: React.ReactNode, iconBg: string, label: string, onClick: () => void }) => (
  <div onClick={onClick} className="px-5 py-3 flex items-center gap-3 cursor-pointer active:bg-neutral-800/10 transition-colors">
    <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center" style={{ backgroundColor: iconBg }}>{icon}</div>
    <span className="flex-1 font-medium text-sm">{label}</span><ChevronRight className="text-neutral-400" size={16} /></div>
);

interface AppIconProps {
  id: AppId;
  label: string;
  color: string;
  icon: React.ReactNode;
  isDarkMode: boolean;
  isJiggling?: boolean;
  customSrc?: string;
  onClick: () => void;
  onRemove: () => void;
}

const AppIcon = ({ id, label, color, icon, isDarkMode, isJiggling, customSrc, onClick, onRemove }: AppIconProps) => (
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
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-sm z-20"
      >
        <Plus size={14} className="rotate-45" />
      </button>
    )}
  </div>
);


