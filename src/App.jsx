// src/App.jsx
import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { PollProvider } from './context/PollContext';
import 'styles/tailwind.css';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PollProvider>
          <Routes />
        </PollProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;