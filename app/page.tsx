'use client';

import { useState } from 'react';

// Componente para o Guia de Medidas
function ModalMedidas({ aberto, fechar }: { aberto: boolean, fechar: () => void }) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" onClick={fechar}>
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-4 right-4 text-[#611F3A]/40 hover:text-[#611F3A] text-xl">✕</button>
        <h2 className="text-2xl font-serif italic text-[#611F3A] mb-6 text-center">Guia de Medidas</h2>
        <table className="w-full text-left text-xs uppercase tracking-widest">
          <thead>
            <tr className="border-b border-[#D4AF37]/30 text-[#D4AF37]">
              <th className="py-3">Tamanho</th>
              <th className="py-3">Busto</th>
              <th className="py-3">Cintura</th>
            </tr>
          </thead>
          <tbody className="text-[#611F3A]">
            <tr className="border-b border-zinc-50"><td className="py-4 font-bold">P (38)</td><td>84-88cm</td><td>66-70cm</td></tr>
            <tr className="border-b border-zinc-50"><td className="py-4 font-bold">M (40)</td><td>92-96cm</td><td>74-78cm</td></tr>
            <tr className="border-b border-zinc-50"><td className="py-4 font-bold">G (42)</td><td>100-104cm</td><td>82-86cm</td></tr>
          </tbody>
        </table>
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

  const elogiosGosto = ["Escolha impecável! ✨", "Que bom gosto! ✨", "Essa peça vai realçar sua essência! ✨"];

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho([...carrinho, { ...produto, image: produto.imagens[0] }]);
    setNotificacao(elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)]);
    setTimeout(() => setNotificacao(""), 4000);
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  // FUNÇÃO DE FINALIZAÇÃO ATUALIZADA COM DDD 21
  const finalizarPedidoWhatsApp = () => {
    const foneWhatsApp = "5521971366354"; 
    let mensagem = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.nome}* - R$ ${item.preco.toFixed(2)}\n`;
    });
    
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*\n\n_Aguardo seu retorno para combinarmos os detalhes!_`;

    const url = `https://api.whatsapp.com/send?phone=${foneWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#E2AFC1] text-[#611F3A] font-sans relative overflow-x-hidden">
      
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />

      {/* NOTIFICAÇÃO */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 w-[85%] md:w-auto bg-white text-[#D4AF37] px-8 py-5 rounded-2xl shadow-2xl z-[9999] transform transition-all duration-500 border border-[#D4AF37]/30 ${notificacao ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-center italic font-serif">{notificacao}</p>
      </div>

      {/* Navegação */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-white/95 sticky top-0 z-[100] border-b border-[#611F3A]/10 shadow-sm">
        <h1 className="text-2xl md:text-4xl font-serif font-extrabold">Closet <span className="text-[#D4AF37] italic font-light">Dellas</span></h1>
        <button onClick={() => setCarrinhoAberto(true)} className="relative p-2 bg-[#611F3A]/5 rounded-full">
          <span className="text-2xl">👜</span>
          <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{carrinho.length}</span>
        </button>
      </nav>

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
                  <button onClick={() => adicionarAoCarrinho(produto)} className="bg-[#611F3A] text-[#D4AF37] py-3 rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold shadow-md">Adicionar à Sacola</button>
                  <button onClick={() => setGuiaAberto(true)} className="text-[9px] uppercase tracking-widest text-[#611F3A]/40 font-bold underline underline-offset-4">Guia de Medidas</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quem Somos */}
      <section className="bg-[#611F3A] py-24 px-6 text-center text-white mt-12">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-serif italic mb-8">Nossa Essência</h3>
          <p className="text-sm md:text-base font-light leading-relaxed mb-6 opacity-90">
            O <strong className="text-[#D4AF37]">Closet Dellas</strong> nasceu para vestir mulheres reais com elegância e sofisticação.
          </p>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
        </div>
      </section>

      {/* Carrinho Lateral */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[1000] transform transition-transform duration-500 p-8 ${carrinhoAberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 border-b border-[#611F3A]/10 pb-6">
          <h2 className="text-2xl font-serif italic text-[#611F3A]">Sua Sacola</h2>
          <button onClick={() => setCarrinhoAberto(false)} className="text-[10px] bg-[#E2AFC1]/20 px-4 py-2 rounded-full uppercase font-bold text-[#611F3A]">Fechar</button>
        </div>
        <div className="space-y-6 overflow-y-auto max-h-[60vh]">
          {carrinho.map((item, index) => (
            <div key={index} className="flex gap-4 border-b border-[#611F3A]/5 pb-4 items-center">
              <img src={item.image} className="w-16 h-20 object-cover rounded-md" />
              <div className="flex-1">
                <h4 className="text-[10px] uppercase font-bold text-[#611F3A]">{item.nome}</h4>
                <p className="text-sm font-serif italic text-[#D4AF37]">R$ {item.preco.toFixed(2)}</p>
              </div>
              <button onClick={() => setCarrinho(carrinho.filter((_, i) => i !== index))} className="p-2 text-[#611F3A]/20">✕</button>
            </div>
          ))}
        </div>
        {carrinho.length > 0 && (
          <div className="absolute bottom-8 left-8 right-8 bg-white pt-6 border-t border-[#D4AF37]/20">
            <div className="flex justify-between mb-6">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Total</span>
              <span className="font-serif italic text-3xl text-[#611F3A]">R$ {total.toFixed(2)}</span>
            </div>
            <button 
              onClick={finalizarPedidoWhatsApp}
              className="w-full bg-[#611F3A] text-white py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl transition-all active:scale-95"
            >
              Finalizar no WhatsApp
            </button>
          </div>
        )}
      </div>

      <footer className="py-20 text-center bg-white border-t border-[#611F3A]/5">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#611F3A]/40 font-bold italic underline decoration-[#D4AF37] underline-offset-8">© 2026 Closet Dellas</p>
      </footer>
    </main>
  );
}