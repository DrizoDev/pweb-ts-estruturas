// Exercício 03: Simulador de parcelamento
// Conteúdos: for, break, continue, parâmetro opcional
const campoPreco = document.getElementById('preco');
const campoEntrada = document.getElementById('entrada');
const botao = document.getElementById('simular');
const saida = document.getElementById('resultado');
const corpoTabela = document.getElementById('parcelas');
const PARCELA_MINIMA = 50;
// ---------- Regras de negócio ----------
/** Até 3 parcelas: sem juros. A partir de 4: juros compostos de 2% ao mês. */
function calcularTotal(valor, parcelas) {
    if (parcelas <= 3) {
        return valor;
    }
    return valor * 1.02 ** parcelas;
}
/**
 * Devolve as linhas <tr>...</tr> da tabela de parcelamento.
 * A entrada é um parâmetro opcional.
 */
function simularParcelamento(preco, entrada) {
    // Se a entrada foi informada, desconta do preço
    const financiado = typeof entrada !== 'undefined' ? preco - entrada : preco;
    let linhas = '';
    for (let parcelas = 1; parcelas <= 12; parcelas++) {
        // A loja não oferece 7, 8, 9 e 11 parcelas
        if (parcelas === 7 || parcelas === 8 || parcelas === 9 || parcelas === 11) {
            continue;
        }
        const total = calcularTotal(financiado, parcelas);
        const valorParcela = total / parcelas;
        // Parcela abaixo do mínimo: as opções acabam
        if (valorParcela < PARCELA_MINIMA) {
            break;
        }
        const juros = parcelas <= 3 ? 'sem juros' : '2% a.m.';
        linhas +=
            `<tr><td>${parcelas}x</td>` +
                `<td>R$ ${valorParcela.toFixed(2)}</td>` +
                `<td>R$ ${total.toFixed(2)}</td>` +
                `<td>${juros}</td></tr>`;
    }
    return linhas;
}
// ---------- Página ----------
botao.addEventListener('click', () => {
    const preco = campoPreco.valueAsNumber;
    corpoTabela.innerHTML = '';
    if (!(preco > 0)) {
        saida.textContent = 'Informe um preço válido';
        saida.className = 'erro';
        return;
    }
    let linhas;
    let financiado;
    if (campoEntrada.value === '') {
        // Entrada vazia: chama sem o segundo argumento
        financiado = preco;
        linhas = simularParcelamento(preco);
    }
    else {
        const entrada = campoEntrada.valueAsNumber;
        if (entrada < 0) {
            saida.textContent = 'A entrada não pode ser negativa';
            saida.className = 'erro';
            return;
        }
        if (entrada >= preco) {
            saida.textContent = 'A entrada cobre o valor total. Não há parcelas.';
            saida.className = 'sucesso';
            return;
        }
        financiado = preco - entrada;
        linhas = simularParcelamento(preco, entrada);
    }
    saida.textContent = `Valor financiado: R$ ${financiado.toFixed(2)}`;
    saida.className = '';
    if (linhas === '') {
        saida.textContent += `\nValor abaixo da parcela mínima de R$ ${PARCELA_MINIMA.toFixed(2)}.`;
        saida.className = 'alerta';
        return;
    }
    corpoTabela.innerHTML = linhas;
});
export {};
//# sourceMappingURL=ex03.js.map