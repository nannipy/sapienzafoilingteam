
import React from 'react';
import { 
  Users, Anchor, Handshake, Component, PencilRuler, Leaf, 
  Truck, Wrench, Globe, Star, Layout, Lightbulb, 
  PersonStanding, Anvil, CircuitBoard, Bolt 
} from 'lucide-react';

export const iconsMap: Record<string, React.JSX.Element> = {
  'Materiali Sostenibili': <Leaf className="w-5 h-5" />,
  'Processi di Manufacturing': <Wrench className="w-5 h-5" />,
  'Impatto Ambientale': <Globe className="w-5 h-5" />,
  'Innovazione': <Lightbulb className="w-5 h-5" />,
  'Logistica': <Truck className="w-5 h-5" />,
  'Manutenzione': <Wrench className="w-5 h-5" />,
  'Elettronica': <CircuitBoard className="w-5 h-5" />,
  'Fine Tuning': <Bolt className="w-5 h-5" />,
  'Strategia e Management': <Users className="w-5 h-5" />,
  'Comunicazione': <Globe className="w-5 h-5" />,
  'Relazioni Pubbliche': <PersonStanding className="w-5 h-5" />,
  'Partnership': <Handshake className="w-5 h-5" />,
  'CAD e Progettazione': <PencilRuler className="w-5 h-5" />,
  'Simulazione FEM': <Anvil className="w-5 h-5" />,
  'Performance Optimization': <Star className="w-5 h-5" />,
  'Prototipazione 3D': <Layout className="w-5 h-5" />
};

export const iconKeyMap: Record<string, string> = {
  'Sustainable Materials': 'Materiali Sostenibili',
  'Manufacturing Processes': 'Processi di Manufacturing',
  'Environmental Impact': 'Impatto Ambientale',
  'Innovation': 'Innovazione',
  'Logistics': 'Logistica',
  'Maintenance': 'Manutenzione',
  'Electronics': 'Elettronica',
  'Fine Tuning': 'Fine Tuning',
  'Strategy and Management': 'Strategia e Management',
  'Communication': 'Comunicazione',
  'Public Relations': 'Relazioni Pubbliche',
  'Partnership': 'Partnership',
  'CAD and Design': 'CAD e Progettazione',
  'FEM Simulation': 'Simulazione FEM',
  'Performance Optimization': 'Performance Optimization',
  '3D Prototyping': 'Prototipazione 3D'
};

export interface DivisionConfig {
  id: string;
  icon: React.JSX.Element;
  color: string; // Tailwind class or hex
}

export const divisionsConfig: Record<string, DivisionConfig> = {
  materials: {
    id: 'materials',
    icon: <PencilRuler className="w-6 h-6" />,
    color: 'bg-brand'
  },
  shore: {
    id: 'shore',
    icon: <Anchor className="w-6 h-6" />,
    color: 'bg-brand'
  },
  design: {
    id: 'design',
    icon: <Component className="w-6 h-6" />,
    color: 'bg-brand'
  },
  management: {
    id: 'management',
    icon: <Handshake className="w-6 h-6" />,
    color: 'bg-brand'
  }
};
