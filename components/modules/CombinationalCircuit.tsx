import React, { useState } from 'react';
import { ProfessorNote } from '../ProfessorNote';
import { Check, X } from 'lucide-react';

type SubModule = 'HALF_ADDER' | 'FULL_ADDER' | 'MUX' | 'DEMUX';

export const CombinationalCircuit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubModule>('HALF_ADDER');

  return (
    <div className="space-y-6">
      {/* Intro Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          Combinational Circuits
          <ProfessorNote 
            title="Combinational Logic" 
            content="Circuits where the output is a pure function of the present inputs only. There is no 'memory' or history. Examples include math operations (Adders) and data routing (Multiplexers)."
          />
        </h2>
        <p className="text-slate-400">
          Visualize arithmetic and routing logic. Unlike Sequential logic, these circuits do not store state.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-2">
        <TabButton id="HALF_ADDER" label="Half Adder" active={activeTab} onClick={setActiveTab} />
        <TabButton id="FULL_ADDER" label="Full Adder" active={activeTab} onClick={setActiveTab} />
        <TabButton id="MUX" label="2-to-1 MUX" active={activeTab} onClick={setActiveTab} />
        <TabButton id="DEMUX" label="1-to-2 DEMUX" active={activeTab} onClick={setActiveTab} />
      </div>

      {/* Content Area */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-10 relative overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />
        
        {activeTab === 'HALF_ADDER' && <HalfAdder />}
        {activeTab === 'FULL_ADDER' && <FullAdder />}
        {activeTab === 'MUX' && <Multiplexer />}
        {activeTab === 'DEMUX' && <Demultiplexer />}
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const HalfAdder: React.FC = () => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);

  // Logic
  const sum = a !== b; // XOR
  const carry = a && b; // AND

  return (
    <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      <div className="flex flex-col gap-8 justify-center">
        <InputSwitch label="Input A" value={a} onChange={setA} color="cyan" />
        <InputSwitch label="Input B" value={b} onChange={setB} color="amber" />
      </div>

      <div className="relative h-64 md:col-span-1 flex items-center justify-center">
         {/* Circuit Visualization */}
         <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* XOR Gate (Sum) */}
            <path d="M 0 60 L 50 60" stroke={a ? '#22d3ee' : '#334155'} strokeWidth="3" />
            <path d="M 0 190 L 30 190 L 30 80 L 50 80" stroke={b ? '#fbbf24' : '#334155'} strokeWidth="3" fill="none" />
            <g transform="translate(50, 40)">
               <path d="M0,0 C30,0 40,15 40,30 C40,45 30,60 0,60 C10,45 10,15 0,0" fill="#1e293b" stroke="#94a3b8" strokeWidth="2"/>
               <path d="M-5,0 C5,15 5,45 -5,60" fill="none" stroke="#94a3b8" strokeWidth="2"/>
               <text x="15" y="35" fontSize="10" fill="#94a3b8" fontWeight="bold">XOR</text>
            </g>
            <path d="M 90 70 L 150 70" stroke={sum ? '#10b981' : '#334155'} strokeWidth="3" />

            {/* AND Gate (Carry) */}
            <path d="M 0 60 L 30 60 L 30 170 L 50 170" stroke={a ? '#22d3ee' : '#334155'} strokeWidth="3" fill="none" />
            <path d="M 0 190 L 50 190" stroke={b ? '#fbbf24' : '#334155'} strokeWidth="3" />
            <g transform="translate(50, 150)">
               <path d="M0,0 L20,0 C35,0 40,20 40,30 C40,40 35,60 20,60 L0,60 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2"/>
               <text x="10" y="35" fontSize="10" fill="#94a3b8" fontWeight="bold">AND</text>
            </g>
            <path d="M 90 180 L 150 180" stroke={carry ? '#10b981' : '#334155'} strokeWidth="3" />
         </svg>
      </div>

      <div className="flex flex-col gap-16 justify-center pl-8 md:pl-0">
        <OutputDisplay label="SUM (S)" value={sum} />
        <OutputDisplay label="CARRY (C)" value={carry} />
      </div>
    </div>
  );
};

