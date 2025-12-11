import React from 'react';
import { ModuleId, NavItem } from '../types';
import { Cpu, Binary, Info, FileCode, GitMerge, RefreshCw, Map, Activity, Layers, Code, BookOpen } from 'lucide-react';

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: ModuleId.DIGITAL_TEXTBOOK,
    label: "The Silicon Chronicles",
    icon: BookOpen,
    description: "Interactive Textbook",
  },
  {
    id: ModuleId.BIT_FLIPPER,
    label: "Data Representation",
    icon: Binary,
    description: "Bits, Integers, Hex",
  },
  {
    id: ModuleId.GATE_LOGIC,
    label: "Digital Logic",
    icon: Cpu,
    description: "Gates & Truth Tables",
  },
  {
    id: ModuleId.COMBINATIONAL_CIRCUITS,
    label: "Combinational",
    icon: GitMerge,
    description: "Adders, MUX, DEMUX",
  },
  {
    id: ModuleId.SEQUENTIAL_LOGIC,
    label: "Sequential Logic",
    icon: RefreshCw,
    description: "Latches, State, Memory",
  },
  {
    id: ModuleId.MINI_CPU,
    label: "Mini Architecture",
    icon: FileCode,
    description: "Registers, RAM, Assembly",
  },
  {
    id: ModuleId.LC3_DATAPATH,
    label: "LC-3 Datapath",
    icon: Activity,
    description: "Fetch-Decode-Execute",
  },
  {
    id: ModuleId.ASM_DECODER,
    label: "Assembly Decoder",
    icon: Code,
    description: "Instruction Parsing",
  },
  {
    id: ModuleId.LC3_MEMORY_MAP,
    label: "LC-3 Memory Map",
    icon: Map,
    description: "I/O & Address Space",
  },
  {
    id: ModuleId.STACK_VISUALIZER,
    label: "Runtime Stack",
    icon: Layers,
    description: "Stack Frames & Functions",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onSelectModule }) => {
  return (
    <aside className="w-20 md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 h-full z-10 transition-all duration-300">
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
        <div className="w-8 h-8 rounded bg-gradient-to-tr from-neon-cyan to-blue-600 flex items-center justify-center shrink-0">
           <span className="font-bold text-white text-lg">Si</span>
        </div>
        <span className="ml-3 font-bold text-lg tracking-wider hidden md:block text-slate-100">SILICON</span>
      </div>

      <nav className="flex-1 py-6 px-2 md:px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="px-2 mb-2 hidden md:block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
          Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border relative overflow-hidden
                ${isActive 
                  ? 'bg-slate-800/80 border-slate-600 text-neon-cyan shadow-[0_0_15px_-3px_rgba(34,211,238,0.2)]' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan shadow-[0_0_8px_cyan]" />
              )}
              <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-neon-cyan' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <div className="hidden md:flex flex-col items-start text-left overflow-hidden">
                <span className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 truncate w-full group-hover:text-slate-400">
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 hidden md:block">
           <div className="flex items-center gap-2 mb-2 text-neon-amber">
             <Info className="w-4 h-4" />
             <span className="text-xs font-bold uppercase">Did you know?</span>
           </div>
           <p className="text-xs text-slate-400 leading-relaxed">
             The LC-3 is a von Neumann machine, meaning it stores both instructions and data in the same memory.
           </p>
        </div>
      </div>
    </aside>
  );
};