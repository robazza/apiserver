import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const RootQueryDefinition = `
  type RootQuery {
    hello_world: String

    "API de consulta aos Dados do INFOCONV"
    infoconv: InfoconvAPI
    #contatosCobranca: contatosCobrancaAPI 
    
    #antigo: String @deprecated(reason: "Use otherField instead.")
  }

  """
  API de consulta aos Dados do INFOCONV
  """
  type InfoconvAPI {
    """
    Consulta contribuinte por cpf ou cnpj.
    """
    contribuinte(cpf: String, cnpj: String, nome: String): InfoconvContribuinte
  }

`;

const InfoconvDefinition = `
union InfoconvContribuinte = InfoconvPessoaFisica | InfoconvPessoaJuridica
union InfoconvContador = InfoconvContadorPf | InfoconvContadorPj

  type InfoconvPessoaFisica {
    cpf: String!
    nome: String!

    dataAtualizacao: String
    dataAtualizacaoPms: String
    dataNascimento: String
    telefone: String
    nomeMae: String
    tituloEleitor: String
    AAEXERCICIOOCUPACAO: String

    endereco: InfoconvEndereco

  }

  type InfoconvCnae {
    codigoCnae: String
    descricao: String
  }

  type InfoconvContadorPf {
    cpf: String
    uf: String
    crc: String
    classificacaoCrc: String
    tipoCrc: String

    dadosInfoconv: InfoconvPessoaFisica
  }

  type InfoconvContadorPj {
    cnpj: String
    uf: String
    crc: String
    classificacaoCrc: String
    tipoCrc: String
  }

  type InfoconvEndereco {
    cep: String
    complemento: String
    logradouro: String
    uf: String
    numero: String
    bairro: String
    municipio: String
    tipoLogradouro: String
  }

  type InfoconvPessoaJuridica {
    cnpj: String!
    razaoSocial: String
    telefones: [ String ]
    valorCapitalSocial: String
    email: String
    nomeFantasia: String
    nomeResponsavel: String
    optanteSimples: String
    dataAbertura:String
    dataExclusaoSimples: String
    dataOpcaoSimples: String
    dataSituacaoCadastral:String
    dataAtualizacaoPMS: String
    cnpjSucedida: String

    empresasSucessoras: [String]

    endereco: InfoconvEndereco
    cnaeSecundarios: [InfoconvCnae]
    cnae: InfoconvCnae
    "Informações sobre Contador PF."
    contadorPf: InfoconvContadorPf
    "Informações sobre Contador PJ."
    contadorPj: InfoconvContadorPj
    SQINDICADORESTABELECIMENTO: String
    naturezaJuridica: String

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
