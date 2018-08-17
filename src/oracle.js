import prompt from 'password-prompt';


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
          connectString : "SATDES"
      }
    });
    
    
      async function adicionar1() {
          var a = knex.select('*').from('DBASAT.ACESSORESTITUICAO');
          console.log ( await a );
          return 1;
      }
      
    
      

}
catch (e){
    knex = {};
}



export default knex;