import { FC } from 'react';
import { motion } from 'framer-motion';

interface SkillTagProps {
  skill: string;
}

const SkillTag: FC<SkillTagProps> = ({ skill }) => {
  return (
    <motion.span 
      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      {skill}
    </motion.span>
  );
};

export default SkillTag;