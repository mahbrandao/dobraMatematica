<div align="center">

# Dobra

### Laboratório interativo de geometria espacial

**Gire, clique e desmonte cada sólido.**

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![three.js](https://img.shields.io/badge/three.js-3D-7A5BD6?logo=threedotjs&logoColor=white)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-9D80EB)

</div>

---

## Sobre o projeto

Quem estuda geometria espacial costuma decorar fórmulas sem conseguir **enxergar** os sólidos. O Dobra resolve isso transformando cada sólido num objeto 3D que o aluno pode girar, abrir e explorar.

Ao clicar em qualquer parte do sólido, o site mostra o nome dela (face, aresta, vértice, geratriz, apótema...) e a fórmula ligada a ela. Ao planificar, o sólido se abre na frente do aluno, e as áreas de cada peça se somam até formar a área total. Assim, as fórmulas deixam de ser algo decorado e passam a fazer sentido.

> Projeto desenvolvido como trabalho escolar, seguindo a metodologia ágil Scrum com Kanban no Trello.

---

## Funcionalidades

### Explorar
- **Visualização 3D** de seis sólidos, divididos entre **poliedros** (cubo, prisma e pirâmide) e **corpos redondos** (cilindro, cone e esfera)
- **Clique nas partes:** o nome aparece direto no 3D, com uma explicação e a fórmula correspondente
- **Planificação animada:** o cilindro desenrola e vira retângulo, o cone vira setor circular, e cada peça mostra a própria área
- **Medidas ajustáveis:** sliders para raio, altura e aresta, e botões para escolher o polígono da base do prisma e da pirâmide (do triângulo ao octógono)
- **Fórmulas ao vivo:** área e volume recalculados na hora, mostrando a conta com os números substituídos
- **Relação de Euler** conferida em cada poliedro
- **A esfera explica por que não pode ser planificada** (o mesmo motivo de todo mapa-múndi distorcer alguma coisa)

### Praticar
- **Encontre a parte:** o site pede, por exemplo, "toque na geratriz", e o aluno precisa achar no sólido
- **Faça a conta:** medidas sorteadas, o sólido no 3D já montado com elas e resolução passo a passo
- **66 questões no estilo ENEM** (11 por sólido), com situações do dia a dia, correção e explicação de cada resposta
- **Pontuação** e sequência de acertos salvas no navegador

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| [Next.js 14](https://nextjs.org) | Estrutura do site e rotas (App Router) |
| [React 18](https://react.dev) | Interface e interações |
| [three.js](https://threejs.org) | Renderização 3D, cliques nas partes e animações de planificação |
| CSS puro | Layout responsivo, modo claro e escuro |

Não há banco de dados: tudo roda no navegador.

---

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 18.17 ou mais novo.

```bash
# instalar as dependências
npm install

# rodar em modo de desenvolvimento
npm run dev
```

Abra **http://localhost:3000** no navegador.

Para gerar a versão de produção:

```bash
npm run build
npm start
```

---

## 📁 Estrutura

```
app/                    Páginas e rotas
  page.js               Página inicial
  laboratorio/          Página de cada sólido (/laboratorio/cubo, /laboratorio/cone...)
  globals.css           Estilos e cores

components/             Partes da interface
  Hero.js               Cubo que se monta na página inicial
  laboratorio/          Visualizador, painel de fórmulas e aba Praticar

lib/                    Lógica
  solidos.js            Fórmulas de cada sólido
  construtores.js       Geometria 3D e planificação
  viewer.js             Câmera, cliques e animações
  questoes.js           Questões da aba Praticar
```

---

## Equipe

| Maria Brandão | PO 
| Suzane Soares | Scrum Master
| Maria Luiza| Team 
| Alice Maciel | Team


**Protótipo no Figma:** [link do Figma]
**Site publicado:** [link da Vercel]

