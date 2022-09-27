/* eslint-disable @next/next/no-img-element */
import {canSSRAuth} from '../../utils/canSSRAuth'
import {ChangeEvent, FormEvent, useContext, useState} from 'react'
import Head from 'next/head'
import {Header} from '../../components/Header/Index'
import {Footer} from '../../components/Footer/index'
import styles from './styles.module.scss'
import {FiUpload} from 'react-icons/fi'
import Image from 'next/image' 
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AutorizacaoContextCol'
import { api } from '../../services/apiClient'
import { setupAPIClient } from '../../services/api'
import { type } from 'os'



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

interface EstruturaProps{
    estruturamentolist:ItemProps[];
    alocacaolist: itemPropsAloc[];
    cargolist: itemPropsCargo[];
}



export default function Colaborador({estruturamentolist, alocacaolist, cargolist}:EstruturaProps){
    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setAvatar] = useState(null);

    const [nome, setNome] = useState('')
    const [matricula, setMatricula] = useState('');
    const [admissao, setAdmissao] = useState('');
    const [cpf, setCPF] = useState('');
    const [dt_nasc, setDate] = useState('')
    const [senha, setSenha] = useState('')
    const [estrutura, setEstrutura] = useState('');
    const [cargo, setCargo] = useState('');
    const [alocacao, setAlocacao] = useState('');


    const [estr, setEstr] = useState(estruturamentolist || []);
    const [estrutSelecionado,setSelecionado] = useState(0)

    const [carg, setCarg] = useState(cargolist || []);
    const [cargSelecionado,setSelecionadocarg] = useState(0)

    const [aloc, setAloc] = useState(alocacaolist || []); 
    const [alocSelecionado,setSelecionadoaloc] = useState(0)



    const {user} = useContext(AuthContext);
    
    function handleFile(e: ChangeEvent<HTMLInputElement>){

        console.log(e.target.files);

        if(!e.target.files){
            return;
        }
        const image = e.target.files[0];


        if(!image){
            return;
        }
        setAvatarUrl(URL.createObjectURL(e.target.files[0]))

        if(image.type == 'image/jpeg' || image.type == 'image/png'){
            setAvatar(image);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }

    }

    async function handleCadastrar(e:FormEvent){
        e.preventDefault();
        try{
            const data = new FormData();
            if(!nome || !matricula || !admissao || !cpf || !estr || !carg || !aloc || !dt_nasc || !senha){
                
                toast.warning("Para processegui é preciso preencher todos os campos")
                return;
            }


            data.append('nome',nome);
            data.append('matricula',matricula)
            data.append('file',imageAvatar )
            data.append('admissao',admissao)
            data.append('cpf', cpf)
            data.append('senha',senha)
            data.append('dt_nascimento',dt_nasc)

            data.append('estrutura_id', estr[estrutSelecionado].id)
            data.append('cargo_id', carg[cargSelecionado].id)
            data.append('alocacao_id',aloc[alocSelecionado].id)

            alert

            const response = await api.post('/colaborador',data)

            toast.success("Colaborador cadastrado com sucesso!");

            setAvatar('');
            setAvatarUrl('');
            setNome('');
            setAdmissao('');
            setAlocacao('');
            setCargo('');
            setEstrutura('');
            setMatricula('');
            setDate('');
            

        }catch(er){
            toast.error("Erro ao cadastrar mensagem")
        }

    }

    function handleEstr(event){
        setSelecionado(event.target.value)
    }

    function handleCarg(event){
        setSelecionadocarg(event.target.value)
    }

    function handleAloc(event){
        setSelecionadoaloc(event.target.value)
    }

    return(
        <>
            <Head>
                <title>Cadastro de colaborador</title>
            </Head>
            <Header/>
                <main className={styles.container} >
                    <h1>Cadastro de colaborador</h1>
                    <form className={styles.form} onSubmit={handleCadastrar}>

                        <label className={styles.label}>
                            <span>
                                <FiUpload size={25} color="var(--azul2)"/>
                            </span>
                            <input type="file" accept="image/jpeg, image/png" onChange={handleFile}/>
                            {avatarUrl &&(
                                <img 
                                    className={styles.preview}
                                    src={avatarUrl} 
                                    alt="imagem image"
                                    width={250}
                                    height={250}
                                />
                            )}
                        </label>

                        <input 
                            type="text" 
                            placeholder='Digite o Nome'
                            className={styles.input}
                            value={nome}
                            onChange = {(e) => setNome(e.target.value)}
                        />
                        <input
                            placeholder='Digite a Matricula'
                            className={styles.input}
                            value={matricula}
                            onChange = {(e) => setMatricula(e.target.value)}
                        />

                        <input
                            placeholder='Digite a data de admissão'
                            className={styles.input}
                            value={admissao}
                            onChange = {(e) => setAdmissao(e.target.value)}
                        />

                        <input
                            placeholder='Digite o CPF'
                            className={styles.input}
                            value={cpf}
                            onChange = {(e) => setCPF(e.target.value)}
                        />

                        <input 
                            type="text" 
                            placeholder='Digite a data de nascimento'
                            className={styles.input}
                            value={dt_nasc}
                            onChange = {(e) => setDate(e.target.value)}
                        />

                        <input 
                            type="password" 
                            placeholder='Digite a senha'
                            className={styles.input}
                            value={senha}
                            onChange = {(e) => setSenha(e.target.value)}
                        />

                        <select className={styles.select} value={estrutSelecionado} onChange={handleEstr}>
                            {estr.map( (item, index)=> {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.UnidadeOrg}
                                    </option>
                                )
                            })}
                        </select>

                        <select className={styles.select} value={cargSelecionado} onChange={handleCarg}>
                            {carg.map( (item, index)=> {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.descricao}
                                    </option>
                                )
                            })}
                        </select>

                        <select className={styles.select} value={alocSelecionado} onChange={handleAloc}>
                            {aloc.map( (item, index)=> {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.desc_custo}
                                    </option>
                                )
                            })}
                        </select>

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
    const apiCliente = setupAPIClient(ctx);
    
    const estrutura = await apiCliente.get('/consultaestrutura')
    const cargo = await apiCliente.get('/consultacargo')
    const alocacao = await apiCliente.get('/consultaalocacao')



    return {
        props: {
            estruturamentolist: estrutura.data,
            cargolist: cargo.data,
            alocacaolist:alocacao.data
        }
    }
})