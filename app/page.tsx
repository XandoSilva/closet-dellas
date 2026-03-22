'use client';

import { useState, useRef, useEffect } from 'react';

// --- COMPONENTES AUXILIARES RESTAURADOS E CORRIGIDOS ---

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

// --- CARD DE PRODUTO INTEGRADO COM PLANILHA E VISUAL ANTERIOR ---
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
        
        {/* Quick View Button (Desktop) */}
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
        
        {/* BOTÕES MOBILE */}
        <div className="flex gap-2">
          <button onClick={() => abrirDetalhe(produto)} className="md:hidden flex-1 bg-zinc-900 text-white py-3 rounded-md text-[9px] uppercase font-bold shadow-md hover:bg-black transition-colors">Detalhes</button>
          <button onClick={handleQuickAdd} disabled={esgotado} className="flex-1 bg-[#611F3A] text-white py-3 rounded-md text-[9px] uppercase font-bold shadow-md hover:bg-[#D4AF37] transition-colors active:scale-95 disabled:bg-zinc-300">Add Sacola</button>
        </div>
      </div>
    </div>
  );
}

// --- NOTIFICAÇÃO RESTAURADA ---
function Notificacao({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-[#D4AF37] px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(97,31,58,0.2)] z-[9999] border border-[#D4AF37]/30 animate-bounce text-xs font-serif italic">
      ✨ {mensagem}
    </div>
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

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqN7v3UoxhNoKYW56h2kv1D1tju1FawnzYEyaJBnIVeiNO53P49haHNix9voK-i7dLDVSpzss_65IY/pub?output=csv";

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

        // Agrupamento por Referência (Grade)
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

  const categoriasBase = [
    { id: 'vestidos', label: 'VESTIDOS', subs: ['Longo', 'Midi', 'Curto'] },
    { id: 'blusas', label: 'BLUSAS', subs: ['Camisas', 'T-shirts', 'Regatas'] },
    { id: 'cropped', label: 'CROPPED', subs: ['Renda', 'Básico'] },
    { id: 'calcas', label: 'CALÇAS', subs: ['Pantalona', 'Jeans'] },
    { id: 'saias', label: 'SAIAS', subs: ['Midi', 'Curta'] },
  ];

  const produtosFiltrados = todosProdutos.filter(p => {
    const matchBusca = busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.id.toLowerCase().includes(busca.toLowerCase());
    if (!matchBusca) return false;
    if (categoriaAtiva === 'todas') return true;
    if (p.categoria !== categoriaAtiva) return false;
    if (subCategoriaAtiva && p.subcategoria !== subCategoriaAtiva) return false;
    return true;
  });

  const elogiosGosto = [
    "Escolha impecável! Essa peça exala sofisticação.",
    "Combinação perfeita com o seu estilo único.",
    "Sofisticação em cada detalhe. Parabéns!"
  ];

  const adicionarAoCarrinho = (item: any) => {
    setCarrinho(prev => [...prev, item]);
    setNotificacao(elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)]);
    setTimeout(() => setNotificacao(""), 4000);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans relative overflow-x-hidden">
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />

      {/* NAV RESTAURADA E INTEGRADA COM BUSCA */}
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
            <button className="bg-[#611F3A] text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-[#D4AF37] transition-all relative">
              👜 Sacola <span className="bg-[#D4AF37] text-white text-[10px] px-1.5 rounded-full">{carrinho.length}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION RESTAURADA */}
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

      {/* FILTROS TIPO PÍLULA RESTAURADOS E CORRIGIDOS (Vide Imagem) */}
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
              Nascemos para vestir mulheres reais com elegância e sofisticação. Curadoriafeita a dedo.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
               {/* Ícones simplificados */}
               <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Instagram</span>
               <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">TikTok</span>
               <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">WhatsApp</span>
            </div>
          </div>

          {/* Coluna 2: Políticas RESTAURADAS */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-6 text-xs">Políticas</h4>
            <ul className="flex flex-col gap-3 text-sm font-light opacity-80">
              <li>Trocas e Devoluções</li>
              <li>Prazos e Entregas</li>
              <li>Política de Privacidade</li>
              <li>Termos e Condições</li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento RESTAURADO */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#D4AF37] mb-6 text-xs">Atendimento</h4>
            <div className="flex flex-col gap-3 text-sm font-light opacity-80">
              <p>Segunda a Sexta: 09h às 18h</p>
              <p>Sábado: 09h às 13h</p>
              <p className="mt-2"><span className="font-bold">E-mail:</span> contato@closetdellas.com.br</p>
              <p><span className="font-bold">WhatsApp:</span> (21) 97136-6354</p>
            </div>
          </div>

          {/* Coluna 4: Segurança RESTAURADA */}
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