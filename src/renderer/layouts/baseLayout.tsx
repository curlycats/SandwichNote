import React, { useEffect, useRef, useState } from 'react';
import LexicalTest from '../components/LexicalTest';
import TableView from '../components/note-view/TableView';
import TwoSection from '../components/layout/TwoSection';

const BaseLayout = () => {
  const minW = 200;
  const maxW = 700;
  return (
    <div className="w-screen h-screen">
      <TwoSection
        minWidth={minW}
        maxWidth={maxW}
        leftSection={
          <div>
            <TableView />
          </div>
        }
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
