"use strict";

//En esta variable se almacena la instancia del juego.
let partida;

//Se crea la clase juego donde iremos guardando los datos de cada partida
class Juego {
    constructor() {
        this.imagenes = [];
        this.veces = 0;
        this.aciertos = 0;
        this.primerTd;
        this.comenzar = false;
        this.tiempoInicio;
        this.tiempoFin;
        this.pulsar = false;
        this.principiante = false;
        this.normal = false;
        this.avanzado = false;
    }
}

//Esto es lo primero que se ejecutará al cargar la página
$(() => {
    arrastrarCasillas();
    contDroppable();
})

//Aquí creamos los objetos arrastables
const arrastrarCasillas = () => {
    $(".mb-2").draggable({
        containment: ".panel-heading",//limitación
        helper: "clone",
        opacity: 0.35,
        revert: true,
        revertDuration: 300
    })
}

//Aquí se crea el contenedor donde se podrán poner los objetos arrastables
const contDroppable = function () {
    $(".soltarNivel").droppable({
        accept: ".mb-2",
        drop: function (event, ui) {
            if ($(".soltarNivel .mb-2").length == 0) {
                $(event.target).append(ui.draggable);
                $(this).find("div:last").css({
                    top: ui.position.top,
                    left: ui.position.left
                });
                $(ui.draggable).draggable("disable");
                $(ui.draggable).draggable("option", "revert", false);

                //Aquí le doy el evento click al botón 'Cargar Tablero'.
                $(".comenzar").on("click", botonCargarTablero);
            } else {
                Swal.fire({
                    text: 'Solo se puede meter una opción',
                    icon: "error"
                })
            }
        }

    })
}

//Esta función es la que comprueba el nivel de dificultad elegido, y se ejecutará al presionar el botón 'Cargar Tablero'.
const botonCargarTablero = () => {
    partida = new Juego();
    if ($(".soltarNivel .mb-2:contains('Principiante')").length > 0) {
        console.log("Has elegido Principiante");
        partida.principiante = true;
    } else if ($(".soltarNivel .mb-2:contains('Normal')").length > 0) {
        console.log("Has elegido Normal");
        partida.normal = true;
    } else if ($(".soltarNivel .mb-2:contains('Avanzado')").length > 0) {
        console.log("Has elegido Avanzao");
        partida.avanzado = true;
    }
    //Se le quita el evento para que no se le pueda dar mas veces.
    $(".comenzar").off("click", botonCargarTablero);

    //LLamo a la función encargada de cargar el tablero
    cargarTablero();

    //LLamo a la función encargada de crear el botón comenzar.
    crearBotonComenzar();
}

//Esta función es la encargada de cargar el tablero donde se jugará, dependiendo de la dificultad elegida será mas grande o mas pequeño.
const cargarTablero = () => {
    let cuerpo = $("body");
    let tabla = $("<table></table>");
    tabla.attr("id", "tablero");
    cuerpo.append(tabla);
    if (partida.principiante) {
        for (let i = 0; i < 2; i++) {
            let tr = $("<tr></tr>")
            tabla.append(tr);
            for (let j = 0; j < 3; j++) {
                let td = $("<td></td>")
                tr.append(td);
            }
        }
    } else if (partida.normal) {
        for (let i = 0; i < 3; i++) {
            let tr = $("<tr></tr>")
            tabla.append(tr);
            for (let j = 0; j < 4; j++) {
                let td = $("<td></td>")
                tr.append(td);
            }
        }
    } else if (partida.avanzado) {
        for (let i = 0; i < 4; i++) {
            let tr = $("<tr></tr>")
            tabla.append(tr);
            for (let j = 0; j < 5; j++) {
                let td = $("<td></td>")
                tr.append(td);
            }
        }
    }


}

//Función para crear el botón 'comenzar'.
const crearBotonComenzar = () => {
    let body = $("body");
    let capaBoton = $("<div></div>");
    capaBoton.attr("id", "capaBoton");
    let boton = $("<input>");
    body.append(capaBoton);
    capaBoton.append(boton);
    boton.attr("type", "button");
    boton.attr("id", "comenzar");
    boton.attr("value", "Comenzar");
    boton.on("click", inicio);
}

//Esta función se ejecutará al presionar el botón 'Comenzar' creado al cargar el tablero.
const inicio = () => {
    insertarImagenes();//Función para insertar las imagenes necesarias según la dificultad
    partida.comenzar = true;
    partida.tiempoComienzo = new Date();
    $("#comenzar").off("click", inicio);
}

