import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Task Manager Pro</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, User</span>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-blue-600 font-bold">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;