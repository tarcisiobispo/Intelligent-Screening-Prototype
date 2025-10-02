import React from 'react';

interface MobileNavProps {
  currentPage: string;
}

export function MobileNav({ currentPage }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 lg:hidden" style={{zIndex: 999}}>
      <div className="flex">
        <a href="/Intelligent-Screening-Prototype/dashboard" className={`flex-1 flex flex-col items-center py-2 ${currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
          <span className="text-xs mt-1">Home</span>
        </a>
        <a href="/Intelligent-Screening-Prototype/documents" className={`flex-1 flex flex-col items-center py-2 ${currentPage === 'documents' ? 'text-blue-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs mt-1">Docs</span>
        </a>
        <a href="/Intelligent-Screening-Prototype/upload" className={`flex-1 flex flex-col items-center py-2 ${currentPage === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs mt-1">Upload</span>
        </a>
        <a href="/Intelligent-Screening-Prototype/tasks" className={`flex-1 flex flex-col items-center py-2 ${currentPage === 'tasks' ? 'text-blue-600' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs mt-1">Tasks</span>
        </a>
      </div>
    </div>
  );
}