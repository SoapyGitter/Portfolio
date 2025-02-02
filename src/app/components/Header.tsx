'use client'
import { FC } from 'react';
import { Mail, MapPin } from 'lucide-react';
import PongBackground from './PongBackground';

const Header: FC = () => {
  return (
    <header className="relative bg-gradient-to-r from-indigo-600 to-blue-500 overflow-hidden">
      <PongBackground />
      <div className="relative max-w-4xl mx-auto py-16 px-4 z-10">
        <h1 className="text-4xl font-bold text-white">
          Nikoloz Shekiladze
        </h1>
        <p className="mt-2 text-xl text-indigo-100">
          Web/Mobile Developer
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center text-indigo-100">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Tbilisi, Georgia</span>
          </div>
          <div className="flex items-center text-indigo-100">
            <Mail className="h-5 w-5 mr-2" />
            <span>nikashekiladze@gmail.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;