const FullAdder: React.FC = () => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);

  // Full Adder Logic: Sum = A XOR B XOR Cin, Cout = (A AND B) OR (Cin AND (A XOR B))
  const axorb = a !== b;
  const sum = axorb !== cin;
  const cout = (a && b) || (cin && axorb);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      <div className="flex flex-col gap-6 justify-center">
        <InputSwitch label="Input A" value={a} onChange={setA} color="cyan" />
        <InputSwitch label="Input B" value={b} onChange={setB} color="amber" />
        <InputSwitch label="Carry In" value={cin} onChange={setCin} color="purple" />
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center gap-4 relative">
        <span className="text-xl font-bold text-slate-300">FULL ADDER</span>
        <div className="text-xs text-slate-500 text-center">
          Combines two half-adders to account for carried values from previous bits.
        </div>
        
        {/* Abstract Block Diagram */}
        <div className="w-32 h-32 bg-slate-800 border-2 border-slate-600 relative mt-4 shadow-lg flex items-center justify-center">
            <div className="absolute -left-2 top-4 w-2 h-2 bg-neon-cyan"></div>
            <div className="absolute -left-2 top-10 w-2 h-2 bg-neon-amber"></div>
            <div className="absolute -left-2 top-16 w-2 h-2 bg-fuchsia-500"></div>
            
            <div className="absolute -right-2 top-8 w-2 h-2 bg-neon-emerald shadow-[0_0_10px_#10b981]"></div>
            <div className="absolute -right-2 top-20 w-2 h-2 bg-neon-emerald shadow-[0_0_10px_#10b981]"></div>
            
            <span className="font-mono font-bold text-2xl text-slate-500 select-none">Σ</span>
        </div>
      </div>

      <div className="flex flex-col gap-12 justify-center pl-8 md:pl-0">
        <OutputDisplay label="SUM (S)" value={sum} />
        <OutputDisplay label="CARRY OUT" value={cout} />
      </div>
    </div>
  );
};

const Multiplexer: React.FC = () => {
  const [d0, setD0] = useState(false);
  const [d1, setD1] = useState(false);
  const [sel, setSel] = useState(false);

  const output = sel ? d1 : d0;

  return (
    <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-12 relative">
      {/* Control Signal Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-8 z-10">
         <InputSwitch label="Select (S)" value={sel} onChange={setSel} color="purple" />
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-24">
         <InputSwitch label="Data 0" value={d0} onChange={setD0} color="cyan" />
         <InputSwitch label="Data 1" value={d1} onChange={setD1} color="amber" />
      </div>

      {/* Visual MUX */}
      <div className="relative w-48 h-64">
        <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Wires from Inputs */}
            <path 
              d="M -50 40 L 40 40" 
              stroke={d0 ? '#22d3ee' : '#334155'} 
              strokeWidth="4" 
              className={sel ? 'opacity-20' : 'opacity-100'}
            />
            <path 
              d="M -50 220 L 40 220" 
              stroke={d1 ? '#fbbf24' : '#334155'} 
              strokeWidth="4" 
              className={!sel ? 'opacity-20' : 'opacity-100'}
            />

            {/* Trapezoid Body */}
            <path d="M 40 10 L 140 60 L 140 200 L 40 250 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

            {/* Select Line */}
            <path d="M 90 -40 L 90 35" stroke={sel ? '#e879f9' : '#334155'} strokeWidth="3" strokeDasharray="4 2" />
            <circle cx="90" cy="35" r="4" fill="#e879f9" />

            {/* Internal Path Visualization */}
            <path 
              d={!sel ? "M 40 40 L 90 40 L 140 130" : "M 40 220 L 90 220 L 140 130"}
              stroke={output ? '#10b981' : '#475569'}
              strokeWidth="4"
              fill="none"
              className="transition-all duration-300"
            />
            
            {/* Output Wire */}
            <path d="M 140 130 L 200 130" stroke={output ? '#10b981' : '#334155'} strokeWidth="4" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className="text-slate-500 font-bold font-mono rotate-90 text-xl tracking-widest">MUX</span>
        </div>
      </div>

      {/* Output */}
      <div>
        <OutputDisplay label="Output (Y)" value={output} />
      </div>
    </div>
  );
};

