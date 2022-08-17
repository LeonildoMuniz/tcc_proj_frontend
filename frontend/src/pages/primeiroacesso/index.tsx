import {useState} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import logo from '../../../public/logoSistema.svg'
import styles from '../../../styles/home.module.scss'
import {Input} from '../../components/ui/input'
import {Button} from '../../components/ui/Button'
import Link from 'next/link'


const PrimeiroAcesso: NextPage = () => {
  const [matricula,setMatricula] = useState('')
  const [admissao,setAdmissao] = useState('')
  const [cpf,setCPF] = useState('')
  const [senha,setSenha] = useState('')
  const [loading,setLoading] = useState('');

  return (
    <>
    <Head>
      <title>Conet@ar - Faça seu cadastro!</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logo} alt="Logo sistema Conect@r"/>
      <div className={styles.login}>
        <h1>Primeiro Acesso</h1>
        <form>
          <Input
          placeholder="Digite sua matricula"
          />
         <Input
         placeholder="Digite sua data de admissão"
          type="date"
          />
          <Input
          placeholder="Digite seu CPF"
          />
         <Input
          placeholder="Digite sua senha" 
          type="password"
          />

          <Button
            type="submit"
            loading={false}
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
