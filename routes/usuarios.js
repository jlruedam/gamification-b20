const express = require('express');
const Usuario = require('../models/usuario_models');
const Joi = require('joi');
const ruta=express.Router();


const schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});



ruta.get('/',(req, res) => {
    let resultado=listarUsuariosActivos();
    resultado.then((usuarios) => {
        res.json(usuarios);
    }).catch((err) => {
        res.status(400).json({error: err});
    })  
});

ruta.post('/',(req, res) => {
    let body = req.body;

    const {error, value} = schema.validate({nombre: body.nombre, email: body.email});
    if(!error){
        let resultado=crearUsuario(body);
        resultado.then(user=>{
            res.json({
                valor:user
            });
        }).catch(err => {
            res.status(400).json({
                error:err
            });
        });

    }else{
        res.status(400).json({error:error});
    }

    
});

ruta.put('/:email',(req, res) => {

    const {error, value} = schema.validate({nombre: req.body.nombre});
    console.log(req.params.email);
    if(!error){
        let resultado =actualizarUsuario(req.params.email, req.body);
        resultado.then(valor=>{
            res.json({
                valor:valor
            })
        }).catch(err=>{
            res.status(400).json({
                error:err
            })
        });

    }else{
        res.status(400).json({
            error:error
        });
    }

    
});

ruta.delete('/:email',(req, res) => {
    let resultado =desactivarUsuario(req.params.email);
    resultado.then(valor=>{
        res.json({
            usuario:valor
        })
    }).catch(err=>{
        res.status(400).json({
            error:err
        })
    });
});




async function crearUsuario(body){
    let usuario = new Usuario({
        email       :body.email,
        nombre      :body.nombre,
        password    :body.password
    });
    await usuario.save();
    return usuario
    
}

async function listarUsuariosActivos(){
    let usuarios=await Usuario.find({'estado':true});
    return usuarios;
}


async function actualizarUsuario(email,body){
    let usuario=await Usuario.findOneAndUpdate({email:email},{
        $set:{
            nombre: body.nombre,
            password: body.password
        }
    },{new:true});
    console.log(usuario);

    // const filter={email:email};
    // const update={nombre:body.nombre, password:body.password};
    // let usuario = await Usuario.findOneAndUpdate(filter, update, {
    //         returnOriginal: false
    // });
    // console.log(usuario);
    return usuario;

}

async function desactivarUsuario(email){
    let usuario= await Usuario.findOneAndUpdate(email,{
        $set:{
            estado:false
        }
    },{new:true});
    
    return usuario;
}

module.exports = ruta;