const Demultiplexer: React.FC = () => {
  const [d, setD] = useState(true); // Default to ON to show routing better
  const [sel, setSel] = useState(false);

  const y0 = !sel && d;
  const y1 = sel && d;

  return (
    <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-8 z-10">
         <InputSwitch label="Select (S)" value={sel} onChange={setSel} color="purple" />
      </div>

      <div>
         <InputSwitch label="Data In" value={d} onChange={setD} color="cyan" />
      </div>

      <div className="relative w-48 h-64">
        <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Input Wire */}
            <path d="M -40 130 L 40 130" stroke={d ? '#22d3ee' : '#334155'} strokeWidth="4" />

            {/* Trapezoid Body (Inverted for DEMUX) */}
            <path d="M 40 60 L 140 10 L 140 250 L 40 200 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

             {/* Select Line */}
             <path d="M 90 -40 L 90 35" stroke={sel ? '#e879f9' : '#334155'} strokeWidth="3" strokeDasharray="4 2" />
             <circle cx="90" cy="35" r="4" fill="#e879f9" />

            {/* Internal Path */}
            <path 
              d={!sel ? "M 40 130 L 90 130 L 140 40" : "M 40 130 L 90 130 L 140 220"}
              stroke={d ? '#22d3ee' : '#475569'}
              strokeWidth="4"
              fill="none"
              className="transition-all duration-300"
            />

            {/* Output Wires */}
            <path d="M 140 40 L 220 40" stroke={y0 ? '#10b981' : '#334155'} strokeWidth="4" className={sel ? 'opacity-20' : 'opacity-100'} />
            <path d="M 140 220 L 220 220" stroke={y1 ? '#10b981' : '#334155'} strokeWidth="4" className={!sel ? 'opacity-20' : 'opacity-100'} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className="text-slate-500 font-bold font-mono rotate-90 text-xl tracking-widest">DEMUX</span>
        </div>
      </div>

      <div className="flex flex-col gap-24">
        <OutputDisplay label="Output Y0" value={y0} />
        <OutputDisplay label="Output Y1" value={y1} />
      </div>
    </div>
  );
};


// --- SHARED UI HELPERS ---

const TabButton: React.FC<{ id: SubModule; label: string; active: SubModule; onClick: (id: SubModule) => void }> = ({ id, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
      active === id 
        ? 'bg-slate-700 text-white shadow-lg border border-slate-600' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
    }`}
  >
    {label}
  </button>
);

const InputSwitch: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void; color: 'cyan' | 'amber' | 'purple' }> = ({ label, value, onChange, color }) => {
  const colors = {
    cyan: 'bg-neon-cyan shadow-[0_0_15px_#22d3ee]',
    amber: 'bg-neon-amber shadow-[0_0_15px_#fbbf24]',
    purple: 'bg-fuchsia-400 shadow-[0_0_15px_#e879f9]',
  };
  
  return (
    <div className="flex items-center gap-3">
      <div 
        className="relative w-12 h-7 bg-slate-800 rounded-full cursor-pointer border border-slate-600 transition-colors"
        onClick={() => onChange(!value)}
      >
        <div className={`
          absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300
          ${value ? `translate-x-5 ${colors[color]} text-slate-900` : 'translate-x-0 bg-slate-500 text-slate-300'}
        `}>
          {value ? <Check size={12} strokeWidth={4} /> : <X size={12} strokeWidth={3} />}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
        <span className="font-mono font-bold text-slate-300">{value ? '1' : '0'}</span>
      </div>
    </div>
  );
};

const OutputDisplay: React.FC<{ label: string; value: boolean }> = ({ label, value }) => (
  <div className="flex items-center gap-3">
    <div className={`
      w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-xl
      ${value 
        ? 'bg-neon-emerald border-emerald-400 shadow-[0_0_20px_#10b981] text-slate-900' 
        : 'bg-slate-900 border-slate-700 text-slate-600'
      }
    `}>
      <span className="font-mono text-lg font-bold">{value ? '1' : '0'}</span>
    </div>
    <span className="text-xs font-mono font-bold text-slate-500 uppercase">{label}</span>
  </div>
);