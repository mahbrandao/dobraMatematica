import { notFound } from 'next/navigation';
import { SOLIDS } from '@/lib/solidos';

// Cria uma página para cada sólido: /laboratorio/cubo, /laboratorio/cone...
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SOLIDS).map(solido => ({ solido }));
}

export function generateMetadata({ params }) {
  const def = SOLIDS[params.solido];
  return { title: def ? `${def.title} | Dobra` : 'Dobra' };
}

// O conteúdo da página fica no layout (components/laboratorio/Laboratorio.js).
export default function PaginaSolido({ params }) {
  if (!SOLIDS[params.solido]) notFound();
  return null;
}
