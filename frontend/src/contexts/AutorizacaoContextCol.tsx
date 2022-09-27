import {createContext, ReactNode, useState, useEffect} from 'react';
import {destroyCookie,setCookie,parseCookies} from  'nookies'
import Router from 'next/router'
import {api} from '../services/apiClient'
import {toast} from 'react-toastify'

type AuthContextData = {
    user: UserProps;
    autenticado: boolean;
    sigIn: (credenciais:SignInProps)=> Promise<void>;
    sigInCol: (credenciais:SignInProps)=> Promise<void>;
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
    valor:string;
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
        destroyCookie(undefined,'@conectar.controle')
        Router.push('/');
    }catch{
        console.log("Erro ao deslogar")
    }
}

export function AuthProvider({children}:AuthProvaderProps){
   
    const [user, setUser] = useState<UserProps>()
    const autenticado = !!user;
    const [teste, setTeste] = useState<UserProps>();

    useEffect(()=>{
        //tentar pegar token no cookie
        const {'@conectar.token': token} = parseCookies();
        const {'@conectar.controle': valor} = parseCookies();


        if(token){
            api.get(`/userinfo${valor}`).then(response =>{
                const {id, nome, matricula,valor} = response.data;
                setUser({
                    id,
                    nome,
                    matricula,
                    valor,
                })
            })
            .catch(()=>{
                signOut();
            })
        }
    },[])

    async function sigIn({matricula,senha}:SignInProps){
       try{
        const response = await api.post('/session',{
            matricula,
            senha,
        })
        //console.log(response.data);

        const {id, nome, token, valor} = response.data;

        setCookie(undefined,'@conectar.controle', valor, {
            maxAge: 60*60, //expira em uma hora
            path: "/" //quais locais tem acesso nesse caso todos
        })
        setTeste({
            id,
            nome,
            matricula,
            valor,
        });


        setCookie(undefined,'@conectar.token', token, {
            maxAge: 60*60, //expira em uma hora
            path: "/" //quais locais tem acesso nesse caso todos
        })
        setUser({
            id,
            nome,
            matricula,
            valor,
        })

        //passar para proximas requisiçoes o token
        api.defaults.headers['Authorization'] = `Bearer ${token}`

        toast.success('Login efetuado com sucesso!')

        Router.push('/empresa')

       }catch(err){
            toast.error('Erro ao efetuar o login');
            console.log("Erro ao acessar", err);
       }
    }

    async function sigInCol({matricula,senha}:SignInProps){
        try{
         const response = await api.post('/session3',{
             matricula,
             senha
         })
         //console.log(response.data);
 
         const {id, nome, token, valor} = response.data;


         setCookie(undefined,'@conectar.controle', valor, {
            maxAge: 60*60, //expira em uma hora
            path: "/" //quais locais tem acesso nesse caso todos
        })
        setTeste({
            id,
            nome,
            matricula,
            valor,
        });

         setCookie(undefined,'@conectar.token', token, {
             maxAge: 60*60, //expira em uma hora
             path: "/" //quais locais tem acesso nesse caso todos
         })
         setUser({
             id,
             nome,
             matricula,
             valor,
         })
 
         //passar para proximas requisiçoes o token
         api.defaults.headers['Authorization'] = `Bearer ${token}`
 
         toast.success('Login efetuado com sucesso!')
 
         Router.push('/mensagemcol')
 
        }catch(err){
             toast.error('Erro ao efetuar o login');
             console.log("Erro ao acessar", err);
        }
     }


   
    async function singUP({matricula,cpf,admissao,senha}:SignUpProps) {

        try{
            const response = await api.put('/primeiroacesso',{
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
        <AuthContext.Provider value={ {user,autenticado,sigIn,sigInCol,signOut,singUP} }>
            {children}
        </AuthContext.Provider>
    )
}
