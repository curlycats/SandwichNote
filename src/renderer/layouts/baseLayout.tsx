import React, { useEffect, useRef, useState } from 'react';
import LexicalTest from '../components/LexicalTest';
import TableView from '../components/note-view/TableView';
import TwoSection from '../components/layout/TwoSection';
import TopBar from './TopBar';
import refreshUI from '../utils/refresh';

const E = window.electron;

const BaseLayout = () => {
  const minW = 200;
  const maxW = 700;
  return (
    <div className="w-screen h-screen">
      <TopBar
        top={
          <div className="w-full p-2 bg-blue-200">
            Nav
            <button
              onClick={() => {
                E.db.useTestData();
                refreshUI();
              }}
            >
              Use Test
            </button>
          </div>
        }
      >
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
      </TopBar>
    </div>
  );
};

export default BaseLayout;
