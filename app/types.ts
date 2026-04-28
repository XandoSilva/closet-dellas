export interface GradeItem {
  tam: string;
  cor: string;
  sku: string;
  qtd: number;
}

export interface Produto {
  id: string;
  skuAgrupador: string;
  skuCompleto: string;
  nome: string;
  preco: number;
  precoPromo: number;
  temPromo: boolean;
  imagens: string[];
  estoqueTotal: number;
  grade: GradeItem[];
  categoria: string;
  subcategoria: string;
  descricao: string;
  cores: string[];
  ehNovidade: boolean;
  tamanhoSelecionado?: string | null;
  corSelecionada?: string | null;
  skuBot?: string;
}

export interface Banner {
  imagem: string;
  tag: string;
  tituloPrincipal: string;
  tituloDestaque: string;
}

export interface CategoriaBase {
  id: string;
  label: string;
  subs: string[];
}