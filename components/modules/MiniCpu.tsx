import React, { useState, useEffect, useRef } from 'react';
import { ProfessorNote } from '../ProfessorNote';
import { Play, Pause, StepForward, RotateCcw, Save, Cpu, HardDrive, FileCode } from 'lucide-react';

// --- CONSTANTS ---

const MEMORY_SIZE = 16;

const ISA = {
  HLT: { op: 0, mnemonic: 'HLT', desc: 'Halt Execution' },
  LOD: { op: 1, mnemonic: 'LOD', desc: 'Load Memory[addr] to AC' },
  ADD: { op: 2, mnemonic: 'ADD', desc: 'AC = AC + Memory[addr]' },
  SUB: { op: 3, mnemonic: 'SUB', desc: 'AC = AC - Memory[addr]' },
  STO: { op: 4, mnemonic: 'STO', desc: 'Store AC to Memory[addr]' },
  JMP: { op: 5, mnemonic: 'JMP', desc: 'Jump to Address' },
  JZ:  { op: 6, mnemonic: 'JZ',  desc: 'Jump if AC == 0' },
};

const DEFAULT_PROGRAM = `
LOD 14  ; Load data from addr 14
ADD 15  ; Add data from addr 15
STO 13  ; Store result in addr 13
HLT     ; Stop
`.trim();

// --- TYPES ---

interface CpuState {
  pc: number;   // Program Counter (4-bit)
  ac: number;   // Accumulator (8-bit signed)
  ir: number;   // Instruction Register (8-bit)
  step: 'FETCH' | 'DECODE' | 'EXECUTE' | 'HALTED';
}

// --- COMPONENT ---

