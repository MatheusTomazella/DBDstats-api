const { app }   = require( './src/app' );
const http      = require( 'http' ).Server( app );
const config    = require( './config/SERVERconfig.json' );

http.listen( config.serverPort, ( error ) => {
    if ( error ) throw error;
    console.log( 'API Started' );
} );