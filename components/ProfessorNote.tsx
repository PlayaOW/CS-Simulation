import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GraduationCap, X } from 'lucide-react';

interface ProfessorNoteProps {
  title: string;
  content: string;
}

export const ProfessorNote: React.FC<ProfessorNoteProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Track coordinates and placement preference (top vs bottom)
  const [coords, setCoords] = useState({ top: 0, left: 0, height: 0, placement: 'top' });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      
      // Smart positioning: If the button is in the top ~250px of the screen, show tooltip BELOW.
      // Otherwise, default to showing it ABOVE.
      const showBelow = rect.top < 250;
      
      setCoords({
        top: rect.top,
        left: rect.left + rect.width / 2,
        height: rect.height,
        placement: showBelow ? 'bottom' : 'top'
      });
    }
    setIsOpen(!isOpen);
  };

  // Close on scroll to prevent the floating element from becoming detached
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setIsOpen(false);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  return (
    <>
      <div className="relative inline-block ml-2 align-middle">
        <button
          ref={buttonRef}
          onClick={toggleOpen}
          className={`group p-1.5 rounded-full transition-all duration-200 
            ${isOpen 
              ? 'bg-neon-amber text-slate-900 rotate-12' 
              : 'bg-slate-800 text-neon-amber hover:bg-slate-700'
            }`}
          aria-label="Professor's Note"
        >
          <GraduationCap className="w-4 h-4" />
        </button>
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center">
           {/* Backdrop to close on click */}
           <div className="absolute inset-0 bg-transparent" onClick={() => setIsOpen(false)} />

           {/* The Popup */}
           <div 
             className="absolute w-72 md:w-80 pointer-events-none transition-all duration-200"
             style={{ 
               // If placement is top: Position at button top minus margin, transform up 100%
               // If placement is bottom: Position at button bottom plus margin, no transform Y
               top: coords.placement === 'top' ? coords.top - 12 : coords.top + coords.height + 12,
               left: coords.left,
               transform: `translate(-50%, ${coords.placement === 'top' ? '-100%' : '0'})` 
             }}
           >
              <div className="pointer-events-auto relative bg-slate-800 border-2 border-neon-amber/50 rounded-xl shadow-[0_10px_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Header */}
                <div className="bg-slate-950/50 p-3 border-b border-slate-700 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-neon-amber/20 rounded">
                      <GraduationCap className="w-4 h-4 text-neon-amber" />
                    </div>
                    <span className="text-xs font-bold text-neon-amber uppercase tracking-wider">Professor's Note</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h4 className="font-bold text-slate-100 mb-2 text-sm">{title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {content}
                  </p>
                </div>
                
                {/* Arrow Visual (Dynamic Positioning) */}
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 border-neon-amber/50 rotate-45 transform
                    ${coords.placement === 'top' 
                      ? '-bottom-2 border-b-2 border-r-2' // Pointing down
                      : '-top-2 border-t-2 border-l-2'     // Pointing up
                    }
                  `}
                />
              </div>
           </div>
        </div>,
        document.body
      )}
    </>
  );
};