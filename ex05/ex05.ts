// Exercício 05: Caixa do mercado (projeto integrador)
// Conteúdos: parâmetros rest, sobrecarga, for/break/continue, switch, tipo de função

type Formatador = (valor: number) => string;

const campoItens = document.getElementById('itens') as HTMLTextAreaElement;
const campoCupom = document.getElementById('cupom') as HTMLInputElement;
const campoFidelidade = document.getElementById('fidelidade') as HTMLInputElement;
const botao = document.getElementById('fechar') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

const MAX_ITENS = 20;

const formatarReal: Formatador = (valor: number): string => `R$ ${valor.toFixed(2)}`;

// ---------- Regras de negócio ----------

/**
 * Lê um preço por linha (aceita ponto ou vírgula).
 * Linhas vazias são ignoradas sem contar; linhas inválidas são ignoradas e contadas.
 * Para no máximo 20 itens.
 */
function lerPrecos(texto: string): { precos: number[]; ignorados: number } {
  const linhas = texto.split('\n');
  const precos: number[] = [];
  let ignorados = 0;

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();

    // Linha vazia: pula sem contar
    if (linha === '') {
      continue;
    }

    const valor = Number(linha.replace(',', '.'));

    // Linha inválida: pula e conta
    if (!Number.isFinite(valor) || valor <= 0) {
      ignorados++;
      continue;
    }

    precos.push(valor);

    // Chegou ao limite: os itens seguintes são desconsiderados
    if (precos.length >= MAX_ITENS) {
      break;
    }
  }

  return { precos, ignorados };
}

/** Soma qualquer quantidade de preços (parâmetro rest), arredondando para centavos. */
function somarItens(...precos: number[]): number {
  let soma = 0;
  for (const preco of precos) {
    soma += preco;
  }
  return Math.round(soma * 100) / 100;
}

// Sobrecarga: percentual (number) ou código de cupom (string)
function calcularDesconto(total: number, percentual: number): number;
function calcularDesconto(total: number, cupom: string): number;
function calcularDesconto(total: number, regra: number | string): number {
  if (typeof regra === 'number') {
    // Forma percentual (usada na fidelidade)
    return (total * regra) / 100;
  }

  // Forma cupom
  switch (regra.trim().toUpperCase()) {
    case 'BEMVINDO':
      return total * 0.1;
    case 'PROMO20':
      return total * 0.2;
    case 'MENOS15':
      return total >= 100 ? 15 : 0;
    default:
      return 0;
  }
}

// ---------- Página ----------

botao.addEventListener('click', () => {
  const { precos, ignorados } = lerPrecos(campoItens.value);

  if (precos.length === 0) {
    saida.textContent = 'Nenhum item válido';
    saida.className = 'erro';
    return;
  }

  const subtotal = somarItens(...precos);

  const cupom = campoCupom.value.trim();
  const descontoCupom = cupom !== '' ? calcularDesconto(subtotal, cupom) : 0;
  const comCupom = subtotal - descontoCupom;

  const descontoFidelidade = campoFidelidade.checked ? calcularDesconto(comCupom, 5) : 0;
  const total = comCupom - descontoFidelidade;

  const textoIgnorados =
    ignorados > 0 ? ` (${ignorados} ${ignorados === 1 ? 'linha ignorada' : 'linhas ignoradas'})` : '';

  let texto = `Itens: ${precos.length}${textoIgnorados}\n`;
  texto += `Subtotal: ${formatarReal(subtotal)}\n`;

  if (cupom !== '') {
    texto +=
      descontoCupom > 0
        ? `Cupom ${cupom.toUpperCase()}: - ${formatarReal(descontoCupom)}\n`
        : 'Cupom inválido ou não aplicável\n';
  }

  if (campoFidelidade.checked) {
    texto += `Fidelidade (5%): - ${formatarReal(descontoFidelidade)}\n`;
  }

  texto += `Total a pagar: ${formatarReal(total)}`;

  saida.textContent = texto;
  saida.className = 'sucesso';
});
