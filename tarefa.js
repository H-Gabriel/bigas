class Tarefa {
    constructor(id, anteriores, proximos, duracao) {
        this.id = id;
        this.anteriores = anteriores;
        this.proximos = proximos;
        this.duracao = duracao;
        this.tChegada = 0;
    }
}

class Graph {
    constructor() {
        this.vertices = [];
    }

    addVertice(tarefa) {
        this.vertices.push(tarefa);
    }

    addAresta(a, b) {
        a.proximos.push(b);
        b.anteriores.push(a);
    }

    topologicalSort() {
        const visitados = new Set();
        const pilha = [];

        this.vertices.forEach(vertice => {
            if (!visitados.has(vertice)) {
                this.dfs(vertice, visitados, pilha);
            }
        });

        return pilha.reverse();
    }

    dfs(vertice, visitados, pilha) {
        visitados.add(vertice);

        vertice.proximos.forEach(proximo => {
            if (!visitados.has(proximo)) {
                this.dfs(proximo, visitados, pilha)
            }
        })

        pilha.push(vertice);
    }
}