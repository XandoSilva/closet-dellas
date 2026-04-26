/* eslint-disable */
// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script'; 

// === CONFIGURAÇÃO DE CORES (ADICIONE NOVAS CORES AQUI) ===
const MAPA_CORES = {
  'preto': '#000000',
  'branco': '#FFFFFF',
  'vermelho': '#FF0000',
  'azul': '#0000FF',
  'rosa': '#FFC0CB',
  'verde': '#008000',
  'amarelo': '#FFFF00',
  'fendi': '#A19586',
  'pink': '#FF1493',
  'cinza': '#808080',
  'vinho': '#722F37',
  'fúcsia': '#FF00FF',
  'terracota': '#E2725B',
  'nude': '#E3BC9A',
  'offwhite': '#FAF9F6',
  'lavanda': '#E6E6FA',
  'azul marinho': '#000080',
  'marrom': '#5C4033',
  'bege': '#b3ad7e',
  'dourado': '#D4AF37',
  'prata': '#C0C0C0',
  'azul piscina': '#00BFFF',
  'laranja': '#FFA500',
  'azul turquesa': '#40d5e0',
  'onça': '#D2B48C',
  'areia': '#E1CDA8',
  'verde militar': '#4B5320',
  'verde escuro': '#006400',
  'azul claro': '#ADD8E6',
  'estampas diversas': '#E2E2E2',
};

// === FUNÇÃO AUXILIAR DE OTIMIZAÇÃO (CLOUDINARY) ===
const otimizarImg = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/q_auto,f_auto/');
};

// --- COMPONENTES DE INTERFACE ---

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white p-4 rounded-[2.5rem] border border-zinc-50 animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-zinc-100 mb-6" />
      <div className="h-2 w-1/4 bg-zinc-100 rounded mb-3" />
      <div className="h-4 w-3/4 bg-zinc-100 rounded mb-3" />
      <div className="h-4 w-1/4 bg-zinc-100 rounded mb-6" />
      <div className="h-10 w-full bg-zinc-100 rounded-full mt-auto" />
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

