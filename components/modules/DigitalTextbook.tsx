
import React, { useState, useEffect, useRef } from 'react';
import { ModuleId } from '../../types';
import { 
  ChevronRight, ChevronLeft, ExternalLink, 
  GraduationCap, Lightbulb, Menu, X, Bookmark, Zap,
  Cpu, Activity
} from 'lucide-react';

interface DigitalTextbookProps {
  onNavigate: (id: ModuleId) => void;
}

// --- DATA STRUCTURES ---

interface BookPage {
  title: string;
  content: React.ReactNode;
}

interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  pages: BookPage[];
}

// --- UI COMPONENTS ---

const FigureBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="my-8 border border-slate-700 bg-slate-900/50 rounded-xl overflow-hidden shadow-2xl">
    <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
      <span className="text-xs font-bold text-neon-cyan uppercase tracking-widest font-mono">
        FIG: {title}
      </span>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
      </div>
    </div>
    <div className="p-8 flex flex-col items-center justify-center font-mono text-sm text-slate-300">
      {children}
    </div>
  </div>
);

const AnalogyBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="my-8 p-6 bg-indigo-900/20 border-l-4 border-indigo-400 rounded-r-xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <Lightbulb className="w-16 h-16 text-indigo-400" />
    </div>
    <h4 className="text-indigo-300 font-bold mb-3 flex items-center gap-2 text-lg">
      <Lightbulb className="w-5 h-5" />
      The Feynman Analogy: {title}
    </h4>
    <div className="text-slate-300 leading-relaxed relative z-10 font-serif text-lg">
      {children}
    </div>
  </div>
);

const DeepDive: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="my-8 p-6 bg-slate-950 border border-slate-800 rounded-xl">
    <h4 className="text-neon-amber font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-widest border-b border-slate-800 pb-2">
      <Zap className="w-4 h-4" />
      Deep Dive: {title}
    </h4>
    <div className="text-slate-400 leading-relaxed text-sm">
      {children}
    </div>
  </div>
);

const KeyConcept: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="my-6 p-6 bg-emerald-900/10 border-l-4 border-emerald-500 rounded-r-lg">
    <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
      <GraduationCap className="w-4 h-4" />
      {title}
    </h4>
    <div className="text-slate-300 leading-relaxed">
      {children}
    </div>
  </div>
);

