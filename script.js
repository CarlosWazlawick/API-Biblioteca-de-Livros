const cardContainer = document.getElementById("cardContainer");
const barraDePesquisa = document.getElementById("barraDePesquisa");

let items = [];

fetch("banco.json")
    .then((data) => data.json())
    .then((data) => {
        items = data.Livros;
    });

document.getElementById("confirmarBtn").addEventListener("click", function () {
    exibirCards();
});

barraDePesquisa.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        exibirCards();
    }
});

function criarCard(item) {
    const card = document.createElement('div');
    card.classList.add('col', 'border', 'border-dark', 'p-3', 'border-5');

    const imagem = document.createElement('img');
    imagem.src = "/img/capa.jpg";
    imagem.classList.add('card-img');
    imagem.alt = 'Imagem do Livro';
    imagem.style.maxWidth = '100%';
    imagem.style.borderRadius = '10px';
    card.appendChild(imagem);

    const corpoCard = document.createElement('div');
    corpoCard.classList.add('corpo-card');

    const titulo = document.createElement('h4');
    titulo.classList.add('titulo-card');
    titulo.innerHTML = `<br>
                        <strong>Título:</strong> ${item.titulo}`;
    corpoCard.appendChild(titulo);

    const subTitulos = document.createElement('p');
    subTitulos.classList.add('texto-card');
    subTitulos.innerHTML = `<strong>Autor:</strong> ${item.autor}<br>
                        <strong>Ano Publicado:</strong> ${item.anoPublicado}<br>
                        <strong>Gênero:</strong> ${item.genero}`;
    corpoCard.appendChild(subTitulos);

    card.appendChild(corpoCard);
    cardContainer.appendChild(card);
}

function exibirCards() {
    const termoDePesquisa = barraDePesquisa.value;

    if (termoDePesquisa.trim() !== "") {
        cardContainer.innerHTML = "";

        items.filter((item) =>
            item.titulo.toLowerCase().includes(termoDePesquisa.toLowerCase()) ||
            item.autor.toLowerCase().includes(termoDePesquisa.toLowerCase()) ||
            item.anoPublicado.toLowerCase().includes(termoDePesquisa.toLowerCase()) ||
            item.genero.toLowerCase().includes(termoDePesquisa.toLowerCase())
        )
        .forEach((item) => criarCard(item));

    } else {
        cardContainer.innerHTML = "";
    }
}
