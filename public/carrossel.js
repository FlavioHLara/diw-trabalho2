async function carregarFilmesCarrossel() {
    const container = document.getElementById('carousel-inner');
    container.innerHTML = '';

    const filmesPorSlide = 1;

    const resposta = await fetch('http://localhost:3000/filmes');
    const filmes = await resposta.json();
    const filmesCarrossel = filmes.slice(0, 2);

    const totalSlides = Math.ceil(filmesCarrossel.length / filmesPorSlide);

    const isMobile = window.innerWidth <= 768;

    for (let i = 0; i < totalSlides; i++) {
        const filmesSlice = filmesCarrossel.slice(i * filmesPorSlide, (i + 1) * filmesPorSlide);

        let filmesHTML = filmesSlice.map(filme => {
            const imagem = isMobile ? filme.imagem : filme.imagemMobile;

            return `
                <div class="col-10 col-md-8 mx-auto">
                    <div class="filme card h-100 m-2">
                        <img src="${imagem}" class="card-img-top" alt="${filme.titulo}">
                        <div class="card-body">
                            <h2 class="h6 card-title">${filme.titulo}</h2>
                            <p class="card-text">${filme.descricao}</p>
                            <a href="detalhes.html?id=${filme.id}" class="btn btn-primary btn-sm">Ver detalhes</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <div class="row justify-content-center">
                    ${filmesHTML}
                </div>
            </div>
        `;
    }
}

if (window.location.pathname.includes('detalhes.html')) {
    document.addEventListener('DOMContentLoaded', carregarDetalhesFilme);
} else {
    document.addEventListener('DOMContentLoaded', carregarFilmesCarrossel);
}