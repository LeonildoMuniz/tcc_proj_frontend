import {useContext, FormEvent, useState} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import logo from '../../public/logoSistema.svg'
import styles from '../../styles/home.module.scss'
import {Input} from '../components/ui/input'
import {Button} from '../components/ui/Button'
import Link from 'next/link'
import {AuthContext} from '../contexts/AutorizacaoContextCol'


const Home: NextPage = () => {
  
  const {sigIn} = useContext(AuthContext)

  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlogin(event: FormEvent) {
    event.preventDefault();

    if(matricula==='' || senha === ''){
      alert("Informe todos os dados")
      return;
    }

    setLoading(true);
    let data = {
      matricula: matricula,
      senha: senha
    }
    await sigIn(data);

    setLoading(false);
  }


  return (
    <>
    <Head>
      <title>Conet@ar - Faça seu login!</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logo} alt="Logo sistema Conect@r"/>
      <div className={styles.login}>
        <form onSubmit={handlogin}>
          <Input
          placeholder="Digite sua matricula"
          value={matricula}
          onChange = {(e) => setMatricula(e.target.value) }
          />
         <Input
          placeholder="Digite sua senha" type="password"
          value={senha}
          onChange = {(e) => setSenha(e.target.value) }
          />

          <Button
            type="submit"
            loading={loading}
          >
            Logar
          </Button>
        </form>
            <Link href="/primeiroacesso">
              <a className={styles.text}>Primeiro Acesso</a>
            </Link>
            <Link href="/administrador">
              <a className={styles.text}>Acesso Administração</a>
            </Link>
            
      </div>
    </div>
    </>
  )
}

export default Home
