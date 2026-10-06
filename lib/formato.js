// Funções pequenas usadas no site todo.
export const PI = Math.PI;
export const fmt = (x, d = 2) => Number(x).toLocaleString('pt-BR', { maximumFractionDigits: d });
export const clamp01 = x => Math.max(0, Math.min(1, x));
export const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const POLY = { 3: 'triângulo', 4: 'quadrado', 5: 'pentágono', 6: 'hexágono', 7: 'heptágono', 8: 'octógono' };
export const ADJ = { 3: 'triangular', 4: 'quadrangular', 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octogonal' };
