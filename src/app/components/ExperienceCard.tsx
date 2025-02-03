"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Experience } from "../types";
import Card from "./shared/Card";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const ExperienceCard: FC<Experience> = ({
  title,
  company,
  location,
  period,
  responsibilities,
  logo,
  website,
}) => {
  return (
    <Card className="basis-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                {company}
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {company}
              </span>
            )}
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              •
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              {location}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {period}
          </p>
        </div>
        {logo && (
          <div className="flex-shrink-0 ml-4">
            <Image
              src={logo}
              alt={`${company} logo`}
              width={300}
              height={300}
              className="w-20 h-20 object-contain rounded-lg"
            />
          </div>
        )}
      </div>
      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
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
    </Card>
  );
};

export default ExperienceCard;
