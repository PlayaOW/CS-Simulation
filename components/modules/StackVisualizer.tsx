import React, { useState } from 'react';
import { ProfessorNote } from '../ProfessorNote';
import { Layers, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';

export const StackVisualizer: React.FC = () => {
  // Stack grows downwards (addresses get smaller)
  // Let's simulate address space x4000 (top) down to x3FF0
  const [stack, setStack] = useState<{ addr: string; val: string; label?: string }[]>([]);
  const [r6, setR6] = useState(0x4000); // Initial Top of Stack

  const push = (val: string, label?: string) => {
    const newR6 = r6 - 1;
    const newItem = { addr: 'x' + newR6.toString(16).toUpperCase(), val, label };
    setStack([newItem, ...stack]);
    setR6(newR6);
  };

  const pop = () => {
    if (stack.length === 0) return;
    setStack(stack.slice(1));
    setR6(r6 + 1);
  };

  const callFunction = () => {
     // Push Frame: Addr, Dyn Link, Ret Addr
     const newR6 = r6 - 3;
     const items = [
        { addr: 'x' + (r6-3).toString(16).toUpperCase(), val: 'x0000', label: 'Local Var' },
        { addr: 'x' + (r6-2).toString(16).toUpperCase(), val: 'x3FFF', label: 'Dyn Link (FP)' },
        { addr: 'x' + (r6-1).toString(16).toUpperCase(), val: 'x3005', label: 'Ret Addr' },
     ];
     setStack([...items, ...stack]);
     setR6(newR6);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          Runtime Stack
          <ProfessorNote 
            title="The Stack" 
            content="A Last-In, First-Out (LIFO) data structure. In the LC-3 (and most systems), the stack grows towards LOWER memory addresses. R6 is the Stack Pointer."
          />
        </h2>
        <p className="text-slate-400">
          Visualize how function calls manage memory using Stack Frames.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Controls */}
         <div className="space-y-4">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <h3 className="text-sm font-bold text-slate-300 uppercase mb-4">Stack Operations</h3>
               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => push('x1234')}
                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold transition-all"
                  >
                     <ArrowDown className="w-4 h-4" /> PUSH Value
                  </button>
                  <button 
                    onClick={pop}
                    disabled={stack.length === 0}
                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                     <ArrowUp className="w-4 h-4" /> POP Value
                  </button>
                  <div className="h-px bg-slate-600 my-2"></div>
                  <button 
                    onClick={callFunction}
                    className="flex items-center justify-center gap-2 bg-neon-cyan text-slate-900 py-3 rounded-lg font-bold hover:bg-cyan-400 transition-all"
                  >
                     <Layers className="w-4 h-4" /> Call Function (Push Frame)
                  </button>
               </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">R6 (STACK POINTER)</span>
               </div>
               <div className="text-3xl font-mono text-neon-emerald font-bold">
                  x{r6.toString(16).toUpperCase()}
               </div>
            </div>
         </div>

         {/* Visualization */}
         <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 relative min-h-[400px] flex justify-center">
            {/* Base */}
            <div className="absolute bottom-0 w-32 h-4 bg-slate-700 rounded-t opacity-50"></div>
            <div className="absolute bottom-6 text-xs font-mono text-slate-500">x4000 (Base)</div>

            <div className="flex flex-col-reverse items-center w-full max-w-xs pb-12 gap-1 transition-all">
               {stack.map((item, idx) => (
                  <div key={item.addr} className="w-full h-12 bg-slate-800 border border-slate-600 rounded flex items-center justify-between px-4 animate-slideDown shadow-lg relative group">
                     <span className="font-mono text-xs text-slate-500">{item.addr}</span>
                     <span className="font-mono text-neon-cyan font-bold">{item.val}</span>
                     {item.label && (
                        <div className="absolute -right-24 bg-slate-700 text-white text-[10px] px-2 py-1 rounded">
                           {item.label}
                        </div>
                     )}
                     {/* R6 Pointer Indicator */}
                     {idx === stack.length - 1 && (
                        <div className="absolute -left-20 flex items-center gap-2 text-neon-emerald animate-pulse">
                           <span className="font-bold text-xs">R6</span>
                           <ArrowRight className="w-4 h-4" />
                        </div>
                     )}
                  </div>
               ))}
               {stack.length === 0 && (
                  <div className="text-slate-600 text-sm font-mono mt-10">Stack is Empty</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};