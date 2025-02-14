import React from 'react';
import { useStore } from './store/useStore';
import { Login } from './components/Login';
import { ChatWindow } from './components/ChatWindow';

function App() {
  const { currentUser } = useStore();

  return (
    <div className="h-screen">
      {currentUser ? <ChatWindow /> : <Login />}
    </div>
  );
}

export default App;