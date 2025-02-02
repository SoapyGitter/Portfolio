'use client'
import { FC } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { fadeInUp } from '../animations';


const ProjectCard: FC<Project> = ({ title, description, technologies }) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col flex-1 basis-80 flex-grow"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
      {technologies && (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <motion.span 
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;