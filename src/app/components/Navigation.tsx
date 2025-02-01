import { FC } from 'react';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export const Navigation: FC = () => (
  <nav className="bg-white shadow-sm">
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold">NS</span>
          </div>
        </div>
        <div className="flex items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </nav>
);
