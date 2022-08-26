import Head from "next/head"
import {Header} from '../../components/Header/Index'
import {Footer} from '../../components/Footer/index'
import styles from './styles.module.scss'
import {useState,FormEvent} from 'react'
import {api} from '../../services/apiClient'
import {toast} from 'react-toastify'
import {canSSRAuth} from '../../utils/canSSRAuth'

export default function Empresa(){
    const [empresa,setEmpresa] = useState('');
    const [desc_empresa, setDesc] = useState('');
    
    const valor = parseInt(empresa);

    async function hadleCadastrar(event:FormEvent) {
        event.preventDefault();
        if(empresa ==='' || desc_empresa===''){
            toast.warning('Digite todos dados para prosseguir!');
            return;
        }

        
        try{
            const response = await api.post('/empresa',{
                empresa: valor,
                desc_empresa: desc_empresa,
            })
        }catch(err){
            toast.error('Erro ao cadastrar: '+err);
            return;
        }


        toast.success('Dados cadastrados com sucesso!')
        setEmpresa('');
        setDesc('');
    }
 return (
    <>
        <Head>
            <title>Cadastro nova empresa</title>
        </Head>
        

        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Cadastro Empresa</h1>

                <form className={styles.form} onSubmit={hadleCadastrar}>
                    <input type="number"
                    placeholder="Digite o numero da empresa"
                    className={styles.input}
                    value={empresa}
                    onChange = {(e)=>setEmpresa(e.target.value)}
                     />
                    <input type="text" 
                    placeholder="Digite o nome da empresa"
                    className={styles.input}
                    value={desc_empresa}
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