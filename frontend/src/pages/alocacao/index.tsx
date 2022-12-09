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
    estab: number;
    desc_estab: string;
}

interface EstabelecimentoProps{
    estabelecimentolist:ItemProps[];
}

export default function Unidade({estabelecimentolist}:EstabelecimentoProps){
    const [c_custo,setCusto] = useState('');
    const [desc_custo, setDesc] = useState('');
    const [estabelecimento_id, setEstabelecimento] = useState('');

    const [estabelecimentos, setEstabelecimentos] = useState(estabelecimentolist || []);
    const [estabSelecionado,setSelecionado] = useState(0)
    
    const valor = parseInt(c_custo);

    async function hadleCadastrar(event:FormEvent) {
        event.preventDefault();
        if(c_custo ==='' || desc_custo==='' || estabelecimentos[estabSelecionado].desc_estab ===''){
            toast.warning('Digite todos dados para prosseguir!');
            return;
        }
        
        try{
            const response = await api.post('/alocacao',{
                c_custo: valor,
                desc_custo: desc_custo,
                estabelecimento_id: estabelecimentos[estabSelecionado].id
            })
        }catch(err){
            toast.error('Erro ao cadastrar: '+err);
            return;
        }


        toast.success('Dados cadastrados com sucesso!')
        setCusto('');
        setDesc('');
        setEstabelecimento('');
    }
    function handleCusto(event){
        setSelecionado(event.target.value)
    }



 return (
    <>
        <Head>
            <title>Nova Undiade</title>
        </Head>
        

        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Cadastro Centro de Custo</h1>

                <h3>Selecione o estabelecimento para relacionar ao centro de custo</h3>
                <form className={styles.form} onSubmit={hadleCadastrar}>
                    <select className={styles.select} value={estabSelecionado} onChange={handleCusto}>
                        {estabelecimentos.map( (item, index)=> {
                            return(
                                <option key={item.id} value={index}>
                                    {item.desc_estab}
                                </option>
                            )
                        })}
                    </select>
                    <input type="number"
                    placeholder="Digite o numero do centro de custo"
                    className={styles.input}
                    value={c_custo}
                    onChange = {(e)=>setCusto(e.target.value)}
                     />
                    <input type="text" 
                    placeholder="Digite o nome da unidade"
                    className={styles.input}
                    value={desc_custo}
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
    
    const response = await apiCliente.get('/consultaestabelecimento')
    return {
        props: {
            estabelecimentolist: response.data
        }
    }
})