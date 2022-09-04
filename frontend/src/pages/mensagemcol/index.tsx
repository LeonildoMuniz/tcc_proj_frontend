/* eslint-disable @next/next/no-img-element */
import {canSSRAuth} from '../../utils/canSSRAuth'
import {ChangeEvent, FormEvent, useContext, useState} from 'react'
import Head from 'next/head'
import {Footer} from '../../components/Footer/index'
import styles from './styles.module.scss'
import {FiUpload} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AutorizacaoContextCol'
import { api } from '../../services/apiClient'
import{TbListSearch} from 'react-icons/tb'
import { setupAPIClient } from '../../services/api'
import { HeaderCol } from '../../components/HeaderCol'







export default function MensagemCol(){
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

        if(image.type == 'image/jpeg' || image.type == 'image/png' || image.type == 'application/pdf'){
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


            const response = await api.post('/comunicacao2',data)

            toast.success("Mensagem enviada com sucesso!");

            setAvatar('');
            setAvatarUrl('');
            setMensagem('');
            setTitulo('');

        }catch(er){
            toast.error("Erro ao cadastrar mensagem")
        }

    }
    function handleListar(e:FormEvent){

    }

    return(
        <>
            <Head>
                <title>Cadastro de mensagens</title>
            </Head>
            <HeaderCol/>
            <header>
                <form onSubmit={handleListar}>
                    <button className={styles.buttonLocalize}>
                        <span>
                        <TbListSearch/> Listar Mensagens Enviadas
                        </span>
                    </button>
                </form>

            </header>
                <main className={styles.container} >
                    <h1>Cadastro de mensagens</h1>
                    <form className={styles.form} onSubmit={handleCadastrar}>
                        <label className={styles.label}>
                            <span>
                                <FiUpload size={25} color="var(--azul2)"/>
                            </span>
                            <input type="file" accept="image/jpeg, image/png, application/pdf" onChange={handleFile}/>
                            {avatarUrl &&(
                                <img 
                                    className={styles.preview}
                                    src={avatarUrl} 
                                    alt="imagem arquivo"
                                    width={250}
                                    height={250}
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