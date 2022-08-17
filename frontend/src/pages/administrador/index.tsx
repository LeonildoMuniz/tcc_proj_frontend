import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import logo from '../../../public/logoSistema.svg'
import styles from '../../../styles/home.module.scss'
import {Input} from '../../components/ui/input'
import {Button} from '../../components/ui/Button'
import Link from 'next/link'


const Administrador: NextPage = () => {
  return (
    <>
    <Head>
      <title>Conet@ar - Administrador!</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logo} alt="Logo sistema Conect@r"/>
      <div className={styles.login}>
        <h1>Administração</h1>
        <form>
          <Input
          placeholder="Digite seu login"
          />
         <Input
          placeholder="Digite sua senha" 
          type="password"
          />

          <Button
            type="submit"
            loading={false}
          >
            Logar
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

export default Administrador