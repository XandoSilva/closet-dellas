'use client';

import { useState } from 'react';

export default function Home() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [notificacao, setNotificacao] = useState("");

  const produtos = [
    { id: 1, nome: "Vestido Midi Satin", preco: 289.90, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000" },
    { id: 2, nome: "Conjunto Alfaiataria Off-White", preco: 450.00, image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000" },
    { id: 3, nome: "Blazer Linho Premium", preco: 320.00, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000" },
  ];

  const elogios = [
    "Sua escolha reflete pura sofisticação.",
    "Que bom gosto! Essa peça é ícone de elegância.",
    "Combinação perfeita: o Closet Dellas e sua atitude.",
    "Elegância que define a sua essência.",
    "Um Closet Dellas é feito de escolhas como essa.",
  ];

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho([...carrinho, produto]);
    const elogioAleatorio = elogios[Math.floor(Math.random() * elogios.length)];
    setNotificacao(elogioAleatorio);
    setTimeout(() => setNotificacao(""), 3500);
  };

  const removerDoCarrinho = (indexParaRemover: number) => {
    const novoCarrinho = carrinho.filter((_, index) => index !== indexParaRemover);
    setCarrinho(novoCarrinho);
  };

  const finalizarPedidoWhatsApp = () => {
    const foneWhatsApp = "5521999999999"; 
    let mensagem = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.nome}* - R$ ${item.preco.toFixed(2)}\n`;
    });
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;
    const url = `https://api.whatsapp.com/send?phone=${foneWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    <main className="min-h-screen bg-[#E2AFC1] text-[#611F3A] font-sans relative overflow-x-hidden">
      
      {/* NOTIFICAÇÃO (TOAST) - AJUSTADA PARA MOBILE */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 w-[85%] md:w-auto bg-white/95 backdrop-blur-md text-[#D4AF37] px-6 py-5 rounded-2xl shadow-[0_20px_50px_rgba(97,31,58,0.3)] z-[9999] transform transition-all duration-500 border border-[#D4AF37]/30 ${notificacao ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        <p className="text-[11px] md:text-[12px] uppercase tracking-[0.1em] font-bold text-center italic leading-tight">
           ✨ {notificacao}
        </p>
      </div>

      {/* Carrinho Lateral */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-85 bg-white text-[#611F3A] shadow-2xl z-[1000] transform transition-transform duration-500 p-8 ${carrinhoAberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 border-b border-[#611F3A]/10 pb-6">
          <h2 className="text-xl font-serif italic uppercase tracking-tighter">Sua Sacola</h2>
          <button onClick={() => setCarrinhoAberto(false)} className="text-[10px] bg-[#E2AFC1]/30 px-4 py-2 rounded-full uppercase">Fechar</button>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[60vh]">
          {carrinho.map((item, index) => (
            <div key={index} className="flex gap-4 border-b border-[#611F3A]/5 pb-4 items-center">
              <img src={item.image} className="w-16 h-20 object-cover border border-zinc-100" />
              <div className="flex-1">
                <h4 className="text-[9px] uppercase font-bold">{item.nome}</h4>
                <p className="text-sm font-serif italic text-[#D4AF37]">R$ {item.preco.toFixed(2)}</p>
              </div>
              <button onClick={() => removerDoCarrinho(index)} className="p-2 text-[#611F3A]/30">✕</button>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-8 right-8 bg-white pt-6 border-t border-[#D4AF37]/20">
          <div className="flex justify-between mb-6">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Total</span>
            <span className="font-serif italic text-2xl">R$ {total.toFixed(2)}</span>
          </div>
          <button onClick={finalizarPedidoWhatsApp} className="w-full bg-[#611F3A] text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold active:bg-[#D4AF37] transition-colors">
            Finalizar via WhatsApp
          </button>
        </div>
      </div>

      {/* Overlay */}
      {carrinhoAberto && <div onClick={() => setCarrinhoAberto(false)} className="fixed inset-0 bg-[#611F3A]/60 z-[900] backdrop-blur-[2px]" />}

      {/* Navegação */}
      <nav className="flex justify-between items-center p-6 md:p-8 bg-white/95 sticky top-0 z-[100] border-b border-[#611F3A]/10">
        <h1 className="text-2xl md:text-4xl font-serif font-extrabold">
          Closet <span className="text-[#D4AF37] italic">Dellas</span>
        </h1>
        <button onClick={() => setCarrinhoAberto(true)} className="relative p-2">
          <span className="text-2xl">👜</span>
          <span className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {carrinho.length}
          </span>
        </button>
      </nav>

      {/* Vitrine */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {produtos.map((produto) => (
            <div key={produto.id} className="flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white mb-6 border border-[#611F3A]/10 shadow-sm">
                <img src={produto.image} className="w-full h-full object-cover" />
                <button 
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="absolute bottom-0 left-0 right-0 bg-[#611F3A] text-[#D4AF37] py-5 text-[10px] uppercase tracking-[0.2em] font-bold md:translate-y-full md:hover:translate-y-0 transition-all duration-300 active:bg-[#D4AF37] active:text-white"
                >
                  Adicionar à Sacola
                </button>
              </div>
              <div className="text-center">
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold text-[#611F3A]/60">{produto.nome}</h4>
                <p className="text-[#611F3A] font-serif italic text-2xl">R$ {produto.preco.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-20 text-center bg-white">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#611F3A]/40 font-bold italic">© 2026 Closet Dellas</p>
      </footer>
    </main>
  );
}