// Versão 1.01 02/01/2021
// Variaveis Globais
var startedAnimation = false;
var lang; //idioma
var body; //corpo da pagina

// Definição de paginas e blocos
var menu = "./blocos/menu.txt";
var footer = "./blocos/footer.txt #";
var home = "./blocos/corpo.txt #";
var dfa = "./blocos/dfa.txt #";
var nfa = "./blocos/nfa.txt #";
var enfa = "./blocos/enfa.txt #";
var pda = "./blocos/pda.txt #";
var turing = "./blocos/turing.txt #";
var regex = "./blocos/regex.txt #";
var grammar = "./blocos/grammar.txt #";
var suporte = "./blocos/suporte.txt #";

// Funcao principal para carregamento conteudos
function main(body) {
	body = body || home; //se nulo atribui home

	$(document).ready(function () {
		if (!lang) {
			lang = $_GET("lang");
		}
		$("#nav").load(menu);
		$("#corpo").load(body + lang);
		// adicionar nova div para animacao "proximas versoes"
		$("#mycanvas").remove();
		if (body != home && body != dfa && body != suporte) {
			cria_newDiv(lang);
		}
		$("#footer").load(footer + lang);
	});
}

// obter parametros da URL para ?
function $_GET(param) {
	var vars = {};
	window.location.href.replace(location.hash, "").replace(
		/[?]+([^=&]+)=?([^&]*)?/gi, // regexp
		function (m, key, value) {
			// callback
			vars[key] = value !== undefined ? value : "";
		}
	);

	if (param) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

// adicionar nova div
function cria_newDiv(lang) {
	var novadiv = document.createElement("div");
	novadiv.setAttribute("id", "mycanvas");
	document.body.append(novadiv);
	underConstr(lang);
}

// Em construção animação Three.JS
function underConstr(lang) {
	init(lang);
	if (!startedAnimation) {
		startedAnimation = true;
		animate();
	}
}
