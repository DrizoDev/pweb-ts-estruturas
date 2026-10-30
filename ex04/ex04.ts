// Exercício 04: Meta de economia
// Conteúdos: while, break, tipo de função, parâmetro padrão

type Formatador = (valor: number) => string;

type ResultadoEconomia = { meses: number; saldo: number; depositado: number };

const campoMeta = document.getElementById('meta') as HTMLInputElement;
const campoDeposito = document.getElementById('deposito') as HTMLInputElement;
const campoTaxa = document.getElementById('taxa') as HTMLInputElement;
const botao = document.getElementById('calcular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

const LIMITE_MESES = 600; // 50 anos

// ---------- Formatadores (seguem o tipo Formatador) ----------

const formatarReal: Formatador = (valor: number): string => `R$ ${valor.toFixed(2)}`;

/** Ex.: 19 -> "1 ano e 7 meses", 25 -> "2 anos e 1 mês", 8 -> "8 meses". */
const formatarMeses = (meses: number): string => {
  const anos = Math.floor(meses / 12);
  const resto = meses % 12;

  const textoAnos = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  const textoMeses = `${resto} ${resto === 1 ? 'mês' : 'meses'}`;

  if (anos === 0) {
    return textoMeses;
  }
  return resto === 0 ? textoAnos : `${textoAnos} e ${textoMeses}`;
};

// ---------- Regras de negócio ----------

/**
 * Simula mês a mês: o saldo rende e depois entra o depósito.
 * Nos meses 12, 24, 36... o depósito é dobrado (13º salário).
 * A taxa (em %) tem valor padrão de 0,5.
 */
function calcularMeses(meta: number, deposito: number, taxa: number = 0.5): ResultadoEconomia {
  let saldo = 0;
  let depositado = 0;
  let meses = 0;

  while (saldo < meta) {
    meses++;

    const valorDepositado = meses % 12 === 0 ? deposito * 2 : deposito;
    saldo = saldo * (1 + taxa / 100) + valorDepositado;
    depositado += valorDepositado;

    // Meta inalcançável: para após 600 meses
    if (meses >= LIMITE_MESES) {
      break;
    }
  }

  return { meses, saldo, depositado };
}

/** Monta uma linha "rótulo: valor", usando a função de formatação recebida. */
function exibirValor(rotulo: string, valor: number, formatar: Formatador): string {
  return `${rotulo}: ${formatar(valor)}`;
}

// ---------- Página ----------

botao.addEventListener('click', () => {
  const meta = campoMeta.valueAsNumber;
  const deposito = campoDeposito.valueAsNumber;

  // Também cobre campos vazios (NaN)
  if (!(meta > 0) || !(deposito > 0)) {
    saida.textContent = 'Informe valores positivos';
    saida.className = 'erro';
    return;
  }

  // Rendimento vazio: usa o valor padrão da função
  const resultado =
    campoTaxa.value === ''
      ? calcularMeses(meta, deposito)
      : calcularMeses(meta, deposito, campoTaxa.valueAsNumber);

  if (resultado.saldo >= meta) {
    const textoMeses = `${resultado.meses} ${resultado.meses === 1 ? 'mês' : 'meses'}`;
    saida.textContent =
      `Você atinge a meta em ${textoMeses} (${formatarMeses(resultado.meses)}).\n` +
      `${exibirValor('Saldo final', resultado.saldo, formatarReal)}\n` +
      `${exibirValor('Total depositado', resultado.depositado, formatarReal)}\n` +
      exibirValor('Rendimento', resultado.saldo - resultado.depositado, formatarReal);
    saida.className = 'sucesso';
  } else {
    saida.textContent =
      'Meta inalcançável em 50 anos.\n' +
      exibirValor(`Saldo após ${LIMITE_MESES} meses`, resultado.saldo, formatarReal);
    saida.className = 'erro';
  }
});
