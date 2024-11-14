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
            sentimentos: "sentimentos",
            valores: "valores",
            dataCadastro: "1/5/2024",
            status: 'Ativo'
        },
        {
            id: 2,
            nome: "Virgil Super Choque",
            idade: 15,
            email: "superchoque@email.com",
            endereco: "Dakota",
            outrasInformacoes: "outras infos",
            interesses: "interesses",
            sentimentos: "sentimentos",
            valores: "valores",
            dataCadastro: "10/5/2024",
            status: 'Inativo'
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
            dataCadastro: "14/11/2024",
            status: 'Inativo'
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
    status: ""
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
let nomeUsuario = document.querySelector("#nome-usuario");
const numTotal = document.querySelector("#num-total");
const numMes = document.querySelector("#num-mes");
const numPendencia = document.querySelector("#num-pendencia");
let pessoas = obterPessoasSistema();
const barraPesquisa = document.querySelector('#barra-pesquisa');
const tabela = document.querySelector('.tabela');
let tbody = document.getElementsByTagName('tbody')[0];

nomeUsuario.innerText = usuarioLogado.nome;

function carregarDadosHome() {
    numTotal.innerText = pessoas.length;
    numMes.innerText = quantidadeCadastrosUltimoMes(pessoas);
    numPendencia.innerText = quantidadeCadastrosPendentes(pessoas);
    carregarTabela(pessoas.reverse());

    filtrarBusca()
}

function quantidadeCadastrosPendentes(pessoas){
    let totalPendentes = 0;
    pessoas.forEach(pessoa => {
        const valores = Object.values(pessoa);
        let vazio = valores.some(valor => valor === "")
        if(vazio) {
            totalPendentes++;
        }
    })
    return totalPendentes;
}

function quantidadeCadastrosUltimoMes(pessoas) {
    const mesAtual = new Date().getMonth();
    let cadastrosUltimoMes = 0;
    pessoas.forEach(pessoa => {
        const mesCadastro = obterMesCadastrado(pessoa) - 1;
        if (mesCadastro === mesAtual) {
            cadastrosUltimoMes++;
        }
    })

    return cadastrosUltimoMes;
}

function obterMesCadastrado(pessoa) {
    const dataCadastro = pessoa.dataCadastro;
    const dataSeparada = dataCadastro.split("/");
    const mes = dataSeparada[1];

    return mes;
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
        tdStatus.innerText = pessoa.status;
        
        if (pessoa.status === 'Inativo') {
            tdStatus.id = 'statusInativo';
        }

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

function cadastrarPessoa() {
    const nome = document.querySelector('#nome').value;
    const idade = Number(document.querySelector('#idade').value);
    const email = document.querySelector('#email').value;
    const endereco = document.querySelector('#endereco').value;
    const outrasInfos = document.querySelector('#outras-infos').value;
    const interesses = document.querySelector('#interesses').value;
    const sentimentos = document.querySelector('#sentimentos').value;
    const valores = document.querySelector('#valores').value;
    const statusRadios = document.getElementsByName('status');

    let status = '';
    console.log('antes',status)
    for(let i = 0; i < statusRadios.length; i++) {
        if(statusRadios[i].checked) {
            status = statusRadios[i].value;
            console.log('for',status)
            break
        }
    }
    console.log('depois',status)

    pessoa.id = pessoas.length + 1;
    pessoa.nome = nome;
    pessoa.idade = idade;
    pessoa.email = email;
    pessoa.endereco = endereco;
    pessoa.outrasInformacoes = outrasInfos;
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

function imprimir() {
    window.print();
}