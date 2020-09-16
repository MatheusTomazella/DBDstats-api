const { POSTuser, GETuser, POSTmatch, GETmatch, DELETEuser, PUTuser } = require('./routes');
const bp = require( 'body-parser' );
const cors = require( 'cors' )

const app = require( 'express' )();

/* Middlewares */

    app.use(cors());
    app.use( bp.json() );
    app.use( bp.urlencoded( { extended: false } ) );

/* Routes */

    /* GET */

        app.get( '/', ( request, response ) => {
            response.status(200).send( true )
        } )

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