import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: '64px 0' }}>
      <h1 style={{ fontFamily: 'var(--display)', fontStretch: '112%' }}>Página não encontrada</h1>
      <p>Esse endereço não existe. Volte para o início e escolha um sólido.</p>
      <Link className="btn" href="/">Ir para o início</Link>
    </main>
  );
}
