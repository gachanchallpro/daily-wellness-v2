import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isDarkStatus?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isDarkStatus = false,
  containerRef,
}) => {
  return (
    <div className="h-[100dvh] w-full md:zine-backdrop md:p-4 lg:p-6 flex flex-col items-center justify-center overflow-hidden bg-[#FDF6E9] min-h-0">
      <div
        ref={containerRef}
        className={`relative w-full h-full md:max-w-5xl lg:max-w-6xl md:h-[min(900px,94dvh)] md:max-h-full md:border-[3px] md:border-[#141413] md:rounded-[24px] md:shadow-[8px_8px_0_#141413] flex flex-col overflow-hidden min-h-0 min-w-0 transition-colors duration-200 ${
          isDarkStatus ? 'bg-[#141413]' : 'bg-[#FDF6E9]'
        }`}
        role="region"
        aria-label="HCMC Daily Wellness"
      >
        {children}
      </div>
    </div>
  );
};
