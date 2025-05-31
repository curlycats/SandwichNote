// src/App.tsx
import React, { ReactElement, useState } from 'react';
// import './styles/baseTags.css';
import './styles/lexcial.css';
import './styles/global.css';
import LexicalTest from './components/LexicalTest';
import 'tailwindcss/tailwind.css';
import BaseLayout from './layouts/baseLayout';

const App: React.FC = () => {
  return (
    <BaseLayout />
    // <div className="bg-green-300 p-16">
    //   <LexicalTest />
    // </div>
  );
};

export default App;
