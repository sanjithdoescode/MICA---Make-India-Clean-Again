import { motion } from 'framer-motion';
import { Camera, MapPin, Trophy, User } from 'lucide-react';

type ViewId = 'report' | 'disposal' | 'missions' | 'profile';

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof Camera;
}

const navItems: NavItem[] = [
  { id: 'report',   label: 'Report',   icon: Camera },
  { id: 'disposal', label: 'Find Bin', icon: MapPin },
  { id: 'missions', label: 'Missions', icon: Trophy },
  { id: 'profile',  label: 'Profile',  icon: User },
];

interface BottomNavProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-civic-slate-mid">
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center gap-1 px-4 py-3 relative"
            >
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <Icon
                  size={22}
                  className={isActive ? 'text-civic-green' : 'text-civic-slate-dark'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </motion.div>
              <span
                className={`text-[10px] font-sans font-semibold tracking-wide uppercase transition-colors ${
                  isActive ? 'text-civic-green' : 'text-civic-slate-dark'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-civic-green rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type { ViewId };
