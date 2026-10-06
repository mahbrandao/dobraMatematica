import Laboratorio from '@/components/laboratorio/Laboratorio';

// O laboratório fica no layout para o 3D não ser recriado ao trocar de sólido.
export default function LaboratorioLayout({ children }) {
  return (
    <>
      <Laboratorio />
      {children}
    </>
  );
}
