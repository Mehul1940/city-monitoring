'use client';
import {
  Home,
  Users,
  Settings,
  FolderKanban,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState, ReactNode, useEffect } from 'react';

type SidebarItemProps = {
  icon: ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ icon, text, active = false, onClick }: SidebarItemProps) => (
  <button
    role="menuitem"
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors duration-200 w-full text-left
      ${
        active
          ? 'bg-purple-600/10 text-purple-300 font-semibold border-l-4 border-purple-500'
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      }
      focus:outline-none focus:ring-2 focus:ring-purple-500`}
    aria-current={active ? 'page' : undefined}
  >
    <span className={`transition-colors ${active ? 'text-purple-400' : 'text-gray-400'}`}>
      {icon}
    </span>
    <span className="text-sm">{text}</span>
  </button>
);

const sidebarItems = [
  { icon: <Home size={20} />, text: 'Dashboard', active: true },
  { icon: <Users size={20} />, text: 'Departments' },
  { icon: <Users size={20} />, text: 'Users' },
  { icon: <FolderKanban size={20} />, text: 'Projects' },
  { icon: <Settings size={20} />, text: 'Settings' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Disable scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        aria-label="Toggle Sidebar"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-gray-300 rounded-md shadow-md hover:text-white lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gray-900 shadow-xl border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:h-auto lg:w-64`}
      >
        <div className="flex flex-col h-full p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                INSIGHT
              </h1>
            </div>
            <button
              aria-label="Close sidebar"
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-300 hover:text-white p-1"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1" role="menu">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                active={item.active}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-700">
            <SidebarItem
              icon={<LogOut size={20} />}
              text="Logout"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          role="presentation"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