//Dependiendo de la dificultad esta función añadirá una cierta cantidad de imagenes.
const insertarImagenes = () => {
    if (partida.principiante) {
        for (let i = 0; i < 3; i++) {
            partida.imagenes.push("imagenes/imagen" + i + ".png");
            partida.imagenes.push("imagenes/imagen" + i + ".png");
        }

    } else if (partida.normal) {
        for (let i = 0; i < 6; i++) {
            partida.imagenes.push("imagenes/imagen" + i + ".png");
            partida.imagenes.push("imagenes/imagen" + i + ".png");
        }

    } else if (partida.avanzado) {
        for (let i = 0; i < 10; i++) {
            partida.imagenes.push("imagenes/imagen" + i + ".png");
            partida.imagenes.push("imagenes/imagen" + i + ".png");
        }

    }
    partida.imagenes = partida.imagenes.sort(() => {
        return Math.random() - 0.5;
    });

    let img, ind = 0;
    $("#tablero tr").children().each(function () {
        if ($(this).find("img").length > 0) {
            img = $(this).find("img:first-child");
        } else {
            img = $("<img>");
            $(this).append(img);
        }
        ind++;
        img.attr("src", partida.imagenes[ind - 1]);

        //Aquí se esconden cada una de las imagenes introducidas en el tablero y se le asigna el evento 'click' que ejecutará la función necesaria para jugar.
        img.css("display", "none");
        $(this).on("click", jugar);
    })


}

//Esta función es la que hace que el juego funcione, comprobando si la primera imagen seleccionada es igual que la segunda, si lo son se quedan visibles, y 
//si son diferentes se vuelven a esconder, contando los aciertos y los fallos en cada intento.
function jugar() {
    if (partida.comenzar && partida != undefined) {
        let img = $(this).children(":first-child");
        img.css("display", "block");
        if (partida.pulsar) {
            //Aquí entra el segundo click a una imagen y se comprueban si son la misma imagen.
            partida.veces++;
            if (partida.firstTd.children(":first-child").attr("src") === img.attr("src")) {
                $(this).off("click", jugar);
                partida.aciertos++;
            } else {
                ocultar($(this), partida.firstTd);
                partida.firstTd.on("click", jugar);
            }
            comprobarFinJuego();//Se llama a la función que comprueba si el juego ha acabado.
            partida.pulsar = false;
        } else {
            //Aquí es donde entra el primer click a una imagen
            partida.firstTd = $(this);
            partida.firstTd.off("click", jugar);
            partida.pulsar = true;
        }
    }
}

//Función que oculta las imagenes que se le pasen por los parámetros
const ocultar = (primerClick, segundoClick) => {
    const hidden = setTimeout(() => {
        primerClick.children(":first-child").css("display", "none");
        segundoClick.children(":first-child").css("display", "none");
    }, 400);
}

//Esta función es la que comprueba si la partida ha terminado, al llegar a un cierto número de aciertos, dependiendo de la dificultad, y además te dice la 
//cantidad de intentos que has tenido hasta terminarlo y el tiempo que has tardado.
const comprobarFinJuego = () => {
    let calcSeg, segundos;
    if (partida.aciertos === 3 && partida.principiante) {
        partida.tiempoFin = new Date();
        calcSeg = partida.tiempoFin - partida.tiempoComienzo;
        segundos = Math.floor(calcSeg / 1000);
        Swal.fire({
            icon: "success",
            text: 'Enorabuena, has acabado el juego en ' + segundos + ' segundos y has necesitado ' + partida.veces + ' intentos en modo Principiante. Para volver a jugar reinicia la página',
            confirmButtonText: 'Aceptar',
        });
    } else if (partida.aciertos === 6 && partida.normal) {
        partida.tiempoFin = new Date();
        calcSeg = partida.tiempoFin - partida.tiempoComienzo;
        segundos = Math.floor(calcSeg / 1000);
        Swal.fire({
            icon: "success",
            text: 'Enorabuena, has acabado el juego en ' + segundos + ' segundos y has necesitado ' + partida.veces + ' intentos en modo Normal. Para volver a jugar reinicia la página',
            confirmButtonText: 'Aceptar',
        });
    } else if (partida.aciertos === 10 && partida.avanzado) {
        partida.tiempoFin = new Date();
        calcSeg = partida.tiempoFin - partida.tiempoComienzo;
        segundos = Math.floor(calcSeg / 1000);
        Swal.fire({
            icon: "success",
            text: 'Enorabuena, has acabado el juego en ' + segundos + ' segundos y has necesitado ' + partida.veces + ' intentos en modo Avanzado. Para volver a jugar reinicia la página',
            confirmButtonText: 'Aceptar',
        });
    }
}