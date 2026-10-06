// Questões da aba Praticar.
import { fmt } from './formato';

/* Questões. As de agora foram escritas para o Dobra, no estilo ENEM.
   Para incluir uma questão real de prova, adicione um item com a fonte (ex.: 'ENEM 2019, questão 150').
   Campos: solido, fonte, enunciado, imagem (opcional), imagemAlt, alternativas, correta (0 = A),
   explicacao e params (opcional: as medidas para montar o sólido no 3D). */
export const F = 'Questão do Dobra, no estilo ENEM';
export const QUESTOES = [
  /* cubo */
  { solido: 'cubo', fonte: F,
    enunciado: 'Uma caixa-d’água tem a forma de um cubo com aresta interna de 2 m. Quantos litros cabem nela quando está cheia? (1 m³ = 1 000 L)',
    alternativas: ['800 L', '2 000 L', '4 000 L', '8 000 L', '80 000 L'], correta: 3,
    explicacao: 'V = a³ = 2³ = 8 m³. Como cada metro cúbico tem 1 000 litros, cabem 8 000 L.', params: { a: 2 } },
  { solido: 'cubo', fonte: F,
    enunciado: 'Um artesão vai pintar todas as faces de um dado de madeira com aresta de 3 cm. Qual é a área total que será pintada?',
    alternativas: ['27 cm²', '36 cm²', '54 cm²', '81 cm²', '108 cm²'], correta: 2,
    explicacao: 'O cubo tem 6 faces quadradas iguais. Cada uma tem área 3² = 9 cm², então a área total é 6 × 9 = 54 cm². Cuidado: 27 é o volume (3³), não a área.', params: { a: 3 } },
  { solido: 'cubo', fonte: F,
    enunciado: 'Uma caixa cúbica tem aresta interna de 4 cm. Qual é o comprimento da maior vareta reta que cabe inteira dentro dela? Use √3 ≈ 1,7 e √2 ≈ 1,4.',
    alternativas: ['5,6 cm', '6,8 cm', '8 cm', '12 cm', '16 cm'], correta: 1,
    explicacao: 'A maior vareta fica na diagonal do cubo, que liga dois vértices opostos: D = a√3 = 4 × 1,7 = 6,8 cm. O valor 5,6 cm é só a diagonal de uma face (a√2).', params: { a: 4 } },

  /* prisma */
  { solido: 'prisma', fonte: F,
    enunciado: 'Uma barra de chocolate tem a forma de um prisma triangular regular com aresta da base de 2 cm e comprimento de 5 cm. Usando √3 ≈ 1,7, qual é o volume da barra?',
    alternativas: ['4,25 cm³', '8,5 cm³', '10 cm³', '17 cm³', '25 cm³'], correta: 1,
    explicacao: 'A base é um triângulo equilátero: A<sub>b</sub> = l²√3 / 4 = 4 × 1,7 / 4 = 1,7 cm². V = A<sub>b</sub> × h = 1,7 × 5 = 8,5 cm³.', params: { n: 3, l: 2, h: 5 } },
  { solido: 'prisma', fonte: F,
    enunciado: 'Uma embalagem de suco tem a forma de um prisma quadrangular regular com aresta da base de 7 cm e altura de 20 cm. Quantos litros ela comporta? (1 L = 1 000 cm³)',
    alternativas: ['0,14 L', '0,49 L', '0,98 L', '1,4 L', '9,8 L'], correta: 2,
    explicacao: 'A base é um quadrado: A<sub>b</sub> = 7² = 49 cm². V = 49 × 20 = 980 cm³. Dividindo por 1 000, dá 0,98 L.', params: { n: 4, l: 1.8, h: 5 } },
  { solido: 'prisma', fonte: F,
    enunciado: 'Um lápis sem ponta tem a forma de um prisma hexagonal regular com aresta da base de 0,5 cm e comprimento de 18 cm. Só as faces laterais recebem tinta. Qual é a área pintada?',
    alternativas: ['18 cm²', '27 cm²', '45 cm²', '54 cm²', '90 cm²'], correta: 3,
    explicacao: 'São 6 faces laterais retangulares de 0,5 cm por 18 cm. A<sub>l</sub> = 6 × 0,5 × 18 = 54 cm².', params: { n: 6, l: 0.5, h: 5 } },

  /* pirâmide */
  { solido: 'piramide', fonte: F,
    enunciado: 'Uma pirâmide quadrangular regular tem aresta da base de 3 cm e altura de 4 cm. Qual é o volume?',
    alternativas: ['9 cm³', '12 cm³', '18 cm³', '36 cm³', '48 cm³'], correta: 1,
    explicacao: 'A<sub>b</sub> = 3² = 9 cm². V = A<sub>b</sub> × h / 3 = 9 × 4 / 3 = 12 cm³. Quem esquece de dividir por 3 marca 36.', params: { n: 4, l: 3, h: 4 } },
  { solido: 'piramide', fonte: F,
    enunciado: 'Uma barraca de camping tem a forma de uma pirâmide quadrangular regular, com aresta da base de 4 m. A altura de cada face lateral (apótema da pirâmide) é 3 m. Quanta lona é usada nas quatro faces laterais?',
    alternativas: ['12 m²', '16 m²', '24 m²', '48 m²', '64 m²'], correta: 2,
    explicacao: 'Cada face lateral é um triângulo de base 4 m e altura 3 m: 4 × 3 / 2 = 6 m². Com 4 faces, a lona tem 4 × 6 = 24 m². O valor 16 m² é a área do chão, que não entra.', params: { n: 4, l: 4, h: 2.2 } },
  { solido: 'piramide', fonte: F,
    enunciado: 'Uma pirâmide quadrangular regular tem aresta da base de 6 cm e altura de 4 cm. Quanto mede o apótema da pirâmide, isto é, a altura de cada face lateral?',
    alternativas: ['2,5 cm', '3 cm', '4 cm', '5 cm', '7 cm'], correta: 3,
    explicacao: 'O apótema da base é metade da aresta: m = 3 cm. Altura, apótema da base e apótema da pirâmide formam um triângulo retângulo: g = √(4² + 3²) = √25 = 5 cm.', params: { n: 4, l: 3, h: 2 } },

  /* cilindro */
  { solido: 'cilindro', fonte: F,
    enunciado: 'Uma lata cilíndrica tem raio da base de 3 cm e altura de 4 cm. Usando π = 3, qual é o volume da lata?',
    alternativas: ['72 cm³', '108 cm³', '144 cm³', '216 cm³', '324 cm³'], correta: 1,
    explicacao: 'V = π × r² × h = 3 × 3² × 4 = 3 × 9 × 4 = 108 cm³.', params: { r: 3, h: 4 } },
  { solido: 'cilindro', fonte: F,
    enunciado: 'O rótulo de uma lata cobre toda a sua superfície lateral. A lata tem raio de 4 cm e altura de 10 cm. Usando π = 3, qual é a área do rótulo?',
    alternativas: ['120 cm²', '160 cm²', '240 cm²', '480 cm²', '960 cm²'], correta: 2,
    explicacao: 'Aberto, o rótulo vira um retângulo: o comprimento é a volta da lata (2πr = 2 × 3 × 4 = 24 cm) e a altura é 10 cm. Área = 24 × 10 = 240 cm².', params: { r: 2, h: 5 } },
  { solido: 'cilindro', fonte: F,
    enunciado: 'O copo A é cilíndrico, com raio de 2 cm e altura de 8 cm. O copo B também é cilíndrico, com raio de 4 cm e altura de 2 cm. Comparando os volumes, é correto afirmar que',
    alternativas: ['o copo A tem o dobro do volume do copo B.', 'o copo B tem o dobro do volume do copo A.', 'o copo A tem o quádruplo do volume do copo B.', 'o copo B tem o quádruplo do volume do copo A.', 'os dois copos têm o mesmo volume.'], correta: 4,
    explicacao: 'Copo A: π × 2² × 8 = 32π. Copo B: π × 4² × 2 = 32π. Os volumes são iguais: dobrar o raio multiplica a base por 4, o que compensa a altura 4 vezes menor.', params: { r: 1, h: 4 } },

  /* cone */
  { solido: 'cone', fonte: F,
    enunciado: 'Um chapéu de festa tem a forma de um cone com raio da base de 3 cm e altura de 4 cm. Usando π = 3, quanto papel é gasto na parte lateral do chapéu?',
    alternativas: ['27 cm²', '36 cm²', '45 cm²', '54 cm²', '75 cm²'], correta: 2,
    explicacao: 'Primeiro a geratriz: g = √(3² + 4²) = 5 cm. Depois a área lateral: A<sub>l</sub> = π × r × g = 3 × 3 × 5 = 45 cm².', params: { r: 3, h: 4 } },
  { solido: 'cone', fonte: F,
    enunciado: 'Uma casquinha de sorvete tem a forma de um cone com raio de 3 cm e altura de 10 cm. Usando π = 3, quantos cm³ de sorvete cabem dentro dela, até a borda?',
    alternativas: ['30 cm³', '90 cm³', '180 cm³', '270 cm³', '900 cm³'], correta: 1,
    explicacao: 'V = π × r² × h / 3 = 3 × 9 × 10 / 3 = 90 cm³. Quem esquece de dividir por 3 encontra 270, que seria o volume de um cilindro.', params: { r: 1.5, h: 5 } },
  { solido: 'cone', fonte: F,
    enunciado: 'Um funil cônico e um balde cilíndrico têm a mesma base e a mesma altura. Quantos funis cheios de água são necessários para encher o balde?',
    alternativas: ['3 funis, porque o volume do cone é um terço do volume do cilindro.', '2 funis, porque o volume do cone é metade do volume do cilindro.', '4 funis, porque o cone tem quatro vezes menos espaço.', '6 funis, porque o cone tem um sexto do volume do cilindro.', '1 funil, porque os dois têm a mesma base e a mesma altura.'], correta: 0,
    explicacao: 'O volume do cone é π × r² × h / 3, e o do cilindro com mesma base e altura é π × r² × h. Então o cone tem um terço do volume, e são necessários 3 funis.', params: { r: 2, h: 4 } },

  /* esfera */
  { solido: 'esfera', fonte: F,
    enunciado: 'Uma bola tem raio de 3 cm. Usando π = 3, qual é o volume da bola?',
    alternativas: ['27 cm³', '36 cm³', '81 cm³', '108 cm³', '144 cm³'], correta: 3,
    explicacao: 'V = 4 × π × r³ / 3 = 4 × 3 × 27 / 3 = 108 cm³.', params: { r: 3 } },
  { solido: 'esfera', fonte: F,
    enunciado: 'Uma bola de basquete tem raio de 12 cm. Usando π = 3, quanto material é necessário para cobrir toda a superfície da bola?',
    alternativas: ['432 cm²', '576 cm²', '1 728 cm²', '5 184 cm²', '6 912 cm²'], correta: 2,
    explicacao: 'A = 4 × π × r² = 4 × 3 × 12² = 12 × 144 = 1 728 cm². O valor 6 912 seria o volume, que mede o espaço dentro da bola, e não a superfície.', params: { r: 3 } },
  { solido: 'esfera', fonte: F,
    enunciado: 'Se o raio de uma esfera dobrar, o volume dela fica multiplicado por',
    alternativas: ['2', '3', '4', '6', '8'], correta: 4,
    explicacao: 'O volume depende de r³. Dobrando o raio, o volume fica multiplicado por 2³ = 8. Já a área da superfície, que depende de r², ficaria multiplicada por 4.', params: { r: 1.5 } },
];

