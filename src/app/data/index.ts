import { Project, Experience, Education } from '../types'

export const projects: Project[] = [
  {
    title: 'Forest Friend',
    description: 'Volunteer web application to plant trees in Georgia online or physically',
    link: '#',
    technologies: ['React', 'Node.js', 'MongoDB']
  },
  {
    title: 'GetBot',
    description: 'Google Chrome AI Companion Extension',
    link: '#',
    technologies: ['JavaScript', 'Chrome API', 'OpenAI']
  },
  {
    title: 'Car Auction',
    description: 'B2B car auction platform with real-time/blind bidding, detailed listings, advanced search features to streamline transactions for car dealerships',
    link: '#',
    technologies: ['React', 'TypeScript', 'Node.js']
  },
  {
    title: 'HR Soft',
    description: 'Soft which is responsible for improving Quality of work for Human Resources',
    link: '#',
    technologies: ['React', 'TypeScript', '.NET']
  }
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