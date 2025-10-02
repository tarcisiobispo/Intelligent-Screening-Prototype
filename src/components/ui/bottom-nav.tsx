import React from 'react';
import { LayoutDashboard, FileText, Upload, CheckSquare } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
}

export function BottomNav({ currentPage }: BottomNavProps) {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, href: '/Intelligent-Screening-Prototype/dashboard' },
    { id: 'documents', icon: FileText, href: '/Intelligent-Screening-Prototype/documents' },
    { id: 'upload', icon: Upload, href: '/Intelligent-Screening-Prototype/upload' },
    { id: 'tasks', icon: CheckSquare, href: '/Intelligent-Screening-Prototype/tasks' }
  ];

  return (
    <div 
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}
    >
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6" />
            </a>
          );
        })}
      </div>
    </div>
  );
}