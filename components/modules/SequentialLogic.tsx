import React, { useState, useEffect } from 'react';
import { ProfessorNote } from '../ProfessorNote';
import { Power, Activity } from 'lucide-react';

export const SequentialLogic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SR_LATCH' | 'D_LATCH'>('SR_LATCH');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          Sequential Logic
          <ProfessorNote 
            title="State & Memory" 
            content="Unlike Combinational logic, Sequential circuits have 'Memory'. Their output depends on the current inputs AND the previous state. This is achieved using feedback loops, creating the foundation for RAM and registers."
          />
        </h2>
        <p className="text-slate-400">
          Explore how computers remember data using Latches. Observe the feedback loops in action.
        </p>
      </div>

      <div className="flex gap-4 border-b border-slate-700 pb-2">
         <button 
           onClick={() => setActiveTab('SR_LATCH')}
           className={`pb-2 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'SR_LATCH' ? 'border-neon-cyan text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
         >
           S-R Latch
         </button>
         <button 
           onClick={() => setActiveTab('D_LATCH')}
           className={`pb-2 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'D_LATCH' ? 'border-neon-cyan text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
         >
           Gated D Latch
         </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 relative overflow-hidden min-h-[500px] flex items-center justify-center">
         {activeTab === 'SR_LATCH' ? <SRLatch /> : <DLatch />}
      </div>
    </div>
  );
};

const SRLatch: React.FC = () => {
  const [s, setS] = useState(false);
  const [r, setR] = useState(false);
  
  // Internal State
  const [q, setQ] = useState(false);
  const [qNot, setQNot] = useState(true);
  const [invalid, setInvalid] = useState(false);

  // Logic Effect for NOR Latch
  useEffect(() => {
    if (s && r) {
      setInvalid(true);
      setQ(false);
      setQNot(false);
    } else if (s && !r) {
      setInvalid(false);
      setQ(true);
      setQNot(false); // Reset implies Q=0, Set implies Q=1
    } else if (!s && r) {
      setInvalid(false);
      setQ(false);
      setQNot(true);
    } else {
      setInvalid(false);
      // Hold state (No change)
    }
  }, [s, r]);

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-8">
      {invalid && (
         <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Metastable / Invalid State</span>
         </div>
      )}

      <div className="grid grid-cols-[100px_1fr_100px] gap-8 items-center w-full">
         {/* Inputs */}
         <div className="flex flex-col gap-32">
            <Toggle label="SET (S)" value={s} onChange={setS} color="cyan" />
            <Toggle label="RESET (R)" value={r} onChange={setR} color="amber" />
         </div>

         {/* Circuit */}
         <div className="relative h-64 w-full">
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              {/* Top NOR Input Line */}
              <path d="M 0 50 L 50 50" stroke={s ? '#22d3ee' : '#334155'} strokeWidth="3" />
              
              {/* Bottom NOR Input Line */}
              <path d="M 0 200 L 50 200" stroke={r ? '#fbbf24' : '#334155'} strokeWidth="3" />

              {/* Feedback Loop Q' to Top NOR */}
              <path 
                d="M 230 210 L 260 210 L 260 140 L 30 140 L 30 70 L 50 70" 
                fill="none" 
                stroke={qNot ? '#10b981' : '#334155'} 
                strokeWidth="2" 
                strokeDasharray="5 5"
                className="transition-colors duration-500"
              />

              {/* Feedback Loop Q to Bottom NOR */}
              <path 
                d="M 230 60 L 250 60 L 250 110 L 30 110 L 30 180 L 50 180" 
                fill="none" 
                stroke={q ? '#10b981' : '#334155'} 
                strokeWidth="2" 
                strokeDasharray="5 5"
                className="transition-colors duration-500"
              />

              {/* Top NOR Gate */}
              <g transform="translate(50, 30)">
                 <path d="M0,0 L20,0 C40,0 50,30 20,60 L0,60 C10,40 10,20 0,0" fill="#1e293b" stroke="#94a3b8" strokeWidth="2"/>
                 <circle cx="54" cy="30" r="4" stroke="#94a3b8" strokeWidth="2" fill="#1e293b" />
              </g>

              {/* Bottom NOR Gate */}
              <g transform="translate(50, 160)">
                 <path d="M0,0 L20,0 C40,0 50,30 20,60 L0,60 C10,40 10,20 0,0" fill="#1e293b" stroke="#94a3b8" strokeWidth="2"/>
                 <circle cx="54" cy="30" r="4" stroke="#94a3b8" strokeWidth="2" fill="#1e293b" />
              </g>

              {/* Output Lines */}
              <path d="M 110 60 L 230 60" stroke={q ? '#10b981' : '#334155'} strokeWidth="4" />
              <path d="M 110 210 L 230 210" stroke={qNot ? '#10b981' : '#334155'} strokeWidth="4" />
            </svg>
         </div>

         {/* Outputs */}
         <div className="flex flex-col gap-32">
            <Led label="Q" on={q} />
            <Led label="Q'" on={qNot} />
         </div>
      </div>
      
      <div className="text-center text-xs text-slate-500 max-w-md">
         Wait state holds the previous value. The wires crossing over represent the physical 
         feedback loop that allows the circuit to "remember".
      </div>
    </div>
  );
};

