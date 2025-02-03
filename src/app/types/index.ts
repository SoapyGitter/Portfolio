export interface Project {
    title: string;
    description: string;
    link: string;
    technologies?: string[];
    image?: string;
  }
  
  export interface Experience {
    title: string;
    company: string;
    location: string;
    period: string;
    responsibilities: string[];
    logo?: string; 
    website?: string;
  }
  
  export interface Education {
    degree: string;
    institution: string;
    location: string;
    period: string;
    details?: string;
  }
  