import {createContext, ReactNode, useState, useEffect} from 'react';
import {destroyCookie,setCookie,parseCookies} from  'nookies'
import Router from 'next/router'
import {api} from '../services/apiClient'
import {toast} from 'react-toastify'
import { sensitiveHeaders } from 'http2';

type AuthContextData = {
    user: UserProps;
    autenticado: boolean;
    sigIn: (credenciais:SignInProps)=> Promise<void>;
    signOut: ()=>void;
    singUP: (credenciais:SignUpProps)=> Promise<void>;  
}

type SignInProps = {
    matricula: string;
    senha: string;
}

type UserProps = {
    id: string;
    nome: string;
    matricula: string;
}

type AuthProvaderProps = {
    children: ReactNode;
}

type SignUpProps={
    matricula: string;
    admissao: string;
    cpf: string;
    senha: string;
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

    useEffect(()=>{
        //tentar pegar token no cookie
        const {'@conectar.token': token} = parseCookies();
        if(token){
            api.get('/userinfo').then(response =>{
                const {id, nome, matricula} = response.data;
                setUser({
                    id,
                    nome,
                    matricula
                })
            })
            .catch(()=>{
                //se der erro deslogar
                signOut();
            })
        }
    },[])

    async function sigIn({matricula,senha}:SignInProps){
       try{
        const response = await api.post('session3',{
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
            matricula
        })

        //passar para proximas requisiçoes o token
        api.defaults.headers['Authorization'] = `Bearer ${token}`

        toast.success('Login efetuado com sucesso!')

        Router.push('/mensagens')

       }catch(err){
            toast.error('Erro ao efetuar o login');
            console.log("Erro ao acessar", err);
       }
    }
   
    async function singUP({matricula,cpf,admissao,senha}:SignUpProps) {

        try{
            const response = await api.post('/primeiroacesso',{
                matricula,
                cpf,
                admissao,
                senha,
            })

            toast.success('Cadastro efetuado com sucesso!')

            Router.push('/');
        }catch(err){
            toast.error('Erro ao efetuar o cadastro');
            console.log("Erro ao efetuar o cadastro",err);
        }
    }

    return(
        <AuthContext.Provider value={ {user,autenticado,sigIn,signOut,singUP} }>
            {children}
        </AuthContext.Provider>
    )
}