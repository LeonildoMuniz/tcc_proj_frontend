import {useState, FormEvent, useContext} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import logo from '../../../public/logoSistema.svg'
import styles from '../../../styles/home.module.scss'
import {Input} from '../../components/ui/input'
import {Button} from '../../components/ui/Button'
import {AuthContext} from '../../contexts/AutorizacaoContextCol'
import Link from 'next/link'
import {toast} from 'react-toastify'


const PrimeiroAcesso: NextPage = () => {

  const {singUP} = useContext(AuthContext);
  const [matricula,setMatricula] = useState('')
  const [admissao,setAdmissao] = useState('')
  const [cpf,setCPF] = useState('')
  const [senha,setSenha] = useState('')
  const [loading,setLoading] = useState(false);

  async function handleSignUP(event:FormEvent) {
    event.preventDefault();

    if(matricula===''||admissao===''||cpf===''||senha===''){
      toast.warning('Digite todos os dados para processeguir');
      return;
    }

    setLoading(true);

    let data = {
      matricula,
      admissao,
      cpf,
      senha,
    }

    await singUP(data);

    setLoading(false); 

  }

  return (
    <>
    <Head>
      <title>Conet@ar - Faça seu cadastro!</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logo} alt="Logo sistema Conect@r"/>
      <div className={styles.login}>
        <h2>Primeiro Acesso</h2>
        <form onSubmit={handleSignUP}>
          <Input
          placeholder="Digite sua matricula"
          value={matricula}
          onChange={(e)=>setMatricula(e.target.value)}
          />
         <Input
         placeholder="Digite sua data de admissão"
          type="text"
          value={admissao}
          onChange={(e)=>setAdmissao(e.target.value)}
          />
          <Input
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e)=>setCPF(e.target.value)}
          />
         <Input
          placeholder="Digite sua senha" 
          type="password"
          value={senha}
          onChange={(e)=>setSenha(e.target.value)}
          />

          <Button
            type="submit"
            loading={loading}
          >
            Cadastrar
          </Button>
        </form>
            <Link href="/">
              <a className={styles.text}>Tela de login</a>
            </Link>
            
      </div>
    </div>
    </>
  )
}

export default PrimeiroAcesso
