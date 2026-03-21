'use client';

import { useState } from 'react';

// --- DADOS DOS PRODUTOS (Para mimetizar a foto) ---
// Adicionei 3 fotos por produto para quando fizermos o carrossel depois
const produtos = [
  { id: 1, nome: "Vestido Midi Satin", preco: 289.90, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000" },
  { id: 2, nome: "Conjunto Alfaiataria Off-White", preco: 450.00, image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000" },
  { id: 3, nome: "Blazer Linho Premium", preco: 320.00, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000" },
  { id: 4, nome: "Macacão Pantalona Noite", preco: 389.90, image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1000" },
];

export default function Home() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [notificacao, setNotificacao] = useState("");

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho([...carrinho, produto]);
    setNotificacao(`✨ ${produto.nome} foi adicionado à sacola.`);
    setTimeout(() => setNotificacao(""), 3000);
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    // Layout Base (Fonte sans-serif limpa como na foto)
    <main className="min-h-screen bg-white text-zinc-800 font-sans relative overflow-x-hidden">
      
      {/* NOTIFICAÇÃO (Toast) */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-2xl z-[120] transform transition-all duration-500 ease-in-out ${notificacao ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <p className="text-sm uppercase tracking-widest font-bold text-[#611F3A]">
          {notificacao}
        </p>
      </div>

      {/* 5. Carrinho Lateral (Sacola) - Abre sobre a página */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out p-8 border-l border-zinc-100 ${carrinhoAberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 border-b border-zinc-50 pb-6">
          <h2 className="text-2xl font-serif italic text-zinc-900">Sua Sacola</h2>
          <button onClick={() => setCarrinhoAberto(false)} className="text-xs bg-zinc-100 px-4 py-2 rounded-full uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-all">Fechar</button>
        </div>

        {carrinho.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
             <p className="text-xs text-zinc-300 uppercase tracking-[0.3em]">Sacola vazia</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 overflow-y-auto max-h-[55vh] pr-2">
              {carrinho.map((item, index) => (
                <div key={index} className="flex gap-4 border-b border-zinc-50 pb-6 items-center">
                  <img src={item.image} className="w-20 h-24 object-cover bg-zinc-50 shadow-sm" />
                  <div className="flex-1">
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.1em] text-zinc-800">{item.nome}</h4>
                    <p className="text-sm font-serif italic text-[#D4AF37]">R$ {item.preco.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-8 left-8 right-8 bg-white pt-6">
              <div className="flex justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400">Total</span>
                <span className="font-serif italic text-2xl text-zinc-900">R$ {total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-zinc-900 text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-700 transition-all shadow-xl active:scale-95">
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>

      {/* Overlay do Carrinho */}
      {carrinhoAberto && <div onClick={() => setCarrinhoAberto(false)} className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-[2px]" />}


      {/* 1. NAVEGAÇÃO EXPANDIDA (Fundo Branco como na foto) */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-6 bg-white sticky top-0 z-50 border-b border-zinc-50 shadow-sm">
        {/* LOGO (Vinho Marsala da logo original) */}
        <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-[#611F3A]">
          Closet <span className="text-[#611F3A]/80 font-light italic">Dellas</span>
        </h1>
        
        <div className="flex items-center gap-6">
          {/* BOTÃO GUIA DE MEDIDAS (Novidade da Foto) */}
          <button className="hidden md:block text-[10px] bg-zinc-50 px-5 py-2.5 rounded-full uppercase tracking-[0.2em] font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all border border-zinc-100">
            Guia de Medidas
          </button>
          
          {/* SACOLA (Ao clicar, abre o carrinho lateral) */}
          <button onClick={() => setCarrinhoAberto(true)} className="relative p-2 text-zinc-900 hover:text-[#D4AF37] transition-colors active:scale-90">
            <span className="text-2xl">👜</span>
            <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {carrinho.length}
            </span>
          </button>
        </div>
      </nav>

      {/* 2. SEÇÃO HERO (Banner Sofisticado) */}
      <header className="px-6 md:px-16 py-24 bg-white border-b border-zinc-50 shadow-sm flex flex-col items-center">
        {/* Usando uma imagem sophisticated do Unsplash que mimetiza o estilo */}
        <div className="w-full max-w-7xl relative aspect-[21/9] bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100">
            <img 
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1500" 
                alt="Sofistication Closet Dellas" 
                className="w-full h-full object-cover"
            />
            {/* Texto e Botão sobre a foto */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center items-start p-10 md:p-20 bg-gradient-to-r from-black/80 to-transparent">
                <span className="text-[10px] uppercase tracking-[0.8em] text-[#D4AF37] mb-6 block font-bold">Nova Coleção</span>
                <h2 className="text-4xl md:text-6xl font-extralight text-white leading-tight mb-10">
                    A elegância <br /> que você <span className="italic font-serif">merece.</span>
                </h2>
                <button className="bg-white text-zinc-900 px-10 py-4 rounded-full text-xs uppercase tracking-[0.3em] font-bold hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl active:scale-95">
                    Conferir Lançamentos
                </button>
            </div>
        </div>
      </header>

      {/* 3. BARRA DE BENEFÍCIOS (Ícones da Foto) */}
      <section className="bg-zinc-50 py-10 px-6 md:px-16 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2"><span className="text-lg">🚚</span><p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">Frete Grátis acima de R$399</p></div>
            <div className="flex flex-col items-center gap-2"><span className="text-lg">💳</span><p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">Parcelamento em até 6x</p></div>
            <div className="flex flex-col items-center gap-2"><span className="text-lg">✨</span><p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">Curadoria Exclusiva</p></div>
            <div className="flex flex-col items-center gap-2"><span className="text-lg">🔒</span><p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">Compra Segura</p></div>
        </div>
      </section>

      {/* 4. VITRINE DE PRODUTOS ("Nossos Destaques") */}
      <section className="max-w-7xl mx-auto py-20 px-8">
        {/* Título da Seção como na foto (serif e Vinho) */}
        <h3 className="text-3xl font-serif italic text-[#611F3A] mb-12 border-b border-zinc-50 pb-4">
            Nossos Destaques
        </h3>

        {/* Grade de 4 colunas (Novidade da Foto) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {produtos.map((produto) => (
            <div key={produto.id} className="group flex flex-col bg-white border border-zinc-50 shadow-sm rounded-lg overflow-hidden transition-all hover:shadow-2xl">
              {/* Imagem do Produto */}
              <div className="aspect-[3/4] w-full bg-zinc-50 overflow-hidden relative">
                <img src={produto.image} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-[1s]" />
                {/* Etiqueta de Novidade (Dourado da Logo) */}
                <span className="absolute top-4 left-4 text-[9px] bg-[#D4AF37] text-white px-3 py-1.5 rounded-full uppercase tracking-widest font-bold">
                    Novidade
                </span>
              </div>
              
              {/* Detalhes do Produto */}
              <div className="p-6 text-center flex-1 flex flex-col">
                <h4 className="text-[10px] uppercase tracking-[0.3em] mb-4 font-semibold text-zinc-400 group-hover:text-zinc-900 transition-colors flex-1">{produto.nome}</h4>
                <p className="text-zinc-900 font-serif italic text-2xl mb-6">R$ {produto.preco.toFixed(2)}</p>
                {/* Botão Vinho Marsala da Logo */}
                <button 
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="w-full bg-[#611F3A] text-white py-3.5 text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-[#D4AF37] hover:text-white transition-all shadow-md active:scale-95"
                >
                  Adicionar à Sacola
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SEÇÃO "NOSSA ESSÊNCIA" (Rodapé Informativo da Foto) */}
      <section className="bg-zinc-50 py-20 px-8 text-center border-t border-zinc-100 mt-20">
        <div className="max-w-xl mx-auto">
            <h3 className="text-2xl font-serif italic text-zinc-900 mb-6">Nossa Essência</h3>
            <p className="text-sm font-light text-zinc-500 leading-relaxed mb-6">
                O Closet Dellas nasceu da paixão por vestir mulheres reais com elegância e sofisticação. Nossa curadoria é feita a dedo para que cada peça conte uma história e realce a beleza única que existe em você.
            </p>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto opacity-30"></div>
        </div>
      </section>

      {/* RODAPÉ FINAL */}
      <footer className="py-20 text-center bg-white border-t border-zinc-100">
        <p className="text-[10px] uppercase tracking-[0.6em] text-zinc-300 font-bold italic">
          © 2026 Closet Dellas • Boutique de Luxo
        </p>
        <div className="flex gap-4 justify-center mt-6 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">
            <a href="#" className="hover:text-zinc-900">Termos</a>
            <a href="#" className="hover:text-zinc-900">Política</a>
            <a href="#" className="hover:text-zinc-900">FAQ</a>
        </div>
      </footer>
    </main>
  );
}