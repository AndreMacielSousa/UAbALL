// Versão 0.99 26/08/2020

// Variaveis globais
var nEstados; // numero de estados
var alfabeto; // alfabeto
var estadoInicial = 0; // Estado inicial
var simulate = 0; // simulação ainda não (re)iniciada
var prev_stat = -1; // indexante para estado anterior
var curr_stat = -1; // indexante para estado atual
var pos_input = -1; // indexante para posicao do input
var input = ""; // iniciação input
// base para testes para tabela simulacoes
var base_tests = "000\n001\n010\n011\n100\n101\n110\n111\naa\nab\nba\nbb\n10b";

// Construção tabela transições
function constroi_transitions() {
	// variaveis recolhidas do bloco dfa
	nEstados = parseInt(document.getElementById("nEstados").value);
	alfabeto = document.getElementById("symbols").value;

	//Contrução tabela trasições
	var tabela = document.getElementById("transitions");
	// (R)inicia tabela
	tabela.innerHTML = "";

	// Cria cabeçalho
	// primeira linha da tabela reservada para cabeçalho
	//https://www.w3schools.com/jsref/met_table_insertrow.asp [0=primeiro position || -1=last position]
	var row = tabela.insertRow(-1);
	//https://www.w3schools.com/jsref/met_tablerow_insertcell.asp [0=primeiro position || -1=last position]
	var cell = row.insertCell(-1);
	cell.innerHTML = "<b>q0</b>";
	var cell = row.insertCell(-1);
	cell.innerHTML = "<b>F(inal)</b>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<b>Q</b>";
	for (var i = 0; i < alfabeto.length; i++) {
		cell = row.insertCell(-1);
		cell.innerHTML = "<b>" + alfabeto.charAt(i) + "</b>";
	}
	// para cada estado uma nova linha
	// o primeiro estado reservamos a possiblidade de ser o inicial
	for (var i = 0; i < nEstados; i++) {
		row = tabela.insertRow(-1);
		cell = row.insertCell(-1);
		if (i == 0)
			cell.innerHTML =
				'<input type="radio" id="initial" checked name="initial" onchange="set_initial_state(' +
				i +
				')" value="' +
				i +
				'">';
		else
			cell.innerHTML =
				'<input type="radio" id="initial" name="initial" onchange="set_initial_state(' +
				i +
				')" value="' +
				i +
				'">';
		// o estado final poderá ser um ou mais a selecionar
		cell = row.insertCell(-1);
		cell.innerHTML = '<input type="checkbox"  id="Final' + i + '">';
		// identifica o estado de cada linha
		cell = row.insertCell(-1);
		cell.innerHTML = "q" + String(i);
		// para cada simbolo do alfabeto colocamos a possiblidade de transição

		for (var j = 0; j < alfabeto.length; j++) {
			str_select =
				'<select " id="X_' +
				i +
				"," +
				j +
				'">\n<option value="NaN">NaN</option>\n';
			// como estamnos com DFA todos os estados tem que ter uma transição,
			// para evitar erros, ate indicação contaria todos apontam para o ultimo estado [v.098]
			/*	var mn = nEstados - 1;
				str_select =
				'<select " id="X_' +
				i +
				"," +
				j +
				'" >\n<option value="q' +
				mn +
				'">NaN</option>\n';  */
			for (var k = 0; k < nEstados; k++) {
				str_select =
					str_select + '<option value="q' + k + '">q' + k + "</option>\n";
			}
			str_select = str_select + "</select>";
			cell = row.insertCell(-1);
			cell.innerHTML = str_select;
		}
	}
	// info para NaN
	row = tabela.insertRow(-1);
	cell = row.insertCell(-1);
	cell.colSpan = 5;
	if (lang == "EN") {
		cell.innerHTML =
			"<em><b>NaN</b>  empty transition. call will cause the machine to jam.</em>";
	} else if (lang == "ES") {
		cell.innerHTML =
			"<em><b>NaN</b> transición vacía. La llamada hará que la máquina se atasque.</em>";
	} else {
		cell.innerHTML =
			"<em><b>NaN</b> transição vazia. chamada provocará encravamento da máquina. </em>";
	}
	// Insere botoes de construção e guardar automato
	row = tabela.insertRow(-1);
	cell = row.insertCell(-1);
	cell.colSpan = 2;
	// butão para criar grafico
	if (lang == "EN") {
		cell.innerHTML =
			'<button id="create_graph_desc" onclick="create_graph_desc()">Build DFA</button>';
	} else if (lang == "ES") {
		cell.innerHTML =
			'<button id="create_graph_desc" onclick="create_graph_desc()">Construir DFA</button>';
	} else {
		cell.innerHTML =
			'<button id="create_graph_desc" onclick="create_graph_desc()">Construir DFA</button>';
	}
	cell = row.insertCell(-1);
	// butão para salvar automato criado
	if (lang == "EN") {
		cell.innerHTML =
			'<button id="save" onclick="grava_UAbALL()">Save </button>';
	} else if (lang == "ES") {
		cell.innerHTML =
			'<button id="save" onclick="grava_UAbALL()">Salvar </button>';
	} else {
		cell.innerHTML =
			'<button id="save" onclick="grava_UAbALL()">Guardar </button>';
	}
	// ativação da div simulação passo a passo
	document.getElementById("simula_viz").style.display = "none";
	//-- Tratamento de Outputs Ativa/esconde Container--
	inOutDiv();
}

