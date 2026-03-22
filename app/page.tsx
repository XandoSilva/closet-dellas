/* eslint-disable */
// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white p-4 rounded-[2rem] border border-zinc-100 animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-zinc-100 mb-6" />
      <div className="h-3 w-1/3 bg-zinc-200 rounded mb-3" />
      <div className="h-5 w-3/4 bg-zinc-200 rounded mb-3" />
      <div className="h-5 w-1/4 bg-zinc-200 rounded mb-6" />
      <div className="h-12 w-full bg-zinc-200 rounded-full mt-auto" />
    </div>
  );
}

function NoResults({ mensagem }) {
  return (
    <div className="col-span-full py-24 px-6 text-center bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200">
      <span className="text-5xl mb-6 block">✨</span>
      <h3 className="text-2xl font-serif italic text-[#611F3A] mb-3 font-bold uppercase tracking-widest">Quase lá, Della!</h3>
      <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">{mensagem}</p>
    </div>
  );
}

function ModalMedidas({ aberto, fechar }) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" onClick={fechar}>
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-6 right-6 bg-zinc-100 w-8 h-8 rounded-full flex items-center justify-center text-[#611F3A] hover:bg-zinc-200 text-xl transition-colors">✕</button>
        <h2 className="text-3xl font-serif italic text-[#611F3A] mb-8 text-center">Guia de Medidas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] md:text-xs uppercase tracking-[0.2em] border-collapse">
            <thead>
              <tr className="border-b border-[#D4AF37]/30 text-[#D4AF37]">
                <th className="py-4">Tamanho</th><th className="py-4">Busto</th><th className="py-4">Cintura</th><th className="py-4">Quadril</th>
              </tr>
            </thead>
            <tbody className="text-[#611F3A]">
              <tr className="border-b border-zinc-50"><td className="py-5 font-bold">P (36/38)</td><td>84-88cm</td><td>66-70cm</td><td>94-98cm</td></tr>
              <tr className="border-b border-zinc-50"><td className="py-5 font-bold">M (40/42)</td><td>92-96cm</td><td>74-78cm</td><td>102-106cm</td></tr>
              <tr className="border-b border-zinc-50"><td className="py-5 font-bold">G (44)</td><td>100-104cm</td><td>82-86cm</td><td>110-114cm</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Notificacao({ mensagem }) {
  if (!mensagem) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-[#D4AF37] px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(97,31,58,0.2)] z-[9999] border border-[#D4AF37]/30 animate-in fade-in slide-in-from-top-4 text-xs font-serif italic font-bold">
      ✨ {mensagem}
    </div>
  );
}

