import { showError } from "./UI/alert.js";

const d = document;
const $formulario = d.getElementById("form");
const $result = d.getElementById("result");

const llenarInput = () => {
	const $selectCryto = d.querySelector("select#crypto");
	const $fragment = d.createDocumentFragment();
	const url =
		"https://min-api.cryptocompare.com/data/top/totalvolfull?limit=20&tsym=USD&api_key=474519003cb278eff4ffaad2d2c46adcca439dda671d0eff5b1043f57ac28121";

	fetch(url)
		.then((res) => res.json())
		.then((dataCrytos) => {
			const { Data: arrCrytos } = dataCrytos;
			arrCrytos.forEach((cryto) => {
				const {
					CoinInfo: { Name, FullName },
				} = cryto;
				const option = d.createElement("option");
				option.textContent = `${Name} - ${FullName}`;
				option.value = `${Name}`;
				$fragment.appendChild(option);
			});
			$selectCryto.appendChild($fragment);
		})
		.catch((err) => {
			console.log(err);
		});
};

const limpiarHTML = () => {
	while ($result.firstChild) {
		$result.removeChild($result.firstChild);
	}
};

const mostrarHTML = ({ Data: { Exchanges } }) => {
	limpiarHTML();
	const { MARKET, PRICE, HIGHDAY, LOWDAY } = Exchanges[0];

	const $template = d.getElementById("templatePrice").content;
	$template.querySelector("#exchange").textContent = MARKET;
	$template.querySelector("#priceNow").textContent = PRICE;
	$template.querySelector("#priceLow").textContent = LOWDAY;
	$template.querySelector("#priceHigh").textContent = HIGHDAY;
	const $clone = $template.cloneNode(true);
	$result.appendChild($clone);
};

const mostrarSpinner = () => {
	const div = document.createElement("div");
	div.classList.add("spinner");
	$result.appendChild(div);
};

const consultarAPI = (e) => {
	e.preventDefault();
	mostrarSpinner();
	const {
		moneda: { value: moneda },
		crypto: { value: crypto },
	} = $formulario;

	const url = `https://min-api.cryptocompare.com/data/top/exchanges/full?fsym=${crypto}&tsym=${moneda}&api_key=474519003cb278eff4ffaad2d2c46adcca439dda671d0eff5b1043f57ac28121`;

	fetch(url)
		.then((res) => res.json())
		.then((dataCrytos) => {
			if (dataCrytos.Response === "Error") {
				return Promise.reject(dataCrytos.Message);
			}
			return mostrarHTML(dataCrytos);
		})
		.catch((err) => {
			limpiarHTML();
			showError(err);
		});
};

d.addEventListener("DOMContentLoaded", llenarInput);
$formulario.addEventListener("submit", consultarAPI);
