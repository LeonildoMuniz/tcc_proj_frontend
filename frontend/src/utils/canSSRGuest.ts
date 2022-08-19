import { rejects } from 'assert';
import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult,} from 'next'
import {parseCookies,destroyCookie} from 'nookies'
import Router from 'next/router'
import { redirect } from 'next/dist/server/api-utils';

//função para acessar somente quem não está logado

export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx : GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> =>{
        //se tentar acessar logado, direcionar.
        const cookies = parseCookies(ctx);
        if(cookies['@conectar.token']){
            return{
                redirect:{
                    destination: '/admin',
                    permanent:false,   
                }
            }
        }

        return await fn(ctx);
    }
}