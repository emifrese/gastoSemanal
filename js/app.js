// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');




// Eventos

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}





// Clases

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        // console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto -gastado;

        console.log(this.restante);
        // console.log(gastado);

    }

    eliminarGasto(id){
        // console.log('desde la clase');
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante();
    }
}

class UI {
    instertarPresupuesto(cantidad) {
        // Extrayendo el valor
        const { presupuesto, restante } = cantidad;
        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error

        divMensaje.textContent = mensaje;

        // Insertar en el HTML

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos){
        
        this.limpiarHTML(); // Elimina el HTML previo
        
        // Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id); Se usaba en versiones previas de JS
            nuevoGasto.dataset.id = id;

            // console.log(nuevoGasto);

            // Agregar el HTML del gasto

            nuevoGasto.innerHTML = `${nombre} <span class="badge bg-primary rounded-pill"> $ ${cantidad} </span>`;


            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto', 'btn-sm');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {eliminarGasto(id)};
            nuevoGasto.appendChild(btnBorrar);


            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;

    }

    comprobarPresupuesto(presupuestObj) {
        const { presupuesto, restante } = presupuestObj;

        const restanteDiv = document.querySelector('.restante');
        //Comprobar 25%
        if ( (restante / presupuesto) < 0.25  ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ( (restante / presupuesto) < 0.5 ){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        // Si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }
}

// Instanciar
const ui = new UI();
let presupuesto;




// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');

    // console.log(parseFloat(presupuestoUsuario));

    // Validacion
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0)  {
        window.location.reload();    
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.instertarPresupuesto(presupuesto);
}


// Añade gastos 
function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;
    } else if( cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        
        return;
    }


    // Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() };


    // Añade un nuevo gasto

    presupuesto.nuevoGasto( gasto );
    
    // Mensaje de validacion correcta

    ui.imprimirAlerta('Gasto agregado correctamente');


    // Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    //Reinicia el formulario
    formulario.reset();

    
}

function eliminarGasto(id) {
    // console.log(id);

    //Elimina del objeto
    presupuesto.eliminarGasto(id);
    // Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}