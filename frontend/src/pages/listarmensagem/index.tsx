import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';

import { HeaderCol } from '../../components/HeaderCol'
import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

type MensagensProps = {
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

  function handleOpenModalView(id: string){
    alert("ID CLICADO " + id)
  }

  return(
    <>
    <Head>
      <title>Painel - Sujeito Pizzaria</title>
    </Head>
    <div>
      <HeaderCol/>
    
      <main className={styles.container}>

        <div className={styles.containerHeader}>
          <h1>Últimas Mensagens</h1>
          <button>
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

    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get('/listamensagem');
  //console.log(response.data);


  return {
    props: {
      mensagens: response.data
    }
  }
})