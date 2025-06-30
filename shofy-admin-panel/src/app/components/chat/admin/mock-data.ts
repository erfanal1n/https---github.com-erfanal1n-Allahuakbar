// Types
export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  role: 'admin' | 'customer' | 'guest';
  orders?: number;
  totalSpent?: number;
  joinedDate?: string;
}

export interface IMessage {
  id: number;
  conversationId: number;
  senderId: number;
  text?: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    type: 'image' | 'file' | 'link' | 'voice';
    url: string;
    name?: string;
    size?: string;
    duration?: string;
    thumbnail?: string;
    preview?: {
      title?: string;
      description?: string;
      image?: string;
    };
  }[];
}

export interface IConversation {
  id: number;
  participants: IUser[];
  lastMessage?: IMessage;
  unreadCount: number;
  isTyping?: boolean;
  tags?: string[];
  isResolved?: boolean;
}

// Mock Data
export const users: IUser[] = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@shofy.com',
    avatar: '/assets/img/users/user-8.jpg',
    status: 'online',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    avatar: '/assets/img/users/user-1.jpg',
    status: 'online',
    lastSeen: '2 min ago',
    role: 'customer',
    orders: 8,
    totalSpent: 1240.87,
    joinedDate: 'Jan 15, 2023'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.c@outlook.com',
    avatar: '/assets/img/users/user-2.jpg',
    status: 'offline',
    lastSeen: '1 hour ago',
    role: 'customer',
    orders: 3,
    totalSpent: 427.50,
    joinedDate: 'Mar 4, 2023'
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma.davis@hotmail.com',
    avatar: '/assets/img/users/user-3.jpg',
    status: 'away',
    lastSeen: '27 min ago',
    role: 'customer',
    orders: 12,
    totalSpent: 3189.44,
    joinedDate: 'Nov 9, 2022'
  },
  {
    id: 5,
    name: 'James Wilson',
    email: 'jwilson@gmail.com',
    avatar: '/assets/img/users/user-4.jpg',
    status: 'online',
    role: 'customer',
    orders: 2,
    totalSpent: 178.25,
    joinedDate: 'May 22, 2023'
  },
  {
    id: 6,
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: '/assets/img/users/user-10.jpg',
    status: 'online',
    role: 'guest'
  }
];

