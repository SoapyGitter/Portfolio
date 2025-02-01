import { FC } from 'react';
import { motion } from 'framer-motion';
import { Experience } from '../types';
import { fadeInUp } from '../animations';

interface ExperienceCardProps extends Experience {}

const ExperienceCard: FC<ExperienceCardProps> = ({ 
  title, 
  company, 
  location, 
  period, 
  responsibilities 
}) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-indigo-100 transition-colors"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-indigo-600 font-medium mb-2">{company} • {location}</p>
      <p className="text-gray-500 text-sm mb-4">{period}</p>
      <ul className="list-disc pl-5 text-gray-600 space-y-2">
        {responsibilities.map((responsibility, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            {responsibility}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ExperienceCard;