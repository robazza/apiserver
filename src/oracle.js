import prompt from 'password-prompt';

    
function initOnce() {
    let knex;
   
    try {
        let oracledb = require('oracledb');

        let	password = process.env.PASS_ORACLE || prompt('password: ');
        //import oracledb from 'oracledb';
        
        knex = require('knex')({
            client: 'oracledb',
            connection: {
                user          : "brobazza",
                password      : password,
                connectString : "SCI"
            },
            pool: { min: 0, max: 1 }
        });
        
        
        initOnce.knex=knex;
        

    }
    catch (e){
        initOnce.knex = knex = {};
    }

}



initOnce.knex || initOnce();

export default initOnce.knex;