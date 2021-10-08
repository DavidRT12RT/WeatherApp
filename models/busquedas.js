const fs = require('fs');
const axios = require('axios');

class Busquedas{
    historial = [];
    dbPath='./db/database.json';

    constructor(){
        //TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        // capitalizar cada palabra
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase()+p.substring(1));
            return palabras.join(' ');
        });
    }
    get paramsMapBox(){
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'

        }
    }
    async ciudad(lugar=""){
        //Peticion http
        try{
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params:this.paramsMapBox
            });
            const respuesta = await instance.get();
            //Regresando un array nuevo creado por .map
            return respuesta.data.features.map(lugar =>({
                id:lugar.id,
                nombre:lugar.place_name,
                lng:lugar.center[0],
                lat:lugar.center[1]
            }));
            //Retorna las ciudas o lugares que coincidan 
        }catch(error){
            return [];
        }
    }
    get paramsOpenWeather(){

         return {
             appid:process.env.OPENWEATHER_KEY,
             units:'metric',
             lang:'es'
        }
    }
    async climaLugar(lat,lon){
        try{
            //Creando instancia
            const instance = axios.create({
                baseURL:'https://api.openweathermap.org/data/2.5/weather',
                params:{...this.paramsOpenWeather,lat,lon}
            });
            //Respuesta
            const respuesta = await instance.get();
            const {weather,main}=respuesta.data;
            return {
                desc:weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp
            };
            
        }catch(error){
            console.log(error)
        }
    }
    agregarHistorial(lugar=""){
        //TODO :
        //Colocar al inicio
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        //cortando el arreglo para que solo sean 5 
        this.historial=this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar en DB
        this.guardarDB();
    }
    guardarDB(){
        const payload = {
            historial:this.historial
        };
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }
    leerDB(){
        //Verificar que existe
        if(!fs.existsSync(this.dbPath)) return null;
        //Si existe leemos el archivo 
        const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
        //Serializo el string y lo trnasofrmo a un json
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}
module.exports=Busquedas;