'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script'; 
import { fetchProdutos, fetchBanners } from './productService';
import { Produto, Banner } from './types';
import { CATEGORIAS_BASE, FONE_WHATSAPP, GA4_ID, CLARITY_ID } from './constants';
import { otimizarImg } from './utils';

// Importação de Componentes Modulares
import SkeletonCard from './components/SkeletonCard';
import NoResults from './components/NoResults';
import { ModalMedidas, ModalPoliticas } from './components/Modals';
import Notificacao from './components/Notificacao';
import SacolaLateral from './components/SacolaLateral';
import ProdutoCard from './components/ProdutoCard';
import ModalDetalheProduto from './components/ModalDetalheProduto';

export default function Home() {
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [bannersAPI, setBannersAPI] = useState<Banner[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState<boolean>(false);
  const [guiaAberto, setGuiaAberto] = useState<boolean>(false);
  const [notificacao, setNotificacao] = useState<string>("");
  const [sacolaPulse, setSacolaPulse] = useState<boolean>(false);
  const [produtoDetalheAberto, setProdutoDetalheAberto] = useState<Produto | null>(null); 
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas'); 
  const [subCategoriaAtiva, setSubCategoriaAtiva] = useState<string | null>(null);
  const [menuAbertoCat, setMenuAbertoCat] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');
  const [mostrarTopo, setMostrarTopo] = useState<boolean>(false);
  const [bannerAtual, setBannerAtual] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [politicaAberta, setPoliticaAberta] = useState<'trocas' | 'entregas' | 'malinha' | null>(null);

  const bannersFallback = [
    { imagem: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&h=800&fit=crop", tag: "Curadoria de Luxo", tituloPrincipal: "A elegância que", tituloDestaque: "você merece." },
    { imagem: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&h=800&fit=crop", tag: "Novidades Chegando", tituloPrincipal: "Nova coleção", tituloDestaque: "selecionada a dedo." }
  ];

  const bannersExibicao = bannersAPI.length > 0 ? bannersAPI : bannersFallback;

  useEffect(() => {
    async function loadData() {
      const [products, banners] = await Promise.all([fetchProdutos(), fetchBanners()]);
      setTodosProdutos(products);
      setBannersAPI(banners);
      setCarregando(false);
    }
    loadData();
  }, []);

  const produtosFiltrados = todosProdutos.filter(p => {
    const termoBusca = busca.trim().toLowerCase();
    if (termoBusca !== '') return p.nome.toLowerCase().includes(termoBusca) || p.id.toLowerCase().includes(termoBusca);
    if (categoriaAtiva === 'ultimas') return p.estoqueTotal === 1;
    if (categoriaAtiva === 'novidades') return p.ehNovidade;
    const matchCategoria = categoriaAtiva === 'todas' || p.categoria === categoriaAtiva;
    const subP = (p.subcategoria || "").toLowerCase().trim();
    const subAtiva = (subCategoriaAtiva || "").toLowerCase().trim();
    const matchSubcategoria = !subCategoriaAtiva || subP === subAtiva;
    return matchCategoria && matchSubcategoria;
  });

  const adicionarAoCarrinho = (obj) => {
  const adicionarAoCarrinho = (obj: Produto) => {
    // Agora aceita um objeto único para evitar erros de parâmetros entre Card e Modal
    const { id, corSelecionada, tamanhoSelecionado, grade, skuCompleto } = obj;
    const variacao = grade.find(g => (!corSelecionada || g.cor === corSelecionada) && g.tam === tamanhoSelecionado);
    const skuFinal = variacao ? variacao.sku : (skuCompleto || id);
    const skuFinal = variacao ? variacao.sku : (skuCompleto || id || "");

    const item = { ...obj, skuBot: skuFinal };
    setCarrinho(prev => [...prev, item]);
    setNotificacao("Escolha impecável! ✨");
    setSacolaPulse(true);
    setTimeout(() => { setNotificacao(""); setSacolaPulse(false); }, 3000);
  };

  const gerarResumoPedido = (nomeDella, cidadeDella, carrinho) => {
  const gerarResumoPedido = (nomeDella: string, cidadeDella: string, carrinho: Produto[]) => {
    // BLOCO TÉCNICO NO TOPO (Para o Robô)
    let msg = `Venda\n`;
    msg += `Cliente: ${nomeDella.trim()}\n`;
    msg += `Pagamento: A combinar\n`;
    msg += `Desconto: 0%\n`;
    msg += `Itens:\n`;
    carrinho.forEach((item) => {
      msg += `1 ${item.skuBot}\n`;
    });

    // SEPARADOR CRUCIAL (Para o Robô parar de ler)
    msg += `FIM_ITENS\n`; 
    msg += `────────────────────\n\n`;

    // BLOCO HUMANIZADO (Para a Loja)
    msg += `Olá, Closet Dellas! ✨\n`;
    msg += `Me chamo ${nomeDella.trim()} e falo de ${cidadeDella.trim()}.\n`;
    msg += `Acabei de escolher essas peças lindas no site e gostaria de combinar a entrega! 💖`;
    
    return msg;
  };

  const finalizarWhatsApp = (nome, cidade) => {
  const finalizarWhatsApp = (nome: string, cidade: string) => {
    const msg = gerarResumoPedido(nome, cidade, carrinho);
    window.open(`https://api.whatsapp.com/send?phone=${FONE_WHATSAPP}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const finalizarTelegram = async (nome, cidade) => {
  const finalizarTelegram = async (nome: string, cidade: string) => {
    const msg = gerarResumoPedido(nome, cidade, carrinho);
    try {
      await navigator.clipboard.writeText(msg);
    } catch (err) {
      console.error("Erro ao copiar", err);
    }
    window.open(`https://t.me/closetdellas9`, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#FCFBFA] text-zinc-900 font-sans relative overflow-x-hidden pb-24 md:pb-0">
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-25deg); }
          20% { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        .animate-shine {
          animation: shine 4s infinite;
        }
      `}</style>

      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA4_ID}');`}
      </Script>
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_ID}");`}
      </Script>

      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />
      <ModalPoliticas aberto={!!politicaAberta} fechar={() => setPoliticaAberta(null)} tipo={politicaAberta} />
      <SacolaLateral 
        aberto={carrinhoAberto} 
        fechar={() => setCarrinhoAberto(false)} 
        carrinho={carrinho} 
        remover={(idx) => setCarrinho(carrinho.filter((_, i) => i !== idx))} 
        finalizar={finalizarWhatsApp} 
        finalizarTelegram={finalizarTelegram}
      />

      <a href={`https://wa.me/${FONE_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center z-[8000] hover:scale-110 transition-transform animate-bounce" style={{ animationDuration: '3s' }}>
        <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-[100px] right-6 w-12 h-12 bg-white text-[#611F3A] rounded-full shadow-2xl flex items-center justify-center z-[8000] border border-zinc-100 hover:scale-110 transition-all">
      {mostrarTopo && (
        <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-[100px] right-6 w-12 h-12 bg-white text-[#611F3A] rounded-full shadow-2xl flex items-center justify-center z-[8000] border border-zinc-100 hover:scale-110 transition-all shadow-black/10">
          <span className="font-bold text-xl">↑</span>
        </button>
      )}

      <a href={`https://wa.me/${foneWhatsAppRaw}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center z-[8000] hover:scale-110 transition-transform animate-bounce" style={{ animationDuration: '3s' }}>
      <a href={`https://wa.me/${FONE_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center z-[8000] hover:scale-110 transition-transform animate-bounce" style={{ animationDuration: '3s' }}>
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12.031 2.007a9.969 9.969 0 00-8.5 15.228l-1.468 5.362 5.485-1.438a9.964 9.964 0 004.483 1.066h.004c5.5 0 9.975-4.475 9.975-9.974 0-2.666-1.038-5.17-2.923-7.054A9.92 9.92 0 0012.031 2.007zm0 16.634c-1.488 0-2.946-.4-4.226-1.157l-.303-.18-3.14.823.84-3.064-.197-.313a8.31 8.31 0 01-1.272-4.44c0-4.582 3.73-8.312 8.312-8.312 2.221 0 4.31.865 5.88 2.435s2.43 3.658 2.43 5.877c0 4.58-3.73 8.31-8.31 8.31zm4.562-6.234c-.25-.125-1.48-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79.98-.146.166-.293.187-.543.062-.25-.125-1.056-.39-2.01-1.242-.74-.662-1.24-1.48-1.386-1.73-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.02-.437-.063-.125-.563-1.355-.772-1.854-.203-.487-.409-.422-.563-.43-.146-.008-.313-.01-.48-.01a.916.916 0 00-.663.308c-.229.25-.875.855-.875 2.083s.896 2.417 1.02 2.583c.125.166 1.762 2.688 4.267 3.77.596.258 1.062.412 1.425.528.598.19 1.141.163 1.57.1.478-.071 1.48-.605 1.688-1.19.21-.584.21-1.085.147-1.19-.063-.105-.23-.167-.48-.292z"/></svg>
      </a>

      <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-[100] border-b border-zinc-100 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#611F3A] tracking-tighter hover:opacity-80 transition-opacity cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>Closet <span className="italic font-light text-[#D4AF37]">Dellas</span></h1>
          <div className="relative w-full md:w-[450px]">
            <input type="text" placeholder="Pesquisar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full bg-zinc-50 border border-zinc-100 rounded-full px-12 py-3 text-xs focus:bg-white focus:ring-2 focus:ring-[#611F3A]/5 outline-none transition-all placeholder:text-zinc-400" />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20">🔍</span>
            {busca && <button onClick={() => setBusca('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-[#611F3A]">✕</button>}
          </div>
          <div className="hidden md:flex gap-10 items-center">
            <button onClick={() => setGuiaAberto(true)} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#611F3A] hover:text-[#D4AF37] transition-colors">Guia de Medidas</button>
            <button onClick={() => setCarrinhoAberto(true)} className={`bg-[#611F3A] text-white px-8 py-3 rounded-full font-bold text-[10px] flex items-center gap-3 hover:bg-black transition-all relative shadow-lg ${sacolaPulse ? 'scale-105' : ''}`}>
              <span className="text-sm">👜</span> <span className="uppercase tracking-[0.2em]">Sacola</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">{carrinho.length}</span>
            </button>
          </div>
        </div>
      </nav>

      <section className="relative w-full aspect-[28/9] min-h-[315px] bg-zinc-900 overflow-hidden">
        {bannersExibicao.map((banner, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === bannerAtual ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <img 
                  src={otimizarImg(banner.imagem)} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  alt="Banner" 
                  style={{ transform: `translateY(${scrollY * 0.25}px) scale(1.15)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center text-left text-white">
                    <div 
                      className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                      style={{ transform: `translateY(${scrollY * -0.15}px)` }}
                    >
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block text-[#D4AF37]">{banner.tag}</span>
                        <h2 className="text-4xl md:text-7xl font-serif italic mb-8 leading-[1.1] max-w-2xl drop-shadow-2xl">
                          {banner.tituloPrincipal} <br/>
                          <span className="not-italic font-light">{banner.tituloDestaque}</span>
                        </h2>
                    </div>
                </div>
            </div>
        ))}
        {bannersExibicao.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {bannersExibicao.map((_, i) => (
                    <div key={i} onClick={() => setBannerAtual(i)} className={`cursor-pointer rounded-full transition-all ${i === bannerAtual ? 'w-8 h-1.5 bg-[#D4AF37]' : 'w-1.5 h-1.5 bg-white/50'}`} />
                ))}
            </div>
        )}
      </section>

      <section className="bg-white py-8 px-6 md:px-12 border-b border-zinc-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-6 text-[#611F3A]">
          <div className="flex items-center gap-2"><span className="text-lg"></span><p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-70">Parcelamento até 3x</p></div>
          <div className="flex items-center gap-2"><span className="text-lg">🚚</span><p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-70">Frete Cortesia (Região)</p></div>
          <div className="flex items-center gap-2"><span className="text-lg">✨</span><p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-70">Curadoria de Luxo</p></div>
          <div className="flex items-center gap-2"><span className="text-lg">🛍️</span><p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-70">Malinha Delivery</p></div>
        </div>
      </section>

      {/* BANNER MALINHA DELIVERY */}
      <section className="bg-gradient-to-r from-[#611F3A] to-[#8a2b52] py-10 px-6 text-white text-center cursor-pointer hover:opacity-95 transition-opacity" onClick={() => setPoliticaAberta('malinha')}>
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-3xl mb-3">🛍️</span>
          <h3 className="text-2xl font-serif italic mb-2 tracking-wide">Conheça a Malinha Delivery</h3>
          <p className="text-xs font-light opacity-90 uppercase tracking-widest mb-4">Prove as peças no conforto da sua casa antes de decidir.</p>
          <button className="text-[10px] font-bold uppercase tracking-[0.3em] bg-white text-[#611F3A] px-6 py-2 rounded-full hover:bg-[#D4AF37] hover:text-white transition-all shadow-lg">Saiba Como Funciona</button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto pt-16 px-6">
        <div className="flex flex-col gap-8 mb-20 items-center">
          <div className="flex justify-center gap-4 w-full flex-wrap">
            <button onClick={() => { setCategoriaAtiva('ultimas'); setSubCategoriaAtiva(null); }} className={`px-8 md:px-12 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border transition-all duration-500 ${categoriaAtiva === 'ultimas' ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-transparent border-zinc-200 text-zinc-400 hover:border-red-600 hover:text-red-600'}`}>Últimas Peças</button>
            <button onClick={() => { setCategoriaAtiva('novidades'); setSubCategoriaAtiva(null); }} className={`px-8 md:px-12 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border transition-all duration-500 ${categoriaAtiva === 'novidades' ? 'bg-[#611F3A] text-white border-[#611F3A] shadow-lg' : 'bg-transparent border-zinc-200 text-zinc-400 hover:border-[#611F3A] hover:text-[#611F3A]'}`}>Novidades</button>
            <button onClick={() => { setCategoriaAtiva('todas'); setSubCategoriaAtiva(null); }} className={`px-8 md:px-12 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border transition-all duration-500 ${categoriaAtiva === 'todas' ? 'bg-black text-white border-black shadow-lg' : 'bg-transparent border-zinc-200 text-zinc-400 hover:border-black hover:text-black'}`}>Coleção Completa</button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 w-full">
            {categoriasBase.map((cat) => {
              const subsComProduto = cat.subs?.filter(sub => 
                todosProdutos.some(p => 
                  p.categoria === cat.id && 
                  p.subcategoria?.toLowerCase().trim() === sub.toLowerCase().trim()
                )
              ) || [];

              return (
                <div key={cat.id} className={`relative group/menu ${menuAbertoCat === cat.id ? 'z-50' : 'z-10'}`}>
                  {/* Escudo invisível que aparece apenas após o clique para absorver toques fantasmas */}
                  {menuAbertoCat === cat.id && (
                    <div 
                      className="fixed inset-0 z-[190] bg-transparent" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuAbertoCat(null); }}
                    />
                  )}
                  
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuAbertoCat(menuAbertoCat === cat.id ? null : cat.id); 
                      setCategoriaAtiva(cat.id); 
                      setSubCategoriaAtiva(null); 
                    }} 
                    className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] border transition-all duration-300 flex items-center gap-2 relative z-[200] ${categoriaAtiva === cat.id ? 'bg-white text-[#611F3A] border-[#611F3A] shadow-sm' : 'bg-transparent border-zinc-100 text-zinc-400 hover:text-zinc-600'}`}
                  >
                    {cat.label} 
                    {subsComProduto.length > 0 && <span className="text-[8px] opacity-40">{menuAbertoCat === cat.id ? '▲' : '▼'}</span>}
                  </button>

                  {subsComProduto.length > 0 && menuAbertoCat === cat.id && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[210] w-48 animate-in fade-in slide-in-from-top-2">
                      <div className="bg-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-2xl border border-zinc-100 overflow-hidden">
                        {subsComProduto.map((sub) => (
                          <button 
                            key={sub} 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSubCategoriaAtiva(sub);
                              // Fecha o menu imediatamente
                              setMenuAbertoCat(null);
                            }} 
                            className={`w-full text-center px-6 py-4 text-[10px] font-bold uppercase tracking-widest active:bg-zinc-100 transition-colors border-b last:border-0 border-zinc-50 ${subCategoriaAtiva === sub ? 'text-[#D4AF37] bg-zinc-50' : 'text-zinc-500'}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <NoResults mensagem={busca ? `Não encontramos nada para "${busca}".` : `A coleção está sendo atualizada! Volte em breve.`} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 mb-24">
            {produtosFiltrados.map(p => (
              <ProdutoCard key={p.id} produto={p} categoriasBase={categoriasBase} abrirDetalhe={setProdutoDetalheAberto} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} />
            ))}
          </div>
        )}
      </section>

      <ModalDetalheProduto aberto={!!produtoDetalheAberto} produto={produtoDetalheAberto} fechar={() => setProdutoDetalheAberto(null)} adicionarAoCarrinho={adicionarAoCarrinho} setNotificacao={setNotificacao} categoriasBase={categoriasBase} />
      
      <section className="bg-white py-24 px-6 md:px-12 border-t border-zinc-50">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-3xl mb-6 block">✨</span>
          <h3 className="text-3xl md:text-4xl font-serif italic text-[#611F3A] mb-6">Nossa Essência</h3>
          <p className="text-sm md:text-base text-zinc-600 leading-relaxed font-light mb-8 max-w-2xl mx-auto">
            O Closet Dellas nasceu do desejo de trazer as principais tendências da moda para pertinho de você. Cada peça da nossa loja passa por uma curadoria rigorosa, onde avaliamos o caimento, a qualidade do tecido e a versatilidade. Nosso objetivo não é apenas vestir, mas garantir que você se sinta confiante, elegante e exclusiva. Do nosso closet direto para a sua casa, com carinho em cada detalhe da embalagem.
          </p>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto"></div>
        </div>
      </section>

      <footer className="bg-[#611F3A] pt-24 pb-12 px-6 md:px-12 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 items-start text-center md:text-left">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-serif font-extrabold mb-6 tracking-tighter">Closet <span className="italic font-light text-[#D4AF37]">Dellas</span></h3>
            <p className="text-sm font-light leading-relaxed opacity-80 mb-8 md:max-w-xs">Sua curadoria exclusiva das melhores tendências, unindo sofisticação e preço justo para mulheres reais.</p>
            <div className="flex justify-center md:justify-start gap-4 mt-8">
              <a href="https://instagram.com/_closetdellas9" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
              </a>
              <a href={`https://wa.me/${foneWhatsAppRaw}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12.031 2.007a9.969 9.969 0 00-8.5 15.228l-1.468 5.362 5.485-1.438a9.964 9.964 0 004.483 1.066h.004c5.5 0 9.975-4.475 9.975-9.974 0-2.666-1.038-5.17-2.923-7.054A9.92 9.92 0 0012.031 2.007zm0 16.634c-1.488 0-2.946-.4-4.226-1.157l-.303-.18-3.14.823.84-3.064-.197-.313a8.31 8.31 0 01-1.272-4.44c0-4.582 3.73-8.312 8.312-8.312 2.221 0 4.31.865 5.88 2.435s2.43 3.658 2.43 5.877c0 4.58-3.73 8.31-8.31 8.31zm4.562-6.234c-.25-.125-1.48-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.645.813-.79.98-.146.166-.293.187-.543.062-.25-.125-1.056-.39-2.01-1.242-.74-.662-1.24-1.48-1.386-1.73-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.02-.437-.063-.125-.563-1.355-.772-1.854-.203-.487-.409-.422-.563-.43-.146-.008-.313-.01-.48-.01a.916.916 0 00-.663.308c-.229.25-.875.855-.875 2.083s.896 2.417 1.02 2.583c.125.166 1.762 2.688 4.267 3.77.596.258 1.062.412 1.425.528.598.19 1.141.163 1.57.1.478-.071 1.48-.605 1.688-1.19.21-.584.21-1.085.147-1.19-.063-.105-.23-.167-.48-.292z"/></svg>
              </a>
              <a href="https://tiktok.com/@_closetdellas9" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-3.49 2.36-6.45 5.61-7.73.5-.2 1.01-.35 1.53-.47V12.3c-.5.1-.98.27-1.44.51-1.1.58-1.92 1.57-2.13 2.82-.04.28-.05.57-.04.85.02 1.01.35 2.01 1.02 2.75.92 1.07 2.37 1.6 3.77 1.4 1.1-.11 2.1-.73 2.63-1.72.33-.58.46-1.26.46-1.93.02-3.65-.01-7.31.02-10.97z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Políticas</h4>
            <ul className="flex flex-col gap-4 text-xs font-light opacity-80 text-center md:text-left">
              <li onClick={() => setPoliticaAberta('trocas')} className="hover:text-[#D4AF37] cursor-pointer transition-colors">Trocas e Devoluções</li>
              <li onClick={() => setPoliticaAberta('entregas')} className="hover:text-[#D4AF37] cursor-pointer transition-colors">Prazos e Entregas</li>
              <li onClick={() => setPoliticaAberta('malinha')} className="hover:text-[#D4AF37] cursor-pointer transition-colors font-medium">Malinha Delivery ✨</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Atendimento</h4>
            <div className="flex flex-col gap-4 text-xs font-light opacity-80 leading-relaxed">
              <p>Segunda a Sexta: 09h às 18h</p>
              <p>Sábado: 09h às 13h</p>
              <p className="mt-2"><span className="font-bold text-white">WhatsApp:</span> (21) 97136-6354</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 text-[10px]">Pagamento</h4>
            <div className="flex justify-center md:justify-start gap-2 flex-wrap opacity-60">
               <span className="bg-white/10 px-4 py-2 rounded text-[9px] font-bold tracking-widest uppercase">PIX</span>
               <span className="bg-white/10 px-4 py-2 rounded text-[9px] font-bold tracking-widest uppercase">CARTÃO</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">© 2026 Closet Dellas • Eng. Paulo de Frontin - RJ</p>
        </div>
      </footer>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-zinc-100 px-8 py-3 flex justify-between items-center z-[9000] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => { setCategoriaAtiva('todas'); setSubCategoriaAtiva(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-xl">🏠</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Home</span>
        </button>
        
        <button 
          onClick={() => setGuiaAberto(true)}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-xl">📏</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Medidas</span>
        </button>

        <button 
          onClick={() => setCarrinhoAberto(true)}
          className={`relative flex flex-col items-center gap-1 transition-transform ${sacolaPulse ? 'scale-110' : ''}`}
        >
          <div className="relative">
            <span className="text-2xl text-[#611F3A]">👜</span>
            {carrinho.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[8px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold animate-in zoom-in border border-white">
                {carrinho.length}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#611F3A]">Sacola</span>
        </button>
      </div>
    </main>
  );
}