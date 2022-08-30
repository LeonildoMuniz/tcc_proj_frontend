import {canSSRAuth} from '../../utils/canSSRAuth'
import {useState} from 'react'
import Head from 'next/head'
import {Header} from '../../components/Header/Index'
import {Footer} from '../../components/Footer/index'
import styles from './styles.module.scss'
import {FiUpload} from 'react-icons/fi'


export default function Mensagem(){
    const [avatarUrl, setAvatar] = useState('');
    
    return(
        <>
            <Head>
                <title>Cadastro de mensagens</title>
            </Head>
            <Header/>
                <main className={styles.container} >
                    <h1>Cadastro de mensagens</h1>
                    <form className={styles.form} action="">
                        <label className={styles.label}>
                            <span>
                                <FiUpload size={25} color="var(--azul2)"/>
                            </span>
                            <input type="file" />
                            <img 
                                src="" 
                                alt="View do Arquivo" 
                                width={250}
                                hidden={250}
                            />
                        </label>

                        <input 
                        type="text" 
                        placeholder='Titulo da mensagem'
                        className={styles.input}
                        />
                        <textarea
                        placeholder='Mensagem'
                        className={styles.input}
                        />

                        <button className={styles.button} type="submit">
                            Enviar
                        </button>
                    </form>

                </main>
            <Footer/>

        </>
    )
}

export const getServerSideProps = canSSRAuth (async (ctx)=>{
    return {
        props: {}
    }
})