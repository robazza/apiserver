import { property, constant, find, map, pick } from 'lodash';
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
        infoconv: (obj, args, context) => {return {}}
    }
    , InfoconvAPI: {
        contribuinte:  async (obj, {cpf, cnpj, nome}, context) => {
            //console.log(obj);

            //console.log({cpf, cnpj});

            // Exemplo ERRO
            // throw new Error("Consulte somente por CPF ou CNPJ");
            if (cnpj)  {
                let pjBancoDados= (await oracle.select('*').from('DBASCI.CONTRIBUINTEPJ').where("NUINSCRICAO", cnpj))[0]

                if (!pjBancoDados)
                    return null;

                let pjObject = {
                    _sqContribuintePJ: pjBancoDados.SQCONTRIBUINTEPJ,

                    valorCapitalSocial: pjBancoDados.VLCAPITALSOCIAL,
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
                    
                    endereco: pjBancoDados.SQENDERECO,
                    cnae: pjBancoDados.SQCNAE,
                    contador: pjBancoDados.SQCONTADOR,
                    SQINDICADORESTABELECIMENTO: pjBancoDados.SQINDICADORESTABELECIMENTO,
                    naturezaJuridica: pjBancoDados.SQNATUREZAJURIDICA,

                    cnpjSucedida: pjBancoDados.NUCNPJSUCEDIDA
                    //DSCIDADEEXTERIOR: null,
                    //NUCPFRESPONSAVEL: 34245804572,
                    //SQPAIS: null,
                    //SQPORTEESTABELECIMENTO: 5,
                    //SQSITUACAOCADASTRALPJ: 2,

                }
                
                return pjObject;
            }

            if (cpf) {
                let pfBancoDados = (await oracle.select('*').from('DBASCI.CONTRIBUINTEPF').where("NUINSCRICAO", cpf))[0];
                if (!pfBancoDados)
                    return null;

                
                //console.log(pfBancoDados);
                return {_rawSql: pfBancoDados, cpf};            
            }

            return {};
        } 

    }
    , InfoconvPessoaFisica: {
        /* CAMPOS TABELA NÃO MAPEADOS
         * 
         * SQCONTRIBUINTEPF: 1040597,
         * CDUNIDADEADMINISTRATIVA: 812201,
         * AAOBITO: null,
         * SQENDERECO: 2010640,
         * SQINDICACAOESTRANGEIRO: null,
         * SQINDICATIVORESIDENTEEXTERIOR: 2,
         * SQNATUREZAOCUPACAO: 11,
         * SQOCUPACAOPRINCIPAL: 212,
         * SQPAIS: null,
         * SQSEXO: 1,
         * SQSITUACAOCADASTRALPF: 1,
         */
        nome: (obj, args, context)=>obj._rawSql.NMCONTRIBUINTE,
        dataAtualizacao: (obj, args, context)=>moment(obj._rawSql.DTATUALIZACAO).format("DD/MM/YYYY HH:mm:ss"),
        dataNascimento: (obj, args, context)=>moment(obj._rawSql.DTNASCIMENTO).format("DD/MM/YYYY HH:mm:ss"),
        telefone: (obj, args, context)=>`(${obj._rawSql.NUDDD}) ${obj._rawSql.NUTELEFONE}`,
        AAEXERCICIOOCUPACAO: (obj, args, context)=>obj._rawSql.AAEXERCICIOOCUPACAO,
        nomeMae: (obj, args, context)=>obj._rawSql.NMMAE,
        tituloEleitor: (obj, args, context)=>obj._rawSql.NUTITULOELEITOR,
        dataAtualizacaoPms: (obj, args, context)=>moment(obj._rawSql.DTATUALIZACAOPMS).format("DD/MM/YYYY HH:mm:ss"),
        endereco: async (obj, args, context)=>{
            let sql = oracle.select('NUCEP as cep','DSCOMPLEMENTO as complemento',
            'DSLOGRADOURO as logradouro', 'NUENDERECO as numero', 'DBASCI.BAIRRO.DSBAIRRO as bairro',
            'DBASCI.MUNICIPIO.DSMUNICIPIO as municipio', 'DSUF as uf',
            'DBASCI.TIPOLOGRADOURO.DSTIPOLOGRADOURO as tipoLogradouro')
                .from('DBASCI.ENDERECO')
                .join('DBASCI.BAIRRO','DBASCI.ENDERECO.SQBAIRRO','DBASCI.BAIRRO.SQBAIRRO')
                .join('DBASCI.MUNICIPIO','DBASCI.ENDERECO.SQMUNICIPIO','DBASCI.MUNICIPIO.SQMUNICIPIO')
                .join('DBASCI.TIPOLOGRADOURO','DBASCI.ENDERECO.SQTIPOLOGRADOURO',
                    'DBASCI.TIPOLOGRADOURO.SQTIPOLOGRADOURO')
                .where("SQENDERECO", obj._rawSql.SQENDERECO);
            //console.log(sql.toString());

            let sqlData=(await sql);
            


            return sqlData[0];
        }

    }
    , InfoconvContadorPf: {
        dadosInfoconv: ()=> {
            //console.log("eeeeeeeeeeeeeeeeeeeeeeeee");
        }
    }
    , InfoconvContador: {
        __resolveType(contador) {
            if (contador.cpf)
              return 'InfoconvContadorPf';
            if (contador.cnpj)
              return 'InfoconvContadorPj';

            return null;
        },
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
            empresasSucessoras: async (obj, args, context)=>{
                let sql = oracle.select('NUCNPJ as cnpj')
                .from('DBASCI.SUCESSORA')
                .where('SQCONTRIBUINTEPJ',obj._sqContribuintePJ);
                let sqlData=(await sql); 

                return map(sqlData,({cnpj})=>cnpj);
            },
            contadorPf: async (obj, args, context)=>{
                let sql = oracle.select('DSUFPF as uf','NUCPF as cpf','NUCRCPF as crc',
                'DBASCI.CLASSIFICACAOCRCPJ.SQCLASSIFICACAOCRCPJ as classificacaoCrc',
                'DBASCI.TIPOCRCPJ.SQTIPOCRCPJ as tipoCrc')
                    .from('DBASCI.CONTADOR')
                    .leftJoin('DBASCI.CLASSIFICACAOCRCPJ','DBASCI.CONTADOR.SQCLASSIFICACAOCRCPJ',
                             'DBASCI.CLASSIFICACAOCRCPJ.SQCLASSIFICACAOCRCPJ')
                    .leftJoin('DBASCI.TIPOCRCPJ','DBASCI.CONTADOR.SQTIPOCRCPF','DBASCI.TIPOCRCPJ.SQTIPOCRCPJ')
                    .where("SQCONTADOR", obj.contador);

                let sqlData=(await sql); 
                if (sqlData[0].cpf)
                    return sqlData[0];
                else
                    return null;
                
            },
            contadorPj: async (obj, args, context)=>{
                let sql = oracle.select('DSUFPJ as uf','NUCNPJ as cnpj','NUCRCPJ as crc',
                'DBASCI.CLASSIFICACAOCRCPJ.SQCLASSIFICACAOCRCPJ as classificacaoCrc',
                'DBASCI.TIPOCRCPJ.SQTIPOCRCPJ as tipoCrc')
                    .from('DBASCI.CONTADOR')
                    .leftJoin('DBASCI.CLASSIFICACAOCRCPJ','DBASCI.CONTADOR.SQCLASSIFICACAOCRCPJ',
                             'DBASCI.CLASSIFICACAOCRCPJ.SQCLASSIFICACAOCRCPJ')
                    .leftJoin('DBASCI.TIPOCRCPJ','DBASCI.CONTADOR.SQTIPOCRCPF','DBASCI.TIPOCRCPJ.SQTIPOCRCPJ')
                    .where("SQCONTADOR", obj.contador);

                //console.log(sql.toString());

                let sqlData=(await sql);
                if (sqlData[0].cnpj)
                    return sqlData[0];
                else
                    return null;
                
            },
            cnae: async (obj, args, context)=>{
                let cnaesBancoDados=(await oracle.select('CDCNAE as codigoCnae', 'DSCNAE as descricao')
                    .from('DBASCI.CNAE')
                    .where("SQCNAE", obj.cnae));
                
                return cnaesBancoDados[0];
            },
            endereco: async (obj, args, context)=>{
                let sql = oracle.select('NUCEP as cep','DSCOMPLEMENTO as complemento',
                'DSLOGRADOURO as logradouro', 'NUENDERECO as numero', 'DBASCI.BAIRRO.DSBAIRRO as bairro',
                'DBASCI.MUNICIPIO.DSMUNICIPIO as municipio', 'DSUF as uf',
                'DBASCI.TIPOLOGRADOURO.DSTIPOLOGRADOURO as tipoLogradouro')
                    .from('DBASCI.ENDERECO')
                    .join('DBASCI.BAIRRO','DBASCI.ENDERECO.SQBAIRRO','DBASCI.BAIRRO.SQBAIRRO')
                    .join('DBASCI.MUNICIPIO','DBASCI.ENDERECO.SQMUNICIPIO','DBASCI.MUNICIPIO.SQMUNICIPIO')
                    .join('DBASCI.TIPOLOGRADOURO','DBASCI.ENDERECO.SQTIPOLOGRADOURO',
                        'DBASCI.TIPOLOGRADOURO.SQTIPOLOGRADOURO')
                    .where("SQENDERECO", obj.endereco);
                //console.log(sql.toString());

                let sqlData=(await sql);
                


                return sqlData[0];
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