// Define atribuidor do identificador do estado inicial
function set_initial_state(ns) {
	estadoInicial = ns;
}

// criação do grafico com recurso ao viz.js
function create_graph_desc() {
	// variaveis recolhidas do bloco dfa
	alfabeto = document.getElementById("symbols").value;
	nEstados = parseInt(document.getElementById("nEstados").value);
	// variavel de controlo de simulação [ 1=Sim || 0=Não ]
	stopit = 0;
	// caso já tenha sido iniciada a simulação
	if (simulate == 1) {
		// primeiro no [ 1=Sim || 0=Não ]
		primeiro = 0;
		if (prev_stat == -1 && curr_stat == -1) {
			curr_stat = estadoInicial;
			primeiro = 1;
		}
		pos_input++;
		// Chama a funcao para identicação do input consumido
		mostra_input_consumido("passo", pos_input, input);
		// Se chegamos na ultima posição o imput verificamos In(Sucesso)
		if (pos_input == input.length) {
			messagem_final();
			stopit = 1;
		} else if (primeiro != 1) {
			simb = input[pos_input];
			for (k = 0; k < alfabeto.length && alfabeto[k] != simb; k++);
			// Se o simbolo não esta presente no alfabeto identificamos o erro
			if (k == alfabeto.length) {
				mensagem_erro_sim(simb);
				stopit = 1;
			} else {
				// obtemos o estado seguinte da relação criada com o id
				// atualizamos as referencias para o anterior e seguinte
				/*		var val = document.getElementById("X_" + curr_stat + "," + k);
				var strUser = val.options[val.selectedIndex].value;
				prev_stat = curr_stat;
				curr_stat = parseInt(strUser.substring(1)); [v.098] */
				var val = document.getElementById("X_" + curr_stat + "," + k);
				var strUser = val.options[val.selectedIndex].value;
				if (strUser == "NaN") {
					maquina_encravada();
					stopit = 1;
				} else {
					prev_stat = curr_stat;
					curr_stat = parseInt(strUser.substring(1));
				}
			}
		}
	}

	// Construção do grafico
	// http://www.graphviz.org/Gallery/directed/fsm.html
	// rankdir "TB", "LR", "BT", "RL", corresponding to directed graphs drawn from top to bottom,
	// from left to right, from bottom to top, and from right to left, respectively.
	// Adicionamos um nó qi, para posteriormente criar o apontador para nó inicial
	cod_viz = "digraph finite_state_machine {\n rankdir=LR; qi";
	// para cada estado criamos um nó
	for (i = 0; i < nEstados; i++) cod_viz = cod_viz + " q" + i;
	cod_viz = cod_viz + ';\n size="8,5"\n';
	// atributo ponto qi branco para não ficar visivel
	cod_viz = cod_viz + " qi [shape=point color=white];\n";

	// atributos para os nos seguintes
	// o final fica com circulo duplo
	for (i = 0; i < nEstados; i++) {
		if (document.getElementById("Final" + i).checked) {
			// caso estejamos a correr simulação, então preenche de vermelho o nó final
			if (curr_stat == i && simulate == 1)
				cod_viz =
					cod_viz +
					" q" +
					i +
					" [shape=doublecircle style=filled color=black fillcolor=red];\n";
			else cod_viz = cod_viz + " q" + i + " [shape=doublecircle];\n";
		} else {
			// caso estejamos a correr simulação, então preenche de vermelho o nó não final
			if (curr_stat == i && simulate == 1)
				cod_viz =
					cod_viz +
					" q" +
					i +
					" [shape=circle style=filled color=black fillcolor=red];\n";
			else cod_viz = cod_viz + " q" + i + " [shape=circle];\n";
		}
	}

	// para cada estado ve as ligações para outros estados
	var lig = [];
	for (i = 0; i < nEstados; i++) {
		lig[i] = [];
		for (j = 0; j < nEstados; j++) {
			lig[i][j] = "";
		}
		for (j = 0; j < alfabeto.length; j++) {
			var val = document.getElementById("X_" + i + "," + j);
			var strUser = val.options[val.selectedIndex].value;
			to_state = parseInt(strUser.substring(1));
			lig[i][to_state] = lig[i][to_state] + alfabeto[j];
		}
	}
	// apontador qi para nó inicial Exemplo: qi -> q0;
	cod_viz = cod_viz + " qi -> q" + estadoInicial + ";\n";
	// para cada um dos estados criar os nós de ligação com respectivo label
	// Exemplo: q0 -> q1 [label="0,1" ];
	for (i = 0; i < nEstados; i++) {
		for (j = 0; j < nEstados; j++) {
			if (lig[i][j] != "") {
				//caso estejamos a correr uma simulação passo a passo, marca a vermelho a passagem
				if (simulate == 1 && prev_stat == i && curr_stat == j)
					cod_viz =
						cod_viz +
						" q" +
						i +
						" -> q" +
						j +
						' [label="' +
						lig[i][j].split("").join() +
						'" color=red];\n';
				else
					cod_viz =
						cod_viz +
						" q" +
						i +
						" -> q" +
						j +
						' [label="' +
						lig[i][j].split("").join() +
						'" ];\n';
			}
		}
	}

	// fim da construção do grafico
	cod_viz = cod_viz + "}\n";

	// TODO -> Ocultar quando não quiser que a consola imprima o
	// codigo disponiblizado para o Viz.JS
	// http://magjac.com/graphviz-visual-editor/
	// console.log(cod_viz);

	// (R)envia o grafico para o ecrã
	// O processo recoloca o grafico atualziado a cada passo simulado
	document.getElementById("graphviz_svg_div").innerHTML = "";
	var svgText = Viz(cod_viz, "svg");
	document.getElementById("graphviz_svg_div").innerHTML = "<hr>" + svgText;
	// Ativa div para input/output da simulação passo a passo
	document.getElementById("simula_viz").style.display = "block";

	//Se Simulação chegou ao fim, reinicia variaveis
	if (stopit == 1) {
		simulate = 0;
		pos_input = -2;
		prev_stat = -1;
		curr_stat = -1;
	}
}

