import {useContext} from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'
import {FiLogOut} from 'react-icons/fi'
import Image from 'next/image'
import logo from '../../../public/logoheader.svg'
import {AuthContext} from '../../contexts/AutorizacaoContextCol'

export function HeaderCol(){
    const {signOut} = useContext(AuthContext)
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <Image src={logo} alt="Logo sistema Conect@r" width={190} height={60}/>
                </Link>
                <nav className={styles.menuNav}>
                    <Link href="../mensagens">
                        <a>Mensagem</a>
                    </Link>
                    <button onClick={signOut}>
                        <FiLogOut color="white" size={24}/>
                    </button>
                </nav>

            </div>
        </header>
    )
}