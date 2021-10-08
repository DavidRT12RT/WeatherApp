require('dotenv').config();
const {leerInput,inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
require('colors');
//Obteniendo acceso a las variables de entorno del sistema
//console.log(process.env);
const main = async() =>{
    const busquedas = new Busquedas();
    let opt;
    do{
        console.clear();
        opt=await inquirerMenu();
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const busquedaCiudad=await leerInput("Ciudad: ");

                //Buscar los lugares
                const lugares = await busquedas.ciudad(busquedaCiudad);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id==='0')continue;
                const lugarSeleccionado = lugares.find(l => l.id ===id); //Find devuelve el primer elemento que coinda copn la busqueda
                //Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                //Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat,lugarSeleccionado.lng);

                //Mostrar resultados del clima
                console.clear();
                console.log("\nInformacion de la ciudad\n".green);
                console.log("Ciudad: ",lugarSeleccionado.nombre.green);
                console.log("Latitud: ",lugarSeleccionado.lat);
                console.log("Longitud: ",lugarSeleccionado.lng);
                console.log("Temperatura: ",clima.temp);
                console.log("Temperatura Minima: ",clima.min);
                console.log("Temperatura Maxima: ",clima.max);
                console.log("Descripcion del clima:",clima.desc.green);
                break;
            case 2:
                //Mostrar historial
                busquedas.historialCapitali.forEach((lugar,i)=>{
                    const idx = `${i+1}.-`.green;
                    console.log(`${idx} ${lugar} `);

                });
                break;
            default:
                break;
        }
        if(opt!==0) await pausa();
    }while(opt!==0);
    console.clear();

}
main();