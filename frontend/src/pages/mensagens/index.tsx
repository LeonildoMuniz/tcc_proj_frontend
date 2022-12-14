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
import{TbListSearch} from 'react-icons/tb'
import { setupAPIClient } from '../../services/api'
import Link from 'next/link'






export default function Mensagem(){
    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setAvatar] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [mensagem, setMensagem] = useState('');
    const {user} = useContext(AuthContext);


    
    function handleFile(e: ChangeEvent<HTMLInputElement>){


        if(!e.target.files){
            return;
        }
        const image = e.target.files[0];
        console.log(image)

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

            if(!titulo || !mensagem ){
                toast.warning("Para processegui é preciso preencher os campos titulo e mensagem")
                return;
            }
            data.append('titulo',titulo);
            data.append('mensagem',mensagem);
            data.append('file',imageAvatar);
            data.append('id_colaborador',user.id);


            const response = await api.post('/comunicacao',data)

            toast.success("Mensagem enviada com sucesso!");

            setAvatar('');
            setAvatarUrl('');
            setMensagem('');
            setTitulo('');

        }catch(er){
            toast.error("Erro ao cadastrar mensagem")
        }

    }

    return(
        <>
            <Head>
                <title>Cadastro de mensagens</title>
            </Head>
            <Header/>
            <header>
                <Link href="/listarmensagem">
                    <a className={styles.text}> <TbListSearch/> Listar Mensagens</a>
                </Link>
            </header>
                <main className={styles.container} >
                    <h1>Cadastro de mensagens</h1>
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
                                    alt="imagem arquivo"
                                    width={350}
                                    height={350}
                                />
                            )}
                        </label>

                        <input 
                        type="text" 
                        placeholder='Titulo da mensagem'
                        className={styles.input}
                        value={titulo}
                        onChange = {(e) => setTitulo(e.target.value)}
                        />
                        <textarea
                        placeholder='Mensagem'
                        className={styles.input}
                        value={mensagem}
                        onChange = {(e) => setMensagem(e.target.value)}
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
        props: {
        }
    }
})