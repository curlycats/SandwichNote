import React, { ReactElement, useEffect, useRef, useState } from 'react';

type TwoSectionProps = {
  initalWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  leftSection?: ReactElement | string;
  rightSection?: ReactElement | string;
};

// Resizable two sections
const TwoSection: React.FC<TwoSectionProps> = ({
  initalWidth = 250,
  minWidth = 0,
  maxWidth = 99999,
  leftSection,
  rightSection,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(initalWidth);
  const [isDragging, setIsDragging] = useState<boolean>(false); // state for css change and rerendering
  const isDraggingRef = useRef<boolean>(false); // ref fo calculations when dragging
  const containerRef = useRef<HTMLDivElement>(null);

  const onDragging = (e: MouseEvent): void => {
    if (isDraggingRef.current && containerRef.current) {
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const relativeX = e.clientX - containerLeft;
      const newWidth = Math.min(Math.max(minWidth, relativeX), maxWidth);
      setSidebarWidth(newWidth);
    }
  };

  const startDragging = (): void => {
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
      document.body.classList.add('select-none');
    }
  };

  const stopDragging = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      document.body.classList.remove('select-none');
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', onDragging);
    window.addEventListener('mouseup', stopDragging);
    return () => {
      window.removeEventListener('mousemove', onDragging);
      window.removeEventListener('mouseup', stopDragging);
      document.body.classList.remove('select-none'); // double save
    };
  }, []);

  return (
    <div className={`flex flex-nowrap w-full h-full`} ref={containerRef}>
      <div
        className={`Layout-SidePanel h-full overflow-auto`}
        style={{ width: sidebarWidth }}
      >
        {leftSection}
      </div>
      <div className={`relative w-[1px] bg-gray-300 h-full group`}>
        <div
          className="absolute -left-[2px] w-[6px] h-full cursor-col-resize z-50"
          onMouseDown={startDragging}
        />

        <div
          className={`absolute -left-[2px] w-[4px] h-full transition-all group-hover:bg-blue-500
            ${isDragging && 'bg-blue-500 '}
          `}
        />
      </div>
      <div className={`Layout-Content flex-1 overflow-auto`}>
        {rightSection}
      </div>
    </div>
  );
};

export default TwoSection;
