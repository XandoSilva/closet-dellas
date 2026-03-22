'use client';

import { useState, useRef, useEffect } from 'react';

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

function ModalDetalheProduto({ produto, aberto, fechar, adicionarAoCarrinho, setNotificacao, categoriasBase }: any) {
  if (!aberto || !produto) return null;
  
  const [tamanho, setTamanho] = useState<string | null>(null);

  const handleAddCart = () => {
    if (!tamanho) {
      setNotificacao("Por favor, selecione um tamanho antes de adicionar à sacola! 📏");
      setTimeout(() => setNotificacao(""), 4000);
      return;
    }
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho });
    setTamanho(null);
    fechar();
  };

  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 md:p-8" onClick={fechar}>
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto md:overflow-hidden rounded-2xl shadow-2xl relative animate-in zoom-in duration-300 flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-4 right-4 bg-white/50 w-8 h-8 rounded-full flex items-center justify-center text-[#611F3A] hover:bg-zinc-100 text-xl z-50 shadow-sm">✕</button>
        
        <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-[600px] bg-zinc-100">
          <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold mb-2">
            {categoriasBase.find((c:any) => c.id === produto.categoria)?.label} • {produto.subcategoria}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif italic text-[#611F3A] mb-2">{produto.nome}</h2>
          <p className="text-xl font-bold text-[#D4AF37] mb-6">R$ {produto.preco.toFixed(2)}</p>
          
          <div className="prose prose-sm text-zinc-500 mb-8 flex-1">
            <p className="leading-relaxed">{produto.descricao}</p>
            <ul className="mt-4 space-y-1 text-xs">
              <li>✨ Modelagem exclusiva</li>
              <li>✨ Tecido premium com caimento perfeito</li>
              <li>✨ Acabamento de alta costura</li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-800 mb-3">Selecione o Tamanho:</p>
            <div className="flex gap-2 mb-6">
              {['P', 'M', 'G', 'U'].map(t => {
                const temEstoque = produto.tamanhosDisponiveis.includes(t);
                return (
                  <button 
                    key={t}
                    onClick={() => temEstoque && setTamanho(t)}
                    disabled={!temEstoque}
                    title={temEstoque ? `Tamanho ${t}` : 'Esgotado'}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all border ${
                      !temEstoque
                        ? 'bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed opacity-50' 
                        : tamanho === t 
                          ? 'bg-[#611F3A] text-white border-[#611F3A] scale-110 shadow-md' 
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#611F3A]'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
            
            <button 
              onClick={handleAddCart} 
              className="w-full bg-[#611F3A] text-white py-4 rounded-md text-[11px] uppercase tracking-[0.2em] font-bold shadow-lg hover:bg-[#D4AF37] transition-colors active:scale-95"
            >
              Adicionar à Sacola
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarrosselProduto({ imagens, nome }: { imagens: string[], nome: string }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setFotoAtual(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const proximaFoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = fotoAtual + 1 === imagens.length ? 0 : fotoAtual + 1;
    scrollTo(next);
  };

  const fotoAnterior = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = fotoAtual === 0 ? imagens.length - 1 : fotoAtual - 1;
    scrollTo(prev);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-100 group/fotos">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {imagens.map((img, index) => (
          <img key={index} src={img} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0 snap-center" />
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />

      {imagens.length > 1 && (
        <>
          <button onClick={fotoAnterior} className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] w-8 h-8 rounded-full items-center justify-center text-xs font-bold opacity-0 group-hover/fotos:opacity-100 transition-opacity hover:bg-white shadow-sm">❮</button>
          <button onClick={proximaFoto} className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] w-8 h-8 rounded-full items-center justify-center text-xs font-bold opacity-0 group-hover/fotos:opacity-100 transition-opacity hover:bg-white shadow-sm">❯</button>
          
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 rounded-full backdrop-blur-sm pointer-events-none">
            {imagens.map((_, index) => (
              <div key={index} className={`w-1.5 h-1.5 rounded-full transition-all ${index === fotoAtual ? 'bg-white scale-125' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProdutoCard({ produto, categoriasBase, adicionarAoCarrinho, setNotificacao, abrirDetalhe }: any) {
  const [tamanho, setTamanho] = useState<string | null>(null);
  const ehUltimaPeca = produto.tamanhosDisponiveis.length === 1 && produto.tamanhosDisponiveis[0] !== 'U';

  const handleAddCart = () => {
    if (!tamanho) {
      setNotificacao("Por favor, selecione um tamanho antes de adicionar à sacola! 📏");
      setTimeout(() => setNotificacao(""), 4000);
      return;
    }
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho });
    setTamanho(null); 
  };

  return (
    <div className="flex flex-col group animate-in fade-in duration-500 relative">
      
      {ehUltimaPeca && (
        <span className="absolute top-3 left-3 bg-[#611F3A] text-white text-[8px] uppercase tracking-widest font-bold px-2.5 py-1.5 rounded-sm z-10 shadow-md animate-pulse">
          Última Peça
        </span>
      )}

      <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden group/imagem">
        <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        
        {/* Quick View Button (Desktop) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/imagem:opacity-100 transition-opacity pointer-events-none md:flex items-center justify-center hidden">
          <button 
            onClick={(e) => { e.stopPropagation(); abrirDetalhe(produto); }}
            className="bg-white/95 text-[#611F3A] px-6 py-3 rounded text-[10px] uppercase tracking-[0.2em] font-bold shadow-xl pointer-events-auto hover:bg-[#611F3A] hover:text-white transition-colors transform translate-y-4 group-hover/imagem:translate-y-0 duration-300"
          >
            Ver Detalhes
          </button>
        </div>
      </div>

      <div className="text-left mt-3">
        <p className="text-[9px] text-zinc-400 uppercase tracking-[0.2em] font-bold mb-1">
          {categoriasBase.find((c:any) => c.id === produto.categoria)?.label} • {produto.subcategoria}
        </p>
        <h4 className="text-xs font-bold text-zinc-800 leading-tight h-8">{produto.nome}</h4>
        <p className="text-sm font-bold text-[#611F3A] mt-1">R$ {produto.preco.toFixed(2)}</p>

        <div className="flex gap-2 my-3">
          {['P', 'M', 'G', 'U'].map(t => {
            const temEstoque = produto.tamanhosDisponiveis.includes(t);
            return (
              <button 
                key={t}
                onClick={() => temEstoque && setTamanho(t)}
                disabled={!temEstoque}
                title={temEstoque ? `Tamanho ${t}` : 'Esgotado'}
                className={`w-7 h-7 rounded-full text-[10px] font-bold transition-colors border flex items-center justify-center ${
                  !temEstoque
                    ? 'bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed opacity-50'
                    : tamanho === t 
                      ? 'bg-[#611F3A] text-white border-[#611F3A]' 
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#611F3A]'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
        
        {/* BOTÕES LADO A LADO PARA MOBILE */}
        <div className="flex gap-2">
          <button 
            onClick={() => abrirDetalhe(produto)}
            className="md:hidden flex-1 bg-zinc-900 text-white py-3 rounded-md text-[10px] uppercase tracking-[0.1em] font-bold shadow-md hover:bg-black active:scale-95 transition-colors"
          >
            Ver Detalhes
          </button>
          <button 
            onClick={handleAddCart} 
            className="flex-1 bg-[#611F3A] text-white py-3 rounded-md text-[10px] uppercase tracking-[0.1em] font-bold shadow-md hover:bg-[#D4AF37] transition-colors active:scale-95"
          >
            <span className="md:hidden">Add Sacola</span>
            <span className="hidden md:inline">Adicionar à Sacola</span>
          </button>
        </div>
      </div>
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
                <p className="text-[10px] text-zinc-500 mt-0.5 font-bold uppercase">Tamanho: {item.tamanhoSelecionado}</p>
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
  const [produtoDetalheAberto, setProdutoDetalheAberto] = useState<any>(null); 
  
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [subCategoriaAtiva, setSubCategoriaAtiva] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('recentes'); 
  
  const [menuAbertoCat, setMenuAbertoCat] = useState<string | null>(null);
  const [subMenuAberto, setSubMenuAberto] = useState<string | null>(null);
  const [mostrarTopo, setMostrarTopo] = useState(false);

  const vitrineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarTopo(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const irParaTopo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoriasBase = [
    { id: 'vestidos', label: 'VESTIDOS', subs: ['Longo', 'Midi', 'Curto'] },
    { id: 'blusas', label: 'BLUSAS', subs: ['Camisas', 'T-shirts', 'Regatas', 'Corset'] },
    { id: 'cropped', label: 'CROPPED', subs: ['Renda', 'Manga Longa', 'Básico'] },
    { id: 'calcas', label: 'CALÇAS', subs: ['Pantalona', 'Alfaiataria', 'Jeans'] },
    { id: 'macacao', label: 'MACACÃO', subs: ['Longo', 'Pantacourt'] },
    { id: 'casacos', label: 'CASACOS E JAQUETAS', subs: ['Blazer', 'Jaqueta', 'Sobretudo'] },
    { id: 'saias', label: 'SAIAS', subs: ['Midi', 'Curta', 'Plissada'] },
    { id: 'shorts', label: 'SHORTS', subs: ['Linho', 'Jeans', 'Alfaiataria'] },
  ];

  const gerarProdutos = () => {
    const listaProdutos: any[] = [];
    const gradesEstoque = [['P', 'M', 'G'], ['M', 'G'], ['U'], ['P', 'M'], ['P']];

    categoriasBase.forEach((cat, catIndex) => {
      for (let i = 1; i <= 4; i++) {
        const dataCadastroFake = (i % 2 === 0) 
          ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() 
          : new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(); 
          
        listaProdutos.push({
          id: `${cat.id}-${i}`,
          nome: `${cat.label.charAt(0) + cat.label.slice(1).toLowerCase()} Exclusivo ${i}`,
          categoria: cat.id,
          subcategoria: cat.subs[i % cat.subs.length], 
          dataCadastro: dataCadastroFake,
          tamanhosDisponiveis: gradesEstoque[(catIndex + i) % gradesEstoque.length],
          preco: 180 + (catIndex * i * 7) + (i * 15),
          descricao: `Esta peça incrível da categoria ${cat.label} foi desenvolvida com tecidos nobres para garantir conforto e durabilidade. O corte valoriza a silhueta, tornando-se um item indispensável no seu closet. Combine com acessórios dourados para um look impecável.`,
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
    "Combinação perfeita com o seu estilo único.",
    "Um toque de luxo para o seu closet. Escolha maravilhosa!",
    "Essa peça vai realçar ainda mais a sua essência.",
    "Sofisticação em cada detalhe. Parabéns pela escolha!"
  ];

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho([...carrinho, { ...produto, image: produto.imagens[0] }]);
    setNotificacao(elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)]);
    setTimeout(() => setNotificacao(""), 4000);
  };

  const foneWhatsAppRaw = "5521971366354"; 

  const finalizarPedidoWhatsApp = () => {
    let mensagem = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.nome}* (Tam: ${item.tamanhoSelecionado}) - R$ ${item.preco.toFixed(2)}\n`;
    });
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*\n\n_Aguardo seu retorno para combinarmos os detalhes!_`;
    window.open(`https://api.whatsapp.com/send?phone=${foneWhatsAppRaw}&text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  let produtosFiltrados = todosProdutos.filter(p => {
    if (busca.trim() !== '') {
      return p.nome.toLowerCase().includes(busca.toLowerCase());
    }
    if (categoriaAtiva === 'lancamentos') {
      const diffDays = Math.ceil(Math.abs(Date.now() - new Date(p.dataCadastro).getTime()) / (1000 * 60 * 60 * 24)); 
      return diffDays <= 20;
    }
    if (categoriaAtiva !== 'todas') {
      if (p.categoria !== categoriaAtiva) return false;
      if (subCategoriaAtiva && p.subcategoria !== subCategoriaAtiva) return false;
    }
    return true;
  });

  produtosFiltrados = produtosFiltrados.sort((a, b) => {
    if (ordenacao === 'menor_preco') return a.preco - b.preco;
    if (ordenacao === 'maior_preco') return b.preco - a.preco;
    if (ordenacao === 'recentes') return new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
    return 0;
  });

  const irParaLancamentos = () => {
    setCategoriaAtiva('lancamentos');
    setSubCategoriaAtiva(null);
    if (vitrineRef.current) {
      vitrineRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans relative overflow-x-hidden">
      
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />
      <SacolaLateral aberto={carrinhoAberto} fechar={() => setCarrinhoAberto(false)} carrinho={carrinho} remover={(idx) => setCarrinho(carrinho.filter((_, i) => i !== idx))} finalizar={finalizarPedidoWhatsApp} />
      <ModalDetalheProduto aberto={!!produtoDetalheAberto} fechar={() => setProdutoDetalheAberto(null)} produto={produtoDetalheAberto} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} categoriasBase={categoriasBase} />

      {/* BOTÃO VOLTAR AO TOPO */}
      {mostrarTopo && (
        <button 
          onClick={irParaTopo}
          className="fixed bottom-[90px] right-6 w-10 h-10 bg-white text-[#611F3A] border border-zinc-200 rounded-full shadow-lg flex items-center justify-center z-[8900] hover:bg-[#611F3A] hover:text-white transition-all opacity-80 hover:opacity-100"
          title="Voltar ao topo"
        >
          <span className="text-xl font-bold mb-1">↑</span>
        </button>
      )}

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      <a 
        href={`https://wa.me/${foneWhatsAppRaw}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] flex items-center justify-center z-[9000] hover:scale-110 transition-transform animate-bounce"
        style={{ animationDuration: '3s' }}
        title="Fale conosco no WhatsApp"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12.031 2.007a9.969 9.969 0 00-8.5 15.228l-1.468 5.362 5.485-1.438a9.964 9.964 0 004.483 1.066h.004c5.5 0 9.975-4.475 9.975-9.974 0-2.666-1.038-5.17-2.923-7.054A9.92 9.92 0 0012.031 2.007zm0 16.634c-1.488 0-2.946-.4-4.226-1.157l-.303-.18-3.14.823.84-3.064-.197-.313a8.31 8.31 0 01-1.272-4.44c0-4.582 3.73-8.312 8.312-8.312 2.221 0 4.31.865 5.88 2.435s2.43 3.658 2.43 5.877c0 4.58-3.73 8.31-8.31 8.31zm4.562-6.234c-.25-.125-1.48-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79.98-.146.166-.293.187-.543.062-.25-.125-1.056-.39-2.01-1.242-.74-.662-1.24-1.48-1.386-1.73-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.02-.437-.063-.125-.563-1.355-.772-1.854-.203-.487-.409-.422-.563-.43-.146-.008-.313-.01-.48-.01a.916.916 0 00-.663.308c-.229.25-.875.855-.875 2.083s.896 2.417 1.02 2.583c.125.166 1.762 2.688 4.267 3.77.596.258 1.062.412 1.425.528.598.19 1.141.163 1.57.1.478-.071 1.48-.605 1.688-1.19.21-.584.21-1.085.147-1.19-.063-.105-.23-.167-.48-.292z"/></svg>
      </a>

      {/* NAVEGAÇÃO */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 bg-white sticky top-0 z-[100] border-b border-zinc-100 shadow-sm">
        
        <div className="hidden md:block w-80 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="O que você está procurando?"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#F9F6F7] border border-zinc-200 rounded-full text-xs text-zinc-800 focus:border-[#611F3A] focus:ring-1 focus:ring-[#611F3A] outline-none placeholder:text-zinc-600 placeholder:italic transition-all shadow-inner"
          />
        </div>
        
        <div className="flex flex-col items-center flex-1 md:flex-none">
          <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#611F3A]">
            Closet <span className="text-[#611F3A]/80 font-light italic">Dellas</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-80 justify-end">
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
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block text-[#D4AF37]">Nova Coleção</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight">
            A elegância que <br /> <span className="italic font-serif">você merece.</span>
          </h2>
          <button 
            onClick={irParaLancamentos} 
            className="bg-[#611F3A] text-white px-8 py-4 rounded-md text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#D4AF37] transition-colors shadow-lg active:scale-95"
          >
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
      <section ref={vitrineRef} className="max-w-7xl mx-auto py-20 px-6 md:px-12 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-100 pb-4 gap-4">
          <h3 className="text-3xl md:text-4xl font-serif italic text-[#611F3A]">
            {busca 
              ? 'Resultados da Busca' 
              : categoriaAtiva === 'lancamentos' 
                ? 'Novidades & Lançamentos' 
                : subCategoriaAtiva 
                  ? `Nossos Destaques: ${subCategoriaAtiva}`
                  : 'Nossos Destaques'
            }
          </h3>

          <div className="w-full md:hidden relative mb-2 mt-4">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="O que você está procurando?"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#F9F6F7] border border-zinc-200 rounded-full text-xs text-zinc-800 focus:border-[#611F3A] focus:ring-1 focus:ring-[#611F3A] outline-none placeholder:text-zinc-600 placeholder:italic transition-all shadow-inner"
            />
          </div>
        </div>
        
        {/* BARRA DE ORDENAÇÃO E CATEGORIAS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-40">
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button 
              onClick={irParaLancamentos}
              className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                categoriaAtiva === 'lancamentos' 
                  ? 'bg-[#D4AF37] text-white shadow-md' 
                  : 'bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white'
              }`}
            >
              Lançamentos ✨
            </button>

            <div className="relative group/todas">
              <button 
                onClick={() => {
                  setCategoriaAtiva('todas');
                  setSubCategoriaAtiva(null);
                  setMenuAbertoCat(menuAbertoCat === 'todas' ? null : 'todas');
                  setSubMenuAberto(null);
                }}
                className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                  categoriaAtiva === 'todas' 
                    ? 'bg-[#611F3A] text-white border-2 border-black shadow-md' 
                    : 'bg-white border border-zinc-200 text-[#611F3A] hover:border-[#611F3A]'
                }`}
              >
                Todas as Categorias
              </button>
              
              <div className={`
                relative md:absolute md:left-0 md:top-full w-full md:w-56 bg-zinc-50 md:bg-white border-l-2 border-[#611F3A] md:border-l-0 md:border md:border-zinc-100 shadow-inner md:shadow-xl md:rounded-lg z-[70] transition-all duration-200 
                md:opacity-0 md:invisible md:group-hover/todas:opacity-100 md:group-hover/todas:visible
                ${menuAbertoCat === 'todas' ? 'block mt-2' : 'hidden md:block'}
              `}>
                {categoriasBase.map(cat => (
                  <div key={cat.id} className="relative group/sub">
                    <button 
                      className="w-full flex items-center justify-between px-5 py-3 border-b border-zinc-200 md:border-zinc-50 last:border-0 hover:bg-zinc-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoriaAtiva(cat.id);
                        setSubCategoriaAtiva(null);
                        setSubMenuAberto(subMenuAberto === cat.id ? null : cat.id);
                      }}
                    >
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 hover:text-[#611F3A]">{cat.label}</span>
                      <span className="text-zinc-400 p-2 -mr-2 md:p-0 md:mr-0 text-xs font-bold transition-transform duration-200">
                        {subMenuAberto === cat.id ? '∨' : '❯'}
                      </span>
                    </button>
                    
                    <div className={`
                      relative md:absolute md:left-full md:top-0 md:-mt-1 md:ml-1 w-full md:w-48 bg-zinc-100 md:bg-white border-l-2 border-[#D4AF37] md:border-l-0 md:border md:border-zinc-100 shadow-inner md:shadow-xl md:rounded-lg z-[80] transition-all duration-200 
                      md:opacity-0 md:invisible md:group-hover/sub:opacity-100 md:group-hover/sub:visible
                      ${subMenuAberto === cat.id ? 'block' : 'hidden md:block'}
                    `}>
                      {cat.subs.map(sub => (
                        <button 
                          key={sub}
                          className="w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:bg-zinc-200 hover:text-[#611F3A] border-b border-zinc-200 md:border-zinc-50 last:border-0 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setCategoriaAtiva(cat.id); setSubCategoriaAtiva(sub); setMenuAbertoCat(null); setSubMenuAberto(null); }}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {categoriasBase.map(cat => (
              <div key={cat.id} className="relative group hidden md:block">
                <button 
                  onClick={() => { setCategoriaAtiva(cat.id); setSubCategoriaAtiva(null); setMenuAbertoCat(menuAbertoCat === cat.id ? null : cat.id); }}
                  className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                    categoriaAtiva === cat.id && !subCategoriaAtiva
                      ? 'bg-[#611F3A] text-white border-2 border-black shadow-md' 
                      : 'bg-white border border-zinc-200 text-[#611F3A] hover:border-[#611F3A]'
                  }`}
                >
                  {cat.label}
                </button>
                
                <div className={`absolute left-0 top-full mt-2 w-48 bg-white border border-zinc-100 shadow-xl rounded-lg z-50 overflow-hidden transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible`}>
                  {cat.subs.map(sub => (
                    <button 
                      key={sub}
                      className="w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:bg-zinc-50 hover:text-[#611F3A] border-b border-zinc-50 last:border-0 transition-colors"
                      onClick={() => { setCategoriaAtiva(cat.id); setSubCategoriaAtiva(sub); setMenuAbertoCat(null); }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-auto flex items-center md:justify-end gap-2 border-t md:border-none pt-4 md:pt-0 border-zinc-100">
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Ordenar:</span>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="bg-transparent border border-zinc-200 text-[#611F3A] text-[10px] uppercase font-bold tracking-widest rounded-full px-4 py-2.5 focus:ring-1 focus:ring-[#611F3A] outline-none cursor-pointer flex-1 md:flex-none"
            >
              <option value="recentes">Mais Recentes</option>
              <option value="menor_preco">Menor Preço</option>
              <option value="maior_preco">Maior Preço</option>
            </select>
          </div>
        </div>

        {produtosFiltrados.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-zinc-400 uppercase tracking-widest font-bold">Nenhum produto encontrado nesta categoria no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {produtosFiltrados.map((produto) => (
              <ProdutoCard 
                key={produto.id} 
                produto={produto} 
                categoriasBase={categoriasBase} 
                adicionarAoCarrinho={adicionarAoCarrinho} 
                setNotificacao={setNotificacao}
                abrirDetalhe={setProdutoDetalheAberto}
              />
            ))}
          </div>
        )}
      </section>

      {/* PROVA SOCIAL - ELAS USAM */}
      <section className="py-16 px-6 md:px-12 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif italic text-[#611F3A] mb-2">Elas usam Closet Dellas</h3>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400">Inspirações reais de nossas clientes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <div className="group relative overflow-hidden rounded-lg aspect-square">
              <img src="https://images.unsplash.com/photo-1515347619252-c0fb95392e21?q=80&w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-3xl">❤️</span>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg aspect-square">
              <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-3xl">❤️</span>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg aspect-square">
              <img src="https://images.unsplash.com/photo-1529139574466-a303027c028b?q=80&w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-3xl">❤️</span>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg aspect-square">
              <img src="https://images.unsplash.com/photo-1485230895905-31d98601d361?q=80&w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-3xl">❤️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* RODAPÉ COMPLETO (FOOTER) */}
      <footer className="bg-[#611F3A] pt-16 pb-8 px-6 md:px-12 text-white border-t border-zinc-200 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          
          {/* Coluna 1: Nossa Essência e Redes Sociais */}
          <div>
            <h3 className="text-3xl font-serif font-extrabold mb-4">Closet <span className="font-light italic">Dellas</span></h3>
            <p className="text-sm font-light leading-relaxed opacity-90 mb-6">
              Nascemos para vestir mulheres reais com elegância e sofisticação. Curadoria feita a dedo para realçar a beleza única que existe em você.
            </p>
            
            {/* Redes Sociais */}
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-3 text-[10px]">Siga-nos</h4>
            <div className="flex gap-3">
              {/* Instagram */}
              <a href="https://instagram.com/_closetdellas9" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-colors" title="Instagram">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-colors" title="TikTok">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M12.525.02c1.31 0 2.59.32 3.72.93a5.29 5.29 0 0 1-1.3 1.56 5.31 5.31 0 0 1-1.92.93c-.15.04-.15.24-.15.39v9.75a6.45 6.45 0 1 1-6.45-6.45c.18 0 .36.02.53.05.15.03.22-.1.22-.24V3.8c0-.13-.1-.23-.23-.25a8.45 8.45 0 1 0 7.93 8.4V4.54c.48.36 1.02.66 1.6.87a7.51 7.51 0 0 0 2.53.43V2.62c-.75 0-1.48-.15-2.15-.43a5.45 5.45 0 0 1-2.01-1.48c-.12-.13-.3-.12-.32.06l-.02.27V.02h-2z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href={`https://wa.me/${foneWhatsAppRaw}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-colors" title="WhatsApp">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M12.031 2.007a9.969 9.969 0 00-8.5 15.228l-1.468 5.362 5.485-1.438a9.964 9.964 0 004.483 1.066h.004c5.5 0 9.975-4.475 9.975-9.974 0-2.666-1.038-5.17-2.923-7.054A9.92 9.92 0 0012.031 2.007zm0 16.634c-1.488 0-2.946-.4-4.226-1.157l-.303-.18-3.14.823.84-3.064-.197-.313a8.31 8.31 0 01-1.272-4.44c0-4.582 3.73-8.312 8.312-8.312 2.221 0 4.31.865 5.88 2.435s2.43 3.658 2.43 5.877c0 4.58-3.73 8.31-8.31 8.31zm4.562-6.234c-.25-.125-1.48-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79.98-.146.166-.293.187-.543.062-.25-.125-1.056-.39-2.01-1.242-.74-.662-1.24-1.48-1.386-1.73-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.02-.437-.063-.125-.563-1.355-.772-1.854-.203-.487-.409-.422-.563-.43-.146-.008-.313-.01-.48-.01a.916.916 0 00-.663.308c-.229.25-.875.855-.875 2.083s.896 2.417 1.02 2.583c.125.166 1.762 2.688 4.267 3.77.596.258 1.062.412 1.425.528.598.19 1.141.163 1.57.1.478-.071 1.48-.605 1.688-1.19.21-.584.21-1.085.147-1.19-.063-.105-.23-.167-.48-.292z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Políticas */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-6 text-xs">Políticas</h4>
            <ul className="flex flex-col gap-3 text-sm font-light opacity-90">
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Prazos e Entregas</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Termos e Condições</a></li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-6 text-xs">Atendimento</h4>
            <div className="flex flex-col gap-3 text-sm font-light opacity-90">
              <p>Segunda a Sexta: 09h às 18h</p>
              <p>Sábado: 09h às 13h</p>
              <p className="mt-2"><span className="font-bold">E-mail:</span> contato@closetdellas.com.br</p>
              <p><span className="font-bold">WhatsApp:</span> (21) 97136-6354</p>
            </div>
          </div>

          {/* Coluna 4: Pagamento Seguro */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-6 text-xs">Pagamento Seguro</h4>
            <p className="text-sm font-light opacity-90 mb-4">Compre com segurança. Aceitamos PIX e cartões de crédito.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-white/10 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider">PIX</span>
              <span className="bg-white/10 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider">VISA</span>
              <span className="bg-white/10 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider">MASTERCARD</span>
            </div>
          </div>

        </div>

        {/* Linha de Copyright */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center flex flex-col items-center justify-center gap-2">
          <p className="text-[10px] uppercase tracking-widest text-white/50">© 2026 Closet Dellas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}