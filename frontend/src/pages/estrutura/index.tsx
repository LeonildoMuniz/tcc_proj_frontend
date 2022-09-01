import Head from "next/head"
import {Header} from '../../components/Header/Index'
import {Footer} from '../../components/Footer/index'
import styles from './styles.module.scss'
import {useState,FormEvent} from 'react'
import {api} from '../../services/apiClient'
import {toast} from 'react-toastify'
import {canSSRAuth} from '../../utils/canSSRAuth'

export default function Estrutura(){
    const [desc_estrutura, setDesc] = useState('');
    

    async function hadleCadastrar(event:FormEvent) {
        event.preventDefault();
        if(desc_estrutura===''){
            toast.warning('Digite todos dados para prosseguir!');
            return;
        }

        
        try{
            const response = await api.post('/estrutura',{
                UnidadeOrg: desc_estrutura,
            })
        }catch(err){
            toast.error('Erro ao cadastrar: '+err);
            return;
        }


        toast.success('Dados cadastrados com sucesso!')
        setDesc('');
    }
 return (
    <>
        <Head>
            <title>Unidade Organizacional</title>
        </Head>
        

        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Cadastro de estrutura</h1>

                <form className={styles.form} onSubmit={hadleCadastrar}>
                    <input type="text" 
                    placeholder="Digite o nome da estrutura"
                    className={styles.input}
                    value={desc_estrutura}
                    onChange = {(e)=>setDesc(e.target.value)}
                    />
                    <button className={styles.buttonAdd} type="submit">
                        Cadastrar
                    </button>
                </form>
            </main>
        </div>
        <Footer/>
    </>
 )
}

export const getServerSideProps = canSSRAuth (async (ctx)=>{
    return {
        props: {}
    }
})