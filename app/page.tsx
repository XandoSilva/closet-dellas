'use client';

import { useState } from 'react';

// --- COMPONENTES AUXILIARES ---

function ModalMedidas({ aberto, fechar }: { aberto: boolean, fechar: () => void }) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" onClick={fechar}>
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-4 right-4 text-[#611F3A]/40 hover:text-[#611F3A] text-xl">✕</button>
        <h2 className="text-2xl font-serif italic text-[#611F3A] mb-6 text-center">Guia de Medidas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] md:text-xs uppercase tracking-widest border-collapse">
            <thead>
              <tr className="border-b border-[#D4AF37]/30 text-[#D4AF37]">
                <th className="py-3">Tamanho</th>
                <th className="py-3">Busto</th>
                <th className="py-3">Cintura</th>
                <th className="py-3">Quadril</th>
              </tr>
            </thead>
            <tbody className="text-[#611F3A]">
              <tr className="border-b border-zinc-50"><td className="py-4 font-bold">P (36/38)</td><td>84-88cm</td><td>66-70cm</td><td>94-98cm</td></tr>
              <tr className="border-b border-zinc-50"><td className="py-4 font-bold">M (40/42)</td><td>92-96cm</td><td>74-78cm</td><td>102-106cm</td></tr>
              <tr className="border-b border-zinc-50"><td className="py-4 font-bold">G (44)</td><td>100-104cm</td><td>82-86cm</td><td>110-114cm</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-[9px] text-zinc-400 text-center italic">* Medidas aproximadas para auxiliar sua escolha.</p>
      </div>
    </div>
  );
}

