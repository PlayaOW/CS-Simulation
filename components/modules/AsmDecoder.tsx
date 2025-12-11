import React, { useState } from 'react';
import { ProfessorNote } from '../ProfessorNote';

export const AsmDecoder: React.FC = () => {
  const [bits, setBits] = useState<number[]>(new Array(16).fill(0));

  const toggleBit = (idx: number) => {
    const newBits = [...bits];
    newBits[idx] = bits[idx] === 0 ? 1 : 0;
    setBits(newBits);
  };

  const bitStr = bits.join('');
  const opcodeVal = parseInt(bitStr.slice(0, 4), 2);
  const drVal = parseInt(bitStr.slice(4, 7), 2);
  const sr1Val = parseInt(bitStr.slice(7, 10), 2);
  const immFlag = bits[10] === 1;
  const imm5Val = parseInt(bitStr.slice(11, 16), 2);
  
  // Sign extend Imm5
  const imm5Signed = (imm5Val & 0x10) ? imm5Val - 32 : imm5Val;

  const getOpcodeInfo = (op: number) => {
     switch(op) {
       case 1: return { name: 'ADD', type: 'Operate' };
       case 5: return { name: 'AND', type: 'Operate' };
       case 9: return { name: 'NOT', type: 'Operate' };
       case 2: return { name: 'LD', type: 'Data Movement' };
       case 10: return { name: 'LDI', type: 'Data Movement' };
       case 6: return { name: 'LDR', type: 'Data Movement' };
       case 14: return { name: 'LEA', type: 'Data Movement' };
       case 3: return { name: 'ST', type: 'Data Movement' };
       case 11: return { name: 'STI', type: 'Data Movement' };
       case 7: return { name: 'STR', type: 'Data Movement' };
       case 0: return { name: 'BR', type: 'Control' };
       case 12: return { name: 'JMP', type: 'Control' };
       case 4: return { name: 'JSR', type: 'Control' };
       case 15: return { name: 'TRAP', type: 'System' };
       default: return { name: 'RES', type: 'Reserved' };
     }
  };

  const info = getOpcodeInfo(opcodeVal);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          Instruction Decoder
          <ProfessorNote 
            title="Machine Code" 
            content="Instructions are just 16-bit patterns. The CPU looks at the first 4 bits (Opcode) to decide what to do with the remaining 12 bits."
          />
        </h2>
        <p className="text-slate-400">
          Toggle the bits to build an LC-3 instruction. Watch the translation update instantly.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-10">
         {/* Bit Toggles */}
         <div className="flex flex-wrap justify-center gap-1 md:gap-2 mb-12">
            {bits.map((bit, idx) => {
              const pos = 15 - idx;
              let color = 'bg-slate-600';
              let borderColor = 'border-slate-700';
              let label = '';
              
              if (pos >= 12) { // Opcode
                 color = bit ? 'bg-orange-500' : 'bg-slate-700';
                 borderColor = 'border-orange-500';
                 if (pos === 15) label = 'OP';
              } else if (pos >= 9) { // DR
                 color = bit ? 'bg-neon-cyan' : 'bg-slate-700';
                 borderColor = 'border-neon-cyan';
                 if (pos === 11) label = 'DR';
              } else if (pos >= 6) { // SR1
                 color = bit ? 'bg-fuchsia-500' : 'bg-slate-700';
                 borderColor = 'border-fuchsia-500';
                 if (pos === 8) label = 'SR1';
              } else { // Rest
                 color = bit ? 'bg-slate-200 text-slate-900' : 'bg-slate-700';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                   <div className="text-[9px] font-mono text-slate-500 h-3">{pos}</div>
                   <button 
                     onClick={() => toggleBit(idx)}
                     className={`w-8 h-12 md:w-10 md:h-16 rounded flex items-center justify-center font-mono font-bold text-lg border-b-4 transition-all active:border-b-0 active:translate-y-1 ${color} ${borderColor}`}
                   >
                     {bit}
                   </button>
                   <div className="text-[9px] font-bold text-slate-400 uppercase h-3">{label}</div>
                </div>
              );
            })}
         </div>

         {/* Interpretation Panel */}
         <div className="bg-slate-900 rounded-xl p-8 border border-slate-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               
               {/* Assembly Output */}
               <div className="text-center md:text-left">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Assembly Translation</div>
                  <div className="text-4xl md:text-5xl font-mono font-bold text-white flex gap-3">
                     <span className="text-orange-400">{info.name}</span>
                     {(info.name === 'ADD' || info.name === 'AND') && (
                        <>
                           <span className="text-neon-cyan">R{drVal},</span>
                           <span className="text-fuchsia-400">R{sr1Val},</span>
                           {immFlag ? (
                              <span className="text-slate-200">#{imm5Signed}</span>
                           ) : (
                              <span className="text-slate-400">R{bits.slice(13,16).join('').toString()} (Reg)</span>
                           )}
                        </>
                     )}
                     {/* Simplified Logic for other opcodes for demo */}
                     {(info.name !== 'ADD' && info.name !== 'AND') && (
                        <span className="text-slate-600 text-2xl self-end">...</span>
                     )}
                  </div>
                  <div className="mt-2 text-sm text-slate-500 font-mono">
                     Opcode: {opcodeVal} ({parseInt(opcodeVal.toString(2), 2).toString(2).padStart(4,'0')})
                  </div>
               </div>

               {/* Legend / Info */}
               <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 w-full max-w-xs">
                  <h4 className="text-slate-300 font-bold mb-2 text-sm">Bit Fields</h4>
                  <ul className="space-y-2 text-xs font-mono">
                     <li className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-slate-400">Opcode (15-12)</span>
                     </li>
                     <li className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-neon-cyan rounded"></div>
                        <span className="text-slate-400">Destination Reg (11-9)</span>
                     </li>
                     <li className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-fuchsia-500 rounded"></div>
                        <span className="text-slate-400">Source Reg 1 (8-6)</span>
                     </li>
                  </ul>
                  {immFlag && (info.name === 'ADD' || info.name === 'AND') && (
                     <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-300">
                        <span className="font-bold text-white">Immediate Mode ON:</span> Using last 5 bits as a number (Imm5).
                     </div>
                  )}
               </div>

            </div>
         </div>
      </div>
    </div>
  );
};