import React, { useState, useEffect } from 'react';
import { ModuleId } from '../../types';
import { BookOpen, ChevronRight, ExternalLink, ArrowRight, GraduationCap } from 'lucide-react';

interface DigitalTextbookProps {
  onNavigate: (id: ModuleId) => void;
}

interface Chapter {
  id: string;
  title: string;
  objectives: string[];
  sections: Section[];
}

interface Section {
  title: string;
  content: React.ReactNode;
}

export const DigitalTextbook: React.FC<DigitalTextbookProps> = ({ onNavigate }) => {
  const [activeChapter, setActiveChapter] = useState<string>('CH1');
  const [scrollTrigger, setScrollTrigger] = useState(0);

  // Scroll to top when chapter changes
  useEffect(() => {
    const el = document.getElementById('book-content-scroller');
    if (el) el.scrollTop = 0;
  }, [scrollTrigger]);

  const handleChapterChange = (id: string) => {
    setActiveChapter(id);
    setScrollTrigger(prev => prev + 1);
  };

  // --- CONTENT DEFINITION ---

  const BOOK_CONTENT: Chapter[] = [
    {
      id: 'CH1',
      title: 'Ch 1: The Abstraction',
      objectives: [
        "Understand the 'Levels of Transformation' in computing.",
        "Define the concept of Abstraction.",
        "Differentiate between the ISA and the Microarchitecture."
      ],
      sections: [
        {
          title: "1.1 Welcome to the Machine",
          content: (
            <>
              <p className="mb-4">
                Computer Science is the study of how we translate human problems into a series of electron pulses. This is a massive gap to bridge. To manage this complexity, we use <strong>Abstraction</strong>.
              </p>
              <p className="mb-4">
                We break the computer down into layers. You, the programmer, exist at the "Algorithm" or "Language" level. The hardware engineer exists at the "Circuit" level. This book is about the layers in between.
              </p>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 my-6 font-mono text-sm">
                <div className="text-slate-500">Level 1: Problems (Human Thought)</div>
                <div className="text-slate-400 pl-4">↓ Algorithms (Step-by-step Logic)</div>
                <div className="text-slate-300 pl-8">↓ Language (C, Python, Java)</div>
                <div className="text-neon-cyan pl-12 font-bold">↓ ISA (Instruction Set Architecture)</div>
                <div className="text-neon-amber pl-16 font-bold">↓ Microarchitecture (The Datapath)</div>
                <div className="text-fuchsia-400 pl-20 font-bold">↓ Circuits (Gates & Wires)</div>
                <div className="text-slate-500 pl-24">↓ Devices (Transistors, Electrons)</div>
              </div>
              <p>
                <strong>The Goal of this Course:</strong> We will start at the bottom (Circuits) and build our way up to C programming, demystifying every layer along the way.
              </p>
            </>
          )
        }
      ]
    },
    {
      id: 'CH2',
      title: 'Ch 2: Data Representation',
      objectives: [
        "Explain how bits represent integers.",
        "Perform arithmetic in Binary and Hexadecimal.",
        "Master the concept of 2's Complement.",
        "Detect Overflow conditions."
      ],
      sections: [
        {
          title: "2.1 The Bit as the Atom",
          content: (
            <>
              <p className="mb-4">
                The computer is an electrical device. It works best with two states: High Voltage (On/1) and Low Voltage (Off/0). This is a <strong>Bit</strong>.
              </p>
              <p className="mb-4">
                We group bits to create meaning. A typical "Word" size in modern computing is 32 or 64 bits. In the LC-3 architecture we study here, the word size is <strong>16 bits</strong>.
              </p>
            </>
          )
        },
        {
          title: "2.2 Unsigned vs. Signed Integers",
          content: (
            <>
              <p className="mb-4">
                If we have 8 bits, we have 256 possible combinations (2<sup>8</sup>). How we map these combinations to numbers is a matter of <em>interpretation</em>.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                <li><strong>Unsigned:</strong> We assume the number is positive. Range: 0 to 255.</li>
                <li><strong>Signed Magnitude:</strong> We use the first bit as a sign (0=+, 1=-). Range: -127 to +127. Problem: Two zeros (+0 and -0) and difficult arithmetic circuits.</li>
                <li><strong>2's Complement:</strong> The standard for modern computing. The MSB (Most Significant Bit) has a <em>negative</em> weight.</li>
              </ul>
              <p className="mb-4">
                In 8-bit 2's Complement, the bit <code>10000000</code> is not +128, but <strong>-128</strong>. This genius system allows us to use the exact same Adder circuit for both addition and subtraction.
              </p>
              <div className="my-8">
                <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.BIT_FLIPPER)}
                  title="Lab Assignment 1: The Bit Flipper"
                  desc="Navigate to Module 1. Set the bits to '10000001'. Observe how the Unsigned value is 129, but the Signed value is -127. Prove to yourself why this happens."
                />
              </div>
            </>
          )
        }
      ]
    },
    {
      id: 'CH3',
      title: 'Ch 3: Digital Logic',
      objectives: [
        "Construct truth tables for AND, OR, NOT, XOR.",
        "Distinguish between Combinational and Sequential circuits.",
        "Explain how the R-S Latch stores a bit."
      ],
      sections: [
        {
          title: "3.1 The Logic Gate",
          content: (
            <>
              <p className="mb-4">
                We build <strong>Logic Gates</strong> out of transistors (MOSFETs). A P-type transistor conducts when the gate is low; an N-type conducts when the gate is high. By arranging them, we create physical structures that perform Boolean Algebra.
              </p>
              <div className="my-6">
                <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.GATE_LOGIC)}
                  title="Lab Assignment 2: Gate Logic"
                  desc="Verify the Truth Tables. Specifically, test the XOR gate. Note that it outputs 1 only when inputs differ."
                />
              </div>
            </>
          )
        },
        {
          title: "3.2 Combinational Circuits",
          content: (
            <>
              <p className="mb-4">
                <strong>Combinational circuits</strong> have no memory. Their output is a pure function of their current inputs.
              </p>
              <p className="mb-4">
                <strong>The Adder:</strong> A computer needs to add. A "Half Adder" adds two bits. A "Full Adder" adds two bits plus a Carry In. By chaining 16 Full Adders together, we can add 16-bit numbers.
              </p>
              <p className="mb-4">
                <strong>The MUX (Multiplexer):</strong> This is a "Selector". It has multiple data inputs and one output. A set of "Select Lines" determines which input gets through. This is crucial for routing data inside the CPU.
              </p>
              <div className="my-6">
                 <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.COMBINATIONAL_CIRCUITS)}
                  title="Lab Assignment 3: The MUX & Adder"
                  desc="Go to the Combinational tab. Toggle the Select bit on the MUX and watch the path change."
                />
              </div>
            </>
          )
        },
        {
          title: "3.3 Storage & Sequential Logic",
          content: (
            <>
              <p className="mb-4">
                To build a computer, we need to remember the result of a calculation. We need <strong>State</strong>.
              </p>
              <p className="mb-4">
                We achieve this by feeding the output of a gate <em>back into its own input</em>. This feedback loop creates a latch.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                <li><strong>R-S Latch:</strong> The most basic memory. Set (S) sets it to 1. Reset (R) sets it to 0.</li>
                <li><strong>Gated D Latch:</strong> A safer version. The "Data" (D) is only saved when the "Enable" (or Clock) line is high. When the Clock is low, the value is locked.</li>
              </ul>
              <div className="my-6">
                 <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.SEQUENTIAL_LOGIC)}
                  title="Lab Assignment 4: The Latch"
                  desc="Try to create an invalid state in the R-S Latch. Then, use the D-Latch to store a '1', turn off Enable, and toggle D. Confirm the output doesn't change."
                />
              </div>
            </>
          )
        }
      ]
    },
    {
      id: 'CH4',
      title: 'Ch 4: Von Neumann Model',
      objectives: [
        "List the 5 components of the Von Neumann Model.",
        "Explain the role of PC, IR, MAR, and MDR.",
        "Trace the Fetch-Decode-Execute cycle."
      ],
      sections: [
        {
          title: "4.1 The Architecture",
          content: (
            <>
              <p className="mb-4">
                John von Neumann proposed that a computer should have 5 parts:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-1 text-slate-300">
                <li><strong>Memory:</strong> Stores both Data and Instructions (The Stored Program Concept).</li>
                <li><strong>Processing Unit:</strong> The ALU (Arithmetic Logic Unit) and Registers.</li>
                <li><strong>Input:</strong> Keyboard, Disk, etc.</li>
                <li><strong>Output:</strong> Monitor, Printer.</li>
                <li><strong>Control Unit:</strong> The conductor. It tells the other parts what to do.</li>
              </ol>
            </>
          )
        },
        {
          title: "4.2 The Instruction Cycle",
          content: (
            <>
              <p className="mb-4">
                The CPU processes instructions in a rigid loop:
              </p>
              <div className="space-y-4 font-mono text-sm bg-slate-950 p-4 rounded border border-slate-800">
                <div>
                   <span className="text-neon-cyan font-bold">1. FETCH:</span> Load the instruction from Memory into the IR. Update PC.
                </div>
                <div>
                   <span className="text-neon-amber font-bold">2. DECODE:</span> The Control Unit looks at the Opcode (bits 15-12) to figure out what to do.
                </div>
                <div>
                   <span className="text-neon-rose font-bold">3. EVALUATE ADDRESS:</span> If we need data from memory, calculate where it is.
                </div>
                <div>
                   <span className="text-fuchsia-400 font-bold">4. FETCH OPERANDS:</span> Get the data (from Registers or Memory).
                </div>
                <div>
                   <span className="text-neon-emerald font-bold">5. EXECUTE:</span> Run the ALU (Add, And, Not).
                </div>
                <div>
                   <span className="text-slate-400 font-bold">6. STORE RESULT:</span> Write the answer back to a Register or Memory.
                </div>
              </div>
              <div className="my-8">
                <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.LC3_DATAPATH)}
                  title="Lab Assignment 5: The Datapath"
                  desc="Open the Datapath Visualizer. Step through a cycle. Watch exactly when the PC increments and when the MDR is loaded."
                />
              </div>
            </>
          )
        }
      ]
    },
    {
      id: 'CH5',
      title: 'Ch 5: The LC-3 ISA',
      objectives: [
        "Decode machine code into Assembly.",
        "Understand the 3 Instruction Types: Operate, Data Movement, Control.",
        "Explain Addressing Modes: Immediate, Register, PC-Relative."
      ],
      sections: [
        {
          title: "5.1 The Instruction Set",
          content: (
            <>
              <p className="mb-4">
                The LC-3 (Little Computer 3) is a 16-bit architecture with a rich instruction set. Every instruction is 16 bits long.
              </p>
              <p className="mb-4">
                <strong>Operate Instructions (ADD, AND, NOT):</strong> These do math. They usually stay inside the CPU (using registers).
              </p>
              <p className="mb-4">
                <strong>Data Movement (LD, LDR, LDI, ST, STR, STI):</strong> These move data between the Register File and Memory.
              </p>
              <p className="mb-4">
                <strong>Control Instructions (BR, JMP, JSR, TRAP):</strong> These change the PC, allowing us to create loops and if-statements.
              </p>
            </>
          )
        },
        {
          title: "5.2 Decoding Machine Code",
          content: (
            <>
              <p className="mb-4">
                The first 4 bits (15-12) are always the <strong>Opcode</strong>.
              </p>
              <p className="mb-4">
                Example: <code>0001 010 001 1 00101</code>
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                <li><code>0001</code> is ADD.</li>
                <li><code>010</code> is Destination Register (R2).</li>
                <li><code>001</code> is Source Register 1 (R1).</li>
                <li><code>1</code> means "Immediate Mode" (use a number, not a register).</li>
                <li><code>00101</code> is the number 5.</li>
              </ul>
              <p className="font-bold text-neon-cyan mb-4">
                Assembly: ADD R2, R1, #5
              </p>
              <div className="my-8">
                <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.ASM_DECODER)}
                  title="Lab Assignment 6: The Decoder"
                  desc="Use the Assembly Decoder to construct an 'LDR' instruction. Notice how the bit fields change compared to 'ADD'."
                />
              </div>
            </>
          )
        }
      ]
    },
    {
      id: 'CH6',
      title: 'Ch 6: Assembly Programming',
      objectives: [
        "Write basic Assembly programs.",
        "Understand the Assembly Process (Symbol Table).",
        "Use Labels and Directives (.ORIG, .FILL)."
      ],
      sections: [
        {
          title: "6.1 Thinking in Assembly",
          content: (
            <>
              <p className="mb-4">
                Programming in Assembly requires you to manage every resource manually. You have 8 registers (R0-R7). R0 is typically used for I/O. R7 is used for return addresses.
              </p>
              <p className="mb-4">
                We use <strong>Directives</strong> to tell the Assembler (the program that translates our code) what to do.
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                <li><code>.ORIG x3000</code>: Start the program at address x3000.</li>
                <li><code>.FILL #10</code>: Put the number 10 here.</li>
                <li><code>.BLKW 5</code>: Reserve 5 spots of memory here.</li>
              </ul>
              <div className="my-8">
                <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.MINI_CPU)}
                  title="Lab Assignment 7: The Mini CPU"
                  desc="Write a program in the Mini Architecture that loops 5 times. Use a register as a counter and branch back (JMP/JZ) until it is zero."
                />
              </div>
            </>
          )
        }
      ]
    },
    {
      id: 'CH7',
      title: 'Ch 7: I/O & Memory Map',
      objectives: [
        "Define Memory Mapped I/O.",
        "Identify the role of KBSR/KBDR and DSR/DDR.",
        "Understand Polling vs Interrupts."
      ],
      sections: [
        {
          title: "7.1 Memory Mapped I/O",
          content: (
            <>
              <p className="mb-4">
                In LC-3, there are no special "Input" or "Output" instructions. Instead, we map hardware devices to specific memory addresses.
              </p>
              <p className="mb-4">
                <strong>Polling:</strong> To read a key, the CPU loops constantly, reading address xFE00 (KBSR). If the "Ready Bit" (bit 15) is 1, it means a key was pressed. The CPU then reads the ASCII data from xFE02 (KBDR).
              </p>
            </>
          )
        },
        {
          title: "7.2 The Memory Map",
          content: (
            <>
              <p className="mb-4">
                Memory is not just a bucket. It is segmented:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                <li><strong>x0000 - x00FF:</strong> Trap Vector Table (Pointers to OS code).</li>
                <li><strong>x0200 - x2FFF:</strong> Operating System Code.</li>
                <li><strong>x3000 - xFDFF:</strong> User Space (Your program).</li>
                <li><strong>xFE00 - xFFFF:</strong> Device Registers (I/O).</li>
              </ul>
              <div className="my-8">
                <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.LC3_MEMORY_MAP)}
                  title="Lab Assignment 8: Memory Explorer"
                  desc="Go to the Memory Map. Search for 'xFE00'. See how it resides at the very bottom of the address space, separate from your user code at x3000."
                />
              </div>
            </>
          )
        }
      ]
    },
    {
      id: 'CH8',
      title: 'Ch 8: The Stack & Subroutines',
      objectives: [
        "Explain the Stack Protocol (LIFO).",
        "Visualize Push and Pop operations on R6.",
        "Understand Stack Frames and Function Calls."
      ],
      sections: [
        {
          title: "8.1 The Runtime Stack",
          content: (
            <>
              <p className="mb-4">
                When we call a function (or subroutine), we need a place to store temporary data: the return address, the arguments, and local variables.
              </p>
              <p className="mb-4">
                We use a <strong>Stack</strong>. In the LC-3, R6 is the <strong>Stack Pointer</strong>.
              </p>
              <p className="mb-4 border-l-4 border-neon-cyan pl-4 italic text-slate-400">
                Crucial Concept: The Stack grows <strong>DOWN</strong>. When you push data, the address in R6 gets smaller (decrements). When you pop, R6 increments.
              </p>
            </>
          )
        },
        {
          title: "8.2 Activation Records",
          content: (
            <>
              <p className="mb-4">
                Every time a function is called, we push a standardized block of data called a <strong>Stack Frame</strong> (or Activation Record).
              </p>
              <p className="mb-4">
                This frame typically contains:
              </p>
              <ul className="list-decimal pl-6 mb-4 space-y-1 text-slate-300">
                <li><strong>Function Arguments</strong></li>
                <li><strong>Return Address</strong> (Where to go back to)</li>
                <li><strong>Frame Pointer</strong> (Where the previous stack frame was)</li>
                <li><strong>Local Variables</strong></li>
              </ul>
              <div className="my-8">
                <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.STACK_VISUALIZER)}
                  title="Lab Assignment 9: Stack Visualizer"
                  desc="Push a Stack Frame. Watch R6 move down. Note how the addresses decrease as the stack gets deeper."
                />
              </div>
            </>
          )
        }
      ]
    }
  ];

  const activeChapterData = BOOK_CONTENT.find(c => c.id === activeChapter) || BOOK_CONTENT[0];

  // --- RENDER ---

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      
      {/* Sidebar (Table of Contents) */}
      <div className="w-full lg:w-72 shrink-0 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-neon-cyan" /> Table of Contents
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
           {BOOK_CONTENT.map(chapter => (
             <button
               key={chapter.id}
               onClick={() => handleChapterChange(chapter.id)}
               className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex justify-between items-center group
                 ${activeChapter === chapter.id 
                   ? 'bg-slate-800 text-neon-cyan border border-slate-700' 
                   : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                 }`}
             >
               <span className="truncate">{chapter.title}</span>
               {activeChapter === chapter.id && <ChevronRight className="w-4 h-4 shrink-0" />}
             </button>
           ))}
        </div>
      </div>

      {/* Reading Pane */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col relative shadow-2xl">
         {/* Book Header */}
         <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center px-8 justify-between shrink-0">
            <h1 className="text-lg md:text-xl font-serif font-bold text-slate-200 tracking-wide truncate pr-4">
              {activeChapterData.title}
            </h1>
            <div className="text-xs font-mono text-slate-600 uppercase hidden md:block shrink-0">
               The Silicon Chronicles
            </div>
         </div>

         {/* Content */}
         <div id="book-content-scroller" className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-slate-900">
            <div className="max-w-3xl mx-auto space-y-12">
               
               {/* Learning Objectives Box */}
               <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-xl p-6 mb-8">
                  <h4 className="text-emerald-500 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                     <GraduationCap className="w-4 h-4" /> Learning Objectives
                  </h4>
                  <ul className="space-y-2">
                     {activeChapterData.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                           <span className="text-emerald-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                           {obj}
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Sections */}
               {activeChapterData.sections.map((section, idx) => (
                 <div key={idx} className="animate-fadeIn">
                    <h3 className="text-xl md:text-2xl font-bold text-neon-cyan mb-6 flex items-center gap-2">
                      <span className="text-slate-600 text-sm font-mono mr-2">§</span>
                      {section.title}
                    </h3>
                    <div className="font-serif text-lg leading-relaxed text-slate-300">
                       {section.content}
                    </div>
                    {idx !== activeChapterData.sections.length - 1 && (
                      <div className="h-px bg-slate-800 w-full my-12 opacity-50"></div>
                    )}
                 </div>
               ))}
            </div>
            
            {/* Footer Nav */}
            <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-slate-800 flex justify-between">
               <button 
                 onClick={() => {
                   const idx = BOOK_CONTENT.findIndex(c => c.id === activeChapter);
                   if (idx > 0) handleChapterChange(BOOK_CONTENT[idx-1].id);
                 }}
                 disabled={BOOK_CONTENT.findIndex(c => c.id === activeChapter) === 0}
                 className="text-slate-500 hover:text-white disabled:opacity-0 transition-colors flex items-center gap-2 text-sm font-bold uppercase"
               >
                 Previous Chapter
               </button>

               <button 
                 onClick={() => {
                   const idx = BOOK_CONTENT.findIndex(c => c.id === activeChapter);
                   if (idx < BOOK_CONTENT.length - 1) handleChapterChange(BOOK_CONTENT[idx+1].id);
                 }}
                 disabled={BOOK_CONTENT.findIndex(c => c.id === activeChapter) === BOOK_CONTENT.length - 1}
                 className="text-neon-cyan hover:text-cyan-300 disabled:opacity-0 transition-colors flex items-center gap-2 text-sm font-bold uppercase"
               >
                 Next Chapter <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

// Helper for Lab Links
const InteractiveLink: React.FC<{ title: string; desc: string; onClick: () => void }> = ({ title, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-neon-cyan/50 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 text-left shadow-lg hover:shadow-neon-cyan/10"
  >
    <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 group-hover:border-neon-cyan/50 group-hover:text-neon-cyan transition-colors shrink-0">
      <ExternalLink className="w-6 h-6" />
    </div>
    <div>
      <div className="font-bold text-slate-200 group-hover:text-neon-cyan transition-colors flex items-center gap-2 text-lg">
        {title} <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
      <div className="text-sm text-slate-400 font-sans mt-1 leading-snug">{desc}</div>
    </div>
  </button>
);