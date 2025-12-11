import React, { useState } from 'react';
import { ProfessorNote } from '../ProfessorNote';

export const BitFlipper: React.FC = () => {
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);

  const toggleBit = (index: number) => {
    const newBits = [...bits];
    newBits[index] = bits[index] === 0 ? 1 : 0;
    setBits(newBits);
  };

  // Calculations
  const binaryString = bits.join('');
  const unsignedValue = parseInt(binaryString, 2);
  
  // Signed Magnitude: MSB is sign, rest is magnitude
  const signBit = bits[0];
  const magnitudeBits = bits.slice(1).join('');
  const magnitudeVal = parseInt(magnitudeBits, 2);
  const signedMagnitudeValue = signBit === 1 ? -magnitudeVal : magnitudeVal;

  // 2's Complement: 
  // If MSB is 1, value is unsigned - 2^8 (-256).
  const twosComplementValue = bits[0] === 1 ? unsignedValue - 256 : unsignedValue;

  const hexValue = unsignedValue.toString(16).toUpperCase().padStart(2, '0');

  return (
    <div className="space-y-8">
      {/* Intro Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          The Bit Flipper
          <ProfessorNote 
            title="What is a Bit?" 
            content="A bit (binary digit) is the smallest unit of data in a computer. It has a single binary value, either 0 or 1. By grouping 8 bits together, we create a 'Byte', which can represent 256 different values."
          />
        </h2>
        <p className="text-slate-400 max-w-2xl">
          Interact with the 8-bit register below to see how the computer interprets the same pattern of zeros and ones in different ways.
        </p>
      </div>

      {/* Main Interactive Lab */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 md:p-10 backdrop-blur-sm relative overflow-hidden">
        {/* Glow effect behind bits */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-neon-cyan/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4">
          {bits.map((bit, index) => {
            const position = 7 - index; // MSB is index 0 (pos 7), LSB is index 7 (pos 0)
            const isOne = bit === 1;
            return (
              <div key={index} className="flex flex-col items-center gap-3 group">
                 <div className="text-xs font-mono text-slate-500 font-bold mb-1">2<sup>{position}</sup></div>
                 <button
                    onClick={() => toggleBit(index)}
                    className={`
                      w-10 h-16 md:w-16 md:h-24 rounded-lg flex items-center justify-center text-2xl md:text-4xl font-mono font-bold transition-all duration-300 relative border-b-4 active:border-b-0 active:translate-y-1
                      ${isOne 
                        ? 'bg-neon-cyan text-slate-900 border-cyan-700 shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                        : 'bg-slate-700 text-slate-500 border-slate-800 shadow-inner hover:bg-slate-600'
                      }
                    `}
                 >
                   {bit}
                   {/* Led Indicator */}
                   <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isOne ? 'bg-white shadow-[0_0_5px_white]' : 'bg-slate-900'}`} />
                 </button>
                 <div className="text-[10px] md:text-xs font-mono text-slate-600 uppercase tracking-widest">
                    {index === 0 ? 'MSB' : index === 7 ? 'LSB' : `Bit ${position}`}
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Analysis Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Unsigned Integer */}
        <DataCard 
          label="Unsigned Integer" 
          value={unsignedValue} 
          noteTitle="Unsigned"
          noteContent="Standard binary counting. All bits contribute to the magnitude. Range: 0 to 255."
        />

        {/* Signed Magnitude */}
        <DataCard 
          label="Signed Magnitude" 
          value={signedMagnitudeValue}
          noteTitle="Signed Magnitude"
          noteContent="The first bit (MSB) is the sign flag (0 is positive, 1 is negative). The remaining 7 bits are the number. Note: This system has a 'negative zero'!" 
          highlight={bits[0] === 1}
        />

        {/* 2's Complement */}
        <DataCard 
          label="2's Complement" 
          value={twosComplementValue}
          noteTitle="2's Complement"
          noteContent="The standard way computers represent negative integers. It allows arithmetic circuits to add positive and negative numbers without separate logic. Range: -128 to 127."
          primary
        />

        {/* Hexadecimal */}
        <DataCard 
          label="Hexadecimal" 
          value={`0x${hexValue}`} 
          isCode
          noteTitle="Hexadecimal"
          noteContent="A base-16 system used to simplify binary representation. Each hex digit represents 4 bits (a nibble)."
        />
      </div>
    </div>
  );
};

interface DataCardProps {
  label: string;
  value: string | number;
  noteTitle: string;
  noteContent: string;
  isCode?: boolean;
  primary?: boolean;
  highlight?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({ label, value, noteTitle, noteContent, isCode, primary, highlight }) => (
  <div className={`
    relative p-5 rounded-xl border transition-all duration-300
    ${primary 
      ? 'bg-slate-800 border-neon-cyan/30 shadow-[0_0_15px_-5px_rgba(34,211,238,0.2)]' 
      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
    }
  `}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
      <ProfessorNote title={noteTitle} content={noteContent} />
    </div>
    <div className={`
      text-3xl font-mono font-bold truncate
      ${primary ? 'text-neon-cyan' : 'text-slate-200'}
      ${highlight ? 'text-neon-rose' : ''}
      ${isCode ? 'text-neon-amber' : ''}
    `}>
      {value}
    </div>
    {primary && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
    )}
  </div>
);