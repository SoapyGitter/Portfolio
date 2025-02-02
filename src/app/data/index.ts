import { Project, Experience } from '../types'

export const projects: Project[] = [
  {
    title: 'Forest Friend',
    description: 'Volunteer web application to plant trees in Georgia online or physically',
    link: '#',
    technologies: ['Angular', 'SEO', 'Angular Universal']
  },
  {
    title: 'GetBot',
    description: 'Google Chrome AI Companion Extension',
    link: '#',
    technologies: ['NextJS', 'Chrome API', 'OpenAI']
  },
  
  {
    title: 'HR Soft',
    description: 'Soft which is responsible for improving Quality of work for Human Resources',
    link: '#',
    technologies: ['Angular', 'TypeScript', "C#", ".Net", "SQL"]
  },
  {
    title: 'Bono App',
    description: 'Application for merging all Loyalty points into one space',
    link: '#',
    technologies: ['React Native', 'Expo', "C#", ".Net", "SQL", "React"]
  },
  {
    title: 'Car Auction',
    description: 'B2B/B2C car auction platform with real-time/blind bidding, detailed listings, advanced search features to streamline transactions for car dealerships',
    link: '#',
    technologies: ['Angular', "C#", ".Net", "MongoDB", "Atlas Search"]
  },
];
export const experiences: Experience[] = [
  {
    title: 'Software Developer',
    company: 'Broccoli It',
    location: 'Tbilisi',
    period: 'Feb 2022 — Present',
    responsibilities: [
      'Creating business logic on technical level with existing application',
      'Improving existing application optimization on technical and business side',
      'Frequent communication with project owner to solve logic issues'
    ]
  }, 
  {
    title: 'Mobile Developer',
    company: 'Digital Systems',
    location: 'Tbilisi',
    period: 'April 2024 — Present',
    responsibilities: [
      'Developed and maintained mobile apps using Expo and React Native',
      'Optimized app performance and user experience',
      'Integrated third-party APIs and libraries',
      'Ensured cross-platform compatibility (iOS and Android)',
      'Collaborated with UI/UX teams for seamless designs',
      'Implemented push notifications and deep linking features',
    ]
  }
];


export const skills: string[] = [
  'React Native', 'C#', 'ASP.NET Core', 'JavaScript', 'Angular', 
  'NextJS', 'ViteJS', 'HTTP/1.1', 'HTTP/2.0'
];