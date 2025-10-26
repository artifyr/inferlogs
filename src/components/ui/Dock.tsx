import { useAuth } from "@/contexts/AuthContext";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Home, FilePlus, Globe, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchModal } from '../SearchModal'; // Import the new modal

// Define the icons, adding the new search item
const DOCK_ITEMS = [
  { id: "home", label: "Home", icon: <Home className="h-full w-full" />, href: "/" },
  { id: "create", label: "Create Post", icon: <FilePlus className="h-full w-full" />, href: "/new" },
  { id: "search", label: "Search", icon: <Search className="h-full w-full" /> }, // Search item doesn't need a link
  { id: "website", label: "Inferlysis", icon: <Globe className="h-full w-full" />, href: "https://inferlysis.com/", isExternal: true },
];

export const Dock = () => {
  const mouseX = useMotionValue(Infinity);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const filteredDockItems = DOCK_ITEMS.filter(item => {
    if (item.id === 'create') {
      return isAuthenticated;
    }
    return true;
  });

  return (
    <>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="fixed bottom-4 left-1/2 hidden h-16 items-end gap-6 rounded-2xl border border-white/20 bg-black/40 px-4 pb-3 backdrop-blur-sm md:flex"
        style={{
          transform: "translateX(-50%)",
        }}
      >
        {filteredDockItems.map((item) => (
          <DockIcon
            key={item.id}
            mouseX={mouseX}
            // If the item is 'search', pass an onClick handler to open the modal
            onClick={item.id === 'search' ? () => setIsSearchModalOpen(true) : undefined}
            {...item}
          />
        ))}
      </motion.div>
      
      {/* Render the Search Modal and control its state */}
      <SearchModal 
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

interface DockIconProps {
  mouseX: MotionValue;
  id: string;
  icon: React.ReactNode;
  href?: string; // href is now optional
  label: string;
  isExternal?: boolean;
  onClick?: () => void; // Add onClick prop for non-link actions
}

// Individual Icon Component
const DockIcon = ({ mouseX, id, icon, href, label, isExternal = false, onClick }: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return (val as number) - (bounds.x + bounds.width / 2);
  });

  const scale = useTransform(distance, [-150, 0, 150], [1, 1.25, 1]);

  const scaleSpring = useSpring(scale, {
    mass: 0.5,
    stiffness: 200,
    damping: 12,
  });

  const content = (
    <motion.div
      ref={ref}
      style={{ scale: scaleSpring }}
      className="aspect-square w-10 cursor-pointer rounded-xl border border-white/10 bg-transparent p-2 text-white transition-colors hover:border-white/30"
    >
      {icon}
    </motion.div>
  );

  // Determine the trigger element based on props. If onClick exists, it's a button.
  let trigger;
  if (onClick) {
    trigger = <button type="button" onClick={onClick}>{content}</button>;
  } else if (isExternal) {
    trigger = (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  } else {
    trigger = (
      <Link to={href || '#'} id={id}>
        {content}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};
