import React, { useState } from 'react';
import { ProfessorNote } from '../ProfessorNote';
import { Search, Map, Keyboard, Monitor, Cpu, Info } from 'lucide-react';

type ZoneType = 'TRAP' | 'INTERRUPT' | 'OS' | 'USER' | 'IO' | 'NONE';

interface MemoryZone {
  id: ZoneType;
  label: string;
  start: number;
  end: number;
  color: string;
  desc: string;
  heightClass: string; // Tailwind class for schematic height
  isSmall?: boolean;
}

const ZONES: MemoryZone[] = [
  { 
    id: 'TRAP', 
    label: 'Trap Vector Table', 
    start: 0x0000, 
    end: 0x00FF, 
    color: 'border-red-500 bg-red-500/10 text-red-400', 
    desc: 'Contains 8-bit addresses (vectors) for System Calls like GETC (x20) and PUTS (x22). The OS reads this table to find where the actual code for these "Traps" lives.',
    heightClass: 'h-16',
    isSmall: true
  },
  { 
    id: 'INTERRUPT', 
    label: 'Interrupt Vector Table', 
    start: 0x0100, 
    end: 0x01FF, 
    color: 'border-orange-500 bg-orange-500/10 text-orange-400', 
    desc: 'Contains addresses for Interrupt Service Routines (ISRs). Used when hardware (like a keyboard) needs immediate attention.',
    heightClass: 'h-16',
    isSmall: true
  },
  { 
    id: 'OS', 
    label: 'Operating System & Stack', 
    start: 0x0200, 
    end: 0x2FFF, 
    color: 'border-slate-500 bg-slate-500/10 text-slate-300', 
    desc: 'The code for the Operating System itself resides here, along with the System Stack used for interrupts and traps.',
    heightClass: 'h-32' 
  },
  { 
    id: 'USER', 
    label: 'User Program Space', 
    start: 0x3000, 
    end: 0xFDFF, 
    color: 'border-neon-emerald bg-neon-emerald/10 text-neon-emerald', 
    desc: 'This is where YOUR code lives. By convention, most LC-3 programs start at .ORIG x3000.',
    heightClass: 'h-96' 
  },
  { 
    id: 'IO', 
    label: 'Device Registers (MMIO)', 
    start: 0xFE00, 
    end: 0xFFFF, 
    color: 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan', 
    desc: 'Memory Mapped I/O. These are not real memory cells! Writing to these addresses controls hardware devices.',
    heightClass: 'h-24',
    isSmall: true
  },
];

