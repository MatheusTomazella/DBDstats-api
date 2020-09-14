const { request, response } = require("express");
const { fetchUser, fetchMatch, postUser, postMatch, deleteUser, updateUser } = require("./database");
const { encrypt } = require( './encrypt' );

module.exports = {
    GETuser: ( request, response ) => {
        fetchUser( request.query.name, request.query.id, request.query.sendPassword ).then( ( result ) => {
            response.status(200).json( result )
        } )
        .catch( ( error ) => {
            response.status(500).json( error );
        } )
    },
    POSTuser: ( request, response ) => { 
        postUser( request.body.name, encrypt(request.body.password), request.body.survivor_rank, request.body.killer_rank )
        .then( ( user ) => {
            response.status(200).json( user );
        } )
        .catch( ( error ) => {
            response.status(500).json( error );
        } )
    },
    GETmatch: ( request, response, role ) => {
        fetchMatch( request.query.id, request.query.userId, role )
        .then( ( result ) => {
            response.status(200).json( result );
        } )
        .catch( ( error ) => {
            response.status(500).json( error );
        } )
    },
    POSTmatch: ( request, response, role ) => {
        postMatch( role, request.body )
        .then( ( result ) => {
            response.status(200).json( result );
        } )
        .catch( ( error ) => {
            response.status(500).json( error );
        } )
    },
    DELETEuser: ( request, response ) => {
        deleteUser( request.body.id, request.body.name, encrypt(request.body.password) )
        .then( ( result ) => {
            response.status(200).json( result );
        } )
        .catch( ( error ) => {
            response.status(500).json( error );
        } )
    },
    PUTuser: ( request, response ) => {
        updateUser( request.body.id, request.body.name, encrypt(request.body.password), request.body.update )
        .then( ( result ) => {
            response.status(200).json( result );
        } )
        .catch( ( error ) => {
            console.log(error)
            response.status(500).json( error );
        } )
    }
}