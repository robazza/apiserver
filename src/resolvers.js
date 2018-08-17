import { property, constant, find } from 'lodash';
import oracle from './oracle';
import moment from 'moment';

var infoconvData;
var contatosCobranca;
infoconvData = [{nome: "AAAA1", cpf: "001",endereco:{cep:"123454"}},{nome: "AAA2", cnpj: "002"},{nome: "AAA3", cpf: "003"},{nome: "AAA4", cpf: "004"}]

contatosCobranca = [ {cpf:"001",nome:"Nome001",enderecos:[{CEP:"700001"}], telefones:[{num:"0000-0001", contato:""}] }]


export default {
    RootQuery: {
        hello_world: async () => {

            
        },
        infoconv: (obj, args, context) => infoconvData
    }
    , InfoconvAPI: {
        contribuinte:  async (obj, {cpf, cnpj, nome}, context) => {
            let pjBancoDados= (await oracle.select('*').from('DBASCI.CONTRIBUINTEPJ').where("NUINSCRICAO", cnpj))[0]

            let pjObject = {
                _sqContribuintePJ: pjBancoDados.SQCONTRIBUINTEPJ,

                valorCapitalSocial: pjBancoDados.VLCAPITALSOCIAL,
                //DSCIDADEEXTERIOR: null,
                //NUCNPJSUCEDIDA: 12256399000155,
                //NUCPFRESPONSAVEL: 34245804572,
                telefones: [ `(${pjBancoDados.NUDDD}) ${pjBancoDados.NUTELEFONE}`,
                             `(${pjBancoDados.NUDDD2}) ${pjBancoDados.NUTELEFONE2}`],
                email: pjBancoDados.DSEMAIL,
                cnpj: pjBancoDados.NUINSCRICAO,
                nomeFantasia: pjBancoDados.NMFANTASIA,
                nomeResponsavel: pjBancoDados.NMRESPONSAVEL, //NAO ESTA INFOCONV
                optanteSimples: pjBancoDados.FLOPCAOSIMPLES, //S,N
                razaoSocial: pjBancoDados.DSRAZAOSOCIAL,
                dataAbertura:moment(pjBancoDados.DTABERTURA).format("DD/MM/YYYY HH:mm:ss"),
                dataExclusaoSimples: moment(pjBancoDados.DTEXCLUSAOSIMPLES).format("DD/MM/YYYY HH:mm:ss"),
                dataOpcaoSimples: moment(pjBancoDados.DTOPCAOSIMPLES).format("DD/MM/YYYY HH:mm:ss"),
                dataSituacaoCadastral:moment(pjBancoDados.DTSITUACAOCADASTRAL).format("DD/MM/YYYY HH:mm:ss"),
                dataAtualizacaoPMS: moment(pjBancoDados.DTATUALIZACAOPMS).format("DD/MM/YYYY HH:mm:ss"),
                
                cnae: pjBancoDados.SQCNAE,
                contador: pjBancoDados.SQCONTADOR,
                endereco: pjBancoDados.SQENDERECO,
                SQINDICADORESTABELECIMENTO: pjBancoDados.SQINDICADORESTABELECIMENTO,
                naturezaJuridica: pjBancoDados.SQNATUREZAJURIDICA

                //SQPAIS: null,
                //SQPORTEESTABELECIMENTO: 5,
                //SQSITUACAOCADASTRALPJ: 2,

            }
            //console.log(pjObject);
            //console.log(pjBancoDados);
            
           
            return pjObject;
        } 

    }
    , InfoconvContribuinte: {
        __resolveType(contribuinte) {
            if (contribuinte.cpf)
              return 'InfoconvPessoaFisica';
            if (contribuinte.cnpj)
              return 'InfoconvPessoaJuridica';

            //  return 'InfoconvPessoaJuridica';
        },
    }
    , InfoconvPessoaJuridica: {
            cnaeSecundarios: async (obj, args, context)=>{
                let cnaesBancoDados=(await oracle.select('CDCNAE as codigoCnae', 'DSCNAE as descricao')
                    .from('DBASCI.CONTRIBUINTEPJCNAE')
                    .join('DBASCI.CNAE','DBASCI.CONTRIBUINTEPJCNAE.SQCNAE','DBASCI.CNAE.SQCNAE')
                    .where("SQCONTRIBUINTEPJ", obj._sqContribuintePJ));


                //console.log(cnaesBancoDados.toString());
                return cnaesBancoDados
            },
            contador: async (obj, args, context)=>{
                let cnaesBancoDados=(await oracle.select('*')
                    .from('DBASCI.CONTADOR')
                    .where("SQCONTADOR", obj.contador));
                
                return `CPF:${cnaesBancoDados[0].NUCPF} CNPJ:${cnaesBancoDados[0].NUCNPJ}`;
            },
            cnae: async (obj, args, context)=>{
                let cnaesBancoDados=(await oracle.select('CDCNAE as codigoCnae', 'DSCNAE as descricao')
                    .from('DBASCI.CNAE')
                    .where("SQCNAE", obj.cnae));
                
                return cnaesBancoDados[0];
            },
    }
}

/*
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
*/