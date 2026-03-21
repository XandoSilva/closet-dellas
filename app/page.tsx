'use client';

import { useState } from 'react';

// --- COMPONENTES AUXILIARES ---

// 1. Guia de Medidas (Modal)
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

// 2. Carrossel de Fotos do Produto
function CarrosselProduto({ imagens, nome }: { imagens: string[], nome: string }) {
  const [fotoAtual, setFotoAtual] = useState(0);
  const proximaFoto = () => setFotoAtual((prev) => (prev + 1 === imagens.length ? 0 : prev + 1));
  const fotoAnterior = () => setFotoAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-white mb-6 border border-[#611F3A]/10 shadow-sm rounded-sm group/carrossel">
      <div className="flex h-full w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${fotoAtual * 100}%)` }}>
        {imagens.map((img, index) => (
          <img key={index} src={img} alt={`${nome} - Foto ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" />
        ))}
      </div>
      {imagens.length > 1 && (
        <>
          <button onClick={fotoAnterior} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] p-3 rounded-full text-xs font-bold md:opacity-0 md:group-hover/carrossel:opacity-100 transition-opacity active:scale-90">
            ❮
          </button>
          <button onClick={proximaFoto} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-[#611F3A] p-3 rounded-full text-xs font-bold md:opacity-0 md:group-hover/carrossel:opacity-100 transition-opacity active:scale-90">
            ❯
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/10 rounded-full backdrop-blur-sm">
            {imagens.map((_, index) => (
              <button
                key={index}
                onClick={() => setFotoAtual(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === fotoAtual ? 'bg-[#D4AF37] scale-125' : 'bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// 3. Notificação (Toast)
function Notificacao({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[85%] md:w-auto bg-white/95 backdrop-blur-md text-[#D4AF37] px-8 py-5 rounded-2xl shadow-2xl z-[9999] transform transition-all duration-500 border border-[#D4AF37]/30 animate-in fade-in slide-in-from-top-4">
      <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-center italic font-serif leading-tight">✨ {mensagem}</p>
    </div>
  );
}

// 4. Sacola Lateral
function SacolaLateral({ aberto, fechar, carrinho, remover, finalizar }: { aberto: boolean, fechar: () => void, carrinho: any[], remover: (idx: number) => void, finalizar: () => void }) {
  const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[1000] transform transition-transform duration-500 p-8 border-l border-[#611F3A]/10 ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 border-b border-[#611F3A]/10 pb-6">
          <h2 className="text-2xl font-serif italic text-[#611F3A]">Sua Sacola</h2>
          <button onClick={fechar} className="text-[10px] bg-[#E2AFC1]/20 px-4 py-2 rounded-full uppercase font-bold text-[#611F3A]">Fechar</button>
        </div>
        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
          {carrinho.map((item, index) => (
            <div key={index} className="flex gap-4 border-b border-[#611F3A]/5 pb-4 items-center animate-in fade-in slide-in-from-right-4">
              <img src={item.image} className="w-16 h-20 object-cover rounded-md" />
              <div className="flex-1">
                <h4 className="text-[10px] uppercase font-bold text-[#611F3A]">{item.nome}</h4>
                <p className="text-sm font-serif italic text-[#D4AF37]">R$ {item.preco.toFixed(2)}</p>
              </div>
              <button onClick={() => remover(index)} className="p-2 text-[#611F3A]/20 hover:text-[#611F3A] transition-colors">✕</button>
            </div>
          ))}
          {carrinho.length === 0 && <p className="text-center text-xs text-zinc-300 py-20 uppercase tracking-widest">Sua sacola está vazia</p>}
        </div>
        {carrinho.length > 0 && (
          <div className="absolute bottom-8 left-8 right-8 bg-white pt-6 border-t border-[#D4AF37]/20">
            <div className="flex justify-between mb-6">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Total</span>
              <span className="font-serif italic text-3xl text-[#611F3A]">R$ {total.toFixed(2)}</span>
            </div>
            <button onClick={finalizar} className="w-full bg-[#611F3A] text-white py-5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl active:bg-[#D4AF37] transition-all">
              Finalizar no WhatsApp
            </button>
          </div>
        )}
      </div>
      {aberto && <div onClick={fechar} className="fixed inset-0 bg-[#611F3A]/60 z-[900] backdrop-blur-[2px]" />}
    </>
  );
}

// --- COMPONENTE PRINCIPAL ---

export default function Home() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [notificacao, setNotificacao] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState('vestidos'); // Categoria inicial

  // Dados dos produtos simulados
  const categorias = ['vestidos', 'saia', 'conjuntos', 'blusas', 'cropped'];
  const gerarProdutos = () => {
    const listaProdutos: any[] = [];
    categorias.forEach((categoria, catIndex) => {
      for (let i = 1; i <= 6; i++) {
        listaProdutos.push({
          id: catIndex * 6 + i,
          nome: `${categoria.charAt(0).toUpperCase() + categoria.slice(1)} Elegance ${i}`,
          categoria: categoria,
          preco: 250 + i * 15,
          imagens: [
            `https://source.unsplash.com/featured/?${categoria},fashion,model&sig=${catIndex * 6 + i}-1`,
            `https://source.unsplash.com/featured/?${categoria},style&sig=${catIndex * 6 + i}-2`,
            `https://source.unsplash.com/featured/?fashion,model&sig=${catIndex * 6 + i}-3`,
          ],
        });
      }
    });
    return listaProdutos;
  };
  const todosProdutos = gerarProdutos();

  const elogiosGosto = ["Escolha impecável! ✨", "Que bom gosto! ✨", "Essa peça vai realçar sua essência! ✨"];

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho([...carrinho, { ...produto, image: produto.imagens[0] }]);
    setNotificacao(elogiosGosto[Math.floor(Math.random() * elogiosGosto.length)]);
    setTimeout(() => setNotificacao(""), 4000);
  };

  const totalCarrinho = carrinho.reduce((acc, item) => acc + item.preco, 0);

  const finalizarPedidoWhatsApp = () => {
    const foneWhatsApp = "5521971366354"; 
    let mensagem = `Olá, Closet Dellas! ✨\nGostaria de finalizar meu pedido:\n\n`;
    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. *${item.nome}* - R$ ${item.preco.toFixed(2)}\n`;
    });
    mensagem += `\n*Total: R$ ${totalCarrinho.toFixed(2)}*\n\n_Aguardo seu retorno para combinarmos os detalhes!_`;
    const url = `https://api.whatsapp.com/send?phone=${foneWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#E2AFC1] text-[#611F3A] font-sans relative overflow-x-hidden">
      
      <ModalMedidas aberto={guiaAberto} fechar={() => setGuiaAberto(false)} />
      <Notificacao mensagem={notificacao} />
      <SacolaLateral aberto={carrinhoAberto} fechar={() => setCarrinhoAberto(false)} carrinho={carrinho} remover={(idx) => setCarrinho(carrinho.filter((_, i) => i !== idx))} finalizar={finalizarPedidoWhatsApp} />

      {/* Navegação Principal */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-white/95 sticky top-0 z-[100] border-b border-[#611F3A]/10 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-serif font-extrabold leading-none">Closet <span className="text-[#D4AF37] italic font-light">Dellas</span></h1>
          <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-[#611F3A]/60">Sua moda, seu estilo</span>
        </div>
        <button onClick={() => setCarrinhoAberto(true)} className="relative p-2 bg-[#611F3A]/5 rounded-full">
          <span className="text-2xl">👜</span>
          <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">{carrinho.length}</span>
        </button>
      </nav>

      {/* SECTION HERO - NOVIDADE: Com a imagem sofisticada de fundo */}
      <section 
        className="px-6 py-24 md:py-32 text-center text-white border-b border-[#611F3A]/10 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/hero-sophisticated.jpg')" }}
      >
        {/* Overlay Marsala para melhorar a leitura do texto */}
        <div className="absolute inset-0 bg-[#611F3A]/70 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold mb-4 block underline underline-offset-8">Nova Coleção 2026</span>
          <h2 className="text-4xl md:text-7xl font-extralight mb-10 leading-tight italic font-serif">A elegância que <br /> <span className="text-[#D4AF37]">você merece.</span></h2>
          <button className="bg-[#D4AF37] text-[#611F3A] px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-lg active:scale-95">Conferir Lançamentos</button>
        </div>
      </section>

      {/* Barra de Benefícios */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 bg-white/50 py-10 border-b border-[#611F3A]/10 text-center">
        <div className="flex flex-col items-center"><img src="/images/pix.svg" alt="Pix" className="w-8 h-8 mb-2"/><p className="text-[10px] uppercase font-bold tracking-widest text-[#611F3A]">Até 6x sem juros no Cartão ou Pix</p></div>
        <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-[#611F3A]/10 py-5 md:py-0"><img src="/images/truck.svg" alt="Frete" className="w-8 h-8 mb-2"/><p className="text-[10px] uppercase font-bold tracking-widest text-[#611F3A]">Frete Grátis acima de R$ 399</p></div>
        <div className="flex flex-col items-center"><span className="text-lg mb-1">✨</span><p className="text-[10px] uppercase font-bold tracking-widest text-[#611F3A]">Curadoria Exclusiva</p></div>
      </section>

      {/* VITRINE DE PRODUTOS */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex justify-between items-end mb-12 border-b border-[#611F3A]/10 pb-4">
          <h3 className="text-2xl font-serif italic text-[#611F3A]">Destaques</h3>
          {/* Menu de Categorias */}
          <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold">
            {categorias.map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategoriaAtiva(cat)}
                className={`pb-1 ${categoriaAtiva === cat ? 'text-[#611F3A] border-b-2 border-[#D4AF37]' : 'text-[#611F3A]/50 hover:text-[#611F3A]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos filtrados por categoria */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {todosProdutos.filter(p => p.categoria === categoriaAtiva).map((produto) => (
            <div key={produto.id} className="flex flex-col group animate-in fade-in duration-500">
              <CarrosselProduto imagens={produto.imagens} nome={produto.nome} />
              <div className="text-center group-hover:-translate-y-2 transition-transform duration-500">
                <h4 className="text-[11px] uppercase tracking-widest mb-2 font-semibold text-[#611F3A]/60">{produto.nome}</h4>
                <div className="w-6 h-[2px] bg-[#D4AF37] mx-auto mb-4 group-hover:w-12 transition-all"></div>
                <p className="text-[#611F3A] font-serif italic text-3xl mb-4 group-hover:text-[#D4AF37] transition-colors">R$ {produto.preco.toFixed(2)}</p>
                <div className="flex flex-col gap-3">
                  {/* Botão sempre visível no mobile, animação no desktop */}
                  <button onClick={() => adicionarAoCarrinho(produto)} className="w-full bg-[#611F3A] text-[#D4AF37] py-4 rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold shadow-md active:scale-95 transition-all md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-[#D4AF37] hover:text-white">
                    Adicionar à Sacola
                  </button>
                  <button onClick={() => setGuiaAberto(true)} className="text-[9px] uppercase tracking-widest text-[#611F3A]/40 font-bold underline underline-offset-4 hover:text-[#611F3A] transition-colors">
                    Guia de Medidas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nossa Essência / Quem Somos */}
      <section className="bg-[#611F3A] py-24 px-6 text-center text-white mt-12 border-t-2 border-[#D4AF37]/30">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-serif italic mb-8">Nossa Essência</h3>
          <p className="text-sm md:text-base font-light leading-relaxed mb-10 opacity-90 leading-relaxed">
            O <strong className="text-[#D4AF37] uppercase tracking-widest">Closet Dellas</strong> nasceu para vestir mulheres reais com elegância e sofisticação. Nossa curadoria realça a beleza única que existe em você.
          </p>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-6"></div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">Com carinho, Closet Dellas</p>
        </div>
      </section>

      <footer className="py-20 text-center bg-white border-t border-[#611F3A]/5">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#611F3A]/40 font-bold italic underline decoration-[#D4AF37] underline-offset-8">© 2026 Closet Dellas • Boutique de Luxo</p>
      </footer>
    </main>
  );
}