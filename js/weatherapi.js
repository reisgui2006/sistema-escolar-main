async function buscarClima() {
    const api = `https://api.weatherapi.com/v1/current.json?key=103de7ea13d4484b91e113148250606&q=Sao Paulo&lang=pt`

    try {
        const response = await fetch(api);
        if (!response.ok) throw new Error("Erro API!");

        const dados = await response.json();
        const temp = dados.current.temp_c;
        const condicao = dados.current.condition.text;

        document.getElementById("temperatura").innerHTML = `
            Clima de São Paulo: ${condicao} <br>Temperatura: ${temp}°C
        `;
    } catch (erro) {
        console.log(erro);
    }
}
buscarClima();