import Head from "next/head"
import {Header} from '../../components/Header/Index'
import {Footer} from '../../components/Footer/index'
import styles from './styles.module.scss'
import {useState,FormEvent} from 'react'
import {api} from '../../services/apiClient'
import {toast} from 'react-toastify'
import {canSSRAuth} from '../../utils/canSSRAuth'

export default function Nivel(){
    const [controle,setControle] = useState('');
    const [desc_nivel, setDesc] = useState('');
    
    const valor = parseInt(controle);

    async function hadleCadastrar(event:FormEvent) {
        event.preventDefault();
        if(controle ==='' || desc_nivel===''){
            toast.warning('Digite todos dados para prosseguir!');
            return;
        }

        
        try{
            const response = await api.post('/nivel',{
                controle: valor,
                desc_nivel: desc_nivel,
            })
        }catch(err){
            toast.error('Erro ao cadastrar: '+err);
            return;
        }


        toast.success('Dados cadastrados com sucesso!')
        setControle('');
        setDesc('');
    }
 return (
    <>
        <Head>
            <title>Nivel do Cargo</title>
        </Head>
        

        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Cadastro Nivel do Cargo</h1>

                <form className={styles.form} onSubmit={hadleCadastrar}>
                    <input type="number"
                    placeholder="Digite o numero de controle do cargo"
                    className={styles.input}
                    value={controle}
                    onChange = {(e)=>setControle(e.target.value)}
                     />
                    <input type="text" 
                    placeholder="Digite o nome do nivel"
                    className={styles.input}
                    value={desc_nivel}
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