// Função para mensagem maquina encravada add in [V.099]
function maquina_encravada() {
	if (lang == "EN") {
		document.getElementById("resultado").innerHTML =
			"No transition to the current symbol.<b style='color:red'> Jammed Machine.</b>";
	} else if (lang == "ES") {
		document.getElementById("resultado").innerHTML =
			"Sin transición al símbolo actual. <b style='color:red'>Máquina atascada.</b>";
	} else {
		document.getElementById("resultado").innerHTML =
			"Sem transição para o símbolo atual. <b style='color:red'>Máquina Encravada.</b>";
	}
}

// ao clicar botão de passo, para passo seguinte
function percorre() {
	// caso ainda não tenha sido iniciada a simulação
	if (simulate == 0) {
		pos_input = -2;
		prev_stat = -1;
		curr_stat = -1;
		// carrega input
		input = document.getElementById("input").value;
		// tamanho do input
		tam_input = input.length;
	}
	// ativa booleano para simulacao iniciada
	simulate = 1;
	// output para passo processado
	document.getElementById("resultado").innerHTML = "xxxxxxx";
	// Se chegamos ao fim, reiniciamos variaveis
	if (pos_input > tam_input) {
		pos_input = -2;
		prev_stat = -1;
		curr_stat = -1;
		document.getElementById("resultado").innerHTML = "";
	}
	// voltamos para a criação do grafico
	create_graph_desc();
}