const DLatch: React.FC = () => {
  const [d, setD] = useState(false);
  const [e, setE] = useState(false);
  const [q, setQ] = useState(false);

  // D Latch Logic
  useEffect(() => {
    if (e) {
      setQ(d);
    }
    // If !e, hold previous Q
  }, [d, e]);

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-8">
      <div className="flex gap-16 justify-center w-full">
         <div className="flex flex-col gap-4">
            <Toggle label="Data (D)" value={d} onChange={setD} color="cyan" />
            <Toggle label="Enable (E)" value={e} onChange={setE} color="purple" />
         </div>

         {/* Abstract Box Representation */}
         <div className="w-48 h-48 bg-slate-800 border-2 border-slate-600 rounded-lg relative shadow-2xl flex items-center justify-center">
            <span className="font-mono text-4xl font-bold text-slate-600">D</span>
            <span className="absolute top-2 right-2 text-xs font-mono text-slate-500">LATCH</span>
            
            {/* Input Points */}
            <div className="absolute left-0 top-12 w-3 h-3 -translate-x-1/2 bg-slate-400 rounded-full border border-slate-900"></div>
            <div className="absolute left-0 bottom-12 w-3 h-3 -translate-x-1/2 bg-slate-400 rounded-full border border-slate-900"></div>

            {/* Output Point */}
            <div className="absolute right-0 top-1/2 w-3 h-3 translate-x-1/2 bg-slate-400 rounded-full border border-slate-900"></div>
            
            {/* Lock Icon Visual */}
            <div className={`absolute bottom-4 right-4 transition-all duration-300 ${!e ? 'text-neon-rose opacity-100' : 'text-slate-700 opacity-20'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
         </div>

         <div className="flex flex-col justify-center">
            <Led label="Output (Q)" on={q} />
         </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 max-w-lg w-full">
         <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>ENABLE SIGNAL</span>
            <span>STATUS</span>
         </div>
         <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${e ? 'bg-fuchsia-400' : 'bg-slate-600'}`}></div>
            <span className={`text-sm font-bold ${e ? 'text-white' : 'text-slate-500'}`}>
               {e ? 'HIGH (TRANSPARENT)' : 'LOW (LATCHED)'}
            </span>
         </div>
         <p className="mt-2 text-xs text-slate-400">
            {e 
              ? "When Enable is HIGH, Q directly follows D. The door is open." 
              : "When Enable is LOW, Q is locked to its last value. Changing D has no effect. The door is closed."
            }
         </p>
      </div>
    </div>
  );
};

// --- UI Helpers ---

const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void; color: 'cyan' | 'amber' | 'purple' }> = ({ label, value, onChange, color }) => {
  const bg = {
    cyan: value ? 'bg-neon-cyan' : 'bg-slate-700',
    amber: value ? 'bg-neon-amber' : 'bg-slate-700',
    purple: value ? 'bg-fuchsia-400' : 'bg-slate-700',
  };
  const text = {
    cyan: value ? 'text-neon-cyan' : 'text-slate-500',
    amber: value ? 'text-neon-amber' : 'text-slate-500',
    purple: value ? 'text-fuchsia-400' : 'text-slate-500',
  };
  
  return (
    <button onClick={() => onChange(!value)} className="flex items-center gap-3 group text-left">
       <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${bg[color]} bg-opacity-20 border border-slate-600`}>
          <div className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${value ? 'translate-x-6 bg-white' : 'translate-x-0 bg-slate-500'}`} />
       </div>
       <div>
         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
         <div className={`font-mono font-bold text-lg ${text[color]}`}>{value ? '1' : '0'}</div>
       </div>
    </button>
  );
};

const Led: React.FC<{ label: string; on: boolean }> = ({ label, on }) => (
  <div className="flex items-center gap-3">
     <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300
        ${on ? 'bg-neon-emerald border-emerald-500 shadow-[0_0_30px_#10b981]' : 'bg-slate-900 border-slate-700'}
     `}>
        <Power className={`w-6 h-6 ${on ? 'text-slate-900' : 'text-slate-600'}`} />
     </div>
     <span className="font-mono font-bold text-xl text-slate-300">{label}</span>
  </div>
);