// Dados de cada sólido: medidas, nomes das partes e fórmulas.
// Este arquivo não usa three.js, então pode ser lido tanto no servidor quanto no navegador.
import { PI, fmt, POLY, ADJ } from './formato';

export const I = s => `<i>${s}</i>`;
const Ab_ = `${I('A')}<sub>b</sub>`, Al_ = `${I('A')}<sub>l</sub>`, At_ = `${I('A')}<sub>t</sub>`;
const row = (label, sym, formula, sub, value, unit) => ({ label, sym, formula, sub, value, unit });
const regBase = (n, l) => { const m = l / (2 * Math.tan(PI / n)); return { m, Ab: n * l * m / 2 }; };
const rowM = (n, l, m) => row('Apótema da base', I('m'), `${I('l')} / (2 × tg(180°/${I('n')}))`, `${fmt(l)} / (2 × tg ${fmt(180 / n, 1)}°)`, m, 'cm');
const rowAb = (n, l, m, Ab) => row('Área da base', Ab_, `${I('n')} × ${I('l')} × ${I('m')} / 2`, `${n} × ${fmt(l)} × ${fmt(m)} / 2`, Ab, 'cm²');

export const SOLIDS = {
  cubo: {
    partes: ['Face', 'Aresta', 'Vértice', 'Diagonal do cubo'],
    cat: 'poli', title: 'Cubo', blurb: 'Seis quadrados iguais. Um bom ponto de partida.', key: `${I('V')} = ${I('a')}³`,
    params: [{ k: 'a', label: 'Aresta', sym: 'a', min: .5, max: 4, step: .1, val: 2 }],
    name: () => 'Cubo', sub: () => 'Um prisma especial: as 6 faces são quadrados iguais.',
    calc: ({ a }) => ({
      rows: [
        row('Área de uma face', `${I('A')}<sub>f</sub>`, `${I('a')}²`, `${fmt(a)}²`, a * a, 'cm²'),
        row('Área total', At_, `6 × ${I('a')}²`, `6 × ${fmt(a)}²`, 6 * a * a, 'cm²'),
        row('Volume', I('V'), `${I('a')}³`, `${fmt(a)}³`, a ** 3, 'cm³'),
        row('Diagonal do cubo', I('D'), `${I('a')}√3`, `${fmt(a)} × √3`, a * Math.sqrt(3), 'cm'),
      ],
      pieces: [{ name: 'faces quadradas', count: 6, each: a * a }],
      euler: { F: 6, A: 12, V: 8 },
    }),
  },
  prisma: {
    partes: ['Base inferior', 'Base superior', 'Face lateral', 'Aresta da base', 'Aresta lateral', 'Vértice'],
    cat: 'poli', title: 'Prisma', blurb: 'Duas bases iguais e paralelas, ligadas por retângulos.', key: `${I('V')} = ${Ab_} × ${I('h')}`,
    params: [
      { k: 'n', label: 'Lados da base', sym: 'n', min: 3, max: 8, step: 1, val: 6, int: true },
      { k: 'l', label: 'Aresta da base', sym: 'l', min: .5, max: 3, step: .1, val: 1.5 },
      { k: 'h', label: 'Altura', sym: 'h', min: .5, max: 5, step: .1, val: 3 }],
    name: p => `Prisma ${ADJ[p.n]}`, sub: p => `Duas bases em forma de ${POLY[p.n]} ligadas por ${p.n} retângulos.`,
    calc: ({ n, l, h }) => {
      const { m, Ab } = regBase(n, l), Al = n * l * h;
      return {
        rows: [rowM(n, l, m), rowAb(n, l, m, Ab),
          row('Área lateral', Al_, `${I('n')} × ${I('l')} × ${I('h')}`, `${n} × ${fmt(l)} × ${fmt(h)}`, Al, 'cm²'),
          row('Área total', At_, `2 × ${Ab_} + ${Al_}`, `2 × ${fmt(Ab)} + ${fmt(Al)}`, 2 * Ab + Al, 'cm²'),
          row('Volume', I('V'), `${Ab_} × ${I('h')}`, `${fmt(Ab)} × ${fmt(h)}`, Ab * h, 'cm³')],
        pieces: [{ name: 'bases', count: 2, each: Ab }, { name: 'retângulos', count: n, each: l * h }],
        euler: { F: n + 2, A: 3 * n, V: 2 * n },
      };
    },
  },
  piramide: {
    partes: ['Base', 'Face lateral', 'Aresta da base', 'Aresta lateral', 'Vértice da base', 'Vértice da pirâmide', 'Altura', 'Apótema da base', 'Apótema da pirâmide'],
    cat: 'poli', title: 'Pirâmide', blurb: 'Uma base e triângulos que se encontram num vértice.', key: `${I('V')} = ${Ab_} × ${I('h')} / 3`,
    params: [
      { k: 'n', label: 'Lados da base', sym: 'n', min: 3, max: 8, step: 1, val: 4, int: true },
      { k: 'l', label: 'Aresta da base', sym: 'l', min: .5, max: 4, step: .1, val: 3 },
      { k: 'h', label: 'Altura', sym: 'h', min: .5, max: 5, step: .1, val: 3 }],
    name: p => `Pirâmide ${ADJ[p.n]}`, sub: p => `Uma base em forma de ${POLY[p.n]} e ${p.n} triângulos que se encontram no vértice.`,
    calc: ({ n, l, h }) => {
      const { m, Ab } = regBase(n, l), g = Math.hypot(h, m), Al = n * l * g / 2;
      return {
        rows: [rowM(n, l, m),
          row('Apótema da pirâmide', I('g'), `√(${I('h')}² + ${I('m')}²)`, `√(${fmt(h)}² + ${fmt(m)}²)`, g, 'cm'),
          rowAb(n, l, m, Ab),
          row('Área lateral', Al_, `${I('n')} × ${I('l')} × ${I('g')} / 2`, `${n} × ${fmt(l)} × ${fmt(g)} / 2`, Al, 'cm²'),
          row('Área total', At_, `${Ab_} + ${Al_}`, `${fmt(Ab)} + ${fmt(Al)}`, Ab + Al, 'cm²'),
          row('Volume', I('V'), `${Ab_} × ${I('h')} / 3`, `${fmt(Ab)} × ${fmt(h)} / 3`, Ab * h / 3, 'cm³')],
        pieces: [{ name: 'base', count: 1, each: Ab }, { name: 'triângulos', count: n, each: l * g / 2 }],
        euler: { F: n + 1, A: 2 * n, V: n + 1 },
      };
    },
  },
  cilindro: {
    partes: ['Base', 'Superfície lateral', 'Altura (eixo)', 'Raio da base', 'Geratriz', 'Centro da base'],
    cat: 'red', title: 'Cilindro', blurb: 'A lateral abre e vira um retângulo.', key: `${I('V')} = π × ${I('r')}² × ${I('h')}`,
    params: [
      { k: 'r', label: 'Raio da base', sym: 'r', min: .3, max: 3, step: .1, val: 1.5 },
      { k: 'h', label: 'Altura', sym: 'h', min: .5, max: 5, step: .1, val: 3 }],
    name: () => 'Cilindro', sub: () => 'Duas bases circulares ligadas por uma superfície curva.',
    calc: ({ r, h }) => {
      const Ab = PI * r * r, Al = 2 * PI * r * h;
      return {
        rows: [
          row('Área da base', Ab_, `π × ${I('r')}²`, `π × ${fmt(r)}²`, Ab, 'cm²'),
          row('Área lateral', Al_, `2 × π × ${I('r')} × ${I('h')}`, `2 × π × ${fmt(r)} × ${fmt(h)}`, Al, 'cm²'),
          row('Área total', At_, `2 × ${Ab_} + ${Al_}`, `2 × ${fmt(Ab)} + ${fmt(Al)}`, 2 * Ab + Al, 'cm²'),
          row('Volume', I('V'), `π × ${I('r')}² × ${I('h')}`, `π × ${fmt(r)}² × ${fmt(h)}`, Ab * h, 'cm³')],
        pieces: [{ name: 'bases', count: 2, each: Ab }, { name: 'retângulo', count: 1, each: Al }],
      };
    },
  },
  cone: {
    partes: ['Base', 'Superfície lateral', 'Vértice', 'Altura', 'Raio da base', 'Geratriz', 'Centro da base'],
    cat: 'red', title: 'Cone', blurb: 'A lateral abre e vira um setor de círculo.', key: `${I('V')} = π × ${I('r')}² × ${I('h')} / 3`,
    params: [
      { k: 'r', label: 'Raio da base', sym: 'r', min: .3, max: 3, step: .1, val: 1.5 },
      { k: 'h', label: 'Altura', sym: 'h', min: .5, max: 5, step: .1, val: 3.5 }],
    name: () => 'Cone', sub: () => 'Uma base circular e uma superfície curva que termina num vértice.',
    calc: ({ r, h }) => {
      const g = Math.hypot(r, h), Ab = PI * r * r, Al = PI * r * g;
      return {
        rows: [
          row('Geratriz', I('g'), `√(${I('r')}² + ${I('h')}²)`, `√(${fmt(r)}² + ${fmt(h)}²)`, g, 'cm'),
          row('Área da base', Ab_, `π × ${I('r')}²`, `π × ${fmt(r)}²`, Ab, 'cm²'),
          row('Área lateral', Al_, `π × ${I('r')} × ${I('g')}`, `π × ${fmt(r)} × ${fmt(g)}`, Al, 'cm²'),
          row('Área total', At_, `${Ab_} + ${Al_}`, `${fmt(Ab)} + ${fmt(Al)}`, Ab + Al, 'cm²'),
          row('Volume', I('V'), `π × ${I('r')}² × ${I('h')} / 3`, `π × ${fmt(r)}² × ${fmt(h)} / 3`, Ab * h / 3, 'cm³')],
        pieces: [{ name: 'base', count: 1, each: Ab }, { name: 'setor circular', count: 1, each: Al }],
      };
    },
  },
  esfera: {
    partes: ['Superfície esférica', 'Círculo máximo', 'Centro', 'Raio'],
    cat: 'red', title: 'Esfera', blurb: 'A única daqui que não dá para planificar.', key: `${I('V')} = 4 × π × ${I('r')}³ / 3`,
    params: [{ k: 'r', label: 'Raio', sym: 'r', min: .3, max: 3, step: .1, val: 2 }],
    name: () => 'Esfera', sub: () => 'Todos os pontos à mesma distância de um centro.',
    noNet: true,
    calc: ({ r }) => ({
      rows: [
        row('Área da superfície', I('A'), `4 × π × ${I('r')}²`, `4 × π × ${fmt(r)}²`, 4 * PI * r * r, 'cm²'),
        row('Volume', I('V'), `4 × π × ${I('r')}³ / 3`, `4 × π × ${fmt(r)}³ / 3`, 4 * PI * r ** 3 / 3, 'cm³')],
    }),
  },
};


// Liga cada parte clicada ao cartão de fórmula correspondente.
export const PART_ROW = {
  'Face': 'Área de uma face', 'Base': 'Área da base', 'Base inferior': 'Área da base', 'Base superior': 'Área da base',
  'Face lateral': 'Área lateral', 'Superfície lateral': 'Área lateral', 'Superfície esférica': 'Área da superfície',
  'Apótema da base': 'Apótema da base', 'Apótema da pirâmide': 'Apótema da pirâmide', 'Geratriz': 'Geratriz',
  'Diagonal do cubo': 'Diagonal do cubo',
};
export const groupOf = r => /^Volume/.test(r.label) ? 'Volume' : /^Área/.test(r.label) ? 'Área' : 'Segmentos';
export const isMain = r => /^(Volume|Área total|Área da superfície)/.test(r.label);
