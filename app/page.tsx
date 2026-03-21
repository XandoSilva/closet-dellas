'use client';

import { useState } from 'react';

// Componente para o Guia de Medidas (Janela Modal)
function ModalMedidas({ aberto, fechar }: { aberto: boolean, fechar: () => void }) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" onClick={fechar}>
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-4 right-4 text-[#611F3A]/40 hover:text-[#611F3A] text-xl">✕</button>
        <h2 className="text-2xl font-serif italic text-[#611F3A] mb-6 text-center">Guia de Medidas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-widest border-collapse">
            <thead>
              <tr className="border-b border-[#D4AF37]/30 text-[#D4AF37]">
                <th className="py-3">Tamanho</th>
                <th className="py-3">Busto</th>
                <th className="py-3">Cintura</th>
                <th className="py-3">Quadril</th>
              </tr>
            </thead>
            <tbody className="text-[#611F3A]">
              <tr className="border-b border-zinc-50">
                <td className="py-4 font-bold">P (36/38)</td>
                <td>84-88cm</td>
                <td>66-70cm</td>
                <td>94-98cm</td>
              </tr>
              <tr className="border-b border-zinc-50">
                <td className="py-4 font-bold">M (40/42)</td>
                <td>92-96cm</td>
                <td>74-78cm</td>
                <td>102-106cm</td>
              </tr>
              <tr className="border-b border-zinc-50">
                <td className="py-4 font-bold">G (44)</td>
                <td>100-104cm</td>
                <td>82-86cm</td>
                <td>110-114cm</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-[10px] text-zinc-400 text-center italic">
          * As medidas podem variar levemente dependendo do tecido da peça.
        </p>
      </div>
    </div>
  );
}

