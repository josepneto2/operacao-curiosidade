const usuario = {
    id: 0,
    nome: "",
    email: "",
    senha: "",
    deletado: false
};

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
    dataCadastro: "",
    ativo: false,
    deletado: false
};

//----------------- LOGOUT -----------------

const btnSair = document.querySelector("#btn-sair");

if(btnSair) {
    btnSair.addEventListener('click', () => localStorage.removeItem("usuarioLogado"));
}

//----------------- DADOS -----------------
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

function obterPessoasSistema() {
    const dados = obterDadosSistema();
    if(!dados) {
        return false;
    }
    
    const dadosPessoas = dados.listaPessoas;
    return dadosPessoas;
}

let dadosSistema = obterDadosSistema();
let usuarios = obterUsuariosSistema();
let pessoas = obterPessoasSistema();
const pessoasSemDelete = pessoas.filter(p => p.deletado === false);

//----------------- TELA HOME -----------------
function carregarTelaHome() {
    window.location.href = "./home.html";
}

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

const opcaoAdm = document.querySelector('.opcao-admin');
if(usuarioLogado) {
    let adminOn = usuarioLogado.nome === 'Admin' ? 'flex' : 'none'
    opcaoAdm.style.display = adminOn;
}

let nomeUsuario = document.querySelector("#nome-usuario");
if(nomeUsuario){
    nomeUsuario.innerText = usuarioLogado.nome;
}

const numTotal = document.querySelector("#num-total");
const numMes = document.querySelector("#num-mes");
const numPendencia = document.querySelector("#num-pendencia");

const tabela = document.querySelector('.tabela');
let tbody = document.getElementsByTagName('tbody')[0];

async function carregarDadosHome() {
    const quantidadeTotalCadatros = await fetch('https://localhost:7136/api/Pessoas/quantidadeCadastros')
    .then(response => response.json());
    const quantidadeCadatrosUltimoMes = await fetch('https://localhost:7136/api/Pessoas/quantidadeCadastrosUltimoMes')
    .then(response => response.json());
    
    const quantidadeCadastrosPendentes = await fetch('https://localhost:7136/api/Pessoas/quantidadeCadastrosPendentes')
    .then(response => response.json());

    numTotal.innerText = quantidadeTotalCadatros;
    numMes.innerText = quantidadeCadatrosUltimoMes;
    numPendencia.innerText = quantidadeCadastrosPendentes;

    carregarTabela();
    filtrarBusca(pessoasSemDelete, carregarTabela);
}

async function carregarTabela() {
    const pessoas = await fetch('https://localhost:7136/api/Pessoas')
        .then(response => response.json())
        .catch(err => console.error(err));
        
    pessoas.forEach((pessoa) => {
        const tdNome = document.createElement('td');
        tdNome.innerText = pessoa.nome;
        const tdEmail = document.createElement('td');
        tdEmail.innerText = pessoa.email;
        const tdStatus = document.createElement('td');
        tdStatus.innerText = pessoa.status;
        
        tdStatus.innerText = 'Ativo';
        if (pessoa.ativo === false) {
            tdNome.id = 'statusInativo';
            tdEmail.id = 'statusInativo';
            tdStatus.id = 'statusInativo';
            tdStatus.innerText = 'Inativo';
        }

        const tr = document.createElement('tr');
        tr.setAttribute('onclick', 'editarPessoa(event)');
        tr.appendChild(tdNome);
        tr.appendChild(tdEmail);
        tr.appendChild(tdStatus);
        tbody.appendChild(tr);
    });
}

function filtrarBusca(pessoas, carregarTabela) {
    const barraPesquisa = document.querySelector('#barra-pesquisa');

    barraPesquisa.addEventListener('input', function() {
        let termoPesquisado = barraPesquisa.value;
        let pessoasEncontradas = pessoas.filter(pessoa => pessoa.nome.includes(termoPesquisado));
        tbody.innerHTML = '';
        carregarTabela(pessoasEncontradas);
    });
}

function editarPessoa(event) {
    event.preventDefault()
    let pessoaParaEditar = event.target.innerText;
    localStorage.setItem('editarPessoa', pessoaParaEditar);
    window.location.href = "./editar-pessoa.html";
}

async function editarPessoa(event) {
    const pessoaParaEditar = event.target.innerText;
    const pessoa = await fetch(`https://localhost:7136/api/Pessoas/${pessoaParaEditar}`)
        .then(response => response.json());

    localStorage.setItem('editarPessoa', JSON.stringify(pessoa));
    window.location.href = "./editar-pessoa.html";
}

//----------------- TELA CADASTRO -----------------
function carregarTelaCadastro() {
    window.location.href = "./cadastro.html";
}

