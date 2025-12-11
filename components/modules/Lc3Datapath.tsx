import React, { useState, useEffect } from 'react';
import { ProfessorNote } from '../ProfessorNote';
import { ArrowRight, Zap, PlayCircle } from 'lucide-react';

type CycleStep = 'FETCH_1' | 'FETCH_2' | 'DECODE' | 'EXECUTE' | 'RESET';

export const Lc3Datapath: React.FC = () => {
  const [step, setStep] = useState<CycleStep>('RESET');
  const [registers, setRegisters] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  
  // Special Registers
  const [pc, setPc] = useState(0x3000);
  const [ir, setIr] = useState(0x0000);
  const [mar, setMar] = useState(0x0000);
  const [mdr, setMdr] = useState(0x0000);

  const nextStep = () => {
    switch (step) {
      case 'RESET':
        setStep('FETCH_1');
        break;
      case 'FETCH_1':
        // PC -> MAR
        setMar(pc);
        setPc(pc + 1); // Increment PC
        setStep('FETCH_2');
        break;
      case 'FETCH_2':
        // Memory[MAR] -> MDR (Simulated instruction: ADD R1, R1, #0 -> x1260)
        setMdr(0x1260); 
        setStep('DECODE');
        break;
      case 'DECODE':
        // MDR -> IR
        setIr(mdr);
        setStep('EXECUTE');
        break;
      case 'EXECUTE':
        // Execution happens (Simulated: R1 = R1 + 0, let's just increment R1 for visual effect)
        const newRegs = [...registers];
        newRegs[1] = (newRegs[1] + 1) & 0xFFFF;
        setRegisters(newRegs);
        setStep('RESET');
        break;
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'RESET': return "Ready for next cycle.";
      case 'FETCH_1': return "FETCH: The address in PC is loaded into the MAR. PC increments.";
      case 'FETCH_2': return "FETCH: The Memory reads address in MAR and puts data into MDR.";
      case 'DECODE': return "DECODE: The instruction in MDR is moved to the IR for decoding.";
      case 'EXECUTE': return "EXECUTE: The Control Unit processes the instruction in IR.";
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          LC-3 Datapath
          <ProfessorNote 
            title="The Datapath" 
            content="The 'Datapath' consists of the hardware components (ALU, Registers, Memory) and the connections between them. The Control Unit coordinates traffic on these wires."
          />
        </h2>
        <p className="text-slate-400">
          Visualize the Fetch-Decode-Execute cycle. See how data moves through the special registers.
        </p>
      </div>

      {/* Main Datapath Diagram */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden min-h-[600px] flex flex-col items-center">
         
         {/* Top Controls */}
         <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
            <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600 backdrop-blur-sm">
               <div className={`w-3 h-3 rounded-full ${step !== 'RESET' ? 'bg-neon-emerald animate-pulse' : 'bg-slate-500'}`} />
               <span className="font-mono text-sm font-bold text-slate-300">{step} PHASE</span>
            </div>
            
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 bg-neon-cyan text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              {step === 'EXECUTE' ? 'Finish Cycle' : 'Next Step'}
              <ArrowRight className="w-4 h-4" />
            </button>
         </div>

         <div className="absolute top-20 text-center text-slate-400 font-mono text-sm bg-slate-900/50 p-2 rounded">
            {getStepDescription()}
         </div>

         {/* The BUS */}
         <div className="absolute left-1/2 top-32 bottom-32 w-4 bg-slate-700 -translate-x-1/2 rounded flex flex-col justify-center items-center z-0">
             <div className="text-[10px] font-mono text-slate-500 -rotate-90 absolute whitespace-nowrap">GLOBAL BUS</div>
             {step !== 'RESET' && (
               <div className="absolute inset-x-0 bg-neon-amber/50 animate-pulse h-full w-full rounded shadow-[0_0_20px_#fbbf24]"></div>
             )}
         </div>

         {/* Components Layout */}
         <div className="relative w-full max-w-4xl h-full flex justify-between items-center mt-20">
             
             {/* Left Side: PC, Registers, ALU */}
             <div className="flex flex-col gap-12 w-64 z-10">
                <RegisterBox label="PC" value={pc} active={step === 'FETCH_1'} color="cyan" note="Program Counter" />
                
                <div className="bg-slate-800 border border-slate-600 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">Register File</h4>
                  <div className="grid grid-cols-2 gap-2">
                     {registers.map((val, idx) => (
                       <div key={idx} className="flex justify-between font-mono text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">
                          <span>R{idx}</span>
                          <span className={idx === 1 && step === 'EXECUTE' ? 'text-neon-emerald font-bold' : ''}>x{val.toString(16).toUpperCase()}</span>
                       </div>
                     ))}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-slate-300 transition-all duration-300
                   ${step === 'EXECUTE' ? 'bg-neon-emerald/20 border-neon-emerald shadow-[0_0_30px_#10b981] scale-105' : 'bg-slate-800 border-slate-600'}
                `}>
                   <Zap className={`w-5 h-5 ${step === 'EXECUTE' ? 'text-neon-emerald' : 'text-slate-500'}`} />
                   ALU
                </div>
             </div>

             {/* Right Side: MAR, MDR, IR */}
             <div className="flex flex-col gap-12 w-64 z-10">
                <RegisterBox label="MAR" value={mar} active={step === 'FETCH_1' || step === 'FETCH_2'} color="amber" note="Memory Address Reg" />
                <RegisterBox label="MDR" value={mdr} active={step === 'FETCH_2' || step === 'DECODE'} color="amber" note="Memory Data Reg" />
                <RegisterBox label="IR" value={ir} active={step === 'DECODE' || step === 'EXECUTE'} color="purple" note="Instruction Reg" />
             </div>
         </div>
         
         {/* Decoding Text */}
         {step === 'DECODE' && (
           <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-fuchsia-500/50 p-4 rounded-xl text-center shadow-2xl animate-bounce">
              <span className="text-xs font-bold text-fuchsia-400 uppercase block mb-1">Decoding...</span>
              <span className="font-mono text-white text-lg">ADD R1, R1, #0</span>
           </div>
         )}

      </div>
    </div>
  );
};

const RegisterBox: React.FC<{ label: string; value: number; active: boolean; color: string; note: string }> = ({ label, value, active, color, note }) => {
  const colors: any = {
    cyan: 'border-neon-cyan shadow-[0_0_20px_#22d3ee]',
    amber: 'border-neon-amber shadow-[0_0_20px_#fbbf24]',
    purple: 'border-fuchsia-500 shadow-[0_0_20px_#d946ef]',
  };

  return (
    <div className={`bg-slate-900 p-4 rounded-xl border-2 transition-all duration-300 ${active ? colors[color] : 'border-slate-700'}`}>
       <div className="flex justify-between items-center mb-1">
          <span className={`font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{label}</span>
          <span className="text-[10px] text-slate-600 uppercase">{note}</span>
       </div>
       <div className="font-mono text-2xl text-slate-300">
          x{value.toString(16).toUpperCase().padStart(4, '0')}
       </div>
    </div>
  );
};