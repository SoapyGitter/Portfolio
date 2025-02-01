import { FC } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';
import { slideIn } from '../animations';

// app/components/Header.tsx
const Header: FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-blue-500">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <motion.h1 
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nikoloz Shekiladze
        </motion.h1>
        <motion.p 
          className="mt-2 text-xl text-indigo-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Web/Mobile Developer
        </motion.p>
        <motion.div 
          className="mt-4 flex items-center space-x-4"
          variants={slideIn}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center text-indigo-100">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Tbilisi, Georgia</span>
          </div>
          <div className="flex items-center text-indigo-100">
            <Mail className="h-5 w-5 mr-2" />
            <span>nikashekiladze@gmail.com</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;