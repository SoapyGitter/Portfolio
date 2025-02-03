"use client";

import { FC, useState } from "react";
import { Github, Mail } from "lucide-react";
import Header from "./components/Header";
import ProjectCard from "./components/ProjectCard";
import ExperienceCard from "./components/ExperienceCard";
import SkillTag from "./components/SkillTag";
import { projects, skills, experiences } from "./data";
import { AnimatePresence, motion } from "framer-motion";
import Card from "./components/shared/Card";
import Title from "./components/shared/Title";
import Text from "./components/shared/Text";


const Home: FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const filteredProjects = selectedSkill
    ? projects.filter(project => 
        project.technologies?.some(tech => 
          tech.toLowerCase() === selectedSkill.toLowerCase()
        )
      )
    : projects;

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(currentSkill => 
      currentSkill === skill ? null : skill
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      <Header />
      <div className="relative pt-[180px] md:pt-[160px]">
        <main className="max-w-4xl mx-auto py-12 px-4">
          {/* About Section */}
          <section className="mb-12" id="about">
            <Title>Profile</Title>
            <Text
              text="Experienced in software development and web/mobile app
              enhancement, I bring 4 years of full stack expertise in C#, .NET
              Core, Angular, React, NextJS, ViteJS, and React Native. My
              proactive approach to improving business logic and optimizing
              applications has driven impactful results."
              className="text-gray-600 dark:text-gray-300 leading-relaxed"
              speed={10}
            />
          </section>

          {/* Skills Section */}
          <section className="mb-12">
            <Title>Skills</Title>
            <motion.div
              className="flex flex-wrap gap-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {skills.map((skill, index) => (
                <SkillTag 
                  key={index} 
                  skill={skill}
                  isSelected={selectedSkill === skill}
                  onClick={() => handleSkillClick(skill)}
                />
              ))}
            </motion.div>
          </section>

          {/* Projects Section */}
          <section className="mb-12" id="projects">
            <div className="flex items-center justify-between mb-4">
              <Title>Projects</Title>
              {selectedSkill && (
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
            <motion.div 
              className="flex flex-wrap gap-4"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* Experience Section */}
          <Title>Experience</Title>
          <section className="mb-12 flex flex-wrap gap-4" id="experience">
            {experiences.map((experience, index) => (
              <ExperienceCard key={index} {...experience} />
            ))}
          </section>

          {/* Education Section */}
          <section>
            <Title>Education</Title>

            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bachelor&apos;s in Computer Science
              </h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                Georgian Technical University • Tbilisi
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Sep 2022 — Present
              </p>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-900 dark:to-blue-900 text-white mt-12">
          <div className="max-w-4xl mx-auto py-8 px-4 flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Nikoloz Shekiladze</p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/SoapyGitter"
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
    </div>
  );
};

export default Home;