export const MiniCpu: React.FC = () => {
  // Simulator State
  const [memory, setMemory] = useState<number[]>(new Array(MEMORY_SIZE).fill(0));
  const [cpu, setCpu] = useState<CpuState>({ pc: 0, ac: 0, ir: 0, step: 'HALTED' });
  const [sourceCode, setSourceCode] = useState(DEFAULT_PROGRAM);
  const [isRunning, setIsRunning] = useState(false);
  const [msg, setMsg] = useState("Ready to assemble.");
  const [speed, setSpeed] = useState(1000);
  
  const timerRef = useRef<number | null>(null);

  // Initialize Memory on Load
  useEffect(() => {
    assemble(DEFAULT_PROGRAM);
  }, []);

  // Timer for Auto-Run
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        stepCpu();
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, cpu, speed, memory]); // Re-bind when state changes to capture latest closure

  // --- LOGIC ---

  const assemble = (code: string) => {
    const lines = code.split('\n');
    const newMem = new Array(MEMORY_SIZE).fill(0);
    let error = null;

    // Load data at specific addresses (Hardcoded for demo: 14=5, 15=3)
    // In a full sim, we'd have a .DATA directive.
    newMem[14] = 5;
    newMem[15] = 3;

    let memIndex = 0;
    lines.forEach((line, idx) => {
      if (memIndex >= 13) return; // Reserve top memory for data

      const parts = line.split(';')[0].trim().split(/\s+/); // Remove comments, split space
      if (!parts[0]) return;

      const mnemonic = parts[0].toUpperCase();
      const operand = parts[1] ? parseInt(parts[1]) : 0;

      const instruction = Object.values(ISA).find(i => i.mnemonic === mnemonic);
      
      if (instruction) {
        // Opcode in upper 4 bits, Operand in lower 4 bits
        // Limit operand to 4 bits (0-15)
        const op = instruction.op;
        const safeOperand = operand & 0xF; 
        newMem[memIndex] = (op << 4) | safeOperand;
        memIndex++;
      }
    });

    setMemory(newMem);
    resetCpu();
    setMsg("Program assembled and loaded to memory.");
  };

  const resetCpu = () => {
    setIsRunning(false);
    setCpu({ pc: 0, ac: 0, ir: 0, step: 'FETCH' });
  };

  const stepCpu = () => {
    setCpu(prev => {
      // If already halted, stop
      if (prev.step === 'HALTED') {
        setIsRunning(false);
        return prev;
      }

      let nextState = { ...prev };
      const { pc, ac, ir, step } = prev;

      if (step === 'FETCH') {
        // Fetch: IR = Memory[PC]
        const instruction = memory[pc];
        nextState.ir = instruction;
        nextState.pc = (pc + 1) & 0xF; // Increment PC, wrap 4-bit
        nextState.step = 'DECODE';
      } 
      else if (step === 'DECODE') {
        // Just a visual step for education
        nextState.step = 'EXECUTE';
      } 
      else if (step === 'EXECUTE') {
        // Execute based on IR
        const opcode = (ir >> 4) & 0xF;
        const operand = ir & 0xF;

        switch (opcode) {
          case ISA.HLT.op:
            nextState.step = 'HALTED';
            setMsg("Program Halted.");
            break;
          case ISA.LOD.op:
            nextState.ac = memory[operand];
            nextState.step = 'FETCH';
            break;
          case ISA.ADD.op:
            nextState.ac = (ac + memory[operand]); 
            nextState.step = 'FETCH';
            break;
          case ISA.SUB.op:
            nextState.ac = (ac - memory[operand]);
            nextState.step = 'FETCH';
            break;
          case ISA.STO.op:
            // Side Effect: Write to Memory
            const newMem = [...memory];
            newMem[operand] = ac;
            setMemory(newMem);
            nextState.step = 'FETCH';
            break;
          case ISA.JMP.op:
            nextState.pc = operand;
            nextState.step = 'FETCH';
            break;
          case ISA.JZ.op:
            if (ac === 0) nextState.pc = operand;
            nextState.step = 'FETCH';
            break;
          default:
            nextState.step = 'HALTED'; // Unknown op
        }
      }

      return nextState;
    });
  };

  // --- HELPERS ---

  const toHex = (num: number, pad = 2) => num.toString(16).toUpperCase().padStart(pad, '0');
  const toBin = (num: number) => num.toString(2).padStart(8, '0');
  
  const getOpcodeMnemonic = (val: number) => {
    const op = (val >> 4) & 0xF;
    const entry = Object.values(ISA).find(i => i.op === op);
    return entry ? entry.mnemonic : '???';
  };

  // --- RENDER ---

  return (
    <div className="space-y-8 pb-12">
      {/* Intro */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          The Mini Architecture
          <ProfessorNote 
            title="Von Neumann Architecture" 
            content="This module simulates a simplified computer based on the Von Neumann architecture. It has a CPU (Central Processing Unit) that fetches instructions from Memory, decodes them, and executes them sequentially. This cycle is the heartbeat of all modern computers."
          />
        </h2>
        <p className="text-slate-400">
          Write Assembly code, visualize the Registers, and watch the Memory state change in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COL 1: CODE EDITOR (Instruction Set Simulator) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-[500px]">
            <div className="bg-slate-900 p-3 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2 text-neon-cyan">
                <FileCode className="w-4 h-4" />
                <span className="font-bold text-sm tracking-wider">ASSEMBLY.ASM</span>
              </div>
            </div>
            <textarea 
              className="flex-1 bg-slate-950 p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 leading-relaxed"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              spellCheck={false}
            />
            <div className="p-3 bg-slate-800 border-t border-slate-700">
              <button 
                onClick={() => assemble(sourceCode)}
                className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Save className="w-4 h-4" />
                Assemble & Load
              </button>
            </div>
          </div>
          
          {/* Instruction Set Reference */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-xs">
            <h4 className="font-bold text-slate-300 mb-2 uppercase">Cheat Sheet</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono">
              {Object.values(ISA).map(i => (
                <div key={i.mnemonic}><span className="text-neon-cyan">{i.mnemonic}</span> <span className="opacity-50">-</span> {i.desc}</div>
              ))}
            </div>
          </div>
        </div>

        {/* COL 2: CPU VIEW (Registers) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* CPU Box */}
          <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Cpu className="w-32 h-32" />
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${cpu.step !== 'HALTED' ? 'bg-neon-emerald animate-pulse' : 'bg-red-500'}`} />
                <span className="font-mono font-bold text-slate-300">CPU UNIT</span>
              </div>
              <div className="text-xs font-mono text-neon-amber border border-neon-amber/30 px-2 py-1 rounded bg-neon-amber/10">
                STATUS: {cpu.step}
              </div>
            </div>

            {/* Registers Grid */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {/* PC Register */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">PC (Program Counter)</span>
                  <ProfessorNote title="Program Counter (PC)" content="Holds the address of the NEXT instruction to be executed. It increments automatically after fetching." />
                </div>
                <div className="text-3xl font-mono text-neon-cyan font-bold">{toHex(cpu.pc)}</div>
                <div className="text-xs font-mono text-slate-500 mt-1">Address Pointer</div>
              </div>

              {/* AC Register */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">AC (Accumulator)</span>
                  <ProfessorNote title="Accumulator (AC)" content="The main worker register. Results of arithmetic and logic operations are stored here." />
                </div>
                <div className="text-3xl font-mono text-neon-rose font-bold">{cpu.ac}</div>
                <div className="text-xs font-mono text-slate-500 mt-1">Value (Dec)</div>
              </div>

              {/* IR Register (Full Width) */}
              <div className="col-span-2 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">IR (Instruction Register)</span>
                  <ProfessorNote title="Instruction Register (IR)" content="Holds the current instruction being executed. The CPU decodes this to know what operation to perform." />
                </div>
                <div className="flex items-baseline gap-4">
                   <div className="text-3xl font-mono text-neon-amber font-bold">
                     {getOpcodeMnemonic(cpu.ir)} <span className="text-slate-500">{cpu.ir & 0xF}</span>
                   </div>
                   <div className="text-sm font-mono text-slate-500">
                     Raw: {toBin(cpu.ir)}
                   </div>
                </div>
              </div>
            </div>

            {/* ALU Visual Decoration */}
            <div className="mt-6 pt-4 border-t border-slate-700 relative z-10">
               <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                 <span>ALU BUS WIDTH: 8-BIT</span>
                 <span>CLOCK: {speed}ms</span>
               </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => setIsRunning(!isRunning)}
                disabled={cpu.step === 'HALTED'}
                className={`p-3 rounded-lg flex items-center gap-2 font-bold transition-all ${
                  isRunning 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-neon-emerald text-slate-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                {isRunning ? 'PAUSE' : 'RUN'}
              </button>
              
              <button 
                onClick={stepCpu}
                disabled={isRunning || cpu.step === 'HALTED'}
                className="p-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Step Forward"
              >
                <StepForward size={18} />
              </button>

              <button 
                onClick={resetCpu}
                className="p-3 bg-slate-700 text-neon-cyan rounded-lg hover:bg-slate-600"
                title="Reset CPU"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">SPEED</span>
              <input 
                type="range" 
                min="100" 
                max="2000" 
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 accent-neon-cyan"
              />
            </div>
          </div>

          {/* Messages */}
          <div className="bg-black/40 border border-slate-800 p-2 rounded text-xs font-mono text-neon-cyan">
             {'>'} {msg}
          </div>
        </div>

        {/* COL 3: MEMORY LAB */}
        <div className="lg:col-span-4 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
           <div className="bg-slate-900 p-3 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2 text-neon-rose">
                <HardDrive className="w-4 h-4" />
                <span className="font-bold text-sm tracking-wider">RAM (16 Bytes)</span>
              </div>
              <ProfessorNote title="Memory (RAM)" content="Random Access Memory. Each cell has a unique address (0-15) and stores 8 bits of data. Instructions and variables both live here!" />
            </div>
            
            <div className="p-4 grid grid-cols-1 gap-2 overflow-y-auto">
               {memory.map((val, idx) => {
                 const isPC = cpu.pc === idx;
                 const isTarget = (cpu.ir & 0xF) === idx && cpu.step !== 'FETCH';
                 
                 return (
                   <div 
                    key={idx} 
                    className={`
                      flex items-center justify-between p-2 rounded border font-mono text-sm transition-all duration-300
                      ${isPC 
                        ? 'bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_10px_rgba(34,211,238,0.3)] scale-[1.02]' 
                        : isTarget 
                          ? 'bg-neon-amber/20 border-neon-amber text-white'
                          : 'bg-slate-900/50 border-slate-700/50 text-slate-400'
                      }
                    `}
                   >
                      {/* Address */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold opacity-50 w-6">0x{toHex(idx, 1)}</span>
                        {isPC && <span className="text-[10px] font-bold bg-neon-cyan text-slate-900 px-1 rounded">PC</span>}
                        {isTarget && <span className="text-[10px] font-bold bg-neon-amber text-slate-900 px-1 rounded">DATA</span>}
                      </div>

                      {/* Value */}
                      <div className="flex items-center gap-4">
                        <span className="text-xs tracking-widest opacity-60">{toBin(val)}</span>
                        <span className={`font-bold w-6 text-right ${val !== 0 ? 'text-white' : 'opacity-30'}`}>{val}</span>
                      </div>
                   </div>
                 );
               })}
            </div>
            
            {/* Memory Legend */}
            <div className="bg-slate-900 p-3 border-t border-slate-800 flex gap-4 justify-center text-[10px] font-mono uppercase tracking-wider">
               <div className="flex items-center gap-1">
                 <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                 <span className="text-slate-400">Current Instr</span>
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-2 h-2 bg-neon-amber rounded-full"></div>
                 <span className="text-slate-400">Data Access</span>
               </div>
            </div>
        </div>

      </div>
    </div>
  );
};
