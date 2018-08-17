import { property, constant, find } from 'lodash';
import oracle from './oracle';

var infoconvData;
var contatosCobranca;
infoconvData = [{nome: "AAAA1", cpf: "001",endereco:{cep:"123454"}},{nome: "AAA2", cnpj: "002"},{nome: "AAA3", cpf: "003"},{nome: "AAA4", cpf: "004"}]

contatosCobranca = [ {cpf:"001",nome:"Nome001",enderecos:[{CEP:"700001"}], telefones:[{num:"0000-0001", contato:""}] }]

export default {
    RootQuery: {
        hello_world: () => "eeee",
        infoconv: (obj, args, context) => infoconvData
    }
    , InfoconvAPI: {
        contribuinte:  (obj, {cpf, cnpj, nome}, context) => find(infoconvData,{cpf}) || find(infoconvData,{cnpj}) 

    }
    , InfoconvContribuinte: {
        __resolveType(contribuinte) {
            console.log(contribuinte);
            if (contribuinte.cpf)
              return 'InfoconvPessoaFisica';
            if (contribuinte.cnpj)
              return 'InfoconvPessoaJuridica';
        },
    }
    , InfoconvPessoaJuridica: {
        razaoSocial: property('nome')
    }
}