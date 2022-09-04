import Head from "next/head"
import {Header} from '../../components/Header/Index'
import {Footer} from '../../components/Footer/index'
import styles from './styles.module.scss'
import {useState,FormEvent} from 'react'
import {api} from '../../services/apiClient'
import {setupAPIClient} from '../../services/api'
import {toast} from 'react-toastify'
import {canSSRAuth} from '../../utils/canSSRAuth'



type ItemProps = {
    id: string;
    desc_nivel: string;
    controle: number;
}

interface NivelProps{
    nivellist:ItemProps[];
}

export default function Cargo({nivellist}:NivelProps){
    const [descricao,setDesc] = useState('');
    const [niveis, setNiveis] = useState(nivellist || []);
    const [nivelSelecionado,setSelecionado] = useState(0)
    

    async function hadleCadastrar(event:FormEvent) {
        event.preventDefault();
        if(descricao ===''){
            toast.warning('Digite todos dados para prosseguir!');
            return;
        }


        try{
            if(niveis[nivelSelecionado].controle>1){
                const response = await api.post('/cargo',{
                    descricao: descricao,
                    gestor: true,
                    nivel_id: niveis[nivelSelecionado].id,
                })
            }else{
                const response = await api.post('/cargo',{
                    descricao: descricao,
                    gestor: false,
                    nivel_id: niveis[nivelSelecionado].id,
                })
            }

        }catch(err){
            toast.error('Erro ao cadastrar: '+err);
            return;
        }


        toast.success('Dados cadastrados com sucesso!')
        setDesc('');
    }
    function handleCusto(event){
        setSelecionado(event.target.value)
    }

 return (
    <>
        <Head>
            <title>Novo Cargo</title>
        </Head>
        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Cadastro Novo Cargo</h1>
                <form className={styles.form} onSubmit={hadleCadastrar}>
                    <select className={styles.select} value={nivelSelecionado} onChange={handleCusto}>
                        {niveis.map( (item, index)=> {
                            return(
                                <option key={item.id} value={index}>
                                    {item.desc_nivel}
                                </option>
                            )
                        })}
                    </select>
                    <input type="text"
                    placeholder="Digite a descrição do cargo"
                    className={styles.input}
                    value={descricao}
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
    
    const response = await apiCliente.get('/consultanivel')
    return {
        props: {
            nivellist: response.data
        }
    }
})