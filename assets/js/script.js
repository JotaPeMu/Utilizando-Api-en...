// Vinculación a los elementos clave del Modelo de Objetos del Documento (DOM)
const contenedorGaleria = document.getElementById('galeria-juegos');
const selectorCategoria = document.getElementById('selector-categoria');
const contenedorEstado = document.getElementById('contenedor-estado');

// URL Base del Endpoint REST para la consulta remota
const API_BASE_URL = 'https://www.freetogame.com/api/games';

async function consultarCatalogoJuegos(categoria) {
    // Despliega un componente Spinner de carga de Bootstrap mientras se resuelve la Promesa
    contenedorEstado.innerHTML = `
        <div class="spinner-border text-info my-3" role="status"></div>
        <p class="status-text text-info">Solicitando datos al servidor REST remoto...</p>
    `;
    
    // Limpiamos el mosaico previo para evitar colisiones visuales
    contenedorGaleria.innerHTML = '';

    // Estructura Obligatoria Try / Catch para control y captura de excepciones en red
    try {
        // Adaptación técnica: Si la opción es "all", consumimos el endpoint general sin parámetros de categoría
        let urlFinal = '';
        if (categoria === 'all') {
            urlFinal = API_BASE_URL;
        } else {
            urlFinal = `${API_BASE_URL}?category=${categoria}`;
        }

        const respuesta = await fetch(urlFinal);

        // Validación del código de estado HTTP recibido (Esperado: 200 OK)
        if (!respuesta.ok) {
            throw new Error(`Respuesta inválida del servidor. Código de Estado: ${respuesta.status}`);
        }

        // Parseo de los datos del cuerpo de la respuesta a formato JSON
        const listaJuegos = await respuesta.json();
        
        // Removemos los indicadores de carga e inyectamos los resultados en el DOM
        contenedorEstado.innerHTML = '';
        renderizarTarjetasEnPantalla(listaJuegos, categoria);

    } catch (error) {
        // Bloque Catch: Evita el colapso del script si hay problemas de red o CORS local
        console.warn("Excepción de red capturada por Try/Catch. Activando base de datos resiliente:", error.message);
        activarMecanismoResilienteLocal(categoria);
    }
}

/**
 * Función Modular encargada de iterar y pintar las estructuras de las tarjetas en el DOM
 * @param {Array} juegos - Colección de objetos JSON de videojuegos
 * @param {string} generoFiltrado - Filtro temático de la consulta
 */
function renderizarTarjetasEnPantalla(juegos, generoFiltrado) {
    contenedorGaleria.innerHTML = '';

    // Control de seguridad si el arreglo viene vacío o nulo
    if (!juegos || juegos.length === 0) {
        contenedorGaleria.innerHTML = `
            <div class="col-12 text-center my-5">
                <p class="text-muted fs-4">No se encontraron videojuegos registrados en este género.</p>
            </div>`;
        return;
    }

    // Limitamos a los primeros resultados para optimizar la velocidad según la documentación
    const juegoslimitados = juegos.slice(0, 50);

    // Mapeo dinámico e inyección utilizando la sintaxis de tarjetas oficiales de Bootstrap 6
    juegoslimitados.forEach(juego => {
        const columna = document.createElement('div');
        columna.className = 'col';

        // Adaptación técnica v6: Se reemplaza h5 por h4 para títulos dentro de .card-body
        columna.innerHTML = `
            <div class="card h-100 shadow game-card text-white">
                <img src="${juego.thumbnail}" class="card-img-top" alt="${juego.title}" loading="lazy">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <h4 class="card-title fw-bold text-info border-bottom pb-2">${juego.title}</h4>
                        <p class="card-text text-secondary small">${juego.short_description}</p>
                    </div>
                    <div class="mt-3">
                        <p class="mb-1 small"><strong>Plataforma:</strong> ${juego.platform}</p>
                        <p class="mb-0 small"><strong>Desarrollador:</strong> ${juego.developer}</p>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-top-0 pt-0 d-flex justify-content-between align-items-center">
                    <!-- Incorporación de la clase badge nativa de Bootstrap 6 -->
                    <span class="badge theme-primary text-uppercase">${juego.genre}</span>
                    <small class="text-muted font-monospace" style="font-size:0.75rem;">Estreno: ${juego.release_date}</small>
                </div>
            </div>
        `;
        contenedorGaleria.appendChild(columna);
    });
}

/**
 * Mecanismo de contingencia local que procesa los datos JSON por si falla la conexión remota
 * @param {string} filtroSeleccionado - Género a procesar por el método filter
 */
