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
  User,
  Moon
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
  { name: '经典深蓝', css: 'background: linear-gradient(135deg, #007AFF, #0056b3); color: white; border-radius: 18px 18px 2px 18px; border: none; shadow: none;' },
  { name: '浪漫粉嫩', css: 'background: linear-gradient(135deg, #FF9A9E, #FAD0C4); color: white; border-radius: 18px 18px 2px 18px; border: none; shadow: none;' },
  { name: '极简透白', css: 'background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: inherit; border-radius: 18px;' },
  { name: '霓虹电绿', css: 'background: #000; color: #39FF14; border: 2px solid #39FF14; box-shadow: 0 0 8px #39FF14; font-weight: bold; border-radius: 10px;' },
  { name: '工业炭黑', css: 'background: #1c1c1e; border: 1px solid #3a3a3c; color: #fff; border-radius: 15px;' },
  { name: '优雅淡紫', css: 'background: #E6E6FA; color: #4B0082; border: 1px solid #D8BFD8; border-radius: 20px;' },
  { name: '复古牛皮', css: 'background: #f5deb3; color: #5d4037; border: 1px solid #d2b48c; border-radius: 4px;' },
  { name: '玻璃拟态', css: 'background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);' }
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
enum Language { ZH_CN = 'zh-CN', EN = 'en', JA = 'ja' }

const TRANSLATIONS = {
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
  rarity: '一般' | '稀有' | '史诗' | '传说';
  icon: string;
}

interface Trash {
  name: string;
  icon: string;
  priceRange: [number, number];
}

const FISH_TYPES: Fish[] = [
  { id: 'f1', name: '孔雀鱼', rarity: '一般', icon: '🐟' }, { id: 'f2', name: '吴郭鱼', rarity: '一般', icon: '🐟' },
  { id: 'f3', name: '秋刀鱼', rarity: '一般', icon: '🐟' }, { id: 'f4', name: '沙丁鱼', rarity: '一般', icon: '🐟' },
  { id: 'f5', name: '鲭鱼', rarity: '一般', icon: '🐟' }, { id: 'f6', name: '白带鱼', rarity: '一般', icon: '🐟' },
  { id: 'f7', name: '虱目鱼', rarity: '一般', icon: '🐟' }, { id: 'f8', name: '鲤鱼', rarity: '一般', icon: '🐟' },
  { id: 'f9', name: '黑鲔鱼', rarity: '一般', icon: '🐟' }, { id: 'f10', name: '鲈鱼', rarity: '一般', icon: '🐟' },
  { id: 'f11', name: '小丑鱼', rarity: '一般', icon: '🐠' }, { id: 'f12', name: '比目鱼', rarity: '一般', icon: '🐟' },
  { id: 'f13', name: '鲶鱼', rarity: '一般', icon: '🐟' }, { id: 'f14', name: '草鱼', rarity: '一般', icon: '🐟' },
  { id: 'f15', name: '黄鱼', rarity: '一般', icon: '🐟' },
  { id: 'f16', name: '石斑鱼', rarity: '稀有', icon: '🐡' }, { id: 'f17', name: '旗鱼', rarity: '稀有', icon: '🦈' },
  { id: 'f18', name: '曼波鱼', rarity: '稀有', icon: '🐡' }, { id: 'f19', name: '河豚', rarity: '稀有', icon: '🐡' },
  { id: 'f20', name: '剑鱼', rarity: '稀有', icon: '🦈' }, { id: 'f21', name: '鲷鱼', rarity: '稀有', icon: '🐟' },
  { id: 'f22', name: '海马', rarity: '稀有', icon: '🐉' }, { id: 'f23', name: '魟鱼', rarity: '稀有', icon: '🐟' },
  { id: 'f24', name: '章鱼', rarity: '稀有', icon: '🐙' }, { id: 'f25', name: '乌贼', rarity: '稀有', icon: '🦑' },
  { id: 'f26', name: '大白鲨', rarity: '史诗', icon: '🦈' }, { id: 'f27', name: '虎鲸', rarity: '史诗', icon: '🫍' },
  { id: 'f28', name: '鲸鲨', rarity: '史诗', icon: '🦈' }, { id: 'f29', name: '抹香鲸', rarity: '史诗', icon: '🐳' },
  { id: 'f30', name: '皇带鱼', rarity: '史诗', icon: '🐉' },
  { id: 'f31', name: '黄金龙鱼', rarity: '传说', icon: '🐉' }, { id: 'f32', name: '深海大王鱿鱼', rarity: '传说', icon: '🦑' }
];

const TRASH_TYPES: Trash[] = [
  { name: '破旧的袜子', icon: '🧦', priceRange: [1, 2] },
  { name: '鱼骨头', icon: '🦴', priceRange: [1, 3] },
  { name: '破鞋子', icon: '👞', priceRange: [1, 2] },
  { name: '湿透的帽子', icon: '🧢', priceRange: [1, 3] },
  { name: '空铝罐', icon: '🥫', priceRange: [1, 2] },
  { name: '生锈的铁罐', icon: '🛢️', priceRange: [1, 3] },
  { name: '海草纠缠的树枝', icon: '🌿', priceRange: [1, 2] }
];

interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
}

