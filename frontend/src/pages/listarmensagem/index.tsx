import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';
import Modal from 'react-modal';
import {parseCookies} from 'nookies'

import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'
import {ModalAdmin} from '../../components/ModalAdmin/Index'
import { Header } from '../../components/Header/Index';





export type MensagensProps = {
  id: string;
  id_colaborador: string;
  titulo: string;
  mensagem: string;
  anexo: string;
  data_envio: string;
}

interface HomeProps{
  mensagens: MensagensProps[];
}




export default function Mensagens({ mensagens }: HomeProps){

  const [mensagemList, setMensagem] = useState(mensagens || [])

  const [modalItem, setModalItem] = useState<MensagensProps[]>();
  const [modalVisible, setModalVisible] = useState(false);


  function hadleCloseModal(){
    setModalVisible(false);
  }
 function Atualizar(){
  location.reload();
 }

  async function handleOpenModalView(id: string){
    const apiCliente = setupAPIClient();

    const response = await apiCliente.get('/mensagem',{
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
      <title>Listar mensagens</title>
    </Head>
    <div>
      <Header/>
    
      <main className={styles.container}>

        <div className={styles.containerHeader}>
          <h1>Últimas Mensagens</h1>
          <button onClick={()=>Atualizar()}>
            <FiRefreshCcw size={25} color="#3fffa3"/>
          </button>
        </div>

        <article className={styles.listOreders}>
          {mensagemList.map( item => (
            <section  key={item.id} className={styles.orderItem}> 
              <button onClick={ () => handleOpenModalView(item.id) }>
                <div className={styles.tag}></div>
                <span>Titulo: {item.titulo}</span>
              </button>
            </section>
          ))}
                 
        </article>

      </main>

      {modalVisible&&(
        <ModalAdmin
          isOpen={modalVisible}
          onRequestClose={hadleCloseModal}
          mensagem={modalItem}
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
 

  const res = await apiClient.get('/userinfo2',{
    params:{
      Bearer: token
    }
  })

  const {id} = res.data;

  const response = await apiClient.get('/listamensagem',{
    params:{
      id:id
    }
  })

  return {
    
    props: {
      mensagens:response.data
    }
  }
})