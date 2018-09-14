import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { ApolloServer, gql } from 'apollo-server-express';
import {json2xml,js2xml} from 'xml-js';

import schema from './schema';

const app = express();

app.use(
	'/graphiql',
	graphiqlExpress({
		endpointURL: '/graphql'
	})
);


//app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

const server = new ApolloServer({ 
	schema, 
	context: ({ req }) => { 
		return { res: req.res, req, format: 'xml' } 
	}, 
	formatResponse: (x,options) => { 
		//console.log(options.request);
		//console.log(JSON.stringify(x)); 
		//console.log(options.context.req.headers);
		if (options.context.req.headers.accept == "application/xml" || options.context.req.headers.format == 'xml')
			options.context.res.end( json2xml(JSON.stringify(x), {compact: true, ignoreComment: true, spaces: 2} ) );
		return x; 
	} 
});
/*app.use('/graphql',function(){
	console.log("EEEEEEEEEEEEEEE1")
})
*/

server.applyMiddleware({ app });
/*
app.use('/graphql',function(){
	console.log("EEEEEEEEEEEEEEE2")
})*/

app.use((req, res, next) => {
	//console.log("ee");
});


export default app;