/* ---------- questões de conta: o gabarito, as alternativas erradas e a resolução saem das próprias fórmulas ---------- */
const R3 = 1.7, R2 = 1.4;
const L1000 = { f: 1 / 1000, unit: 'L', hint: '(1 L = 1 000 cm³)' };
const M3L = { f: 1000, unit: 'L', hint: '(1 m³ = 1 000 L)' };
const ML = { f: 1, unit: 'mL', hint: '(1 cm³ = 1 mL)' };
const Q = (solido, ask, p, enunciado, u = 'cm', conv = null) => ({ solido, ask, p, enunciado, u, conv });
const CONTAS = [
  Q('cubo', 'V', { a: 6 }, 'Um cubo mágico tem aresta de 6 cm. Qual é o volume dele?'),
  Q('cubo', 'At', { a: 15 }, 'Uma caixa de presente cúbica tem aresta de 15 cm. Quanto papel é necessário para cobrir todas as faces, sem sobras?'),
  Q('cubo', 'V', { a: 30 }, 'Um aquário cúbico tem aresta interna de 30 cm. Quantos litros de água cabem nele quando está cheio?', 'cm', L1000),
  Q('cubo', 'Al4', { a: 3 }, 'Um quarto tem a forma de um cubo com 3 m de aresta. Vão pintar as quatro paredes, sem o teto e sem o chão. Qual é a área que será pintada?', 'm'),
  Q('cubo', 'D', { a: 10 }, 'Uma caixa cúbica tem aresta de 10 cm. Quanto mede a diagonal do cubo, que liga dois vértices opostos?'),
  Q('cubo', 'At', { a: 40 }, 'Um dado gigante de espuma tem aresta de 40 cm. Quanto tecido é necessário para revestir todas as faces?'),
  Q('cubo', 'V', { a: 1.5 }, 'Uma caixa-d’água cúbica tem aresta interna de 1,5 m. Quantos litros cabem nela?', 'm', M3L),
  Q('cubo', 'V', { a: 7 }, 'Uma peça de metal maciça tem a forma de um cubo com aresta de 7 cm. Qual é o volume da peça?'),

  Q('prisma', 'V', { n: 4, l: 6, h: 10 }, 'Um frasco de perfume tem a forma de um prisma quadrangular regular com aresta da base de 6 cm e altura de 10 cm. Qual é o volume do frasco?'),
  Q('prisma', 'V', { n: 3, l: 4, h: 6 }, 'Uma barraca tem a forma de um prisma triangular regular com aresta da base de 4 m e comprimento de 6 m. Qual é o volume de ar dentro da barraca?', 'm'),
  Q('prisma', 'Al', { n: 6, l: 10, h: 8 }, 'Uma caixa de presente tem a forma de um prisma hexagonal regular com aresta da base de 10 cm e altura de 8 cm. Quanto papel cobre só as faces laterais?'),
  Q('prisma', 'At', { n: 4, l: 5, h: 12 }, 'Uma caixa tem a forma de um prisma quadrangular regular com aresta da base de 5 cm e altura de 12 cm. Qual é a área total da caixa?'),
  Q('prisma', 'V', { n: 4, l: 2, h: 3 }, 'Um reservatório tem a forma de um prisma quadrangular regular com aresta da base de 2 m e altura de 3 m. Quantos litros ele comporta?', 'm', M3L),
  Q('prisma', 'V', { n: 6, l: 2, h: 10 }, 'Uma peça de madeira tem a forma de um prisma hexagonal regular com aresta da base de 2 cm e altura de 10 cm. Qual é o volume da peça?'),
  Q('prisma', 'Al', { n: 3, l: 6, h: 10 }, 'Um prisma triangular regular de acrílico tem aresta da base de 6 cm e altura de 10 cm. Qual é a área lateral?'),
  Q('prisma', 'V', { n: 3, l: 4, h: 10 }, 'Uma vela tem a forma de um prisma triangular regular com aresta da base de 4 cm e altura de 10 cm. Quanta parafina foi usada para fazê-la?'),

  Q('piramide', 'V', { n: 4, l: 6, h: 9 }, 'Um peso de papel tem a forma de uma pirâmide quadrangular regular com aresta da base de 6 cm e altura de 9 cm. Qual é o volume?'),
  Q('piramide', 'V', { n: 4, l: 30, h: 20 }, 'A entrada de um museu é uma pirâmide de vidro quadrangular regular, com aresta da base de 30 m e altura de 20 m. Qual é o volume de ar dentro dela?', 'm'),
  Q('piramide', 'Al', { n: 4, l: 8, g: 5 }, 'Um telhado tem a forma de uma pirâmide quadrangular regular com aresta da base de 8 m. A altura de cada face (apótema da pirâmide) é 5 m. Quantos metros quadrados de telhas cobrem as quatro faces?', 'm'),
  Q('piramide', 'g', { n: 4, l: 10, h: 12 }, 'Uma pirâmide quadrangular regular tem aresta da base de 10 cm e altura de 12 cm. Quanto mede o apótema da pirâmide?'),
  Q('piramide', 'At', { n: 4, l: 6, h: 4 }, 'Uma pirâmide quadrangular regular tem aresta da base de 6 cm e altura de 4 cm. Qual é a área total da pirâmide?'),
  Q('piramide', 'V', { n: 3, l: 6, h: 10 }, 'Uma embalagem de bombom tem a forma de uma pirâmide triangular regular com aresta da base de 6 cm e altura de 10 cm. Qual é o volume da embalagem?'),
  Q('piramide', 'V', { n: 6, l: 2, h: 5 }, 'Uma pirâmide hexagonal regular tem aresta da base de 2 cm e altura de 5 cm. Qual é o volume?'),
  Q('piramide', 'Al', { n: 4, l: 16, h: 6 }, 'Um enfeite tem a forma de uma pirâmide quadrangular regular com aresta da base de 16 cm e altura de 6 cm. Quanto papel é usado nas faces laterais?'),

  Q('cilindro', 'V', { r: 1, h: 2 }, 'Uma caixa-d’água cilíndrica tem raio de 1 m e altura de 2 m. Quantos litros cabem nela?', 'm', M3L),
  Q('cilindro', 'V', { d: 8, h: 10 }, 'Um copo cilíndrico tem diâmetro de 8 cm e altura de 10 cm. Quantos mililitros cabem nele?', 'cm', ML),
  Q('cilindro', 'V', { r: 10, h: 20 }, 'Uma lata de tinta cilíndrica tem raio de 10 cm e altura de 20 cm. Quantos litros de tinta cabem nela?', 'cm', L1000),
  Q('cilindro', 'Al', { r: 5, h: 100 }, 'Um cano tem raio externo de 5 cm e comprimento de 100 cm. Qual é a área da superfície externa do cano?'),
  Q('cilindro', 'At', { r: 5, h: 12 }, 'Uma lata fechada tem raio de 5 cm e altura de 12 cm. Quanta folha de alumínio é necessária para fabricá-la inteira, com tampa e fundo?'),
  Q('cilindro', 'Al', { r: 3, h: 20 }, 'Um rolo de pintura tem raio de 3 cm e comprimento de 20 cm. Que área ele pinta a cada volta completa?'),
  Q('cilindro', 'V', { d: 2, h: 0.5 }, 'Uma piscina infantil cilíndrica tem diâmetro de 2 m e altura de 0,5 m. Quantos litros de água cabem nela?', 'm', M3L),
  Q('cilindro', 'AbAl', { r: 10, h: 8 }, 'Um bolo cilíndrico tem raio de 10 cm e altura de 8 cm. A confeiteira vai cobrir com glacê o topo e a lateral, mas não o fundo. Qual é a área coberta?'),

  Q('cone', 'V', { r: 6, h: 10 }, 'Um funil cônico tem raio de 6 cm e altura de 10 cm. Qual é o volume do funil?'),
  Q('cone', 'V', { r: 3, h: 8 }, 'Um copinho descartável cônico tem raio de 3 cm e altura de 8 cm. Quantos mililitros de água cabem nele?', 'cm', ML),
  Q('cone', 'g', { r: 6, h: 8 }, 'Um cone reto tem raio da base de 6 cm e altura de 8 cm. Quanto mede a geratriz?'),
  Q('cone', 'Al', { r: 5, h: 12 }, 'Um chapéu de bruxa tem a forma de um cone com raio de 5 cm e altura de 12 cm. Quanto tecido é usado na parte lateral?'),
  Q('cone', 'V', { r: 2, h: 1.5 }, 'Um monte de areia tem a forma de um cone com raio da base de 2 m e altura de 1,5 m. Qual é o volume de areia?', 'm'),
  Q('cone', 'Al', { r: 4, g: 10 }, 'Uma casquinha de sorvete tem a forma de um cone com raio de 4 cm e geratriz de 10 cm. Qual é a área lateral da casquinha?'),
  Q('cone', 'At', { r: 15, h: 20 }, 'Um cone de sinalização de trânsito, fechado na base, tem raio de 15 cm e altura de 20 cm. Qual é a área total dele?'),
  Q('cone', 'V', { r: 4, h: 9 }, 'Uma taça tem a forma de um cone com raio de 4 cm e altura de 9 cm. Quantos mililitros cabem nela?', 'cm', ML),

  Q('esfera', 'V', { r: 1 }, 'Uma bolinha de gude tem raio de 1 cm. Qual é o volume dela?'),
  Q('esfera', 'A', { r: 11 }, 'Uma bola de futebol tem raio de 11 cm. Quanto material é necessário para cobrir toda a superfície da bola?'),
  Q('esfera', 'Acorte', { r: 4 }, 'Uma laranja esférica de raio 4 cm é cortada ao meio, passando pelo centro. Qual é a área do círculo que aparece no corte?'),
  Q('esfera', 'V', { r: 2 }, 'Um tanque de gás esférico tem raio de 2 m. Quantos litros cabem nele?', 'm', M3L),
  Q('esfera', 'V', { d: 4 }, 'Uma bola de pingue-pongue tem diâmetro de 4 cm. Qual é o volume de ar dentro dela?'),
  Q('esfera', 'Vhemi', { r: 10 }, 'A cúpula de um planetário tem a forma de meia esfera com raio de 10 m. Qual é o volume de ar dentro da cúpula?', 'm'),
  Q('esfera', 'A', { r: 15 }, 'Um globo de isopor tem raio de 15 cm. Qual é a área da superfície que será pintada?'),
  Q('esfera', 'V', { r: 1.5 }, 'Um bombom esférico tem raio de 1,5 cm. Qual é o volume de chocolate?'),
];

