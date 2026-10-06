import { fmt } from '@/lib/formato';
import { PART_ROW } from '@/lib/solidos';

// Mostra o nome, a explicação e a fórmula da parte que o aluno clicou.
export default function ParteClicada({ picked, def, values }) {
  if (!picked) {
    return <p className="pick-empty">Toque em qualquer parte do sólido para ver o nome dela aqui.</p>;
  }
  const { nome, desc, area } = picked.info;
  const label = PART_ROW[nome];
  const r = label ? def.calc(values).rows.find(x => x.label === label) : null;

  return (
    <>
      <p className="pick-name">{nome}</p>
      <p className="pick-desc">{desc}</p>
      {area != null && <p className="pick-measure">Área desta parte: <strong>{fmt(area)} cm²</strong></p>}
      {r && (
        <div className="pick-formula">
          <p><b>{r.label}</b></p>
          <p className="fformula" dangerouslySetInnerHTML={{ __html: `${r.sym} = ${r.formula}` }} />
          <p className="fsteps" dangerouslySetInnerHTML={{ __html: `${r.sym} = ${r.sub} = <b>${fmt(r.value)} ${r.unit}</b>` }} />
          {label === 'Área lateral' && nome === 'Face lateral' && (
            <p className="fsteps">Essa é a soma de todas as faces laterais.</p>
          )}
        </div>
      )}
    </>
  );
}
