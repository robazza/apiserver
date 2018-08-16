import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const RootQuery = `
  type RootQuery {
    hello_world: String
    infoconv: InfoconvAPI
    #contatosCobranca: contatosCobrancaAPI 
    
    #antigo: String @deprecated(reason: "Use otherField instead.")
  }

  type InfoconvAPI {
    usuario(cpf: String!): InfoconvUsuario
  }

  type InfoconvUsuario {
     cpf: String!
     nome: String!
  }
`;

const ContatosCobrancaDefinition = `
  union contatosCobrancaPessoa = contatosCobrancaPessoaFisica | contatosCobrancaPessoaJuridica



  type contatosCobrancaAPI {
    contato(cpfCnpj: String):  
  }

  type contatosCobrancaPessoaFisica {
    nome: String
    cpf: String
  }

  type contatosCobrancaPessoaJuridica {
    razao: String
    cnpj: String
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

export default makeExecutableSchema({
	typeDefs: [SchemaDefinition, RootQuery],
	resolvers: resolvers
});
