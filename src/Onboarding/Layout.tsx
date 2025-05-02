import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 border-b border-slate-100">
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex items-center">
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white shadow-sm py-4 mt-auto border-t border-slate-100">
        <div className="container mx-auto px-4">
          <p className="text-sm text-slate-400 text-center">
            © {new Date().getFullYear()} Pluto. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;