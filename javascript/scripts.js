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
            status: 'Ativo',
            deletado: false
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
            status: 'Inativo',
            deletado: false
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
            status: 'Inativo',
            deletado: false
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
    status: "",
    deletado: false
}

//----------------- TELA LOGIN -----------------
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
        emailInput.focus()
        emailInput.style.border = '2px solid red';
        senhaInput.style.border = '2px solid red';
        aviso.classList.remove('inativo');
        return;
    }
    
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioCadastrado));
    window.location.href = "./home.html";
}

function validarLoginUsuario(email, senha) {
    usuarios = obterUsuariosSistema();
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

function obterUsuariosSistema() {
    const dados = obterDadosSistema();
    if(!dados) {
        return false;
    }
    
    const dadosUsuarios = dados.listaUsuarios;
    return dadosUsuarios;
}

function obterDadosSistema() {
    const dadosJson = localStorage.getItem('dadosSistema');
    if(!dadosJson) {
        return false;
    }
    
    const dadosObj = JSON.parse(dadosJson);
    return dadosObj;
}

function handleLogout() {
    localStorage.removeItem("usuarioLogado");
}

btnSair.addEventListener('click', handleLogout);

//----------------- TELA HOME -----------------
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

let nomeUsuario = document.querySelector("#nome-usuario");

const numTotal = document.querySelector("#num-total");
const numMes = document.querySelector("#num-mes");
const numPendencia = document.querySelector("#num-pendencia");

const tabela = document.querySelector('.tabela');
let tbody = document.getElementsByTagName('tbody')[0];

let pessoas = obterPessoasSistema();
const pessoasSemDelete = pessoas.filter(p => p.deletado === false);

nomeUsuario.innerText = usuarioLogado.nome;

function carregarDadosHome() {
    numTotal.innerText = pessoasSemDelete.length;
    numMes.innerText = quantidadeCadastrosUltimoMes(pessoasSemDelete);
    numPendencia.innerText = quantidadeCadastrosPendentes(pessoasSemDelete);
    carregarTabela(pessoasSemDelete.reverse());

    filtrarBusca();
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
    const barraPesquisa = document.querySelector('#barra-pesquisa');

    barraPesquisa.addEventListener('input', function() {
        let termoPesquisado = barraPesquisa.value;
        let busca = obterPessoasPesquisadas(termoPesquisado);
        tbody.innerHTML = '';
        carregarTabela(busca);
    });
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
    let pessoasEncontradas = pessoas.filter(pessoa => pessoa.nome.includes(busca) && pessoa.deletado === false)
    
    return pessoasEncontradas;
}


function carregarTabela(pessoasSemDelete) {
    pessoasSemDelete.forEach((pessoa) => {
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
        tr.setAttribute('onclick', 'editarPessoa(event)');
        tr.appendChild(tdNome);
        tr.appendChild(tdEmail);
        tr.appendChild(tdStatus);
        tbody.appendChild(tr);
    });
}

function editarPessoa(event) {
    let pessoaParaEditar = event.target.innerText;
    pessoaParaEditar = pessoas.find(p => p.nome === pessoaParaEditar || p. email === pessoaParaEditar)
    localStorage.setItem('editarPessoa', JSON.stringify(pessoaParaEditar))
    window.location.href = "./editar-pessoa.html";
}

function carregarTelaHome() {
    window.location.href = "./home.html";
}

//----------------- TELA CADASTRO -----------------
function carregarDadosCadastro() { 
    carregarTabela(pessoasSemDelete);

    filtrarBusca();

    console.log(tabela)
}

function carregarTelaCadastro() {
    window.location.href = "./cadastro.html";
}

//----------------- TELA NOVO CADASTRO -----------------
function carregarTelaNovoCadastro() {
    window.location.href = "./novo-cadastro.html";
}

const nome = document.querySelector('#nome');
const idade = document.querySelector('#idade');
const email = document.querySelector('#email');
const endereco = document.querySelector('#endereco');
const outrasInfos = document.querySelector('#outras-infos');
const interesses = document.querySelector('#interesses');
const sentimentos = document.querySelector('#sentimentos');
const valores = document.querySelector('#valores');
const statusRadios = document.getElementsByName('status');

function cadastrarPessoa(event) {
    let statusValor = '';
    for(let i = 0; i < statusRadios.length; i++) {
        if(statusRadios[i].checked) {
            statusValor = statusRadios[i].value;
            break;
        }
    }
    
    if(!verificarNome(nome.value)) {
        event.preventDefault()
        erroInput(nome);
        return;
    }
    
    if(!verificarEmail(email.value)) {
        event.preventDefault()
        erroInput(email);
        return;
    }
    
    pessoa.nome = nome.value;
    pessoa.idade = Number(idade.value);
    pessoa.email = email.value;
    pessoa.endereco = endereco.value;
    pessoa.outrasInformacoes = outrasInfos.value;
    pessoa.interesses = interesses.value;
    pessoa.sentimentos = sentimentos.value;
    pessoa.valores = valores.value;
    pessoa.dataCadastro = new Date().toLocaleDateString();
    pessoa.status = statusValor;

    const pagina = window.location.href;
    const paginaAtual = pagina.split('/').pop();
    
    if(paginaAtual === "novo-cadastro.html"){
        pessoa.id = pessoas.length + 1;
        pessoas.push(pessoa);
        dadosSistema.listaPessoas = pessoas;
        localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
        
        alert('Cadastro realizado com sucesso!')
    } else {
        let pessoaParaEditar = JSON.parse(localStorage.getItem('editarPessoa'));
        pessoa.id = pessoaParaEditar.id;
        
        const posicao = pessoa.id - 1;
        pessoas.splice(posicao, 1, pessoa);
        dadosSistema.listaPessoas = pessoas;
        localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
        localStorage.removeItem('editarPessoa');
        
        alert('Cadastro alterado com sucesso!')
    }
}

function erroInput(input) {
    input.focus();
    input.value = "";
    input.style.border = '1px solid red';
    input.setAttribute('placeholder', '*O campo deve ser preenchido corretamente');
}

//https://blog.casadodesenvolvedor.com.br/expressoes-regulares-regex/
function verificarNome(nome) {
    if(nome.length < 3) {
        return false;
    }

    const regex = new RegExp(/^([A-ZÀ-Ú][a-zà-ú]*\s)*[A-ZÀ-Ú][a-zà-ú]*$/)
    const nomeValido = regex.test(nome);
    return nomeValido;
}

function verificarEmail(email) {
    const regex = new RegExp(/^([\w]\.?)+@([a-z]{3,}\.)+([a-z]{2,4})+$/)
    const emailValido = regex.test(email);
    return emailValido;
}

//----------------- TELA EDITAR CADASTRO -----------------
function carregarDadosEdicao() {
    let pessoaParaEditar = JSON.parse(localStorage.getItem('editarPessoa'));

    if(pessoaParaEditar.status === 'Inativo') {
        statusRadios[1].setAttribute('checked', 'true');
    }

    nome.value = pessoaParaEditar.nome;
    idade.value = pessoaParaEditar.idade;
    email.value = pessoaParaEditar.email;
    endereco.value = pessoaParaEditar.endereco;
    outrasInfos.value = pessoaParaEditar.outrasInformacoes;
    interesses.value = pessoaParaEditar.interesses;
    sentimentos.value = pessoaParaEditar.sentimentos;
    valores.value = pessoaParaEditar.valores;
}

function deletarPessoa() {
    let pessoaParaDeletar = JSON.parse(localStorage.getItem('editarPessoa'));
    pessoaParaDeletar.deletado = true;

    console.log(pessoaParaDeletar);
    const posicao = pessoaParaDeletar.id - 1;
    pessoas.splice(posicao, 1, pessoaParaDeletar);
    dadosSistema.listaPessoas = pessoas;
    localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
    localStorage.removeItem('editarPessoa');

    alert('Cadastro deletado com sucesso!')
}

//----------------- TELA RELATÓRIOS -----------------
const containerLista = document.querySelector('.container-lista');
const containerTabela = document.querySelector('.container-tabela');
const btnImprimir = document.querySelector('#btn-imprimir');
let tituloLista = document.querySelector('#titulo');

function carregarTelaRelatorios() {
    window.location.href = "./relatorios.html";
}

function carregarListaPessoas() {
    tituloLista.innerText += '  >  Lista de Pessoas';
    containerLista.classList.add('inativo');
    containerTabela.classList.remove('inativo');
    btnImprimir.classList.remove('inativo');
    carregarTabela(pessoasSemDelete);

    filtrarBusca();
}

function imprimir() {
    window.print();
}