const POSSIBLE_GIFTS: Gift[] = [
  { id: 'g1', name: '鲜花', icon: '🌹', price: 50 },
  { id: 'g2', name: '巧克力', icon: '🍫', price: 80 },
  { id: 'g3', name: '泰迪熊', icon: '🧸', price: 200 },
  { id: 'g4', name: '钻石', icon: '💎', price: 1000 },
  { id: 'g5', name: '游戏机', icon: '🎮', price: 500 },
  { id: 'g6', name: '精装书', icon: '📚', price: 120 },
  { id: 'g7', name: '高级茶叶', icon: '🍵', price: 150 },
  { id: 'g8', name: '调色盘', icon: '🎨', price: 100 },
  { id: 'g9', name: '围巾', icon: '🧣', price: 180 },
  { id: 'g10', name: '运动鞋', icon: '👟', price: 250 },
  { id: 'g11', name: '墨镜', icon: '🕶', price: 90 },
  { id: 'g12', name: '手表', icon: '⌚', price: 400 },
  { id: 'g13', name: '戒指', icon: '💍', price: 800 },
  { id: 'g14', name: '吉他', icon: '🎸', price: 350 },
  { id: 'g15', name: '相机', icon: '📸', price: 450 },
  { id: 'g16', name: '香氛蜡烛', icon: '🕯️', price: 70 },
  { id: 'g17', name: '精致蛋糕', icon: '🍰', price: 60 },
  { id: 'g18', name: '红酒', icon: '🍷', price: 300 },
  { id: 'g19', name: '拼图', icon: '🧩', price: 40 },
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
  { id: 'c1', name: '小麦', icon: '🌾', growthTime: 1, sellPrice: 50 },
  { id: 'c2', name: '玉米', icon: '🌽', growthTime: 2, sellPrice: 80 },
  { id: 'c3', name: '红萝卜', icon: '🥕', growthTime: 3, sellPrice: 120 },
  { id: 'c4', name: '番茄', icon: '🍅', growthTime: 4, sellPrice: 150 },
  { id: 'c5', name: '土豆', icon: '🥔', growthTime: 5, sellPrice: 200 },
  { id: 'c6', name: '茄子', icon: '🍆', growthTime: 6, sellPrice: 250 },
  { id: 'c7', name: '南瓜', icon: '🎃', growthTime: 7, sellPrice: 300 },
  { id: 'c8', name: '菠萝', icon: '🍍', growthTime: 8, sellPrice: 350 },
  { id: 'c9', name: '西瓜', icon: '🍉', growthTime: 9, sellPrice: 400 },
  { id: 'c10', name: '葡萄', icon: '🍇', growthTime: 10, sellPrice: 450 },
  { id: 'c11', name: '草莓', icon: '🍓', growthTime: 11, sellPrice: 500 },
  { id: 'c12', name: '车厘子', icon: '🍒', growthTime: 12, sellPrice: 550 },
  { id: 'c13', name: '蜜桃', icon: '🍑', growthTime: 13, sellPrice: 600 },
  { id: 'c14', name: '芒果', icon: '🥭', growthTime: 14, sellPrice: 650 },
  { id: 'c15', name: '柠檬', icon: '🍋', growthTime: 15, sellPrice: 700 },
  { id: 'c16', name: '梨子', icon: '🍐', growthTime: 16, sellPrice: 750 },
  { id: 'c17', name: '苹果', icon: '🍎', growthTime: 17, sellPrice: 800 },
  { id: 'c18', name: '奇异果', icon: '🥝', growthTime: 18, sellPrice: 850 },
  { id: 'c19', name: '番薯', icon: '🍠', growthTime: 19, sellPrice: 900 },
  { id: 'c20', name: '椰子', icon: '🥥', growthTime: 20, sellPrice: 950 },
  { id: 'c21', name: '向日葵', icon: '🌻', growthTime: 10, sellPrice: 1000 },
  { id: 'c22', name: '玫瑰', icon: '🌹', growthTime: 12, sellPrice: 1200 },
  { id: 'c23', name: '郁金香', icon: '🌷', growthTime: 8, sellPrice: 900 },
  { id: 'c24', name: '蘑菇', icon: '🍄', growthTime: 5, sellPrice: 300 },
  { id: 'c25', name: '大蒜', icon: '🧄', growthTime: 6, sellPrice: 400 },
  { id: 'c26', name: '洋葱', icon: '🧅', growthTime: 6, sellPrice: 400 },
  { id: 'c27', name: '白菜', icon: '🥬', growthTime: 4, sellPrice: 300 },
  { id: 'c28', name: '花椰菜', icon: '🥦', growthTime: 7, sellPrice: 500 },
  { id: 'c29', name: '辣椒', icon: '🌶️', growthTime: 3, sellPrice: 200 },
  { id: 'c30', name: '黄瓜', icon: '🥒', growthTime: 5, sellPrice: 350 }
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
          content: `给 ${char?.name || '朋友'}：\n\n${content}`,
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
      alert(`${newLetters.length} 封信件已投递！`);
    }, 1000);
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-orange-50 text-amber-900' : 'bg-orange-50 text-amber-900'} overflow-hidden relative`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')]"></div>
      
      <div className="px-4 pt-16 pb-3 flex items-center justify-between border-b border-amber-200 z-10">
        <div className="flex gap-2">
          <button onClick={() => setTab('write')} className={`px-3 py-1 rounded-full text-xs font-bold ${tab === 'write' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-700'}`}>书信撰写</button>
          <button onClick={() => setTab('inbox')} className={`px-3 py-1 rounded-full text-xs font-bold ${tab === 'inbox' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-700'}`}>查看信箱</button>
        </div>
        <button onClick={goHome} className="text-amber-600 font-medium">关闭</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 z-10">
        {tab === 'write' ? (
          <div className="bg-white/60 p-6 rounded-lg shadow-sm border border-amber-100 flex flex-col min-h-[300px]">
            <span className="text-sm font-bold opacity-60 mb-2">收件人 (多选)：</span>
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
              placeholder="在此写下想说的话..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <button onClick={handleSendAll} className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-full font-bold">一键投递</button>
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
      else if (roll < 0.99) pool = FISH_TYPES.filter(f => f.rarity === '史诗');
      else pool = FISH_TYPES.filter(f => f.rarity === '传说');
      
      const fish = pool[Math.floor(Math.random() * pool.length)] || FISH_TYPES[0];
      onCatchFish(fish.id);
      setResultModal({ type: 'fish', msg: `钓到了 ${fish.name}!`, sub: `稀有度: ${fish.rarity}` });
    } else {
      // Catch trash
      const trash = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
      const coins = Math.floor(Math.random() * (trash.priceRange[1] - trash.priceRange[0] + 1)) + trash.priceRange[0];
      onCatchTrash(coins);
      setResultModal({ type: 'trash', msg: `钓到了 ${trash.name}`, sub: `获得了 ${coins} 金币` });
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-blue-950 text-white' : 'bg-blue-50 text-blue-900'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex items-center justify-between border-b ${isDarkMode ? 'border-blue-900' : 'border-blue-200'}`}>
        <h2 className="text-2xl font-bold flex items-center gap-2"><FishIcon /> 钓鱼</h2>
        <button onClick={goHome} className="text-[#76DE84] font-medium">关闭</button>
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
              开始钓鱼
            </button>
          )}
        </div>

        <p className="text-sm opacity-60 text-center px-6 z-10 font-medium">
          鱼标（🐟）到达中间 <span className="text-green-500 font-bold">绿色区块</span> 时点击「拉竿」！<br/>
          红色/橙色区块只会钓到垃圾（随机获得金币）。
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
              继续
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

  const rarities = ['一般', '稀有', '史诗', '传说'];
  const categorizedFish = rarities.reduce((acc, r) => {
    acc[r] = FISH_TYPES.filter(f => f.rarity === r);
    return acc;
  }, {} as Record<string, typeof FISH_TYPES>);

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-200'} bg-opacity-80 backdrop-blur-md z-10 sticky top-0`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen /> 图鉴</h2>
          <button onClick={goHome} className="text-[#76DE84] font-medium">关闭</button>
        </div>
        <div className={`flex p-1 rounded-xl w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-gray-200'}`}>
          <button 
            onClick={() => setActiveTab('fish')} 
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${activeTab === 'fish' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            鱼货
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
              if (rarity === '史诗') rarityColor = 'text-white bg-purple-500';
              if (rarity === '传说') rarityColor = 'text-white bg-orange-500';

              return (
                <div key={rarity} className={`rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} overflow-hidden`}>
                  <button 
                    onClick={() => setExpandedRarity(expandedRarity === rarity ? null : rarity)}
                    className={`w-full p-4 flex justify-between items-center ${rarityColor}`}
                  >
                    <span className="font-bold text-lg">{rarity}等级</span>
                    <span className="text-sm font-medium">{items.length} 种</span>
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
  { id: 'r1', name: '烤吴郭鱼', description: '外皮焦香的盐烤吴郭鱼，简单又美味的家常料理。', icon: '🐟', ingredients: [{ name: '吴郭鱼', amount: 1 }], type: 'fish' },
  { id: 'r2', name: '鲤鱼汤', description: '温补养生的鲤鱼熬汤，滋味鲜甜。', icon: '🍲', ingredients: [{ name: '鲤鱼', amount: 1 }], type: 'fish' },
  { id: 'r3', name: '盐烤鲭鱼', description: '富含油脂的鲭鱼，撒点盐巴烘烤就非常迷人。', icon: '🐠', ingredients: [{ name: '鲭鱼', amount: 1 }], type: 'fish' },
  { id: 'r4', name: '鲑鱼生鱼片', description: '新鲜肥美的鲑鱼切片，入口即化。', icon: '🍣', ingredients: [{ name: '鲑鱼', amount: 1 }], type: 'fish' },
  { id: 'r5', name: '鲔鱼肚', description: '上等鲔鱼肚肉，丰富的油脂让口感极佳。', icon: '🍱', ingredients: [{ name: '黑鲔鱼', amount: 1 }], type: 'fish' },
  { id: 'r6', name: '糖醋小丑鱼', description: '酸甜开胃的糖醋做法，鱼肉与番茄完美结合。', icon: '🥘', ingredients: [{ name: '小丑鱼', amount: 1 }, { name: '番茄', amount: 1 }], type: 'fish' },
  { id: 'r7', name: '皇带鱼汤', description: '稀有海产熬制的高级汤品，听说能带来好运。', icon: '🍲', ingredients: [{ name: '皇带鱼', amount: 1 }], type: 'fish' },
  { id: 'r8', name: '烤腔棘鱼', description: '活化石般的珍惜鱼类，用简单炭烤保留原始风味。', icon: '🍢', ingredients: [{ name: '腔棘鱼', amount: 1 }], type: 'fish' },
  { id: 'r19', name: '红烧石斑鱼', description: '入口即化的石斑鱼，搭配葱蒜红烧最是下饭。', icon: '🥘', ingredients: [{ name: '石斑鱼', amount: 1 }], type: 'fish' },
  { id: 'r20', name: '香煎旗鱼排', description: '口感如肉类的旗鱼排，挤上一点柠檬汁更清爽。', icon: '🥩', ingredients: [{ name: '旗鱼', amount: 1 }, { name: '柠檬', amount: 1 }], type: 'fish' },
  { id: 'r21', name: '凉拌曼波鱼', description: '富含胶质的曼波鱼皮，涼拌后口感爽脆滑溜。', icon: '🥣', ingredients: [{ name: '曼波鱼', amount: 1 }], type: 'fish' },
  { id: 'r22', name: '河豚生鱼片', description: '极致鲜美的珍馐，需经过高超技术处理的艺术料理。', icon: '🍱', ingredients: [{ name: '河豚', amount: 1 }], type: 'fish' },
  { id: 'r23', name: '章魚小丸子', description: 'Q弹章鱼塊沾上面糊烘烤，淋上蛋黄酱与柴鱼片。', icon: '🍡', ingredients: [{ name: '章鱼', amount: 1 }, { name: '小麦', amount: 1 }], type: 'fish' },
  { id: 'r24', name: '香酥炸乌贼圈', description: '外酥内嫩的黄金乌贼圈，配上特制蘸酱停不下來。', icon: '🍤', ingredients: [{ name: '乌贼', amount: 1 }], type: 'fish' },
  { id: 'r25', name: '清蒸鲈鱼', description: '以清蒸保留鲈鱼最原始的鲜甜，滋润养生。', icon: '🐟', ingredients: [{ name: '鲈鱼', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'fish' },
  { id: 'r26', name: '黄金龙鱼羹', description: '传说中能增加福气的高级料理，汤头如黄金般亮眼。', icon: '🍜', ingredients: [{ name: '黄金龙鱼', amount: 1 }], type: 'fish' },
  
  // Crop Recipes
  { id: 'r9', name: '面包', description: '用小麦研磨烘焙的金黄面包，香气扑鼻。', icon: '🍞', ingredients: [{ name: '小麦', amount: 2 }], type: 'crop' },
  { id: 'r10', name: '烤玉米', description: '刷上特制酱料烤到微焦的玉米，夜市经典美味。', icon: '🌽', ingredients: [{ name: '玉米', amount: 1 }], type: 'crop' },
  { id: 'r11', name: '红萝卜汁', description: '现榨新鲜红萝卜汁，健康又营养满分。', icon: '🥕', ingredients: [{ name: '红萝卜', amount: 1 }], type: 'crop' },
  { id: 'r12', name: '番茄汤', description: '浓郁酸甜的番茄熬汤，开胃好选择。', icon: '🥣', ingredients: [{ name: '番茄', amount: 2 }], type: 'crop' },
  { id: 'r13', name: '烤土豆', description: '带皮烤熟的松软土豆，搭配奶油最对味。', icon: '🥔', ingredients: [{ name: '土豆', amount: 1 }], type: 'crop' },
  { id: 'r14', name: '南瓜汤', description: '颜色金黄的浓郁南瓜汤，口感滑顺香甜。', icon: '🎃', ingredients: [{ name: '南瓜', amount: 1 }], type: 'crop' },
  { id: 'r15', name: '草莓果酱', description: '新鲜草莓熬煮的手工果酱，搭配面包最合适。', icon: '🍓', ingredients: [{ name: '草莓', amount: 2 }], type: 'crop' },
  { id: 'r16', name: '苹果派', description: '酸甜苹果馅配上酥脆派皮，经典的下午茶甜点。', icon: '🥧', ingredients: [{ name: '苹果', amount: 1 }, { name: '小麦', amount: 1 }], type: 'crop' },
  { id: 'r17', name: '西瓜汁', description: '冰透的西瓜打成汁，夏日解暑最佳良伴。', icon: '🍉', ingredients: [{ name: '西瓜', amount: 1 }], type: 'crop' },
  { id: 'r18', name: '蒜炒白菜', description: '爆香大蒜与清脆白菜的快炒，简单美味。', icon: '🥗', ingredients: [{ name: '白菜', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'crop' },
  { id: 'r27', name: '鱼香茄子', description: '茄子软嫩入味，虽无实鱼卻有浓厚鲜香味。', icon: '🍆', ingredients: [{ name: '茄子', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'crop' },
  { id: 'r28', name: '蜜汁菠萝酥', description: '菠萝与小麦制作的经典点心，甜而不腻。', icon: '🍍', ingredients: [{ name: '菠萝', amount: 1 }, { name: '小麦', amount: 1 }], type: 'crop' },
  { id: 'r29', name: '车厘子慕斯', description: '点缀著新鲜车厘子的精致慕斯，酸甜诱人。', icon: '🍒', ingredients: [{ name: '车厘子', amount: 1 }], type: 'crop' },
  { id: 'r30', name: '草莓蜜桃塔', description: '草莓与蜜桃的完美组合，充满少女心。', icon: '🥧', ingredients: [{ name: '草莓', amount: 1 }, { name: '蜜桃', amount: 1 }], type: 'crop' },
  { id: 'r31', name: '柠檬乳酪蛋糕', description: '清新的柠檬香气搭配浓郁乳酪，口感绵密。', icon: '🍰', ingredients: [{ name: '柠檬', amount: 1 }, { name: '小麦', amount: 1 }], type: 'crop' },
  { id: 'r32', name: '向日葵种子饼', description: '酥脆的谷物小食，营养又富有口感。', icon: '🍪', ingredients: [{ name: '向日葵', amount: 1 }, { name: '小麦', amount: 1 }], type: 'crop' },
  { id: 'r33', name: '奶油蘑菇浓汤', description: '香浓的奶油带出蘑菇的野味精华。', icon: '🥣', ingredients: [{ name: '蘑菇', amount: 2 }], type: 'crop' },
  { id: 'r34', name: '涼拌手拍小黃瓜', description: '爽脆清润，是夏日最棒的开胃凉菜。', icon: '🥒', ingredients: [{ name: '黃瓜', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'crop' },
  { id: 'r35', name: '烤番薯', description: '简单烘烤即出的甜蜜香气，温暖人心。', icon: '🍠', ingredients: [{ name: '番薯', amount: 1 }], type: 'crop' },
  { id: 'r36', name: '芒果沙拉', description: '新鲜芒果切丁拌入蔬果，充满热带气息。', icon: '🥗', ingredients: [{ name: '芒果', amount: 1 }], type: 'crop' },
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
            <h2 className="text-2xl font-bold flex items-center gap-2"><UtensilsCrossed /> 料理制作</h2>
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
                        库存: {inventory.total}
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
              制作料理
            </button>
          </div>
        </div>

        {showGiftModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl p-6 ${isDarkMode ? 'bg-[#2a1a0f]' : 'bg-white'} shadow-2xl`}>
              <h3 className="text-xl font-bold text-center mb-4">要把做好的【{selectedRecipe.name}】送给谁？</h3>
              {characters.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">目前还没有认识的角色哦！</p>
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
                        <div className="text-[10px] opacity-40 italic mb-1">將料理赠送给</div>
                        <div className="font-bold text-lg text-amber-900 dark:text-amber-200">{c.name}</div>
                        <div className="text-xs text-pink-500 font-bold">💖 当前好感度: {c.favorability}</div>
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
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-[#e0c9a3]' : 'text-[#8b4513]'}`}><UtensilsCrossed /> 食谱</h2>
          <button onClick={goHome} className="text-[#76DE84] font-medium">关闭</button>
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col items-center justify-center relative ${isDarkMode ? 'bg-[#1a1510]' : 'bg-[#f4e4bc]/50'}`}>
        <div className={`w-full max-w-2xl h-[90%] relative shadow-2xl rounded-sm flex ring-1 ${isDarkMode ? 'bg-[#2a1a08] ring-black' : 'bg-[#fdf5e6] ring-amber-900/10'}`}>
          {/* Middle spine shadow */}
          <div className="absolute inset-y-0 left-1/2 w-8 -ml-4 bg-gradient-to-r from-black/5 via-black/10 to-black/5 z-10 pointer-events-none"></div>
          
          {/* Left Page */}
          <div className={`flex-1 p-3 sm:p-6 border-r relative overflow-y-auto page-scroll ${isDarkMode ? 'border-[#3a2a18]' : 'border-[#d4c49c]/50'}`}>
             <h3 className={`text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 border-b-2 border-dashed pb-2 ${isDarkMode ? 'text-[#cba677] border-[#cba677]/30' : 'text-[#8b4513] border-[#8b4513]/30'}`}>
               {currentPage === 0 ? '鱼货料理' : '作物料理'}
             </h3>
             <div className="space-y-2">
               {leftCol.map(renderRecipe)}
             </div>
          </div>
          
          {/* Right Page */}
          <div className="flex-1 p-3 sm:p-6 relative overflow-y-auto page-scroll">
             <h3 className={`text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 border-b-2 border-dashed pb-2 ${isDarkMode ? 'text-[#cba677] border-[#cba677]/30' : 'text-[#8b4513] border-[#8b4513]/30'}`}>
               {currentPage === 0 ? '更多海宝' : '更多珍馐'}
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
      addTransaction('expense', price, `购买 ${name}`);
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
              目前拥有: {ownedAmount}
            </div>
          </div>

          <div className={`w-full p-6 rounded-[32px] ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} shadow-sm space-y-6`}>
            {!isGift ? (
              <>
                <div className="flex flex-col items-center gap-4">
                  <span className="text-xs font-bold opacity-30 uppercase tracking-widest">贩售单价: ${selectedItem.price}</span>
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
                    <span className="text-sm font-bold opacity-40">总收益估计</span>
                    <span className="text-2xl font-black text-[#76DE84]">${selectedItem.price * (parseInt(sellAmount) || 0)}</span>
                  </div>
                  <button 
                    disabled={ownedAmount === 0 || !sellAmount || parseInt(sellAmount) === 0}
                    onClick={() => {
                      const amount = parseInt(sellAmount);
                      const totalPrice = selectedItem.price * amount;
                      setWalletBalance((p: number) => p + totalPrice);
                      addTransaction('income', totalPrice, `贩售 ${amount} 个 ${selectedItem.name}`);
                      setWarehouseItems((prev: any) => {
                        return prev.map((i: any) => i.id === selectedItem.id ? { ...i, amount: i.amount - amount } : i).filter((i: any) => i.amount > 0);
                      });
                      setSelectedItem(null);
                      setSellAmount('1');
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-xl transition-all active:scale-95 ${ownedAmount === 0 ? 'bg-neutral-300 text-neutral-500 opacity-50' : 'bg-[#76DE84] text-white shadow-lg'}`}
                  >
                    立即贩售
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold opacity-30 uppercase tracking-widest">购买价格</span>
                  <div className="text-4xl font-black text-[#FF2D55]">${selectedItem.price}</div>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold opacity-40 border-l-2 border-[#FF2D55] pl-2">选择赠送对象</span>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {characters.map((char: Character) => (
                      <button 
                        key={char.id}
                        onClick={() => {
                          if (walletBalance >= selectedItem.price) {
                            setWalletBalance((p: number) => p - selectedItem.price);
                            addTransaction('expense', selectedItem.price, `购买 ${selectedItem.name} 赠送给 ${char.name}`);
                            const favorGain = Math.ceil(selectedItem.price / 10);
                            setCharacters((prev: any) => prev.map((c: any) => c.id === char.id ? { 
                              ...c, 
                              favorability: (c.favorability || 0) + favorGain,
                              messages: [...c.messages, { role: 'user', text: `[收到礼物] ${selectedItem.icon} ${selectedItem.name}` }]
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
                        <div className="text-[9px] opacity-40 italic">赠送给</div>
                        <div className="truncate w-full text-center">{char.name}</div>
                      </button>
                    ))}
                    {characters.length === 0 && <div className="col-span-2 py-4 text-center text-xs opacity-40">尚无角色可赠送</div>}
                  </div>
                  
                  {walletBalance < selectedItem.price && (
                    <p className="text-center text-[10px] text-red-500 font-bold">余额不足</p>
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
              {cat === 'fish' ? '鲜鱼' : cat === 'crops' ? '作物' : '礼物'}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold border-l-4 border-[#76DE84] pl-3 text-sm">
              {activeCategory === 'fish' ? '每日鱼货' : activeCategory === 'crops' ? '鲜采作物' : '精选礼物'}
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
                  {activeCategory === 'gifts' ? '点击购买' : '点击贩售'}
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
            钱包
          </h2>
          <button onClick={goHome} className="text-[#76DE84] font-medium">关闭</button>
        </div>
        
        <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm flex flex-col items-center justify-center gap-2 border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
          <span className="text-xs font-bold opacity-40 uppercase tracking-widest">目前余额</span>
          <div className="text-5xl font-black text-[#5856D6] tracking-tighter">
            ${walletBalance}
          </div>
          <div className="px-3 py-1 bg-[#5856D6]/10 text-[#5856D6] rounded-full text-[10px] font-bold mt-2">
            AI 经济系统已启用
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveApp('messages')}
            className={`flex-1 py-3 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} shadow-sm flex items-center justify-center gap-2 group active:scale-95 transition-transform`}
          >
            <div className="w-6 h-6 rounded-full bg-[#AF52DE] flex items-center justify-center text-white"><Send size={12} /></div>
            <span className="text-xs font-bold">立即转账</span>
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
            交易纪录
          </h3>
          <span className="text-[10px] opacity-30 font-mono">HISTORY</span>
        </div>
        
        {transactions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-20 gap-4">
            <WalletIcon size={48} />
            <p className="text-sm font-bold">尚无任何交易纪录</p>
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

  const rarities = ['一般', '稀有', '史诗', '传说'];
  const getFishPrice = (rarity: string) => {
    switch(rarity) {
      case '一般': return 100;
      case '稀有': return 500;
      case '史诗': return 2000;
      case '传说': return 10000;
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
          <h2 className="text-2xl font-bold flex items-center gap-2"><Archive /> 仓库</h2>
          <button onClick={goHome} className="text-[#76DE84] font-medium">关闭</button>
        </div>
        <div className={`flex p-1 rounded-xl w-full gap-1 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-gray-200'} overflow-x-auto whitespace-nowrap`}>
          <button 
            onClick={() => setActiveTab('fish')} 
            className={`flex-1 min-w-[60px] py-1.5 text-sm font-medium rounded-lg ${activeTab === 'fish' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            鱼货
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
            礼物
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'fish' && (
          fishItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
              <Archive size={48} />
              <p>沒有鱼货，快去钓鱼吧！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rarities.map(rarity => {
                const items = categorizedFish[rarity];
                if (items.length === 0) return null;
                
                let rarityColor = 'text-white bg-gray-500';
                if (rarity === '稀有') rarityColor = 'text-white bg-blue-500';
                if (rarity === '史诗') rarityColor = 'text-white bg-purple-500';
                if (rarity === '传说') rarityColor = 'text-white bg-orange-500';

                return (
                  <div key={rarity} className={`rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} overflow-hidden`}>
                    <button 
                      onClick={() => setExpandedRarity(expandedRarity === rarity ? null : rarity)}
                      className={`w-full p-4 flex justify-between items-center ${rarityColor}`}
                    >
                      <span className="font-bold text-lg">{rarity}等级</span>
                      <span className="text-sm font-medium">{items.length} 种</span>
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
              <p>沒有作物，快去花园种植吧！</p>
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
              <p>沒有收集到素材哦...</p>
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
              <p>还没收到过赠礼哦...</p>
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
          <h2 className="font-bold text-lg">设定 {activeGroup.name}</h2>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
               <label className="text-xs font-black uppercase tracking-wider opacity-40">封面图片</label>
               <button 
                 onClick={() => momentGroupCoverInputRef.current?.click()}
                 className="text-[10px] font-bold bg-[#76DE84] text-white px-3 py-1 rounded-full shadow-sm active:scale-95 transition-transform"
               >
                 更换封面
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
            <label className="text-xs font-bold opacity-50 pl-2">朋友圈名称</label>
            <input 
              className={`w-full px-4 py-3 rounded-xl outline-none ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} shadow-sm`}
              value={activeGroup.name}
              onChange={e => setMomentGroups((prev: any) => prev.map((g: any) => g.id === activeGroupId ? { ...g, name: e.target.value } : g))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold opacity-50 pl-2">允许加入的角色</label>
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
        <button onClick={goHome} className="text-[#76DE84] font-medium z-10 w-16">主画面</button>
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
                  <SettingsIcon size={16} /> 朋友圈设定
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
                placeholder="分享新鲜事..."
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
               发布
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
                          placeholder="评论..."
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
                          发送
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
        <h2 className="text-2xl font-black flex items-center gap-2"><Leaf className="text-emerald-500" /> <span style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>种植花园</span></h2>
        <button onClick={goHome} className="text-[#76DE84] font-bold bg-[#76DE84]/10 px-3 py-1.5 rounded-full text-sm">关闭</button>
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
                      <span className="text-xs font-bold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">300金币解锁</span>
                    </button>
                  )}
                  {patch.status === 'empty' && (
                    <button onClick={() => onPlant(patch.id)} className="text-center group flex flex-col items-center justify-center h-full w-full">
                      <div className="bg-white/20 p-4 rounded-full mb-2 group-active:scale-95 transition-transform backdrop-blur-sm border border-white/30 shadow-sm">
                        <Plus size={32} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">种植作物</span>
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
                       <span className="text-xs font-bold text-white bg-emerald-500/90 px-3 py-1 rounded-full mt-2 shadow-sm border border-white/20 whitespace-nowrap">点击收成!</span>
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
        addTransaction('expense', penalty, `玩 UNO 输了`);
      } else {
        setCharacters(prev => prev.map(c => c.id === loser.id ? { ...c, walletBalance: Math.max(0, (c.walletBalance || 0) - penalty) } : c));
      }

      // add to winner
      if (player.id === 'user') {
        setWalletBalance(prev => prev + penalty);
        addTransaction('income', penalty, `玩 UNO 赢了`);
      } else {
        setCharacters(prev => prev.map(c => c.id === player.id ? { ...c, walletBalance: (c.walletBalance || 0) + penalty } : c));
      }

      setUnoWinner(`${player.name} 获胜！${loser.name} 输给贏家 $${penalty}`);
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
        addTransaction('expense', penalty, `抽鬼牌输了`);
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

      setOmWinner(`${loser.name} 是大输家 (扣除 $${penalty})`);
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
  const TOPICS = ['苹果', '跑步', '刷牙', '超人', '钢琴', '大象', '煮饭', '睡觉', '游泳', '猫咪'];
  
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
    setCharadesChat([{ author: '系统', text: `第 ${round}/10 回合开始！描述者是 ${players[descIdx].name}。` }]);
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
      addTransaction('expense', penalty, `你说我猜输了`);
    } else {
      setCharacters(prev => prev.map(c => c.id === loser.id ? { ...c, walletBalance: Math.max(0, (c.walletBalance || 0) - penalty) } : c));
    }

    if (winner.id === 'user') {
      setWalletBalance(prev => prev + penalty);
      addTransaction('income', penalty, `你说我猜贏了`);
    } else {
      setCharacters(prev => prev.map(c => c.id === winner.id ? { ...c, walletBalance: (c.walletBalance || 0) + penalty } : c));
    }

    setCharadesWinner(`${winner.name} 获胜！猜中 ${maxScore} 题。\n${loser.name} 输给贏家 $${penalty}。`);
    setGameState('ended');
  };

const simulateAiDescriber = async (char: GamePlayer, topic: string) => {
    const charData = characters.find(c => c.id === char.id);
    const systemPrompt = `你现在扮演一个角色：${charData?.name}。背景性格：${charData?.personality}。
你正在和朋友玩「你说我猜」。题目是：${topic}。
请用你的性格和说法描述这个题目，但绝对不能提到「${topic}」以及包含在里面的字。
长度约10-20个字。保持口吻。不要输出引号。`;
    
    try {
      // 改用傳進來的 callUniversalAI 函數
      const text = await callUniversalAI([], systemPrompt);
      if (text) {
        setCharadesChat(prev => [...prev, { author: char.name, text: text.trim() }]);
      }
    } catch (e) {
      console.error("Game AI Error:", e);
      setCharadesChat(prev => [...prev, { author: char.name, text: `提示：这跟「${topic[0]}」开头的東西有关哦... (连线失败)` }]);
    }
  };

  const handleCharadesGuess = async (text: string) => {
    setCharadesChat(prev => [...prev, { author: userProfile.name, text }]);
    setCharadesInput('');

    if (text === charadesTopic) {
      setCharadesScores(prev => ({ ...prev, 'user': (prev['user'] || 0) + 1 }));
      setCharadesChat(prev => [...prev, { author: '系统', text: `恭喜！猜对了！答案是 ${charadesTopic}。` }]);
      setTimeout(() => {
        const nextIdx = (charadesDescriberIdx + 1) % charadesPlayers.length;
        setCharadesDescriberIdx(nextIdx);
        startNewRound(nextIdx, charadesPlayers, charadesRound + 1);
      }, 3000);
    } else {
      // AI check guess
      setTimeout(() => {
        setCharadesChat(prev => [...prev, { author: '系统', text: "不对哦，再猜猜看！" }]);
      }, 1000);
    }
  };

  const handleCharadesDescribe = (text: string) => {
    setCharadesChat(prev => [...prev, { author: userProfile.name, text }]);
    setCharadesInput('');
    // System checks if user leaked
    if (text.includes(charadesTopic)) {
      setCharadesChat(prev => [...prev, { author: '系統', text: "哎呀！你提到题目了，这回合沒人猜中！" }]);
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
             setCharadesChat(prev => [...prev, { author: '系统', text: `${randomChar.name} 猜对了！答案是 ${charadesTopic}。` }]);
             setTimeout(() => {
               const nextIdx = (charadesDescriberIdx + 1) % charadesPlayers.length;
               setCharadesDescriberIdx(nextIdx);
               startNewRound(nextIdx, charadesPlayers, charadesRound + 1);
             }, 3000);
          }, 500);
        } else {
          setCharadesChat(prev => [...prev, { author: randomChar.name, text: '是...什么啊？' }]);
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
                  <div className="text-red-200 text-xs font-bold uppercase tracking-widest mt-1">经典卡牌对决</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white"><Play fill="currentColor" /></div>
              </button>

              <button 
                onClick={() => setActiveGame('oldmaid')}
                className="bg-indigo-600 hover:bg-indigo-700 p-6 rounded-3xl shadow-[0_8px_0_#3730a3] active:translate-y-2 active:shadow-none transition-all flex items-center justify-between group"
              >
                <div className="text-left">
                  <div className="text-white font-black text-3xl italic">抽鬼牌</div>
                  <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">最强心理战</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white"><Ghost fill="currentColor" /></div>
              </button>

              <button 
                onClick={() => setActiveGame('charades')}
                className="bg-amber-500 hover:bg-amber-600 p-6 rounded-3xl shadow-[0_8px_0_#92400e] active:translate-y-2 active:shadow-none transition-all flex items-center justify-between group"
              >
                <div className="text-left">
                  <div className="text-white font-black text-3xl italic">你说我猜</div>
                  <div className="text-amber-100 text-xs font-bold uppercase tracking-widest mt-1">表达与默契</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white"><MessageSquare fill="currentColor" /></div>
              </button>
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-30 mt-10">Select Your Game To Start</p>
          </div>
        )}

        {gameState === 'setup' && activeGame && (
          <div className="h-full p-6 flex flex-col items-center justify-center space-y-6">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">邀请伙伴 (1-3位)</h3>
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
                <span className="text-sm font-bold">托管模式 (由 AI 代打)</span>
                <span className="text-[10px] opacity-40">让角色们自主活动，您仅在旁观战</span>
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
                  {isAutoMode ? '🤖 自动托管中' : '🎮 手动控制'}
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
                {unoDirection === 1 ? '顺时针方向' : '逆时针方向'}
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
                  {isAutoMode ? '🤖 自动托管中' : '🎮 手动控制'}
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
              <div className="mb-4 text-xs font-bold opacity-40 uppercase">从邻居抽取一张牌：</div>
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
                  {isAutoMode ? '🤖 自动托管中' : '🎮 手动控制'}
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
                 <div key={idx} className={`flex flex-col ${chat.author === '系统' ? 'items-center' : chat.author === userProfile.name ? 'items-end' : 'items-start'}`}>
                   <div className="text-[10px] font-bold opacity-40 mb-1 px-2">{chat.author}</div>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm ${chat.author === '系统' ? 'bg-amber-100 text-amber-800 border border-amber-200 text-center italic' : chat.author === userProfile.name ? 'bg-indigo-600 text-white' : 'bg-white text-black'}`}>
                     {chat.text}
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-white border-t-4 border-neutral-200">
               {charadesPlayers[charadesDescriberIdx].id === 'user' ? (
                 <div className="space-y-4">
                   <div className="p-3 bg-red-500 text-white rounded-2xl text-center font-black italic">
                      题目：{charadesTopic}
                   </div>
                   <div className="flex gap-2">
                     <input 
                       className="flex-1 outline-none p-3 bg-neutral-100 rounded-2xl text-sm"
                       placeholder="描述你的题目..."
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
                     placeholder="你的猜测是..."
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

  const handleImageUpload = (callback: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // 限制只能選圖片
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // 檢查檔案大小（選配：建議不要超過 1MB，因為 Base64 很佔空間）
        if (file.size > 1024 * 1024) {
          alert("图片太大了，请选择小於 1MB 的照片以维持系统流畅。");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          callback(base64); // 把讀取完的圖片傳回去儲存
        };
        reader.readAsDataURL(file);
      }
    };
    input.click(); // 觸發點擊，打開手機的選擇選單
  };

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
    name: '使用者', 
    age: '20', 
    gender: '女', 
    avatar: '🥕', 
    signature: '早安午安晚安' 
  });

  const [walletBalance, setWalletBalance] = useState(300);
  const [characters, setCharacters] = useState<Character[]>([]);

// --- 存檔導出功能 ---
  const handleExportSave = () => {
    const saveData = {
      userProfile, walletBalance, characters, warehouseItems,
      transactions, customIcons, appNames, gardenPatches,
      letters, momentPosts, aiSettings
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phone_save_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- 存檔導入功能 ---
  const handleImportSave = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.userProfile) setUserProfile(data.userProfile);
            if (data.walletBalance !== undefined) setWalletBalance(data.walletBalance);
            if (data.characters) setCharacters(data.characters);
            if (data.warehouseItems) setWarehouseItems(data.warehouseItems);
            if (data.aiSettings) setAiSettings(data.aiSettings);
            alert("导入成功！");
          } catch (err) { alert("档案格式错误！"); }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

// --- API 相關狀態 ---
  const [aiSettings, setAiSettings] = useState<AISettings>({ 
    apiKey: '', 
    model: 'gemini-1.5-flash', 
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/' 
  });
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);

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
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);



  const addTransaction = (type: 'income' | 'expense' | 'transfer', amount: number, title: string) => {
    const newTx: Transaction = { id: Date.now().toString(), type, amount, title, timestamp: new Date().toLocaleString() };
    setTransactions(prev => [newTx, ...prev]);
  };

  // --- AI 機器人後台邏輯 (每分鐘運行) ---
  useEffect(() => {
    const robotInterval = setInterval(async () => {
      const now = Date.now();
      
      // 1. 角色自動行為檢查
      setCharacters(prev => prev.map(char => {
        let logs = [...(char.activityLogs || [])];
        let balance = char.walletBalance || 0;
        
        // A. 自動釣魚 (10% 機率)
        if (char.proactiveFishing && Math.random() < 0.1) {
          const fish = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
          logs.unshift(`获得 ${fish.name} ${fish.icon} (探索钓鱼)`);
          setWarehouseItems(w => {
            const ext = w.find(i => i.id === fish.id);
            return ext ? w.map(i => i.id === fish.id ? { ...i, amount: i.amount + 1 } : i) : [...w, { id: fish.id, amount: 1 }];
          });
        }
        // B. 自動販售 (5% 機率)
        if (char.autoSellFish && Math.random() < 0.05) {
          logs.unshift(`自动贩售了鱼货，获得 $200`);
          balance += 200;
        }
        // C. 主動發訊息檢查 (依據 proactiveInterval)
        if (char.proactiveInterval && char.proactiveInterval > 0) {
           if (now - (char.lastInteractionTime || 0) > char.proactiveInterval * 3600000) {
             // 此處應呼叫 callUniversalAI 觸發主動訊息，為求簡潔此處僅更新時間戳
             char.lastInteractionTime = now;
           }
        }

        return { ...char, walletBalance: balance, activityLogs: logs.slice(0, 20) };
      }));

      // 2. 花園助手邏輯 (80% 幫澆水)
      setGardenPatches(prev => prev.map(p => {
        if (p.status === 'growing' && p.needsWatering && Math.random() < 0.8) {
          return { ...p, needsWatering: false, lastWateredTime: now };
        }
        return p;
      }));

    }, 60000);
    return () => clearInterval(robotInterval);
  }, [characters, gardenPatches]);

  const removeApp = (id: AppId) => setInstalledApps(prev => prev.filter(a => a !== id));
  const removeDockApp = (id: AppId) => setDockApps(prev => prev.filter(a => a !== id));
  const addApp = (id: AppId) => { setInstalledApps(prev => [...prev, id]); setIsAddingApp(false); };
  const goHome = () => { setScreenState(ScreenState.Home); setActiveApp(null); setSelectedChatId(null); setIsJiggling(false); setSettingsTab('main'); };
  const openApp = (app: AppId) => { if (!isJiggling) { setActiveApp(app); setScreenState(ScreenState.AppOpen); } };

  const onUnlockPatch = (id: number) => {
    if (walletBalance >= 300) {
      setWalletBalance(prev => prev - 300);
      addTransaction('expense', 300, '解锁花园土堆');
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

  const onCatchFish = (id: string) => {
    setWarehouseItems(prev => {
      const existing = prev.find(i => i.id === id);
      return existing ? prev.map(i => i.id === id ? { ...i, amount: i.amount + 1 } : i) : [...prev, { id, amount: 1 }];
    });
  };

  const onCatchTrash = (coins: number) => {
    setWalletBalance(prev => prev + coins);
    addTransaction('income', coins, '钓鱼获得金币');
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

// --- 自動抓取模型清單 ---
  const fetchModels = async () => {
    if (!aiSettings.apiKey || !aiSettings.baseUrl) {
      alert("请先输入 API Key 与 Endpoint 网址");
      return;
    }
    setIsFetchingModels(true);
    try {
      const baseUrl = aiSettings.baseUrl.trim().replace(/\/$/, '').replace(/\/chat\/completions$/, '');
      const url = `${baseUrl}/models`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${aiSettings.apiKey}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const modelIds = data.data.map((m: any) => m.id);
      setAvailableModels(modelIds);
      if (modelIds.length > 0 && !modelIds.includes(aiSettings.model)) {
        setAiSettings(prev => ({ ...prev, model: modelIds[0] }));
      }
      alert(`成功抓取 ${modelIds.length} 个模型！`);
    } catch (err: any) {
      alert("抓取失败：" + err.message);
    } finally { setIsFetchingModels(false); }
  };

  // --- 萬用連接器 ---
  const callUniversalAI = async (history: Message[], systemPrompt: string) => {
    if (!aiSettings.apiKey) return "请输入 API Key";
    try {
      const cleanBaseUrl = aiSettings.baseUrl.replace(/\/$/, '');
      const url = cleanBaseUrl.endsWith('/chat/completions') ? cleanBaseUrl : `${cleanBaseUrl}/chat/completions`;
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
    } catch (e) { return "AI 连线失败"; }
  };

  // --- 3. App 專用渲染函式 (恢復原本的精緻設計) ---
const renderMessagesApp = () => {
  // 1. 如果正在編輯角色 (editingCharId 有值)
  if (editingCharId) {
    const char = characters.find(c => c.id === editingCharId);
    if (!char) return null;

    // 這裡定義 update 輔助函式（假設你有這個邏輯）
    const update = (field: string, value: any) => {
      setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, [field]: value } : c));
    };

    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
        <Header title={`编辑 ${char.name}`} onBack={() => { setEditingCharId(null); setCharTab('list'); }} isDarkMode={isDarkMode} />
        <div className="p-4 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div onClick={() => handleImageUpload((u: string) => update('avatar', u))} className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer relative group">
              <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"><CameraIcon size={20} /></div>
            </div>
            <span className="text-[10px] font-bold opacity-40 uppercase">点击更换头像</span>
          </div>

          <div className={`rounded-xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white shadow-sm'}`}>
            <ProfileInput label="角色姓名" value={char.name} isDark={isDarkMode} onChange={(v: any) => update('name', v)} />
            <ProfileInput label="妳对他的昵称" value={char.charNickname} isDark={isDarkMode} onChange={(v: any) => update('charNickname', v)} />
            <ProfileInput label="性格签名" value={char.signature} isDark={isDarkMode} onChange={(v: any) => update('signature', v)} />
            <ProfileInput label="出沒地点" value={char.location} isDark={isDarkMode} onChange={(v: any) => update('location', v)} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold opacity-40 px-2 uppercase">行为自动化权限</label>
            <div className={`rounded-xl divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white shadow-sm'}`}>
              <div className="px-5 py-3 flex justify-between items-center text-sm"><span>自动参与钓鱼</span><input type="checkbox" checked={char.proactiveFishing} onChange={e => update('proactiveFishing', e.target.checked)} className="accent-[#76DE84]" /></div>
              <div className="px-5 py-3 flex justify-between items-center text-sm"><span>自动售出鱼货</span><input type="checkbox" checked={char.autoSellFish} onChange={e => update('autoSellFish', e.target.checked)} className="accent-[#76DE84]" /></div>
              <div className="px-5 py-3 flex justify-between items-center text-sm"><span>自动浇水助手</span><input type="checkbox" checked={char.proactiveGarden} onChange={e => update('proactiveGarden', e.target.checked)} className="accent-[#76DE84]" /></div>
              <div className="px-5 py-3 flex justify-between items-center text-sm"><span>允许向我转账</span><input type="checkbox" checked={char.canTransferToUser} onChange={e => update('canTransferToUser', e.target.checked)} className="accent-[#76DE84]" /></div>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={() => setCharTab('peeper')} className="w-full py-4 bg-[#5856D6] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
              <Eye size={20} /> 进入偷窥者模式
            </button>
            <button onClick={() => { if (confirm("确定删除？")) { setCharacters(p => p.filter(c => c.id !== char.id)); setEditingCharId(null); } }} className="w-full py-4 text-red-500 font-bold bg-red-500/5 rounded-2xl">
              删除角色伙伴
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. 如果正在聊天 (selectedChatId 有值)
  if (selectedChatId) {
    const char = characters.find(c => c.id === selectedChatId);
    if (!char) return null;
    let myStyles: any = {}; let theirStyles: any = {};
    try { char.myBubbleCss?.split(';').forEach(p => { if (p.includes(':')) { const [k, v] = p.split(':'); myStyles[k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase())] = v.trim(); } }); } catch (e) { }
    try { char.theirBubbleCss?.split(';').forEach(p => { if (p.includes(':')) { const [k, v] = p.split(':'); theirStyles[k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase())] = v.trim(); } }); } catch (e) { }

    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-neutral-50 text-black'}`}>
        <div className={`px-4 pt-16 pb-3 flex items-center border-b ${isDarkMode ? 'bg-[#1c1c1e]/80 border-[#38383a]' : 'bg-white/80 border-neutral-200'} backdrop-blur-md sticky top-0 z-10`}>
          <button onClick={() => setSelectedChatId(null)} className="text-[#76DE84] flex items-center font-bold"><ChevronLeft size={20} /> 讯息</button>
          <div className="flex-1 flex flex-col items-center mr-10">
            <span className="font-bold">{char.name}</span><span className="text-[10px] text-[#76DE84]">在线上</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={char.chatBackground ? { backgroundImage: `url(${char.chatBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          {char.messages.map((m, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div style={m.role === 'user' ? myStyles : theirStyles} className={`max-w-[75%] px-4 py-2 rounded-[20px] text-[15px] shadow-sm ${m.role === 'user' ? 'bg-[#007AFF] text-white' : (isDarkMode ? 'bg-[#2c2c2e]' : 'bg-white')}`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {typingChatId === char.id && <div className="text-[10px] opacity-40 ml-2 animate-pulse">{char.name} 正在输入...</div>}
        </div>
        <div className={`p-4 pb-10 flex gap-2 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} border-t border-neutral-500/10`}>
          <button onClick={() => alert("功能未开放")} className="text-neutral-400 p-2"><Smile size={24} /></button>
          <input className={`flex-1 ${isDarkMode ? 'bg-black/40' : 'bg-neutral-100'} rounded-full px-4 py-2 text-sm outline-none`} placeholder="iMessage" onKeyDown={async e => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value; (e.target as HTMLInputElement).value = '';
              const newMsgs = [...char.messages, { role: 'user', text: val } as Message];
              setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, messages: newMsgs } : c));

              setTypingChatId(char.id);
              const reply = await callUniversalAI(newMsgs, char.settings);
              const sentences = reply.split(/[。\n]/).filter(s => s.trim().length > 0).slice(0, char.maxMessagesPerTurn);

              let currentMsgs = newMsgs;
              for (const s of sentences) {
                await new Promise(r => setTimeout(r, char.minResponseTime * 1000 + Math.random() * (char.maxResponseTime - char.minResponseTime) * 1000));
                currentMsgs = [...currentMsgs, { role: 'model', text: s.trim() } as Message];
                setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, messages: currentMsgs } : c));
              }
              setTypingChatId(null);
            }
          }} />
        </div>
      </div>
    );
  }

  // 3. 預設顯示：角色列表主頁
  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
      <div className="px-6 pt-16 pb-3 flex justify-between items-center sticky top-0 z-10 bg-inherit backdrop-blur-md">
        <span className="text-3xl font-black text-[#76DE84] tracking-tighter">CHARACTERS</span>
        <button onClick={() => {
          const newId = Date.now().toString();
          const newCharObj: any = {
            id: newId, name: '新角色', avatar: getRandomEmoji(), // 修正了 getRandomAnimalEmoji 可能不存在的問題
            messages: [], walletBalance: 300, favorability: 0,
            location: '学校、公园', proactiveFishing: true
          };
          setCharacters([...characters, newCharObj]);
          setEditingCharId(newId);
          setCharTab('edit');
        }} className="w-10 h-10 rounded-full bg-[#76DE84] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {characters.map(c => (
          <div key={c.id} onClick={() => { setEditingCharId(c.id); setCharTab('edit'); }} className={`p-4 rounded-3xl flex items-center gap-4 ${isDarkMode ? 'bg-[#1c1c1e] border-white/5' : 'bg-white border-neutral-100'} border shadow-sm active:scale-95 transition-all cursor-pointer`}>
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white">
              <AvatarImage src={c.avatar} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">{c.name}</div>
              <div className="text-xs opacity-50 italic truncate w-40">{c.signature || '暂无个性签名'}</div>
            </div>
            <div className="text-pink-500 font-black text-sm">❤️ {c.favorability}</div>
          </div>
        ))}
        {characters.length === 0 && <div className="py-20 text-center text-neutral-400">目前沒有角色，点击 + 建立</div>}
      </div>
    </div>
  );
};

const renderSettings = () => {
    const t = TRANSLATIONS[language];

    // --- A. 子頁面：編輯個人資料 ---
    if (settingsTab === 'general') {
      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
          <Header title="编辑个人资料" onBack={() => setSettingsTab('main')} isDarkMode={isDarkMode} />
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="flex flex-col items-center py-6">
              <div 
                onClick={() => handleImageUpload(url => setUserProfile({...userProfile, avatar: url}))}
                className="w-24 h-24 rounded-full bg-neutral-200 shadow-xl mb-3 overflow-hidden flex items-center justify-center text-4xl border-4 border-white cursor-pointer relative group"
              >
                <AvatarImage src={userProfile.avatar} />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <CameraIcon size={24} color="white" />
                </div>
              </div>
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">点击更换照片</span>
            </div>
            <div className={`rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white divide-neutral-100 shadow-sm'}`}>
              <ProfileInput label="姓名" value={userProfile.name} isDark={isDarkMode} onChange={v => setUserProfile({...userProfile, name: v})} />
              <ProfileInput label="性别" value={userProfile.gender} isDark={isDarkMode} onChange={v => setUserProfile({...userProfile, gender: v})} />
              <ProfileInput label="年龄" value={userProfile.age} isDark={isDarkMode} onChange={v => setUserProfile({...userProfile, age: v})} />
              <ProfileInput label="签名" value={userProfile.signature} isDark={isDarkMode} onChange={v => setUserProfile({...userProfile, signature: v})} />
            </div>
          </div>
        </div>
      );
    }

    // --- B. 其他功能子頁面 (API, 圖示, 桌布, 存檔) ---
    if (settingsTab !== 'main') {
      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
          <Header title={t[settingsTab as keyof typeof t] || '设定'} onBack={() => setSettingsTab('main')} isDarkMode={isDarkMode} />
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {settingsTab === 'aiConfig' && (
              <div className={`rounded-2xl p-5 space-y-5 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                <div>
                  <label className="text-[10px] font-bold opacity-30 block mb-1 uppercase tracking-widest">API Endpoint</label>
                  <input className="w-full bg-transparent outline-none text-sm border-b border-neutral-500/10 pb-1" value={aiSettings.baseUrl} onChange={e => setAiSettings({...aiSettings, baseUrl: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 block mb-1 uppercase tracking-widest">API Key</label>
                  <input type="password" className="w-full bg-transparent outline-none text-sm border-b border-neutral-500/10 pb-1" value={aiSettings.apiKey} onChange={e => setAiSettings({...aiSettings, apiKey: e.target.value})} placeholder="sk-..." />
                </div>
                <button onClick={fetchModels} disabled={isFetchingModels} className={`w-full py-2 rounded-xl text-xs font-bold ${isFetchingModels ? 'bg-neutral-500' : 'bg-[#76DE84] text-white shadow-lg'}`}>
                  {isFetchingModels ? '抓取中...' : '抓取模型清单'}
                </button>
                <div>
                  <label className="text-[10px] font-bold opacity-30 block mb-1 uppercase tracking-widest">选择模型</label>
                  <select className="w-full bg-transparent outline-none text-sm border-b border-neutral-500/10 pb-1" value={aiSettings.model} onChange={e => setAiSettings({...aiSettings, model: e.target.value})}>
                    {availableModels.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
                    {availableModels.length === 0 && <option value={aiSettings.model}>{aiSettings.model}</option>}
                  </select>
                </div>
              </div>
            )}

            {settingsTab === 'icons' && (
              <div className="space-y-4">
                {installedApps.map(appId => (
                  <div key={appId} className={`p-3 rounded-2xl flex items-center gap-4 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                    <div onClick={() => handleImageUpload(url => setCustomIcons({...customIcons, [appId]: url}))} className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 cursor-pointer border border-black/5 flex items-center justify-center">
                      {customIcons[appId] ? <img src={customIcons[appId]} className="w-full h-full object-cover" /> : getIconElement(appId)}
                    </div>
                    <div className="flex-1">
                      <input className="font-bold text-sm bg-transparent outline-none w-full" value={appNames[appId] || appId} onChange={e => setAppNames({...appNames, [appId]: e.target.value})} />
                      <div className="text-[10px] text-[#76DE84] font-medium">点击图式更换照片</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {settingsTab === 'appearance' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <WallpaperThumb label="锁定画面" src={lockWallpaper} onClick={() => handleImageUpload(url => setLockWallpaper(url))} />
                  <WallpaperThumb label="主画面" src={homeWallpaper} onClick={() => handleImageUpload(url => setHomeWallpaper(url))} />
                </div>
                <div className={`rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white divide-neutral-100 shadow-sm'}`}>
                   <div className="px-5 py-4 flex items-center justify-between">
                     <span className="text-sm font-medium">深色模式</span>
                     <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-[#76DE84]' : 'bg-neutral-300'}`}>
                       <motion.div animate={{ x: isDarkMode ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                     </button>
                   </div>
                   <div className="px-5 py-4 flex items-center justify-between">
                     <span className="text-sm font-medium">全屏模式</span>
                     <button onClick={() => setIsFullScreen(!isFullScreen)} className={`w-12 h-6 rounded-full relative transition-colors ${isFullScreen ? 'bg-[#76DE84]' : 'bg-neutral-300'}`}>
                       <motion.div animate={{ x: isFullScreen ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                     </button>
                   </div>
                </div>
              </div>
            )}

            {settingsTab === 'privacy' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleExportSave} className={`flex flex-col items-center gap-3 p-6 rounded-[32px] ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                    <Download className="text-blue-500" size={28} /><span className="font-bold text-xs">导出存档</span>
                  </button>
                  <button onClick={handleImportSave} className={`flex flex-col items-center gap-3 p-6 rounded-[32px] ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                    <Upload className="text-emerald-500" size={28} /><span className="font-bold text-xs">导入存档</span>
                  </button>
                </div>
                <button onClick={() => { if(confirm("确定重制？")) { localStorage.clear(); location.reload(); }}} className="w-full py-4 text-red-500 font-bold">重制所有玩家资料</button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- C. 設定主頁面 ---
    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
        <div className="px-6 pt-16 pb-3 text-3xl font-black">{t.settings}</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div onClick={() => setSettingsTab('general')} className={`p-4 rounded-2xl flex items-center gap-4 active:scale-95 transition-all ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-neutral-200">
              <AvatarImage src={userProfile.avatar} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-tight truncate">{userProfile.name}</h3>
              <p className="text-xs opacity-50 truncate">{userProfile.gender} · {userProfile.age}岁 · {userProfile.signature}</p>
            </div>
            <ChevronRight size={20} className="opacity-20" />
          </div>
          <div className={`rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white divide-neutral-100 shadow-sm'}`}>
            <SettingsRow icon={<Key size={18} color="white" />} iconBg="#8E8E93" label="AI 助手与 API 设定" onClick={() => setSettingsTab('aiConfig')} />
            <SettingsRow icon={<Grid size={18} color="white" />} iconBg="#AF52DE" label="更换图式与名称" onClick={() => setSettingsTab('icons')} />
            <SettingsRow icon={<Image size={18} color="white" />} iconBg="#FF2D55" label="背景图片与外观" onClick={() => setSettingsTab('appearance')} />
            <SettingsRow icon={<Download size={18} color="white" />} iconBg="#007AFF" label="资料管理与存档" onClick={() => setSettingsTab('privacy')} />
          </div>
        </div>
      </div>
    );
  };

  const renderWheelApp = () => {
    const handleSpin = () => {
      if (wheelSpins <= 0) { alert("今日次数已用完"); return; }
      if (isSpinning) return;
      setIsSpinning(true);
      setWheelSpins(prev => prev - 1);
      const randomDeg = 1800 + Math.floor(Math.random() * 360);
      setWheelRotation(prev => prev + randomDeg);
      setTimeout(() => {
        setIsSpinning(false);
        const actualDeg = (wheelRotation + randomDeg) % 360;
        const rewardIdx = Math.floor(((360 - actualDeg) % 360) / (360 / wheelRewards.length));
        const amount = wheelRewards[rewardIdx];
        setWalletBalance(prev => prev + amount);
        addTransaction('income', amount, '每日转盘奖励');
        alert(`获得 $${amount}！`);
      }, 4000);
    };
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-6 pt-20 ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-amber-50 text-amber-900'}`}>
        <h2 className="text-3xl font-black italic mb-2 tracking-tighter">DAILY SPIN</h2>
        <p className="text-xs font-bold opacity-50 mb-8 uppercase">Spins left: {wheelSpins} / 3</p>
        <div className="relative">
          <motion.div animate={{ rotate: wheelRotation }} transition={{ duration: 4, ease: [0.13, 0, 0, 1] }} className="w-72 h-72 rounded-full border-[10px] border-amber-600 relative overflow-hidden shadow-2xl bg-white">
            {wheelRewards.map((r, i) => (
              <div key={i} className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom flex flex-col items-center" style={{ transform: `translateX(-50%) rotate(${i * (360/wheelRewards.length)}deg)` }}>
                <span className="mt-2 text-[10px] font-black text-amber-800">${r}</span>
              </div>
            ))}
          </motion.div>
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600 z-10 drop-shadow-md" />
        </div>
        <button onClick={handleSpin} disabled={isSpinning || wheelSpins <= 0} className={`mt-14 px-12 py-4 rounded-full font-black text-xl shadow-xl active:scale-95 transition-all ${isSpinning || wheelSpins <= 0 ? 'bg-neutral-400' : 'bg-amber-600 text-white'}`}>
          {isSpinning ? 'SPINNING...' : wheelSpins <= 0 ? 'TOMORROW' : 'SPIN NOW'}
        </button>
      </div>
    );
  };

const renderCharacters = () => {
    if (editingCharId) {
      const char = characters.find(c => c.id === editingCharId);
      if (!char) return null;
      const update = (f: keyof Character, v: any) => setCharacters(prev => prev.map(c => c.id === editingCharId ? { ...c, [f]: v } : c));

      if (charTab === 'peeper') {
        return (
          <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
            <Header title="偷窥者模式" onBack={() => setCharTab('edit')} isDarkMode={isDarkMode} />
            <div className="p-6 space-y-6 pb-20">
              <div className={`p-8 rounded-[40px] text-center space-y-4 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-xl'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-4 border-[#5856D6] shadow-lg">
                  <AvatarImage src={char.avatar} />
                </div>
                <h4 className="font-black text-xl">{char.name} 的隐私钱包</h4>
                <div className="text-5xl font-black text-[#5856D6] tracking-tighter">${char.walletBalance || 0}</div>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">存取权限已授权</p>
              </div>
              <div className="space-y-3">
                <h5 className="text-xs font-bold opacity-40 uppercase px-2">近期动态纪录</h5>
                <div className={`rounded-2xl p-4 space-y-3 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                  {char.activityLogs?.map((log, i) => <div key={i} className="text-xs opacity-70 border-l-2 border-[#76DE84] pl-3 py-1">{log}</div>)}
                  {(!char.activityLogs || char.activityLogs.length === 0) && <p className="text-center opacity-30 py-4 italic">暂无纪录</p>}
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
          <Header title={`编辑 ${char.name}`} onBack={() => { setEditingCharId(null); setCharTab('list'); }} isDarkMode={isDarkMode} />
          <div className="p-4 space-y-6">
            <div className="flex flex-col items-center gap-2">
              <div onClick={() => handleImageUpload(u => update('avatar', u))} className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer relative group">
                <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"><CameraIcon size={20} /></div>
              </div>
              <span className="text-[10px] font-bold opacity-40 uppercase">点击更换照片</span>
            </div>
            <div className={`rounded-xl overflow-hidden divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white shadow-sm'}`}>
              <ProfileInput label="姓名" value={char.name} isDark={isDarkMode} onChange={(v:any) => update('name', v)} />
              <ProfileInput label="昵称" value={char.charNickname} isDark={isDarkMode} onChange={(v:any) => update('charNickname', v)} />
              <ProfileInput label="地点" value={char.location} isDark={isDarkMode} onChange={(v:any) => update('location', v)} />
              <ProfileInput label="签名" value={char.signature} isDark={isDarkMode} onChange={(v:any) => update('signature', v)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-40 px-2 uppercase">行为自动化开关</label>
              <div className={`rounded-xl divide-y ${isDarkMode ? 'bg-[#1c1c1e] divide-white/5' : 'bg-white shadow-sm'}`}>
                <div className="px-5 py-3 flex justify-between items-center text-sm"><span>自动钓鱼</span><input type="checkbox" checked={char.proactiveFishing} onChange={e => update('proactiveFishing', e.target.checked)} /></div>
                <div className="px-5 py-3 flex justify-between items-center text-sm"><span>自动售鱼</span><input type="checkbox" checked={char.autoSellFish} onChange={e => update('autoSellFish', e.target.checked)} /></div>
                <div className="px-5 py-3 flex justify-between items-center text-sm"><span>自动浇水</span><input type="checkbox" checked={char.proactiveGarden} onChange={e => update('proactiveGarden', e.target.checked)} /></div>
              </div>
            </div>
            <button onClick={() => setCharTab('peeper')} className="w-full py-4 bg-[#5856D6] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95">
              <Eye size={20} /> 进入偷窥者模式
            </button>
            <button onClick={() => {if(confirm("删除？")){setCharacters(prev => prev.filter(c => c.id !== char.id)); setEditingCharId(null);}}} className="w-full py-4 text-red-500 font-bold bg-red-500/5 rounded-2xl">删除角色</button>
          </div>
        </div>
      );
    }
  
    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
        <div className="px-6 pt-16 pb-3 flex justify-between items-center sticky top-0 z-10 bg-inherit backdrop-blur-md">
          <span className="text-3xl font-black text-[#76DE84]">CHARACTERS</span>
          <button onClick={() => {
            const newId = Date.now().toString();
            setCharacters([...characters, { id: newId, name: '新角色', avatar: getRandomAnimalEmoji(), messages: [], favorability: 0, walletBalance: 300, location: '未设定', activityLogs: [] } as any]);
            setEditingCharId(newId); setCharTab('edit');
          }} className="w-10 h-10 rounded-full bg-[#76DE84] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Plus size={24} /></button>
        </div>
        <div className="p-4 space-y-3">
          {characters.map(c => (
            <div key={c.id} onClick={() => {setEditingCharId(c.id); setCharTab('edit');}} className={`p-4 rounded-3xl flex items-center gap-4 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'} cursor-pointer active:scale-95 transition-all`}>
              <div className="w-14 h-14 rounded-full overflow-hidden border"><AvatarImage src={c.avatar} /></div>
              <div className="flex-1 font-bold text-lg">{c.name}</div>
              <div className="text-pink-500 font-black">❤️ {c.favorability}</div>
              <ChevronRight size={16} className="opacity-20" />
            </div>
          ))}
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
      default: return <div className="p-20 text-center">App 内容载入中...</div>;
    }
  };

        // Move constant calculations up to be shared
        const isSystem = selectedChatId === 'system';
        const char = characters.find(c => c.id === selectedChatId);

        if (isChatConfigOpen && char) {
          return (
            <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
              <Header title={`${char.name} 聊天设定`} onBack={() => { setIsChatConfigOpen(false); setPreviewChatBg(null); }} isDarkMode={isDarkMode} />
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
                      <span>回复速度调整</span>
                      <Sparkles size={14} />
                    </div>
                    
                    <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>最快回复时间</span>
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
                      <span>最慢回复时间</span>
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
                      <span>讯息连续传送上线</span>
                      <MessageCircle size={14} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>一次最多可传几条</span>
                      <span className="text-[#76DE84] font-bold">{char.maxMessagesPerTurn} 条</span>
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
                    <p className="text-[10px] opacity-40 text-center italic mt-2">设定越高，角色一次传来的短句就越多</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>所在地更换频率</span>
                      <MapPin size={14} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>改变间隔</span>
                      <span className="text-[#FF9500] font-bold">{char.locationInterval || 1} 小时</span>
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
                      <span>主动传送讯息频率</span>
                      <Bot size={14} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>闲置多久后发送</span>
                      <span className="text-blue-500 font-bold">{char.proactiveInterval ? `${char.proactiveInterval} 小时` : '已关闭'}</span>
                    </div>
                    <input 
                      type="range" min="0" max="24" step="1"
                      value={char.proactiveInterval || 0}
                      onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, proactiveInterval: parseInt(e.target.value) } : c))}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <p className="text-[10px] opacity-40 text-center italic mt-2">當你长时间没回话时，角色会主动传讯息找你</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>自动参与 APP 互动</span>
                      <Activity size={14} />
                    </div>
                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">参与钓鱼互动</span>
                        <span className="text-[10px] opacity-40 italic">允许角色在闲置时进入钓鱼 APP</span>
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
                        <span className="text-xs font-bold">自动售出鱼货</span>
                        <span className="text-[10px] opacity-40 italic">依据当天市场价格自动售出钓到的鱼货</span>
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
                        <span className="text-xs font-bold">自动浇水</span>
                        <span className="text-[10px] opacity-40 italic">允许角色在作物需要时有 80% 机率主动浇水</span>
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
                        <span className="text-xs font-bold">允许角色转账</span>
                        <span className="text-[10px] opacity-40 italic">有 50% 机率在聊天时將金币转账给使用者</span>
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
                        <span className="text-xs font-bold">共用贴图库</span>
                        <span className="text-[10px] opacity-40 italic">允许角色在聊天中使用贴图库里储存的贴图</span>
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
                        <span className="text-xs font-bold">允许角色赠礼</span>
                        <span className="text-[10px] opacity-40 italic">允许角色购买当日商城的礼物並赠送</span>
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
                        <span className="text-xs font-bold">允许拍一拍</span>
                        <span className="text-[10px] opacity-40 italic">允许角色在聊天时拍一拍你</span>
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
                      <span>偷窥者模式 (金币流向)</span>
                      <TrendingUp size={14} />
                    </div>
                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-black/20' : 'bg-neutral-50'} space-y-4`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs opacity-50">当前金币余额</span>
                        <span className="text-xl font-black text-[#FF9500]">${char.walletBalance || 0}</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold opacity-30 uppercase">近期交易纪录</label>
                        <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
                          {(!char.transactions || char.transactions.length === 0) ? (
                            <p className="text-[10px] opacity-30 text-center py-4 italic">暂无金币移动纪录</p>
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
                        <label className="text-[10px] font-bold opacity-30 uppercase">近期动态纪录</label>
                        <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                          {(!char.activityLogs || char.activityLogs.length === 0) ? (
                            <p className="text-[10px] opacity-30 text-center py-2 italic">暂无动态纪录</p>
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
                        <label className="text-xs font-medium">聊天背景图</label>
                        <div className="flex gap-2">
                          <input 
                            className={`flex-1 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'} border rounded-lg px-3 py-2 text-xs`}
                            placeholder="输入图片 URL"
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
                            上传
                          </button>
                        </div>
                      </div>

                      {previewChatBg !== null && (
                        <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'} space-y-3`}>
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">背景预览</p>
                            <button onClick={() => setPreviewChatBg(null)} className="text-[10px] hover:text-red-500 transition-colors">清除预览</button>
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
                      <label className="text-xs font-medium">我的气泡 CSS 代码</label>
                      <textarea 
                        className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'} border rounded-lg px-3 py-2 text-[10px] font-mono h-20 outline-none`}
                        placeholder="例如: background: linear-gradient(45deg, #76DE84, #5856D6); border-radius: 20px 20px 0 20px;"
                        value={char.myBubbleCss || ''}
                        onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, myBubbleCss: e.target.value } : c))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium">对方的气泡 CSS 代码</label>
                      <textarea 
                        className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'} border rounded-lg px-3 py-2 text-[10px] font-mono h-20 outline-none`}
                        placeholder="例如: background: white; color: black; border: 2px solid #EEE;"
                        value={char.theirBubbleCss || ''}
                        onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, theirBubbleCss: e.target.value } : c))}
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-bold opacity-30 text-center uppercase tracking-widest">— 气泡样式预设 —</p>
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
                  确认修改
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
          if (isSystem) return "在线";
          const statuses = ["在线", "忙碌", "吃饭中", "睡觉中", "玩游戏中", "发呆中"];
          return statuses[Math.floor((Date.now() / 3600000 + parseInt(char!.id.slice(-2))) % statuses.length)];
        };
        const status = getStatus();

        const getLocation = () => {
          if (isSystem) return "";
          const locString = char?.location || '未知地点';
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
                          <span className={`w-1.5 h-1.5 rounded-full ${status === '在线' ? 'bg-green-500' : 'bg-orange-500'}`} />
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
                      确定
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
                            赠送物品
                          </h3>
                          <p className="text-xs opacity-50 mt-1">从仓库中选择要赠送给 {chatName} 的鱼货或作物</p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                          {warehouseItems.filter(i => (i.id.startsWith('f') || i.id.startsWith('c')) && i.amount > 0).length === 0 ? (
                            <div className="py-10 text-center opacity-30">
                              <ShoppingBag className="mx-auto mb-2" size={40} />
                              <p className="text-sm font-bold">目前仓库沒有鱼或作物</p>
                              <p className="text-[10px]">去钓鱼或种田获取后再來吧！</p>
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
                                      <div className="text-[10px] opacity-40">拥有数量: {item.amount}</div>
                                    </div>
                                  </div>
                                  <div className="text-[#FF2D55] font-black text-xs">选择</div>
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
                        <h3 className="text-xl font-bold mb-2">确定要赠送 {giftConfirmItem.name} 嗎？</h3>
                        <p className="text-sm opacity-50 text-center mb-8">赠送后将从仓库扣除 1 个此物品，並增加与 {chatName} 的好感度。</p>
                        
                        <div className="flex w-full gap-3">
                          <button 
                            onClick={() => setGiftConfirmItem(null)}
                            className={`flex-1 py-3 rounded-xl font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-neutral-100 text-black'} active:scale-95 transition-transform`}
                          >
                            选别的
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
                                  else if (fish.rarity === '史诗') favorGain = 25;
                                  else if (fish.rarity === '传说') favorGain = 50;
                                } else {
                                  const crop = giftConfirmItem as Crop;
                                  favorGain = Math.ceil(crop.sellPrice / 20);
                                }

                                setCharacters(prev => prev.map(c => c.id === char!.id ? { 
                                  ...c, 
                                  favorability: (c.favorability || 0) + favorGain,
                                  messages: [...c.messages, { role: 'user', text: `[赠送] ${giftConfirmItem.icon} ${giftConfirmItem.name}` }]
                                } : c));
                              }
                              setGiftConfirmItem(null);
                              setIsGiftModalOpen(false);
                            }}
                            className="flex-1 py-3 bg-[#FF2D55] text-white rounded-xl font-bold shadow-lg shadow-[#FF2D55]/20 active:scale-95 transition-transform"
                          >
                            确定赠送
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
                      <h3 className="text-xl font-bold">转账给 {chatName}</h3>
                      <p className="text-sm opacity-50 mt-1">钱包余额：${walletBalance}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold opacity-40 uppercase px-1">输入金额</label>
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
                          addTransaction('transfer', amount, `转账给 ${chatName}`, chatName);
                          setCharacters(prev => prev.map(c => {
                            if (c.id === char!.id) {
                              const charTx: Transaction = {
                                id: Date.now().toString() + 'c' + Math.random().toString(36).substr(2, 5),
                                type: 'income',
                                amount: amount,
                                title: `收到来自 ${userProfile.name} 的转账`,
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
                          const transferMsg: Message = { role: 'user', text: `[系统通知] 成功转账 $${amount} 给 ${chatName}` };
                          setCharacters(prev => prev.map(c => c.id === char!.id ? { ...c, messages: [...c.messages, transferMsg] } : c));
                          
                          setIsTransferModalOpen(false);
                          setTransferAmount('');
                        }}
                        className={`py-3 rounded-xl font-bold bg-[#FF9500] text-white shadow-lg shadow-[#FF9500]/20 active:scale-95 transition-transform disabled:opacity-20 disabled:cursor-not-allowed`}
                      >
                        确认转账
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
                  <div className={`text-center py-10 opacity-40 text-sm ${char?.chatBackground ? 'text-white' : ''}`}>与 {chatName} 开始对话吧！</div>
                )}
                <div className="space-y-4">
                  {chatMessages.map((m, i) => {
                    const isSticker = m.text.startsWith('[贴图] ');
                    const stickerUrl = isSticker ? m.text.replace('[贴图] ', '') : null;
                    const isGift = m.text.includes('[赠礼]');
                    const isTransfer = m.text.includes('[转账]');
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
                            <span className="truncate max-w-[150px]">回复: {m.replyTo}</span>
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
                                if (isGift) { e.stopPropagation(); setSystemAlert('收下礼物'); }
                                else if (isTransfer) { e.stopPropagation(); setSystemAlert('收下转账'); }
                              }}
                              className={`max-w-[80%] px-4 py-2 rounded-[20px] text-[15px] shadow-sm relative ${Object.entries(customStyle).length > 0 ? '' : (m.role === 'user' ? 'bg-[#76DE84] text-white rounded-tr-none' : (isDarkMode ? 'bg-[#1c1c1e] text-white border border-[#38383a] rounded-tl-none' : 'bg-neutral-100 text-black rounded-tl-none'))} ${(isGift || isTransfer) ? 'ring-2 ring-amber-400 cursor-pointer active:scale-95 transition-transform' : ''}`}
                            >
                              {m.text}
                            </div>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setReplyingTo(m); }}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full ${isDarkMode ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-black/5 text-neutral-500'}`}
                            title="回复"
                          >
                            <Reply size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {typingChatId === selectedChatId && <div className="text-[10px] text-neutral-400 ml-2 animate-pulse mb-4">{chatName} 正在输入...</div>}
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
                      表情与贴图
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
                      备忘录
                    </button>
                    <div className="flex-1" />
                    {emojiPickerTab === 'stickers' && (
                      <button 
                        onClick={() => stickerInputRef.current?.click()}
                        className="text-[10px] bg-[#76DE84]/10 text-[#76DE84] px-2 py-1 rounded-full font-bold active:scale-90 transition-transform"
                      >
                        + 新增贴图
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
                        <p className="text-[10px] font-bold opacity-30 mb-2">我的贴图</p>
                        {stickers.length === 0 ? (
                          <div className="text-center py-8 opacity-30 text-xs">尚无贴图，点击上方按钮新增</div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2">
                            {stickers.map((s, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => {
                                  if (isSystem) {
                                    setInput("");
                                    const stickerMsg: Message = { role: 'user', text: `[贴图] ${s}` };
                                    setMessages(prev => [...prev, stickerMsg]);
                                  } else {
                                    setInput("");
                                    const stickerMsg: Message = { role: 'user', text: `[贴图] ${s}` };
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
                          <p className="text-sm font-medium opacity-70">你想拍拍 {chatName} 的哪里？</p>
                          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-neutral-50'} border border-neutral-100/10`}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs opacity-40 shrink-0">拍一拍他的...</span>
                              <input 
                                type="text"
                                value={nudgeInput}
                                onChange={(e) => setNudgeInput(e.target.value)}
                                placeholder="头、肩膀、肚子..."
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
                          发送拍一拍
                        </button>
                        <div className="text-[10px] text-center opacity-30 px-6">
                        就像微信的拍一拍功能一样，让对方知道你在找他。
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 py-2 h-full">
                        <div className="flex items-center gap-2">
                          <input 
                            className={`flex-1 ${isDarkMode ? 'bg-black/40 text-white' : 'bg-neutral-50 text-black'} border-none outline-none px-4 py-3 rounded-xl text-sm font-medium`}
                            placeholder="新增备忘录..."
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
                            <div className="text-center py-10 opacity-30 text-xs">尚无备忘录</div>
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
    <input className={`flex-1 text-sm outline-none bg-transparent ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} value={value} onChange={e => onChange(e.target.value)} placeholder={`请输入${label}`} /></div>
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