// mensagem final multilingue (In)Sucesso
function messagem_final() {
	if (document.getElementById("Final" + curr_stat).checked) {
		if (lang == "EN") {
			document.getElementById("resultado").innerHTML = "Success!";
		} else if (lang == "ES") {
			document.getElementById("resultado").innerHTML = "Éxito!";
		} else {
			document.getElementById("resultado").innerHTML = "Successo!";
		}
	} else {
		if (lang == "EN") {
			document.getElementById("resultado").innerHTML = "Failed...";
		} else if (lang == "ES") {
			document.getElementById("resultado").innerHTML = "Fallido...";
		} else {
			document.getElementById("resultado").innerHTML = "Falhou...";
		}
	}
}

// mensagem de erro MultiLingue Simbolo nao existe
function mensagem_erro_sim(simb) {
	if (lang == "EN") {
		document.getElementById("resultado").innerHTML =
			"Unrecognized symbol: <b style='color:red'>" +
			simb +
			" </b>not in alphabet...";
	} else if (lang == "ES") {
		document.getElementById("resultado").innerHTML =
			"Símbolo no reconocido: <b style='color:red'>" +
			simb +
			" </b>no en el alfabeto...";
	} else {
		document.getElementById("resultado").innerHTML =
			"Símbolo não reconhecido: <b style='color:red'>" +
			simb +
			" </b>não está no alfabeto...";
	}
}
// Funcao para identicação do input consumido
function mostra_input_consumido(tipo_Sim, para_position, para_input) {
	var temp = "";
	for (i = 0; i < para_position; i++) {
		// coloca todo o input na variavel temporaria até à posição atual
		if (i < para_position) temp = temp + para_input.charAt(i);
	}
	// adiciona o marcador [ e o caracter consumido
	temp = temp + "[";
	if (para_position >= 0) {
		temp += para_input.charAt(i);
		i++;
	}
	// fecha o marcador
	temp += "]";
	// adiciona o restante input na variavel temporaria
	for (; i < para_input.length; i++) {
		temp = temp + para_input.charAt(i);
	}
	// Caso o pedido tenha vindo da tabela de simulação, retorna a variavel tempo
	// caso contrario, apresenta o resultado na respectiva div
	if (tipo_Sim == "charge") {
		return temp;
	} else {
		document.getElementById("inputConsumido").value = temp;
	}
}

// -- Tabela Simulações div "charge"
// Limpar conteudos da tabela de simulação
function limpar() {
	document.getElementById("run_simul").disabled = false;
	//-- Tratamento de Outputs Ativa/esconde Container--
	inOutDiv();
	document.getElementById("limp_simul").disabled = true;
}

