import { create } from 'zustand';
import { generateKeyPair, exportPublicKey } from '../lib/crypto';

interface User {
  id: string;
  username: string;
  publicKey: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
}

interface ChatStore {
  currentUser: User | null;
  messages: Message[];
  users: User[];
  keyPair: CryptoKeyPair | null;
  setKeyPair: (keyPair: CryptoKeyPair) => void;
  setCurrentUser: (user: User) => void;
  addMessage: (message: Message) => void;
  addUser: (user: User) => void;
}

export const useStore = create<ChatStore>((set) => ({
  currentUser: null,
  messages: [],
  users: [],
  keyPair: null,
  setKeyPair: (keyPair) => set({ keyPair }),
  setCurrentUser: (user) => set({ currentUser: user }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  addUser: (user) => set((state) => ({ 
    users: [...state.users, user] 
  })),
}));