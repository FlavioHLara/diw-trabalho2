async function carregarFilmes() {
    const container = document.getElementById('lista-filmes');
    container.innerHTML = '';

    const resposta = await fetch('http://localhost:3000/filmes');
    const filmes = await resposta.json();

    filmes.splice(3, 11).forEach(filme => {
        const filmeHTML = `
      <article class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="filme card h-100">
          <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
          <div class="card-body">
            <h2 class="h5 card-title">${filme.titulo}</h2>
            <p class="card-text">${filme.descricao}</p>
            <a href="detalhes.html?id=${filme.id}" class="btn btn-primary">Ver detalhes</a>
          </div>
        </div>
      </article>
    `;
        container.innerHTML += filmeHTML;
    });
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
if (window.location.pathname.includes('detalhes.html')) {
    document.addEventListener('DOMContentLoaded', carregarDetalhesFilme);
} else {
    document.addEventListener('DOMContentLoaded', carregarFilmes);
}