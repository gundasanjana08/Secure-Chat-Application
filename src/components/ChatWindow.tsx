import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store/useStore';
import { encryptMessage } from '../lib/crypto';

export function ChatWindow() {
  const [message, setMessage] = useState('');
  const { currentUser, messages, users, keyPair } = useStore();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSend = async () => {
    if (!message.trim() || !selectedUser || !keyPair) return;

    const targetUser = users.find(u => u.id === selectedUser);
    if (!targetUser) return;

    // Encrypt message with recipient's public key
    const encryptedContent = await encryptMessage(message, keyPair.publicKey);

    const newMessage = {
      id: crypto.randomUUID(),
      senderId: currentUser?.id || '',
      receiverId: selectedUser,
      content: encryptedContent,
      timestamp: Date.now(),
    };

    useStore.getState().addMessage(newMessage);
    setMessage('');
  };

  return (
    <div className="flex h-screen">
      {/* Users list */}
      <div className="w-64 bg-gray-50 border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-700">Users</h2>
          <div className="mt-4 space-y-2">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`w-full p-2 text-left rounded-lg ${
                  selectedUser === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                {user.username}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages
            .filter(m => 
              (m.senderId === currentUser?.id && m.receiverId === selectedUser) ||
              (m.senderId === selectedUser && m.receiverId === currentUser?.id)
            )
            .map(message => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.senderId === currentUser?.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}