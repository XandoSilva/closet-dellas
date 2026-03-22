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
      setNotificacao("Por favor, selecione um tamanho! 📏");
      return;
    }
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho });
    setTamanho(null);
    fechar();
  };

  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 md:p-8" onClick={fechar}>
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in duration-300 flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-4 right-4 bg-white/50 w-8 h-8 rounded-full flex items-center justify-center text-[#611F3A] hover:bg-zinc-100 text-xl z-50 shadow-sm">✕</button>
        <div className="w-full md:w-1/2 aspect-[3/4] bg-zinc-100">
          <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-2">
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
                    tamanho === item.tam ? 'bg-[#611F3A] text-white border-[#611F3A]' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#611F3A]'
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

function ProdutoCard({ produto, adicionarAoCarrinho, setNotificacao, abrirDetalhe, categoriasBase }: any) {
  const [tamanho, setTamanho] = useState<string | null>(null);
  const esgotado = produto.estoqueTotal <= 0;

  const handleAddCart = () => {
    if (!tamanho) {
      setNotificacao("Selecione um tamanho! ✨");
      return;
    }
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho });
    setTamanho(null);
  };

  return (
    <div className="flex flex-col group relative animate-in fade-in duration-500">
      {esgotado ? (
        <span className="absolute top-3 left-3 bg-zinc-500 text-white text-[8px] uppercase font-bold px-2 py-1 rounded-sm z-10 opacity-90">Esgotado</span>
      ) : produto.estoqueTotal === 1 ? (
        <span className="absolute top-3 left-3 bg-[#611F3A] text-white text-[8px] uppercase font-bold px-2 py-1 rounded-sm z-10 animate-pulse">Última Peça</span>
      ) : null}

      <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-zinc-100 shadow-sm">
        <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity md:flex items-center justify-center hidden">
          <button onClick={() => abrirDetalhe(produto)} className="bg-white text-[#611F3A] px-6 py-3 rounded text-[10px] uppercase font-bold shadow-xl hover:bg-[#611F3A] hover:text-white transition-all">Ver Detalhes</button>
        </div>
      </div>

      <div className="mt-3 text-left">
        <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
          {categoriasBase.find((c:any) => c.id === produto.categoria)?.label} • {produto.subcategoria}
        </p>
        <h4 className="text-xs font-bold text-zinc-800 h-8 overflow-hidden leading-tight mt-1">{produto.nome}</h4>
        <p className="text-sm font-bold text-[#611F3A] mt-1">R$ {produto.preco.toFixed(2)}</p>
        
        <div className="flex gap-1.5 my-3">
          {produto.grade.map((item: any) => (
            <button
              key={item.tam}
              disabled={item.qtd <= 0}
              onClick={() => setTamanho(item.tam)}
              className={`w-7 h-7 rounded-full text-[9px] font-bold border flex items-center justify-center transition-all ${
                item.qtd <= 0 ? 'opacity-20 cursor-not-allowed bg-zinc-100 text-zinc-300' :
                tamanho === item.tam ? 'bg-[#611F3A] text-white border-[#611F3A]' : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#611F3A]'
              }`}
            >
              {item.tam}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => abrirDetalhe(produto)} className="md:hidden flex-1 bg-zinc-900 text-white py-3 rounded text-[9px] uppercase font-bold">Detalhes</button>
          <button onClick={handleAddCart} disabled={esgotado} className="flex-1 bg-[#611F3A] text-white py-3 rounded text-[9px] uppercase font-bold disabled:bg-zinc-200">Add Sacola</button>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  const [todosProdutos, setTodosProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [notificacao, setNotificacao] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [subCategoriaAtiva, setSubCategoriaAtiva] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [produtoDetalheAberto, setProdutoDetalheAberto] = useState<any>(null);
  const [menuAbertoCat, setMenuAbertoCat] = useState<string | null>(null);

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqN7v3UoxhNoKYW56h2kv1D1tju1FawnzYEyaJBnIVeiNO53P49haHNix9voK-i7dLDVSpzss_65IY/pub?output=csv";

  const categoriasBase = [
    { id: 'vestidos', label: 'VESTIDOS', subs: ['Longo', 'Midi', 'Curto'] },
    { id: 'blusas', label: 'BLUSAS', subs: ['Camisas', 'T-shirts', 'Regatas'] },
    { id: 'cropped', label: 'CROPPED', subs: ['Renda', 'Básico'] },
    { id: 'calcas', label: 'CALÇAS', subs: ['Pantalona', 'Jeans'] },
    { id: 'saias', label: 'SAIAS', subs: ['Midi', 'Curta'] },
  ];

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
      } catch (e) { setCarregando(false); }
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

  const adicionarAoCarrinho = (item: any) => {
    setCarrinho(prev => [...prev, item]);
    setNotificacao("Adicionado com sucesso! ✨");
    setTimeout(() => setNotificacao(""), 3000);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans relative overflow-x-hidden">
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      {notificacao && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-2xl z-[9999] border border-[#D4AF37] animate-bounce text-xs font-bold text-[#611F3A]">
          ✨ {notificacao}
        </div>
      )}

      <nav className="bg-white sticky top-0 z-[100] border-b border-zinc-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-serif font-extrabold text-[#611F3A]">Closet <span className="italic font-light">Dellas</span></h1>
          <div className="relative w-full md:w-96">
            <input type="text" placeholder="Buscar por nome ou código..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-10 py-2.5 text-xs focus:ring-1 focus:ring-[#611F3A] outline-none" />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setGuiaAberto(true)} className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#611F3A]">Guia de Medidas</button>
            <button className="bg-[#611F3A] text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2">
              👜 Sacola <span className="bg-[#D4AF37] text-white text-[10px] px-1.5 rounded-full">{carrinho.length}</span>
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto pt-10 px-6">
        <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
           <button onClick={() => {setCategoriaAtiva('todas'); setSubCategoriaAtiva(null); setMenuAbertoCat(null);}} className={`px-6 py-2.5 rounded-full text-[10px] font-bold border ${categoriaAtiva === 'todas' ? 'bg-[#611F3A] text-white' : 'bg-white border-zinc-200 text-zinc-600'}`}>TODAS</button>
           {categoriasBase.map(cat => (
             <div key={cat.id} className="relative group/menu">
                <button onClick={() => {setCategoriaAtiva(cat.id); setSubCategoriaAtiva(null); setMenuAbertoCat(menuAbertoCat === cat.id ? null : cat.id);}} className={`px-6 py-2.5 rounded-full text-[10px] font-bold border flex items-center gap-2 ${categoriaAtiva === cat.id ? 'bg-[#611F3A] text-white' : 'bg-white border-zinc-200 text-zinc-600'}`}>{cat.label}</button>
                <div className={`absolute top-full left-0 mt-1 bg-white shadow-2xl rounded-lg border border-zinc-100 z-50 w-44 overflow-hidden ${menuAbertoCat === cat.id ? 'block' : 'hidden md:group-hover/menu:block'}`}>
                   {cat.subs.map(sub => (
                     <button key={sub} onClick={() => {setCategoriaAtiva(cat.id); setSubCategoriaAtiva(sub); setMenuAbertoCat(null);}} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase hover:bg-zinc-50 border-b last:border-0 border-zinc-50">{sub}</button>
                   ))}
                </div>
             </div>
           ))}
        </div>

        {carregando ? (
          <div className="py-20 text-center animate-pulse text-[#611F3A] font-serif italic">Sincronizando estoque...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {produtosFiltrados.map(p => (
              <ProdutoCard key={p.id} produto={p} categoriasBase={categoriasBase} abrirDetalhe={setProdutoDetalheAberto} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} />
            ))}
          </div>
        )}
      </section>

      <ModalDetalheProduto aberto={!!produtoDetalheAberto} produto={produtoDetalheAberto} fechar={() => setProdutoDetalheAberto(null)} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} categoriasBase={categoriasBase} />

      <footer className="bg-[#611F3A] pt-16 pb-8 px-6 text-white text-center mt-20">
        <h3 className="text-2xl font-serif font-extrabold mb-8 text-[#D4AF37]">Closet Dellas</h3>
        <div className="flex flex-col md:flex-row justify-center gap-8 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <a href="#">Instagram</a><a href="#">TikTok</a><a href="#">WhatsApp</a>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-[9px] opacity-40">© 2026 Closet Dellas • Miguel Pereira - RJ</div>
      </footer>
    </main>
  );
}