export const messages: IMessage[] = [
  // Conversation 1 - Sarah Johnson
  {
    id: 1,
    conversationId: 1,
    senderId: 2, // Sarah
    text: 'Hello, I have a question about my recent order #SHF8721.',
    timestamp: '2023-06-30T09:23:18Z',
    isRead: true
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 1, // Admin
    text: 'Hi Sarah, I\'d be happy to help. What would you like to know about your order?',
    timestamp: '2023-06-30T09:25:22Z',
    isRead: true
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 2, // Sarah
    text: 'I ordered the Premium Wireless Headphones, but received the standard version instead.',
    timestamp: '2023-06-30T09:27:45Z',
    isRead: true
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 2, // Sarah
    text: 'Here\'s a photo of what I received:',
    timestamp: '2023-06-30T09:28:10Z',
    isRead: true,
    attachments: [
      {
        type: 'image',
        url: '/assets/img/products/headphone.png',
        name: 'headphone.png',
        size: '1.2 MB'
      }
    ]
  },
  {
    id: 5,
    conversationId: 1,
    senderId: 1, // Admin
    text: 'I\'m sorry about that mix-up, Sarah. Let me check your order details.',
    timestamp: '2023-06-30T09:30:55Z',
    isRead: true
  },
  {
    id: 6,
    conversationId: 1,
    senderId: 1, // Admin
    text: 'You\'re right, I can see that you ordered the Premium model. I\'ll arrange for a replacement to be sent out right away.',
    timestamp: '2023-06-30T09:33:12Z',
    isRead: true
  },
  {
    id: 7,
    conversationId: 1,
    senderId: 2, // Sarah
    text: 'Thank you! Do I need to return the standard version?',
    timestamp: '2023-06-30T09:35:40Z',
    isRead: true
  },
  {
    id: 8,
    conversationId: 1,
    senderId: 1, // Admin
    text: 'Yes, but don\'t worry, we\'ll send you a prepaid return label. Here\'s a link with more information:',
    timestamp: '2023-06-30T09:37:22Z',
    isRead: true,
    attachments: [
      {
        type: 'link',
        url: 'https://shofy.com/returns',
        preview: {
          title: 'Shofy Returns & Exchanges',
          description: 'Learn how to return or exchange your Shofy products hassle-free.',
          image: '/assets/img/logo/logo.svg'
        }
      }
    ]
  },
  {
    id: 9,
    conversationId: 1,
    senderId: 2, // Sarah
    text: 'Perfect, thank you for your help!',
    timestamp: '2023-06-30T09:40:11Z',
    isRead: false
  },

  // Conversation 2 - Michael Chen
  {
    id: 10,
    conversationId: 2,
    senderId: 3, // Michael
    text: 'Hi there, I\'m having trouble accessing my account. Can you help?',
    timestamp: '2023-06-29T14:12:08Z',
    isRead: true
  },
  {
    id: 11,
    conversationId: 2,
    senderId: 1, // Admin
    text: 'Hello Michael, I\'d be glad to help. What happens when you try to log in?',
    timestamp: '2023-06-29T14:15:33Z',
    isRead: true
  },
  {
    id: 12,
    conversationId: 2,
    senderId: 3, // Michael
    text: 'I keep getting an "invalid password" error, but I\'m sure my password is correct.',
    timestamp: '2023-06-29T14:18:45Z',
    isRead: true
  },
  {
    id: 13,
    conversationId: 2,
    senderId: 1, // Admin
    text: 'Let me reset your password for you. I\'ll send a reset link to your email.',
    timestamp: '2023-06-29T14:22:19Z',
    isRead: true
  },
  {
    id: 14,
    conversationId: 2,
    senderId: 3, // Michael
    text: 'Thank you, I\'ll check my email.',
    timestamp: '2023-06-29T14:25:52Z',
    isRead: true
  },
  {
    id: 15,
    conversationId: 2,
    senderId: 1, // Admin
    text: 'You\'re welcome! The link has been sent. Let me know if you have any other issues.',
    timestamp: '2023-06-29T14:28:30Z',
    isRead: true
  },
  {
    id: 16,
    conversationId: 2,
    senderId: 3, // Michael
    text: 'Got it and reset my password. I can log in now. Thanks for your help!',
    timestamp: '2023-06-29T14:42:10Z',
    isRead: true
  },

  // Conversation 3 - Emma Davis
  {
    id: 17,
    conversationId: 3,
    senderId: 4, // Emma
    text: 'Hi, I\'d like to request a refund for my recent purchase.',
    timestamp: '2023-06-28T10:03:45Z',
    isRead: true
  },
  {
    id: 18,
    conversationId: 3,
    senderId: 1, // Admin
    text: 'Hello Emma, I\'d be happy to help with your refund request. Could you please provide the order number?',
    timestamp: '2023-06-28T10:08:22Z',
    isRead: true
  },
  {
    id: 19,
    conversationId: 3,
    senderId: 4, // Emma
    text: 'Sure, it\'s order #SHF9356.',
    timestamp: '2023-06-28T10:11:39Z',
    isRead: true
  },
  {
    id: 20,
    conversationId: 3,
    senderId: 1, // Admin
    text: 'Thank you. May I ask the reason for the refund?',
    timestamp: '2023-06-28T10:13:51Z',
    isRead: true
  },
  {
    id: 21,
    conversationId: 3,
    senderId: 4, // Emma
    text: 'The item doesn\'t fit as expected. It\'s too small.',
    timestamp: '2023-06-28T10:15:20Z',
    isRead: true
  },
  {
    id: 22,
    conversationId: 3,
    senderId: 1, // Admin
    text: 'I understand. I\'ve processed your refund request. You should receive the money back in 3-5 business days.',
    timestamp: '2023-06-28T10:19:45Z',
    isRead: true
  },
  {
    id: 23,
    conversationId: 3,
    senderId: 1, // Admin
    text: 'Here\'s your return label:',
    timestamp: '2023-06-28T10:21:14Z',
    isRead: true,
    attachments: [
      {
        type: 'file',
        url: '#',
        name: 'return_label_SHF9356.pdf',
        size: '156 KB'
      }
    ]
  },
  {
    id: 24,
    conversationId: 3,
    senderId: 4, // Emma
    text: 'Thank you! I\'ll send the item back right away.',
    timestamp: '2023-06-28T10:24:03Z',
    isRead: false
  },

  // Conversation 4 - James Wilson
  {
    id: 25,
    conversationId: 4,
    senderId: 5, // James
    text: 'Hello, I\'m interested in the new smartphone models you have.',
    timestamp: '2023-06-27T15:42:10Z',
    isRead: true
  },
  {
    id: 26,
    conversationId: 4,
    senderId: 1, // Admin
    text: 'Hi James, we have several new models available. What features are most important to you?',
    timestamp: '2023-06-27T15:45:33Z',
    isRead: true
  },
  {
    id: 27,
    conversationId: 4,
    senderId: 5, // James
    text: 'I\'m mainly looking for good camera quality and battery life.',
    timestamp: '2023-06-27T15:48:27Z',
    isRead: true
  },
  {
    id: 28,
    conversationId: 4,
    senderId: 1, // Admin
    text: 'Great! I\'d recommend checking out our XS Pro model. It has a 108MP camera and 5000mAh battery.',
    timestamp: '2023-06-27T15:51:45Z',
    isRead: true
  },
  {
    id: 29,
    conversationId: 4,
    senderId: 1, // Admin
    text: 'Here\'s a link to the product:',
    timestamp: '2023-06-27T15:52:30Z',
    isRead: true,
    attachments: [
      {
        type: 'link',
        url: 'https://shofy.com/products/xs-pro-smartphone',
        preview: {
          title: 'XS Pro Smartphone - Shofy',
          description: 'The ultimate smartphone with 108MP camera and 5000mAh battery.',
          image: '/assets/img/products/iphone.png'
        }
      }
    ]
  },
  {
    id: 30,
    conversationId: 4,
    senderId: 5, // James
    text: 'This looks perfect! Is it available in blue?',
    timestamp: '2023-06-27T15:56:18Z',
    isRead: true
  },
  {
    id: 31,
    conversationId: 4,
    senderId: 1, // Admin
    text: 'Yes, it\'s available in blue, black, and silver.',
    timestamp: '2023-06-27T15:58:42Z',
    isRead: true
  },
  {
    id: 32,
    conversationId: 4,
    senderId: 5, // James
    text: 'Great, I\'ll place an order today. Thanks for your help!',
    timestamp: '2023-06-27T16:02:15Z',
    isRead: false
  },

  // Conversation 5 - Guest User
  {
    id: 33,
    conversationId: 5,
    senderId: 6, // Guest
    text: 'Hi, do you ship internationally?',
    timestamp: '2023-06-30T11:03:12Z',
    isRead: true
  },
  {
    id: 34,
    conversationId: 5,
    senderId: 1, // Admin
    text: 'Hello! Yes, we do ship internationally to most countries. Which country are you located in?',
    timestamp: '2023-06-30T11:05:45Z',
    isRead: true
  },
  {
    id: 35,
    conversationId: 5,
    senderId: 6, // Guest
    text: 'I\'m in Australia. How long would shipping take?',
    timestamp: '2023-06-30T11:07:33Z',
    isRead: true
  },
  {
    id: 36,
    conversationId: 5,
    senderId: 1, // Admin
    text: 'For Australia, standard shipping takes 10-14 business days, and express shipping takes 3-5 business days.',
    timestamp: '2023-06-30T11:10:20Z',
    isRead: true
  },
  {
    id: 37,
    conversationId: 5,
    senderId: 6, // Guest
    text: 'And what about customs fees?',
    timestamp: '2023-06-30T11:12:45Z',
    isRead: true
  },
  {
    id: 38,
    conversationId: 5,
    senderId: 1, // Admin
    text: 'Customers are responsible for any customs fees or import taxes. These vary by country and order value.',
    timestamp: '2023-06-30T11:15:18Z',
    isRead: true
  },
  {
    id: 39,
    conversationId: 5,
    senderId: 1, // Admin
    text: 'You can find more details on our shipping policy page:',
    timestamp: '2023-06-30T11:16:33Z',
    isRead: true,
    attachments: [
      {
        type: 'link',
        url: 'https://shofy.com/shipping-policy',
        preview: {
          title: 'Shipping Policy - Shofy',
          description: 'Learn about our international shipping options, delivery times, and fees.',
          image: '/assets/img/logo/logo.svg'
        }
      }
    ]
  },
  {
    id: 40,
    conversationId: 5,
    senderId: 6, // Guest
    text: 'Thanks for the information! I\'ll check it out.',
    timestamp: '2023-06-30T11:20:05Z',
    isRead: true
  },
  {
    id: 41,
    conversationId: 5,
    senderId: 1, // Admin
    text: 'You\'re welcome! Let me know if you have any other questions.',
    timestamp: '2023-06-30T11:21:55Z',
    isRead: true
  },
  {
    id: 42,
    conversationId: 5,
    senderId: 6, // Guest
    text: 'Actually, do you offer any discounts for first-time customers?',
    timestamp: '2023-06-30T11:24:30Z',
    isRead: false
  }
];

export const conversations: IConversation[] = [
  {
    id: 1,
    participants: [users[0], users[1]], // Admin and Sarah
    lastMessage: messages.find(m => m.id === 9),
    unreadCount: 1,
    isResolved: false
  },
  {
    id: 2,
    participants: [users[0], users[2]], // Admin and Michael
    lastMessage: messages.find(m => m.id === 16),
    unreadCount: 0,
    isResolved: true
  },
  {
    id: 3,
    participants: [users[0], users[3]], // Admin and Emma
    lastMessage: messages.find(m => m.id === 24),
    unreadCount: 1,
    isResolved: false
  },
  {
    id: 4,
    participants: [users[0], users[4]], // Admin and James
    lastMessage: messages.find(m => m.id === 32),
    unreadCount: 1,
    isResolved: false
  },
  {
    id: 5,
    participants: [users[0], users[5]], // Admin and Guest
    lastMessage: messages.find(m => m.id === 42),
    unreadCount: 1,
    isTyping: false,
    isResolved: false
  }
];
