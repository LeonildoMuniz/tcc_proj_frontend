import {canSSRAuth} from '../../utils/canSSRAuth'
import Head from 'next/head'
import {Header} from '../../components/Header/Index'
import {Footer} from '../../components/Footer/index'


export default function Mensagem(){
    return(
        <>
            <Head>
                <title>Cadastro de mensagens</title>
            </Head>
            <Header/>
            <div>
                <p> Conteudo </p>
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