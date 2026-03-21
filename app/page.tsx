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

  // FUNÇÃO PARA ENVIAR PARA O WHATSAPP
  const finalizarPedidoWhatsApp = () => {
    const foneWhatsApp = "5521971366354"; // <-- COLOQUE SEU NÚMERO AQUI (Ex: 55 + DDD + Numero)
    
    let mensagem = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.nome}* - R$ ${item.preco.toFixed(2)}\n`;
    });
    
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*\n\n_Aguardo o retorno para combinar o pagamento e entrega._`;

    const url = `https://api.whatsapp.com/send?phone=${foneWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    <main className="min-h-screen bg-[#E2AFC1] text-[#611F3A] font-sans relative overflow-x-hidden">
      
      {/* NOTIFICAÇÃO */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 bg-white text-[#D4AF37] px-8 py-4 rounded-full shadow-2xl z-[120] transform transition-all duration-700 ease-in-out border border-[#D4AF37]/20 ${notificacao ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <p className="text-[11px] uppercase tracking-[0.2em] font-bold whitespace-nowrap italic">
           ✨ {notificacao}
        </p>
      </div>

      {/* Carrinho Lateral */}
      <div className={`fixed top-0 right-0 h-full w-85 bg-white text-[#611F3A] shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out p-8 border-l border-[#611F3A]/10 ${carrinhoAberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 border-b border-[#611F3A]/10 pb-6">
          <h2 className="text-2xl font-serif italic uppercase tracking-tighter text-[#611F3A]">Sua Sacola</h2>
          <button onClick={() => setCarrinhoAberto(false)} className="text-[10px] bg-[#E2AFC1]/30 px-4 py-2 rounded-full uppercase tracking-widest text-[#611F3A]/60">Fechar</button>
        </div>

        {carrinho.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
             <p className="text-xs text-[#611F3A]/30 uppercase tracking-[0.3em]">Sacola vazia</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 overflow-y-auto max-h-[55vh] pr-2">
              {carrinho.map((item, index) => (
                <div key={index} className="flex gap-4 border-b border-[#611F3A]/5 pb-6 items-center">
                  <img src={item.image} className="w-20 h-24 object-cover border border-zinc-100" />
                  <div className="flex-1">
                    <h4 className="text-[10px] uppercase font-bold text-[#611F3A]">{item.nome}</h4>
                    <p className="text-sm font-serif italic text-[#D4AF37]">R$ {item.preco.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removerDoCarrinho(index)} className="text-[#611F3A]/20 hover:text-[#611F3A] transition-colors p-2">✕</button>
                </div>
              ))}
            </div>

            <div className="absolute bottom-8 left-8 right-8 bg-white pt-6 border-t border-[#D4AF37]/20">
              <div className="flex justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#611F3A]/60">Total</span>
                <span className="font-serif italic text-3xl text-[#611F3A]">R$ {total.toFixed(2)}</span>
              </div>
              <button 
                onClick={finalizarPedidoWhatsApp}
                className="w-full bg-[#611F3A] text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#D4AF37] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Finalizar via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex flex-col md:flex-row justify-between items-center p-8 bg-white/95 backdrop-blur-sm border-b border-[#611F3A]/10 sticky top-0 z-50">
        <h1 className="text-4xl font-serif tracking-tighter font-extrabold text-[#611F3A]">
          Closet <span className="text-[#611F3A]/80 font-light italic text-3xl">Dellas</span>
        </h1>
        <div className="flex space-x-10 text-[10px] uppercase tracking-[0.3em] font-bold text-[#611F3A]/60">
          <a href="#" className="hover:text-[#611F3A] transition-colors">Novidades</a>
          <a href="#" className="hover:text-[#611F3A] transition-colors">Vestidos</a>
          <a href="#" className="hover:text-[#611F3A] transition-colors">Acessórios</a>
        </div>
        <button onClick={() => setCarrinhoAberto(true)} className="relative p-2 text-[#611F3A] hover:text-[#D4AF37] transition-colors">
          <span className="text-2xl">👜</span>
          <span className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {carrinho.length}
          </span>
        </button>
      </nav>

      {/* Header */}
      <header className="h-[30vh] flex flex-col items-center justify-center px-6 text-center bg-white">
        <span className="text-[10px] uppercase tracking-[1em] text-[#611F3A]/40 mb-4 block font-bold italic">Boutique Exclusiva</span>
        <h2 className="text-5xl font-extralight text-[#611F3A]">Sua essência, seu estilo.</h2>
      </header>

      {/* Vitrine */}
      <section className="max-w-7xl mx-auto py-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {produtos.map((produto) => (
            <div key={produto.id} className="group flex flex-col items-center">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white mb-8 border border-[#611F3A]/10 shadow-sm transition-all group-hover:border-[#D4AF37]/50">
                <img src={produto.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <button 
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="absolute bottom-0 left-0 right-0 bg-[#611F3A] text-[#D4AF37] py-6 text-[9px] uppercase tracking-[0.4em] font-bold translate-y-full group-hover:translate-y-0 transition-all duration-500 hover:bg-[#D4AF37] hover:text-white"
                >
                  Adicionar à Sacola
                </button>
              </div>
              <div className="text-center">
                <h4 className="text-[11px] uppercase tracking-[0.3em] mb-4 font-semibold text-[#611F3A]/40 group-hover:text-[#611F3A]">{produto.nome}</h4>
                <p className="text-[#611F3A] font-serif italic text-3xl">R$ {produto.preco.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-24 text-center border-t border-[#611F3A]/5 bg-white">
        <p className="text-[10px] uppercase tracking-[0.8em] text-[#611F3A]/40 font-bold italic underline decoration-[#D4AF37] underline-offset-8">
          © 2026 Closet Dellas
        </p>
      </footer>
    </main>
  );
}