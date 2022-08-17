import {createContext, ReactNode, useState} from 'react';
import {destroyCookie,setCookie,parseCookies} from  'nookies'
import Router from 'next/router'
import {api} from '../services/apiClient'

type AuthContextData = {
    user: UserProps;
    autenticado: boolean;
    sigIn: (credenciais:SignInProps)=> Promise<void>;
    signOut: ()=>void;
}

type SignInProps = {
    matricula: string;
    senha: string;
}

type UserProps = {
    id: string;
    nome: string;
    matricula: string;
    senha: string;
}

type AuthProvaderProps = {
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{
        destroyCookie(undefined,'@conectar.token')
        Router.push('/');
    }catch{
        console.log("Erro ao deslogar")
    }
}

export function AuthProvider({children}:AuthProvaderProps){
   
    const [user, setUser] = useState<UserProps>()
    const autenticado = !!user;

    async function sigIn({matricula,senha}:SignInProps){
       try{
        const response = await api.post('session',{
            matricula,
            senha
        })
        //console.log(response.data);

        const {id, nome, token} = response.data;

        setCookie(undefined,'@conectar.token', token, {
            maxAge: 60*60, //expira em uma hora
            path: "/" //quais locais tem acesso nesse caso todos
        })
        setUser({
            id,
            nome,
            matricula,
            senha,
        })

        //passar para proximas requisiçoes o token
        api.defaults.headers['Authorization'] = `Bearer ${token}`


        Router.push('/admin')

       }catch(err){
            console.log("Erro ao acessar", err);
       }
    }
   
    return(
        <AuthContext.Provider value={ {user,autenticado,sigIn,signOut} }>
            {children}
        </AuthContext.Provider>
    )
}