const abReg = (n, l) => n === 4 ? l * l : n === 3 ? l * l * R3 / 4 : 6 * l * l * R3 / 4;
const abText = (n, l) => n === 4 ? `A<sub>b</sub> = l² = ${fmt(l)}² = ${fmt(abReg(n, l))}`
  : n === 3 ? `A<sub>b</sub> = l² × √3 / 4 = ${fmt(l)}² × 1,7 / 4 = ${fmt(abReg(n, l))}`
  : `A base é formada por 6 triângulos equiláteros: A<sub>b</sub> = 6 × l² × √3 / 4 = 6 × ${fmt(l)}² × 1,7 / 4 = ${fmt(abReg(n, l))}`;

function solveConta(q) {
  const { solido, ask, p } = q, f = fmt; let k, v, w, e;
  if (solido === 'cubo') {
    const a = p.a;
    if (ask === 'V') { k = 'vol'; v = a ** 3; w = [a * a, 6 * a * a, 3 * a, 2 * a ** 3]; e = `V = a³ = ${f(a)}³ = ${f(v)}`; }
    if (ask === 'At') { k = 'area'; v = 6 * a * a; w = [a ** 3, 4 * a * a, a * a, 6 * a]; e = `O cubo tem 6 faces quadradas iguais: A<sub>t</sub> = 6 × a² = 6 × ${f(a)}² = ${f(v)}`; }
    if (ask === 'Al4') { k = 'area'; v = 4 * a * a; w = [6 * a * a, a * a, 4 * a, a ** 3]; e = `São 4 paredes quadradas: 4 × a² = 4 × ${f(a)}² = ${f(v)}`; }
    if (ask === 'D') { k = 'len'; v = a * R3; w = [a * R2, 3 * a, 2 * a, a]; e = `A diagonal do cubo é D = a√3 = ${f(a)} × 1,7 = ${f(v)}. Cuidado: a√2 = ${f(a * R2)} é só a diagonal de uma face`; }
  }
  if (solido === 'prisma') {
    const { n, l, h } = p, Ab = abReg(n, l), Al = n * l * h, abT = abText(n, l);
    if (ask === 'V') { k = 'vol'; v = Ab * h; w = [Ab * h / 2, Ab, 2 * Ab * h, Al]; e = `${abT}. V = A<sub>b</sub> × h = ${f(Ab)} × ${f(h)} = ${f(v)}`; }
    if (ask === 'Al') { k = 'area'; v = Al; w = [l * h, Al / 2, Ab * h, 2 * Ab + Al]; e = `As faces laterais são ${n} retângulos de ${f(l)} por ${f(h)}: A<sub>l</sub> = ${n} × ${f(l)} × ${f(h)} = ${f(v)}`; }
    if (ask === 'At') { k = 'area'; v = 2 * Ab + Al; w = [Al, Ab + Al, Ab * h, 2 * Ab]; e = `${abT}. A<sub>l</sub> = ${n} × ${f(l)} × ${f(h)} = ${f(Al)}. A<sub>t</sub> = 2 × A<sub>b</sub> + A<sub>l</sub> = 2 × ${f(Ab)} + ${f(Al)} = ${f(v)}`; }
  }
  if (solido === 'piramide') {
    const { n, l } = p, Ab = abReg(n, l), abT = abText(n, l), m = l / 2;
    const h = p.h != null ? p.h : Math.sqrt(p.g * p.g - m * m);
    const g = p.g != null ? p.g : Math.hypot(h, m);
    const gT = p.g != null ? '' : `O apótema da base é metade da aresta, m = ${f(m)}. Pelo teorema de Pitágoras, o apótema da pirâmide é g = √(h² + m²) = √(${f(h)}² + ${f(m)}²) = ${f(g)}. `;
    const Al = n * l * g / 2;
    if (ask === 'V') { k = 'vol'; v = Ab * h / 3; w = [Ab * h, Ab * h / 2, Ab / 3, 2 * Ab * h / 3]; e = `${abT}. V = A<sub>b</sub> × h / 3 = ${f(Ab)} × ${f(h)} / 3 = ${f(v)}`; }
    if (ask === 'g') { k = 'len'; v = g; w = [h + m, h, g + 1, g + 2]; e = `O apótema da base é metade da aresta, m = ${f(m)}. Altura, apótema da base e apótema da pirâmide formam um triângulo retângulo: g = √(${f(h)}² + ${f(m)}²) = ${f(v)}`; }
    if (ask === 'Al') { k = 'area'; v = Al; w = [n * l * g, l * g / 2, Ab + Al, n * l * h / 2]; e = `${gT}Cada face lateral é um triângulo de base ${f(l)} e altura ${f(g)}: ${f(l)} × ${f(g)} / 2 = ${f(l * g / 2)}. Com ${n} faces: A<sub>l</sub> = ${f(v)}`; }
    if (ask === 'At') { k = 'area'; v = Ab + Al; w = [Al, 2 * Ab + Al, Ab + 2 * Al, Ab * h / 3]; e = `${gT}${abT}. A<sub>l</sub> = ${n} × ${f(l)} × ${f(g)} / 2 = ${f(Al)}. A<sub>t</sub> = A<sub>b</sub> + A<sub>l</sub> = ${f(Ab)} + ${f(Al)} = ${f(v)}`; }
  }
  if (solido === 'cilindro') {
    const r = p.d != null ? p.d / 2 : p.r, h = p.h, Ab = 3 * r * r, Al = 6 * r * h;
    const dT = p.d != null ? `O raio é metade do diâmetro: r = ${f(r)}. ` : '';
    if (ask === 'V') { k = 'vol'; v = Ab * h; w = [3 * r * h, p.d != null ? 3 * p.d * p.d * h : Ab, 6 * r * h, Ab * h / 3]; e = `${dT}V = π × r² × h = 3 × ${f(r)}² × ${f(h)} = ${f(v)}`; }
    if (ask === 'Al') { k = 'area'; v = Al; w = [3 * r * h, Ab * h, Al + 2 * Ab, Al + Ab]; e = `Aberta, a lateral vira um retângulo: o comprimento é a volta da base, 2πr = 2 × 3 × ${f(r)} = ${f(6 * r)}, e a altura é ${f(h)}. A<sub>l</sub> = ${f(6 * r)} × ${f(h)} = ${f(v)}`; }
    if (ask === 'At') { k = 'area'; v = 2 * Ab + Al; w = [Al, Ab + Al, Ab * h, 2 * Ab]; e = `Cada base: π × r² = 3 × ${f(r)}² = ${f(Ab)}. Lateral: 2 × π × r × h = 2 × 3 × ${f(r)} × ${f(h)} = ${f(Al)}. Total: 2 × ${f(Ab)} + ${f(Al)} = ${f(v)}`; }
    if (ask === 'AbAl') { k = 'area'; v = Ab + Al; w = [2 * Ab + Al, Al, Ab * h, Ab + 3 * r * h]; e = `Topo: π × r² = 3 × ${f(r)}² = ${f(Ab)}. Lateral: 2 × π × r × h = 2 × 3 × ${f(r)} × ${f(h)} = ${f(Al)}. Sem o fundo, a área coberta é ${f(Ab)} + ${f(Al)} = ${f(v)}`; }
  }
  if (solido === 'cone') {
    const r = p.r, h = p.h != null ? p.h : Math.sqrt(p.g * p.g - r * r), g = p.g != null ? p.g : Math.hypot(r, h);
    const gT = p.g != null ? '' : `Primeiro a geratriz, pelo teorema de Pitágoras: g = √(r² + h²) = √(${f(r)}² + ${f(h)}²) = ${f(g)}. `;
    if (ask === 'V') { k = 'vol'; v = r * r * h; w = [3 * r * r * h, 1.5 * r * r * h, r * h, 3 * r * r]; e = `V = π × r² × h / 3 = 3 × ${f(r)}² × ${f(h)} / 3 = ${f(v)}. Quem esquece de dividir por 3 encontra ${f(3 * r * r * h)}, o volume de um cilindro`; }
    if (ask === 'g') { k = 'len'; v = g; w = [r + h, h + 1, r * h / 2, g + 2]; e = `Raio, altura e geratriz formam um triângulo retângulo: g = √(r² + h²) = √(${f(r)}² + ${f(h)}²) = ${f(v)}`; }
    if (ask === 'Al') { k = 'area'; v = 3 * r * g; w = [3 * r * r, 6 * r * g, 3 * r * (g + r), r * g]; e = `${gT}A<sub>l</sub> = π × r × g = 3 × ${f(r)} × ${f(g)} = ${f(v)}`; }
    if (ask === 'At') { k = 'area'; v = 3 * r * (g + r); w = [3 * r * g, 3 * r * r, 3 * r * g + 6 * r * r, 3 * r * h]; e = `${gT}Base: π × r² = 3 × ${f(r)}² = ${f(3 * r * r)}. Lateral: π × r × g = 3 × ${f(r)} × ${f(g)} = ${f(3 * r * g)}. Total: ${f(3 * r * r)} + ${f(3 * r * g)} = ${f(v)}`; }
  }
  if (solido === 'esfera') {
    const r = p.d != null ? p.d / 2 : p.r;
    const dT = p.d != null ? `O raio é metade do diâmetro: r = ${f(r)}. ` : '';
    if (ask === 'V') { k = 'vol'; v = 4 * r ** 3; w = [12 * r * r, 12 * r ** 3, 2 * r ** 3, 4 * r * r]; e = `${dT}V = 4 × π × r³ / 3 = 4 × 3 × ${f(r)}³ / 3 = ${f(v)}`; }
    if (ask === 'A') { k = 'area'; v = 12 * r * r; w = [3 * r * r, 4 * r ** 3, 12 * r, 6 * r * r]; e = `A = 4 × π × r² = 4 × 3 × ${f(r)}² = ${f(v)}`; }
    if (ask === 'Acorte') { k = 'area'; v = 3 * r * r; w = [12 * r * r, 6 * r * r, 6 * r, 3 * r]; e = `O corte pelo centro forma um círculo máximo, com o mesmo raio da esfera: A = π × r² = 3 × ${f(r)}² = ${f(v)}`; }
    if (ask === 'Vhemi') { k = 'vol'; v = 2 * r ** 3; w = [4 * r ** 3, 6 * r ** 3, 6 * r * r, r ** 3]; e = `A cúpula é meia esfera: V = (4 × π × r³ / 3) / 2 = (4 × 3 × ${f(r)}³ / 3) / 2 = ${f(v)}`; }
  }
  return { k, v, w, e };
}

