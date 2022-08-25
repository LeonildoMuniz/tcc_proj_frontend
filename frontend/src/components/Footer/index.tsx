import {useContext} from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'
import {FiLogOut} from 'react-icons/fi'
import Image from 'next/image'
import logo from '../../../public/logoheader.svg'
import {AuthContext} from '../../contexts/AutorizacaoContextCol'

export function Footer(){
    const {signOut} = useContext(AuthContext)
    return(
        <footer className={styles.headerContainer}>
            <p>&copy; Desenvolvido por Leonildo Muniz</p>
        </footer>
    )
}