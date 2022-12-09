import Modal from 'react-modal'
import styles from './styles.module.scss'

import {FiUpload, FiX} from 'react-icons/fi'
import {BiEdit} from 'react-icons/bi'
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'
import { api } from '../../services/apiClient'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { AuthContext } from '../../contexts/AutorizacaoContextCol'
import { AiOutlineCamera } from 'react-icons/ai'




interface EstruturaProps{
    isOpen: boolean;
    onRequestClose: ()=>void;
    colaborador;
    estruturamentolist;
    alocacaolist;
    cargolist;
}



export function ModalColaborador({isOpen,onRequestClose,colaborador,estruturamentolist,alocacaolist,cargolist}:EstruturaProps){

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setAvatar] = useState(null);
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')
    const [estrutSelecionado,setSelecionado] = useState(0)
    const [cargSelecionado,setSelecionadocarg] = useState(0)
    const [alocSelecionado,setSelecionadoaloc] = useState(0)
    const [inativaSelecionado, setInativa] = useState(1)


    const [estr, setEstr] = useState(estruturamentolist || []);


    const [carg, setCarg] = useState(cargolist || []);


    const [aloc, setAloc] = useState(alocacaolist || []); 




    function handleEstr(event){
        setSelecionado(event.target.value)
    }
  
    function handleCarg(event){
        setSelecionadocarg(event.target.value)
    }
  
    function handleAloc(event){
        setSelecionadoaloc(event.target.value)
    }

    function handleInativa(event){
        setInativa(event.target.value)
    }



    function handleFile(e: ChangeEvent<HTMLInputElement>){

        console.log(e.target.files);
  
        if(!e.target.files){
            return;
        }
        const image = e.target.files[0];
  
  
        if(!image){
            return;
        }
        setAvatarUrl(URL.createObjectURL(e.target.files[0]))
  
        if(image.type == 'image/jpeg' || image.type == 'image/png'){
            setAvatar(image);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }
        

    }

    
    const customStyles = {
        content:{
            top: '50%',
            bottom: 'auto',
            left: '50%',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'var(--azul)',
        }
    }

    async function handleEditar(e:FormEvent) {
        e.preventDefault();
        try {
            const data = new FormData()
            if (!nome && !senha) {
                toast.warning('Para prosseguir digite atualize o nome e senha!')
                return;
            }
            data.append('id', colaborador.id)
            data.append('nome',nome)
            data.append('senha', senha)
            data.append('file',imageAvatar )

            data.append('estrutura_id', estr[estrutSelecionado].id)
            data.append('cargo_id', carg[cargSelecionado].id)
            data.append('alocacao_id',aloc[alocSelecionado].id)

            if (inativaSelecionado == 2) {
                data.append('status', 'falso')
            }else{
                data.append('status', 'verdadeiro')
            }

            
            console.log(data )

            const response = await api.put('/atualizacolaborador',data)


            onRequestClose()

            toast.success("Colaborador editado com sucesso!");

            setNome('')
            setSenha('')

            
            
        } catch (error) {
            toast.error(error)
        }
    }

    
    return(        
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <button
            type="button"
            onClick={onRequestClose}
            className="react-modal-close"
            style={{background: 'transparent', border:0}}
            >
                <FiX size={45} color="red"/>
            </button>

            <div className={styles.container}>
                <h3>Editar informações Colaborador</h3>
                    <span className={styles.containerTitulo}>Matricula: {colaborador.matricula}</span>
                    <span className={styles.containerMensagem}>Nome: {colaborador.nome}</span>

                      <form className={styles.form} onSubmit={handleEditar}>                 
                        <label className={styles.label}>
                            <span>
                                <AiOutlineCamera size={25} color="var(--azul2)"/>
                            </span>

                            <input type="file" accept="image/jpeg, image/png" onChange={handleFile}/>
                            {avatarUrl &&(
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                    className={styles.preview}
                                    src={avatarUrl} 
                                    alt="imagem image"
                                    width={100}
                                    height={100}
                                />
                            )}
                        </label>

                        <input 
                            type="text" 
                            placeholder='Digite o Nome'
                            className={styles.input}
                            onChange = {(e) => setNome(e.target.value)}
                        />

                        
                        <input 
                            type="password" 
                            placeholder='Digite a nova senha'
                            className={styles.input}
                            value={senha}
                            onChange = {(e) => setSenha(e.target.value)}
                        />

                        <h3>Selecione a estrutura organizacional do colaborador</h3>
                        <select className={styles.select} value={estrutSelecionado} onChange={handleEstr}>
                            {estruturamentolist.map( (item, index)=> {
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.UnidadeOrg}
                                        </option>
                                    )
                                })}
                        </select>
                        <h3>Selecione o cargo do colaborador</h3>
                        <select className={styles.select} value={cargSelecionado} onChange={handleCarg}>
                            {cargolist.map( (item, index)=> {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.descricao}
                                    </option>
                                )
                            })}
                        </select>

                        <h3>Selecione o centro de custo de alocação do colaborador</h3>
                        <select className={styles.select} value={alocSelecionado} onChange={handleAloc}>
                            {alocacaolist.map( (item, index)=> {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.desc_custo}
                                    </option>
                                )
                            })}
                        </select>
                        <h3>Inativar</h3>
                        <select className={styles.select} value={inativaSelecionado} onChange={handleInativa}>
                            <option value={1}>
                                Nao
                            </option>
                            <option value={2}>
                                Sim
                            </option>
                        </select>
               

                        <button type='submit' style={{background: 'transparent', border:0, marginTop:'0.8rem'}}>
                           <BiEdit size={45} color="blue" />
                        </button>
                    </form>             
               
                </div>



        </Modal>
    )

}


export const getServerSideProps = canSSRAuth (async (ctx)=>{
    const apiCliente = setupAPIClient(ctx);
    
    const estrutura = await apiCliente.get('/consultaestrutura')
    const cargo = await apiCliente.get('/consultacargo')
    const alocacao = await apiCliente.get('/consultaalocacao')



    return {
        props: {
            estruturamentolist: estrutura.data,
            cargolist: cargo.data,
            alocacaolist:alocacao.data
        }
    }
})
