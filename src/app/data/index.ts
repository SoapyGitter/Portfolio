import { Project, Experience } from "../types";

export const projects: Project[] = [
  {
    title: "Forest Friend",
    description:
      "Volunteer web application to plant trees in Georgia online or physically",
    link: "https://forestfriend.ge/",
    technologies: ["Angular", "SEO", "Angular Universal", "TypeScript"],
  },
  {
    title: "GetBot",
    description: "Google Chrome AI Companion Extension",
    link: "#",
    technologies: ["NextJS", "Chrome API", "TypeScript", "OpenAI"],
  },

  {
    title: "Car Auction",
    description:
      "B2B/B2C car auction platform with real-time/blind bidding, detailed listings, advanced search features to streamline transactions for car dealerships",
    link: "#",
    technologies: ["Angular", "C#", ".Net", "MongoDB", "Atlas Search", "SQL"],
  },
  {
    title: "Bono App",
    description: "Application for merging all Loyalty points into one space",
    link: "#",
    technologies: [
      "TypeScript",
      "React Native",
      "Expo",
      "C#",
      ".NET Core",
      "SQL",
      "React",
      "ViteJS",
      "ASP.NET Core",
    ],
  },
  {
    title: "HR Soft",
    description:
      "Soft which is responsible for improving Quality of work for Human Resources",
    link: "#",
    technologies: ["Angular", "TypeScript", "C#", ".Net", "SQL"],
  },
];
export const experiences: Experience[] = [
  {
    title: "Mobile Developer",
    company: "Digital Systems",
    location: "Tbilisi",
    period: "April 2024 — Present",
    responsibilities: [
      "Developed and maintained mobile apps using Expo and React Native",
      "Optimized app performance and user experience",
      "Integrated third-party APIs and libraries",
      "Ensured cross-platform compatibility (iOS and Android)",
      "Collaborated with UI/UX teams for seamless designs",
      "Implemented push notifications and deep linking features",
    ],
  },
  {
    website:"https://www.broccoli-agency.com/",
    logo: "https://www.broccoli-agency.com/images/Brand/logo-black.svg",
    title: "Software Developer",
    company: "Broccoli It",
    location: "Tbilisi",
    period: "Feb 2022 — Present",
    responsibilities: [
      "Creating business logic on technical level with existing application",
      "Improving existing application optimization on technical and business side",
      "Frequent communication with project owner to solve logic issues",
    ],
  },
];

export const skills: string[] = [
  "TypeScript",
  "Angular",
  "Angular Universal",
  "SEO",
  "React",
  "React Native",
  "Expo",
  "NextJS",
  "ViteJS",
  "C#",
  "ASP.NET Core",
  ".NET Core",
  "SQL",
  "MongoDB",
  "Atlas Search",
  "Chrome API",
  "OpenAI",
];
