"use strict";

// Base de datos
const pito = indexedDB.open("Alumnos", 1);

pito.addEventListener("upgradeneeded", () => {const db = pito.result;db.createObjectStore("nombres", { keyPath: "id" });});

pito.addEventListener("success", () => {console.log("Todo salió correctamente");});

pito.addEventListener("error", () => {console.log("Ocurrió un error en la base de datos");});

// Funciones de la base de datos
const addOBJ = (nombre, email, materia, semestre) => {
    let id = generarIdAleatorio();
    function generarIdAleatorio() {
        const min = 10000;
        const max = 99999;
        const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomId.toString().padStart(5, '0');
    }
    const getData = getOBJ();
    getData[0].add({ id, nombre, email, materia, semestre });
    getData[1].addEventListener("complete", () => {
        console.log("Objeto agregado correctamente");
    }); generarIdAleatorio();
};

const editOBJ = (id, nombre, email, materia, semestre) => {
    const getData = getOBJ();
    getData[0].put({ id, nombre, email, materia, semestre});
    getData[1].addEventListener("complete", () => {
        console.log("Objeto editado correctamente");
        leerOBJ();
    });
};
const delateOBJ = (id) => {
    const getData = getOBJ();
    getData[0].delete(id);
    getData[1].addEventListener("complete", () => {
        console.log(`Objeto con ID #${id} eliminado correctamente`);
        leerOBJ();
    });
};

const leerOBJ = () => {
    document.querySelector(".gridC").innerHTML = "";
    const getData = getOBJ();
    const cursor = getData[0].openCursor();
    cursor.addEventListener("success", () => {
        if (cursor.result) {
            const alumno = cursor.result.value;
            const htmlCode = `
            <div id="${alumno.id}" class="item idI"><p>#${alumno.id}</p></div> 
            <div id="${alumno.id}" class="item nombreI"><p>${alumno.nombre}</p></div> 
            <div id="${alumno.id}" class="item emailI"><p>${alumno.email}</p></div> 
            <div id="${alumno.id}" class="item materiaI"><p>${alumno.materia}</p></div>
            <div id="${alumno.id}" class="item semestreI"><p>${alumno.semestre}</p></div>
            `;document.querySelector(".gridC").innerHTML += htmlCode;
            cursor.result.continue();
        } return;
    });
};

setTimeout(leerOBJ, 100);


// buscar objetos ------------------------------------------------------------------------------------------------
const barraInput = document.querySelector(".barra");
barraInput.addEventListener("input", () => {
    const filtro = barraInput.value.toLowerCase();
    const elementos = document.querySelectorAll(".item");
    elementos.forEach((elemento) => {
        const id = elemento.getAttribute("id").toLowerCase();
        if (id.startsWith(filtro)) {elemento.style.display = "block";}
        else {elemento.style.display = "none";}
    });
});


const getOBJ = ()=>{
    const db = pito.result;
    const transaccion = db.transaction("nombres", "readwrite");
    const nombresStore = transaccion.objectStore("nombres");
    return [nombresStore,transaccion];
}


// opciones desde la pagina --------------------------------------------------------------------------------------


// agregar alumnos desde pagina 
let btnA = document.querySelector(".btnA");

btnA.addEventListener('click', (event) => {
    const nombre = document.querySelector('.nombreA').value;
    const email = document.querySelector('.emailA').value;

    if (nombre.trim() === '' || email.trim() === '') {
        event.preventDefault();
        console.log('Por favor, completa todos los campos.');
    } else {
        let nombre = document.querySelector(".nombreA").value;
        let email = document.querySelector(".emailA").value.toLowerCase();
        let materia = document.querySelector(".materiaA").value;
        let semestre = document.querySelector(".semestreA").value;
        addOBJ(nombre, email, materia, semestre);
        console.log("Objeto agregado correctamente");
        document.querySelector(".nombreA").value = "";
        document.querySelector(".emailA").value = "";
        leerOBJ();
    }
});


// editar alumno desde la pagina 
let btnE = document.querySelector(".btnE");

btnE.addEventListener("click", () => {
    let id = document.querySelector(".idE").value;
    let nombre = document.querySelector(".nombreE").value;
    let email = document.querySelector(".emailE").value;
    let materia = document.querySelector(".materiaE").value;
    let semestre = document.querySelector(".semestreE").value;
    editOBJ(id, nombre, email, materia, semestre);
});


// eliminar alumnos desde la pagina 
let btnC = document.querySelector(".btnC");

btnC.addEventListener("click", () => {
    let id = document.querySelector(".idC").value;
    delateOBJ(id);
});



// pruebas de codigo --------------------------------------------------------------------------------------------------
const agregar = document.querySelector(".agregar");
const editar = document.querySelector(".editar");
const eliminar = document.querySelector(".eliminar");

const agregarC = document.querySelector(".agregarC");
const editarC = document.querySelector(".editarC");
const eliminarC = document.querySelector(".eliminarC");

agregar.addEventListener("click", () => {
    eliminarC.style.display = "none";
    editarC.style.display = "none";

    eliminar.style.backgroundColor = "#372c57"
    editar.style.backgroundColor = "#372c57"

    agregarC.style.display = "flex";
    agregar.style.backgroundColor = "#2a243a";
})


editar.addEventListener("click", () => {
    agregarC.style.display = "none"
    eliminarC.style.display = "none";

    agregar.style.backgroundColor = "#372c57"
    eliminar.style.backgroundColor = "#372c57"

    editarC.style.display = "flex";
    editar.style.backgroundColor = "#2a243a";
})


eliminar.addEventListener("click", () => {
    agregarC.style.display = "none";
    editarC.style.display = "none";

    agregar.style.backgroundColor = "#372c57"
    editar.style.backgroundColor = "#372c57"

    eliminarC.style.display = "flex";
    eliminar.style.backgroundColor = "#2a243a";
})



// ocultar opciones ---------------------------------------------------------------------------------------------
const cancelarC = document.querySelector(".cancelarC");
const cancelarA = document.querySelector(".cancelarA");
const cancelarE = document.querySelector(".cancelarE");

cancelarC.addEventListener("click", () => {
    eliminarC.style.display = "none";
    eliminar.style.backgroundColor = "#372c57"

    document.querySelector(".idC").value = "";
})
cancelarA.addEventListener("click", () => {
    agregarC.style.display = "none";
    agregar.style.backgroundColor = "#372c57"

    document.querySelector(".nombreA").value = "";
    document.querySelector(".emailA").value = "";
})
cancelarE.addEventListener("click", () => {
    editarC.style.display = "none";
    editar.style.backgroundColor = "#372c57"

    document.querySelector(".idE").value = "";
    document.querySelector(".nombreE").value = "";
    document.querySelector(".emailE").value = "";
})