import React, { useState } from 'react';
import { GraduationCap, X } from 'lucide-react';

interface ProfessorNoteProps {
  title: string;
  content: string;
}

export const ProfessorNote: React.FC<ProfessorNoteProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-2 align-middle">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group p-1.5 rounded-full transition-all duration-200 
          ${isOpen 
            ? 'bg-neon-amber text-slate-900 rotate-12' 
            : 'bg-slate-800 text-neon-amber hover:bg-slate-700'
          }`}
        aria-label="Professor's Note"
      >
        <GraduationCap className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 md:w-80">
          <div className="relative bg-slate-800 border-2 border-neon-amber/50 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-950/50 p-3 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-neon-amber/20 rounded">
                  <GraduationCap className="w-4 h-4 text-neon-amber" />
                </div>
                <span className="text-xs font-bold text-neon-amber uppercase tracking-wider">Professor's Note</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
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
            {/* Arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 border-b-2 border-r-2 border-neon-amber/50 rotate-45 transform"></div>
          </div>
        </div>
      )}
    </div>
  );
};