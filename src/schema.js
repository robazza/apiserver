import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const RootQueryDefinition = `
  type RootQuery {
    hello_world: String
    infoconv: InfoconvAPI
    #contatosCobranca: contatosCobrancaAPI 
    
    #antigo: String @deprecated(reason: "Use otherField instead.")
  }

  type InfoconvAPI {
    contribuinte(cpf: String, cnpj: String, nome: String): InfoconvContribuinte
  }

`;

const InfoconvDefinition = `
  union InfoconvContribuinte = InfoconvPessoaFisica | InfoconvPessoaJuridica

  type InfoconvPessoaFisica {
    cpf: String!
    nome: String!
    endereco: InfoconvEndereco
  }

  type InfoconvPessoaJuridica {
    cnpj: String!
    razaoSocial: String
  }

  type InfoconvEndereco {
    cep: String
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
	typeDefs: [SchemaDefinition, RootQueryDefinition, InfoconvDefinition],
	resolvers: resolvers
});
