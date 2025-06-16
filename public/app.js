let filmesCache = [];

async function carregarFilmes() {
    const container = document.getElementById('lista-filmes');
    container.innerHTML = '';

    const resposta = await fetch('http://localhost:3000/filmes');
    const filmes = await resposta.json();

    filmesCache = filmes;
    await renderizarFilmes(filmesCache);
}

async function renderizarFilmes(filmes) {
    const container = document.getElementById('lista-filmes');
    container.innerHTML = '';

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    let favoritos = [];

    if (usuarioLogado) {
        const respostaUsuario = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`);
        const dadosUsuario = await respostaUsuario.json();
        favoritos = dadosUsuario.favoritos || [];
    }

    filmes.forEach(filme => {
        const isFavorito = favoritos.includes(filme.id);

        const filmeHTML = `
            <article class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="filme card h-100">
                    <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
                    <div class="card-body">
                        <h2 class="h5 card-title d-flex justify-content-between align-items-center">
                            ${filme.titulo}
                            <button onclick="toggleFavorito(${filme.id})" class="btn btn-sm ${isFavorito ? 'btn-warning' : 'btn-outline-warning'}" title="Favorito">
                                ★
                            </button>
                        </h2>
                        <p class="card-text">${filme.descricao}</p>
                        <a href="detalhes.html?id=${filme.id}" class="btn btn-primary">Ver detalhes</a>
                    </div>
                </div>
            </article>
        `;
        container.innerHTML += filmeHTML;
    });
}

async function toggleFavorito(filmeId) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        alert('Você precisa estar logado para favoritar!');
        return;
    }

    const respostaUsuario = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`);
    const dadosUsuario = await respostaUsuario.json();
    let favoritos = dadosUsuario.favoritos || [];

    if (favoritos.includes(filmeId)) {
        favoritos = favoritos.filter(id => id !== filmeId);
    } else {
        favoritos.push(filmeId);
    }

    await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favoritos })
    });

    usuarioLogado.favoritos = favoritos;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    await carregarFilmes();
}

function aplicarFiltroPesquisa() {
    const termo = document.getElementById('campo-pesquisa').value.toLowerCase();
    const carrossel = document.getElementById('carouselFilmes');

    if (termo.trim() !== "") {
        carrossel.style.display = 'none';
    } else {
        carrossel.style.display = 'block';
    }
    const filtrados = filmesCache.filter(filme =>
        filme.titulo.toLowerCase().includes(termo)
    );
    renderizarFilmes(filtrados);
}
const campoPesquisa = document.getElementById('campo-pesquisa');
if (campoPesquisa) {
    campoPesquisa.addEventListener('input', aplicarFiltroPesquisa);
}

async function carregarDetalhesFilme() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const resposta = await fetch('http://localhost:3000/filmes');
    const filmes = await resposta.json();

    const filme = filmes.find(f => f.id == id);

    if (filme) {
        document.title = filme.titulo + " - Catálogo de Filmes";

        const detalhesContainer = document.getElementById('detalhes-filme');
        detalhesContainer.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${filme.imagem}" class="img-fluid rounded" alt="${filme.titulo}">
                </div>
                <div class="col-md-8">
                    <h1>${filme.titulo}</h1>
                    <p><strong>Ano:</strong> ${filme.ano}</p>
                    <p><strong>Diretor:</strong> ${filme.diretor}</p>
                    <p><strong>Elenco:</strong> ${filme.elenco}</p>
                    <p><strong>Gênero:</strong> ${filme.genero}</p>
                    <p><strong>Duração:</strong> ${filme.duracao}</p>
                    <p><strong>Avaliação:</strong> ${filme.avaliacao}/10</p>
                    <h3 class="mt-4">Sinopse</h3>
                    <p>${filme.conteudo}</p>
                    <a href="index.html" class="btn btn-secondary mt-3">Voltar para a lista</a>
                </div>
            </div>
        `;
    } else {
        document.getElementById('detalhes-filme').innerHTML = `
            <div class="alert alert-danger">
                Filme não encontrado. <a href="index.html">Voltar para a lista</a>
            </div>
        `;
    }
}
async function gerarGraficoFilmesPorGenero() {
    const resposta = await fetch('http://localhost:3000/filmes');
    const filmes = await resposta.json();

    const generoMap = {};

    filmes.forEach(filme => {
        const genero = filme.genero || 'Desconhecido';
        if (!generoMap[genero]) {
            generoMap[genero] = [];
        }
        generoMap[genero].push(filme);
    });

    const generos = Object.keys(generoMap);
    const contagens = generos.map(g => generoMap[g].length);

    const ctx = document.getElementById('graficoAvaliacao').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: generos,
            datasets: [{
                label: 'Quantidade de Filmes',
                data: contagens,
                backgroundColor: 'grey',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Filmes: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0,
                    }
                }
            }

        }
    });
}

if (window.location.pathname.includes('detalhes.html')) {
    document.addEventListener('DOMContentLoaded', carregarDetalhesFilme);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        carregarFilmes();
        gerarGraficoFilmesPorGenero();
    });
}