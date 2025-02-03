import { FC } from "react";
import { motion } from "framer-motion";

const Title: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.h2
      className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.h2>
  );
};

export default Title;
