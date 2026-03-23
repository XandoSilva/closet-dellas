// Arquivo: app/layout.tsx

import './globals.css';

export const metadata = {
  title: 'Closet Dellas | Moda Feminina Premium',
  description: 'Curadoria exclusiva das melhores tendências, unindo sofisticação e preço justo para mulheres reais.',
  openGraph: {
    title: 'Closet Dellas | Moda Feminina Premium',
    description: 'A elegância que você merece. Peças exclusivas selecionadas para o seu guarda-roupa.',
    url: 'https://closet-dellas.vercel.app/',
    siteName: 'Closet Dellas',
    images: [
      {
        url: 'https://res.cloudinary.com/dwnaedy9f/image/upload/v1774216251/Logo_ClosetDellas_sem_fundo_h4fvys.png',
        width: 1200,
        height: 630,
        alt: 'Logo Closet Dellas',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}