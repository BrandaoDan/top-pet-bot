const dadosClientes = {};

function atualizarDados(numero, novosDados) {
    if (!dadosClientes[numero]) {
        dadosClientes[numero] = {};
    }
    dadosClientes[numero] = {
        ...dadosClientes[numero],
        ...novosDados
    };
}

module.exports = {
    dadosClientes,
    atualizarDados
};
