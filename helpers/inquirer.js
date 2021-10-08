const { green } = require('colors');
const inquirer = require('inquirer');
require('colors');
const preguntas=[
    {
        type:'list',
        name:'opcion',
        message:'¿Qué desea hacer?',
        choices:[
        {
            value:1,
            name:`${'1.'.green} Buscar ciudad`
        },
        {
            value:2,
            name:`${'2.'.green} Historial`
        },
        {
            value:0,
            name:`${'0.'.green} Salir`
        }
            ]
    }
];
const inquirerMenu = async() =>{
    console.log("===================".green);
    console.log("Selecione una opcion".white);
    console.log("===================\n".green);
    //Destructurando
    const {opcion}=await inquirer.prompt(preguntas);
    return opcion;
}
const pausa = async() =>{
    const question = [
        {
            type:'input',
            name:'enter',
            message:`Presione ${'enter'.green} para continuar`
        }
    ];
    console.log("\n");
    await inquirer.prompt(question)
}
const leerInput = async(message)  =>{
    const question =[{
        type:'input',
        name:'desc',
        message,
        validate (value){
            if(value.length===0){
                return 'Porfavor ingrese un valor'
            }
            return true;
        }
    }];
    const {desc} = await inquirer.prompt(question);
    return desc;
}
const listarLugares = async(lugares=[]) =>{
    //El metodo map me retorna un nuevo arreglo pero modificando a los hijos
   const choices = lugares.map( (lugar,i) => {
       const idx=`${i+1}.-`.green;
       return {
           value:lugar.id,
           name:`${idx} ${lugar.nombre}`
       }
   });
   choices.unshift({
       value:'0',
       name:'0.-'.green+" cancelar"
   });
   const preguntas=[
       {
           type:'list',
           pageSize:20,
           name:'id',
           message:'Seleccione lugar: ',
           choices
       }
   ]
   const {id} = await inquirer.prompt(preguntas);

   return id;
}
const mostrarListadoCheckList = async(tareas) =>{
    //El metodo map me retorna un nuevo arreglo pero modificando a los hijos
   const choices = tareas.map( (tarea,i) => {
       const idx=`${i+1}.-`.green;
       return {
           value:tarea.id,
           name:`${idx} ${tarea.descripcion}`,
           //Operador ternario para las tareas ya completadas
           checked:(tarea.completado)?true:false
       }
   });

   const preguntas=[
       {
           type:'checkbox',
           pageSize:20,
           name:'ids',
           message:'Seleccione',
           choices
       }
   ]
   const {ids} = await inquirer.prompt(preguntas);

   return ids;
}
const confirmar = async(message)=>{
    const question=[{
        type:'confirm',
        name:'ok',
        message
    }];
    //Regresa un valor booleano por el type : 'confirm';
    const {ok} = await inquirer.prompt(question);
    return ok;
}
//Exportando
module.exports={
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}