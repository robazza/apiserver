import { property, constant, find } from 'lodash';

var infoconvData;
var contatosCobranca;
infoconvData = [{nome: "AAAA1", cpf: "001"},{nome: "AAA2", cpf: "002"},{nome: "AAA3", cpf: "003"},{nome: "AAA4", cpf: "004"}]

contatosCobranca = [ {cpf:"001",nome:"Nome001",enderecos:[{CEP:"700001"}], telefones:[{num:"0000-0001", contato:""}] }]

export default {
    RootQuery: {
        hello_world: () => 'OOpsxx12345',
        infoconv: (obj, args, context) => infoconvData
    }
    , InfoconvAPI: {
        usuario: (obj, {cpf}, context) => find(infoconvData,{cpf})

    }
    , InfoconvUsuario: {
    }
}