function CarrosselProduto({ imagens, nome }: { imagens: string[], nome: string }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const proximaFoto = () => setFotoAtual((prev) => (prev + 1 === imagens.length ? 0 : prev + 1));
  const fotoAnterior = () => setFotoAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 rounded-md group/carrossel">
      <div className="flex h-full w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${fotoAtual * 100}%)` }}>
        {imagens.map((img, index) => (
          <img key={index} src={img} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" />
        ))}
      </div>
      {imagens.length > 1 && (
        <>
          <button onClick={fotoAnterior} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] p-2 rounded-full text-xs font-bold opacity-0 group-hover/carrossel:opacity-100 transition-opacity hover:bg-white shadow-sm">❮</button>
          <button onClick={proximaFoto} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] p-2 rounded-full text-xs font-bold opacity-0 group-hover/carrossel:opacity-100 transition-opacity hover:bg-white shadow-sm">❯</button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 rounded-full backdrop-blur-sm">
            {imagens.map((_, index) => (
              <button key={index} onClick={() => setFotoAtual(index)} className={`w-1.5 h-1.5 rounded-full transition-all ${index === fotoAtual ? 'bg-white scale-125' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Notificacao({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-white/95 backdrop-blur-md text-[#D4AF37] px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(97,31,58,0.2)] z-[9999] transform transition-all duration-500 border border-[#D4AF37]/30 animate-in fade-in slide-in-from-top-4">
      <p className="text-xs uppercase tracking-widest font-bold text-center italic font-serif leading-tight">✨ {mensagem}</p>
    </div>
  );
}

function SacolaLateral({ aberto, fechar, carrinho, remover, finalizar }: { aberto: boolean, fechar: () => void, carrinho: any[], remover: (idx: number) => void, finalizar: () => void }) {
  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[1000] transform transition-transform duration-500 flex flex-col ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 bg-[#611F3A] text-white">
          <h2 className="text-xl font-serif italic">Sua Sacola</h2>
          <button onClick={fechar} className="text-white/60 hover:text-white text-lg">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {carrinho.map((item, index) => (
            <div key={index} className="flex gap-4 border-b border-zinc-100 pb-4 items-center">
              <img src={item.image} className="w-16 h-20 object-cover rounded shadow-sm" />
              <div className="flex-1">
                <h4 className="text-[10px] uppercase font-bold text-zinc-800">{item.nome}</h4>
                <p className="text-sm font-serif italic text-[#611F3A] mt-1">R$ {item.preco.toFixed(2)}</p>
              </div>
              <button onClick={() => remover(index)} className="p-2 text-zinc-300 hover:text-[#611F3A]">✕</button>
            </div>
          ))}
          {carrinho.length === 0 && <p className="text-center text-xs text-zinc-400 py-10 uppercase tracking-widest">Sacola vazia</p>}
        </div>

        {carrinho.length > 0 && (
          <div className="p-6 bg-[#611F3A] text-white">
            <div className="flex justify-between mb-6 items-center">
              <span className="text-[11px] uppercase font-bold text-white/70 tracking-widest">Total</span>
              <span className="font-serif italic text-2xl">R$ {total.toFixed(2)}</span>
            </div>
            <button onClick={finalizar} className="w-full bg-white text-[#611F3A] py-4 rounded text-[11px] uppercase tracking-[0.2em] font-bold shadow-lg hover:bg-[#D4AF37] hover:text-white transition-colors">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
      {aberto && <div onClick={fechar} className="fixed inset-0 bg-black/50 z-[900] backdrop-blur-[2px]" />}
    </>
  );
}

// --- COMPONENTE PRINCIPAL ---

export default function Home() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [notificacao, setNotificacao] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState('vestidos');

  // Categorias baseadas nas fotos de referência + subcategorias
  const categoriasBase = [
    { id: 'vestidos', label: 'VESTIDOS', subs: ['Longo', 'Midi', 'Curto'] },
    { id: 'saia', label: 'SAIA', subs: ['Midi', 'Curta', 'Plissada'] },
    { id: 'conjuntos', label: 'CONJUNTOS', subs: ['Alfaiataria', 'Linho', 'Moletom'] },
    { id: 'blusas', label: 'BLUSAS', subs: ['Camisas', 'T-shirts', 'Tricô'] },
    { id: 'cropped', label: 'CROPPED', subs: ['Renda', 'Manga Longa', 'Básico'] },
    { id: 'macacoes', label: 'MACACÕES', subs: ['Longo', 'Pantacourt'] },
    { id: 'calcas', label: 'CALÇAS', subs: ['Pantalona', 'Alfaiataria', 'Jeans'] },
    { id: 'shorts', label: 'SHORTS', subs: ['Linho', 'Jeans', 'Couro'] },
  ];

  const gerarProdutos = () => {
    const listaProdutos: any[] = [];
    categoriasBase.forEach((cat, catIndex) => {
      // Gerando 4 produtos por categoria para preencher a grade do layout
      for (let i = 1; i <= 4; i++) {
        listaProdutos.push({
          id: `${cat.id}-${i}`,
          nome: `${cat.label.charAt(0) + cat.label.slice(1).toLowerCase()} Exclusivo ${i}`,
          categoria: cat.id,
          preco: 250 + i * 15,
          imagens: [
            `https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&h=800&fit=crop&sig=${catIndex * 10 + i}-1`,
            `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=800&fit=crop&sig=${catIndex * 10 + i}-2`,
            `https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=600&h=800&fit=crop&sig=${catIndex * 10 + i}-3`,
          ],
        });
      }
    });
    return listaProdutos;
  };
  const todosProdutos = gerarProdutos();

  // Exatamente o trecho solicitado sem a palavra "elegância"
  const elogiosGosto = [
    "Escolha impecável! Essa peça exala sofisticação.",
    "Combinação perfeita: o Closet Dellas e o seu estilo único.",
    "Essa peça foi feita para quem não abre mão da classe.",
    "Um toque de luxo para o seu closet. Escolha maravilhosa!",
    "Essa peça vai realçar ainda mais a sua essência.",
    "Simplesmente deslumbrante! Uma escolha digna de elogios.",
    "Estilo é saber quem você é, e sua escolha diz tudo!",
    "Seu senso estético é absolutamente inspirador.",
    "Curadoria pessoal nota dez! Essa peça é indispensável.",
    "Sofisticação em cada detalhe. Parabéns pela escolha!",
    "Você acaba de elevar o nível do seu closet. Incrível!",
    "Beleza e classe em uma única escolha. Perfeito!",
    "O equilíbrio ideal entre modernidade e tradição. Lindo!",
    "Seu bom gosto é a marca registrada da sua personalidade.",
    "Uma escolha que reflete confiança e atitude feminina.",
    "Luxo é ter personalidade, e sua escolha prova isso!"
  ];

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho([...carrinho, { ...produto, image: produto.imagens[0] }]);
    setNotificacao(elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)]);
    setTimeout(() => setNotificacao(""), 4000);
  };

  const finalizarPedidoWhatsApp = () => {
    const foneWhatsApp = "5521971366354"; 
    let mensagem = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.nome}* - R$ ${item.preco.toFixed(2)}\n`;
    });
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*\n\n_Aguardo seu retorno para combinarmos os detalhes!_`;
    window.open(`https://api.whatsapp.com/send?phone=${foneWhatsApp}&text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans relative overflow-x-hidden">
      
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />
      <SacolaLateral aberto={carrinhoAberto} fechar={() => setCarrinhoAberto(false)} carrinho={carrinho} remover={(idx) => setCarrinho(carrinho.filter((_, i) => i !== idx))} finalizar={finalizarPedidoWhatsApp} />

      {/* NAVEGAÇÃO */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 bg-white sticky top-0 z-[100] border-b border-zinc-100 shadow-sm">
        <div className="hidden md:block w-48"></div>
        <div className="flex flex-col items-center flex-1 md:flex-none">
          <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#611F3A]">
            Closet <span className="text-[#611F3A]/80 font-light italic">Dellas</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCarrinhoAberto(true)} className="relative flex items-center justify-center bg-[#611F3A] text-white w-10 h-10 rounded-lg hover:bg-[#D4AF37] transition-colors shadow-sm">
            <span className="text-lg">👜</span>
            {carrinho.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                {carrinho.length}
              </span>
            )}
          </button>
          <button onClick={() => setGuiaAberto(true)} className="hidden md:block bg-[#611F3A] text-white text-[10px] uppercase tracking-widest font-bold px-4 h-10 rounded-lg hover:bg-[#D4AF37] transition-colors shadow-sm">
            Guia de Medidas
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative w-full aspect-[21/9] min-h-[450px] bg-zinc-200 flex items-center overflow-hidden">
        <img src="/images/hero-sophisticated.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Closet Dellas Collection" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 text-left text-white">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block text-[#D4AF37]">Nova Coleção 2026</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight">
            A elegância que <br /> <span className="italic font-serif">você merece.</span>
          </h2>
          <button className="bg-[#611F3A] text-white px-8 py-4 rounded-md text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#D4AF37] transition-colors shadow-lg active:scale-95">
            Conferir Lançamentos
          </button>
        </div>
      </section>

      {/* BARRA DE BENEFÍCIOS */}
      <section className="bg-[#F9F6F7] py-6 px-6 md:px-12 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-6 text-[#611F3A]">
          <div className="flex items-center gap-2"><span className="text-xl">💳</span><p className="text-[10px] uppercase font-bold tracking-widest">Parcelamento até 6x</p></div>
          <div className="flex items-center gap-2"><span className="text-xl">🚚</span><p className="text-[10px] uppercase font-bold tracking-widest">Frete Grátis acima de R$399</p></div>
          <div className="flex items-center gap-2"><span className="text-xl">✨</span><p className="text-[10px] uppercase font-bold tracking-widest">Curadoria Exclusiva</p></div>
        </div>
      </section>

      {/* VITRINE DE PRODUTOS */}
      <section className="max-w-7xl mx-auto py-20 px-6 md:px-12">
        <h3 className="text-3xl md:text-4xl font-serif italic text-[#611F3A] mb-8">Nossos Destaques</h3>
        
        {/* Container de Categorias com Pílulas e Menus Suspensos */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-zinc-100 pb-6">
          {categoriasBase.map(cat => (
            <div key={cat.id} className="relative group">
              <button 
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                  categoriaAtiva === cat.id 
                    ? 'bg-[#611F3A] text-white border-2 border-black shadow-md' 
                    : 'bg-white border border-zinc-200 text-[#611F3A] hover:border-[#611F3A]'
                }`}
              >
                {cat.label}
              </button>
              
              {/* Menu Dropdown de Subcategorias (Exibido no Hover) */}
              <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-zinc-100 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                {cat.subs.map(sub => (
                  <button 
                    key={sub}
                    className="w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:bg-zinc-50 hover:text-[#611F3A] border-b border-zinc-50 last:border-0 transition-colors"
                    onClick={() => setCategoriaAtiva(cat.id)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de Produtos (4 colunas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {todosProdutos.filter(p => p.categoria === categoriaAtiva).map((produto) => (
            <div key={produto.id} className="flex flex-col group animate-in fade-in duration-500">
              <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
              <div className="text-left mt-2">
                <p className="text-[9px] text-zinc-400 uppercase tracking-[0.2em] font-bold mb-1">
                  {categoriasBase.find(c => c.id === produto.categoria)?.label}
                </p>
                <h4 className="text-xs font-bold text-zinc-800 leading-tight h-8">{produto.nome}</h4>
                <p className="text-sm font-bold text-[#611F3A] mt-2 mb-4">R$ {produto.preco.toFixed(2)}</p>
                
                <button 
                  onClick={() => adicionarAoCarrinho(produto)} 
                  className="w-full bg-[#611F3A] text-white py-3 rounded-md text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-[#D4AF37] transition-colors active:scale-95"
                >
                  Adicionar à Sacola
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUEM SOMOS / FOOTER ESCURO */}
      <section className="bg-[#611F3A] py-20 px-6 text-white mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-serif italic mb-6">Nossa Essência <br/> <span className="text-[#D4AF37] text-xl font-sans not-italic tracking-widest uppercase">(Quem Somos)</span></h3>
            <p className="text-sm font-light leading-relaxed opacity-90 mb-6 max-w-md">
              O Closet Dellas nasceu para vestir mulheres reais com elegância e sofisticação. Nossa curadoria é feita a dedo para que cada peça realce a beleza única que existe em você.
            </p>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">© 2026 Closet Dellas</p>
          </div>
          <div className="hidden md:flex justify-end opacity-20">
             <span className="text-9xl font-serif italic">CD</span>
          </div>
        </div>
      </section>

    </main>
  );
}