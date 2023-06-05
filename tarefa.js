class Tarefa {
    constructor(id, anteriores, proximos, duracao) {
        this.id = id;
        this.anteriores = anteriores;
        this.proximos = proximos;
        this.duracao = duracao;
        this.tChegada = 0;
        this.tSaida = 0;
    }
}

class Graph {
    constructor() {
        this.vertices = [];
        this.verticesFim = new Set();
    }

    addVertice(tarefa) {
        this.vertices.push(tarefa);
    }

    addAresta(origem, destino) {
        origem.proximos.push(destino);
        destino.anteriores.push(origem);
    }

    computarTempos() {
        let ordem = this.topologicalSort();
        ordem.forEach(tarefa => {
            tarefa.tSaida = tarefa.tChegada + tarefa.duracao;
            tarefa.proximos.forEach(proximo => {
                if (tarefa.tSaida > proximo.tChegada) {
                    proximo.tChegada = tarefa.tSaida;
                }
            });
        });
        return this.caminhoCritico();
    }

    caminhoCritico() {
        let pilha = []

        let maiorTempo = 0;
        let maiorVertice = null;
        this.verticesFim.forEach(vertice => {
            if (vertice.tSaida > maiorTempo) {
                maiorTempo = vertice.tSaida;
                maiorVertice = vertice;
            }
        });

        pilha.push(maiorVertice);

        let anteriores = maiorVertice.anteriores;
        
        while(anteriores.length !== 0) {
            let maiorTempo = 0;
            let maiorAnterior = null;
            anteriores.forEach(anterior => {
                if (anterior.tSaida > maiorTempo) {
                    maiorTempo = anterior.tSaida;
                    maiorAnterior = anterior;
                }
            });
            pilha.push(maiorAnterior);
            anteriores = maiorAnterior.anteriores;
        }

        return pilha.reverse();
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
            if (proximo.proximos.length === 0 && !this.verticesFim.has(proximo)) {
                this.verticesFim.add(proximo);
            }
        })

        pilha.push(vertice);
    }
}