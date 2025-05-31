import React, { useEffect, useRef, useState } from 'react';
import TwoSections from './twoSections';

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
          <TwoSections leftSection={'wood'} rightSection={'here lol'} />
        }
      />
    </div>
  );
};

export default BaseLayout;
