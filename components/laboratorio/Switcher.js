import Link from 'next/link';
import { SOLIDS } from '@/lib/solidos';

const GRUPOS = [['poli', 'Poliedros'], ['red', 'Corpos redondos']];

// Barra para trocar de sólido, dividida por tipo.
export default function Switcher({ solido }) {
  return (
    <nav className="switcher" aria-label="Escolher sólido">
      {GRUPOS.map(([cat, titulo]) => (
        <div className="sw-group" key={cat}>
          <span>{titulo}</span>
          {Object.entries(SOLIDS)
            .filter(([, d]) => d.cat === cat)
            .map(([k, d]) => (
              <Link
                key={k}
                className="sw-btn"
                href={`/laboratorio/${k}`}
                scroll={false}
                aria-current={k === solido ? 'page' : undefined}
              >
                {d.title}
              </Link>
            ))}
        </div>
      ))}
    </nav>
  );
}
