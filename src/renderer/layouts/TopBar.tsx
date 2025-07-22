import React, { ReactElement } from 'react';

const TopBar = ({
  children,
  top,
}: {
  children: ReactElement;
  top?: ReactElement;
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div>{top}</div>
      <div className='overflow-auto'>{children}</div>
    </div>
  );
};

export default TopBar;