function CarrosselProduto({ imagens, nome }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const scrollRef = useRef(null);
  const fotosExibir = imagens && imagens.length > 0 ? imagens : ['https://via.placeholder.com/400x600?text=Sem+Foto'];

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setFotoAtual(index);
    }
  };

  const scrollTo = (index) => {
    if (scrollRef.current) scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
  };

  const proxima = (e) => { e.preventDefault(); e.stopPropagation(); const n = fotoAtual + 1 >= fotosExibir.length ? 0 : fotoAtual + 1; scrollTo(n); };
  const anterior = (e) => { e.preventDefault(); e.stopPropagation(); const p = fotoAtual === 0 ? fotosExibir.length - 1 : fotoAtual - 1; scrollTo(p); };

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-100 group/fotos rounded-2xl">
      <div ref={scrollRef} onScroll={handleScroll} className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {fotosExibir.map((img, index) => (
            <img key={index} src={img} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0 snap-center transition-transform duration-700 group-hover/fotos:scale-105" />
        ))}
      </div>
      {fotosExibir.length > 1 && (
        <>
          <button onClick={anterior} className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 text-[#611F3A] w-8 h-8 rounded-full items-center justify-center shadow-lg z-30 opacity-0 group-hover/fotos:opacity-100 transition-all hover:scale-110">❮</button>
          <button onClick={proxima} className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 text-[#611F3A] w-8 h-8 rounded-full items-center justify-center shadow-lg z-30 opacity-0 group-hover/fotos:opacity-100 transition-all hover:scale-110">❯</button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 rounded-full backdrop-blur-sm z-20 md:hidden pointer-events-none">
            {fotosExibir.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === fotoAtual ? 'bg-white scale-125' : 'bg-white/40'}`} />)}
          </div>
        </>
      )}
    </div>
  );
}

function ModalDetalheProduto({ produto, aberto, fechar, adicionarAoCarrinho, setNotificacao, categoriasBase }) {
  if (!aberto || !produto) return null;
  const [tamanho, setTamanho] = useState(null);

  const handleAddCart = () => {
    if (!tamanho) return setNotificacao("Por favor, selecione um tamanho disponível! 📏");
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho });
    setTamanho(null);
    fechar();
  };

  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 md:p-8" onClick={fechar}>
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in duration-300 flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-6 right-6 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center text-[#611F3A] hover:bg-zinc-100 text-xl z-50 shadow-sm transition-all">✕</button>
        <div className="w-full md:w-1/2 aspect-[3/4] bg-zinc-100">
          <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-bold mb-4">{categoriasBase.find((c) => c.id === produto.categoria)?.label || 'DIVERSOS'} • {produto.subcategoria}</p>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#611F3A] mb-4 leading-tight">{produto.nome}</h2>
          <p className="text-2xl font-bold text-[#611F3A] mb-8 tracking-tight">R$ {Number(produto.preco).toFixed(2)}</p>
          <div className="h-px w-12 bg-[#D4AF37]/30 mb-8" />
          <p className="text-sm text-zinc-500 mb-10 leading-relaxed font-light">{produto.descricao}</p>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-4">Selecione o Tamanho:</p>
            <div className="flex gap-3 mb-10">
              {produto.grade.map((item) => (
                <button key={item.tam} disabled={item.qtd <= 0} onClick={() => setTamanho(item.tam)} className={`w-12 h-12 rounded-full text-xs font-bold transition-all border-2 ${item.qtd <= 0 ? 'bg-zinc-50 text-zinc-200 border-zinc-100 cursor-not-allowed line-through' : tamanho === item.tam ? 'bg-[#611F3A] text-white border-[#611F3A] scale-110 shadow-lg' : 'bg-white text-zinc-600 border-zinc-100 hover:border-[#611F3A]'}`}>
                  {item.tam}
                </button>
              ))}
            </div>
            <button onClick={handleAddCart} className="w-full bg-[#611F3A] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold shadow-xl hover:bg-[#D4AF37] transition-all transform active:scale-95">Adicionar à Sacola</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProdutoCard({ produto, categoriasBase, adicionarAoCarrinho, setNotificacao, abrirDetalhe }) {
  const [tamanho, setTamanho] = useState(null);
  const esgotado = produto.estoqueTotal <= 0;

  const handleQuickAdd = () => {
    if (!tamanho) return setNotificacao("Selecione um tamanho disponível! ✨");
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho });
    setTamanho(null); 
  };

  return (
    <div className="group flex flex-col bg-white p-4 rounded-[2rem] border border-transparent transition-all duration-500 hover:border-zinc-100 hover:shadow-[0_30px_60px_rgba(97,31,58,0.08)] relative animate-in fade-in duration-700">
      {produto.ehNovidade && !esgotado && <span className="absolute top-7 right-7 bg-[#D4AF37] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-full z-30 shadow-lg">New</span>}
      {esgotado && <span className="absolute top-7 left-7 bg-zinc-400 text-white text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full z-10 shadow-md">Sold Out</span>}
      {!esgotado && produto.estoqueTotal === 1 && <span className="absolute top-7 left-7 bg-[#611F3A] text-white text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full z-10 shadow-md animate-pulse">Última Peça</span>}

      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-6 shadow-sm cursor-pointer" onClick={() => abrirDetalhe(produto)}>
        <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
        <div className="absolute inset-0 bg-[#611F3A]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:flex items-center justify-center hidden">
          <div className="bg-white/95 text-[#611F3A] px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl transition-all transform translate-y-8 group-hover:translate-y-0">Quick View</div>
        </div>
      </div>

      <div className="text-left px-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold">{categoriasBase.find((c) => c.id === produto.categoria)?.label || 'DIVERSOS'}</p>
            <p className="text-[9px] text-zinc-300 font-medium uppercase tracking-widest">{produto.subcategoria}</p>
        </div>
        <h4 className="text-sm font-serif italic text-zinc-800 leading-tight mb-3 flex-1">{produto.nome}</h4>
        <p className="text-base font-bold text-[#611F3A] tracking-tighter">R$ {Number(produto.preco).toFixed(2)}</p>

        <div className="flex gap-2 my-5 flex-wrap">
          {produto.grade.map((item) => (
            <button key={item.tam} disabled={item.qtd <= 0} onClick={() => setTamanho(item.tam)} title={item.qtd <= 0 ? 'Esgotado' : `${item.qtd} unidades`} className={`w-8 h-8 rounded-full text-[9px] font-bold border-2 transition-all ${item.qtd <= 0 ? 'bg-zinc-50 text-zinc-200 border-zinc-50 cursor-not-allowed line-through' : tamanho === item.tam ? 'bg-[#611F3A] text-white border-[#611F3A] scale-110 shadow-md' : 'bg-white text-zinc-400 border-zinc-100 hover:border-[#611F3A]'}`}>
              {item.tam}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 mt-auto">
          <button onClick={() => abrirDetalhe(produto)} className="md:hidden flex-1 bg-zinc-900 text-white py-4 rounded-full text-[9px] uppercase font-bold shadow-lg hover:bg-black transition-colors">Detalhes</button>
          <button onClick={handleQuickAdd} disabled={esgotado} className="flex-1 bg-[#611F3A] text-white py-4 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold shadow-lg hover:bg-[#D4AF37] transition-all active:scale-95 disabled:bg-zinc-200 disabled:shadow-none">{esgotado ? 'Indisponível' : 'Adicionar'}</button>
        </div>
      </div>
    </div>
  );
}

function SacolaLateral({ aberto, fechar, carrinho, remover, finalizar }) {
  const total = carrinho.reduce((acc, item) => acc + (Number(item.preco) || 0), 0);

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[10000] transform transition-transform duration-700 ease-in-out flex flex-col ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-8 bg-white border-b border-zinc-100">
          <div>
            <h2 className="text-2xl font-serif italic text-[#611F3A]">Sua Sacola</h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Você tem {carrinho.length} itens</p>
          </div>
          <button onClick={fechar} className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-[#611F3A] transition-colors rounded-full hover:bg-zinc-50">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {carrinho.map((item, index) => {
            const imgCart = item.imagens && item.imagens.length > 0 ? item.imagens[0] : 'https://via.placeholder.com/150?text=Sem+Foto';
            return (
              <div key={index} className="flex gap-6 items-center animate-in fade-in slide-in-from-right-8">
                <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-sm"><img src={imgCart} className="w-full h-full object-cover" /></div>
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
                <span className="text-4xl block mb-4 grayscale opacity-50">👜</span>
                <p className="text-xs text-zinc-400 py-10 uppercase tracking-[0.2em] leading-relaxed">Sua sacola está vazia, Della!<br/>Encontre algo incrível na nova coleção.</p>
            </div>
          )}
        </div>

        {carrinho.length > 0 && (
          <div className="p-8 bg-zinc-50 border-t border-zinc-100">
            <div className="flex justify-between mb-8 items-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.3em]">Subtotal</span>
              <span className="font-serif italic text-3xl text-[#611F3A]">R$ {total.toFixed(2)}</span>
            </div>
            <button onClick={finalizar} className="w-full bg-[#611F3A] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-[#D4AF37] transition-all transform active:scale-95">FECHAR PEDIDO NO WHATSAPP</button>
          </div>
        )}
      </div>
      {aberto && <div onClick={fechar} className="fixed inset-0 bg-[#611F3A]/20 z-[9000] backdrop-blur-md transition-opacity duration-700" />}
    </>
  );
}

export default function Home() {
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [bannersAPI, setBannersAPI] = useState([]); // NOVO ESTADO DOS BANNERS
  const [carregando, setCarregando] = useState(true);
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [notificacao, setNotificacao] = useState("");
  const [sacolaPulse, setSacolaPulse] = useState(false);
  const [produtoDetalheAberto, setProdutoDetalheAberto] = useState(null); 
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas'); 
  const [subCategoriaAtiva, setSubCategoriaAtiva] = useState(null);
  const [menuAbertoCat, setMenuAbertoCat] = useState(null);
  const [busca, setBusca] = useState('');
  const [mostrarTopo, setMostrarTopo] = useState(false);
  const [bannerAtual, setBannerAtual] = useState(0);

  const foneWhatsAppRaw = "5521971366354";
  
  // URL DO ESTOQUE
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqN7v3UoxhNoKYW56h2kv1D1tju1FawnzYEyaJBnIVeiNO53P49haHNix9voK-i7dLDVSpzss_65IY/pub?output=csv";
  
  // ⚠️ SUA NOVA URL DOS BANNERS VEM AQUI EMBAIXO:
  const SHEET_BANNERS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqN7v3UoxhNoKYW56h2kv1D1tju1FawnzYEyaJBnIVeiNO53P49haHNix9voK-i7dLDVSpzss_65IY/pub?gid=1143291600&single=true&output=csv"; 

  // Banners de segurança (caso a planilha falhe ou esteja vazia)
  const bannersFallback = [
    { imagem: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&h=800&fit=crop", tag: "Curadoria Brás de Luxo", tituloPrincipal: "A elegância que", tituloDestaque: "você merece." },
    { imagem: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&h=800&fit=crop", tag: "Novidades Chegando", tituloPrincipal: "Nova coleção", tituloDestaque: "direto do Brás." }
  ];

  const bannersExibicao = bannersAPI.length > 0 ? bannersAPI : bannersFallback;

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

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerAtual((prev) => (prev + 1 === bannersExibicao.length ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(intervalo);
  }, [bannersExibicao.length]);

  useEffect(() => {
    const handleScroll = () => setMostrarTopo(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    let parts = [];
    if (dateStr.includes('/')) { parts = dateStr.split('/'); if (parts.length === 3) return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])); } 
    else if (dateStr.includes('-')) { parts = dateStr.split('-'); if (parts.length === 3) return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); }
    return null;
  };

  // FETCH DA PLANILHA (AGORA PUXA OS DOIS: ESTOQUE E BANNERS)
  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Puxando Banners
        if(SHEET_BANNERS_URL && SHEET_BANNERS_URL !== "COLE_O_LINK_DO_CSV_DOS_BANNERS_AQUI") {
            const resBanners = await fetch(SHEET_BANNERS_URL);
            const textBanners = await resBanners.text();
            const rowsBanners = textBanners.split('\n').slice(1);
            const parsedBanners = rowsBanners.map(row => {
                const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c ? c.replace(/(^"|"$)/g, '').trim() : '');
                if(cols[0]) return { imagem: cols[0], tag: cols[1] || '', tituloPrincipal: cols[2] || '', tituloDestaque: cols[3] || '' };
                return null;
            }).filter(Boolean);
            if(parsedBanners.length > 0) setBannersAPI(parsedBanners);
        }

        // Puxando Estoque
        const res = await fetch(SHEET_CSV_URL);
        const text = await res.text();
        const rows = text.split('\n').slice(1);
        const hoje = new Date();
        const rawData = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const cleanCol = (col) => col ? col.replace(/(^"|"$)/g, '').trim() : '';
          const dataCadastro = parseDate(cleanCol(cols[9]));
          let ehNovidade = false;
          if (dataCadastro) { const diffDias = Math.ceil(Math.abs(hoje.getTime() - dataCadastro.getTime()) / (1000 * 60 * 60 * 24)); ehNovidade = diffDias <= 20; }
          const imagensArray = cleanCol(cols[8]).split(';').map(link => link.trim()).filter(Boolean);
          return {
            ref: cleanCol(cols[0]), nome: cleanCol(cols[1]), categoria: cleanCol(cols[2]).toLowerCase(),
            subcategoria: cleanCol(cols[3]), tamanho: cleanCol(cols[4]), estoque: parseInt(cleanCol(cols[5])) || 0,
            preco: parseFloat(cleanCol(cols[6]).replace(/\./g, '').replace(',', '.')) || 0,
            descricao: cleanCol(cols[7]), imagens: imagensArray, ehNovidade: ehNovidade
          };
        }).filter(r => r.ref && r.nome);

        const grouped = rawData.reduce((acc, item) => {
          const exist = acc.find(p => p.id === item.ref);
          if (exist) { exist.grade.push({ tam: item.tamanho, qtd: item.estoque }); exist.estoqueTotal += item.estoque; }
          else { acc.push({ id: item.ref, nome: item.nome, categoria: item.categoria, subcategoria: item.subcategoria, preco: item.preco, descricao: item.descricao, imagens: item.imagens, estoqueTotal: item.estoque, ehNovidade: item.ehNovidade, grade: [{ tam: item.tamanho, qtd: item.estoque }] }); }
          return acc;
        }, []);
        setTodosProdutos(grouped);
        setCarregando(false);
      } catch (e) { setCarregando(false); }
    };
    fetchDados();
  }, []);

  const produtosFiltrados = todosProdutos.filter(p => {
    const termoBusca = busca.trim().toLowerCase();
    if (termoBusca !== '') return p.nome.toLowerCase().includes(termoBusca) || p.id.toLowerCase().includes(termoBusca);
    if (categoriaAtiva === 'novidades') return p.ehNovidade;
    if (categoriaAtiva === 'todas') return true;
    return p.categoria === categoriaAtiva && (!subCategoriaAtiva || p.subcategoria === subCategoriaAtiva);
  });

  const adicionarAoCarrinho = (item) => {
    setCarrinho(prev => [...prev, item]);
    setNotificacao("Escolha impecável! ✨");
    setSacolaPulse(true);
    setTimeout(() => { setNotificacao(""); setSacolaPulse(false); }, 3000);
  };

  const finalizarPedidoWhatsApp = () => {
    let msg = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    carrinho.forEach((item, index) => { msg += `${index + 1}. *${item.nome}* (Tam: ${item.tamanhoSelecionado}) - R$ ${Number(item.preco).toFixed(2)}\n`; });
    const total = carrinho.reduce((acc, item) => acc + (Number(item.preco) || 0), 0);
    msg += `\n*Total: R$ ${total.toFixed(2)}*\n\n_Aguardo seu retorno!_`;
    window.open(`https://api.whatsapp.com/send?phone=${foneWhatsAppRaw}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans relative overflow-x-hidden pb-24 md:pb-0">
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />
      <SacolaLateral aberto={carrinhoAberto} fechar={() => setCarrinhoAberto(false)} carrinho={carrinho} remover={(idx) => setCarrinho(carrinho.filter((_, i) => i !== idx))} finalizar={finalizarPedidoWhatsApp} />

      {mostrarTopo && (
        <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-[100px] right-6 w-12 h-12 bg-white text-[#611F3A] rounded-full shadow-2xl flex items-center justify-center z-[8000] border border-zinc-100 hover:scale-110 transition-all">
          <span className="font-bold text-xl">↑</span>
        </button>
      )}

      <a href={`https://wa.me/${foneWhatsAppRaw}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center z-[8000] hover:scale-110 transition-transform animate-bounce" style={{ animationDuration: '3s' }}>
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12.031 2.007a9.969 9.969 0 00-8.5 15.228l-1.468 5.362 5.485-1.438a9.964 9.964 0 004.483 1.066h.004c5.5 0 9.975-4.475 9.975-9.974 0-2.666-1.038-5.17-2.923-7.054A9.92 9.92 0 0012.031 2.007zm0 16.634c-1.488 0-2.946-.4-4.226-1.157l-.303-.18-3.14.823.84-3.064-.197-.313a8.31 8.31 0 01-1.272-4.44c0-4.582 3.73-8.312 8.312-8.312 2.221 0 4.31.865 5.88 2.435s2.43 3.658 2.43 5.877c0 4.58-3.73 8.31-8.31 8.31zm4.562-6.234c-.25-.125-1.48-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79.98-.146.166-.293.187-.543.062-.25-.125-1.056-.39-2.01-1.242-.74-.662-1.24-1.48-1.386-1.73-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.02-.437-.063-.125-.563-1.355-.772-1.854-.203-.487-.409-.422-.563-.43-.146-.008-.313-.01-.48-.01a.916.916 0 00-.663.308c-.229.25-.875.855-.875 2.083s.896 2.417 1.02 2.583c.125.166 1.762 2.688 4.267 3.77.596.258 1.062.412 1.425.528.598.19 1.141.163 1.57.1.478-.071 1.48-.605 1.688-1.19.21-.584.21-1.085.147-1.19-.063-.105-.23-.167-.48-.292z"/></svg>
      </a>

      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-zinc-100 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#611F3A] tracking-tighter">Closet <span className="italic font-light text-[#D4AF37]">Dellas</span></h1>
          <div className="relative w-full md:w-[450px]">
            <input type="text" placeholder="Encontre sua próxima peça favorita... ✨" value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full bg-zinc-50 border-none rounded-full px-12 py-3.5 text-xs focus:ring-2 focus:ring-[#611F3A]/5 outline-none transition-all placeholder:text-zinc-300 shadow-inner" />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20">🔍</span>
            {busca && <button onClick={() => setBusca('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-[#611F3A] animate-in fade-in">✕</button>}
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => setGuiaAberto(true)} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#611F3A] hover:text-[#D4AF37] transition-colors">Guia de Medidas</button>
            <button onClick={() => setCarrinhoAberto(true)} className={`bg-[#611F3A] text-white px-8 py-3.5 rounded-full font-bold text-xs flex items-center gap-3 hover:bg-[#D4AF37] transition-all relative shadow-xl ${sacolaPulse ? 'scale-110 ring-4 ring-[#611F3A]/10' : ''}`}>
              <span className="text-base">👜</span> <span className="uppercase tracking-widest">Sacola</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">{carrinho.length}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-zinc-100 px-8 py-4 flex justify-between items-center z-[9000] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button onClick={() => {setCategoriaAtiva('novidades'); window.scrollTo({top:0, behavior:'smooth'})}} className="flex flex-col items-center gap-1"><span className="text-xl">⭐</span><span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Novas</span></button>
        <button onClick={() => setCarrinhoAberto(true)} className="relative flex flex-col items-center gap-1 -translate-y-6">
            <div className={`w-16 h-16 bg-[#611F3A] rounded-full flex items-center justify-center text-white shadow-2xl ring-8 ring-white transition-transform ${sacolaPulse ? 'scale-110' : ''}`}>
                <span className="text-2xl">👜</span>
                {carrinho.length > 0 && <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce">{carrinho.length}</span>}
            </div>
        </button>
        <button onClick={() => setGuiaAberto(true)} className="flex flex-col items-center gap-1"><span className="text-xl">📏</span><span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Medidas</span></button>
      </div>

      <section className="relative w-full aspect-[21/9] min-h-[400px] bg-zinc-900 overflow-hidden">
        {bannersExibicao.map((banner, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === bannerAtual ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <img src={banner.imagem} className="absolute inset-0 w-full h-full object-cover scale-105" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center text-left text-white">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block text-[#D4AF37]">{banner.tag}</span>
                        <h2 className="text-4xl md:text-7xl font-serif italic mb-8 leading-[1.1] max-w-2xl drop-shadow-2xl">
                          {banner.tituloPrincipal} <br/>
                          <span className="not-italic font-light">{banner.tituloDestaque}</span>
                        </h2>
                    </div>
                </div>
            </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {bannersExibicao.map((_, i) => (
                <div key={i} onClick={() => setBannerAtual(i)} className={`cursor-pointer rounded-full transition-all ${i === bannerAtual ? 'w-8 h-1.5 bg-[#D4AF37]' : 'w-1.5 h-1.5 bg-white/50'}`} />
            ))}
        </div>
      </section>

      <section className="bg-[#F9F6F7] py-6 px-6 md:px-12 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-6 text-[#611F3A]">
          <div className="flex items-center gap-2"><span className="text-xl">💳</span><p className="text-[10px] uppercase font-bold tracking-widest">Parcelamento até 6x</p></div>
          <div className="flex items-center gap-2"><span className="text-xl">🚚</span><p className="text-[10px] uppercase font-bold tracking-widest">Frete Grátis acima de R$399</p></div>
          <div className="flex items-center gap-2"><span className="text-xl">✨</span><p className="text-[10px] uppercase font-bold tracking-widest">Curadoria Exclusiva</p></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto pt-16 px-6">
        <div className="flex flex-col gap-6 mb-16 items-center">
          <div className="flex justify-center gap-4 w-full">
            <button onClick={() => { setCategoriaAtiva('novidades'); setSubCategoriaAtiva(null); }} className={`px-8 md:px-12 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border-2 transition-all duration-500 shadow-sm ${categoriaAtiva === 'novidades' ? 'bg-[#611F3A] text-white border-[#611F3A] shadow-xl scale-105' : 'bg-white border-zinc-100 text-[#611F3A] hover:border-[#611F3A]'}`}>⭐ NOVIDADES</button>
            <button onClick={() => { setCategoriaAtiva('todas'); setSubCategoriaAtiva(null); }} className={`px-8 md:px-12 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border-2 transition-all duration-500 shadow-sm ${categoriaAtiva === 'todas' ? 'bg-[#611F3A] text-white border-[#611F3A] shadow-xl scale-105' : 'bg-white border-zinc-100 text-[#611F3A] hover:border-[#611F3A]'}`}>VER TODAS</button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 w-full">
            {categoriasBase.map((cat) => (
             <div key={cat.id} className="relative group/menu">
                <button onClick={() => { setCategoriaAtiva(cat.id); setSubCategoriaAtiva(null); setMenuAbertoCat(menuAbertoCat === cat.id ? null : cat.id); }} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border-2 transition-all duration-300 flex items-center gap-2 ${categoriaAtiva === cat.id ? 'bg-[#611F3A] text-white border-[#611F3A] shadow-md' : 'bg-white border-zinc-50 text-zinc-400 hover:border-[#611F3A] hover:text-[#611F3A]'}`}>
                  {cat.label} {cat.subs && <span className="text-[8px] opacity-40">{menuAbertoCat === cat.id ? '▲' : '▼'}</span>}
                </button>
                {cat.subs && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-2xl border border-zinc-50 z-50 w-48 overflow-hidden transition-all duration-500 ${menuAbertoCat === cat.id ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none md:group-hover/menu:opacity-100 md:group-hover/menu:translate-y-0'}`}>
                     {cat.subs?.map((sub) => (
                       <button key={sub} onClick={() => {setCategoriaAtiva(cat.id); setSubCategoriaAtiva(sub); setMenuAbertoCat(null);}} className={`w-full text-center px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 hover:text-[#D4AF37] transition-colors border-b last:border-0 border-zinc-50 ${subCategoriaAtiva === sub ? 'text-[#D4AF37] bg-zinc-50' : 'text-zinc-500'}`}>{sub}</button>
                     ))}
                  </div>
                )}
             </div>
            ))}
          </div>
        </div>

        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <NoResults mensagem={busca ? `Não encontramos nada para "${busca}".` : `A coleção está sendo atualizada com peças exclusivas do Brás! Volte em breve.`} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 mb-24">
            {produtosFiltrados.map(p => (
              <ProdutoCard key={p.id} produto={p} categoriasBase={categoriasBase} abrirDetalhe={setProdutoDetalheAberto} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} />
            ))}
          </div>
        )}
      </section>

      <section className="py-24 bg-zinc-50 border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D4AF37] mb-4 block">Comunidade</span>
              <h3 className="text-3xl md:text-4xl font-serif italic text-[#611F3A] mb-12">Dellas que Inspiram</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <div className="aspect-square bg-zinc-200 rounded-2xl overflow-hidden group relative cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=600&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cliente" />
                      <div className="absolute inset-0 bg-[#611F3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-3xl">🤍</span></div>
                  </div>
                  <div className="aspect-square bg-zinc-200 rounded-2xl overflow-hidden group relative cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&h=600&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cliente" />
                      <div className="absolute inset-0 bg-[#611F3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-3xl">🤍</span></div>
                  </div>
                  <div className="aspect-square bg-zinc-200 rounded-2xl overflow-hidden group relative cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1509631179647-0c500fc74151?q=80&w=600&h=600&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cliente" />
                      <div className="absolute inset-0 bg-[#611F3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-3xl">🤍</span></div>
                  </div>
                  <div className="aspect-square bg-zinc-200 rounded-2xl overflow-hidden group relative cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&h=600&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cliente" />
                      <div className="absolute inset-0 bg-[#611F3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-3xl">🤍</span></div>
                  </div>
              </div>

              <a href="https://instagram.com/_closetdellas9" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 border-2 border-[#611F3A] text-[#611F3A] rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#611F3A] hover:text-white transition-all">
                  Siga @_closetdellas9 no Instagram
              </a>
          </div>
      </section>

      <ModalDetalheProduto aberto={!!produtoDetalheAberto} produto={produtoDetalheAberto} fechar={() => setProdutoDetalheAberto(null)} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} categoriasBase={categoriasBase} />

      <footer className="bg-[#611F3A] pt-24 pb-12 px-6 md:px-12 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 items-start text-center md:text-left">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-serif font-extrabold mb-6 tracking-tighter">Closet <span className="italic font-light text-[#D4AF37]">Dellas</span></h3>
            <p className="text-sm font-light leading-relaxed opacity-80 mb-8 md:max-w-xs text-balance">Sua curadoria exclusiva das melhores tendências do Brás, unindo sofisticação e preço justo para mulheres reais.</p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://instagram.com/_closetdellas9" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12.525.02c1.31 0 2.59.32 3.72.93a5.29 5.29 0 0 1-1.3 1.56 5.31 5.31 0 0 1-1.92.93c-.15.04-.15.24-.15.39v9.75a6.45 6.45 0 1 1-6.45-6.45c.18 0 .36.02.53.05.15.03.22-.1.22-.24V3.8c0-.13-.1-.23-.23-.25a8.45 8.45 0 1 0 7.93 8.4V4.54c.48.36 1.02.66 1.6.87a7.51 7.51 0 0 0 2.53.43V2.62c-.75 0-1.48-.15-2.15-.43a5.45 5.45 0 0 1-2.01-1.48c-.12-.13-.3-.12-.32.06l-.02.27V.02h-2z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Políticas</h4>
            <ul className="flex flex-col gap-4 text-xs font-light opacity-80">
              <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Trocas e Devoluções</li>
              <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Prazos e Entregas</li>
              <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Privacidade</li>
              <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Termos e Condições</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Atendimento</h4>
            <div className="flex flex-col gap-4 text-xs font-light opacity-80 leading-relaxed">
              <p>Segunda a Sexta: 09h às 18h</p>
              <p>Sábado: 09h às 13h</p>
              <p className="mt-2"><span className="font-bold text-white">E-mail:</span> contato@closetdellas.com.br</p>
              <p><span className="font-bold text-white">WhatsApp:</span> (21) 97136-6354</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Pagamento Seguro</h4>
            <p className="text-xs font-light opacity-80 mb-6 leading-relaxed">Ambiente 100% seguro para suas compras. Aceitamos PIX e Cartões.</p>
            <div className="flex justify-center md:justify-start gap-2 flex-wrap opacity-60">
               <span className="bg-white/10 px-4 py-2 rounded text-[9px] font-bold tracking-widest uppercase">PIX</span>
               <span className="bg-white/10 px-4 py-2 rounded text-[9px] font-bold tracking-widest uppercase">VISA</span>
               <span className="bg-white/10 px-4 py-2 rounded text-[9px] font-bold tracking-widest uppercase">MASTER</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">© 2026 Closet Dellas • Miguel Pereira - RJ</p>
        </div>
      </footer>
    </main>
  );
}