// Componente para carrossel de fotos
function CarrosselProduto({ imagens, nome }: { imagens: string[], nome: string }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const proximaFoto = () => setFotoAtual((prev) => (prev + 1 === imagens.length ? 0 : prev + 1));
  const fotoAnterior = () => setFotoAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-white mb-6 border border-[#611F3A]/10 shadow-sm rounded-sm group/carrossel">
      <div className="flex h-full w-full transition-transform duration-500" style={{ transform: `translateX(-${fotoAtual * 100}%)` }}>
        {imagens.map((img, index) => (
          <img key={index} src={img} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" />
        ))}
      </div>
      {imagens.length > 1 && (
        <>
          <button onClick={fotoAnterior} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] p-3 rounded-full text-xs">❮</button>
          <button onClick={proximaFoto} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] p-3 rounded-full text-xs">❯</button>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [notificacao, setNotificacao] = useState("");

  const produtos = [
    { id: 1, nome: "Vestido Midi Satin", preco: 289.90, imagens: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000", "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000"] },
    { id: 2, nome: "Conjunto Alfaiataria Off-White", preco: 450.00, imagens: ["https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000", "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000"] },
    { id: 3, nome: "Blazer Linho Premium", preco: 320.00, imagens: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000", "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=1000", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000"] },
  ];

  const elogiosGosto = [
    "Escolha impecável! Essa peça exala sofisticação.",
    "Que bom gosto! Você escolheu um ícone de elegância.",
    "Combinação perfeita: o Closet Dellas e o seu estilo.",
    "Pura elegância! Seu olhar para a moda é surpreendente.",
    "Essa peça vai realçar ainda mais a sua essência."
  ];

  const adicionarAoCarrinho = (produto: any) => {
    const produtoSimplificado = { ...produto, image: produto.imagens[0] };
    setCarrinho([...carrinho, produtoSimplificado]);
    const frase = elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)];
    setNotificacao(frase);
    setTimeout(() => setNotificacao(""), 4000);
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    <main className="min-h-screen bg-[#E2AFC1] text-[#611F3A] font-sans relative overflow-x-hidden">
      
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />

      {/* NOTIFICAÇÃO */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 w-[85%] md:w-auto bg-white/95 backdrop-blur-md text-[#D4AF37] px-8 py-5 rounded-2xl shadow-2xl z-[9999] transform transition-all duration-500 border border-[#D4AF37]/30 ${notificacao ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-center italic">✨ {notificacao}</p>
      </div>

      {/* Navegação */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-white/95 sticky top-0 z-[100] border-b border-[#611F3A]/10 shadow-sm">
        <h1 className="text-2xl md:text-4xl font-serif font-extrabold">
          Closet <span className="text-[#D4AF37] italic">Dellas</span>
        </h1>
        <button onClick={() => setCarrinhoAberto(true)} className="relative p-2 bg-[#611F3A]/5 rounded-full">
          <span className="text-2xl">👜</span>
          <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{carrinho.length}</span>
        </button>
      </nav>

      {/* Hero */}
      <section className="bg-white px-6 py-12 text-center border-b border-[#611F3A]/5">
        <span className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold mb-4 block underline underline-offset-8">Curadoria Exclusiva</span>
        <h2 className="text-4xl md:text-6xl font-extralight text-[#611F3A] mb-8 leading-tight">Sua essência, <span className="italic font-serif text-[#D4AF37]">seu estilo.</span></h2>
      </section>

      {/* Vitrine */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {produtos.map((produto) => (
            <div key={produto.id} className="flex flex-col group">
              <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
              <div className="text-center">
                <h4 className="text-[11px] uppercase tracking-widest mb-2 font-semibold text-[#611F3A]/60">{produto.nome}</h4>
                <p className="text-[#611F3A] font-serif italic text-2xl mb-4">R$ {produto.preco.toFixed(2)}</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => adicionarAoCarrinho(produto)} className="bg-[#611F3A] text-[#D4AF37] py-3 rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold shadow-md active:scale-95 transition-all">
                    Adicionar à Sacola
                  </button>
                  <button onClick={() => setGuiaAberto(true)} className="text-[9px] uppercase tracking-widest text-[#611F3A]/40 hover:text-[#611F3A] transition-colors font-bold underline underline-offset-4">
                    Guia de Medidas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Carrinho Lateral */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[1000] transform transition-transform duration-500 p-8 ${carrinhoAberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 border-b border-[#611F3A]/10 pb-6">
          <h2 className="text-2xl font-serif italic text-[#611F3A]">Sua Sacola</h2>
          <button onClick={() => setCarrinhoAberto(false)} className="text-[10px] bg-[#E2AFC1]/20 px-4 py-2 rounded-full uppercase font-bold">Fechar</button>
        </div>
        <div className="space-y-6 overflow-y-auto max-h-[60vh]">
          {carrinho.map((item, index) => (
            <div key={index} className="flex gap-4 border-b border-[#611F3A]/5 pb-4 items-center">
              <img src={item.image} className="w-16 h-20 object-cover rounded-md" />
              <div className="flex-1">
                <h4 className="text-[10px] uppercase font-bold">{item.nome}</h4>
                <p className="text-sm font-serif italic text-[#D4AF37]">R$ {item.preco.toFixed(2)}</p>
              </div>
              <button onClick={() => setCarrinho(carrinho.filter((_, i) => i !== index))} className="p-2 text-[#611F3A]/30">✕</button>
            </div>
          ))}
        </div>
        {carrinho.length > 0 && (
          <div className="absolute bottom-8 left-8 right-8 bg-white pt-6 border-t border-[#D4AF37]/20">
            <div className="flex justify-between mb-6">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Total</span>
              <span className="font-serif italic text-3xl">R$ {total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#611F3A] text-white py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl">
              Finalizar no WhatsApp
            </button>
          </div>
        )}
      </div>

      <footer className="py-20 text-center bg-white border-t border-[#611F3A]/5">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#611F3A]/40 font-bold italic">© 2026 Closet Dellas</p>
      </footer>
    </main>
  );
}