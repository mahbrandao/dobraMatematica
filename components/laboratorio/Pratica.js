'use client';
import { useEffect, useRef, useState } from 'react';
import { SOLIDS, isMain } from '@/lib/solidos';
import { QUESTOES, F } from '@/lib/questoes';
import { ASK, randomParams, describe, pickOne, isFem, lower } from '@/lib/pratica';
import { fmt } from '@/lib/formato';
import { FormulaCard } from './Formulas';

const MODOS = [['find', 'Encontre a parte'], ['calc', 'Faça a conta'], ['prova', 'Questões estilo ENEM']];
const LETRAS = 'ABCDE';

// Aba Praticar: três tipos de exercício e a pontuação.
export default function Pratica({ solido, values, api, score, gain, lose, registerPick, answered, setAnswered }) {
  const [modo, setModo] = useState('find');

  return (
    <>
      <section>
        <div className="score">
          <span>Pontos: <b>{score.pts}</b></span>
          <span>Acertos seguidos: <b>{score.streak}</b></span>
        </div>
        <div className="chips practice-modes" role="group" aria-label="Tipo de exercício">
          {MODOS.map(([m, t]) => (
            <button key={m} type="button" className="chip" aria-pressed={modo === m} onClick={() => { api.deselect(); setModo(m); }}>
              {t}
            </button>
          ))}
        </div>
      </section>
      <section aria-live="polite">
        {modo === 'find' && <Encontre key={solido} solido={solido} api={api} gain={gain} lose={lose} registerPick={registerPick} />}
        {modo === 'calc' && <Conta key={solido} solido={solido} values={values} api={api} gain={gain} lose={lose} />}
        {modo === 'prova' && <Questoes solido={solido} api={api} gain={gain} lose={lose} answered={answered} setAnswered={setAnswered} />}
      </section>
    </>
  );
}

