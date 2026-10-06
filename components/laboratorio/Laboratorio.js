'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { SOLIDS, PART_ROW } from '@/lib/solidos';
import { Viewer } from '@/lib/viewer';
import Switcher from './Switcher';
import ParteClicada from './ParteClicada';
import Medidas from './Medidas';
import Formulas from './Formulas';
import Pratica from './Pratica';

const medidasIniciais = () =>
  Object.fromEntries(Object.entries(SOLIDS).map(([k, d]) => [k, Object.fromEntries(d.params.map(p => [p.k, p.val]))]));

// Página de cada sólido: o 3D à esquerda e o painel (Explorar / Praticar) à direita.
export default function Laboratorio() {
  const routeParams = useParams();
  const solido = routeParams ? routeParams.solido : undefined;
  const def = solido ? SOLIDS[solido] : undefined;

  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [params, setParams] = useState(medidasIniciais);
  const [flat, setFlat] = useState(false);
  const [netTarget, setNetTarget] = useState(0);
  const [picked, setPicked] = useState(null);
  const [tab, setTab] = useState('explore');
  const [score, setScore] = useState({ pts: 0, streak: 0 });
  const [answered, setAnswered] = useState({});

  const tabRef = useRef(tab);
  tabRef.current = tab;
  const solidoRef = useRef(solido);
  solidoRef.current = solido;
  const practicePick = useRef(null);
  const prevSolido = useRef(null);
  const refitNext = useRef(false);

  // pontuação salva no navegador
  useEffect(() => {
    try {
      const sv = JSON.parse(localStorage.getItem('dobra-score'));
      if (sv && typeof sv.pts === 'number') setScore(sv);
    } catch (e) { /* sem pontuação salva */ }
  }, []);
  const updateScore = useCallback(fn => setScore(s => {
    const n = fn(s);
    try { localStorage.setItem('dobra-score', JSON.stringify(n)); } catch (e) { /* armazenamento indisponível */ }
    return n;
  }), []);
  const gain = useCallback(pts => updateScore(s => ({ pts: s.pts + pts, streak: s.streak + 1 })), [updateScore]);
  const lose = useCallback(() => updateScore(s => ({ ...s, streak: 0 })), [updateScore]);

  // cria o visualizador 3D uma vez
  const hasDef = Boolean(def);
  useEffect(() => {
    if (!hasDef || !hostRef.current) return undefined;
    const v = new Viewer(hostRef.current, {
      onPick: part => {
        if (tabRef.current === 'practice' && practicePick.current) practicePick.current(part);
        else setPicked(part);
      },
    });
    viewerRef.current = v;
    setReady(true);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onTheme = () => { if (v.key) { v.setSolid(v.key, v.params, true); setPicked(null); } };
    mq.addEventListener('change', onTheme);
    return () => {
      mq.removeEventListener('change', onTheme);
      v.destroy();
      viewerRef.current = null;
      prevSolido.current = null;
      setReady(false);
    };
  }, [hasDef]);

  // monta o sólido de novo quando muda o sólido ou alguma medida
  const values = def ? params[solido] : null;
  useEffect(() => {
    const v = viewerRef.current;
    if (!v || !def) return;
    const trocou = prevSolido.current !== solido;
    v.setSolid(solido, values, !trocou);
    if (trocou) {
      prevSolido.current = solido;
      v.resize();
      v.jumpTo(v.viewFor('closed'));
      setFlat(false);
      setNetTarget(0);
    } else if (refitNext.current) {
      v.flyTo(v.currentView(), 500);
    }
    refitNext.current = false;
    setPicked(null);
  }, [ready, solido, values, def]);

  // ações usadas pelo painel e pela aba Praticar
  const api = useMemo(() => ({
    closeNet() {
      const v = viewerRef.current;
      if (v && v.netTarget === 1) {
        v.toggle(f => setFlat(f));
        setNetTarget(0);
        setFlat(false);
      }
    },
    applyParams(np) {
      const k = solidoRef.current;
      refitNext.current = true;
      setParams(ps => ({ ...ps, [k]: { ...ps[k], ...np } }));
    },
    deselect() {
      if (viewerRef.current) viewerRef.current.select(null);
    },
  }), []);

  const changeParam = (k, val, refit) => {
    if (refit) refitNext.current = true;
    setParams(ps => ({ ...ps, [solido]: { ...ps[solido], [k]: val } }));
  };
  const refitNow = () => { const v = viewerRef.current; if (v) v.flyTo(v.currentView(), 500); };
  const toggleNet = () => {
    const v = viewerRef.current;
    if (!v) return;
    const to = v.toggle(f => setFlat(f));
    if (to === null) return;
    setNetTarget(to);
    if (to === 0) setFlat(false);
  };
  const recenter = () => { const v = viewerRef.current; if (v) v.flyTo(v.currentView(), 600); };
  const changeTab = t => {
    setTab(t);
    if (viewerRef.current) viewerRef.current.select(null);
    setPicked(null);
  };

  if (!def) return null;
  const hlLabel = picked ? PART_ROW[picked.info.nome] : null;

  return (
    <main className="wrap">
      <Switcher solido={solido} />
      <div className="lab-grid">
        <div>
          <div className="sheet lab-sheet">
            <div className="viewer" ref={hostRef} />
            <p className="hint">Arraste para girar, use a roda ou dois dedos para aproximar e toque numa parte para ver o nome.</p>
          </div>
          <div className="stage-actions">
            <button className="btn" type="button" onClick={toggleNet} disabled={Boolean(def.noNet)}>
              {netTarget === 1 ? 'Montar' : 'Planificar'}
            </button>
            <button className="btn ghost" type="button" onClick={recenter}>Centralizar</button>
            {def.noNet && (
              <p className="note">
                A esfera não tem planificação: nenhum pedaço dela pode ser aberto no plano sem esticar ou rasgar.
                É o mesmo motivo pelo qual todo mapa-múndi distorce alguma coisa.
              </p>
            )}
          </div>
        </div>

        <aside className="panel">
          <header className="panel-head">
            <h1>{def.name(values)}</h1>
            <p>{def.sub(values)}</p>
          </header>
          <div className="tabs" role="tablist" aria-label="Modo">
            {[['explore', 'Explorar'], ['practice', 'Praticar']].map(([t, l]) => (
              <button key={t} className="tab" role="tab" type="button" aria-selected={tab === t} onClick={() => changeTab(t)}>
                {l}
              </button>
            ))}
          </div>

          {tab === 'explore' ? (
            <>
              <section className="pick" aria-live="polite">
                <ParteClicada picked={picked} def={def} values={values} />
              </section>
              <section>
                <h2>Medidas</h2>
                <Medidas def={def} values={values} onChange={changeParam} onCommit={refitNow} />
              </section>
              <section>
                <h2>Fórmulas</h2>
                <Formulas def={def} values={values} flat={flat} hlLabel={hlLabel} />
              </section>
            </>
          ) : (
            <Pratica
              solido={solido}
              values={values}
              api={api}
              score={score}
              gain={gain}
              lose={lose}
              registerPick={practicePick}
              answered={answered}
              setAnswered={setAnswered}
            />
          )}
        </aside>
      </div>
    </main>
  );
}