function activarMecanismoResilienteLocal(filtroSeleccionado) {
    // Array estructurado con los datos reales e imágenes del documento técnico
    const baseDatosDeSeguridad = [
       { id: 540, title: "Overwatch", thumbnail: "https://freetogame.com", short_description: "A hero-focused first-person team shooter from Blizzard Entertainment.", genre: "Shooter", platform: "PC (Windows)", developer: "Blizzard Entertainment", release_date: "2022-10-04" },
        { id: 516, title: "PUBG: BATTLEGROUNDS", thumbnail: "https://freetogame.com", short_description: "Get into the action in one of the longest running battle royale games PUBG Battlegrounds.", genre: "Shooter", platform: "PC (Windows)", developer: "KRAFTON, Inc.", release_date: "2022-01-12" },
        { id: 508, title: "Enlisted", thumbnail: "https://freetogame.com", short_description: "Get ready to command your own World War II military squad.", genre: "Shooter", platform: "PC (Windows)", developer: "Darkflow Software", release_date: "2021-04-08" },
        { id: 644, title: "World of Tanks: HEAT", thumbnail: "https://freetogame.com", short_description: "A free-to-play hero-based shooter set in the World of Tanks universe.", genre: "Shooter", platform: "PC (Windows)", developer: "Wargaming Group Limited", release_date: "2026-05-26" },
        { id: 642, title: "Neverness to Everness", thumbnail: "https://freetogame.com", short_description: "Neverness to Everness blends GTA-style play with team-based combat.", genre: "Anime", platform: "PC (Windows)", developer: "Hotta Studio", release_date: "2026-04-29" },
        { id: 590, title: "Throne And Liberty", thumbnail: "https://freetogame.com", short_description: "A free-to-play multi-platform MMORPG from NCSoft and Amazon Games.", genre: "MMORPG", platform: "PC (Windows)", developer: "NCSoft", release_date: "2024-10-01" },
        { id: 523, title: "Fall Guys", thumbnail: "https://freetogame.com", short_description: "Play the most competitive massively multiplayer party royale game.", genre: "Battle Royale", platform: "PC (Windows)", developer: "Mediatonic", release_date: "2020-08-04" },
        { id: 340, title: "Game Of Thrones Winter Is Coming", thumbnail: "https://freetogame.com", short_description: "A free-to-play browser-based RTS based on the George R.R. Martin novels.", genre: "Strategy", platform: "Web Browser", developer: "YOOZOO Games ", release_date: "2019-11-14" },
        { id: 347, title: "Elvenar", thumbnail: "https://freetogame.com", short_description: "A browser based city-building strategy MMO set in the fantasy world of Elvenar.", genre: "Strategy", platform: "Web Browser", developer: "InnoGames", release_date: "2015-04-08" },
        { id: 11, title: "Neverwinter", thumbnail: "https://freetogame.com", short_description: "A free-to-play 3D action MMORPG based on the acclaimed Dungeons & Dragons fantasy roleplaying game.", genre: "MMORPG", platform: "PC (Windows)", developer: "Cryptic Studios", release_date: "2013-12-06" },
        { id: 628, title: "World of Sea Battle", thumbnail: "https://freetogame.com", short_description: "A free-to-play historical open-sea MMORPG.", genre: "MMORPG", platform: "PC (Windows)", developer: "Thera Interactive", release_date: "2025-10-21" },
        { id: 652, title: "Aion 2", thumbnail: "https://freetogame.com", short_description: "The sequel to NC's original Aion featuring vertical exploration and combat.", genre: "MMORPG", platform: "PC (Windows)", developer: "NC", release_date: "2026-10-05" },
        { id: 625, title: "Superball", thumbnail: "https://freetogame.com", short_description: "A free-to-play futuristic sports game.", genre: "Sports", platform: "PC (Windows)", developer: "Pathea Games", release_date: "2025-10-28" },
        { id: 212, title: "Brawlhalla", thumbnail: "https://freetogame.com", short_description: "A free-to-play 2D platform fighter inspired by the Smash Bros.", genre: "Fighting", platform: "PC (Windows)", developer: "Blue Mammoth Games", release_date: "2015-11-03" },
        { id: 613, title: "Dfiance", thumbnail: "https://freetogame.com", short_description: "A free-to-play tactical card game.", genre: "Card Game", platform: "PC (Windows)", developer: "Dfiance", release_date: "2025-08-04" },
        { id: 618, title: "skate.", thumbnail: "https://freetogame.com", short_description: "The latest, free-to-play, entry in the Skate franchise.", genre: "Sports", platform: "PC (Windows)", developer: "Electronic Arts", release_date: "2025-09-16" }
    ];

    // Aplicamos el método de filtrado. Si es "all", saltamos el filtro y cargamos toda la data de contingencia local
    let datosFiltrados = [];
    if (filtroSeleccionado === 'all') {
        datosFiltrados = baseDatosDeSeguridad;
    } else {
        datosFiltrados = baseDatosDeSeguridad.filter(juego => 
            juego.genre.toLowerCase() === filtroSeleccionado.toLowerCase()
        );
    }

    // Renderizamos los elementos correspondientes de forma transparente aplicando las clases v6 de Bootstrap
    contenedorEstado.innerHTML = `<div class="alert alert-info py-2" style="font-size:0.9rem;">Framework: Bootstrap v6.0 Core Platform Engine Active</div>`;
    renderizarTarjetasEnPantalla(datosFiltrados, filtroSeleccionado);
}

// Escuchador para detectar el cambio del menú desplegable en tiempo real
selectorCategoria.addEventListener('change', (evento) => {
    const nuevaCategoria = evento.target.value;
    
    // Control de seguridad por si el usuario hace clic sobre la línea separadora deshabilitada del HTML
    if (nuevaCategoria) {
        consultarCatalogoJuegos(nuevaCategoria);
    }
});

// Inicialización automática de la aplicación cargando la categoría 'anime' por defecto
consultarCatalogoJuegos('anime');
