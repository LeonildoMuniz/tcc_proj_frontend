import {canSSRAuth} from '../../utils/canSSRAuth'


export default function Mensagem(){
    return(
        <div>
            <h1>Bem vindo ao cadastro</h1>
        </div>
    )
}

export const getServerSideProps = canSSRAuth (async (ctx)=>{
    return {
        props: {}
    }
})