import { LucideIcon } from 'lucide-react';

export enum ModuleId {
  DIGITAL_TEXTBOOK = 'DIGITAL_TEXTBOOK',
  BIT_FLIPPER = 'BIT_FLIPPER',
  GATE_LOGIC = 'GATE_LOGIC',
  COMBINATIONAL_CIRCUITS = 'COMBINATIONAL_CIRCUITS',
  SEQUENTIAL_LOGIC = 'SEQUENTIAL_LOGIC',
  MINI_CPU = 'MINI_CPU',
  LC3_DATAPATH = 'LC3_DATAPATH',
  ASM_DECODER = 'ASM_DECODER',
  STACK_VISUALIZER = 'STACK_VISUALIZER',
  LC3_MEMORY_MAP = 'LC3_MEMORY_MAP',
}

export interface NavItem {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export enum LogicGateType {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  XOR = 'XOR',
}

export interface GateDefinition {
  type: LogicGateType;
  label: string;
  description: string;
  truthTable: { a: number; b: number; out: number }[]; // Using numbers 0/1 for simplicity
}