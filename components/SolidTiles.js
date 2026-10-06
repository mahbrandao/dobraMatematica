import Link from 'next/link';
import { SOLIDS } from '@/lib/solidos';
import { ICONS } from '@/lib/icones';

// Cartões da página inicial, separados por tipo de sólido.
export default function SolidTiles({ cat }) {
  return (
    <div className="tiles">
      {Object.entries(SOLIDS)
        .filter(([, d]) => d.cat === cat)
        .map(([k, d]) => (
          <Link className="tile" href={`/laboratorio/${k}`} key={k}>
            <svg className="ico" viewBox="0 0 100 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[k] }} />
            <div>
              <h3>{d.title}</h3>
              <p>{d.blurb}</p>
              <p className="f" dangerouslySetInnerHTML={{ __html: d.key }} />
            </div>
          </Link>
        ))}
    </div>
  );
}
