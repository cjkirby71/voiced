// src/context/index.jsx
import React from 'react';
import { UserProvider } from './UserContext';
import { PollProvider } from './PollContext';

// Combined context provider
export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <PollProvider>
        {children}
      </PollProvider>
    </UserProvider>
  );
};

// Export individual providers and hooks
export { UserProvider, useUser } from './UserContext';
export { PollProvider, usePoll } from './PollContext';

// Export default as AppProvider
export default AppProvider;