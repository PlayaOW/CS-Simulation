import React from 'react';
import { Book, Bookmark, ExternalLink } from 'lucide-react';
import { ModuleId } from '../types';

interface ReferenceManualProps {
  activeModule: ModuleId;
}

interface ReferenceContent {
  title: string;
  chapter: string;
  focus: string;
}

const MANUAL_CONTENT: Record<ModuleId, ReferenceContent> = {
  [ModuleId.DIGITAL_TEXTBOOK]: {
    title: "The Silicon Chronicles",
    chapter: "Introduction",
    focus: "Interactive Textbook mode. Select chapters from the sidebar."
  },
  [ModuleId.BIT_FLIPPER]: {
    title: "Data Representation",
    chapter: "Chapter 2: Bits, Data Types, and Operations",
    focus: "Sections 2.1 (The Bit), 2.2 (Integer Representation), and 2.2.4 (2's Complement)."
  },
  [ModuleId.GATE_LOGIC]: {
    title: "The Transistor & The Gate",
    chapter: "Chapter 3: Digital Logic Structures",
    focus: "Section 3.2 (Logic Gates)."
  },
  [ModuleId.COMBINATIONAL_CIRCUITS]: {
    title: "Combinational Logic",
    chapter: "Chapter 3: Digital Logic Structures",
    focus: "Section 3.3 (Combinational Logic Circuits). Note specifically the diagrams for the Full Adder and the Multiplexer."
  },
  [ModuleId.SEQUENTIAL_LOGIC]: {
    title: "Storage Elements",
    chapter: "Chapter 3: Digital Logic Structures",
    focus: "Section 3.4 (Storage Elements). Pay close attention to the concept of the \"R-S Latch\" and \"Gated D Latch.\""
  },
  [ModuleId.MINI_CPU]: {
    title: "The Von Neumann Model",
    chapter: "Chapter 4: The Von Neumann Model",
    focus: "Sections 4.1 (Basic Components) and 4.3 (Instruction Processing). Focus on the Fetch-Decode-Execute cycle logic."
  },
  [ModuleId.LC3_DATAPATH]: {
    title: "The LC-3 Datapath",
    chapter: "Chapter 5: The LC-3",
    focus: "Section 5.1 (The ISA) and 5.2 (Operate Instructions). Watch how data moves on the Bus during each phase."
  },
  [ModuleId.ASM_DECODER]: {
    title: "Assembly Language",
    chapter: "Chapter 6 & 7",
    focus: "Section 5.1.3 (Instruction Formats). Pay attention to the Opcode (bits 15-12) and Addressing Modes."
  },
  [ModuleId.LC3_MEMORY_MAP]: {
    title: "I/O & Traps",
    chapter: "Chapter 8 (I/O) & Chapter 9 (Traps)",
    focus: "The Memory Map (x0000-xFFFF). See Fig 8.1 for Device Registers (KBSR, KBDR) and Table A.2 for Trap Vectors."
  },
  [ModuleId.STACK_VISUALIZER]: {
    title: "Stack & Functions",
    chapter: "Chapter 10 (Stack) & Chapter 14 (C Functions)",
    focus: "Section 10.2 (Stack Protocol) and 14.3 (Activation Records). R6 is the Stack Pointer."
  }
};

export const ReferenceManual: React.FC<ReferenceManualProps> = ({ activeModule }) => {
  const content = MANUAL_CONTENT[activeModule];

  if (!content) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 max-w-[calc(100vw-3rem)] z-40 hidden md:block group">
      {/* Card Container */}
      <div className="bg-black/90 border border-emerald-900/50 rounded-lg overflow-hidden shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] backdrop-blur-md transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        
        {/* Header (Terminal Style) */}
        <div className="bg-emerald-950/30 p-2 border-b border-emerald-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Ref_Manual.txt
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-900/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-900/50"></div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 font-mono text-xs leading-relaxed relative">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,50,36,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>
          
          <div className="relative z-10 space-y-3">
             <div>
                <span className="text-emerald-700 font-bold uppercase block mb-1">Topic</span>
                <h4 className="text-emerald-300 font-bold text-sm border-b border-emerald-900/30 pb-1 inline-block">
                  {content.title}
                </h4>
             </div>

             <div>
                <div className="flex items-start gap-2 text-emerald-400/80 mb-1">
                   <Bookmark className="w-3 h-3 mt-0.5 shrink-0" />
                   <span className="font-bold">Required Reading:</span>
                </div>
                <p className="text-emerald-100/70 pl-5">
                   {content.chapter}
                </p>
             </div>

             <div>
                <div className="flex items-start gap-2 text-emerald-400/80 mb-1">
                   <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                   <span className="font-bold">Focus Areas:</span>
                </div>
                <p className="text-emerald-100/70 pl-5">
                   {content.focus}
                </p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black p-1.5 text-[10px] text-emerald-800 text-center font-mono border-t border-emerald-900/30">
           PATT & PATEL • 2ND EDITION
        </div>
      </div>
    </div>
  );
};