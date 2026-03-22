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
  const [busca, setBusca] = useState('');

  // Categorias atualizadas exatamente conforme a imagem de referência (Sem Plus Size)
  const categoriasBase = [
    { id: 'vestidos', label: 'VESTIDOS', subs: ['Longo', 'Midi', 'Curto'] },
    { id: 'blusas', label: 'BLUSAS', subs: ['Camisas', 'T-shirts', 'Regatas'] },
    { id: 'calcas', label: 'CALÇAS', subs: ['Pantalona', 'Alfaiataria', 'Jeans'] },
    { id: 'macacao', label: 'MACACÃO', subs: ['Longo', 'Pantacourt'] },
    { id: 'casacos', label: 'CASACOS E JAQUETAS', subs: ['Blazer', 'Jaqueta', 'Sobretudo'] },
    { id: 'saias', label: 'SAIAS', subs: ['Midi', 'Curta', 'Plissada'] },
    { id: 'kimono', label: 'KIMONO', subs: ['Longo', 'Curto', 'Estampado'] },
    { id: 'bermudas', label: 'BERMUDAS E SHORTS', subs: ['Linho', 'Jeans', 'Alfaiataria'] },
    { id: 'lenco', label: 'LENÇO', subs: ['Seda', 'Estampado', 'Liso'] },
  ];

  const gerarProdutos = () => {
    const listaProdutos: any[] = [];
    categoriasBase.forEach((cat, catIndex) => {
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

  const produtosFiltrados = todosProdutos.filter(p => {
    if (busca.trim() !== '') {
      return p.nome.toLowerCase().includes(busca.toLowerCase());
    }
    return p.categoria === categoriaAtiva;
  });

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans relative overflow-x-hidden">
      
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />
      <SacolaLateral aberto={carrinhoAberto} fechar={() => setCarrinhoAberto(false)} carrinho={carrinho} remover={(idx) => setCarrinho(carrinho.filter((_, i) => i !== idx))} finalizar={finalizarPedidoWhatsApp} />

      {/* NAVEGAÇÃO */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 bg-white sticky top-0 z-[100] border-b border-zinc-100 shadow-sm">
        <div className="hidden md:block w-64 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs focus:ring-1 focus:ring-[#611F3A] outline-none transition-all"
          />
        </div>
        
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-100 pb-4 gap-4">
          <h3 className="text-3xl md:text-4xl font-serif italic text-[#611F3A]">
            {busca ? 'Resultados da Busca' : 'Nossos Destaques'}
          </h3>

          <div className="w-full md:hidden relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs focus:ring-1 focus:ring-[#611F3A] outline-none"
            />
          </div>
        </div>
        
        {!busca && (
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
        )}

        {produtosFiltrados.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-zinc-400 uppercase tracking-widest font-bold">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {produtosFiltrados.map((produto) => (
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
        )}
      </section>

      {/* QUEM SOMOS / FOOTER ESCURO */}
      <section className="bg-[#611F3A] py-20 px-6 text-white mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-serif italic mb-6">Nossa Essência <br/> <span className="text-[#D4AF37] text-xl font-sans not-italic tracking-widest uppercase">(Quem Somos)</span></h3>
            <p className="text-sm font-light leading-relaxed opacity-90 mb-6 max-w-md">
              O Closet Dellas nasceu para vestir mulheres reais com elegância e sofisticação. Nossa curadoria é feita a dedo para que cada peça realce a beleza única que existe em você.
            </p>

            {/* ÍCONES DE REDES SOCIAIS */}
            <div className="flex gap-4 mb-8">
              {/* Instagram */}
              <a href="#" className="w-10 h-10 bg-white text-[#611F3A] rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-colors shadow-lg">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="w-10 h-10 bg-white text-[#611F3A] rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-colors shadow-lg">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="w-10 h-10 bg-white text-[#611F3A] rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-colors shadow-lg">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12.031 2.007a9.969 9.969 0 00-8.5 15.228l-1.468 5.362 5.485-1.438a9.964 9.964 0 004.483 1.066h.004c5.5 0 9.975-4.475 9.975-9.974 0-2.666-1.038-5.17-2.923-7.054A9.92 9.92 0 0012.031 2.007zm0 16.634c-1.488 0-2.946-.4-4.226-1.157l-.303-.18-3.14.823.84-3.064-.197-.313a8.31 8.31 0 01-1.272-4.44c0-4.582 3.73-8.312 8.312-8.312 2.221 0 4.31.865 5.88 2.435s2.43 3.658 2.43 5.877c0 4.58-3.73 8.31-8.31 8.31zm4.562-6.234c-.25-.125-1.48-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79.98-.146.166-.293.187-.543.062-.25-.125-1.056-.39-2.01-1.242-.74-.662-1.24-1.48-1.386-1.73-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.02-.437-.063-.125-.563-1.355-.772-1.854-.203-.487-.409-.422-.563-.43-.146-.008-.313-.01-.48-.01a.916.916 0 00-.663.308c-.229.25-.875.855-.875 2.083s.896 2.417 1.02 2.583c.125.166 1.762 2.688 4.267 3.77.596.258 1.062.412 1.425.528.598.19 1.141.163 1.57.1.478-.071 1.48-.605 1.688-1.19.21-.584.21-1.085.147-1.19-.063-.105-.23-.167-.48-.292z"/></svg>
              </a>
            </div>

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