// Função para chamar simulacao da base de testes e apresentar resultado na tabela
function simular() {
	// desativar o botao de correr base_tests
	document.getElementById("run_simul").disabled = true;
	// carrega as palavras a testar
	base_tests = document.getElementById("base_tests").value;
	// Inicializa variavel de entrada com as palavras pela quebra de linha
	var Inputs = base_tests.split("\n");
	// Incializa a mensagem de saida
	var Outputs = "";
	// para cada palavra corre a simulação
	for (var i = 0; i < Inputs.length; i++) {
		var para_input = Inputs[i];
		var res = simular_1(para_input);
		// para cada resultado é criada uma linha com 3 colunas
		Outputs =
			Outputs +
			// palavra em analise
			"<tr><td style='border: 1px solid black'>" +
			para_input +
			"</td><td style='border: 1px solid black'>" +
			// resultado
			res[0] +
			"</td></td><td style='border: 1px solid black'>" +
			// input consumido
			res[1] +
			"</td></tr>\n";
	}
	// cabeçalho da tabela
	Outputs =
		"<table id='simTable'>\n<tr><td bgcolor=lightgrey>input</td><td bgcolor=lightgrey>resultado</td><td bgcolor=lightgrey>input consumido</td>\n" +
		Outputs +
		"</table>";
	// carrega resultados para a respetiva div
	document.getElementById("results").innerHTML = Outputs;
	// reativa o botão limpar simulação
	document.getElementById("limp_simul").disabled = false;
	//
}

// Função de simulação de palavras
function simular_1(para_input) {
	var alfabeto = document.getElementById("symbols").value;
	var nEstados = parseInt(document.getElementById("nEstados").value);
	var stopit = 0;

	var primeiro = 0;
	var prev_stat = -1;
	var curr_stat = -1;
	var pos = -1;

	while (stopit == 0) {
		if (prev_stat == -1 && curr_stat == -1) {
			curr_stat = estadoInicial;
			primeiro = 1;
			continue;
		}

		pos++;

		if (pos == para_input.length) {
			if (document.getElementById("Final" + curr_stat).checked) {
				// fim com sucesso
				resultMG(1, curr_stat);
			} else {
				// fim sem sucesso
				resultMG(0, curr_stat);
			}

			stopit = 1;
		} else {
			simb = para_input[pos];
			for (var k = 0; k < alfabeto.length && alfabeto[k] != simb; k++);
			if (k == alfabeto.length) {
				// simbolo fora do alfabeto e paragem
				resultMG(2, curr_stat);
				stopit = 1;
			} else {
				var val = document.getElementById("X_" + curr_stat + "," + k);
				var strUser = val.options[val.selectedIndex].value;

				if (strUser == "NaN") {
					maquina_encravada2(simb, curr_stat);
					stopit = 1;
				} else {
					prev_stat = curr_stat;
					curr_stat = parseInt(strUser.substring(1));
				}
			}
		}
	}
	// variavel resultante em array com [resultado, input consumido]
	var resultado = [result, mostra_input_consumido("charge", pos, para_input)];
	return resultado;
}
// Funcao mensagem maquina encravada para tabela de simulação [v.099]
function maquina_encravada2(simb, curr_stat) {
	if (lang == "EN") {
		result =
			"No transition for the current symbol " +
			simb +
			" on state q" +
			curr_stat;
	} else if (lang == "ES") {
		result =
			"Sin transición para el actual símbolo " +
			simb +
			" en estado q" +
			curr_stat;
	} else {
		result =
			"Sem transição para o atual símbolo " + simb + " no estado q" + curr_stat;
	}

	return result;
}

