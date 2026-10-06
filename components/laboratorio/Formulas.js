import { fmt } from '@/lib/formato';
import { groupOf, isMain } from '@/lib/solidos';

// Um cartão de fórmula: nome, resultado, fórmula e conta com os números.
export function FormulaCard({ r, main = false, hl = false }) {
  return (
    <div className={`fcard${main ? ' main' : ''}${hl ? ' hl' : ''}`}>
      <div className="fcard-top">
        <span className="flabel">{r.label}</span>
        <span className="fval">{fmt(r.value)} {r.unit}</span>
      </div>
      <p className="fformula" dangerouslySetInnerHTML={{ __html: `${r.sym} = ${r.formula}` }} />
      <p className="fsteps" dangerouslySetInnerHTML={{ __html: `${r.sym} = ${r.sub} = <b>${fmt(r.value)} ${r.unit}</b>` }} />
    </div>
  );
}

// Todas as fórmulas do sólido, a soma das peças planificadas e a relação de Euler.
export default function Formulas({ def, values, flat, hlLabel }) {
  const res = def.calc(values);
  const total = res.pieces ? res.pieces.reduce((t, q) => t + q.count * q.each, 0) : 0;

  return (
    <>
      <div className="fgroups">
        {['Segmentos', 'Área', 'Volume'].map(g => {
          const rows = res.rows.filter(r => groupOf(r) === g);
          if (!rows.length) return null;
          return (
            <div key={g}>
              <p className="fgroup">{g}</p>
              {rows.map(r => <FormulaCard key={r.label} r={r} main={isMain(r)} hl={r.label === hlLabel} />)}
            </div>
          );
        })}
      </div>

      {res.pieces && (flat ? (
        <div className="sum">
          <p className="sum-title">Somando as peças abertas</p>
          <ul>
            {res.pieces.map(q => (
              <li key={q.name}>
                <span>{q.count} {q.name} × {fmt(q.each)} cm²</span>
                <span>{fmt(q.count * q.each)}</span>
              </li>
            ))}
          </ul>
          <p>Total: <strong>{fmt(total)} cm²</strong>, exatamente a área total.</p>
        </div>
      ) : (
        <p className="sum-hint">Planifique o sólido para ver a área total como a soma das peças abertas.</p>
      ))}

      {res.euler && (
        <div className="euler">
          <div className="counts">
            <span><i>F</i> = {res.euler.F}</span>
            <span><i>A</i> = {res.euler.A}</span>
            <span><i>V</i> = {res.euler.V}</span>
          </div>
          <p>
            {res.euler.V} − {res.euler.A} + {res.euler.F} = {res.euler.V - res.euler.A + res.euler.F}.
            {' '}Faces, arestas e vértices obedecem à relação de Euler: V − A + F = 2.
          </p>
        </div>
      )}
    </>
  );
}
