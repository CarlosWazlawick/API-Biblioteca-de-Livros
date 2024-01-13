const express = require('express');
const server = express();
const fs = require('fs');
const banco = require('./banco.json');

server.use(express.json());

function salvarDados() {
    fs.writeFileSync(__dirname + '/banco.json', JSON.stringify(banco, null, 2));
}

server.get('/', (req, res) => {
    return res.json({ mensagem: "Bem-vindo à nossa incrível API de livros!" });
});

server.listen(3000, () => {
    console.log("O servidor está ativo na porta 3000");
});

server.get('/livros', (req, res) => {
    return res.json(banco.Livros);
});

server.get('/livros/pesquisa/:termo', (req, res) => {
    const termo = req.params.termo.toLowerCase();
    const livrosEncontrados = banco.Livros.filter(livro =>
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo) ||
        livro.anoPublicado.toString().toLowerCase().includes(termo) ||
        livro.genero.toLowerCase().includes(termo)
    );

    if (livrosEncontrados.length > 0) {
        res.json(livrosEncontrados);
    } else {
        res.status(404).json({ mensagem: "Nenhum livro encontrado." });
    }
});

server.get('/livros/ordenar/:criterio', (req, res) => {
    const criterio = req.params.criterio.toLowerCase();
    let livrosOrdenados = [];

    switch (criterio) {
        case "titulo":
            livrosOrdenados = banco.Livros.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
        case "autor":
            livrosOrdenados = banco.Livros.sort((a, b) => a.autor.localeCompare(b.autor));
            break;
        case "ano":
            livrosOrdenados = banco.Livros.sort((a, b) => a.anoPublicado.localeCompare(b.anoPublicado));
            break;
        case "genero":
            livrosOrdenados = banco.Livros.sort((a, b) => a.genero.localeCompare(b.genero));
            break;
        case "id":
            livrosOrdenados = banco.Livros;
            break;
        default:
            res.status(400).json({ mensagem: "Critério de ordenação inválido." });
            return;
    }

    res.json(livrosOrdenados);
});

server.post('/livros', (req, res) => {
    const novoLivro = req.body;

    if (!novoLivro.id || !novoLivro.titulo || !novoLivro.autor || !novoLivro.anoPublicado || !novoLivro.genero) {
        return res.status(400).json({ mensagem: "Por favor, forneça todas as informações do livro." });
    }

    banco.Livros.push(novoLivro);
    salvarDados();

    return res.status(201).json({ mensagem: "Livro cadastrado com sucesso!" });
});

server.put('/livros/:id', (req, res) => {
    const livroId = parseInt(req.params.id);
    const livroAtualizado = req.body;

    const indexLivro = banco.Livros.findIndex(livro => livro.id === livroId);

    if (indexLivro === -1) {
        return res.status(404).json({ mensagem: "Livro não encontrado." });
    }

    banco.Livros[indexLivro] = { ...banco.Livros[indexLivro], ...livroAtualizado };
    salvarDados();

    return res.json({ mensagem: "Livro atualizado com sucesso!", livro: banco.Livros[indexLivro] });
});

server.delete('/livros/:id', (req, res) => {
    const livroId = parseInt(req.params.id);

    banco.Livros = banco.Livros.filter(livro => livro.id !== livroId);
    salvarDados();

    return res.status(200).json({ mensagem: "Livro excluído com sucesso!" });
});
