const apikey = "f85f759535d648c38a720720250606";
const btnFetch = document.getElementById('btnFetch');
const resultDiv = document.getElementById('result');

btnFetch.onclick = async () => {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    resultDiv.textContent = "Por favor, digite uma cidade válida.";
    return;
  }

  const API = `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${encodeURIComponent(city)}&days=3`;

  resultDiv.textContent = "Buscando previsão...";

  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(res.status);

    const data = await res.json();

    let html = `<h2>Previsão para ${data.location.name}, ${data.location.country}</h2>`;
    html += `<p>Agora: ${data.current.temp_c}°C, ${data.current.condition.text}</p>`;
    html += `<h3>Próximos 3 dias:</h3><ul>`;

    data.forecast.forecastday.forEach(day => {
      html += `<li>${day.date}: Máx ${day.day.maxtemp_c}°C, Mín ${day.day.mintemp_c}°C — ${day.day.condition.text}</li>`;
    });

    html += `</ul>`;
    resultDiv.innerHTML = html;
  } catch (e) {
    resultDiv.textContent = `Erro: ${e.message}`;
  }
};