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
                <th className="py-3">Tamanho</th><th className="py-3">Busto</th><th className="py-3">Cintura</th><th className="py-3">Quadril</th>
              </tr>
            </thead>
            <tbody className="text-[#611F3A]">
              <tr className="border-b border-zinc-50"><td className="py-4 font-bold">P (36/38)</td><td>84-88cm</td><td>66-70cm</td><td>94-98cm</td></tr>
              <tr className="border-b border-zinc-50"><td className="py-4 font-bold">M (40/42)</td><td>92-96cm</td><td>74-78cm</td><td>102-106cm</td></tr>
              <tr className="border-b border-zinc-50"><td className="py-4 font-bold">G (44)</td><td>100-104cm</td><td>82-86cm</td><td>110-114cm</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Notificacao({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-[#D4AF37] px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(97,31,58,0.2)] z-[9999] border border-[#D4AF37]/30 animate-in fade-in slide-in-from-top-4 text-xs font-serif italic font-bold">
      ✨ {mensagem}
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
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-100 group/fotos">
      <div ref={scrollRef} onScroll={handleScroll} className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {imagens.map((img, index) => (
          <img key={index} src={img} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0 snap-center" />
        ))}
      </div>
      {imagens.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 rounded-full backdrop-blur-sm">
          {imagens.map((_, index) => (
            <div key={index} className={`w-1.5 h-1.5 rounded-full transition-all ${index === fotoAtual ? 'bg-white scale-125' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModalDetalheProduto({ produto, aberto, fechar, adicionarAoCarrinho, setNotificacao, categoriasBase }: any) {
  if (!aberto || !produto) return null;
  const [tamanho, setTamanho] = useState<string | null>(null);

  const handleAddCart = () => {
    if (!tamanho) {
      setNotificacao("Por favor, selecione um tamanho disponível! 📏");
      return;
    }
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho });
    setTamanho(null);
    fechar();
  };

  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 md:p-8" onClick={fechar}>
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in duration-300 flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-4 right-4 bg-white/50 w-8 h-8 rounded-full flex items-center justify-center text-[#611F3A] hover:bg-zinc-100 text-xl z-50">✕</button>
        <div className="w-full md:w-1/2 aspect-[3/4] bg-zinc-100">
          <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold mb-2">
            {categoriasBase.find((c:any) => c.id === produto.categoria)?.label} • {produto.subcategoria}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif italic text-[#611F3A] mb-2">{produto.nome}</h2>
          <p className="text-xl font-bold text-[#D4AF37] mb-6">R$ {produto.preco.toFixed(2)}</p>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed">{produto.descricao}</p>
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-800 mb-3">Tamanhos Disponíveis:</p>
            <div className="flex gap-2 mb-6">
              {produto.grade.map((item: any) => (
                <button 
                  key={item.tam}
                  disabled={item.qtd <= 0}
                  onClick={() => setTamanho(item.tam)}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all border ${
                    item.qtd <= 0 ? 'bg-zinc-50 text-zinc-200 border-zinc-100 cursor-not-allowed line-through' :
                    tamanho === item.tam ? 'bg-[#611F3A] text-white border-[#611F3A] scale-110 shadow-md' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#611F3A]'
                  }`}
                >
                  {item.tam}
                </button>
              ))}
            </div>
            <button onClick={handleAddCart} className="w-full bg-[#611F3A] text-white py-4 rounded-md text-[11px] uppercase tracking-widest font-bold shadow-lg hover:bg-[#D4AF37] transition-all">
              Adicionar à Sacola
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProdutoCard({ produto, categoriasBase, adicionarAoCarrinho, setNotificacao, abrirDetalhe }: any) {
  const [tamanho, setTamanho] = useState<string | null>(null);
  const esgotado = produto.estoqueTotal <= 0;

  const handleQuickAdd = () => {
    if (!tamanho) {
      setNotificacao("Selecione um tamanho disponível! ✨");
      return;
    }
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho });
    setTamanho(null); 
  };

  return (
    <div className="flex flex-col group relative animate-in fade-in duration-500">
      {esgotado && (
        <span className="absolute top-3 left-3 bg-zinc-500 text-white text-[8px] uppercase tracking-widest font-bold px-2.5 py-1.5 rounded-sm z-10 shadow-md">Esgotado</span>
      )}
      {!esgotado && produto.estoqueTotal === 1 && (
        <span className="absolute top-3 left-3 bg-[#611F3A] text-white text-[8px] uppercase tracking-widest font-bold px-2.5 py-1.5 rounded-sm z-10 shadow-md animate-pulse">Última Peça</span>
      )}

      <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden group/imagem shadow-sm">
        <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/imagem:opacity-100 transition-opacity pointer-events-none md:flex items-center justify-center hidden">
          <button 
            onClick={(e) => { e.stopPropagation(); abrirDetalhe(produto); }}
            className="bg-white/95 text-[#611F3A] px-6 py-3 rounded text-[10px] uppercase tracking-widest font-bold shadow-xl pointer-events-auto hover:bg-[#611F3A] hover:text-white transition-all transform translate-y-4 group-hover/imagem:translate-y-0"
          >
            Ver Detalhes
          </button>
        </div>
      </div>

      <div className="text-left mt-3">
        <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold mb-1">
          {categoriasBase.find((c:any) => c.id === produto.categoria)?.label} • {produto.subcategoria}
        </p>
        <h4 className="text-xs font-bold text-zinc-800 leading-tight h-8 overflow-hidden">{produto.nome}</h4>
        <p className="text-sm font-bold text-[#611F3A] mt-1">R$ {produto.preco.toFixed(2)}</p>

        <div className="flex gap-1.5 my-3">
          {produto.grade.map((item: any) => (
            <button 
              key={item.tam}
              disabled={item.qtd <= 0}
              onClick={() => setTamanho(item.tam)}
              title={item.qtd <= 0 ? 'Esgotado' : `${item.qtd} unidades`}
              className={`w-7 h-7 rounded-full text-[9px] font-bold border flex items-center justify-center transition-all ${
                item.qtd <= 0 ? 'bg-zinc-50 text-zinc-200 border-zinc-100 cursor-not-allowed line-through' :
                tamanho === item.tam ? 'bg-[#611F3A] text-white border-[#611F3A]' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#611F3A]'
              }`}
            >
              {item.tam}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => abrirDetalhe(produto)} className="md:hidden flex-1 bg-zinc-900 text-white py-3 rounded-md text-[9px] uppercase font-bold shadow-md hover:bg-black transition-colors">Detalhes</button>
          <button onClick={handleQuickAdd} disabled={esgotado} className="flex-1 bg-[#611F3A] text-white py-3 rounded-md text-[9px] uppercase font-bold shadow-md hover:bg-[#D4AF37] transition-colors active:scale-95 disabled:bg-zinc-300">Add Sacola</button>
        </div>
      </div>
    </div>
  );
}

// --- SACOLA LATERAL RESTAURADA ---
function SacolaLateral({ aberto, fechar, carrinho, remover, finalizar }: any) {
  const total = carrinho.reduce((acc: number, item: any) => acc + item.preco, 0);

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[10000] transform transition-transform duration-500 flex flex-col ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 bg-[#611F3A] text-white">
          <h2 className="text-xl font-serif italic">Sua Sacola</h2>
          <button onClick={fechar} className="text-white/60 hover:text-white text-lg">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {carrinho.map((item: any, index: number) => (
            <div key={index} className="flex gap-4 border-b border-zinc-100 pb-4 items-center animate-in fade-in slide-in-from-right-4">
              <img src={item.imagens[0]} className="w-16 h-20 object-cover rounded shadow-sm bg-zinc-100" />
              <div className="flex-1">
                <h4 className="text-[10px] uppercase font-bold text-zinc-800 leading-tight">{item.nome}</h4>
                <p className="text-[10px] text-[#D4AF37] mt-0.5 font-bold uppercase">Tam: {item.tamanhoSelecionado}</p>
                <p className="text-sm font-serif italic text-[#611F3A] mt-1">R$ {item.preco.toFixed(2)}</p>
              </div>
              <button onClick={() => remover(index)} className="p-2 text-zinc-300 hover:text-[#611F3A] transition-colors">✕</button>
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
              Finalizar no WhatsApp
            </button>
          </div>
        )}
      </div>
      {aberto && <div onClick={fechar} className="fixed inset-0 bg-black/50 z-[9000] backdrop-blur-[2px] transition-opacity" />}
    </>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  const [todosProdutos, setTodosProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [notificacao, setNotificacao] = useState("");
  const [produtoDetalheAberto, setProdutoDetalheAberto] = useState<any>(null); 
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [subCategoriaAtiva, setSubCategoriaAtiva] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [mostrarTopo, setMostrarTopo] = useState(false);

  const foneWhatsAppRaw = "5521971366354";
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqN7v3UoxhNoKYW56h2kv1D1tju1FawnzYEyaJBnIVeiNO53P49haHNix9voK-i7dLDVSpzss_65IY/pub?output=csv";

  // Categorias originais completas restauradas
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

  // Controle do scroll para o botão voltar ao topo
  useEffect(() => {
    const handleScroll = () => setMostrarTopo(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        const text = await res.text();
        const rows = text.split('\n').slice(1);
        const rawData = rows.map(row => {
          const cols = row.split(',');
          return {
            ref: cols[0]?.trim(),
            nome: cols[1]?.trim(),
            categoria: cols[2]?.trim().toLowerCase(),
            subcategoria: cols[3]?.trim(),
            tamanho: cols[4]?.trim(),
            estoque: parseInt(cols[5]) || 0,
            preco: parseFloat(cols[6]) || 0,
            descricao: cols[7]?.trim(),
            imagem: cols[8]?.trim()
          };
        }).filter(r => r.ref && r.nome);

        const grouped = rawData.reduce((acc: any[], item) => {
          const exist = acc.find(p => p.id === item.ref);
          if (exist) {
            exist.grade.push({ tam: item.tamanho, qtd: item.estoque });
            exist.estoqueTotal += item.estoque;
          } else {
            acc.push({
              id: item.ref,
              nome: item.nome,
              categoria: item.categoria,
              subcategoria: item.subcategoria,
              preco: item.preco,
              descricao: item.descricao,
              imagens: [item.imagem],
              estoqueTotal: item.estoque,
              grade: [{ tam: item.tamanho, qtd: item.estoque }]
            });
          }
          return acc;
        }, []);
        setTodosProdutos(grouped);
        setCarregando(false);
      } catch (e) { console.error("Erro ao carregar planilha", e); setCarregando(false); }
    };
    fetchEstoque();
  }, []);

  const produtosFiltrados = todosProdutos.filter(p => {
    const matchBusca = busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.id.toLowerCase().includes(busca.toLowerCase());
    if (!matchBusca) return false;
    if (categoriaAtiva === 'todas') return true;
    if (p.categoria !== categoriaAtiva) return false;
    if (subCategoriaAtiva && p.subcategoria !== subCategoriaAtiva) return false;
    return true;
  });

  const elogiosGosto = ["Escolha impecável! Essa peça exala sofisticação.", "Combinação perfeita com o seu estilo único.", "Sofisticação em cada detalhe. Parabéns!"];

  const adicionarAoCarrinho = (item: any) => {
    setCarrinho(prev => [...prev, item]);
    setNotificacao(elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)]);
    setTimeout(() => setNotificacao(""), 4000);
  };

  const finalizarPedidoWhatsApp = () => {
    let mensagem = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.nome}* (Tam: ${item.tamanhoSelecionado}) - R$ ${item.preco.toFixed(2)}\n`;
    });
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*\n\n_Aguardo seu retorno para combinarmos os detalhes!_`;
    window.open(`https://api.whatsapp.com/send?phone=${foneWhatsAppRaw}&text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans relative overflow-x-hidden">
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />
      
      {/* SACOLA LATERAL RESTAURADA E FUNCIONAL */}
      <SacolaLateral 
        aberto={carrinhoAberto} 
        fechar={() => setCarrinhoAberto(false)} 
        carrinho={carrinho} 
        remover={(idx: number) => setCarrinho(carrinho.filter((_, i) => i !== idx))} 
        finalizar={finalizarPedidoWhatsApp} 
      />

      {/* BOTÕES FLUTUANTES RESTAURADOS */}
      {mostrarTopo && (
        <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-[90px] right-6 w-10 h-10 bg-white text-[#611F3A] border border-zinc-200 rounded-full shadow-lg flex items-center justify-center z-[8900] hover:bg-[#611F3A] hover:text-white transition-all">
          <span className="font-bold text-lg">↑</span>
        </button>
      )}

      <a href={`https://wa.me/${foneWhatsAppRaw}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] flex items-center justify-center z-[9000] hover:scale-110 transition-transform animate-bounce" style={{ animationDuration: '3s' }}>
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12.031 2.007a9.969 9.969 0 00-8.5 15.228l-1.468 5.362 5.485-1.438a9.964 9.964 0 004.483 1.066h.004c5.5 0 9.975-4.475 9.975-9.974 0-2.666-1.038-5.17-2.923-7.054A9.92 9.92 0 0012.031 2.007zm0 16.634c-1.488 0-2.946-.4-4.226-1.157l-.303-.18-3.14.823.84-3.064-.197-.313a8.31 8.31 0 01-1.272-4.44c0-4.582 3.73-8.312 8.312-8.312 2.221 0 4.31.865 5.88 2.435s2.43 3.658 2.43 5.877c0 4.58-3.73 8.31-8.31 8.31zm4.562-6.234c-.25-.125-1.48-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79.98-.146.166-.293.187-.543.062-.25-.125-1.056-.39-2.01-1.242-.74-.662-1.24-1.48-1.386-1.73-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.02-.437-.063-.125-.563-1.355-.772-1.854-.203-.487-.409-.422-.563-.43-.146-.008-.313-.01-.48-.01a.916.916 0 00-.663.308c-.229.25-.875.855-.875 2.083s.896 2.417 1.02 2.583c.125.166 1.762 2.688 4.267 3.77.596.258 1.062.412 1.425.528.598.19 1.141.163 1.57.1.478-.071 1.48-.605 1.688-1.19.21-.584.21-1.085.147-1.19-.063-.105-.23-.167-.48-.292z"/></svg>
      </a>

      {/* NAVEGAÇÃO */}
      <nav className="bg-white sticky top-0 z-[100] border-b border-zinc-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-[#611F3A]">Closet <span className="italic font-light">Dellas</span></h1>
          
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Buscar por nome ou bipar código..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-10 py-2.5 text-xs focus:ring-1 focus:ring-[#611F3A] outline-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setGuiaAberto(true)} className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#611F3A] hover:text-[#D4AF37]">Guia de Medidas</button>
            <button onClick={() => setCarrinhoAberto(true)} className="bg-[#611F3A] text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-[#D4AF37] transition-all">
              👜 Sacola <span className="bg-[#D4AF37] text-white text-[10px] px-1.5 rounded-full">{carrinho.length}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative w-full aspect-[21/9] min-h-[350px] bg-zinc-200 flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&h=700&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Closet Dellas Collection" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 text-left text-white animate-in fade-in slide-in-from-left-4 duration-700">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block text-[#D4AF37]">Curadoria Exclusiva</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
            A elegância que <br /> <span className="italic font-serif">você merece.</span>
          </h2>
        </div>
      </section>

      {/* FILTROS DE CATEGORIAS PÍLULAS (IGUAL À IMAGEM) E COM AS 8 CATEGORIAS */}
      <section className="max-w-7xl mx-auto pt-10 px-6">
        <div className="flex flex-wrap gap-2.5 mb-12 justify-center md:justify-start">
           <button 
             onClick={() => {setCategoriaAtiva('todas'); setSubCategoriaAtiva(null);}} 
             className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase border transition-all ${categoriaAtiva === 'todas' ? 'bg-[#611F3A] text-white border-[#611F3A] shadow-md' : 'bg-white border-zinc-200 text-zinc-600 hover:border-[#611F3A]'}`}
           >
             TODAS
           </button>
           
           {categoriasBase.map(cat => (
             <div key={cat.id} className="relative group/menu">
                <button 
                  onClick={() => {setCategoriaAtiva(cat.id); setSubCategoriaAtiva(null);}} 
                  className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase border transition-all ${categoriaAtiva === cat.id ? 'bg-[#611F3A] text-white border-[#611F3A] shadow-md' : 'bg-white border-zinc-200 text-zinc-600 hover:border-[#611F3A]'}`}
                >
                  {cat.label}
                </button>
                
                {/* SUBMENU DESKTOP HOVER */}
                <div className="absolute top-full left-0 mt-1 bg-white shadow-2xl rounded-lg border border-zinc-100 z-50 w-44 overflow-hidden hidden group-hover/menu:block animate-in fade-in duration-300">
                   {cat.subs.map(sub => (
                     <button key={sub} onClick={() => {setCategoriaAtiva(cat.id); setSubCategoriaAtiva(sub);}} className={`w-full text-left px-5 py-3 text-[10px] font-bold uppercase hover:bg-zinc-50 hover:text-[#D4AF37] border-b last:border-0 border-zinc-50 ${subCategoriaAtiva === sub ? 'text-[#D4AF37] bg-zinc-50' : ''}`}>{sub}</button>
                   ))}
                </div>
             </div>
           ))}
        </div>

        {carregando ? (
          <div className="py-20 text-center animate-pulse text-[#611F3A] font-serif italic">Sincronizando estoque real...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {produtosFiltrados.map(p => (
              <ProdutoCard key={p.id} produto={p} categoriasBase={categoriasBase} abrirDetalhe={setProdutoDetalheAberto} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} />
            ))}
          </div>
        )}
      </section>

      <ModalDetalheProduto aberto={!!produtoDetalheAberto} produto={produtoDetalheAberto} fechar={() => setProdutoDetalheAberto(null)} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} categoriasBase={categoriasBase} />

      {/* RODAPÉ SOFISTICADO RESTAURADO INTEGRALMENTE */}
      <footer className="bg-[#611F3A] pt-16 pb-8 px-6 md:px-12 text-white border-t border-zinc-100 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start text-center md:text-left">
          
          {/* Coluna 1: Essência */}
          <div>
            <h3 className="text-3xl font-serif font-extrabold mb-4">Closet <span className="font-light italic">Dellas</span></h3>
            <p className="text-sm font-light leading-relaxed opacity-80 mb-6 text-balance">
              Nascemos para vestir mulheres reais com elegância e sofisticação. Curadoria feita a dedo.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
               {/* Ícones simplificados */}
               <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Instagram</span>
               <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">TikTok</span>
               <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">WhatsApp</span>
            </div>
          </div>

          {/* Coluna 2: Políticas */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-6 text-xs">Políticas</h4>
            <ul className="flex flex-col gap-3 text-sm font-light opacity-80">
              <li>Trocas e Devoluções</li>
              <li>Prazos e Entregas</li>
              <li>Política de Privacidade</li>
              <li>Termos e Condições</li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-6 text-xs">Atendimento</h4>
            <div className="flex flex-col gap-3 text-sm font-light opacity-80">
              <p>Segunda a Sexta: 09h às 18h</p>
              <p>Sábado: 09h às 13h</p>
              <p className="mt-2"><span className="font-bold">E-mail:</span> contato@closetdellas.com.br</p>
              <p><span className="font-bold">WhatsApp:</span> (21) 97136-6354</p>
            </div>
          </div>

          {/* Coluna 4: Segurança */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-6 text-xs">Pagamento Seguro</h4>
            <p className="text-sm font-light opacity-80 mb-4">Compre com segurança. Aceitamos PIX e cartões de crédito.</p>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start opacity-50">
               <span className="bg-white/10 px-3 py-1.5 rounded text-[10px] font-bold">PIX</span>
               <span className="bg-white/10 px-3 py-1.5 rounded text-[10px] font-bold">VISA</span>
               <span className="bg-white/10 px-3 py-1.5 rounded text-[10px] font-bold">MASTERCARD</span>
            </div>
          </div>

        </div>

        {/* Linha de Copyright */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center flex flex-col items-center justify-center gap-2">
          <p className="text-[10px] uppercase tracking-widest text-white/50">© 2026 Closet Dellas. Todos os direitos reservados. Miguel Pereira - RJ</p>
        </div>
      </footer>
    </main>
  );
}