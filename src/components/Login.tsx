import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateKeyPair, exportPublicKey } from '../lib/crypto';

export function Login() {
  const [username, setUsername] = useState('');
  const { setCurrentUser, setKeyPair } = useStore();

  const handleLogin = async () => {
    if (!username.trim()) return;

    // Generate encryption keys for the user
    const keyPair = await generateKeyPair();
    const publicKeyString = await exportPublicKey(keyPair.publicKey);

    const user = {
      id: crypto.randomUUID(),
      username: username.trim(),
      publicKey: publicKeyString,
    };

    setKeyPair(keyPair);
    setCurrentUser(user);
    useStore.getState().addUser(user);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Secure Chat
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            End-to-end encrypted messaging
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <button
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}