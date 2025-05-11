// src/App.tsx
import React, { ReactElement, useState } from 'react';
import './styles/baseTags.css';
import './styles/lexcial.css'
import LexicalTest from './components/LexicalTest';

const App: React.FC = () => {
  return <div style={{ padding: '16px' }}>
    <LexicalTest />
  </div>;
};

export default App;
