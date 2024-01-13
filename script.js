const cardContainer = document.getElementById("cardContainer");
const searchBar = document.getElementById("barraDePesquisa");

let livros = [];

fetch("banco.json")
    .then((data) => data.json())
    .then((data) => {
        livros = data.Livros;
        exibirCards(); 
    });

document.getElementById("confirmarBtn").addEventListener("click", function () {
    mostrarLivros();
});

searchBar.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        mostrarLivros();
    }
});

function criarCartao(livro) {
    const cartao = document.createElement('div');
    cartao.classList.add('col', 'border', 'border-dark', 'p-3', 'border-5');

    const imagem = document.createElement('img');
    imagem.src = `./Images/${livro.id}.jpg`; 
    imagem.classList.add('card-img', 'livro-imagem'); 
    imagem.alt = 'Imagem do Livro';
    imagem.style.maxWidth = '100%';
    imagem.style.height = '600px'; 
    imagem.style.objectFit = 'cover'; 
    imagem.style.borderRadius = '10px';
    cartao.appendChild(imagem);

    const corpoCartao = document.createElement('div');
    corpoCartao.classList.add('corpo-card');

    const titulo = document.createElement('h4');
    titulo.classList.add('titulo-card');
    titulo.innerHTML = `<br><strong>Título:</strong> ${livro.titulo}`;
    corpoCartao.appendChild(titulo);

    const subTitulos = document.createElement('p');
    subTitulos.classList.add('texto-card');
    subTitulos.innerHTML = `<strong>Autor:</strong> ${livro.autor}<br>
                            <strong>Ano Publicado:</strong> ${livro.anoPublicado}<br>
                            <strong>Gênero:</strong> ${livro.genero}`;
    corpoCartao.appendChild(subTitulos);

    cartao.appendChild(corpoCartao);
    cardContainer.appendChild(cartao);
}

function mostrarLivros() {
    const termoPesquisa = searchBar.value;

    if (termoPesquisa.trim() !== "") {
        cardContainer.innerHTML = "";

        livros.filter((livro) =>
            livro.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            livro.autor.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            livro.anoPublicado.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            livro.genero.toLowerCase().includes(termoPesquisa.toLowerCase())
        )
        .forEach((livro) => criarCartao(livro));

    } else {
        cardContainer.innerHTML = "";
        exibirCards(); 
    }
}

function exibirCards() {
    cardContainer.innerHTML = "";
    livros.forEach((livro) => criarCartao(livro));
}

const style = document.createElement('style');
style.innerHTML = `
    .livro-imagem {
        width: 100%;
        height: auto;
    }
`;
document.head.appendChild(style);