function ModalPoliticas({ aberto, fechar, tipo }) {
  if (!aberto) return null;

  const conteudos = {
    trocas: {
      titulo: "Trocas e Devoluções",
      texto: (
        <div className="space-y-4 text-sm text-zinc-600">
          <p>• <span className="font-bold">Prazo:</span> 7 dias corridos após o recebimento para arrependimento.</p>
          <p>• <span className="font-bold">Condições:</span> Peça com etiqueta original, sem sinais de uso, lavagem ou odores.</p>
          <p>• <span className="font-bold">Defeito:</span> Até 30 dias para comunicar falhas de fabricação.</p>
          <p>• <span className="font-bold">Solicitação:</span> Através do nosso WhatsApp oficial.</p>
        </div>
      )
    },
    entregas: {
      titulo: "Prazos e Entregas",
      texto: (
        <div className="space-y-4 text-sm text-zinc-600">
          <p>• <span className="font-bold">Frete Grátis:</span> Exclusivo para Engenheiro Paulo de Frontin e Mendes.</p>
          <p>• <span className="font-bold">Prazo Local:</span> Entrega em até 24h úteis após o pagamento.</p>
          <p>• <span className="font-bold">Demais localidades:</span> Necessário verificar no nosso WhatsApp.</p>
          <p>• <span className="font-bold">Retirada:</span> Opção de retirada em mãos disponível sob agendamento.</p>
        </div>
      )
    },
    malinha: {
      titulo: "Malinha Delivery",
      texto: (
        <div className="space-y-4 text-sm text-zinc-600">
          <p>O serviço mais amado das nossas Dellas! ✨</p>
          <p>• <span className="font-bold">Como funciona:</span> Você seleciona até 5 peças que deseja provar.</p>
          <p>• <span className="font-bold">Prazo:</span> A malinha fica com você por até 24h.</p>
          <p>• <span className="font-bold">Comodidade:</span> Prove no conforto da sua casa e decida com o que ficar.</p>
          <p>• <span className="font-bold">Taxa:</span> Consulte disponibilidade e taxa para sua região via WhatsApp.</p>
        </div>
      )
    }
  };

  const data = conteudos[tipo] || conteudos.trocas;

  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10001] flex items-center justify-center p-4" onClick={fechar}>
      <div className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl relative animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-6 right-6 bg-zinc-100 w-8 h-8 rounded-full flex items-center justify-center text-[#611F3A] hover:bg-zinc-200 transition-colors">✕</button>
        <h2 className="text-2xl font-serif italic text-[#611F3A] mb-6 text-center">{data.titulo}</h2>
        <div className="leading-relaxed">{data.texto}</div>
        <button onClick={fechar} className="w-full mt-8 bg-[#611F3A] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">Entendi</button>
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

function CarrosselProduto({ imagens, nome, esgotado }) {
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
    <div className={`relative h-full w-full overflow-hidden bg-zinc-50 group/fotos rounded-2xl ${esgotado ? 'grayscale opacity-60' : ''}`}>
      <div ref={scrollRef} onScroll={handleScroll} className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {fotosExibir.map((img, index) => (
            <img key={index} src={otimizarImg(img)} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0 snap-center transition-transform duration-700 group-hover/fotos:scale-105" />
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
  const [cor, setCor] = useState(null);
  const esgotado = produto.estoqueTotal <= 0;

  useEffect(() => {
    setTamanho(null);
    setCor(null);
  }, [produto, aberto]);

  // Extrai cores únicas para os botões
  const coresUnicas = [...new Set(produto.grade.map(item => item.cor))].filter(Boolean);

  // Agrupa os tamanhos baseados na COR selecionada
  const tamanhosAgrupados = produto.grade
    .filter(g => !cor || g.cor === cor)
    .reduce((acc, current) => {
      const existente = acc.find(item => item.tam === current.tam);
      if (!existente) {
        acc.push({ ...current });
      } else {
        existente.qtd += current.qtd;
      }
      return acc;
    }, []);

  // NOVO: Verifica se a cor tem estoque baseado no TAMANHO selecionado
  const isCorEsgotada = (corAlvo) => {
    const variacoes = produto.grade.filter(g => g.cor === corAlvo && (!tamanho || g.tam === tamanho));
    return variacoes.reduce((acc, curr) => acc + curr.qtd, 0) <= 0;
  };

  const handleAviseMe = () => {
    const msg = `Olá Closet Dellas! ✨ Gostaria de ser avisada quando o produto *${produto.nome}* (REF: ${produto.id}) voltar ao estoque! 💖`;
    const foneWhatsAppRaw = "5521971366354";
    window.open(`https://api.whatsapp.com/send?phone=${foneWhatsAppRaw}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddCart = () => {
    if (produto.cores && produto.cores.length > 0 && !cor) return setNotificacao("Selecione uma cor para sua peça! 🎨");
    if (!tamanho) return setNotificacao("Por favor, selecione um tamanho disponível! 📏");
    
    const variacao = produto.grade.find(g => (!cor || g.cor === cor) && g.tam === tamanho);
    
    adicionarAoCarrinho({ 
      ...produto, 
      tamanhoSelecionado: tamanho, 
      corSelecionada: cor,
      skuBot: variacao ? variacao.sku : (produto.skuCompleto || produto.id)
    });

    setTamanho(null);
    setCor(null); 
    fechar();
  };

  return (
    <div className="fixed inset-0 bg-[#611F3A]/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 md:p-8" onClick={fechar}>
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in duration-300 flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        <button onClick={fechar} className="absolute top-6 right-6 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center text-[#611F3A] hover:bg-zinc-100 text-xl z-50 shadow-sm transition-all">✕</button>
        <div className="w-full md:w-1/2 aspect-[3/4] bg-zinc-100">
          <CarrosselProduto imagens={produto.imagens} nome={produto.nome} esgotado={produto.estoqueTotal <= 0} />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-start">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-bold mb-4">
            {categoriasBase.find((c) => c.id === produto.categoria)?.label || 'DIVERSOS'} • {produto.subcategoria}
          </p>
          <h2 className="text-2xl md:text-4xl font-serif italic text-[#611F3A] mb-4 leading-snug break-words whitespace-normal">
            {produto.nome} {esgotado && <span className="text-sm not-italic bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full ml-2 align-middle">ESGOTADO</span>}
          </h2>
          
          {!esgotado && (
            <div className="flex items-center gap-4 mb-8">
              {produto.temPromo ? (
                <>
                  <span className="text-sm line-through text-zinc-300 font-light">R$ {Number(produto.preco).toFixed(2)}</span>
                  <p className="text-3xl font-bold text-red-600 tracking-tighter">R$ {Number(produto.precoPromo).toFixed(2)}</p>
                </>
              ) : (
                <p className="text-3xl font-medium text-[#611F3A] tracking-tighter font-serif">R$ {Number(produto.preco).toFixed(2)}</p>
              )}
            </div>
          )}

          <div className="h-px w-12 bg-[#D4AF37]/30 mb-8" />
          <p className="text-sm text-zinc-500 mb-10 leading-relaxed font-light">
            {produto.descricao}
          </p>
          <div className="mt-auto">
            
            {/* SELEÇÃO DE CORES COM CROSS-FILTERING */}
            {produto.cores && produto.cores.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-4">Selecione a Cor:</p>
                <div className="flex gap-4 flex-wrap">
                  {produto.cores.map((c) => {
                    const corHex = MAPA_CORES[c.toLowerCase().trim()] || '#E2E2E2';
                    const esgotada = isCorEsgotada(c);
                    return (
                      <button 
                        key={c}
                        disabled={esgotada}
                        // NOVO: Clique na mesma cor desmarca ela (toggle)
                        onClick={() => setCor(cor === c ? null : c)}
                        title={esgotada ? `${c} - Indisponível neste tamanho` : c}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative overflow-hidden ${
                          esgotada 
                          ? 'opacity-30 cursor-not-allowed grayscale border-zinc-200' 
                          : cor === c 
                            ? 'ring-2 ring-[#611F3A] ring-offset-2 scale-110 shadow-lg border-white' 
                            : 'border-zinc-100 hover:scale-105'
                        }`}
                        style={{ backgroundColor: corHex }}
                      >
                        {/* Linha vermelha cortando a cor esgotada */}
                        {esgotada && <div className="absolute w-[150%] h-[2px] bg-red-500 rotate-45 z-20"></div>}
                        {!MAPA_CORES[c.toLowerCase().trim()] && <span className="text-[8px] uppercase z-10">{c[0]}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!esgotado ? (
              <>
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-4">Selecione o Tamanho:</p>
                <div className="flex gap-3 mb-10 flex-wrap">
                  {tamanhosAgrupados.map((item) => (
                    <button 
                      key={item.tam} 
                      disabled={item.qtd <= 0} 
                      onClick={() => setTamanho(tamanho === item.tam ? null : item.tam)} 
                      className={`w-12 h-12 rounded-full text-xs font-bold transition-all border-2 ${
                        item.qtd <= 0 
                        ? 'bg-zinc-50 text-zinc-200 border-zinc-100 cursor-not-allowed line-through' 
                        : tamanho === item.tam 
                        ? 'bg-[#611F3A] text-white border-[#611F3A] scale-110 shadow-lg' 
                        : 'bg-white text-zinc-600 border-zinc-100 hover:border-[#611F3A]'
                      }`}
                    >
                      {item.tam}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleAddCart} 
                  className="w-full bg-[#611F3A] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold shadow-xl hover:bg-[#D4AF37] transition-all transform active:scale-95 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent -translate-x-full animate-[shine_4s_infinite] pointer-events-none" />
                  <span className="relative z-10">Adicionar à Sacola</span>
                </button>
              </>
            ) : (
              <button 
                onClick={handleAviseMe} 
                className="w-full bg-zinc-800 text-white py-5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold shadow-xl hover:bg-black transition-all transform active:scale-95"
              >
                Avise-me quando chegar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProdutoCard({ produto, categoriasBase, adicionarAoCarrinho, setNotificacao, abrirDetalhe }) {
  const [tamanho, setTamanho] = useState(null);
  const [cor, setCor] = useState(null);
  const esgotado = produto.estoqueTotal <= 0;

  // AGRUPAMENTO DE TAMANHOS PARA O CARD
  const tamanhosAgrupados = produto.grade
    .filter(g => !cor || g.cor === cor)
    .reduce((acc, current) => {
      const existe = acc.find(item => item.tam.trim() === current.tam.trim());
      if (!existe) acc.push({ ...current });
      else existe.qtd += current.qtd;
      return acc;
    }, []);

  // NOVO: Verifica se a cor tem estoque baseado no TAMANHO selecionado
  const isCorEsgotada = (corAlvo) => {
    const variacoes = produto.grade.filter(g => g.cor === corAlvo && (!tamanho || g.tam === tamanho));
    return variacoes.reduce((acc, curr) => acc + curr.qtd, 0) <= 0;
  };

  const handleAviseMe = (e) => {
    e?.stopPropagation();
    const msg = `Olá Closet Dellas! ✨ Gostaria de ser avisada quando o produto *${produto.nome}* (REF: ${produto.id}) voltar ao estoque! 💖`;
    window.open(`https://wa.me/5521971366354?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleQuickAdd = () => {
    if (produto.cores && produto.cores.length > 0 && !cor) return setNotificacao("Selecione uma cor primeiro! 🎨");
    if (!tamanho) return setNotificacao("Selecione um tamanho disponível! ✨");
    adicionarAoCarrinho({ ...produto, tamanhoSelecionado: tamanho, corSelecionada: cor });
    setTamanho(null); 
    setCor(null); 
  };

  return (
    <div className="group flex flex-col bg-white p-4 rounded-[2.5rem] border border-zinc-50/50 transition-all duration-700 hover:border-zinc-200 hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)] relative animate-in fade-in duration-1000">
      {produto.temPromo && !esgotado && <span className="absolute top-7 right-7 bg-red-600 text-white text-[8px] uppercase tracking-[0.3em] font-bold px-3 py-1.5 rounded-full z-30 shadow-md">Oferta</span>}
      {produto.ehNovidade && !esgotado && !produto.temPromo && <span className="absolute top-7 right-7 bg-[#611F3A] text-white text-[8px] uppercase tracking-[0.3em] font-bold px-3 py-1.5 rounded-full z-30 shadow-md">Novidade</span>}
      
      {esgotado && <span className="absolute top-7 left-7 bg-zinc-800 text-white text-[7px] uppercase tracking-[0.4em] font-bold px-3 py-1.5 rounded-full z-10 shadow-sm opacity-80">Esgotado</span>}
      {!esgotado && produto.estoqueTotal === 1 && <span className="absolute top-7 left-7 bg-[#D4AF37] text-white text-[7px] uppercase tracking-[0.4em] font-bold px-3 py-1.5 rounded-full z-10 shadow-sm animate-pulse">Exclusiva</span>}

      <div className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-6 shadow-sm ${(!produto.imagens || produto.imagens.length === 0 || esgotado) ? 'cursor-default' : 'cursor-pointer'}`} onClick={() => (!produto.imagens || produto.imagens.length === 0 || esgotado) ? null : abrirDetalhe(produto)}>
        <CarrosselProduto imagens={produto.imagens} nome={produto.nome} esgotado={esgotado} />
        {(!produto.imagens || produto.imagens.length === 0) && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="bg-[#611F3A] text-white py-3 transform -rotate-45 font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl border-y border-[#D4AF37]/50 w-[160%] text-center">Em Breve</div>
          </div>
        )}
        {produto.imagens && produto.imagens.length > 0 && !esgotado && (
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none md:flex items-center justify-center hidden">
            <div className="bg-white/95 text-[#611F3A] px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl transition-all transform translate-y-8 group-hover:translate-y-0">Quick View</div>
          </div>
        )}
      </div>

      <div className="text-left px-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold">{categoriasBase.find((c) => c.id === produto.categoria)?.label || 'DIVERSOS'}</p>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest">{produto.subcategoria}</p>
        </div>
        <h4 className="text-base font-serif italic text-zinc-800 leading-tight mb-3 flex-1">{produto.nome}</h4>
        
        {!esgotado && (
          <div className="flex items-baseline gap-2 mb-4">
            {(!produto.imagens || produto.imagens.length === 0) ? (
              <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase">Lançamento em Breve</p>
            ) : produto.temPromo ? (
              <>
                <span className="text-[10px] line-through text-zinc-300">R$ {Number(produto.preco).toFixed(2)}</span>
                <p className="text-lg font-bold text-red-600 tracking-tight">R$ {Number(produto.precoPromo).toFixed(2)}</p>
              </>
            ) : (
              <p className="text-lg font-medium text-[#611F3A] tracking-tight font-serif">R$ {Number(produto.preco).toFixed(2)}</p>
            )}
          </div>
        )}

        {/* SELEÇÃO DE CORES COM CROSS-FILTERING */}
        {produto.cores && produto.cores.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {produto.cores.map((c) => {
              const corHex = MAPA_CORES[c.toLowerCase().trim()] || '#E2E2E2';
              const esgotada = isCorEsgotada(c);
              return (
                <button 
                  key={c} 
                  disabled={esgotada}
                  onClick={() => setCor(cor === c ? null : c)} 
                  title={esgotada ? `${c} (Esgotado)` : c} 
                  className={`w-7 h-7 rounded-full border-2 transition-all relative flex items-center justify-center overflow-hidden ${
                    esgotada 
                    ? 'opacity-30 cursor-not-allowed grayscale border-zinc-200' 
                    : cor === c 
                      ? 'ring-2 ring-[#611F3A] ring-offset-1 scale-110 shadow-md border-white' 
                      : 'border-zinc-50 hover:border-zinc-200'
                  }`} 
                  style={{ backgroundColor: corHex }} 
                >
                  {esgotada && <div className="absolute w-[150%] h-[1.5px] bg-red-500 rotate-45 z-20"></div>}
                </button>
              );
            })}
          </div>
        )}

        {!esgotado && (
          <div className="flex gap-2 mb-5 flex-wrap">
            {tamanhosAgrupados.map((item) => (
              <button 
                key={item.tam} 
                disabled={item.qtd <= 0} 
                onClick={() => setTamanho(tamanho === item.tam ? null : item.tam)} 
                className={`w-9 h-9 rounded-full text-[11px] font-bold border-2 transition-all ${
                  item.qtd <= 0 
                  ? 'bg-transparent text-zinc-200 border-zinc-50 cursor-not-allowed line-through' 
                  : tamanho === item.tam 
                  ? 'bg-[#611F3A] text-white border-[#611F3A] scale-110 shadow-md' 
                  : 'bg-white text-zinc-500 border-zinc-100 hover:border-[#611F3A]'
                }`}
              >
                {item.tam}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 mt-auto">
          {(!produto.imagens || produto.imagens.length === 0) ? (
            <button disabled className="w-full bg-zinc-50 text-zinc-400 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold shadow-none cursor-not-allowed border border-zinc-100">Aguarde o Lançamento</button>
          ) : (
            <>
              {!esgotado && (
                <button onClick={() => abrirDetalhe(produto)} className="md:hidden flex-1 bg-zinc-800 text-white py-4 rounded-full text-[11px] uppercase font-bold shadow-md hover:bg-black transition-colors">Detalhes</button>
              )}
              <button 
                onClick={esgotado ? handleAviseMe : handleQuickAdd} 
                className={`flex-1 py-4 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold shadow-md transition-all active:scale-95 relative overflow-hidden ${esgotado ? 'bg-zinc-50 text-zinc-400 border border-zinc-200 hover:bg-zinc-100' : 'bg-[#611F3A] text-white hover:bg-[#D4AF37]'}`}
              >
                {!esgotado && (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent -translate-x-full animate-[shine_4s_infinite] pointer-events-none" />
                )}
                <span className="relative z-10">{esgotado ? 'Avise-me' : 'Comprar'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SacolaLateral({ aberto, fechar, carrinho, remover, finalizar, finalizarTelegram }) {
  const [nomeDella, setNomeDella] = useState("");
  const [cidadeDella, setCidadeDella] = useState("");
  const [passoCheckout, setPassoCheckout] = useState(1);
  
  const total = carrinho.reduce((acc, item) => {
    const p = item.temPromo ? item.precoPromo : item.preco;
    return acc + (Number(p) || 0);
  }, 0);

  useEffect(() => { if (!aberto) setPassoCheckout(1); }, [aberto]);

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[10000] transform transition-transform duration-700 ease-in-out flex flex-col ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-8 bg-white border-b border-zinc-100">
          <div>
            <h2 className="text-2xl font-serif italic text-[#611F3A]">{passoCheckout === 1 ? 'Sua Sacola' : 'Quase lá! ✨'}</h2>
            {passoCheckout === 1 && <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Você tem {carrinho.length} itens</p>}
          </div>
          <button onClick={fechar} className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-[#611F3A] transition-colors rounded-full hover:bg-zinc-50">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {passoCheckout === 1 ? (
            <>
              {carrinho.map((item, index) => {
                const imgCart = item.imagens && item.imagens.length > 0 ? item.imagens[0] : 'https://via.placeholder.com/150?text=Sem+Foto';
                const precoExibicao = item.temPromo ? item.precoPromo : item.preco;
                return (
                  <div key={index} className="flex gap-6 items-center animate-in fade-in slide-in-from-right-8">
                    <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-sm"><img src={otimizarImg(imgCart)} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-tight leading-tight">{item.nome}</h4>
                      <p className="text-[9px] text-zinc-400 mt-1 uppercase tracking-widest">REF: {item.id}</p>
                      <p className="text-[10px] text-[#D4AF37] mt-1.5 font-bold uppercase tracking-widest">{item.corSelecionada ? `${item.corSelecionada} | ` : ''}Tam: {item.tamanhoSelecionado}</p>
                      <p className={`text-sm font-serif italic mt-2 ${item.temPromo ? 'text-red-600 font-bold' : 'text-[#611F3A]'}`}>R$ {Number(precoExibicao).toFixed(2)}</p>
                    </div>
                    <button onClick={() => remover(index)} className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 hover:bg-zinc-100 hover:text-red-400 transition-all">✕</button>
                  </div>
                );
              })}
              {carrinho.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                    <span className="text-4xl block mb-4 grayscale opacity-50">👜</span>
                    <p className="text-xs text-zinc-400 py-6 uppercase tracking-[0.2em] leading-relaxed">Sua sacola está vazia, Della!</p>
                    <button onClick={fechar} className="bg-[#611F3A] text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#D4AF37] transition-all">
                      Ver Novidades ✨
                    </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col h-full justify-center animate-in fade-in zoom-in duration-500 pb-20 space-y-8">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4 text-center">Como podemos te chamar?</p>
                <input 
                  type="text" 
                  placeholder="Seu nome aqui... ✨" 
                  value={nomeDella}
                  onChange={(e) => setNomeDella(e.target.value)}
                  className="w-full text-center text-2xl font-serif italic text-[#611F3A] border-b-2 border-zinc-100 pb-4 focus:border-[#D4AF37] outline-none transition-colors placeholder:text-zinc-300"
                />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4 text-center">Qual sua cidade?</p>
                <input 
                  type="text" 
                  placeholder="Ex: Frontin, Mendes..." 
                  value={cidadeDella}
                  onChange={(e) => setCidadeDella(e.target.value)}
                  className="w-full text-center text-2xl font-serif italic text-[#611F3A] border-b-2 border-zinc-100 pb-4 focus:border-[#D4AF37] outline-none transition-colors placeholder:text-zinc-300"
                />
              </div>
            </div>
          )}
        </div>

        {carrinho.length > 0 && (
          <div className="p-8 bg-zinc-50 border-t border-zinc-100">
            {passoCheckout === 1 ? (
              <>
                <div className="flex justify-between mb-8 items-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.3em]">Subtotal</span>
                  <span className="font-serif italic text-3xl text-[#611F3A]">R$ {total.toFixed(2)}</span>
                </div>
                <button onClick={() => setPassoCheckout(2)} className="w-full bg-[#611F3A] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-[#D4AF37] transition-all transform active:scale-95">AVANÇAR</button>
              </>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => finalizar(nomeDella, cidadeDella)} 
                  disabled={nomeDella.trim() === "" || cidadeDella.trim() === ""} 
                  className="w-full bg-[#25D366] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#1DA851] transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>💬</span> WhatsApp
                </button>
                <button 
                  onClick={() => finalizarTelegram(nomeDella, cidadeDella)} 
                  disabled={nomeDella.trim() === "" || cidadeDella.trim() === ""} 
                  className="w-full bg-[#0088cc] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#0077b3] transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>✈️</span> Telegram (Copiar e Abrir)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {aberto && <div onClick={fechar} className="fixed inset-0 bg-[#611F3A]/20 z-[9000] backdrop-blur-md transition-opacity duration-700" />}
    </>
  );
}

// --- PÁGINA PRINCIPAL ---

export default function Home() {
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [bannersAPI, setBannersAPI] = useState([]);
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
  const [politicaAberta, setPoliticaAberta] = useState(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const foneWhatsAppRaw = "5521971366354";
  const CLARITY_ID = "w2dhylfktb";
  const GA4_ID = "G-P13JKPTP4E";

  // URLs das planilhas atualizadas
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiXIKGK6tBbAxErk8F6eCYoJPmb7FjK7Yo-UDDVlraJm_Q-8x3ea2EtR4dS9hHkqBbGHEnPZEC6-64/pub?gid=1773071955&single=true&output=csv";
  const SHEET_BANNERS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiXIKGK6tBbAxErk8F6eCYoJPmb7FjK7Yo-UDDVlraJm_Q-8x3ea2EtR4dS9hHkqBbGHEnPZEC6-64/pub?gid=1879558148&single=true&output=csv"; 

  const bannersFallback = [
    { imagem: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&h=800&fit=crop", tag: "Curadoria de Luxo", tituloPrincipal: "A elegância que", tituloDestaque: "você merece." },
    { imagem: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&h=800&fit=crop", tag: "Novidades Chegando", tituloPrincipal: "Nova coleção", tituloDestaque: "selecionada a dedo." }
  ];

  const bannersExibicao = bannersAPI.length > 0 ? bannersAPI : bannersFallback;

  const categoriasBase = [
    { id: 'vestidos', label: 'VESTIDOS', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'blusas', label: 'BLUSAS', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'cropped', label: 'CROPPED', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'calças', label: 'CALÇAS', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'body', label: 'BODY', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'conjuntos', label: 'CONJUNTOS', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'saias', label: 'SAIAS', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'shorts', label: 'SHORTS', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'casacos', label: 'CASACOS', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'acessórios', label: 'ACESSÓRIOS', subs: ['Longo (a)', 'Midi', 'Curto (a)', 'T-shirt', 'Regata', 'Básico', 'Crochê', 'Renda', 'Corset', 'Amarração', 'Pantalona', 'Alfaiataria', 'Jeans', 'Tricô', 'Sobretudo', 'Jaqueta', 'Bobojaco', 'Cintos'] },
    { id: 'em breve', label: '⏳ EM BREVE', subs: [] },
  ];

  useEffect(() => {
    if (bannersExibicao.length <= 1) return;
    const intervalo = setInterval(() => {
      setBannerAtual((prev) => (prev + 1 === bannersExibicao.length ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(intervalo);
  }, [bannersExibicao.length]);

  useEffect(() => {
    const handleScroll = () => setMostrarTopo(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
  const fetchDados = async () => {
    const splitCsvRow = (row: string) =>
      row
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => (c ? c.replace(/(^"|"$)/g, '').trim() : ''));

    const normalizar = (txt: string = '') =>
      txt
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const parseValor = (val: string = '') => {
      if (!val) return 0;
      const limpo = String(val)
        .replace(/[R$\s]/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();

      const num = parseFloat(limpo);
      return Number.isFinite(num) ? num : 0;
    };

    const parseInteiro = (val: string = '') => {
      const num = parseInt(String(val).replace(/\D/g, ''), 10);
      return Number.isFinite(num) ? num : 0;
    };

    const montarIndexCabecalho = (headerRow: string[]) => {
      const mapa: Record<string, number> = {};
      headerRow.forEach((col, idx) => {
        mapa[normalizar(col)] = idx;
      });
      return mapa;
    };

    const acharColuna = (
      headerMap: Record<string, number>,
      aliases: string[],
      fallback?: number
    ) => {
      for (const alias of aliases) {
        const chave = normalizar(alias);
        if (headerMap[chave] !== undefined) return headerMap[chave];
      }
      return fallback ?? -1;
    };

    const valorColuna = (
      cols: string[],
      headerMap: Record<string, number>,
      aliases: string[],
      fallback?: number
    ) => {
      const idx = acharColuna(headerMap, aliases, fallback);
      if (idx < 0) return '';
      return cols[idx] ?? '';
    };

    try {
      // ===== BANNERS =====
      const resBanners = await fetch(SHEET_BANNERS_URL, { next: { revalidate: 60 } });

      if (resBanners.ok) {
        const textBanners = await resBanners.text();
        const rowsBanners = textBanners
          .split('\n')
          .map((r) => r.replace(/\r/g, ''))
          .filter(Boolean);

        const headerBanners = splitCsvRow(rowsBanners[0] || '');
        const headerMapBanners = montarIndexCabecalho(headerBanners);

        const parsedBanners = rowsBanners
          .slice(1)
          .map((row) => {
            const cols = splitCsvRow(row);

            const imagem = valorColuna(cols, headerMapBanners, ['imagem', 'image', 'banner', 'url imagem'], 0);
            const tag = valorColuna(cols, headerMapBanners, ['tag', 'etiqueta', 'chamada'], 1);
            const tituloPrincipal = valorColuna(cols, headerMapBanners, ['titulo principal', 'titulo', 'headline'], 2);
            const tituloDestaque = valorColuna(cols, headerMapBanners, ['titulo destaque', 'subtitulo', 'destaque'], 3);

            if (!imagem) return null;

            return { imagem, tag, tituloPrincipal, tituloDestaque };
          })
          .filter(Boolean);

        setBannersAPI(parsedBanners as any);
      }

      // ===== PRODUTOS =====
      const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 60 } });
      const text = await res.text();

      const rows = text
        .split('\n')
        .map((r) => r.replace(/\r/g, ''))
        .filter(Boolean);

      if (rows.length < 2) {
        setTodosProdutos([]);
        setCarregando(false);
        return;
      }

      // Se sua planilha tiver uma linha extra antes do cabeçalho,
      // ele tenta usar a 2ª linha; caso contrário usa a 1ª.
      let headerRow = splitCsvRow(rows[0]);
      let startDataIndex = 1;

      const headerTemCaraDeCabecalho =
        headerRow.some((h) =>
          [
            'sku',
            'categoria',
            'nome',
            'estoque',
            'preco',
            'preço',
            'descricao',
            'descrição',
          ].includes(normalizar(h))
        );

      if (!headerTemCaraDeCabecalho && rows[1]) {
        headerRow = splitCsvRow(rows[1]);
        startDataIndex = 2;
      }

      const headerMap = montarIndexCabecalho(headerRow);

      const rawData = rows
        .slice(startDataIndex)
        .map((row) => {
          const cols = splitCsvRow(row);

          const skuAgrupador = valorColuna(
            cols,
            headerMap,
            ['sku agrupador', 'sku pai', 'ref agrupadora', 'referencia agrupadora', 'sku'],
            0
          );

          const skuCompleto = valorColuna(
            cols,
            headerMap,
            ['sku completo', 'sku variacao', 'sku variação', 'codigo sku', 'codigo', 'código'],
            1
          );

          const nome = valorColuna(
            cols,
            headerMap,
            ['nome', 'produto', 'nome produto', 'descricao produto'],
            3
          );

          const categoria = valorColuna(
            cols,
            headerMap,
            ['categoria', 'categoria principal'],
            4
          );

          const subcategoria = valorColuna(
            cols,
            headerMap,
            ['subcategoria', 'sub categoria', 'sub-categoria'],
            5
          );

          const cor = valorColuna(
            cols,
            headerMap,
            ['cor', 'cor produto'],
            6
          );

          const tamanho = valorColuna(
            cols,
            headerMap,
            ['tamanho', 'tam', 'grade'],
            7
          );

          // MUDANÇA: Prioridade máxima para a coluna "Disponível" (Estoque Real)
          const estoque = parseInteiro(
            valorColuna(
              cols,
              headerMap,
              ['disponivel', 'disponível', 'estoque', 'qtd estoque', 'quantidade', 'saldo'],
              10
            )
          );

          const preco = parseValor(
            valorColuna(
              cols,
              headerMap,
              ['preco', 'preço', 'valor', 'valor real', 'preco real', 'preço real'],
              11
            )
          );

          const precoPromoBruto = valorColuna(
            cols,
            headerMap,
            ['preco promo', 'preço promo', 'valor promo', 'promocao', 'promoção', 'preco promocional'],
            12
          );

          const tipoPreco = normalizar(
            valorColuna(
              cols,
              headerMap,
              ['tipo preco', 'tipo preço', 'tabela preco', 'tabela preço']
            )
          );

          const ativoSite = normalizar(
            valorColuna(
              cols,
              headerMap,
              ['ativo site', 'site', 'publicar site', 'ativo no site', 'status site'],
              15
            )
          );

          const descricao = valorColuna(
            cols,
            headerMap,
            ['descricao', 'descrição', 'descricao curta', 'descrição curta'],
            17
          );

          const imagens = [
            valorColuna(cols, headerMap, ['imagem 1', 'foto 1', 'url imagem 1'], 18),
            valorColuna(cols, headerMap, ['imagem 2', 'foto 2', 'url imagem 2'], 19),
            valorColuna(cols, headerMap, ['imagem 3', 'foto 3', 'url imagem 3'], 20),
            valorColuna(cols, headerMap, ['imagem 4', 'foto 4', 'url imagem 4'], 21),
            valorColuna(cols, headerMap, ['imagem 5', 'foto 5', 'url imagem 5'], 22),
          ].filter((url) => url && url.startsWith('http'));

          if (!skuAgrupador) return null;

          const siteAtivo =
            ativoSite === '' ||
            ['sim', 's', 'ativo', 'ok', 'true', '1'].includes(ativoSite);

          if (!siteAtivo) return null;

          let precoPromo = parseValor(precoPromoBruto);

          if (!precoPromo && tipoPreco === 'promo') {
            precoPromo = preco;
          }

          return {
            skuAgrupador,
            skuCompleto: skuCompleto || skuAgrupador,
            nome,
            categoria: (categoria || '').toLowerCase().trim(),
            subcategoria,
            cor,
            tamanho,
            estoque,
            preco,
            precoPromo,
            descricao,
            imagens,
          };
        })
        .filter(Boolean);

      const grouped = rawData.reduce((acc: any[], item: any) => {
        if (item.imagens.length === 0) item.categoria = 'em breve';

        let exist = acc.find((p) => p.id === item.skuAgrupador);

        if (exist) {
          if (item.cor && !exist.cores.includes(item.cor)) {
            exist.cores.push(item.cor);
          }

          exist.grade.push({
            tam: item.tamanho,
            cor: item.cor,
            sku: item.skuCompleto,
            qtd: item.estoque,
          });

          exist.estoqueTotal += item.estoque;

          if (!exist.descricao && item.descricao) exist.descricao = item.descricao;
          if ((!exist.imagens || exist.imagens.length === 0) && item.imagens.length > 0) {
            exist.imagens = item.imagens;
          }
          if (!exist.temPromo && item.precoPromo > 0) {
            exist.temPromo = true;
            exist.precoPromo = item.precoPromo;
          }
        } else {
          acc.push({
            ...item,
            id: item.skuAgrupador,
            cores: item.cor ? [item.cor] : [],
            grade: [
              {
                tam: item.tamanho,
                cor: item.cor,
                sku: item.skuCompleto,
                qtd: item.estoque,
              },
            ],
            estoqueTotal: item.estoque,
            temPromo: item.precoPromo > 0,
            ehNovidade: true,
          });
        }

        return acc;
      }, []);

      setTodosProdutos(grouped);
      setCarregando(false);
    } catch (e) {
      console.error('Erro ao buscar dados da planilha:', e);
      setCarregando(false);
    }
  };

  fetchDados();
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
    // Agora aceita um objeto único para evitar erros de parâmetros entre Card e Modal
    const { id, corSelecionada, tamanhoSelecionado, grade, skuCompleto } = obj;
    const variacao = grade.find(g => (!corSelecionada || g.cor === corSelecionada) && g.tam === tamanhoSelecionado);
    const skuFinal = variacao ? variacao.sku : (skuCompleto || id);

    const item = { ...obj, skuBot: skuFinal };
    setCarrinho(prev => [...prev, item]);
    setNotificacao("Escolha impecável! ✨");
    setSacolaPulse(true);
    setTimeout(() => { setNotificacao(""); setSacolaPulse(false); }, 3000);
  };

  const gerarResumoPedido = (nomeDella, cidadeDella, carrinho) => {
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
    const msg = gerarResumoPedido(nome, cidade, carrinho);
    window.open(`https://api.whatsapp.com/send?phone=${foneWhatsAppRaw}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const finalizarTelegram = async (nome, cidade) => {
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

      {mostrarTopo && (
        <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-[100px] right-6 w-12 h-12 bg-white text-[#611F3A] rounded-full shadow-2xl flex items-center justify-center z-[8000] border border-zinc-100 hover:scale-110 transition-all">
          <span className="font-bold text-xl">↑</span>
        </button>
      )}

      <a href={`https://wa.me/${foneWhatsAppRaw}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center z-[8000] hover:scale-110 transition-transform animate-bounce" style={{ animationDuration: '3s' }}>
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