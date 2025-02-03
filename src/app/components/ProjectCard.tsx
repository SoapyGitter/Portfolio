'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { Project } from '../types'
import Card from './shared/Card'

const ProjectCard: FC<Project> = ({ title, description, technologies }) => {
  return (
    <Card>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      </div>
      {technologies && (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <motion.span 
              key={index}
              className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      )}
    </Card>
  )
}

export default ProjectCard