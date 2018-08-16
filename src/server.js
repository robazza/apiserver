import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import schema from './schema';

const app = express();

app.use(
	'/graphiql',
	graphiqlExpress({
		endpointURL: '/graphql'
	})
);

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

export default app;

/* 
var oracledb = require('oracledb');

console.log(oracledb.getConnection(
  {
    user          : "brobazza",
    password      : "imopaeo",
    connectString : "SATDES"
  },
  function(err, connection)
  {
    require('console').log("DOIDAO");
    if (err) { console.error(err); return; }

    require('console').log("DOIDAO");

    connection.execute(
      "SELECT department_id, department_name "
    + "FROM departments "
    + "WHERE department_id < 70 "
    + "ORDER BY department_id",
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  }));
*/