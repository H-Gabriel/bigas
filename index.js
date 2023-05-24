const form = document.querySelector('#formAtividade');
const botaoCaminho = document.querySelector('#botaoCaminho');
const botaoCadastro = document.querySelector('#botaoCadastro');
const spanModal = document.querySelector('#spanModal');
const inputElement = document.querySelector('#anteriores');

const grafoAtividades = new Graph();
var verticesComeco = [];
var idCadastrado = 0;

botaoCadastro.addEventListener('click', function (event) {
    event.preventDefault();
    let elementos = form.elements;
    updateGraph(elementos);
    updateList(elementos);
});

function updateGraph(elementos) {
    idCadastrado++;
    let duracao = elementos[1].value;
    let anteriores = elementos[2].value == '' ? [] : elementos[2].value.split(',');

    if (anteriores.length != 0) {
        anteriores.forEach(id => {
            grafoAtividades[parseInt(id) - 1].proximos.push(idCadastrado);
        });
    }

    let atividadeCadastrada = new Tarefa(idCadastrado, anteriores, [], parseInt(duracao));
    grafoAtividades.push(atividadeCadastrada);
    if (anteriores.length == 0) {
        verticesComeco.push(atividadeCadastrada)
    }
}

function updateList(elementos) {
    let listaUl = document.querySelector('#lista');
    let li = document.createElement('li');
    li.innerText = elementos[0].value;
    listaUl.append(li);
}

inputElement.addEventListener('keydown', function (event) {
    if (!(/^[0-9,]$/.test(event.key)) && !(event.key === 'Backspace')) {
        event.preventDefault();
    }
});

botaoCaminho.addEventListener('click', function (event) {
    if (grafoAtividades.length == 0) return;
    verticesComeco.forEach(vertice => {
        console.log(vertice.id);
        console.log(vertice.proximos);
    });
});