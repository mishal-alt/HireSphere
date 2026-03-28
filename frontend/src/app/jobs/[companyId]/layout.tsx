import React from 'react';

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {children}
    </div>
  );
}
