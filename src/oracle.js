import prompt from 'password-prompt';

    
function initOnce() {
    let knex;
   
    try {
        let oracledb = require('oracledb');
        !process.env.PASS_ORACLE2 && console.log("[env:PASS_ORACLE] Variavel de ambiente PASS_ORACLE não definida");

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
        
        //console.log(knex);

    }
    catch (e){
        initOnce.knex = knex = {};
        console.log("[ORACLE] Não foi possivel carregar oracledb. PATH está correto?");
    }

}



initOnce.knex || initOnce();

export default initOnce.knex;