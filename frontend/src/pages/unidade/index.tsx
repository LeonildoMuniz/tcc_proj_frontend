import Head from "next/head"
import {Header} from '../../components/Header/Index'
import {Footer} from '../../components/Footer/index'
import styles from './styles.module.scss'
import {useState,FormEvent} from 'react'
import {api} from '../../services/apiClient'
import {setupAPIClient} from '../../services/api'
import {toast} from 'react-toastify'
import {canSSRAuth} from '../../utils/canSSRAuth'
import internal from "stream"

type ItemProps = {
    id: string;
    empresa: number;
    desc_empresa: string;
}

interface EmpresaProps{
    empresalist:ItemProps[];
}

export default function Unidade({empresalist}:EmpresaProps){
    const [estab,setEstab] = useState('');
    const [desc_estab, setDesc] = useState('');
    const [empresa, setEmpresa] = useState('');

    const [empresas, setEmpresas] = useState(empresalist || []);
    const [empresaSelecionada,setSelecionada] = useState(0)
    
    const valor = parseInt(estab);

    async function hadleCadastrar(event:FormEvent) {
        event.preventDefault();
        if(estab ==='' || desc_estab==='' || empresas[empresaSelecionada].id ===''){
            toast.warning('Digite todos dados para prosseguir!');
            return;
        }
        
        try{
            const response = await api.post('/estabelecimento',{
                estab: valor,
                desc_estab: desc_estab,
                empresa_id: empresas[empresaSelecionada].id
            })
        }catch(err){
            toast.error('Erro ao cadastrar: '+err);
            return;
        }


        toast.success('Dados cadastrados com sucesso!')
        setEmpresa('');
        setDesc('');
    }
    function handleEmpresa(event){
        setSelecionada(event.target.value)
    }



 return (
    <>
        <Head>
            <title>Nova Undiade</title>
        </Head>
        

        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Cadastro Nova Unidade</h1>

                <form className={styles.form} onSubmit={hadleCadastrar}>
                    <select className={styles.select} value={empresaSelecionada} onChange={handleEmpresa}>
                        {empresas.map( (item, index)=> {
                            return(
                                <option key={item.id} value={index}>
                                    {item.desc_empresa}
                                </option>
                            )
                        })}
                    </select>
                    <input type="number"
                    placeholder="Digite o numero do estabelecimento"
                    className={styles.input}
                    value={estab}
                    onChange = {(e)=>setEstab(e.target.value)}
                     />
                    <input type="text" 
                    placeholder="Digite o nome da unidade"
                    className={styles.input}
                    value={desc_estab}
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
    const apiCliente = setupAPIClient(ctx);
    
    const response = await apiCliente.get('/consultaempresa')
    return {
        props: {
            empresalist: response.data
        }
    }
})