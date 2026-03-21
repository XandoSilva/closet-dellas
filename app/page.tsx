'use client';

import { useState } from 'react';

// Componente para carrossel de fotos do produto
function CarrosselProduto({ imagens, nome }: { imagens: string[], nome: string }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const proximaFoto = () => setFotoAtual((prev) => (prev + 1 === imagens.length ? 0 : prev + 1));
  const fotoAnterior = () => setFotoAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-white mb-6 border border-[#611F3A]/10 shadow-sm rounded-sm group/carrossel">
      <div className="flex h-full w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${fotoAtual * 100}%)` }}>
        {imagens.map((img, index) => (
          <img key={index} src={img} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" />
        ))}
      </div>
      {imagens.length > 1 && (
        <>
          <button onClick={fotoAnterior} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] p-3 rounded-full text-xs font-bold md:opacity-0 md:group-hover/carrossel:opacity-100 transition-opacity">❮</button>
          <button onClick={proximaFoto} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] p-3 rounded-full text-xs font-bold md:opacity-0 md:group-hover/carrossel:opacity-100 transition-opacity">❯</button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/10 rounded-full backdrop-blur-sm">
            {imagens.map((_, index) => (
              <button key={index} onClick={() => setFotoAtual(index)} className={`w-1.5 h-1.5 rounded-full transition-all ${index === fotoAtual ? 'bg-[#D4AF37] scale-125' : 'bg-white/60'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [notificacao, setNotificacao] = useState("");

  const produtos = [
    { id: 1, nome: "Vestido Midi Satin", preco: 289.90, imagens: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000", "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000"] },
    { id: 2, nome: "Conjunto Alfaiataria Off-White", preco: 450.00, imagens: ["https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000", "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000"] },
    { id: 3, nome: "Blazer Linho Premium", preco: 320.00, imagens: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000", "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=1000", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000"] },
  ];

  // AS 10 FRASES RANDÔMICAS
  const elogiosGosto = [
    "Escolha impecável! Essa peça exala sofisticação.",
    "Que bom gosto! Você acaba de escolher um ícone de elegância.",
    "Combinação perfeita: o Closet Dellas e o seu estilo único.",
    "Essa peça foi feita para quem não abre mão da classe.",
    "Pura elegância! Seu olhar para a moda é surpreendente.",
    "Um toque de luxo para o seu closet. Escolha maravilhosa!",
    "Você tem um faro incrível para tendências atemporais.",
    "Essa peça vai realçar ainda mais a sua essência.",
    "Simplesmente deslumbrante! Uma escolha digna de elogios.",
    "Estilo é saber quem você é, e sua escolha diz tudo!"
  ];

  const adicionarAoCarrinho = (produto: any) => {
    const produtoSimplificado = { ...produto, image: produto.imagens[0] };
    setCarrinho([...carrinho, produtoSimplificado]);
    
    // Sorteia uma frase da lista
    const fraseSorteada = elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)];
    setNotificacao(fraseSorteada);
    
    setTimeout(() => setNotificacao(""), 4000);
  };

  const removerDoCarrinho = (indexParaRemover: number) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    <main className="min-h-screen bg-[#E2AFC1] text-[#611F3A] font-sans relative overflow-x-hidden">
      
      {/* NOTIFICAÇÃO MELHORADA */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 w-[85%] md:w-auto bg-white/95 backdrop-blur-md text-[#D4AF37] px-8 py-5 rounded-2xl shadow-2xl z-[9999] transform transition-all duration-500 border border-[#D4AF37]/30 ${notificacao ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-center italic leading-relaxed">
          ✨ {notificacao}
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-white/95 sticky top-0 z-[100] border-b border-[#611F3A]/10">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-serif font-extrabold leading-none">
            Closet <span className="text-[#D4AF37] italic">Dellas</span>
          </h1>
          <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-[#611F3A]/60">Elegância em cada detalhe</span>
        </div>
        <button onClick={() => setCarrinhoAberto(true)} className="relative p-2 bg-[#611F3A]/5 rounded-full">
          <span className="text-2xl">👜</span>
          <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{carrinho.length}</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="bg-white px-6 py-16 md:py-24 text-center border-b border-[#611F3A]/5">
        <span className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold mb-4 block underline underline-offset-8">Curadoria Exclusiva</span>
        <h2 className="text-4xl md:text-7xl font-extralight text-[#611F3A] mb-8 leading-tight">Sua essência,<br /><span className="italic font-serif text-[#D4AF37]">seu estilo.</span></h2>
      </section>

      {/* Vitrine */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {produtos.map((produto) => (
            <div key={produto.id} className="flex flex-col group">
              <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
              <div className="text-center">
                <h4 className="text-[11px] uppercase tracking-widest mb-2 font-semibold text-[#611F3A]/60">{produto.nome}</h4>
                <p className="text-[#611F3A] font-serif italic text-3xl mb-4">R$ {produto.preco.toFixed(2)}</p>
                <button 
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="bg-[#611F3A] text-[#D4AF37] px-6 py-3 rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold shadow-md active:scale-95 transition-all w-full md:w-auto"
                >
                  Adicionar à Sacola
                </button>
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
              <button onClick={() => removerDoCarrinho(index)} className="p-2 text-[#611F3A]/30">✕</button>
            </div>
          ))}
        </div>
        {carrinho.length > 0 && (
          <div className="absolute bottom-8 left-8 right-8 bg-white pt-6 border-t border-[#D4AF37]/20">
            <div className="flex justify-between mb-6">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Total</span>
              <span className="font-serif italic text-3xl">R$ {total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#611F3A] text-white py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl active:scale-95 transition-all">
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