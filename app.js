const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
//Inicializando el proyecto
const express = require('express');
const mongoose = require('mongoose');
const { urlencoded } = require('express');
//Conexión con la base de datos 
//mongoose.connect('mongodb://localhost/demo',{useNewUrlParser:true})
mongoose.connect('mongodb+srv://jorge:Jorge2021.@cluster0.c5b7a.mongodb.net/demo?retryWrites=true&w=majority')

/*ruta mongo atlas
mongodb+srv://jorge:<password>@cluster0.c5b7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
*/
    .then(()=>console.log('Conectado a MongoDB...'))
    .catch(err=>console.log('No se pudo conectar con MongoDB',err));

//------------------------------
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/usuarios",usuarios);
app.use("/api/cursos",cursos);


const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Api RESTFul ok y ejecutandose');
});
//-------------------------------



