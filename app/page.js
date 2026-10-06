import Hero from '@/components/Hero';
import SolidTiles from '@/components/SolidTiles';

export default function Home() {
  return (
    <main className="wrap">
      <Hero />

      <section className="cat" id="poliedros">
        <div className="cat-head">
          <h2>Poliedros</h2>
          <p>Sólidos formados só por faces planas, e toda face é um polígono.</p>
        </div>
        <SolidTiles cat="poli" />
      </section>

      <section className="cat" id="redondos">
        <div className="cat-head">
          <h2>Corpos redondos</h2>
          <p>Sólidos com pelo menos uma superfície curva. Todos surgem ao girar uma figura plana em torno de um eixo.</p>
        </div>
        <SolidTiles cat="red" />
      </section>

      <footer className="foot">Dobra, um laboratório de geometria espacial. Medidas em centímetros.</footer>
    </main>
  );
}
