'use client'

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import ExperienceCard from './components/ExperienceCard';
import SkillTag from './components/SkillTag';
import { projects, skills, experiences } from './data';

const Home: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* About Section */}
        <section className="mb-12" id="about">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
          <p className="text-gray-600 leading-relaxed">
            Experienced in software development and web/mobile app enhancement, I bring
            4 years of full stack expertise in C#, .NET Core, Angular, React, NextJS, ViteJS, and
            React Native. My proactive approach to improving business logic and optimizing
            applications has driven impactful results.
          </p>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <motion.h2 
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Skills
          </motion.h2>
          <motion.div 
            className="flex flex-wrap gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            {skills.map((skill, index) => (
              <SkillTag key={index} skill={skill} />
            ))}
          </motion.div>
        </section>

        {/* Projects Section */}
        <section className="mb-12" id="projects">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-12" id="experience">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">
              Bachelor's in Computer Science
            </h3>
            <p className="text-indigo-600 font-medium">Georgian Technical University • Tbilisi</p>
            <p className="text-gray-500 text-sm">Sep 2022 — Present</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white mt-12">
        <div className="max-w-4xl mx-auto py-8 px-4 flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Nikoloz Shekiladze</p>
          <div className="flex space-x-4">
            <a 
              href="https://github.com" 
              className="hover:text-indigo-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="mailto:nikashekiladze@gmail.com" 
              className="hover:text-indigo-200 transition-colors"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;