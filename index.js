const form = document.querySelector('#formAtividade');
const botaoCaminho = document.querySelector('#botaoCaminho');
const botaoCadastro = document.querySelector('#botaoCadastro');
const spanModal = document.querySelector('#spanModal');
const inputElement = document.querySelector('#anteriores');

const grafoAtividades = new Graph();
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
    let preRequisitos = elementos[2].value === '' ? [] : elementos[2].value.split(',');

    let tarefaCadastrada = new Tarefa(idCadastrado, [], [], parseInt(duracao));
    grafoAtividades.addVertice(tarefaCadastrada);

    if (preRequisitos.length !== 0) {
        preRequisitos.forEach(id => {
            let tarefa = null;
            for (vertice of grafoAtividades.vertices) {
                if (vertice.id == id) {
                    tarefa = vertice;
                    break;
                }
            }
            if (tarefa == null) {
                grafoAtividades.vertices.pop();
                throw new Error("O id " + id + " não é válido");
            }
            grafoAtividades.addAresta(tarefa, tarefaCadastrada)
        });
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
    if (grafoAtividades.vertices.length == 0) return;
    grafoAtividades.computarTempos();
});