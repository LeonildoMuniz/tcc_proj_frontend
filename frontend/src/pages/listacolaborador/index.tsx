import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';
import Modal from 'react-modal';
import {parseCookies} from 'nookies'

import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'
import {ModalColaborador} from '../../components/ModalColaborador'
import { Header } from '../../components/Header/Index';





export type ColaboradorProps = {
  id: string;
  nome: string;
  matricula: string;
  admissao: string;
  acesso: boolean;
  status: boolean;
  estrutura_id: string;
  foto: string;
  alocacao_id: string;
  cargo_id: string;
  cpf: string;
  dt_nascimento: string
}



type ItemProps = {
  id: string;
  UnidadeOrg: string;
}

type itemPropsAloc = {
  id: string;
  desc_custo: string;
}

type itemPropsCargo = {
  id: string;
  descricao:string;
}



interface HomeProps{
  colaborador: ColaboradorProps[];
  estruturamentolist:ItemProps[];
  alocacaolist: itemPropsAloc[];
  cargolist: itemPropsCargo[];
}




export default function Colaboradores({colaborador, estruturamentolist, alocacaolist, cargolist}: HomeProps){


  const [estrutura, setEstrutura] = useState('');
  const [cargo, setCargo] = useState('');
  const [alocacao, setAlocacao] = useState('');


  const [estr, setEstr] = useState(estruturamentolist || []);


  const [carg, setCarg] = useState(cargolist || []);



  const [aloc, setAloc] = useState(alocacaolist || []); 

  

  const [colaboradores, setColaboradores] = useState(colaborador || [])

  const [modalItem, setModalItem] = useState<ColaboradorProps[]>();
  const [modalVisible, setModalVisible] = useState(false);


  function hadleCloseModal(){
    setModalVisible(false);
  }
 function Atualizar(){
  location.reload();
 }

  async function handleOpenModalView(id: string){
    const apiCliente = setupAPIClient();

    const response = await apiCliente.get('/userinfo',{
      params:{
        id:id
      }
    })

    setModalItem(response.data);
    setModalVisible(true);
  }



Modal.setAppElement('#__next');

  return(
    <>
    <Head>
      <title>Listar Colaboradores</title>
    </Head>
    <div>
      <Header/>
    
      <main className={styles.container}>

        <div className={styles.containerHeader}>
          <h1>Lista de Colaboradores</h1>
          <button onClick={()=>Atualizar()}>
            <FiRefreshCcw size={25} color="#3fffa3"/>
          </button>
        </div>

        <article className={styles.listOreders}>
          {colaboradores.map( item => (
            <section  key={item.id} className={styles.orderItem}> 
              <button onClick={ () => handleOpenModalView(item.id) }>
                <div className={styles.tag}></div>
                <div className={styles.texto}>
                  <span>Matricula: {item.matricula}</span>
                  <span>Nome: {item.nome} </span>
                </div>
              </button>
            </section>
          ))}
                 
        </article>

      </main>

      {modalVisible&&(
        <ModalColaborador
          isOpen={modalVisible}
          onRequestClose={hadleCloseModal}
          colaborador={modalItem}
          estruturamentolist={estr}
          alocacaolist={aloc}
          cargolist={carg}
        />
      )}

    </div>
    </>
  )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const cookies = parseCookies(ctx);
  const token = cookies['@conectar.token'];

  const response = await apiClient.get('/listacolaborador',{
    params:{
      Bearer: token
    }
  })

  const estrutura = await apiClient.get('/consultaestrutura')
  const cargo = await apiClient.get('/consultacargo')
  const alocacao = await apiClient.get('/consultaalocacao')

  return {
    
    props: {
      colaborador:response.data,
      estruturamentolist: estrutura.data,
      cargolist: cargo.data,
      alocacaolist:alocacao.data,
    }
  }
})