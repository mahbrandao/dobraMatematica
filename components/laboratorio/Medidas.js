import { fmt, POLY } from '@/lib/formato';

const faixa = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Sliders das medidas e botões para escolher o polígono da base.
export default function Medidas({ def, values, onChange, onCommit }) {
  return (
    <div>
      {def.params.map(s =>
        s.int ? (
          <div className="chip-field" key={s.k}>
            <span>
              Polígono da base ({s.label.toLowerCase()} <i>{s.sym}</i> = <b>{values[s.k]}</b>)
            </span>
            <div className="chips" role="group" aria-label="Polígono da base">
              {faixa(s.min, s.max).map(v => (
                <button
                  key={v}
                  type="button"
                  className="chip"
                  aria-pressed={values[s.k] === v}
                  onClick={() => onChange(s.k, v, true)}
                >
                  {POLY[v]}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="slider" key={s.k}>
            <label htmlFor={`s-${s.k}`}>
              <span>{s.label} <i>{s.sym}</i></span>
              <output>{fmt(values[s.k], 1)} cm</output>
            </label>
            <input
              type="range"
              id={`s-${s.k}`}
              min={s.min}
              max={s.max}
              step={s.step}
              value={values[s.k]}
              onChange={e => onChange(s.k, parseFloat(e.target.value), false)}
              onPointerUp={onCommit}
              onKeyUp={onCommit}
            />
          </div>
        )
      )}
    </div>
  );
}
