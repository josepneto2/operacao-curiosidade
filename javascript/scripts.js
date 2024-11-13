const dadosSistema = {
    listaUsuarios: [
        {
            id: 1,
            nome: "admin",
            email: "admin@email.com",
            senha: "admin"
        },
        {
            id: 2,
            nome: "neto",
            email: "neto@email.com",
            senha: "123"
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
let usuarios;

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
    return dadosUsuarios;
}

function validarLoginUsuario(email, senha) {
    usuarios = obterUsuariosSistema();
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

//----------------- TELA HOME ---------------------------
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const nomeUsuario = document.querySelector("#nome-usuario");
const numTotal = document.querySelector("#num-total");
let pessoas = obterPessoasSistema();
const barraPesquisa = document.querySelector('#barra-pesquisa');
const tabela = document.querySelector('.tabela');
let tbody = document.getElementsByTagName('tbody')[0];

function carregarDadosHome() {
    nomeUsuario.innerText = usuarioLogado.nome;
    numTotal.innerText = pessoas.length;
    carregarTabela(pessoas.reverse());

    filtrarBusca()
}

function filtrarBusca() {
    barraPesquisa.addEventListener('input', () => {
        let termoPesquisado = barraPesquisa.value;
        let busca = obterPessoasPesquisadas(termoPesquisado);
        tbody.innerHTML = '';
        carregarTabela(busca);
    });
}

function carregarTelaHome() {
    window.location.href = "./home.html";
}

function obterPessoasSistema() {
    const dados = obterDadosSistema();
    if(!dados) {
        return false;
    }
    
    const dadosPessoas = dados.listaPessoas;
    return dadosPessoas;
}

function obterPessoasPesquisadas(busca) {
    let pessoasEncontradas = pessoas.filter(pessoa => pessoa.nome.includes(busca))

    return pessoasEncontradas;
}


function carregarTabela(pessoas) {
    pessoas.forEach((pessoa) => {
        const tdNome = document.createElement('td');
        tdNome.innerText = pessoa.nome;
        const tdEmail = document.createElement('td');
        tdEmail.innerText = pessoa.email;
        const tdStatus = document.createElement('td');
        let statusTraduzido;
        if (pessoa.status) {
            statusTraduzido = 'Ativo'
        } else {
            tdStatus.id = 'status';
            statusTraduzido = 'Inativo'
        }
        tdStatus.innerText = statusTraduzido;

        const tr = document.createElement('tr');
        tr.appendChild(tdNome)
        tr.appendChild(tdEmail)
        tr.appendChild(tdStatus)
        tbody.appendChild(tr)
    });
}

//----------------- TELA CADASTRO ---------------------------
function carregarDadosCadastro() { 
    carregarTabela(pessoas);

    filtrarBusca()
}

function carregarTelaCadastro() {
    window.location.href = "./cadastro.html"
}

//----------------- TELA NOVO CADASTRO ---------------------------
function carregarTelaNovoCadastro() {
    window.location.href = "./novo-cadastro.html"
}

function cadastrarPessoa(event) {
    const nome = document.querySelector('#nome').value;
    const idade = Number(document.querySelector('#idade').value);
    const email = document.querySelector('#email').value;
    const endereco = document.querySelector('#endereco').value;
    const outrasInfos = document.querySelector('#outras-infos').value;
    const interesses = document.querySelector('#interesses').value;
    const sentimentos = document.querySelector('#sentimentos').value;
    const valores = document.querySelector('#valores').value;
    const statusRadio = document.querySelector('#status');

    let status = statusRadio.checked ? 'Ativo' : 'Inativo';

    pessoa.id = pessoas.length + 1;
    pessoa.nome = nome;
    pessoa.idade = idade;
    pessoa.email = email;
    pessoa.endereco = endereco;
    pessoa.outrasInfos = outrasInfos;
    pessoa.interesses = interesses;
    pessoa.sentimentos = sentimentos;
    pessoa.valores = valores;
    pessoa.dataCadastro = new Date().toLocaleDateString();
    pessoa.status = status;

    pessoas.push(pessoa);
    dadosSistema.listaPessoas= pessoas;
    localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
}


//----------------- TELA RELATÓRIOS ---------------------------
const containerLista = document.querySelector('.container-lista');
const containerTabela = document.querySelector('.container-tabela');
const btnImprimir = document.querySelector('#btn-imprimir');
let tituloLista = document.querySelector('#titulo');

function carregarTelaRelatorios() {
    window.location.href = "./relatorios.html"
}

function carregarListaPessoas() {
    tituloLista.innerText += '  >  Lista de Pessoas'
    containerLista.classList.add('inativo');
    containerTabela.classList.remove('inativo');
    btnImprimir.classList.remove('inativo');
    carregarTabela(pessoas);

    filtrarBusca()
}