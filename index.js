const form = document.querySelector('#formAtividade');
const botaoCaminho = document.querySelector('#botaoCaminho');
const botaoCadastro = document.querySelector('#botaoCadastro');
const spanModal = document.querySelector('#spanModal');
const inputElement = document.querySelector('#anteriores');

const grafoAtividades = new Graph();
const colunas = { cima: -0.3 , baixo: 0};
const graphModel = {
    nodes: [],
    edges: []
};

var graph;
var sentido = 1;
var idCadastrado = 0;

window.onload = updateRender;

botaoCadastro.addEventListener('click', function (event) {
    event.preventDefault();
    idCadastrado++;
    let elementos = form.elements;
    updateGraph(elementos);
    updateList(elementos);
    updateRender();
});

function updateRender() {
    if (graph !== undefined) {
        graph.destroy();
    }
    graph = new ElGrapho({
        container: document.querySelector('#graph-container'),
        model: graphModel,
        width: 800,
        height: 500,
        arrows: true,
        edgeSize: 0.5, tooltips: false
    });
}

function updateGraph(elementos) {
    let duracao = elementos[1].value;
    let preRequisitos = elementos[2].value === '' ? [] : elementos[2].value.split(',');
    let tarefaCadastrada = new Tarefa(idCadastrado, [], [], parseInt(duracao));

    grafoAtividades.addVertice(tarefaCadastrada);

    if (preRequisitos.length === 0) {
        tarefaCadastrada.x = 0;
        tarefaCadastrada.y = getY();
        sentido *= -1;
        graphModel.nodes.push({ x: 0, y: tarefaCadastrada.y, group: 1, label: tarefaCadastrada.id + ' - ' + tarefaCadastrada.duracao });
    } else {
        let x = 0, y = 0;
        let tarefa = null;
        let colocarVertice = true;
        preRequisitos.forEach(id => {
            for (vertice of grafoAtividades.vertices) {
                if (vertice.id == id) {
                    x = vertice.x > x ? vertice.x : x;
                }
            }
        })
        preRequisitos.forEach(id => {
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
            x = parseFloat((x + 0.3).toFixed(1));
            if (colocarVertice) {
                graphModel.nodes.push({ x: x, y: getY(), group: 1, label: tarefaCadastrada.id + ' - ' + tarefaCadastrada.duracao });
                sentido *= -1;
                colocarVertice = false;
            }
            graphModel.edges.push({ from: parseInt(tarefa.id) - 1, to: parseInt(tarefaCadastrada.id) - 1 });
            tarefaCadastrada.x = x;
            tarefaCadastrada.y = y;
        });
    }
}

function getY() {
    if (sentido === 1) {
        colunas.cima = parseFloat((colunas.cima + 0.3).toFixed(1));
        return colunas.cima;
    } else {
        colunas.baixo = parseFloat((colunas.baixo - 0.3).toFixed(1));
        return colunas.baixo;
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
    if (grafoAtividades.vertices.length === 0 || grafoAtividades.vertices.length === 1) return;
    let caminho = grafoAtividades.computarTempos();
    caminho.forEach(tarefa => {
        graphModel.nodes.forEach(vertice => {
            if (vertice.label == tarefa.id) {
                vertice.group = 0;
            }
        })
    })
    updateRender();
});