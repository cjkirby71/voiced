// src/App.jsx
import React from "react";
import Routes from "./Routes";
import AppProvider from './context';

function App() {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
}

export default App;