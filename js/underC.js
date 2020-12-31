// Versão 0.91 19/08/2020
// ThreeJS
var scene, camera, renderer, container, atom;

function init(lang) {
	// referencia ao elemento que apresentara a scene
	container = document.querySelector("#mycanvas");
	// Criação do objeto cena que vai ser depois adicionado ao objeto render
	scene = new THREE.Scene();
	// Criação de camera virtual com projeção em perspectiva, que vai ser depois adicionada ao objeto render
	camera = new THREE.PerspectiveCamera(
		45,
		container.clientWidth / container.clientHeight,
		0.1,
		1000
	);
	camera.position.set(0, 0, 60);
	camera.lookAt(0, 0, 0);
	// criacao dos objectos
	constroiObj();

	// coloca texto, em posição centrada e minima para versão telemovel
	// em conformidade com o idioma de navegação

	if (lang == "EN") {
		escreveTxt("Under construction...", "next versions.");
	} else if (lang == "ES") {
		escreveTxt("En construcción...", "próximas versiones.");
	} else {
		escreveTxt("Em construção...", "próximas versões.");
	}
	// Luz Ambiente
	luzAmbiente = new THREE.AmbientLight(0xffff00, 1);
	scene.add(luzAmbiente);

	// Renderizador
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	//definir proporção correta de pixels para o dispositivo em que está sendo executado
	renderer.setPixelRatio(window.devicePixelRatio);
	container.append(renderer.domElement);
}
// criacao dos objectos
function constroiObj() {
	atom = new THREE.Group();

	var geometry = new THREE.SphereBufferGeometry(10, 32, 32);
	var material = new THREE.MeshPhongMaterial({
		map: new THREE.TextureLoader().load("imgs/atom.jpg"),
		side: THREE.DoubleSide,
	});
	var aux = new THREE.Mesh(geometry, material);
	atom.add(aux);

	// Alguns clones
	for (i = 30; i < 90; i += 30) {
		var aux2 = aux.clone();
		aux2.position.set(-i, 0, -i / 5);
		atom.add(aux2);
		var aux3 = aux.clone();
		aux3.position.set(i, 0, -i / 5);
		atom.add(aux3);
	}

	aux = atom.clone();
	aux.rotation.z = Math.PI / 2;
	atom.add(aux);
	aux = atom.clone();
	aux.rotation.z = Math.PI / 4;
	atom.add(aux);

	scene.add(atom);
}

// Texto
function escreveTxt(txt1, txt2) {
	var loader = new THREE.FontLoader();

	loader.load("fonts/VW Head Office_Regular.json", function (font) {
		material = new THREE.MeshBasicMaterial({ color: 0x000000 });
		shapes = font.generateShapes(txt1, 2);
		geometry = new THREE.ShapeBufferGeometry(shapes);
		geometry.computeBoundingBox();
		texto1 = new THREE.Mesh(geometry, material);
		texto1.position.set(-38, 14, 20);
		scene.add(texto1);

		shapes = font.generateShapes(txt2, 2);
		geometry = new THREE.ShapeBufferGeometry(shapes);
		geometry.computeBoundingBox();
		texto2 = new THREE.Mesh(geometry, material);
		texto2.position.set(13, -15, 20);
		scene.add(texto2);
	});
}

// Resize
function onWindowResize() {
	// Se existir container, então estamos numa pagina com Three.Js
	if(container!=undefined){
	camera.aspect = container.clientWidth / container.clientHeight; // Para garantir que não há distorção
	camera.updateProjectionMatrix(); // atualiza de seguida a matriz de projeção

	renderer.setSize(container.clientWidth, container.clientHeight);}
}

window.addEventListener("resize", onWindowResize, false);

// Adiciona efeito animado a cena
function animate() {
	atom.rotation.x += 0.002;
	atom.rotation.z += 0.002;
	atom.rotation.y += 0.002;
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