// Mensagens MultiLingue das mensagens da simulação
function resultMG(info, curr_stat) {
	if (info == 1) {
		if (lang == "EN") {
			result =
				"<b style='color:green'> Success! </b>Reached final state q" +
				curr_stat;
		} else if (lang == "ES") {
			result =
				"<b style='color:green'>¡Éxito! </b>Estado final alcanzado q" +
				curr_stat;
		} else {
			result =
				"<b style='color:green'>Sucesso! </b>Estado final alcançado q" +
				curr_stat;
		}
	} else if (info == 0) {
		if (lang == "EN") {
			result =
				"<b style='color:red'>Failed.</b> Reached non final state q" +
				curr_stat;
		} else if (lang == "ES") {
			result =
				"<b style='color:red'>Fallido.</b> Estado no final alcanzado q" +
				curr_stat;
		} else {
			result =
				"<b style='color:red'>Falha.</b> Alcançou o estado não final q" +
				curr_stat;
		}
	} else {
		if (lang == "EN") {
			result =
				"Unrecognized symbol: <b style='color:red'> " +
				simb +
				"</b> not in alphabet...";
		} else if (lang == "ES") {
			result =
				"Símbolo no reconocido: <b style='color:red'>" +
				simb +
				"</b> no en alfabeto...";
		} else {
			result =
				"Símbolo não reconhecido: <b style='color:red'> " +
				simb +
				"</b> não está alfabeto...";
		}
	}
	return result;
}
// -- Fim! Tabela Simulações div "charge"

//-- Tratamento de Outputs Ativa/esconde Container--
// https://www.w3schools.com/jsref/prop_style_display.asp
function inOutDiv() {
	// ativa div tabela de testes
	document.getElementById("charge").style.display = "block";
	// carrega base de testes das variaveis globais e introduzidas
	document.getElementById("results").innerHTML =
		'<textarea id="base_tests" rows=15 cols=50>' + base_tests + "</textarea>";
	// ativa div com os resultados da tabela de testes
	document.getElementById("results").style.display = "block";
	// esconde ficheiro carregar, deixa fazer sentido nesta fase
	document.getElementById("file").style.display = "none";
}

// -- Processamento de Ficheiros
//-- Grava ficheiro para utilizar a posterior --
function grava_UAbALL() {
	// primeiro ler nestados
	nEstados = parseInt(document.getElementById("nEstados").value);
	// segundo captura simbolos
	alfabeto = document.getElementById("symbols").value;
	// inicia texto a guardar
	UAbALL_text = "";
	//adiciona ao texto, por esta ordem: nEstados + simbolos + estado inicial
	UAbALL_text =
		UAbALL_text + nEstados + "\n" + alfabeto + "\n" + estadoInicial + "\n";
	// marca estados finais com 1, os restantes com 0
	for (i = 0; i < nEstados; i++) {
		if (document.getElementById("Final" + i).checked) {
			UAbALL_text = UAbALL_text + "1";
		} else {
			UAbALL_text = UAbALL_text + "0";
		}
	}
	//adiciona quebra de linha
	UAbALL_text = UAbALL_text + "\n";

	// da quarta linha até a linha indexada pelo numero de estados
	// verifica transições para cada estado separando com ";",
	// para a sequencia e simbolos, pela ordem que foram carregados
	// adicionando uma quebra de linha no final de cada estado
	for (i = 0; i < nEstados; i++) {
		for (j = 0; j < alfabeto.length; j++) {
			var val = document.getElementById("X_" + i + "," + j);
			var strUser = val.options[val.selectedIndex].value;
			to_state = "";
			if (strUser != "") {
				to_state = parseInt(strUser.substring(1));
			}
			if (j > 0) UAbALL_text = UAbALL_text + ";";
			UAbALL_text = UAbALL_text + to_state;
		}
		UAbALL_text = UAbALL_text + "\n";
	}
	// adiciona base para casos de testes
	UAbALL_text = UAbALL_text + base_tests;

	// pede o nome do ficheiro multilingue
	if (lang == "EN") {
		fich = prompt("Insert filename (default='UAbALL.txt')", "UAbALL.txt");
	} else if (lang == "ES") {
		fich = prompt(
			"Insertar nombre de archivo (default='UAbALL.txt')",
			"UAbALL.txt"
		);
	} else {
		fich = prompt("Inserir Nome Ficheiro (default='UAbALL.txt')", "UAbALL.txt");
	}

	// processa gravação com nome selcionado, caso contrario com default
	if (fich != null) {
		if (fich == "") fich = "UAbALL.txt";
		// texto a salvar, nome do ficheiro
		saveTextAsFile(UAbALL_text, fich);
	}
}

