'use client';

import { useState, useRef, useEffect } from 'react';

// --- COMPONENTES DE UI/UX (SKELETON E EMPTY STATES) ---

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white p-3 rounded-2xl border border-zinc-100 animate-pulse">
      <div className="aspect-[3/4] rounded-xl bg-zinc-100 mb-4" />
      <div className="h-3 w-1/3 bg-zinc-200 rounded mb-2" />
      <div className="h-4 w-3/4 bg-zinc-200 rounded mb-2" />
      <div className="h-4 w-1/4 bg-zinc-200 rounded mb-4" />
      <div className="flex gap-2 mt-auto">
        <div className="h-10 flex-1 bg-zinc-200 rounded-md" />
        <div className="h-10 flex-1 bg-zinc-200 rounded-md" />
      </div>
    </div>
  );
}

function NoResults({ mensagem }: { mensagem: string }) {
  return (
    <div className="col-span-full py-20 px-6 text-center bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
      <span className="text-5xl mb-6 block">✨</span>
      <h3 className="text-xl font-serif italic text-[#611F3A] mb-2 font-bold uppercase tracking-widest">Quase lá, Della!</h3>
      <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">{mensagem}</p>
    </div>
  );
}

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

function CarrosselProduto({ imagens, nome, isHovered }: { imagens: string[], nome: string, isHovered?: boolean }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const fotosExibir = imagens && imagens.length > 0 ? imagens : ['https://via.placeholder.com/400x600?text=Sem+Foto'];

  // Efeito de Hover Sênior: Troca para a segunda foto se disponível
  const imagemVisivel = (isHovered && fotosExibir.length > 1) ? fotosExibir[1] : fotosExibir[0];

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setFotoAtual(index);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-100 group/fotos rounded-xl">
      <div 
        ref={scrollRef} 
        onScroll={handleScroll} 
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-hidden" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* No Desktop usamos a troca suave, no Mobile mantemos o scroll */}
        <div className="hidden md:block w-full h-full relative">
            <img 
                src={imagemVisivel} 
                alt={nome} 
                className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover/fotos:scale-105" 
            />
        </div>
        <div className="md:hidden flex h-full w-full">
            {fotosExibir.map((img, index) => (
              <img key={index} src={img} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0 snap-center" />
            ))}
        </div>
      </div>
      
      {fotosExibir.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 rounded-full backdrop-blur-sm z-20 pointer-events-none md:hidden">
            {fotosExibir.map((_, index) => (
              <div key={index} className={`w-1.5 h-1.5 rounded-full transition-all ${index === fotoAtual ? 'bg-white scale-110' : 'bg-white/40'}`} />
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
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in duration-300 flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-6 right-6 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center text-[#611F3A] hover:bg-white text-xl z-50 shadow-sm transition-all">✕</button>
        <div className="w-full md:w-1/2 aspect-[3/4] bg-zinc-100">
          <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-bold mb-4">
            {categoriasBase.find((c:any) => c.id === produto.categoria)?.label || 'DIVERSOS'} • {produto.subcategoria}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#611F3A] mb-4 leading-tight">{produto.nome}</h2>
          <p className="text-2xl font-bold text-[#611F3A] mb-8 tracking-tight">R$ {Number(produto.preco).toFixed(2)}</p>
          <div className="h-px w-12 bg-[#D4AF37]/30 mb-8" />
          <p className="text-sm text-zinc-500 mb-10 leading-relaxed font-light">{produto.descricao}</p>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-4">Selecione o Tamanho:</p>
            <div className="flex gap-3 mb-10">
              {produto.grade.map((item: any) => (
                <button 
                  key={item.tam}
                  disabled={item.qtd <= 0}
                  onClick={() => setTamanho(item.tam)}
                  className={`w-12 h-12 rounded-full text-xs font-bold transition-all border-2 ${
                    item.qtd <= 0 ? 'bg-zinc-50 text-zinc-200 border-zinc-100 cursor-not-allowed line-through' :
                    tamanho === item.tam ? 'bg-[#611F3A] text-white border-[#611F3A] scale-110 shadow-lg' : 'bg-white text-zinc-600 border-zinc-100 hover:border-[#611F3A]'
                  }`}
                >
                  {item.tam}
                </button>
              ))}
            </div>
            <button onClick={handleAddCart} className="w-full bg-[#611F3A] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold shadow-xl hover:bg-[#D4AF37] transition-all transform active:scale-95">
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
  const [isHovered, setIsHovered] = useState(false);
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
    <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex flex-col bg-white p-4 rounded-[2rem] border border-transparent transition-all duration-500 hover:border-zinc-100 hover:shadow-[0_30px_60px_rgba(97,31,58,0.1)] relative animate-in fade-in duration-700"
    >
      
      {produto.ehNovidade && !esgotado && (
        <span className="absolute top-7 right-7 bg-[#D4AF37] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-full z-30 shadow-lg">New</span>
      )}

      {esgotado && (
        <span className="absolute top-7 left-7 bg-zinc-400 text-white text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full z-10 shadow-md">Sold Out</span>
      )}

      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-6 shadow-sm cursor-pointer" onClick={() => abrirDetalhe(produto)}>
        <CarrosselProduto imagens={produto.imagens} nome={produto.nome} isHovered={isHovered} />
        <div className="absolute inset-0 bg-[#611F3A]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:flex items-center justify-center hidden">
          <div className="bg-white/95 text-[#611F3A] px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl transition-all transform translate-y-8 group-hover:translate-y-0">
            Quick View
          </div>
        </div>
      </div>

      <div className="text-left px-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold">
                {categoriasBase.find((c:any) => c.id === produto.categoria)?.label || 'DIVERSOS'}
            </p>
            <p className="text-[9px] text-zinc-300 font-medium uppercase tracking-widest">{produto.subcategoria}</p>
        </div>
        <h4 className="text-sm font-serif italic text-zinc-800 leading-tight mb-3 flex-1">{produto.nome}</h4>
        <p className="text-base font-bold text-[#611F3A] tracking-tighter">R$ {Number(produto.preco).toFixed(2)}</p>

        <div className="flex gap-2 my-5 flex-wrap">
          {produto.grade.map((item: any) => (
            <button 
              key={item.tam}
              disabled={item.qtd <= 0}
              onClick={() => setTamanho(item.tam)}
              className={`w-8 h-8 rounded-full text-[9px] font-bold border-2 transition-all ${
                item.qtd <= 0 ? 'bg-zinc-50 text-zinc-200 border-zinc-50 cursor-not-allowed' :
                tamanho === item.tam ? 'bg-[#611F3A] text-white border-[#611F3A] scale-110 shadow-md' : 'bg-white text-zinc-400 border-zinc-100 hover:border-[#611F3A]'
              }`}
            >
              {item.tam}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 mt-auto">
          <button onClick={handleQuickAdd} disabled={esgotado} className="flex-1 bg-[#611F3A] text-white py-4 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold shadow-lg hover:bg-[#D4AF37] transition-all active:scale-95 disabled:bg-zinc-200 disabled:shadow-none">
            {esgotado ? 'Indisponível' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SacolaLateral({ aberto, fechar, carrinho, remover, finalizar }: any) {
  const total = carrinho.reduce((acc: number, item: any) => acc + (Number(item.preco) || 0), 0);

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[10000] transform transition-transform duration-700 ease-in-out flex flex-col ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-8 bg-white border-b border-zinc-100">
          <div>
            <h2 className="text-2xl font-serif italic text-[#611F3A]">Sua Sacola</h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Você tem {carrinho.length} itens</p>
          </div>
          <button onClick={fechar} className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-[#611F3A] transition-colors">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {carrinho.map((item: any, index: number) => {
            const imgCart = item.imagens && item.imagens.length > 0 ? item.imagens[0] : 'https://via.placeholder.com/150?text=Sem+Foto';
            return (
              <div key={index} className="flex gap-6 items-center animate-in fade-in slide-in-from-right-8">
                <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                    <img src={imgCart} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-tight leading-tight">{item.nome}</h4>
                  <p className="text-[10px] text-[#D4AF37] mt-1.5 font-bold uppercase tracking-widest">Tamanho: {item.tamanhoSelecionado}</p>
                  <p className="text-sm font-serif italic text-[#611F3A] mt-2">R$ {Number(item.preco).toFixed(2)}</p>
                </div>
                <button onClick={() => remover(index)} className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 hover:bg-zinc-100 hover:text-red-400 transition-all">✕</button>
              </div>
            );
          })}
          {carrinho.length === 0 && (
            <div className="py-20 text-center">
                <span className="text-4xl block mb-4 grayscale">👜</span>
                <p className="text-xs text-zinc-400 py-10 uppercase tracking-[0.2em] leading-relaxed">Sua sacola está vazia, Della!<br/>Encontre algo incrível na nova coleção.</p>
            </div>
          )}
        </div>

        {carrinho.length > 0 && (
          <div className="p-8 bg-zinc-50 border-t border-zinc-100">
            <div className="flex justify-between mb-8 items-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.3em]">Subtotal Estimado</span>
              <span className="font-serif italic text-3xl text-[#611F3A]">R$ {total.toFixed(2)}</span>
            </div>
            <button onClick={finalizar} className="w-full bg-[#611F3A] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-[#D4AF37] transition-all transform active:scale-95">
              FECHAR PEDIDO NO WHATSAPP
            </button>
          </div>
        )}
      </div>
      {aberto && <div onClick={fechar} className="fixed inset-0 bg-[#611F3A]/20 z-[9000] backdrop-blur-md transition-opacity duration-700" />}
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
  const [sacolaPulse, setSacolaPulse] = useState(false);
  const [produtoDetalheAberto, setProdutoDetalheAberto] = useState<any>(null); 
  const [categoriaAtiva, setCategoriaAtiva] = useState('novidades'); 
  const [subCategoriaAtiva, setSubCategoriaAtiva] = useState<string | null>(null);
  const [menuAbertoCat, setMenuAbertoCat] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [mostrarTopo, setMostrarTopo] = useState(false);

  const foneWhatsAppRaw = "5521971366354";
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqN7v3UoxhNoKYW56h2kv1D1tju1FawnzYEyaJBnIVeiNO53P49haHNix9voK-i7dLDVSpzss_65IY/pub?output=csv";

  const categoriasBase = [
    { id: 'vestidos', label: 'VESTIDOS', subs: ['Longo', 'Midi', 'Curto'] },
    { id: 'blusas', label: 'BLUSAS', subs: ['Camisas', 'T-shirts', 'Regatas', 'Corset'] },
    { id: 'cropped', label: 'CROPPED', subs: ['Renda', 'Manga Longa', 'Básico'] },
    { id: 'calcas', label: 'CALÇAS', subs: ['Pantalona', 'Alfaiataria', 'Jeans'] },
    { id: 'macacao', label: 'MACACÃO', subs: ['Longo', 'Pantacourt'] },
    { id: 'casacos', label: 'CASACOS', subs: ['Blazer', 'Jaqueta', 'Sobretudo'] },
    { id: 'saias', label: 'SAIAS', subs: ['Midi', 'Curta', 'Plissada'] },
    { id: 'shorts', label: 'SHORTS', subs: ['Linho', 'Jeans', 'Alfaiataria'] },
  ];

  const menuCategorias = [
    { id: 'novidades', label: '⭐ NOVIDADES', subs: undefined },
    ...categoriasBase,
    { id: 'todas', label: 'VER TODAS', subs: undefined }
  ];

  useEffect(() => {
    const handleScroll = () => setMostrarTopo(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    let parts: string[] = [];
    if (dateStr.includes('/')) {
      parts = dateStr.split('/');
      if (parts.length === 3) return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    } else if (dateStr.includes('-')) {
      parts = dateStr.split('-');
      if (parts.length === 3) return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    return null;
  };

  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        const text = await res.text();
        const rows = text.split('\n').slice(1);
        const hoje = new Date();
        const limiteNovidadeDias = 20;

        const rawData = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const cleanCol = (col: string) => col ? col.replace(/(^"|"$)/g, '').trim() : '';

          const dataCadastro = parseDate(cleanCol(cols[9]));
          let ehNovidade = false;
          if (dataCadastro) {
            const diffTempo = Math.abs(hoje.getTime() - dataCadastro.getTime());
            const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
            ehNovidade = diffDias <= limiteNovidadeDias;
          }

          const imagensArray = cleanCol(cols[8]).split(';').map(link => link.trim()).filter(Boolean);

          return {
            ref: cleanCol(cols[0]),
            nome: cleanCol(cols[1]),
            categoria: cleanCol(cols[2]).toLowerCase(),
            subcategoria: cleanCol(cols[3]),
            tamanho: cleanCol(cols[4]),
            estoque: parseInt(cleanCol(cols[5])) || 0,
            preco: parseFloat(cleanCol(cols[6]).replace(/\./g, '').replace(',', '.')) || 0,
            descricao: cleanCol(cols[7]),
            imagens: imagensArray,
            ehNovidade: ehNovidade
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
              imagens: item.imagens,
              estoqueTotal: item.estoque,
              ehNovidade: item.ehNovidade,
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
    const termoBusca = busca.trim().toLowerCase();
    if (termoBusca !== '') {
      const matchNome = p.nome.toLowerCase().includes(termoBusca);
      const matchID = p.id.toLowerCase().includes(termoBusca);
      return matchNome || matchID;
    }
    if (categoriaAtiva === 'novidades') return p.ehNovidade;
    if (categoriaAtiva === 'todas') return true;
    const matchCategoria = p.categoria === categoriaAtiva;
    const matchSubcategoria = !subCategoriaAtiva || p.subcategoria === subCategoriaAtiva;
    return matchCategoria && matchSubcategoria;
  });

  const adicionarAoCarrinho = (item: any) => {
    const elogiosGosto = ["Escolha impecável! ✨", "Isso vai ficar incrível em você!", "Sofisticação em cada detalhe."];
    setCarrinho(prev => [...prev, item]);
    setNotificacao(elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)]);
    setSacolaPulse(true);
    setTimeout(() => { setNotificacao(""); setSacolaPulse(false); }, 3000);
  };

  const finalizarPedidoWhatsApp = () => {
    let mensagem = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.nome}* (Tam: ${item.tamanhoSelecionado}) - R$ ${Number(item.preco).toFixed(2)}\n`;
    });
    const total = carrinho.reduce((acc, item) => acc + (Number(item.preco) || 0), 0);
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*\n\n_Aguardo seu retorno!_`;
    window.open(`https://api.whatsapp.com/send?phone=${foneWhatsAppRaw}&text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans relative overflow-x-hidden pb-24 md:pb-0">
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />
      
      <SacolaLateral 
        aberto={carrinhoAberto} 
        fechar={() => setCarrinhoAberto(false)} 
        carrinho={carrinho} 
        remover={(idx: number) => setCarrinho(carrinho.filter((_, i) => i !== idx))} 
        finalizar={finalizarPedidoWhatsApp} 
      />

      {/* HEADER PREMIUM */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-zinc-100 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#611F3A] tracking-tighter">
            Closet <span className="italic font-light text-[#D4AF37]">Dellas</span>
          </h1>
          
          <div className="relative w-full md:w-[450px]">
            <input 
              type="text" 
              placeholder="Encontre sua próxima peça favorita... ✨" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-zinc-50 border-none rounded-full px-12 py-3.5 text-xs focus:ring-2 focus:ring-[#611F3A]/5 outline-none transition-all placeholder:text-zinc-300 shadow-inner"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20">🔍</span>
            {busca && (
              <button onClick={() => setBusca('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-[#611F3A] animate-in fade-in">✕</button>
            )}
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => setGuiaAberto(true)} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#611F3A] hover:text-[#D4AF37] transition-colors">Guia de Medidas</button>
            <button 
                onClick={() => setCarrinhoAberto(true)} 
                className={`bg-[#611F3A] text-white px-8 py-3.5 rounded-full font-bold text-xs flex items-center gap-3 hover:bg-[#D4AF37] transition-all relative shadow-xl ${sacolaPulse ? 'scale-110 ring-4 ring-[#611F3A]/10' : ''}`}
            >
              <span className="text-base">👜</span> 
              <span className="uppercase tracking-widest">Sacola</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">{carrinho.length}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* BARRA MOBILE INFERIOR (App-Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-zinc-100 px-8 py-4 flex justify-between items-center z-[9000] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button onClick={() => {setCategoriaAtiva('novidades'); window.scrollTo({top:0, behavior:'smooth'})}} className="flex flex-col items-center gap-1">
            <span className="text-xl">⭐</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Novas</span>
        </button>
        <button onClick={() => setCarrinhoAberto(true)} className="relative flex flex-col items-center gap-1 -translate-y-6">
            <div className="w-16 h-16 bg-[#611F3A] rounded-full flex items-center justify-center text-white shadow-2xl ring-8 ring-white">
                <span className="text-2xl">👜</span>
                {carrinho.length > 0 && <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce">{carrinho.length}</span>}
            </div>
        </button>
        <button onClick={() => setGuiaAberto(true)} className="flex flex-col items-center gap-1">
            <span className="text-xl">📏</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Medidas</span>
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full aspect-[21/9] min-h-[400px] bg-zinc-200 flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&h=800&fit=crop" className="absolute inset-0 w-full h-full object-cover scale-105" alt="Banner Premium" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-12 text-left text-white animate-in fade-in slide-in-from-left-8 duration-1000">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block text-[#D4AF37]">Curadoria Brás de Luxo</span>
          <h2 className="text-5xl md:text-7xl font-serif italic mb-8 leading-[1.1] max-w-2xl drop-shadow-2xl">
            A elegância que <br /> <span className="not-italic font-light">você merece.</span>
          </h2>
        </div>
      </section>

      {/* FILTROS REFINADOS */}
      <section className="max-w-7xl mx-auto pt-16 px-6">
        <div className="flex flex-wrap gap-3 mb-16 justify-center md:justify-start">
           {menuCategorias.map((cat: any) => (
             <div key={cat.id} className="relative group/menu">
                <button 
                  onClick={() => {
                    setCategoriaAtiva(cat.id); 
                    setSubCategoriaAtiva(null);
                    setMenuAbertoCat(menuAbertoCat === cat.id ? null : cat.id);
                  }} 
                  className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border-2 transition-all duration-500 flex items-center gap-3 ${
                    categoriaAtiva === cat.id 
                    ? 'bg-[#611F3A] text-white border-[#611F3A] shadow-2xl scale-105' 
                    : 'bg-white border-zinc-50 text-zinc-400 hover:border-[#611F3A] hover:text-[#611F3A]'
                  }`}
                >
                  {cat.label} 
                  {cat.subs && <span className="text-[8px] opacity-40">{menuAbertoCat === cat.id ? '▲' : '▼'}</span>}
                </button>
                
                {cat.subs && (
                  <div className={`absolute top-full left-0 mt-3 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-2xl border border-zinc-50 z-50 w-52 overflow-hidden transition-all duration-500 ${menuAbertoCat === cat.id ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none md:group-hover/menu:opacity-100 md:group-hover/menu:translate-y-0'}`}>
                     {cat.subs?.map((sub: string) => (
                       <button 
                         key={sub} 
                         onClick={() => {setCategoriaAtiva(cat.id); setSubCategoriaAtiva(sub); setMenuAbertoCat(null);}} 
                         className={`w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 hover:text-[#D4AF37] transition-colors border-b last:border-0 border-zinc-50 ${subCategoriaAtiva === sub ? 'text-[#D4AF37] bg-zinc-50' : 'text-zinc-500'}`}
                       >
                         {sub}
                       </button>
                     ))}
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* VITRINE */}
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <NoResults 
            mensagem={
              busca 
              ? `Não encontramos nada para "${busca}".` 
              : `A coleção de ${menuCategorias.find(c=>c.id === categoriaAtiva)?.label.replace('⭐ ', '')} está sendo atualizada com peças exclusivas!`
            } 
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 mb-32">
            {produtosFiltrados.map(p => (
              <ProdutoCard key={p.id} produto={p} categoriasBase={categoriasBase} abrirDetalhe={setProdutoDetalheAberto} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} />
            ))}
          </div>
        )}
      </section>

      <ModalDetalheProduto aberto={!!produtoDetalheAberto} produto={produtoDetalheAberto} fechar={() => setProdutoDetalheAberto(null)} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} categoriasBase={categoriasBase} />

      {/* RODAPÉ PREMIUM */}
      <footer className="bg-[#611F3A] pt-24 pb-12 px-12 text-white mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 items-start">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-serif font-extrabold mb-6 tracking-tighter">Closet <span className="italic font-light text-[#D4AF37]">Dellas</span></h3>
            <p className="text-sm font-light leading-relaxed opacity-60 mb-8 max-w-xs">
                Sua curadoria exclusiva das melhores tendências, unindo sofisticação e preço justo.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/_closetdellas9" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-all duration-500">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Políticas</h4>
            <ul className="flex flex-col gap-4 text-xs font-light opacity-60">
              <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Trocas e Devoluções</li>
              <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Prazos e Entregas</li>
              <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Privacidade</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Atendimento</h4>
            <div className="flex flex-col gap-4 text-xs font-light opacity-60 leading-relaxed">
              <p>Segunda a Sexta: 09h às 18h</p>
              <p>Sábado: 09h às 13h</p>
              <p className="mt-4 font-bold text-white">WhatsApp: (21) 97136-6354</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Certificação</h4>
            <p className="text-xs font-light opacity-60 mb-6 leading-relaxed">
                Ambiente 100% seguro para suas escolhas. Pagamento via PIX e Cartões.
            </p>
            <div className="flex gap-2 flex-wrap opacity-30">
               <span className="bg-white/10 px-3 py-1.5 rounded text-[8px] font-bold">PIX</span>
               <span className="bg-white/10 px-3 py-1.5 rounded text-[8px] font-bold">VISA</span>
               <span className="bg-white/10 px-3 py-1.5 rounded text-[8px] font-bold">MASTER</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20">© 2026 Closet Dellas • Handcrafted in Rio de Janeiro</p>
        </div>
      </footer>
    </main>
  );
}