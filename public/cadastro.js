const API_URL = "http://localhost:3000/filmes";

document.addEventListener("DOMContentLoaded", () => {
    carregarFilmesCadastro();

    document.getElementById("form-filme").addEventListener("submit", salvarFilme);
});

function carregarFilmesCadastro() {
    fetch(API_URL)
        .then(res => res.json())
        .then(filmes => {
            const lista = document.getElementById("lista-filmes");
            lista.innerHTML = "";

            filmes.forEach(filme => {
                const div = document.createElement("div");
                div.className = "col";
                div.innerHTML = `
                    <div class="card">
                        <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}" />
                        <div class="card-body">
                            <h5 class="card-title">${filme.titulo}</h5>
                            <p class="card-text">${filme.descricao}</p>
                            <button class="btn btn-warning btn-sm me-2" onclick="editarFilme(${filme.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="excluirFilme(${filme.id})">Excluir</button>
                        </div>
                    </div>
                `;
                lista.appendChild(div);
            });
        });
}

function salvarFilme(event) {
    event.preventDefault();

    const filme = {
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        conteudo: document.getElementById("conteudo").value,
        diretor: document.getElementById("diretor").value,
        elenco: document.getElementById("elenco").value,
        ano: parseInt(document.getElementById("ano").value),
        duracao: document.getElementById("duracao").value,
        genero: document.getElementById("genero").value,
        imagem: document.getElementById("imagem").value,
        avaliacao: parseFloat(document.getElementById("avaliacao").value),
    };

    const id = document.getElementById("filmeId").value;

    if (id) {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filme)
        }).then(() => {
            document.getElementById("form-filme").reset();
            document.getElementById("filmeId").value = "";
            carregarFilmesCadastro();
        });
    } else {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filme)
        }).then(() => {
            document.getElementById("form-filme").reset();
            carregarFilmesCadastro();
        });
    }
}

function editarFilme(id) {
    fetch(`${API_URL}`)
        .then(res => res.json())
        .then(filmes => {

            const filme = filmes.find(filme => filme.id === id);

            document.getElementById("filmeId").value = filme.id;
            document.getElementById("titulo").value = filme.titulo;
            document.getElementById("descricao").value = filme.descricao;
            document.getElementById("conteudo").value = filme.conteudo;
            document.getElementById("diretor").value = filme.diretor;
            document.getElementById("elenco").value = filme.elenco;
            document.getElementById("ano").value = filme.ano;
            document.getElementById("duracao").value = filme.duracao;
            document.getElementById("genero").value = filme.genero;
            document.getElementById("imagem").value = filme.imagem;
            document.getElementById("avaliacao").value = filme.avaliacao;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
}

function excluirFilme(id) {
    if (confirm("Deseja excluir este filme?")) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        }).then(() => carregarFilmesCadastro());
    }
}