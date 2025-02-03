import { FC, useState, useEffect } from "react";
import { Mail, MapPin, Sun, Moon } from "lucide-react";
import PongBackground from "./PongBackground";
import { useTheme } from "../providers/ThemeProvider";

const Header: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);
      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        !isVisible ? '-translate-y-full' : 'translate-y-0'
      } bg-gradient-to-r from-indigo-600/80 to-blue-500/80 dark:from-indigo-900/80 dark:to-blue-900/80 backdrop-blur-md backdrop-saturate-150`}
    >
      <PongBackground />
      <div className="relative max-w-4xl mx-auto py-6 md:py-8 px-4 z-10">
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
          <div className="flex-1 pr-12 sm:pr-0"> {/* Added right padding for theme button space */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white break-words">
              Nikoloz Shekiladze
            </h1>
            <p className="mt-2 text-lg sm:text-xl text-indigo-100">
              Web/Mobile/Game Developer
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="https://maps.google.com/?q=Tbilisi,Georgia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-100 hover:text-white transition-colors group"
              >
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="group-hover:underline">Tbilisi, Georgia</span>
              </a>
              <a
                href="mailto:nikashekiladze@gmail.com"
                className="flex items-center text-indigo-100 hover:text-white transition-colors group"
              >
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="group-hover:underline break-all">
                  nikashekiladze@gmail.com
                </span>
              </a>
            </div>
          </div>
          <div className="absolute sm:relative right-4 top-0 sm:right-auto sm:top-auto sm:flex sm:flex-col gap-4 sm:mt-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-white" />
              ) : (
                <Sun className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;