document.getElementById("formulario").addEventListener("submit", cadastrarVeiculo);

const VALOR_HORA = 1.50;

function cadastrarVeiculo(e) {
    e.preventDefault();
    var modeloCarro = document.querySelector("#modeloVeiculo").value;
    var placaCarro = document.querySelector("#placaVeiculo").value;
    var time = new Date();

    let carro = {
        modelo: modeloCarro,
        placa: placaCarro,
        entrada: time.getTime(), // Armazenando a hora de entrada em milissegundos
    };

    if (localStorage.getItem('patio') === null) {
        var carros = [];
        carros.push(carro);
        localStorage.setItem('patio', JSON.stringify(carros));
    } else {
        var carros = JSON.parse(localStorage.getItem('patio'));
        carros.push(carro);
        localStorage.setItem('patio', JSON.stringify(carros));
    }

    mostraPatio();
}

function apagarVeiculo(placa) {
    var carros = JSON.parse(localStorage.getItem("patio"));
    for (var i = 0; i < carros.length; i++) {
        if (carros[i].placa == placa) {
            carros.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("patio", JSON.stringify(carros));
    mostraPatio();
}

function mostraPatio() {
    var carros = JSON.parse(localStorage.getItem("patio"));
    var carrosResultado = document.querySelector("#resultados");

    carrosResultado.innerHTML = `
        <tr>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Hora de Entrada</th>
            <th>Tempo Estacionado</th>
            <th>Valor Estacionamento</th>
            <th>Ações</th>
        </tr>
    `;

    carros.forEach(function(carro, index) {
        var modelo = carro.modelo;
        var placa = carro.placa;
        var entrada = carro.entrada;

        // Calcular o tempo decorrido em tempo real
        function atualizarTempo() {
            var agora = new Date().getTime();
            var tempoDecorridoMs = agora - entrada;
            var horasEstacionadas = Math.floor(tempoDecorridoMs / 3600000);
            var minutosEstacionados = Math.floor((tempoDecorridoMs % 3600000) / 60000);
            var segundosEstacionados = Math.floor((tempoDecorridoMs % 60000) / 1000);

            var tempoFormatado = `${horasEstacionadas}h ${minutosEstacionados}m ${segundosEstacionados}s`;

            // Calcular valor do estacionamento
            var valorEstacionamento = horasEstacionadas * VALOR_HORA;

            // Atualizar HTML com o cronômetro e o valor
            document.getElementById(`tempo-${index}`).innerHTML = tempoFormatado;
            document.getElementById(`valor-${index}`).innerHTML = `R$ ${valorEstacionamento.toFixed(2)}`;
        }

        // Inserir linha na tabela
        carrosResultado.innerHTML += `
            <tr>
                <td>${modelo}</td>
                <td>${placa}</td>
                <td>${new Date(entrada).getHours()} : ${new Date(entrada).getMinutes()}</td>
                <td id="tempo-${index}">Calculando...</td>
                <td id="valor-${index}">Calculando...</td>
                <td><button class='btn btn-danger' onclick='apagarVeiculo("${placa}")'>EXCLUIR</button></td>
            </tr>
        `;

        // Iniciar cronômetro
        setInterval(atualizarTempo, 1000);
    });
}

mostraPatio();