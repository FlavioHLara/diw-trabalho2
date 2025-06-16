const URL_USUARIOS = 'http://localhost:3000/usuarios';

function alternarForm(cadastro) {
    document.getElementById('form-cadastro').style.display = cadastro ? 'block' : 'none';
    document.getElementById('form-login').style.display = cadastro ? 'none' : 'block';
}

function realizarCadastro(event) {
    event.preventDefault();

    const nome = document.getElementById('cadastroNome').value.trim();
    const email = document.getElementById('cadastroEmail').value.trim();
    const senha = document.getElementById('cadastroSenha').value.trim();

    fetch(URL_USUARIOS)
        .then(res => res.json())
        .then(usuarios => {
            const usuarioExistente = usuarios.find(user => user.email === email);
            if (usuarioExistente) {
                alert('E-mail já cadastrado!');
            } else {
                const novoUsuario = {
                    nome,
                    email,
                    senha,
                    administrador: false,
                    favoritos: []
                };
                fetch(URL_USUARIOS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoUsuario)
                })
                    .then(() => {
                        alert('Cadastro realizado com sucesso!');
                        alternarForm(false);
                    });
            }
        });
}

async function realizarLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();

    fetch(URL_USUARIOS)
        .then(res => res.json())
        .then(usuarios => {
            const usuario = usuarios.find(user => user.email === email && user.senha === senha);
            if (usuario) {
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                atualizarEstadoUsuario();
                localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            } else {
                alert('Usuário ou senha inválidos.');
            }
        });
    await carregarFilmes();
}

function atualizarEstadoUsuario() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));

    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    const usuarioLogadoDiv = document.getElementById('usuario-logado');
    const nomeUsuarioSpan = document.getElementById('nomeUsuario');

    if (usuario) {
        if (formLogin) formLogin.style.display = 'none';
        if (formCadastro) formCadastro.style.display = 'none';
        if (usuarioLogadoDiv) usuarioLogadoDiv.style.display = 'block';
        if (nomeUsuarioSpan) nomeUsuarioSpan.textContent = usuario.nome;

        const linkFavoritos = document.getElementById('link-favoritos');
        if (linkFavoritos) linkFavoritos.style.display = 'inline-block';
    } else {
        if (formLogin) formLogin.style.display = 'block';
        if (formCadastro) formCadastro.style.display = 'none';
        if (usuarioLogadoDiv) usuarioLogadoDiv.style.display = 'none';
    }
}

async function logout() {
    sessionStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('favoritos');
    atualizarEstadoUsuario();
    await carregarFilmes();
}

document.addEventListener('DOMContentLoaded', atualizarEstadoUsuario);
