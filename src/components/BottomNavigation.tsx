
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Wrench, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNavigation = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: Wrench, label: 'Tools', path: '/tools' },
    { icon: Trophy, label: 'Quests', path: '/quests' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200",
                isActive
                  ? "text-green-600 bg-green-50 transform scale-105"
                  : "text-gray-600 hover:text-green-500"
              )
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
