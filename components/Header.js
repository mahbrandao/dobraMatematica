import Link from 'next/link';

export default function Header() {
  return (
    <header className="topbar">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Dobra, página inicial">
          <svg className="ico" viewBox="-1 -1 20 26" aria-hidden="true">
            <path className="fb" d="M6 0h6v6H6z" />
            <path className="fy" d="M6 6h6v6H6z" />
            <path className="fb" d="M6 12h6v6H6z" />
            <path className="fy" d="M6 18h6v6H6z" />
            <path className="fb" d="M0 6h6v6H0z" />
            <path className="fb" d="M12 6h6v6h-6z" />
          </svg>
          <span>Dobra</span>
        </Link>
        <nav className="topnav" aria-label="Tipos de sólido">
          <Link href="/#poliedros">Poliedros</Link>
          <Link href="/#redondos">Corpos redondos</Link>
        </nav>
      </div>
    </header>
  );
}
