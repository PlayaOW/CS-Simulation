import React, { useState } from 'react';
import { ProfessorNote } from '../ProfessorNote';
import { LogicGateType, GateDefinition } from '../../types';
import { Check, X } from 'lucide-react';

const GATES: Record<LogicGateType, GateDefinition> = {
  [LogicGateType.AND]: {
    type: LogicGateType.AND,
    label: "AND Gate",
    description: "Output is ON only if both inputs are ON.",
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 },
    ]
  },
  [LogicGateType.OR]: {
    type: LogicGateType.OR,
    label: "OR Gate",
    description: "Output is ON if at least one input is ON.",
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 1 },
    ]
  },
  [LogicGateType.XOR]: {
    type: LogicGateType.XOR,
    label: "XOR Gate",
    description: "Exclusive OR. Output is ON if inputs are different.",
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 },
    ]
  },
  [LogicGateType.NOT]: {
    type: LogicGateType.NOT,
    label: "NOT Gate",
    description: "Inverter. Output is the opposite of input A. Input B is ignored.",
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 1, b: 0, out: 0 },
    ]
  }
};

export const GateLogic: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<LogicGateType>(LogicGateType.AND);
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  // Calculate Output
  const gateDef = GATES[selectedGate];
  const aVal = inputA ? 1 : 0;
  const bVal = inputB ? 1 : 0;
  
  // Find matching row in truth table to determine output
  // For NOT gate, we only care about A
  const resultRow = gateDef.truthTable.find(row => 
    row.a === aVal && (selectedGate === LogicGateType.NOT ? true : row.b === bVal)
  );
  
  const output = resultRow ? resultRow.out === 1 : false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Logic Gates
            <ProfessorNote 
              title="Logic Gates" 
              content="Logic gates are the fundamental building blocks of digital circuits. They take binary inputs (0 or 1) and produce a binary output based on boolean logic rules."
            />
          </h2>
          <p className="text-slate-400">Construct basic digital circuits.</p>
        </div>
        
        {/* Gate Selector */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          {(Object.keys(GATES) as LogicGateType[]).map((type) => (
             <button
               key={type}
               onClick={() => setSelectedGate(type)}
               className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                 selectedGate === type 
                   ? 'bg-slate-600 text-white shadow-sm' 
                   : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               {type}
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visualization Canvas (Occupies 2 columns) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl relative overflow-hidden min-h-[400px] flex items-center justify-center">
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 opacity-20" 
              style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
          />
          
          <div className="relative z-10 w-full max-w-lg flex items-center justify-between px-4 md:px-12">
            
            {/* Inputs Column */}
            <div className="flex flex-col gap-16 md:gap-24">
              <InputSwitch label="Input A" value={inputA} onChange={setInputA} color="cyan" />
              <div className={selectedGate === LogicGateType.NOT ? 'opacity-20 pointer-events-none grayscale' : ''}>
                <InputSwitch label="Input B" value={inputB} onChange={setInputB} color="amber" />
              </div>
            </div>

            {/* Wires SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-[-1]" style={{ overflow: 'visible' }}>
               {/* Wire A */}
               <path 
                 d="M 80 140 C 150 140, 150 200, 220 200" 
                 fill="none" 
                 stroke={inputA ? '#22d3ee' : '#334155'} 
                 strokeWidth="4" 
                 strokeLinecap="round"
                 className="transition-colors duration-300"
               />
               {/* Wire B (Hidden for NOT) */}
               {selectedGate !== LogicGateType.NOT && (
                 <path 
                   d="M 80 260 C 150 260, 150 200, 220 200" 
                   fill="none" 
                   stroke={inputB ? '#fbbf24' : '#334155'} 
                   strokeWidth="4" 
                   strokeLinecap="round"
                   className="transition-colors duration-300"
                 />
               )}
               {/* Wire Output */}
               <line 
                 x1="380" y1="200" x2="450" y2="200" 
                 stroke={output ? '#10b981' : '#334155'} 
                 strokeWidth="4" 
                 strokeLinecap="round"
                 className="transition-colors duration-300"
               />
            </svg>

            {/* Gate Graphic */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-800 border-2 border-slate-600 rounded-xl flex flex-col items-center justify-center shadow-2xl relative">
              <span className="text-3xl md:text-5xl font-black text-slate-200">{selectedGate}</span>
              <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">{gateDef.label}</span>
              
              {/* Connector Points */}
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-8">
                 {/* Logic handles positioning internally */}
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col items-center gap-2">
              <div className={`
                w-16 h-16 rounded-full border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300
                ${output 
                  ? 'bg-neon-emerald border-emerald-400 shadow-[0_0_40px_#10b981]' 
                  : 'bg-slate-900 border-slate-700'
                }
              `}>
                <span className={`font-mono text-xl font-bold ${output ? 'text-slate-900' : 'text-slate-600'}`}>
                  {output ? '1' : '0'}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500 uppercase font-bold">Output</span>
            </div>
          </div>
        </div>

        {/* Truth Table Panel */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            Truth Table
            <span className="text-xs font-normal font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-700">
               {selectedGate}
            </span>
          </h3>
          
          <div className="flex-1 overflow-hidden rounded-lg border border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="py-2 px-3 text-left font-mono">A</th>
                  {selectedGate !== LogicGateType.NOT && (
                    <th className="py-2 px-3 text-left font-mono">B</th>
                  )}
                  <th className="py-2 px-3 text-right font-mono">OUT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {gateDef.truthTable.map((row, idx) => {
                  // Determine if this row is currently active
                  const isActive = row.a === aVal && (selectedGate === LogicGateType.NOT ? true : row.b === bVal);
                  
                  return (
                    <tr 
                      key={idx} 
                      className={`transition-colors duration-200 ${isActive ? 'bg-indigo-900/40' : 'hover:bg-slate-800/50'}`}
                    >
                      <td className={`py-2 px-3 font-mono ${isActive && inputA ? 'text-neon-cyan font-bold' : 'text-slate-400'}`}>
                        {row.a}
                      </td>
                      {selectedGate !== LogicGateType.NOT && (
                         <td className={`py-2 px-3 font-mono ${isActive && inputB ? 'text-neon-amber font-bold' : 'text-slate-400'}`}>
                           {row.b}
                         </td>
                      )}
                      <td className="py-2 px-3 text-right">
                        <span className={`
                          inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold
                          ${row.out 
                            ? (isActive ? 'bg-neon-emerald text-slate-900' : 'bg-emerald-900/30 text-emerald-400') 
                            : (isActive ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500')
                          }
                        `}>
                          {row.out}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-400 italic">
            {gateDef.description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface InputSwitchProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  color: 'cyan' | 'amber';
}

const InputSwitch: React.FC<InputSwitchProps> = ({ label, value, onChange, color }) => {
  const activeColorClass = color === 'cyan' ? 'bg-neon-cyan' : 'bg-neon-amber';
  const shadowClass = color === 'cyan' ? 'shadow-[0_0_15px_#22d3ee]' : 'shadow-[0_0_15px_#fbbf24]';

  return (
    <div className="flex items-center gap-4 relative z-20">
      <div 
        className="relative w-16 h-8 bg-slate-800 rounded-full cursor-pointer transition-colors border border-slate-600"
        onClick={() => onChange(!value)}
      >
        <div className={`
          absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center
          ${value 
            ? `translate-x-8 ${activeColorClass} text-slate-900 ${shadowClass}` 
            : 'translate-x-0 bg-slate-500 text-slate-300'
          }
        `}>
          {value ? <Check size={14} strokeWidth={4} /> : <X size={14} strokeWidth={3} />}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className={`font-mono text-lg font-bold ${value ? 'text-white' : 'text-slate-600'}`}>
          {value ? '1' : '0'}
        </span>
      </div>
    </div>
  );
}