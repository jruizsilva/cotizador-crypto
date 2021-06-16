const d = document;

const $result = d.getElementById("result");

export const showError = (msj) => {
	const div = d.createElement("div");
	div.classList.add("error");
	div.textContent = msj;
	$result.appendChild(div);
};
