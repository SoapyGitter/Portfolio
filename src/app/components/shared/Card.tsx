import { FC } from "react";
import { fadeInUp } from "../../animations";
import { motion } from "framer-motion";

const Card: FC<{ children: React.ReactNode, className?: string  }> = ({ children, className }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={"bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col flex-1 basis-80 flex-grow " + className}
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