// Download ficheiro como texto com recurso ao objecto Blob e URL.createObjectURL()
// https://developer.mozilla.org/pt-BR/docs/Web/API/Blob
// https://developer.mozilla.org/pt-BR/docs/Web/API/URL/createObjectURl
function saveTextAsFile(textToSave, fileNameToSaveAs) {
	var textoSalvar = new Blob([textToSave], { type: "text/plain" });
	var textToSaveAsURL = window.URL.createObjectURL(textoSalvar);
	var abc = document.createElement("a");
	var xyz = document.createTextNode("Tutorials");
	abc.append(xyz);
	abc.download = fileNameToSaveAs;
	abc.innerHTML = "Download File";
	abc.href = textToSaveAsURL;
	abc.style.display = "none";
	document.body.append(abc);
	abc.click(); 
	// alerta de sucesso - Metodo alert() - Com multilingue
	// https://www.w3schools.com/jsref/met_win_alert.asp
	if (lang == "EN") {
		alert("File stored in your download folder.");
	} else if (lang == "ES") {
		alert("Archivo guardado en la carpeta de descargas.");
	} else {
		alert("Ficheiro guardado na sua pasta de transferências.");
	}
}

//-- Carregamento de ficheiro --
function ler_UAbALL() {
	// Load file como texto para processamento com recurso ao objecto FileReader
	loadFileAsText(ler_UAbAllCont);
}

function ler_UAbAllCont(fileContent)
{
		// alerta de sucesso - Metodo alert() - Com multilingue
	// https://www.w3schools.com/jsref/met_win_alert.asp
	if (lang == "EN") {
		alert("File loaded.");
	} else if (lang == "ES") {
		alert("Archivo cargado.");
	} else {
		alert("Ficheiro carregado.");
	}

	linhas = fileContent.split("\n");
	nEstados = parseInt(linhas[0]);
	document.getElementById("nEstados").value = linhas[0]; // primeira linha nEstados
	document.getElementById("symbols").value = linhas[1]; // segunda linha simbolos
	estadoInicial = parseInt(linhas[2]); // terceira linha estado inicial
	constroi_transitions(); // chama construção de transições

	// verifica estado final, posicao marcada a 1 no ficheiro
	for (var i = 0; i < nEstados; i++) {
		if (linhas[3].charAt(i) == "1") {
			document.getElementById("Final" + i).checked = true;
		}
	}

	// da quinta linha até a linha indexada pelo numero de estados
	// verifica transições para cada estado que estao separados por ";",
	// para a sequencia e simbolos, pela ordem que foram carregados
	for (i = 0; i < nEstados; i++) {
		colunas = linhas[4 + i].split(";");
		for (j = 0; j < linhas[1].length; j++) {
			if (colunas[j] != "") {
				var val = document.getElementById("X_" + i + "," + j);
				val.selectedIndex = parseInt(colunas[j]) + 1;
			}
		}
	}

	// as restantes linhas são base de testes
	var resto = "";
	for (var i = nEstados + 4; i < linhas.length; i++) {
		resto = resto + "\n" + linhas[i];
	}
	base_tests = resto;
	//-- Tratamento de Outputs Ativa/esconde Container--
	inOutDiv();
}

// Load file como texto para processamento com recurso ao objecto FileReader
// https://developer.mozilla.org/pt-BR/docs/Web/API/FileReader
function loadFileAsText(callBack) {
	var fileToLoad = document.getElementById("fileToLoad").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function (fileLoadedEvent) {
		callBack(fileLoadedEvent.target.result);
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}
// -- Fim! Processamento de Ficheiros
