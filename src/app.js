const { POSTuser, GETuser, POSTmatch, GETmatch, DELETEuser, PUTuser } = require('./routes');
const bp = require( 'body-parser' );
const { response, request } = require('express');

const app = require( 'express' )();

/* Middlewares */

    app.use( ( request, response, next ) => {
        request.header( 'Access-Control-Allow-Origin', '*' );
        request.header( 'Access-Control-Allow-Headers', '*' );
        if ( request.method === 'OPTIONS' ){
            response.header( 'Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE' )
            response.status(200).json({});
        }
        next();
    } )
    app.use( bp.json() );
    app.use( bp.urlencoded( { extended: false } ) );

/* Routes */

    /* GET */

        app.get( '/user', GETuser );

        app.get( '/match/survivor', ( request, response ) => {
            GETmatch( request, response, 'survivor' );
        } );
        
        app.get( '/match/killer', ( request, response ) => {
            GETmatch( request, response, 'killer' );
        } );

    /* POST */

        app.post( '/user', POSTuser );

        app.post( '/match/survivor', ( request, response ) => {
            POSTmatch( request, response, 'survivor' );
        } );
        
        app.post( '/match/killer', ( request, response ) => {
            POSTmatch( request, response, 'killer' );
        } )

    /* PUT */

        app.put( '/user', PUTuser );

    /* DELETE */

        app.delete( '/user', DELETEuser );

module.exports = { app }