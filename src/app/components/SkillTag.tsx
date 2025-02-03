'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'

interface SkillTagProps {
  skill: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const SkillTag: FC<SkillTagProps> = ({ skill, isSelected = false, onClick }) => {
  return (
    <motion.span 
      className={`px-3 py-1 cursor-pointer 
        ${isSelected 
          ? 'bg-indigo-600 dark:bg-indigo-500 text-white' 
          : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/40'
        }
        rounded-full text-sm font-medium transition-colors`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {skill}
    </motion.span>
  )
}

export default SkillTag