function carregarDadosCadastro() { 
    carregarTabela();

    filtrarBusca(pessoasSemDelete, carregarTabela);
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
    let statusValor = false;
    for(let i = 0; i < statusRadios.length; i++) {
        if(statusRadios[0].checked) {
            statusValor = true;
            break;
        }
    }
    
    if(!verificarNome(nome.value)) {
        event.preventDefault();
        erroInput(nome);
        return;
    }
    
    if(!verificarEmail(email.value)) {
        event.preventDefault();
        erroInput(email);
        return;
    }

    if (idade.value < 0 || idade.value > 100) {
        event.preventDefault();
        erroInput(idade);
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
    pessoa.dataCadastro = "2024-12-11";
    pessoa.ativo = statusValor;

    const pagina = window.location.href;
    const paginaAtual = pagina.split('/').pop();
    
    if(paginaAtual === "novo-cadastro.html"){
        fetch('https://localhost:7136/api/Pessoas', {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pessoa),
        })
            .then(response => response.json())
            .catch(err => console.error(err));
        
        alert('Cadastro realizado com sucesso!');
    } else {
        let pessoaParaEditar = JSON.parse(localStorage.getItem('editarPessoa'));
        pessoa.id = pessoaParaEditar.id;
        pessoa.dataCadastro = pessoaParaEditar.dataCadastro 

        fetch(`https://localhost:7136/api/Pessoas/${pessoaParaEditar.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pessoa),
        })
            .then(response => response.json())
            .catch(err => console.error(err));

        localStorage.removeItem('editarPessoa');
        
        alert('Cadastro alterado com sucesso!');
    }
}

function erroInput(input) {
    input.focus();
    input.value = "";
    input.style.border = '1px solid red';
    if (input.id === "idade"){
        input.setAttribute('placeholder', '*Idade inválida');
        return;
    }
    input.setAttribute('placeholder', '*O campo deve ser preenchido corretamente');
}

function verificarNome(nome) {
    if(nome.length < 3) {
        return false;
    }
    
    const regex = new RegExp(/^([A-ZÀ-Ú][a-zà-ú]*\s)*[A-ZÀ-Ú][a-zà-ú]*$/);
    const nomeValido = regex.test(nome);
    return nomeValido;
}

function verificarEmail(email) {
    const regex = new RegExp(/^([\w]{3,}\.?)@([a-z]{3,}\.)+([a-z]{2,})$/);
    const emailValido = regex.test(email);
    return emailValido;
}

//----------------- TELA EDITAR CADASTRO -----------------
function carregarDadosEdicao() {
    let pessoaParaEditar = JSON.parse(localStorage.getItem('editarPessoa'));

    if(pessoaParaEditar.ativo === false) {
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
    fetch(`https://localhost:7136/api/Pessoas/${pessoaParaDeletar.id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .catch(err => console.error(err));
    localStorage.removeItem('editarPessoa');
    
    alert('Cadastro deletado com sucesso!');
}

//----------------- TELA RELATÓRIOS -----------------
function carregarTelaRelatorios() {
    window.location.href = "./relatorios.html";
}

const containerLista = document.querySelector('.container-lista');
const containerTabela = document.querySelector('.container-tabela');
const btnImprimir = document.querySelector('#btn-imprimir');
let tituloLista = document.querySelector('#titulo');

function carregarListaPessoas() {
    tituloLista.innerText += '  >  Lista de Pessoas';
    containerLista.classList.add('inativo');
    containerTabela.classList.remove('inativo');
    btnImprimir.classList.remove('inativo');
    carregarTabela();
    
    filtrarBusca(pessoasSemDelete, carregarTabela);
}

function imprimir() {
    window.print();
}

//----------------- TELA ADMIN -----------------
function carregarTelaAdmin() {
    window.location.href = "./admin.html";
}

let ususariosSemDelete = usuarios.filter(u => u.deletado === false);

function carregarAdmin() {
    carregarTabelaUsuarios(ususariosSemDelete)
    
    buscarUsuario(ususariosSemDelete, carregarTabelaUsuarios);
}

function carregarTabelaUsuarios(usuarios) {
    usuarios.forEach((usuario) => {
        const tdNome = document.createElement('td');
        tdNome.innerText = usuario.nome;
        const tdEmail = document.createElement('td');
        tdEmail.innerText = usuario.email;
        
        const tr = document.createElement('tr');
        tr.setAttribute('onclick', 'editarUsuario(event)');
        tr.appendChild(tdNome);
        tr.appendChild(tdEmail);
        tbody.appendChild(tr);
    });
}

//----------------- TELA ADMIN - CADASTRAR USUÁRIO -----------------
function carregarTelaCadastroUsuario() {
    window.location.href = "./cadastro-usuario.html";
}

const senha = document.querySelector('#senha');
const confirmaSenha = document.querySelector('#confirma-senha');

function cadastrarUsuario(event) {
    if(!verificarNome(nome.value)) {
        event.preventDefault();        
        erroInput(nome);
        return;
    }
    
    if(!verificarEmail(email.value)) {
        event.preventDefault();
        erroInput(email);
        return;
    }
    
    if(!verificarSenha(senha, confirmaSenha)){
        event.preventDefault();
        return;
    }
    
    usuario.nome = nome.value;
    usuario.email = email.value;
    usuario.senha = senha.value;

    const pagina = window.location.href;
    const paginaAtual = pagina.split('/').pop();
    
    if(paginaAtual === "cadastro-usuario.html"){
        usuario.id = usuarios.length + 1;
        usuarios.push(usuario);
        dadosSistema.listaUsuarios = usuarios;
        localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
        
        alert('Cadastro realizado com sucesso!');
    } else {
        let usuarioParaEditar = JSON.parse(localStorage.getItem('editarUsuario'));
        if (usuarioParaEditar.nome === 'Admin') {
            localStorage.removeItem('editarUsuario');
            alert('ADMIN não pode ser editado!');
            return;
        }

        usuario.id = usuarioParaEditar.id;
        
        const posicao = usuarioParaEditar.id - 1;
        usuarios.splice(posicao, 1, usuario);
        dadosSistema.listaUsuarios = usuarios;
        localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
        localStorage.removeItem('editarUsuario');
        
        alert('Cadastro alterado com sucesso!');
    }
}

function verificarSenha(senha, confirmaSenha) {
    if(senha.value.length < 3){
        senha.focus();
        senha.value = "";
        senha.style.border = '1px solid red';
        senha.setAttribute('placeholder', '*A senha deve ter pelos 3 caracteres');
        return false;
    }
    
    if(senha.value !== confirmaSenha.value) {
        confirmaSenha.focus();
        confirmaSenha.value = "";
        confirmaSenha.style.border = '1px solid red';
        confirmaSenha.setAttribute('placeholder', '*As senhas são diferentes');
        return false;
    } else {
        return true;
    }
}

function mostrarSenha() {
    let atributo = senha.getAttribute('type')
    let mudaTipo = atributo === 'password' ? 'text' : 'password'
    senha.setAttribute('type', mudaTipo)
    confirmaSenha.setAttribute('type', mudaTipo)
}

//----------------- TELA ADMIN - EDITAR USUÁRIO -----------------
function carregarTelaEditarUsuario() {
    window.location.href = "./editar-usuario.html";
}

function carregarDadosEditarUsuario() {
    let usuarioParaEditar = JSON.parse(localStorage.getItem('editarUsuario'));
    
    nome.value = usuarioParaEditar.nome;
    email.value = usuarioParaEditar.email;
    senha.value = usuarioParaEditar.senha;
    confirmaSenha.value = usuarioParaEditar.senha;
}

function buscarUsuario(usuarios, carregarTabelaUsuarios) {
    const barraPesquisa = document.querySelector('#busca-usuario');
    
    barraPesquisa.addEventListener('input', function() {
        let termoPesquisado = barraPesquisa.value;
        let usuariosEncontrados = usuarios.filter(usuario => usuario.nome.includes(termoPesquisado) || usuario.email.includes(termoPesquisado));
            tbody.innerHTML = '';
            carregarTabelaUsuarios(usuariosEncontrados);
    });
}

function editarUsuario(event) {
    let usuarioParaEditar = event.target.innerText;
    usuarioParaEditar = usuarios.find(u => u.nome === usuarioParaEditar || u. email === usuarioParaEditar);
    localStorage.setItem('editarUsuario', JSON.stringify(usuarioParaEditar));
    window.location.href = "./editar-usuario.html";
}

function deletarUsuario(event) {
    let usuarioParaDeletar = JSON.parse(localStorage.getItem('editarUsuario'));
    if (usuarioParaDeletar.nome === 'Admin') {
        localStorage.removeItem('editarUsuario');
        alert('ADMIN não pode ser deletado!');
        return;
    }
    
    usuarioParaDeletar.deletado = true;

    const posicao = usuarioParaDeletar.id - 1;
    usuarios.splice(posicao, 1, usuarioParaDeletar);
    dadosSistema.listaUsuarios = usuarios;
    localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
    localStorage.removeItem('editarUsuario');
    
    alert('Cadastro deletado com sucesso!');
}