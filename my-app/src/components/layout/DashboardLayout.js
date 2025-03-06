import React from 'react';

function DashboardLayout({ leftPanel, middlePanel, rightPanel }) {
  return (
    <div className="flex h-screen bg-gray-50 p-3">
      <div className="w-1/4 p-3 overflow-y-auto flex flex-col space-y-4">
        {leftPanel}
      </div>
      <div className="w-1/3 p-3 flex flex-col space-y-4">
        {middlePanel}
      </div>
      <div className="w-5/12 flex flex-col bg-white rounded-lg shadow-md">
        {rightPanel}
      </div>
    </div>
  );
}

export default DashboardLayout;