function to3D(solido, p) {
  const lim = { cubo: { a: 4 }, prisma: { l: 3, h: 5 }, piramide: { l: 4, h: 5 }, cilindro: { r: 3, h: 5 }, cone: { r: 3, h: 5 }, esfera: { r: 3 } }[solido];
  const q = { ...p };
  if (q.d != null) { q.r = q.d / 2; delete q.d; }
  if (solido === 'piramide' && q.g != null) { q.h = Math.sqrt(q.g * q.g - (q.l / 2) ** 2); delete q.g; }
  if (solido === 'cone' && q.g != null) { q.h = Math.sqrt(q.g * q.g - q.r * q.r); delete q.g; }
  const sc = Math.min(...Object.keys(lim).map(key => lim[key] / q[key]));
  Object.keys(lim).forEach(key => { q[key] = Math.max(0.3, Math.round(q[key] * sc * 10) / 10); });
  return q;
}

function buildConta(q) {
  const { k, v, w, e } = solveConta(q);
  const raw = k === 'vol' ? `${q.u}³` : k === 'area' ? `${q.u}²` : q.u;
  const fac = (k === 'vol' && q.conv) ? q.conv.f : 1, unit = (k === 'vol' && q.conv) ? q.conv.unit : raw;
  const key = x => Math.round(x * fac * 100);
  const seen = new Set([key(v)]), wrong = [];
  [...w, v * 2, v / 2, v * 1.5, v * 3, v * 4, v / 3].forEach(x => {
    if (wrong.length < 4 && isFinite(x) && x > 0 && !seen.has(key(x))) { seen.add(key(x)); wrong.push(x); }
  });
  const all = [v, ...wrong].sort((a, b) => a - b);
  const notes = [];
  if (['cilindro', 'cone', 'esfera'].includes(q.solido)) notes.push('Use π = 3.');
  if (((q.solido === 'prisma' || q.solido === 'piramide') && (q.p.n === 3 || q.p.n === 6)) || q.ask === 'D') notes.push(q.ask === 'D' ? 'Use √3 ≈ 1,7 e √2 ≈ 1,4.' : 'Use √3 ≈ 1,7.');
  if (k === 'vol' && q.conv) notes.push(q.conv.hint);
  let expl = `${e} ${raw}.`;
  if (k === 'vol' && q.conv && q.conv.f !== 1) expl += ` Convertendo: ${fmt(v)} ${raw} = ${fmt(v * fac)} ${unit}.`;
  if (k === 'vol' && q.conv && q.conv.f === 1) expl += ` Como 1 cm³ = 1 mL, cabem ${fmt(v)} mL.`;
  return {
    solido: q.solido, fonte: F, enunciado: `${q.enunciado} ${notes.join(' ')}`.trim(),
    alternativas: all.map(x => `${fmt(x * fac)} ${unit}`), correta: all.indexOf(v),
    explicacao: expl, params: to3D(q.solido, q.p),
  };
}
QUESTOES.push(...CONTAS.map(buildConta));
