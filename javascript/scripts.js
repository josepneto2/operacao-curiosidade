const dadosSistema = {
    listaUsuarios: [
        {
            id: 1,
            nome: "admin",
            email: "admin@email.com",
            senha: "admin"
        },
    ],
    listaPessoas: [
        {
            id: 1,
            nome: "Son Goku",
            idade: 35,
            email: "goku@email.com",
            endereco: "Distrito Leste 439",
            outrasInformacoes: "Seu poder é mais de 8 mil",
            interesses: "Artes Marciais",
            sentimentos: "",
            valores: "",
            dataCadastro: 0,
            status: true
        },
        {
            id: 2,
            nome: "Virgil Super Choque",
            idade: 15,
            email: "superchoque@email.com",
            endereco: "Dakota",
            outrasInformacoes: "",
            interesses: "",
            sentimentos: "",
            valores: "",
            dataCadastro: 0,
            status: true
        },
        {
            id: 3,
            nome: "Logan Wolverine",
            idade: 200,
            email: "wolverine@email.com",
            endereco: "Alberta, Canadá",
            outrasInformacoes: "Inimigo do Dentes de Sabre",
            interesses: "",
            sentimentos: "",
            valores: "",
            dataCadastro: 0,
            status: false
        },
    ]
}

const usuario = {
    id: 0,
    nome: "",
    email: "",
    senha: ""
}

const pessoa = {
    id: 0,
    nome: "",
    idade: 0,
    email: "",
    endereco: "",
    outrasInformacoes: "",
    interesses: "",
    sentimentos: "",
    valores: "",
    dataCadastro: 0,
    status: false
}

//----------------- TELA LOGIN ---------------------------
const emailInput = document.querySelector("#email");
const senhaInput = document.querySelector("#password");
const aviso = document.querySelector('#aviso');
const btnSair = document.querySelector("#btn-sair");

function carregarDados() {
    localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
}

function realizarLogin(event) {
    event.preventDefault()
    let email = emailInput.value;
    let senha = senhaInput.value;
    const usuarioCadastrado = validarLoginUsuario(email, senha);

    if (!usuarioCadastrado) {
        aviso.classList.remove('inativo');
        return
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioCadastrado));
    window.location.href = "./home.html"
}

function obterDadosSistema() {
    const dadosJson = localStorage.getItem('dadosSistema');
    if(!dadosJson) {
        return false;
    }

    const dadosObj = JSON.parse(dadosJson);
    return dadosObj;
}

function obterUsuariosSistema() {
    const dados = obterDadosSistema();
    if(!dados) {
        return false;
    }
    
    const dadosUsuarios = dados.listaUsuarios;
    return dadosUsuarios
}

function validarLoginUsuario(email, senha) {
    const usuarios = obterUsuariosSistema();
    const usuarioEncontrado = usuarios.find(u => u.email === email);
    if(!usuarioEncontrado) {
        return null;
    }

    if (usuarioEncontrado.email === email && usuarioEncontrado.senha === senha){
        return usuarioEncontrado
    } else {
        return null;
    }
}

function handleLogout() {
    localStorage.removeItem("usuarioLogado");
}

btnSair.addEventListener('click', handleLogout);