/* Encontre a parte: o site pede uma parte e o aluno toca nela no 3D. */
function Encontre({ solido, api, gain, lose, registerPick }) {
  const partes = SOLIDS[solido].partes;
  const [alvo, setAlvo] = useState(null);
  const [fb, setFb] = useState(null);
  const alvoRef = useRef(null);
  const timer = useRef(null);

  const proximo = anterior => {
    const opcoes = partes.filter(n => n !== anterior);
    const novo = pickOne(opcoes.length ? opcoes : partes);
    alvoRef.current = novo;
    setAlvo(novo);
    setFb(null);
  };

  useEffect(() => {
    api.closeNet();
    proximo(null);
    registerPick.current = part => {
      if (!part || !alvoRef.current) return;
      if (part.info.nome === alvoRef.current) {
        gain(10);
        setFb({ ok: true, text: 'Isso mesmo! +10 pontos.' });
        clearTimeout(timer.current);
        timer.current = setTimeout(() => { api.deselect(); proximo(alvoRef.current); }, 1200);
      } else {
        lose();
        setFb({ ok: false, text: `Isso é ${isFem(part.info.nome) ? 'a' : 'o'} ${lower(part.info.nome)}. Tente de novo.` });
      }
    };
    return () => { clearTimeout(timer.current); registerPick.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p className="prompt">Encontre no sólido e toque {alvo && (isFem(alvo) ? 'na' : 'no')}:</p>
      <p className="target">{alvo}</p>
      <p className={`feedback${fb ? (fb.ok ? ' ok' : ' no') : ''}`}>{fb ? fb.text : ''}</p>
      <div className="row-btns">
        <button className="btn ghost small" type="button" onClick={() => { api.deselect(); proximo(alvoRef.current); }}>Pular</button>
      </div>
    </>
  );
}

/* Faça a conta: medidas sorteadas, o aluno digita a resposta. */
function Conta({ solido, values, api, gain, lose }) {
  const [q, setQ] = useState(null);
  const [resp, setResp] = useState('');
  const [fb, setFb] = useState(null);
  const [passos, setPassos] = useState(false);

  const nova = () => {
    api.closeNet();
    const np = randomParams(solido);
    const p = { ...values, ...np };
    api.applyParams(np);
    const rows = SOLIDS[solido].calc(p).rows;
    const r = pickOne([...rows, ...rows.filter(isMain)]);
    const notas = [];
    if (SOLIDS[solido].cat === 'red') notas.push('Use π = 3,14.');
    if ((solido === 'prisma' || solido === 'piramide') && (p.n === 3 || p.n === 6)) notas.push('Use √3 = 1,73.');
    notas.push(`Responda em ${r.unit}, com até duas casas decimais.`);
    setQ({
      texto: `${describe(solido, p)} Calcule ${ASK[r.label] || lower(r.label)}.`,
      notas: notas.join(' '),
      label: r.label, value: r.value, unit: r.unit,
      rows, idx: rows.findIndex(x => x.label === r.label),
      pontuada: false, revelada: false,
    });
    setResp(''); setFb(null); setPassos(false);
  };

  useEffect(() => {
    nova();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const conferir = () => {
    if (!q) return;
    const v = parseFloat(resp.replace(/\s/g, '').replace(',', '.'));
    if (Number.isNaN(v)) { setFb({ ok: false, text: 'Digite um número, por exemplo 12,5.' }); return; }
    if (Math.abs(v - q.value) <= Math.max(0.02 * Math.abs(q.value), 0.01)) {
      if (!q.pontuada && !q.revelada) {
        gain(15);
        setQ({ ...q, pontuada: true });
        setFb({ ok: true, text: `Certo! ${fmt(q.value)} ${q.unit}. +15 pontos.` });
      } else {
        setFb({ ok: true, text: `Certo! ${fmt(q.value)} ${q.unit}.` });
      }
    } else {
      lose();
      setFb({ ok: false, text: 'Ainda não. Tente de novo ou veja a resolução.' });
    }
  };

  if (!q) return null;
  return (
    <>
      <p className="prompt">{q.texto}</p>
      <p className="small-note">{q.notas} O sólido no 3D já está com essas medidas.</p>
      <div className="answer-row">
        <input
          className="answer"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Sua resposta"
          aria-label={`Sua resposta em ${q.unit}`}
          value={resp}
          onChange={e => setResp(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') conferir(); }}
        />
        <button className="btn" type="button" onClick={conferir}>Conferir</button>
      </div>
      <p className={`feedback${fb ? (fb.ok ? ' ok' : ' no') : ''}`}>{fb ? fb.text : ''}</p>
      {passos && (
        <div>
          <p className="fgroup">Resolução</p>
          {q.rows.slice(0, q.idx + 1).map(r => <FormulaCard key={r.label} r={r} main={r.label === q.label} />)}
        </div>
      )}
      <div className="row-btns">
        <button className="btn ghost small" type="button" onClick={() => { setPassos(true); setQ({ ...q, revelada: true }); }}>Ver resolução</button>
        <button className="btn ghost small" type="button" onClick={nova}>Nova conta</button>
      </div>
    </>
  );
}

/* Questões estilo ENEM: múltipla escolha com correção e explicação. */
function Questoes({ solido, api, gain, lose, answered, setAnswered }) {
  useEffect(() => {
    api.closeNet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solido]);

  const lista = QUESTOES.map((q, id) => ({ q, id })).filter(x => x.q.solido === solido);
  if (!lista.length) return <p className="pick-empty">Ainda não há questões para este sólido.</p>;
  const feitas = lista.filter(({ id }) => answered[id] != null);
  const acertos = feitas.filter(({ q, id }) => answered[id] === q.correta).length;

  const responder = (id, j) => {
    if (answered[id] != null) return;
    setAnswered(a => ({ ...a, [id]: j }));
    if (j === QUESTOES[id].correta) gain(20); else lose();
  };

  return (
    <>
      <p className="small-note">
        {lista.length} questões escritas para o Dobra, no estilo ENEM. Você acertou {acertos} de {feitas.length} respondidas.
      </p>
      {lista.map(({ q, id }, k) => {
        const j = answered[id];
        const feita = j != null;
        return (
          <article className="q" key={id}>
            <p className="q-src">Questão {k + 1}{q.fonte !== F ? ` (${q.fonte})` : ''}</p>
            <p className="q-stem">{q.enunciado}</p>
            {q.imagem && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="q-img" src={q.imagem} alt={q.imagemAlt || 'Figura da questão'} />
            )}
            <div className="alts">
              {q.alternativas.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={feita}
                  className={`alt${feita && i === q.correta ? ' ok' : ''}${feita && i === j && j !== q.correta ? ' no' : ''}`}
                  onClick={() => responder(id, i)}
                >
                  <b>{LETRAS[i]}</b><span>{a}</span>
                </button>
              ))}
            </div>
            {feita && (
              <p className={`feedback ${j === q.correta ? 'ok' : 'no'}`}>
                {j === q.correta ? 'Resposta certa!' : `A resposta certa é a ${LETRAS[q.correta]}.`}
              </p>
            )}
            {feita && <p className="q-expl" dangerouslySetInnerHTML={{ __html: q.explicacao }} />}
            {q.params && (
              <div className="row-btns">
                <button type="button" className="btn ghost small" onClick={() => { api.closeNet(); api.applyParams(q.params); }}>
                  Montar este sólido no 3D
                </button>
              </div>
            )}
          </article>
        );
      })}
    </>
  );
}
