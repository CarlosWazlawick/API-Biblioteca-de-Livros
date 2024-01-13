function salvarDados() {
    fs.writeFileSync(__dirname + '/banco.json', JSON.stringify(banco, null, 2));
}

const express = require('express');
const server = express();
const banco = require('./banco.json');
const fs = require('fs');

server.use(express.json());

server.get('/', (req, res) => {
    return res.json({ mensagem: "Nossa Api está funcionando" });
});

server.listen(3000, () => {
    console.log("server está funcionando");
});

server.get('/livros', (req, res) => {
    return res.json(banco.Livros);
});

server.get('/livros/pesquisa', (req, res) => {
    return res.json(banco.Livros);
});

server.get('/livros/pesquisa/:variavel', (req, res) => {
    const variaveisLivro = req.params.variavel.toLowerCase();
    const livrosTitulo = banco.Livros.filter(Livros => Livros.titulo.toLowerCase() === variaveisLivro);
    const livrosAutor = banco.Livros.filter(Livros => Livros.autor.toLowerCase() === variaveisLivro);
    const livrosAnoPublicado = banco.Livros.filter(Livros => Livros.anoPublicado.toString().toLowerCase() === variaveisLivro);
    const livrosGenero = banco.Livros.filter(Livros => Livros.genero.toLowerCase() === variaveisLivro);

    if (livrosTitulo.length > 0) {
        res.json(livrosTitulo);
    } else if (livrosAutor.length > 0) {
        res.json(livrosAutor);
    } else if (livrosAnoPublicado.length > 0) {
        res.json(livrosAnoPublicado);
    } else if (livrosGenero.length > 0) {
        res.json(livrosGenero);
    } else {
        res.status(404).json({ mensagem: "livro não encontrado." });
    }
});

server.get('/livros/ordenar/:variavel', (req, res) => {
    var variaveisLivro = req.params.variavel.toLowerCase();
    variaveisLivro = variaveisLivro.toLowerCase();
    var livrosOrdenados = [];

    switch (variaveisLivro) {
        case "titulo":
            livrosOrdenados = banco.Livros.sort((a, b) => a.titulo.localeCompare(b.titulo));
            res.json(livrosOrdenados);
            break;

        case "autor":
            livrosOrdenados = banco.Livros.sort((a, b) => a.autor.localeCompare(b.autor));
            res.json(livrosOrdenados);
            break;

        case "ano":
            livrosOrdenados = banco.Livros.sort((a, b) => a.anoPublicado.localeCompare(b.anoPublicado));
            res.json(livrosOrdenados);
            break;

        case "genero":
            livrosOrdenados = banco.Livros.sort((a, b) => a.genero.localeCompare(b.genero));
            res.json(livrosOrdenados);
            break;

        case "id":
            res.json(banco.Livros);
            break;

        default:
            res.json("erro errado");
            break;
    }
});

server.get('/livros/stats/', (req, res) => {
    var livros = banco.Livros;
    var stats = [];
    const totalLivros = livros.length;

    const estatisticasPorAutor = {};
    for (const livro of livros) {
        const autor = livro.autor;
        if (!estatisticasPorAutor.hasOwnProperty(autor)) {
            estatisticasPorAutor[autor] = 0;
        }
        estatisticasPorAutor[autor]++;
    }

    const estatisticasPorGenero = {};
    for (const livro of livros) {
        const genero = livro.genero;
        if (!estatisticasPorGenero.hasOwnProperty(genero)) {
            estatisticasPorGenero[genero] = 0;
        }
        estatisticasPorGenero[genero]++;
    }

    const estatisticasPorAno = {};
    for (const livro of livros) {
        const ano = livro.anoPublicado;
        if (!estatisticasPorAno.hasOwnProperty(ano)) {
            estatisticasPorAno[ano] = 0;
        }
        estatisticasPorAno[ano]++;
    }
    stats = [{
        totalLivros: totalLivros,
        estatisticasPorAutor: estatisticasPorAutor,
        estatisticasPorGenero: estatisticasPorGenero,
        estatisticasPorAno: estatisticasPorAno,
    }];
    res.json(stats);
});

server.post('/livros', (req, res) => {
    const novoLivros = req.body;

    if (!novoLivros.id || !novoLivros.titulo || !novoLivros.autor || !novoLivros.anoPublicado || !novoLivros.genero) {
        return res.status(400).json({ mensagem: "Informações incompletas." });
    } else {
        banco.Livros.push(novoLivros);
        salvarDados(banco);
        return res.status(201).json({ mensagem: "Livro cadastrado com sucesso." });
    }
});

server.put('/livros/:id', (req, res) => {
    const livrosId = parseInt(req.params.id);
    const atualizaLivros = req.body;
    const idLivros = banco.Livros.findIndex(Livros => Livros.id === livrosId);

    if (idLivros === -1) {
        return res.status(404).json({ mensagem: "Erro na alteração do livro." });
    } else {
        banco.Livros[idLivros].titulo = atualizaLivros.titulo || banco.Livros[idLivros].titulo;
        banco.Livros[idLivros].autor = atualizaLivros.autor || banco.Livros[idLivros].autor;
        banco.Livros[idLivros].anoPublicado = atualizaLivros.anoPublicado || banco.Livros[idLivros].anoPublicado;
        banco.Livros[idLivros].genero = atualizaLivros.genero || banco.Livros[idLivros].genero;

        salvarDados(banco);

        return res.json({ mensagem: "Livro atualizado com sucesso.", Livros: banco.Livros[idLivros] });
    }
});

server.delete('/livros/:id', (req, res) => {
    const livrosId = parseInt(req.params.id);

    banco.Livros = banco.Livros.filter(Livros => Livros.id !== livrosId);
    salvarDados(banco);

    return res.status(200).json({ mensagem: "Livro excluído com sucesso" });
});
