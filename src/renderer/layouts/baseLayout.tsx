import React, { useEffect, useRef, useState } from 'react';
import TwoSections from '../layoutComponents/twoSections';
import LexicalTest from '../components/LexicalTest';

const BaseLayout = () => {
  const minW = 200;
  const maxW = 700;
  return (
    <div className="w-screen h-screen">
      <TwoSections
        minWidth={minW}
        maxWidth={maxW}
        leftSection={'wewe'}
        rightSection={
          <div className="p-4">
            <LexicalTest />
          </div>
        }
      />
    </div>
  );
};

export default BaseLayout;