export const Lc3MemoryMap: React.FC = () => {
  const [highlightedZone, setHighlightedZone] = useState<ZoneType>('NONE');
  const [searchVal, setSearchVal] = useState('');
  const [searchValueInt, setSearchValueInt] = useState<number | null>(null);
  const [searchError, setSearchError] = useState('');
  const [ioExpanded, setIoExpanded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setIoExpanded(false);
    
    // Parse "x3000" or "0x3000" or "12288"
    let val = searchVal.trim();
    let num = NaN;
    
    if (val.toLowerCase().startsWith('x')) {
      num = parseInt(val.substring(1), 16);
    } else if (val.toLowerCase().startsWith('0x')) {
      num = parseInt(val.substring(2), 16);
    } else {
      num = parseInt(val, 10);
    }

    if (isNaN(num) || num < 0 || num > 0xFFFF) {
      setSearchError('Invalid Address. Use hex (x3000) or decimal.');
      setHighlightedZone('NONE');
      setSearchValueInt(null);
      return;
    }

    setSearchValueInt(num);

    // Find Zone
    const zone = ZONES.find(z => num >= z.start && num <= z.end);
    if (zone) {
      setHighlightedZone(zone.id);
      if (zone.id === 'IO') setIoExpanded(true);
    } else {
      setHighlightedZone('NONE');
    }
  };

  const toHex = (n: number) => 'x' + n.toString(16).toUpperCase().padStart(4, '0');

  const activeZoneData = ZONES.find(z => z.id === highlightedZone);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          LC-3 Memory Map
          <ProfessorNote 
            title="The Address Space" 
            content="The LC-3 has a 16-bit address space, meaning it can address 2^16 (65,536) unique locations. However, not all locations are for data storage. Some are reserved for the OS, and others act as portals to hardware devices."
          />
        </h2>
        <p className="text-slate-400">
          Explore the memory layout. Search for an address to see where it lives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Info */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Search Box */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
             <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Search className="w-4 h-4 text-neon-cyan" /> Address Lookup
             </h3>
             <form onSubmit={handleSearch} className="flex gap-2">
               <input 
                 type="text" 
                 placeholder="e.g. x3000, xFE00" 
                 className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 font-mono text-white focus:border-neon-cyan focus:outline-none"
                 value={searchVal}
                 onChange={(e) => setSearchVal(e.target.value)}
               />
               <button 
                 type="submit"
                 className="bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50 px-4 py-2 rounded-lg font-bold hover:bg-neon-cyan/20 transition-colors"
               >
                 GO
               </button>
             </form>
             {searchError && <p className="text-red-400 text-xs mt-2">{searchError}</p>}
             
             {searchValueInt !== null && !searchError && (
               <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-700 font-mono text-sm">
                 <div className="flex justify-between text-slate-400">
                   <span>Hex: {toHex(searchValueInt)}</span>
                   <span>Dec: {searchValueInt}</span>
                 </div>
               </div>
             )}
          </div>

          {/* Info Panel */}
          <div className={`
            border rounded-xl p-6 transition-all duration-300 min-h-[200px] flex flex-col justify-center
            ${activeZoneData 
              ? activeZoneData.color.replace('text-', 'border-').replace('bg-', 'shadow-[0_0_30px_-10px_currentColor] ')
              : 'border-slate-800 bg-slate-900/50'
            }
          `}>
             {activeZoneData ? (
               <div className="animate-fadeIn">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className={`text-xl font-bold ${activeZoneData.color.split(' ')[2]}`}>{activeZoneData.label}</h3>
                   <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-slate-400">
                     {toHex(activeZoneData.start)} - {toHex(activeZoneData.end)}
                   </span>
                 </div>
                 <p className="text-slate-300 leading-relaxed text-sm">
                   {activeZoneData.desc}
                 </p>
               </div>
             ) : (
               <div className="text-center text-slate-500">
                 <Map className="w-12 h-12 mx-auto mb-3 opacity-20" />
                 <p>Select a memory zone or search for an address to see details.</p>
               </div>
             )}
          </div>

          {/* I/O Expansion Panel */}
          {(ioExpanded || highlightedZone === 'IO') && (
            <div className="bg-slate-900 border border-neon-cyan/50 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.15)] animate-slideUp">
               <div className="bg-neon-cyan/10 p-3 border-b border-neon-cyan/30 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-neon-cyan">
                   <Cpu className="w-4 h-4" />
                   <span className="font-bold text-sm tracking-wider">MEMORY MAPPED I/O</span>
                 </div>
                 <ProfessorNote title="Memory Mapped I/O" content="Instead of special instructions like 'IN' or 'OUT', the LC-3 just uses LOAD and STORE. To read a key, you load from xFE02. To write to the screen, you store to xFE06." />
               </div>
               
               <div className="divide-y divide-slate-800">
                  <IoRegister 
                    addr="xFE00" label="KBSR" name="Keyboard Status Reg" 
                    desc="Bit [15] is 1 if a new key has been typed." 
                    icon={Keyboard} 
                    active={searchValueInt === 0xFE00}
                  />
                  <IoRegister 
                    addr="xFE02" label="KBDR" name="Keyboard Data Reg" 
                    desc="Bits [7:0] contain the ASCII code of the typed key." 
                    icon={Keyboard} 
                    active={searchValueInt === 0xFE02}
                  />
                  <IoRegister 
                    addr="xFE04" label="DSR" name="Display Status Reg" 
                    desc="Bit [15] is 1 if the monitor is ready for a new char." 
                    icon={Monitor} 
                    active={searchValueInt === 0xFE04}
                  />
                  <IoRegister 
                    addr="xFE06" label="DDR" name="Display Data Reg" 
                    desc="Write ASCII code to Bits [7:0] to output to screen." 
                    icon={Monitor} 
                    active={searchValueInt === 0xFE06}
                  />
                  <IoRegister 
                    addr="xFFFE" label="MCR" name="Machine Control Reg" 
                    desc="Bit [15] controls the clock. Clear it to HALT." 
                    icon={Cpu} 
                    active={searchValueInt === 0xFFFE}
                  />
               </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: The Memory Map Tower */}
        <div className="lg:col-span-7 flex justify-center py-4 bg-slate-900/50 rounded-xl border border-slate-800">
           <div className="w-64 flex flex-col relative shadow-2xl">
              {/* Header Label */}
              <div className="absolute -top-6 left-0 right-0 text-center text-[10px] font-mono text-slate-500">
                 x0000 (Top of Memory)
              </div>

              {ZONES.map((zone) => {
                const isHighlighted = highlightedZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                        setHighlightedZone(zone.id);
                        if (zone.id === 'IO') setIoExpanded(true);
                        else setIoExpanded(false);
                    }}
                    className={`
                      w-full relative group transition-all duration-300 flex flex-col justify-center items-center border-l-2 border-r-2 border-b-2 first:border-t-2
                      ${zone.heightClass}
                      ${zone.color}
                      ${isHighlighted 
                        ? 'brightness-125 scale-[1.03] z-10 shadow-2xl ring-2 ring-white/20' 
                        : 'opacity-80 hover:opacity-100 hover:brightness-110'
                      }
                    `}
                  >
                    {/* Label inside the block */}
                    <span className={`font-bold text-xs md:text-sm tracking-wider uppercase ${zone.isSmall ? 'scale-75 md:scale-100' : ''}`}>
                      {zone.label}
                    </span>
                    
                    {/* Range Tooltip on hover */}
                    <div className="absolute right-2 bottom-1 text-[9px] font-mono opacity-60">
                      {toHex(zone.end)}
                    </div>
                    {zone.id === ZONES[0].id && (
                       <div className="absolute right-2 top-1 text-[9px] font-mono opacity-60">
                         {toHex(zone.start)}
                       </div>
                    )}

                    {/* Special Marker for User Space */}
                    {zone.id === 'USER' && (
                       <div className="absolute top-8 w-full flex items-center">
                          <div className="h-px bg-current w-full opacity-50 flex-1"></div>
                          <div className="px-2 text-[10px] font-mono opacity-80 border rounded border-current bg-slate-900/50">
                             .ORIG x3000
                          </div>
                          <div className="h-px bg-current w-full opacity-50 flex-1"></div>
                       </div>
                    )}
                  </button>
                );
              })}
              
              <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-mono text-slate-500">
                 xFFFF (Bottom of Memory)
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const IoRegister: React.FC<{ addr: string; label: string; name: string; desc: string; icon: any; active: boolean }> = 
({ addr, label, name, desc, icon: Icon, active }) => (
  <div className={`p-3 flex items-start gap-3 transition-colors ${active ? 'bg-neon-cyan/20' : 'hover:bg-slate-800'}`}>
     <div className={`p-2 rounded bg-slate-900 border ${active ? 'border-neon-cyan text-neon-cyan' : 'border-slate-700 text-slate-500'}`}>
        <Icon className="w-4 h-4" />
     </div>
     <div className="flex-1">
        <div className="flex justify-between items-center mb-0.5">
           <span className={`font-mono font-bold text-sm ${active ? 'text-neon-cyan' : 'text-slate-300'}`}>
              {label} <span className="text-xs opacity-50 font-sans">({addr})</span>
           </span>
        </div>
        <div className="text-xs text-slate-400 font-bold mb-0.5">{name}</div>
        <div className="text-[10px] text-slate-500 leading-tight">{desc}</div>
     </div>
  </div>
);