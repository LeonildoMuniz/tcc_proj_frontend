import {canSSRAuth} from '../../utils/canSSRAuth'




export default function Admin(){
    return(
        <div>
            <h1>Bem vindo ao Administrador</h1>
        </div>
    )
}

export const getServerSideProps = canSSRAuth (async (ctx)=>{
    return {
        props: {}
    }
})