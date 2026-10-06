'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Viewer } from '@/lib/viewer';

const CUBO = { a: 2 };
const OPEN_DIR = new THREE.Vector3(0.8, 1.7, 1.5);

// Topo da página inicial: um cubo que se monta sozinho a partir da planificação.
export default function Hero() {
  const hostRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const v = new Viewer(hostRef.current, { pickable: false, interactive: !coarse });
    v.controls.enableZoom = false;
    viewerRef.current = v;

    let timer = null;
    v.resize();
    v.setSolid('cubo', CUBO, true);
    v.setT(1);
    v.jumpTo(v.view(1, OPEN_DIR));
    timer = setTimeout(() => {
      v.flyTo(v.viewFor('closed'), 2200);
      v.animateT(0, 2400, () => { v.controls.autoRotate = !reduce; });
    }, reduce ? 0 : 600);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onTheme = () => v.setSolid('cubo', CUBO, true);
    mq.addEventListener('change', onTheme);

    return () => {
      clearTimeout(timer);
      mq.removeEventListener('change', onTheme);
      v.destroy();
      viewerRef.current = null;
    };
  }, []);

  const replay = () => {
    const v = viewerRef.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    v.controls.autoRotate = false;
    v.flyTo(v.view(1, OPEN_DIR), 1400);
    v.animateT(1, 1500, () => {
      v.flyTo(v.viewFor('closed'), 2000);
      v.animateT(0, 2200, () => { v.controls.autoRotate = !reduce; });
    });
  };

  return (
    <section className="hero">
      <div>
        <h1>Gire, clique e desmonte cada sólido.</h1>
        <p>
          Um laboratório de geometria espacial para ver o que as fórmulas dizem: o nome de cada parte,
          a planificação de cada sólido e a área e o volume mudando junto com as medidas.
        </p>
        <div className="hero-actions">
          <Link className="btn" href="/laboratorio/cubo">Começar pelo cubo</Link>
          <button className="btn ghost" type="button" onClick={replay}>Abrir e montar de novo</button>
        </div>
      </div>
      <div className="sheet hero-sheet">
        <div className="viewer" ref={hostRef} aria-label="Cubo em 3D se montando a partir da planificação" />
      </div>
    </section>
  );
}
