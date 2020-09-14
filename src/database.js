const { query } = require('express');
const mysql = require( 'mysql' );
const config = require( '../config/SQLconfig.json' )
const { match_table_collums, base_insert_query } = require( '../config/TABLEconfig.json' )

function fetchUser ( name = undefined, id, sendPassword = false ){
    return new Promise( ( resolve, reject ) => {
        const connection = mysql.createConnection( config );
        connection.connect( ( error ) => {
            if ( error ) reject( { code: 'CONN_ERR', raw: error } );
            let query = "SELECT * FROM user";
            if ( id != undefined ){
                query += ` WHERE id = ${id};`;
            }
            else if ( name != undefined ){
                query += ` WHERE name = "${name}";`;
            }
            connection.query( query, ( error, result ) => {
                if ( error ) reject( { code: 'QUERRY_ERR', raw: error } );
                if ( sendPassword != true && sendPassword != 'true' ) for ( let i in result ) result[ i ].password = 'blocked';
                resolve( result );
            } )
        } )
    } );
}

function fetchMatch ( id, userId, role ){
    return new Promise( ( resolve, reject ) => {
        const connection = mysql.createConnection( config );
        connection.connect( ( error ) => {
            if ( error ) reject( error );
            if ( role == undefined ) reject( { code: 'ROLE_UNDF', raw: { } } );
            let query = `SELECT * FROM ${role}_match `;
            if ( id != undefined ) query += `WHERE id = ${id};`;
            else if ( userId != undefined ) query += `WHERE userId = ${userId};`;
            connection.query( query, ( error, result ) => {
                if ( error ) reject( error );
                resolve( result );
            } );
        } )
    } );
}

function confirmUserExistence ( userId, name ){
    return new Promise( ( resolve, reject ) => {
        if ( userId == undefined && name == undefined ) reject( { code: 'INFO_UNDF', raw: { } } );
        fetchUser( name, userId, false )
        .then( ( result ) => {
            if ( result[0] != undefined ) resolve( true )
            else resolve( false );
        } )
        .catch( ( error ) => {
            reject( error );
        } )
    } )
}

module.exports = {
    fetchUser,
    fetchMatch,
    postUser: (  nome, password, survivor_rank, killer_rank ) => {
        return new Promise( ( resolve, reject ) => {
            if ( nome == undefined || password == undefined ) reject( { code: 'INFO_UNDF', raw: { }} );
            const connection = mysql.createConnection( config );
            connection.connect( ( error ) => {
                if ( error ) reject( { code: "CONN_ERR", raw: error } );
                const values = [ nome, password, survivor_rank, killer_rank ]
                connection.query( 'INSERT INTO user VALUES ( NULL, ?, ?, ?, ? )', values, ( error, result ) => {
                    if ( error != undefined || result == undefined ) reject( { code: 'QUERRY_ERR', raw: error } );
                    else resolve( fetchUser( null, result.insertId ) );
                } )
            } )
        } )
    },
    postMatch: ( role, info ) => {
        return new Promise( ( resolve, reject ) => {
            if ( role == undefined || info == undefined ) reject( { code: 'INFO_UNDF', raw: { }} );
            if ( role != 'killer' && role != 'survivor' ) reject( { code: 'INVALID_ROLE', raw: { } } );
            confirmUserExistence( info.userId )
            .then( ( result ) => {
                if ( result == false ) reject( { code: 'NO_USER_FOUND', raw: { desc: 'No user found using given parameters' } } )
            } )
            .catch( ( error ) => {
                reject( error );
            } )
            const values = [ ];
            for ( let i in match_table_collums[ role ] ){
                const value = info[ match_table_collums[ role ][ i ] ];
                if ( value != undefined ) values.push( value )
                else values.push( null );
            }
            const connection = mysql.createConnection( config );
            connection.connect( ( error ) => {
                if ( error ) reject( { code: "CONN_ERR", raw: error } )
                else connection.query( base_insert_query[ role ], values, ( error, result ) => {
                    if ( error != undefined || result == undefined ) reject( { code: 'QUERRY_ERR', raw: error } );
                    else resolve( fetchMatch( result.insertId, null, role ) );
                } )
            } )
        } )
    },
    deleteUser: ( id, name, password ) => {
        return new Promise( ( resolve, reject ) => {
            if ( password == undefined ) reject( { code: 'PASSWORD_UNDF', raw: { } } );
            if ( id == undefined && name == undefined ) reject( { code: 'INFO_UNDF', raw: { } } );
            let query = `DELETE FROM user WHERE password = "${password}" AND `;
            if ( id != undefined ) query += `id = ${id};`
            else if ( name != undefined ) query += `name = ${name};`;
            const connection = mysql.createConnection( config );
            connection.connect( ( error ) => {
                if ( error ) reject( { code: 'CONN_ERR', raw: error } )
                else connection.query( query, ( error, result ) => {
                    if ( error ) reject( { code: 'QUERY_ERR', raw: error } );
                    else if ( result.affectedRows >= 1 ) resolve( result )
                    else reject( { code: 'NO_USER_FOUND', raw: { desc: 'No user found using given parameters' } } )
                } )
            } )
        } )
    },
    updateUser: ( id, name, password, update ) => {
        return new Promise( ( resolve, reject ) => {
            if ( id == undefined && name == undefined ) reject( { code: 'INFO_UNDF', raw: { } } );
            if ( password == undefined ) reject( { code: 'PASSWORD_UNDF', raw: { } } );
            if ( update == undefined ) reject( { code: 'UPDATE_INFO_UNDF', raw: { } } );
            let query = `UPDATE user `;
            const keys = Object.keys( update );
            const values = Object.values( update )
            query += `SET ${keys[0]} = ${values[0]} `;
            for ( let i in keys ){
                if ( i == 0 ) continue;
                query += `, ${keys[i]} = ${values[i]} `;
            }
            query += `WHERE password = "${password}" AND `
            if ( id != undefined ) query += `id = ${id} `
            else query += `name = "${name}";`;
            const connection = mysql.createConnection( config );
            console.log(query)
            connection.connect( ( error ) => {
                if ( error ) reject( { code: "CONN_ERR", raw: error } );
                else connection.query( query, ( error, result ) => {
                    if ( error ) reject( { code: 'QUERY_ERR', raw: error } );
                    console.log(result)
                    fetchUser( name, id, false )
                    .then( ( result ) => {
                        resolve( result );
                    } )
                    .catch( ( error ) => {
                        reject( error );
                    } )
                } )
            } )
        } )
    }
}