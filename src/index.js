import http from 'http';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import app from './server';
import schema from './schema';
import prompt from 'password-prompt';


let password = prompt('password: ');

const server = http.createServer(app);
let currentApp = app;

try {
	let oracledb = require('oracledb');
}
catch (e){
console.log(eee);
}

/*
  import oracledb from 'oracledb';

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
*/
server.listen(3000, () => {
	console.log(`GraphQL-server listening on port 3000.`);
});

if (module.hot) {
	module.hot.accept(['./server', './schema'], () => {
		server.removeListener('request', currentApp);
		server.on('request', app);
		currentApp = app;
	});
}
