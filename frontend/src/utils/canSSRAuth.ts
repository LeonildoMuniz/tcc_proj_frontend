import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult,} from 'next'
import {parseCookies,destroyCookie} from 'nookies'
import {AuthTokenErro} from '../services/errors/AuthTokenErro'

//função para acessar somente quem está logado

export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async (ctx : GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> =>{
        //se tentar acessar logado, direcionar.
        const cookies = parseCookies(ctx);
        const token = cookies['@conectar.token'];

        if(!token){
            return{
                redirect:{
                    destination:'/',
                    permanent:false,
                }
            }
        }

        try{
            return await fn(ctx);
        }catch(err){
            if(err instanceof AuthTokenErro){
                destroyCookie(ctx,'@conectar.token');
                return{
                    redirect:{
                        destination:'/',
                        permanent: false,
                    }
                }
            }
        }


        
    }
}