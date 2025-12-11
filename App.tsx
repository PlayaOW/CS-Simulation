import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ReferenceManual } from './components/ReferenceManual';
import { BitFlipper } from './components/modules/BitFlipper';
import { GateLogic } from './components/modules/GateLogic';
import { CombinationalCircuit } from './components/modules/CombinationalCircuit';
import { SequentialLogic } from './components/modules/SequentialLogic';
import { MiniCpu } from './components/modules/MiniCpu';
import { Lc3MemoryMap } from './components/modules/Lc3MemoryMap';
import { ModuleId } from './types';
import { Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.BIT_FLIPPER);

  const renderModule = () => {
    switch (activeModule) {
      case ModuleId.BIT_FLIPPER:
        return <BitFlipper />;
      case ModuleId.GATE_LOGIC:
        return <GateLogic />;
      case ModuleId.COMBINATIONAL_CIRCUITS:
        return <CombinationalCircuit />;
      case ModuleId.SEQUENTIAL_LOGIC:
        return <SequentialLogic />;
      case ModuleId.MINI_CPU:
        return <MiniCpu />;
      case ModuleId.LC3_MEMORY_MAP:
        return <Lc3MemoryMap />;
      default:
        return <BitFlipper />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-neon-cyan selection:text-slate-900">
      <Sidebar activeModule={activeModule} onSelectModule={setActiveModule} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600">
              <Terminal className="w-5 h-5 text-neon-cyan" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              <span className="text-neon-cyan">SYS</span>.PLAYGROUND
              <span className="ml-2 text-xs font-mono text-slate-500 border border-slate-700 px-2 py-0.5 rounded">v1.2.0</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto w-full pb-24">
            {renderModule()}
          </div>
        </div>

        {/* Reference Manual Floating Panel */}
        <ReferenceManual activeModule={activeModule} />

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />
      </main>
    </div>
  );
};

export default App;