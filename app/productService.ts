import { Produto, Banner } from './types';

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiXIKGK6tBbAxErk8F6eCYoJPmb7FjK7Yo-UDDVlraJm_Q-8x3ea2EtR4dS9hHkqBbGHEnPZEC6-64/pub?gid=1773071955&single=true&output=csv";
const SHEET_BANNERS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiXIKGK6tBbAxErk8F6eCYoJPmb7FjK7Yo-UDDVlraJm_Q-8x3ea2EtR4dS9hHkqBbGHEnPZEC6-64/pub?gid=1879558148&single=true&output=csv";

const parseValor = (val: string = '') => {
  const num = parseFloat(String(val).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.').trim());
  return Number.isFinite(num) ? num : 0;
};
const parseInteiro = (val: string = '') => parseInt(String(val).replace(/\D/g, ''), 10) || 0;

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(SHEET_BANNERS_URL, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const text = await res.text();
    const rows = text.split('\n').map(r => r.replace(/\r/g, '')).filter(Boolean);
    
    return rows.slice(1).map(row => {
      const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      return {
        imagem: cols[0]?.replace(/(^"|"$)/g, '').trim(),
        tag: cols[1]?.replace(/(^"|"$)/g, '').trim(),
        tituloPrincipal: cols[2]?.replace(/(^"|"$)/g, '').trim(),
        tituloDestaque: cols[3]?.replace(/(^"|"$)/g, '').trim(),
      };
    }).filter(b => b.imagem);
  } catch (e) {
    return [];
  }
}

export async function fetchProdutos(): Promise<Produto[]> {
  try {
    const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 60 } });
    const text = await res.text();
    const rows = text.split('\n').map(r => r.replace(/\r/g, '')).filter(Boolean);

    if (rows.length < 2) return [];

    const rawData = rows.slice(1).map((row) => {
      const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/(^"|"$)/g, '').trim());
      
      const skuAgrupador = cols[0];
      if (!skuAgrupador) return null;
      const imgs = [cols[18], cols[19], cols[20], cols[21], cols[22]].filter(url => url?.startsWith('http'));
      return {
        skuAgrupador,
        skuCompleto: cols[1] || skuAgrupador,
        nome: cols[3],
        categoria: (cols[4] || '').toLowerCase().trim(),
        subcategoria: cols[5],
        cor: cols[6],
        tamanho: cols[7],
        estoque: parseInteiro(cols[10]),
        preco: parseValor(cols[11]),
        precoPromo: parseValor(cols[12]),
        descricao: cols[17] || "",
        imagens: imgs,
        temPromo: parseValor(cols[12]) > 0
      };
    }).filter(Boolean);

    return (rawData as any[]).reduce((acc: Produto[], item: any) => {
      let exist = acc.find((p) => p.id === item.skuAgrupador);

      if (exist) {
        if (item.cor && !exist.cores.includes(item.cor)) exist.cores.push(item.cor);
        exist.grade.push({
          tam: item.tamanho,
          cor: item.cor,
          sku: item.skuCompleto,
          qtd: item.estoque,
        });
        exist.estoqueTotal += item.estoque;
        if (item.precoPromo > 0) {
            exist.temPromo = true;
            exist.precoPromo = item.precoPromo;
        }
      } else {
        acc.push({
          ...item,
          id: item.skuAgrupador,
          cores: item.cor ? [item.cor] : [],
          grade: [{
            tam: item.tamanho,
            cor: item.cor,
            sku: item.skuCompleto,
            qtd: item.estoque,
          }],
          imagens: item.imagens,
          estoqueTotal: item.estoque,
          temPromo: item.precoPromo > 0,
          ehNovidade: true,
        });
      }
      return acc;
    }, []);
  } catch (e) {
    console.error(e);
    return [];
  }
}