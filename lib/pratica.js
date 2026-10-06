// Sorteio das contas da aba Praticar.
import { fmt, ADJ } from './formato';

export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pickOne = arr => arr[Math.floor(Math.random() * arr.length)];
export const isFem = n => /^(Face|Base|Aresta|Altura|Geratriz|Diagonal|Superfície)/.test(n);
export const lower = n => n.charAt(0).toLowerCase() + n.slice(1);

export const ASK = { 'Volume': 'o volume', 'Área total': 'a área total', 'Área lateral': 'a área lateral', 'Área da base': 'a área da base',
  'Área de uma face': 'a área de uma face', 'Área da superfície': 'a área da superfície', 'Geratriz': 'a geratriz',
  'Apótema da base': 'o apótema da base', 'Apótema da pirâmide': 'o apótema da pirâmide (a altura de uma face lateral)',
  'Diagonal do cubo': 'a diagonal do cubo' };
export function randomParams(key) {
  switch (key) {
    case 'cubo': return { a: rnd(1, 4) };
    case 'prisma': return { n: pickOne([3, 4, 6]), l: rnd(1, 3), h: rnd(2, 5) };
    case 'piramide': return { n: pickOne([3, 4, 6]), l: rnd(2, 4), h: rnd(2, 5) };
    case 'cilindro': return { r: rnd(1, 3), h: rnd(2, 5) };
    case 'cone': return pickOne([{ r: 3, h: 4 }, { r: rnd(1, 3), h: rnd(2, 5) }]);
    default: return { r: rnd(1, 3) };
  }
}
export function describe(key, p) {
  switch (key) {
    case 'cubo': return `Um cubo tem aresta de ${fmt(p.a)} cm.`;
    case 'prisma': return `Um prisma ${ADJ[p.n]} regular tem aresta da base de ${fmt(p.l)} cm e altura de ${fmt(p.h)} cm.`;
    case 'piramide': return `Uma pirâmide ${ADJ[p.n]} regular tem aresta da base de ${fmt(p.l)} cm e altura de ${fmt(p.h)} cm.`;
    case 'cilindro': return `Um cilindro reto tem raio da base de ${fmt(p.r)} cm e altura de ${fmt(p.h)} cm.`;
    case 'cone': return `Um cone reto tem raio da base de ${fmt(p.r)} cm e altura de ${fmt(p.h)} cm.`;
    default: return `Uma esfera tem raio de ${fmt(p.r)} cm.`;
  }
}