const InteractiveLink: React.FC<{ title: string; desc: string; onClick: () => void }> = ({ title, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full group bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-800/50 hover:border-neon-emerald/50 rounded-xl p-5 flex items-start gap-5 transition-all duration-300 text-left shadow-lg relative overflow-hidden my-6"
  >
    <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 group-hover:border-neon-emerald/50 group-hover:text-neon-emerald transition-colors shrink-0 z-10">
      <ExternalLink className="w-6 h-6" />
    </div>
    <div className="z-10">
      <div className="font-bold text-slate-200 group-hover:text-neon-emerald transition-colors flex items-center gap-2 text-lg">
        {title} 
      </div>
      <div className="text-sm text-slate-400 font-sans mt-2 leading-relaxed max-w-lg">{desc}</div>
    </div>
  </button>
);

// --- MAIN COMPONENT ---

export const DigitalTextbook: React.FC<DigitalTextbookProps> = ({ onNavigate }) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- CONTENT DEFINITION ---
  
  const CHAPTERS: Chapter[] = [
    {
      id: 'CH1',
      title: '1. Welcome Aboard',
      subtitle: 'The Grand Transformation',
      pages: [
        {
          title: "1.1 The Big Secret: There is No Magic",
          content: (
            <>
              <p className="drop-cap">
                Look at this box on your desk. It plays music, it calculates the trajectory of a rocket, it lets you talk to your grandmother in Timbuktu. It feels like magic. But the first thing we have to agree on—and this is the most important thing in this entire book—is that <strong>there is no magic</strong>.
              </p>
              <p>
                A computer is a <strong>deterministic machine</strong>. That’s a fancy word, but it just means this: if you hit it over the head the same way, in the same spot, under the same conditions, it will yell "Ouch" exactly the same way every single time. It has no brain. It has no soul. It is an electronic idiot. It does exactly what we tell it to do, nothing more, nothing less.
              </p>
              <p>
                Our job is to figure out how we get a pile of silicon and copper to act like it’s thinking. We are going to build this understanding from the bottom up. We aren't going to start with "Windows" or "C++". We are going to start with electrons.
              </p>
            </>
          )
        },
        {
          title: "1.2 The Two Big Ideas",
          content: (
            <>
              <p>
                Before we get into the wiring, there are two ideas in this chapter that you have to hold in your head at the same time.
              </p>
              
              <KeyConcept title="Idea #1: The Universal Machine">
                You might think a supercomputer at NASA is smarter than the chip in your dishwasher. In terms of speed? Sure. But in terms of capability? No.
                <br/><br/>
                Alan Turing, a brilliant fellow, figured this out in the 1930s. He proved that if you have a machine that can do a few simple things—read a symbol, write a symbol, move a tape back and forth—it can compute <strong>anything that is computable</strong>.
                <br/><br/>
                This means that the massive supercomputer and the tiny chip are mathematically equivalent. If you gave the tiny chip enough memory and enough time (maybe a billion years), it could simulate the universe just as well as the supercomputer. Speed is just engineering; computability is a fundamental law.
              </KeyConcept>

              <KeyConcept title="Idea #2: The Layers of Transformation">
                 Here is the problem: You speak English (or French, or Japanese). The computer speaks "Electron." Specifically, it speaks "Voltage High" and "Voltage Low."
                 <br/><br/>
                 How do we get from "I want to calculate the orbit of Mars" to "Turn this switch on and that switch off"? We do it through a series of transformations. It’s like a bucket brigade. We hand the problem down, step by step, translating it into simpler and simpler languages until it’s just electricity.
              </KeyConcept>
            </>
          )
        },
        {
          title: "1.3 The Ladder of Reality (Part 1)",
          content: (
            <>
              <p>Let’s walk down this ladder of transformation.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-neon-cyan mb-2">Level 1: The Problem</h3>
                  <p>
                    This is the real world. You want to sort a list of names, or fly a plane. You state this in natural language. "Sort these names." The problem with natural language is that it's messy. It’s ambiguous. If I say, "Time flies like an arrow," am I talking about the speed of time, or am I telling you to measure the speed of flies the way you would measure an arrow? A computer can't handle that mess.
                  </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-neon-cyan mb-2">Level 2: The Algorithm</h3>
                   <p>
                     So, we tighten it up. We create an Algorithm. This is a step-by-step procedure that is guaranteed to finish. It’s like a recipe for a cake.
                   </p>
                   <ul className="list-disc pl-6 space-y-1 my-2 font-mono text-sm bg-slate-800 p-4 rounded-lg">
                      <li>Look at the first name.</li>
                      <li>Compare it to the second name.</li>
                      <li>If the first is bigger, swap them.</li>
                   </ul>
                   <p>
                     It has to be precise. "Stir until lumpy" is a bad instruction for a computer. "Stir 50 times" is a good one.
                   </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-neon-cyan mb-2">Level 3: The Language</h3>
                   <p>
                     Now we have to tell the computer the plan. We use a Programming Language (like C, which we will learn later). This is a bridge. It looks a bit like English—it has words like <code>if</code> and <code>while</code>—but it has strict grammar rules. It’s a mechanical language.
                   </p>
                </div>
              </div>
            </>
          )
        },
        {
          title: "1.3 The Ladder of Reality (Part 2)",
          content: (
            <>
              <div className="space-y-6">
                <div>
                   <h3 className="text-xl font-bold text-neon-cyan mb-2">Level 4: The ISA (Instruction Set Architecture)</h3>
                   <p>
                     This is the most critical interface in the whole machine. The ISA is the vocabulary of the computer.
                   </p>
                   <p>
                     Imagine you are hiring a worker. You hand them a contract that says: "Here are the 15 jobs I can ask you to do. I can ask you to ADD, I can ask you to LOAD, I can ask you to STOP." That contract is the ISA.
                   </p>
                   <p>
                     It doesn't matter how the worker does the ADD (maybe they use a calculator, maybe they use their fingers)—that’s their business. The ISA just defines what is available. In this book, we use an ISA called the LC-3. It’s simple, but it’s real.
                   </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-neon-cyan mb-2">Level 5: The Microarchitecture</h3>
                   <p>
                     Now we look inside the worker’s head. This is the specific design that implements the ISA. If Intel makes a chip and AMD makes a chip, they might both speak the same language (ISA), but inside, they are wired completely differently. One might do addition in 1 nanosecond; the other might take 2. That’s the microarchitecture. It’s the trade-off between cost and performance.
                   </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-neon-cyan mb-2">Level 6: The Logic Circuit</h3>
                   <p>
                     Dig deeper. The microarchitecture is made of logic gates—AND gates, OR gates, NOT gates. These are the decision makers. They take simple inputs and give a simple output.
                   </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-neon-cyan mb-2">Level 7: The Devices</h3>
                   <p>
                     Finally, we hit the bottom. Physics. The logic gates are made of transistors. Transistors are just switches controlled by electricity. We are manipulating electrons in silicon crystals.
                   </p>
                </div>
              </div>
            </>
          )
        },
        {
          title: "1.4 Abstraction: The Art of Ignoring Details",
          content: (
            <>
               <p>
                 You might be thinking, "Richard, do I really need to worry about electrons to write a video game?"
               </p>
               <p>
                 Usually? No. That’s the beauty of <strong>Abstraction</strong>.
               </p>
               <AnalogyBox title="Driving a Car">
                  When you drive a car, you use the steering wheel. You don't think about the fuel injection timing or the explosion in the piston. You treat the engine as a black box.
                  <br/><br/>
                  But—and this is a big "but"—what happens when the car starts making a funny noise? Or you want to drive it in the desert where the heat changes how the engine works? Then, the abstraction leaks.
               </AnalogyBox>
               <p>
                 If you want to be a great computer scientist, you cannot be afraid of what is under the hood. You can usually ignore the details to be efficient, but you must be able to "deconstruct" the abstraction when things go wrong. We are going to learn the whole stack so you are never at the mercy of the machine.
               </p>
            </>
          )
        }
      ]
    },
    {
      id: 'CH2',
      title: '2. The Alphabet',
      subtitle: 'Bits, Data Types, and Operations',
      pages: [
        {
          title: "2.1 The Bit: Why Binary?",
          content: (
            <>
               <p className="drop-cap">
                 Why do computers use 0s and 1s? Is it because they love base-2 mathematics? No. It’s because nature is <strong>noisy</strong>.
               </p>
               <p>
                 Imagine we tried to build a computer using voltage levels to represent numbers 0 through 9.
               </p>
               <ul className="list-none pl-6 space-y-1 font-mono text-sm bg-slate-800 p-4 rounded-lg my-4">
                  <li>0 Volts = 0</li>
                  <li>0.5 Volts = 1</li>
                  <li>1.0 Volts = 2 ... and so on.</li>
               </ul>
               <p>
                 Now, imagine a wire gets a little interference from a nearby microwave, or the wire gets hot. The voltage spikes from 0.5V to 0.6V. Suddenly, your "1" looks like a "1.2". Is that a 1? Is it a 2? The computer gets confused.
               </p>
               <p>
                 So we simplify. We say:
               </p>
               <ul className="list-disc pl-6 space-y-1 font-bold">
                  <li>Low Voltage (near 0) = 0</li>
                  <li>High Voltage (near 2.9) = 1</li>
               </ul>
               <p>
                 Now, if the noise bumps the voltage a little bit, it doesn't matter. It’s still "High" or "Low." It is robust. We call these <strong>Bits</strong> (Binary Digits).
               </p>
            </>
          )
        },
        {
          title: "2.2 The Integer: Storing Numbers",
          content: (
            <>
               <p>
                 A single bit is boring. It can only say "Yes" or "No." To say something interesting, we have to string them together.
               </p>
               <p>
                 If we have 16 bits (wires), we can create 2<sup>16</sup> different combinations. That's 65,536 distinct patterns. But what do those patterns mean?
               </p>
               <p>
                 This is the concept of a <strong>Data Type</strong>. The bit pattern <code>0000 0000 0010 1001</code> is just a pattern.
               </p>
               <div className="my-6 space-y-4">
                  <div className="p-4 bg-slate-800 rounded border-l-4 border-neon-cyan">
                    If we say it's an <strong>Unsigned Integer</strong>, it represents the number 41.
                  </div>
                  <div className="p-4 bg-slate-800 rounded border-l-4 border-neon-amber">
                    If we say it's a <strong>Signed Integer</strong>, it represents +41.
                  </div>
                  <div className="p-4 bg-slate-800 rounded border-l-4 border-fuchsia-500">
                    If we say it's a <strong>Floating Point number</strong>, it represents a tiny fraction.
                  </div>
               </div>
               <p>
                 The bits are the same. The meaning depends on how we interpret them.
               </p>
            </>
          )
        },
        {
          title: "2.3 The 2's Complement: A Stroke of Genius",
          content: (
            <>
               <p>
                 We need to represent negative numbers. The naive way is to use the first bit as a minus sign (0 for plus, 1 for minus). This is called "Signed Magnitude."
               </p>
               <p>
                 But this is messy. It gives you a "positive zero" and a "negative zero," which is mathematically nonsense. Plus, building a circuit to add these numbers is complicated.
               </p>
               <p>
                 Engineers are lazy, which means they are smart. They found a representation called <strong>2's Complement</strong>.
               </p>
               <KeyConcept title="The 2's Complement Trick">
                 Here is the trick: To get a negative number, you flip all the bits (turn 0s to 1s) and add 1.
                 <br/><br/>
                 Why on earth would we do that? Because it makes the math work automatically! If you add 5 and -5 using this system, the binary addition naturally rolls over and results in 0 (ignoring the carry). We don't need a separate "subtractor" circuit. We just use the "adder" circuit for everything. It is beautiful efficiency.
               </KeyConcept>
               <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.BIT_FLIPPER)}
                  title="Try it: The Bit Flipper"
                  desc="Go to the Bit Flipper module and observe how the Signed Value changes when you flip the MSB (Most Significant Bit)."
               />
            </>
          )
        },
        {
          title: "2.4 Operations: Arithmetic",
          content: (
            <>
               <p>
                 We have these bits. What can we do with them?
               </p>
               <h3 className="text-xl font-bold text-white mt-6 mb-2">Arithmetic</h3>
               <p>
                 We can ADD them. The computer adds exactly like you do in grade school, column by column, carrying the 1.
               </p>
               
               <h3 className="text-xl font-bold text-white mt-6 mb-2">Sign Extension</h3>
               <p>
                 Sometimes we have a small number (say, 5 bits) and we want to fit it into a big register (16 bits). If it's a positive number, we just fill the empty space with 0s.
               </p>
               <p>
                 But if it's negative? We have to fill the empty space with 1s to keep the value correct. This is called <strong>Sign Extension</strong>.
               </p>
               <AnalogyBox title="The Debt Analogy">
                  Think of it like taking a debt of $5 and writing it as $005.00 versus -$05.00. You have to keep the sign.
               </AnalogyBox>
            </>
          )
        },
        {
          title: "2.4 Operations: Logic",
          content: (
            <>
               <p>We can also do logic. These operations work bit-by-bit.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
                     <div className="text-neon-cyan font-bold mb-2">AND</div>
                     <p className="text-sm">True only if A and B are true. (I will go to the movies if I have money AND I have time).</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
                     <div className="text-neon-cyan font-bold mb-2">OR</div>
                     <p className="text-sm">True if A or B (or both) are true.</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
                     <div className="text-neon-cyan font-bold mb-2">NOT</div>
                     <p className="text-sm">Flip the value. True becomes False.</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded border border-slate-700">
                     <div className="text-neon-cyan font-bold mb-2">XOR (Exclusive OR)</div>
                     <p className="text-sm">True if A or B is true, but not both. This is useful for detecting differences.</p>
                  </div>
               </div>
            </>
          )
        },
        {
          title: "2.5 The Floating Point (Briefly)",
          content: (
            <>
               <p>
                 Integers are great for counting apples. They are terrible for measuring the distance between atoms or the weight of a star. For that, we need <strong>Floating Point</strong>.
               </p>
               <p>
                 This is scientific notation for binary. We use some bits for the sign, some bits for the exponent (the magnitude), and some bits for the fraction (the precision).
               </p>
               <FigureBox title="Floating Point Formula">
                  N = (-1)<sup>S</sup> × 1.Fraction × 2<sup>Exponent - 127</sup>
               </FigureBox>
               <p>
                 It trades <strong>precision</strong> for <strong>range</strong>. You can represent massive numbers, but you might lose a little accuracy in the tiny decimal places.
               </p>
            </>
          )
        },
        {
          title: "2.6 Hexadecimal: For Humans Only",
          content: (
            <>
               <p>
                 Finally, looking at <code>1011010111010111</code> makes your eyes cross. It’s hard to remember. So we use <strong>Hexadecimal</strong> (Base 16).
               </p>
               <p>
                 We group the bits into sets of four. Each set of four bits maps to a digit 0-9 or a letter A-F.
               </p>
               <ul className="font-mono text-sm bg-slate-800 p-4 rounded-lg my-4 space-y-1">
                 <li>1011 becomes <strong>B</strong></li>
                 <li>0101 becomes <strong>5</strong></li>
               </ul>
               <p>
                 The computer doesn't know Hex exists. It only sees binary. Hex is purely a convenience for us poor humans so we don't make mistakes copying down patterns.
               </p>
            </>
          )
        }
      ]
    },
    {
      id: 'CH3',
      title: '3. Digital Logic Structures',
      subtitle: 'Tricking Sand into Thinking',
      pages: [
        {
          title: "3.1 The Transistor: The Wall Switch",
          content: (
             <>
               <p className="drop-cap">
                 Welcome back. In the last chapter, we agreed to use Os and 1s to represent everything—numbers, letters, pictures of your cat. But that was just an agreement. It was marks on paper. Now we have to build the machine that actually handles those Os and 1s.
               </p>
               <p>
                 We are going to start with a grain of sand (silicon), turn it into a switch, build that switch into a logic gate, and by the end of this chapter, we will have built a memory that can remember things and a state machine that can make decisions.
               </p>
               <p>
                 At the very bottom of your computer, there is no "intelligence." There is just a switch.
               </p>
               <AnalogyBox title="The Wall Switch">
                 Think of a wall switch in your house. You flip it up, the light goes on. You flip it down, the light goes off. That is a mechanical switch. It works great, but it’s slow, and you need a human to flip it.
                 <br/><br/>
                 We need a switch that can be flipped by electricity. That is the <strong>MOS Transistor</strong> (Metal-Oxide Semiconductor).
               </AnalogyBox>
               
               <h4 className="text-xl font-bold text-white mt-6 mb-2">N-Type vs P-Type</h4>
               <div className="space-y-4">
                 <div className="p-4 bg-slate-800 rounded border-l-4 border-neon-cyan">
                    <strong className="text-neon-cyan block mb-1">N-Type (Normally Open)</strong>
                    If you put 2.9 Volts (Logic 1) on the Gate, it closes the circuit. Current flows. If you put 0 Volts, it opens. It acts like a wire when the Gate is 1.
                 </div>
                 <div className="p-4 bg-slate-800 rounded border-l-4 border-neon-amber">
                    <strong className="text-neon-amber block mb-1">P-Type (The Contrarian)</strong>
                    If you put 0 Volts on the Gate, it acts like a wire. Current flows. If you put 2.9 Volts, it breaks the circuit. It acts like a wire when the Gate is 0.
                 </div>
               </div>
               <p className="mt-4">
                 We call circuits that use both of these <strong>CMOS</strong> (Complementary MOS). They are complementary because when one is working, the other is usually resting. This saves a lot of energy.
               </p>
             </>
          )
        },
        {
          title: "3.2 Logic Gates: Building Sentences",
          content: (
             <>
               <p>
                 Now, a single switch isn't very smart. But if we wire a few of them together, we can perform Logic. We can make physical devices that answer "True" or "False."
               </p>

               <div className="my-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">The NOT Gate (The Inverter)</h4>
                    <p>
                      This is the simplest one. We want a device where if we put in a 0, we get out a 1. If we put in a 1, we get out a 0. It flips the world upside down.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">The NOR and OR Gates</h4>
                    <p>
                      Suppose we have two inputs, A and B. We want the output to be 1 only if neither A nor B is 1. We call this NOR (Not-OR).
                      If we want a regular OR gate (where the output is 1 if A or B is 1), we just take a NOR gate and stick a NOT gate (inverter) on the end of it.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">The NAND and AND Gates</h4>
                    <p>
                      We can also build a NAND gate (Not-AND). Here, the output is 0 only if both A and B are 1. To get a regular AND gate, we take the NAND and invert it.
                    </p>
                  </div>
               </div>
               
               <DeepDive title="Logical Completeness">
                 Why is this important? Because with just these simple gates (AND, OR, NOT), we can build <strong>any</strong> digital circuit. You can build a supercomputer out of nothing but NAND gates if you have enough of them.
               </DeepDive>

               <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.GATE_LOGIC)}
                  title="Lab: Logic Gates"
                  desc="Experiment with AND, OR, and NOT gates. See how different inputs affect the output."
               />
             </>
          )
        },
        {
           title: "3.3 Combinational Logic",
           content: (
             <>
               <p>
                 Now we step up a level. We stop thinking about transistors and start thinking about "blocks" of logic. We call these <strong>Combinational Logic Circuits</strong> because their output depends only on the current combination of inputs. They have no memory. They don't know what happened five minutes ago. They only know "right now".
               </p>
               
               <div className="space-y-6 mt-6">
                 <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-neon-cyan font-bold mb-2">The Decoder</h4>
                    <p>
                      Imagine you have a 2-bit number. It can be 00, 01, 10, or 11. You want to pick one of four specific wires to turn on based on that number. This is a Decoder. It translates a binary pattern into a specific action line. "I want to talk to house number 2, not 1 or 3".
                    </p>
                 </div>

                 <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-neon-cyan font-bold mb-2">The Mux (Multiplexer)</h4>
                    <p>
                      This is the traffic cop. Suppose you have two inputs, A and B, and one output. You want to decide which input gets to go through to the output. You add a "Select" line (S). If S is 0, A goes through. If S is 1, B goes through. It essentially says, "I select YOU to speak".
                    </p>
                 </div>

                 <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-neon-cyan font-bold mb-2">The Full Adder</h4>
                    <p>
                      This is where the math happens. We can build a circuit called a Full Adder that takes three inputs: Bit A, Bit B, and the Carry-In from the previous column. It spits out two things: the Sum and the Carry-Out. By chaining these together, we can add numbers of any size.
                    </p>
                 </div>
               </div>

               <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.COMBINATIONAL_CIRCUITS)}
                  title="Lab: Combinational Circuits"
                  desc="Build an Adder and control a Mux. Watch the 'traffic cop' route signals in real-time."
               />
             </>
           )
        },
        {
           title: "3.4 Storage Elements: How to Remember",
           content: (
             <>
                <p>
                  Combinational circuits are great, but they have amnesia. As soon as the input changes, the output changes. To build a computer, we need <strong>Memory</strong>. We need to store a 1 and keep it there until we say otherwise.
                </p>
                <p>
                  How do we do that? We create a <strong>feedback loop</strong>.
                </p>
                
                <h3 className="text-xl font-bold text-white mt-6 mb-2">The R-S Latch</h3>
                <p>
                  Imagine two NAND gates. Take the output of the first one and plug it into the input of the second one. Take the output of the second one and plug it back into the first one. You have created a loop. This circuit can now maintain a state.
                </p>
                <ul className="list-disc pl-6 space-y-1 my-2">
                   <li><strong>S (Set):</strong> Sets the value to 1.</li>
                   <li><strong>R (Reset):</strong> Sets the value to 0.</li>
                   <li><strong>Quiescent State:</strong> If you leave S and R alone, the latch just holds whatever value it had last. It remembers!</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-2">The Gated D Latch</h3>
                <p>
                  The R-S latch is a bit finicky. We improve it by adding a "Write Enable" (WE) wire.
                  When WE is 1, the latch listens to the Data input (D) and sets itself to that value.
                  When WE is 0, the latch ignores the input and just holds its value.
                  This is the basic building block of computer memory. We call it a <strong>Register</strong>.
                </p>
             </>
           )
        },
        {
          title: "3.5 Memory: The Big Grid",
          content: (
             <>
               <p>
                 Now, take a whole bunch of those latches. Let's say we want a memory that can hold 4 "words," and each word is 3 bits wide. We call this a 2<sup>2</sup>-by-3-bit memory.
               </p>
               <p>
                 We arrange them in a grid.
               </p>
               <FigureBox title="The RAM Grid">
                  <div className="flex flex-col gap-2 w-full max-w-md font-mono text-sm text-center">
                     <div className="p-2 border border-slate-600 rounded bg-slate-800">Decoder (Picks the Row)</div>
                     <div className="text-slate-500">↓</div>
                     <div className="grid grid-rows-4 gap-1 p-2 border border-slate-700 bg-slate-900">
                        <div className="bg-slate-800 h-8 flex items-center justify-center">Word 0 (Latches)</div>
                        <div className="bg-slate-800 h-8 flex items-center justify-center">Word 1 (Latches)</div>
                        <div className="bg-slate-800 h-8 flex items-center justify-center">Word 2 (Latches)</div>
                        <div className="bg-slate-800 h-8 flex items-center justify-center">Word 3 (Latches)</div>
                     </div>
                     <div className="text-slate-500">↓</div>
                     <div className="p-2 border border-slate-600 rounded bg-slate-800">Mux (Reads the Data)</div>
                  </div>
               </FigureBox>
               <p>
                 This is all "16 Megabytes of RAM" is—just a massive, organized grid of these simple latches, decoders, and muxes. We use a Write Enable line to tell the latches when to save new information.
               </p>
             </>
          )
        },
        {
          title: "3.6 Sequential Logic: The Concept of State",
          content: (
             <>
               <p>
                 Finally, we combine the decision-making (Combinational Logic) with the memory (Storage). This gives us <strong>Sequential Logic</strong>.
               </p>
               
               <AnalogyBox title="The Combination Lock">
                 Think of a combination lock (the dial kind). To open it, you have to turn Right to 13, Left to 22, Right to 3. 
                 <br/><br/>
                 If you just go straight to 3, it won't open. The lock <strong>remembers the history</strong>. It knows what state it is in.
                 <br/><br/>
                 State A: Start.<br/>
                 State B: "I have seen the first number (13)."<br/>
                 State C: "I have seen 13 and then 22."<br/>
                 State D: Open.
               </AnalogyBox>

               <p>
                 This is a <strong>Finite State Machine (FSM)</strong>. The output depends on two things: the current input and the current state (memory of the past).
               </p>
               <p>
                 The "Brain" of the computer (the Control Unit) is just a big Finite State Machine. It moves from step to step—Fetch, Decode, Execute—based on the clock tick.
               </p>
               
               <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.SEQUENTIAL_LOGIC)}
                  title="Lab: Sequential Logic"
                  desc="Interact with the R-S Latch and D-Latch. See how the feedback loop creates memory."
               />

               <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-slate-400 italic">
                 Summary: We started with sand (silicon). We turned it into switches (transistors). We arranged switches to make logic (gates). We arranged gates to do math (adders) and store bits (latches). We combined them to make a machine that can remember the past and decide the future (State Machine).
                 <br/><br/>
                 We have all the parts. In the next chapter, we are going to put them together to build the Von Neumann Model—the architecture of a real computer.
               </div>
             </>
          )
        }
      ]
    },
    {
      id: 'CH4',
      title: '4. The Von Neumann Model',
      subtitle: 'The Grand Architecture',
      pages: [
        {
          title: "The Architecture: The Big Picture",
          content: (
            <>
              <p className="drop-cap">
                We have spent a lot of time looking at the bricks—the transistors, the gates, the latches. Now, we are going to act like architects. We are going to take those bricks and build a building.
              </p>
              <p>
                In 1946, a genius named John von Neumann proposed a model for how a computer should be put together. And the amazing thing is, almost every computer you have ever used—from the massive supercomputers predicting the weather to the tiny chip inside your microwave—is built on this exact same plan. It works.
              </p>
              <p>
                We call it the <strong>von Neumann Model</strong>. It’s not magic; it’s just organization. It divides the computer into five basic parts, all working together like instruments in an orchestra.
              </p>
              <div className="my-6 p-6 bg-slate-800 border-2 border-slate-700 rounded-xl flex flex-wrap justify-center gap-4 text-center text-sm font-bold text-slate-300">
                 <div className="p-4 bg-slate-900 rounded border border-slate-600 w-32">Input</div>
                 <div className="p-4 bg-slate-900 rounded border border-slate-600 w-32 flex flex-col justify-center gap-2">
                    <span className="text-neon-cyan">Processing Unit</span>
                    <span className="text-xs text-slate-500 font-normal">ALU + Registers</span>
                 </div>
                 <div className="p-4 bg-slate-900 rounded border border-slate-600 w-32 flex flex-col justify-center gap-2">
                    <span className="text-neon-amber">Memory</span>
                    <span className="text-xs text-slate-500 font-normal">MAR + MDR</span>
                 </div>
                 <div className="p-4 bg-slate-900 rounded border border-slate-600 w-32 flex flex-col justify-center gap-2">
                    <span className="text-fuchsia-500">Control Unit</span>
                    <span className="text-xs text-slate-500 font-normal">PC + IR</span>
                 </div>
                 <div className="p-4 bg-slate-900 rounded border border-slate-600 w-32">Output</div>
              </div>
            </>
          )
        },
        {
          title: "4.1 The Five Basic Components: Memory",
          content: (
             <>
               <AnalogyBox title="The Post Office">
                 Imagine a massive wall of post office boxes. Each box has a unique number on it—that’s the <strong>Address</strong>. Inside each box, there is a slip of paper with some information written on it—that’s the <strong>Data</strong>.
                 <br/><br/>
                 That is all computer memory is. It’s a collection of storage locations.
               </AnalogyBox>

               <div className="space-y-4 my-6">
                 <div>
                    <h4 className="font-bold text-white">Address Space</h4>
                    <p>This tells you how many boxes you have. If you have 2<sup>28</sup> boxes, you need 28 bits just to write down the address of a specific box.</p>
                 </div>
                 <div>
                    <h4 className="font-bold text-white">Addressability</h4>
                    <p>This tells you how big the slip of paper inside the box is. In the LC-3 (the computer we are studying), each box holds exactly 16 bits of data. We say it is "16-bit addressable".</p>
                 </div>
               </div>

               <p>
                 Now, here is the trick. You are the Control Unit. You can't just reach your hand into the memory wall. It’s too far away. You need an interface. You use two special registers:
               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-800 p-4 rounded border-l-4 border-neon-amber">
                     <strong className="text-neon-amber block mb-1">MAR (Memory Address Register)</strong>
                     You write the number of the box you want on a slip of paper and put it here.
                  </div>
                  <div className="bg-slate-800 p-4 rounded border-l-4 border-neon-cyan">
                     <strong className="text-neon-cyan block mb-1">MDR (Memory Data Register)</strong>
                     You wait a moment. Then, the memory system magically takes the content of that box and puts it here for you to read. Or, if you are writing to memory, you put your data here.
                  </div>
               </div>
             </>
          )
        },
        {
          title: "4.1 The Five Basic Components: CPU & Control",
          content: (
            <>
               <h3 className="text-xl font-bold text-white mb-2">The Processing Unit: The Calculator</h3>
               <p>
                 This is where the actual work happens. The core of this unit is the <strong>ALU (Arithmetic and Logic Unit)</strong>. It’s a simple calculator. It can add, it can subtract, and it can do logical operations like AND and NOT.
               </p>
               <p>
                 But the ALU is fast—blindingly fast. Memory is slow. If the ALU had to walk over to the Post Office (Memory) every time it needed a number, it would spend all its time walking and no time calculating.
               </p>
               <p>
                 So, we give the Processing Unit a "scratchpad"—a small set of extremely fast storage locations right next to the ALU. We call these <strong>Registers</strong>. In the LC-3, we have 8 of them: R0, R1, ... R7. They are like the pockets in your pants. You keep the things you are working on right now in your pockets. Everything else stays in the Post Office.
               </p>

               <div className="my-8 border-t border-slate-700 pt-8">
                 <h3 className="text-xl font-bold text-white mb-2">Input and Output (I/O)</h3>
                 <p>
                   If the computer just sat there thinking, it wouldn't be very useful. It needs to talk to us. We group keyboards, mice, monitors, and printers together as <strong>Peripherals</strong>.
                 </p>
               </div>

               <div className="my-8 border-t border-slate-700 pt-8">
                 <h3 className="text-xl font-bold text-white mb-2">The Control Unit: The Conductor</h3>
                 <p>
                   This is the most important part. The Control Unit manages the flow. It tells the Memory when to read, the ALU when to add, and the Input when to accept a keypress.
                 </p>
                 <ul className="list-disc pl-6 space-y-2 mt-4">
                   <li>
                     <strong>Instruction Pointer (PC):</strong> Historically called the Program Counter. It tracks where we are in the program. It points to the <em>next</em> instruction.
                   </li>
                   <li>
                     <strong>Instruction Register (IR):</strong> This holds the instruction we are <em>currently</em> working on.
                   </li>
                 </ul>
               </div>

               <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.MINI_CPU)}
                  title="Lab: The Mini Architecture"
                  desc="See the PC, IR, and ALU in action. Write a small assembly program and watch the components interact."
               />
            </>
          )
        },
        {
          title: "4.2 The Instruction Cycle: The Heartbeat",
          content: (
            <>
               <p>
                 The central idea of the von Neumann model is that the program (the instructions) and the data (the numbers) are both stored in the same memory. They are just bits. The only difference is how we treat them.
               </p>
               <p>
                 The computer runs in a loop, doing the same thing over and over, millions of times a second. We call this the <strong>Instruction Cycle</strong>.
               </p>

               <div className="relative border-l-2 border-slate-700 ml-4 pl-8 space-y-8 my-8">
                  <div className="relative">
                    <span className="absolute -left-11 top-0 w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">1</span>
                    <h4 className="font-bold text-white">Fetch</h4>
                    <p className="text-sm">The Control Unit looks at the PC to see the address of the next instruction. It copies that address to the MAR. It tells Memory to "Read". The instruction arrives in the MDR, and is copied to the IR. <strong>Crucial Step:</strong> We increment the PC (PC = PC + 1) so it is ready for the next time.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-11 top-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xs">2</span>
                    <h4 className="font-bold text-white">Decode</h4>
                    <p className="text-sm">Now we have a bunch of bits in the IR. What do they mean? The Control Unit looks at the Opcode. Is it an ADD? A LOAD? A STOP?</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-11 top-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xs">3</span>
                    <h4 className="font-bold text-white">Evaluate Address</h4>
                    <p className="text-sm">If the instruction needs data from memory, we calculate where that data is (e.g., "Address in Register 1 plus 6").</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-11 top-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xs">4</span>
                    <h4 className="font-bold text-white">Fetch Operands</h4>
                    <p className="text-sm">We go get the data. If it's in memory, we use the MAR/MDR again. If it's in a register, we just grab it.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-11 top-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xs">5</span>
                    <h4 className="font-bold text-white">Execute</h4>
                    <p className="text-sm">We do the work. If it's an ADD, the ALU adds. If it's a PRINT, we send data to the monitor.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-11 top-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xs">6</span>
                    <h4 className="font-bold text-white">Store Result</h4>
                    <p className="text-sm">We put the answer somewhere. Back to a register, or back to memory.</p>
                  </div>
               </div>

               <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.LC3_DATAPATH)}
                  title="Lab: LC-3 Datapath"
                  desc="Step through the Fetch-Decode-Execute cycle visually. Watch the control signals fire."
               />
            </>
          )
        },
        {
          title: "4.3 Changing Flow & Stopping",
          content: (
             <>
               <h3 className="text-xl font-bold text-white mb-2">Changing the Flow</h3>
               <p>
                 If computers just executed instructions one after the other (1, 2, 3, 4...), they would be nothing more than fancy calculators. The true power comes from <strong>Control Instructions</strong>.
               </p>
               <p>
                 These instructions allow us to change the sequence. We can say, "Go back to step 1" (a Loop) or "If the result was zero, go to step 10" (an If-Statement).
               </p>
               <p>
                 How do we do this? It’s simple. We just mess with the PC. Normally, the PC increments automatically. But a Control Instruction (like a JUMP) essentially says, "Erase that number in the PC and write this new number instead." The next time the Fetch phase runs, it grabs the instruction from the new location.
               </p>

               <h3 className="text-xl font-bold text-white mt-8 mb-2">Stopping the Machine</h3>
               <p>
                 Since the machine is a loop that runs forever, how do we turn it off? We don't want to just pull the plug. We have a special latch called the <strong>RUN Latch</strong>.
               </p>
               <p>
                 The computer has a "heartbeat" called the Clock Oscillator. As long as the RUN latch is set to "1", the heartbeat reaches the Control Unit. To stop the computer, we execute a HALT instruction. This clears the RUN latch to "0". The heartbeat stops. The machine freezes. It’s waiting there, frozen in time, until you start it up again.
               </p>

               <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-slate-400 italic">
                 Summary: We have defined the anatomy of the beast. We have Memory, a Processing Unit, and a Control Unit. We know it runs in a six-step cycle. Now that we know the architecture, it is time to look at a specific implementation. We are going to meet the LC-3.
               </div>
             </>
          )
        }
      ]
    },
    {
      id: 'CH5',
      title: '5. The LC-3 (Meeting the Machine)',
      subtitle: 'Our Little Computer',
      pages: [
        {
          title: "5.1 The Laboratory Specimen",
          content: (
             <>
                <p className="drop-cap">
                  We have talked about computers in the abstract—"The Processing Unit," "The Memory." It’s all very nice and philosophical. But now, we are going to get our hands dirty. We are going to meet a specific computer.
                </p>
                <p>
                  We call it the <strong>LC-3 (Little Computer 3)</strong>.
                </p>
                <AnalogyBox title="The Laboratory Specimen">
                   Why invent a computer? Why not study the Intel chip inside your laptop? Because modern chips are cluttered with fifty years of "legacy" junk—tricks and patches added to make old programs run faster.
                   <br/><br/>
                   The LC-3 is pure. It has everything a real computer has, but without the clutter. It is the perfect laboratory specimen.
                </AnalogyBox>
             </>
          )
        },
        {
           title: "5.1 The ISA: The Contract",
           content: (
             <>
               <p>
                 Every computer has an <strong>ISA (Instruction Set Architecture)</strong>. This is the contract between the programmer and the hardware.
               </p>
               
               <div className="my-8 p-6 bg-slate-800 border-2 border-slate-600 rounded-xl relative shadow-lg">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 py-1 border border-slate-600 rounded-full text-xs font-bold uppercase tracking-widest text-slate-400">The Contract</div>
                  <div className="flex flex-col gap-6">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center shrink-0 border border-neon-cyan">
                           <span className="text-xl">👨‍💻</span>
                        </div>
                        <div>
                           <div className="text-neon-cyan font-bold text-sm uppercase">The Programmer says:</div>
                           <p className="italic text-slate-300">"If I write the bits 0001, you promise to ADD."</p>
                        </div>
                     </div>
                     <div className="flex gap-4 text-right flex-row-reverse">
                        <div className="w-12 h-12 rounded-full bg-neon-amber/20 flex items-center justify-center shrink-0 border border-neon-amber">
                           <span className="text-xl">🤖</span>
                        </div>
                        <div>
                           <div className="text-neon-amber font-bold text-sm uppercase">The Hardware says:</div>
                           <p className="italic text-slate-300">"Agreed. And if I give you a 1 in the condition code, you promise to treat that as a Negative result."</p>
                        </div>
                     </div>
                  </div>
               </div>
             </>
           )
        },
        {
           title: "5.1 The LC-3 Contract Details",
           content: (
             <>
               <p>The LC-3 contract is simple:</p>

               <div className="space-y-6 my-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">16-bit World</h4>
                    <p>Everything is 16 bits. Addresses are 16 bits. Data is 16 bits. This keeps things symmetrical.</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Memory</h4>
                    <p>We have 2<sup>16</sup> locations (that’s 65,536 mailboxes). Each one holds 16 bits.</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Registers (The Workbench)</h4>
                    <p>We have 8 <strong>General Purpose Registers</strong> (R0 through R7). These are your workbench. You don't do math in memory; you do it here.</p>
                    <FigureBox title="Register File">
                       <div className="grid grid-cols-4 gap-2 w-full max-w-md text-center font-mono text-xs">
                          <div className="p-2 bg-slate-800 border border-slate-600 rounded">R0</div>
                          <div className="p-2 bg-slate-800 border border-slate-600 rounded">R1</div>
                          <div className="p-2 bg-slate-800 border border-slate-600 rounded">R2</div>
                          <div className="p-2 bg-slate-800 border border-slate-600 rounded">R3</div>
                          <div className="p-2 bg-slate-800 border border-slate-600 rounded">R4</div>
                          <div className="p-2 bg-slate-800 border border-slate-600 rounded">R5</div>
                          <div className="p-2 bg-slate-800 border border-slate-600 rounded">R6</div>
                          <div className="p-2 bg-slate-800 border border-slate-600 rounded">R7</div>
                       </div>
                    </FigureBox>
                  </div>
               </div>
             </>
           )
        },
        {
           title: "5.2 Instructions: Opcodes",
           content: (
             <>
                <p>
                  Instructions are 16 bits long. The first 4 bits (Bits 15-12) are the <strong>Opcode</strong>.
                  Since 4 bits can represent 16 numbers, we have 16 possible instructions (actually 15 + 1 reserved).
                </p>
                
                <h4 className="font-bold text-white mt-6 mb-2">Three Types of Instructions:</h4>
                <ul className="list-none space-y-4">
                   <li className="bg-slate-800 p-4 rounded border-l-4 border-neon-cyan">
                      <strong className="text-neon-cyan block">1. Operate (Do Math)</strong>
                      ADD, AND, NOT. These manipulate data in registers.
                   </li>
                   <li className="bg-slate-800 p-4 rounded border-l-4 border-neon-amber">
                      <strong className="text-neon-amber block">2. Data Movement (Move Stuff)</strong>
                      LD, LDI, LDR, LEA, ST, STI, STR. These move data between Memory and Registers.
                   </li>
                   <li className="bg-slate-800 p-4 rounded border-l-4 border-fuchsia-500">
                      <strong className="text-fuchsia-500 block">3. Control (Change Flow)</strong>
                      BR, JMP, JSR, TRAP, RTI. These change the PC to jump to different parts of code.
                   </li>
                </ul>
                
                <InteractiveLink 
                  onClick={() => onNavigate(ModuleId.ASM_DECODER)}
                  title="Lab: Assembly Decoder"
                  desc="See how the 4-bit Opcode changes the instruction type."
                />
             </>
           )
        },
        {
           title: "5.3 Addressing Modes",
           content: (
             <>
                <p>
                  When we want to get data, where is it? The LC-3 gives us 5 ways to answer that question. These are called <strong>Addressing Modes</strong>.
                </p>
                <div className="space-y-4 my-6 text-sm">
                   <div>
                      <strong className="text-white block">1. Immediate</strong>
                      The data is right there inside the instruction bits. (e.g., ADD R1, R1, #5).
                   </div>
                   <div>
                      <strong className="text-white block">2. Register</strong>
                      The data is in a register. (e.g., ADD R1, R2, R3).
                   </div>
                   <div>
                      <strong className="text-white block">3. PC-Relative</strong>
                      The data is at an address relative to where we are now. "Go 10 steps forward from here." (e.g., LD R0, LABEL).
                   </div>
                   <div>
                      <strong className="text-white block">4. Indirect</strong>
                      Go to an address. Inside that address is <em>another</em> address. The data is there. It's like a treasure hunt clue. (e.g., LDI).
                   </div>
                   <div>
                      <strong className="text-white block">5. Base + Offset</strong>
                      Take a base address from a register and add a small number to it. Useful for arrays. (e.g., LDR).
                   </div>
                </div>
             </>
           )
        }
      ]
    },
    {
      id: 'CH6',
      title: '6. Programming',
      subtitle: 'Solving Problems',
      pages: [
        {
          title: "Systematic Decomposition",
          content: <p>Breaking big problems into small problems. The art of algorithms...</p>
        },
        {
          title: "Debugging",
          content: <p>Being a detective. Tracing code. Using breakpoints. The philosophy of fixing bugs...</p>
        },
        {
          title: "The Sentinel",
          content: <p>Loops and termination conditions. How to know when to stop...</p>
        }
      ]
    },
    {
      id: 'CH7',
      title: '7. Assembly Language',
      subtitle: 'Human Readable Bits',
      pages: [
        {
          title: "The Assembler",
          content: <p>The first translation layer. Labels, Comments, and Mnemonics...</p>
        },
        {
          title: "The Symbol Table",
          content: <p>How the assembler remembers where 'LOOP_START' is. The two-pass process...</p>
        },
        {
          title: "Traps",
          content: <p>Asking the OS for help. System calls explained via the Trap Vector Table...</p>
        }
      ]
    },
    {
      id: 'CH8',
      title: '8. I/O & The Stack',
      subtitle: 'Talking & Remembering',
      pages: [
        {
          title: "Memory Mapped I/O",
          content: <p>Fake memory addresses. KBSR, KBDR, DSR, DDR explained in depth...</p>
        },
        {
          title: "Interrupts vs Polling",
          content: <p>The doorbell vs checking the mail. Efficiency in I/O...</p>
        },
        {
          title: "The Stack",
          content: <p>Push and Pop. Storing state. Function calls and return addresses...</p>
        }
      ]
    }
  ];

  // Reset page when chapter changes
  useEffect(() => {
    setActivePageIdx(0);
  }, [activeChapterIdx]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
    }
  }, [activePageIdx, activeChapterIdx]);

  const activeChapter = CHAPTERS[activeChapterIdx];
  const activePage = activeChapter.pages[activePageIdx];

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden bg-slate-900 border border-slate-800 rounded-xl shadow-2xl relative">
      
      {/* --- SIDEBAR (Table of Contents) --- */}
      <div 
        className={`
          absolute md:static inset-y-0 left-0 w-80 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 z-30
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Menu className="w-4 h-4 text-neon-cyan" /> 
            Contents
          </h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-20 custom-scrollbar">
          {CHAPTERS.map((chapter, idx) => (
            <div key={chapter.id} className="border-b border-slate-900">
              <button
                onClick={() => setActiveChapterIdx(idx)}
                className={`w-full text-left px-5 py-4 transition-all hover:bg-slate-900 group
                  ${activeChapterIdx === idx ? 'bg-slate-900 border-l-4 border-neon-cyan' : 'border-l-4 border-transparent'}
                `}
              >
                <div className={`font-bold text-sm mb-1 ${activeChapterIdx === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {chapter.title}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {chapter.subtitle}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MAIN READING AREA --- */}
      <div className="flex-1 flex flex-col relative w-full">
        
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-slate-800 rounded text-slate-300 shadow-lg border border-slate-700"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Reader Header */}
        <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 md:px-10 shrink-0">
          <div className="hidden md:block text-xs font-mono text-neon-cyan uppercase tracking-widest">
            {activeChapter.id} // PAGE {activePageIdx + 1} OF {activeChapter.pages.length}
          </div>
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-neon-cyan transition-all duration-300"
               style={{ width: `${((activePageIdx + 1) / activeChapter.pages.length) * 100}%` }}
          />

          <div className="flex items-center gap-4 ml-auto">
             <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">THE SILICON CHRONICLES</span>
             <div className="p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-400">
                <Bookmark className="w-4 h-4" />
             </div>
          </div>
        </div>

        {/* Reader Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 lg:px-24 custom-scrollbar bg-slate-900 selection:bg-neon-cyan/30 selection:text-white">
          <div className="max-w-3xl mx-auto pb-12 animate-fadeIn">
            
            <div className="mb-8 border-b border-slate-800 pb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight font-serif tracking-tight">
                {activePage.title}
              </h1>
              <div className="text-slate-500 font-mono text-sm uppercase tracking-wider">
                {activeChapter.title} — Section {activePageIdx + 1}.0
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-serif leading-8">
               {activePage.content}
            </div>

          </div>
        </div>

        {/* Reader Footer / Navigation */}
        <div className="h-20 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-4 md:px-10 shrink-0 z-20">
           
           <button 
             onClick={() => {
               if (activePageIdx > 0) {
                 setActivePageIdx(activePageIdx - 1);
               } else if (activeChapterIdx > 0) {
                 setActiveChapterIdx(activeChapterIdx - 1);
                 setActivePageIdx(CHAPTERS[activeChapterIdx - 1].pages.length - 1); // Go to last page of prev chapter
               }
             }}
             disabled={activeChapterIdx === 0 && activePageIdx === 0}
             className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
           >
             <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <div className="text-left hidden sm:block">
               <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Previous</div>
               <div className="text-sm font-bold">Page</div>
             </div>
           </button>

           <div className="flex items-center gap-2">
             <div className="text-sm font-mono font-bold text-slate-500">
               {activePageIdx + 1} <span className="text-slate-700">/</span> {activeChapter.pages.length}
             </div>
           </div>

           <button 
             onClick={() => {
               if (activePageIdx < activeChapter.pages.length - 1) {
                 setActivePageIdx(activePageIdx + 1);
               } else if (activeChapterIdx < CHAPTERS.length - 1) {
                 setActiveChapterIdx(activeChapterIdx + 1);
                 setActivePageIdx(0); // Start of next chapter
               }
             }}
             disabled={activeChapterIdx === CHAPTERS.length - 1 && activePageIdx === activeChapter.pages.length - 1}
             className="flex items-center gap-3 px-4 py-2 rounded-lg text-neon-cyan hover:bg-neon-cyan/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
           >
             <div className="text-right hidden sm:block">
               <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-900/50">Next</div>
               <div className="text-sm font-bold">Page</div>
             </div>
             <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>

        </div>

      </div>
    </div>
  );
};
