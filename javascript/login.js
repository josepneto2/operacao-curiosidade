const dadosSistema = {
    listaUsuarios: [
        {
            id: 1,
            nome: "Admin",
            email: "admin@email.com",
            senha: "admin",
            deletado: false
        },
        {
            id: 2,
            nome: "Neto",
            email: "neto@email.com",
            senha: "123",
            deletado: false
        },
    ]
};

const emailInput = document.querySelector("#email");
const senhaInput = document.querySelector("#password");
const aviso = document.querySelector('#aviso');

function carregarDados() {
    const dadosExiste = localStorage.getItem('dadosSistema');
    if(!dadosExiste){
        localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
    }
}

function obterUsuariosSistema() {
    const dadosJson = localStorage.getItem('dadosSistema');
    if(!dadosJson) {
        return false;
    }
    
    const dadosObj = JSON.parse(dadosJson);
    return dadosObj.listaUsuarios;
}

const usuarios = obterUsuariosSistema();

function realizarLogin(event) {
    event.preventDefault();
    let email = emailInput.value;
    let senha = senhaInput.value;
    const usuarioCadastrado = validarLoginUsuario(email, senha);
    
    if (!usuarioCadastrado) {
        emailInput.focus();
        emailInput.style.border = '2px solid red';
        senhaInput.style.border = '2px solid red';
        aviso.classList.remove('inativo');
        return;
    }
    
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioCadastrado));
    window.location.href = "pages/home.html";
}

function validarLoginUsuario(email, senha) {
    const usuarioEncontrado = usuarios.find(u => u.email === email);
    if(!usuarioEncontrado) {
        return null;
    }
    
    if (usuarioEncontrado.email === email && usuarioEncontrado.senha === senha){
        return usuarioEncontrado;
    } else {
        return null;
    }
}