// Exercício 02: Conta de luz
// Conteúdos: switch (cases agrupados), parâmetro padrão, tipos literais
const campoConsumo = document.getElementById('consumo');
const campoTipo = document.getElementById('tipo');
const campoBandeira = document.getElementById('bandeira');
const botao = document.getElementById('calcular');
const saida = document.getElementById('resultado');
// ---------- Regras de negócio ----------
/** Tarifa por kWh. Os cases agrupados compartilham o mesmo bloco (sem break entre eles). */
function tarifaPorKwh(tipo) {
    switch (tipo) {
        case 'residencial':
        case 'rural':
            return 0.8;
        case 'comercial':
        case 'industrial':
            return 0.95;
    }
}
/** Adicional da bandeira sobre o consumo. Se a bandeira não for informada, assume 'verde'. */
function adicionalBandeira(consumo, bandeira = 'verde') {
    switch (bandeira) {
        case 'verde':
            return 0;
        case 'amarela':
            return consumo * 0.02;
        case 'vermelha1':
            return consumo * 0.04;
        case 'vermelha2':
            return consumo * 0.08;
    }
}
/** Mensagem da bandeira. As duas vermelhas compartilham a mesma mensagem. */
function mensagemBandeira(bandeira) {
    switch (bandeira) {
        case 'verde':
            return 'Condições favoráveis de geração de energia.';
        case 'amarela':
            return 'Condições de geração menos favoráveis.';
        case 'vermelha1':
        case 'vermelha2':
            return 'Condições mais caras de geração. Economize!';
        default:
            return 'Bandeira desconhecida.';
    }
}
/** Nome da bandeira para exibir no resultado. */
function nomeBandeira(bandeira) {
    switch (bandeira) {
        case 'verde':
            return 'verde';
        case 'amarela':
            return 'amarela';
        case 'vermelha1':
            return 'vermelha (patamar 1)';
        case 'vermelha2':
            return 'vermelha (patamar 2)';
    }
}
function formatarReal(valor) {
    return `R$ ${valor.toFixed(2)}`;
}
// Teste do parâmetro padrão: sem o 2º argumento, bandeira vale 'verde'.
console.log(adicionalBandeira(100)); // 0 -> como a bandeira não foi informada, o valor padrão 'verde' (sem adicional) é usado
// ---------- Página ----------
botao.addEventListener('click', () => {
    const consumo = campoConsumo.valueAsNumber;
    // Também cobre campo vazio (NaN), pois NaN > 0 é false
    if (!(consumo > 0)) {
        saida.textContent = 'Informe um consumo válido';
        saida.className = 'erro';
        return;
    }
    const tipo = campoTipo.value;
    const bandeira = campoBandeira.value;
    const energia = consumo * tarifaPorKwh(tipo);
    const adicional = adicionalBandeira(consumo, bandeira);
    const total = energia + adicional;
    saida.textContent =
        `Energia: ${formatarReal(energia)}\n` +
            `Bandeira ${nomeBandeira(bandeira)}: ${formatarReal(adicional)}\n` +
            `Total: ${formatarReal(total)}\n` +
            mensagemBandeira(bandeira);
    saida.className = bandeira !== 'verde' ? 'alerta' : '';
});
export {};
//# sourceMappingURL=ex02.js.map