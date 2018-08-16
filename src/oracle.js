

try {
	let oracledb = require('oracledb');
}
catch (e){

}



let	password = process.env.PASS_ORACLE || prompt('password: ');
//import oracledb from 'oracledb';

var knex = require('knex')({
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
  adicionar1() ;

  export default knex;