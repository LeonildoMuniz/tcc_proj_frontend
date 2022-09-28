import Modal from 'react-modal'
import styles from './styles.module.scss'

import {FiUpload, FiX} from 'react-icons/fi'
import {MdDeleteForever} from 'react-icons/md'
import {BiEdit} from 'react-icons/bi'
import {MensagensProps} from '../../pages/listarmensagem/index'
import { ChangeEvent, FormEvent, useState } from 'react';
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'
import { api } from '../../services/apiClient'

interface ModalPropos{
    isOpen: boolean;
    onRequestClose: ()=>void;
    mensagem;
}



export function ModalUser({isOpen,onRequestClose,mensagem}:ModalPropos){

    
    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setAvatar] = useState(null);   
    const [newTitulo, setTitulo] = useState('');
    const [newMensagem, setMensagem] = useState('');


    function handleFile(e: ChangeEvent<HTMLInputElement>){


        if(!e.target.files){
            return;
        }
        const image = e.target.files[0];
        console.log(image)

        if(!image){
            return;
        }
        setAvatarUrl(URL.createObjectURL(e.target.files[0]))

        if(image.type == 'image/jpeg' || image.type == 'image/png' || image.type == 'application/pdf'){
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


    async function handleExcluir(id:string) {
        const apiCliente = setupAPIClient();

        const response = await apiCliente.delete('/removeinfo',{
            params:{
                id:id
            }
        })
        
        onRequestClose();
        toast.success("Mensagem excluida com sucesso!");
    }

    async function handleEditar(e:FormEvent) {
        e.preventDefault();
        try{
            const data = new FormData();

            if(!newTitulo && !newMensagem){
                return;
            }

            if(!newTitulo || !newMensagem ){
                toast.warning("Para processegui é preciso preencher os campos titulo e mensagem")
                return;
            }


            data.append('id',mensagem.id);
            data.append('titulo',newTitulo);
            data.append('mensagem',newMensagem);
            data.append('file',imageAvatar);


            console.log(data);
            const response = await api.put('/atualizainfo',data)

            onRequestClose();
            toast.success("Mensagem editada com sucesso!");

            setAvatar('');
            setAvatarUrl('');
            setMensagem('');
            setTitulo('');

        }catch(er){
            toast.error("Erro ao editar mensagem")
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
                <h2>Detalhe mensagem</h2>
                    <span className={styles.containerTitulo}>Titulo: {mensagem.titulo}</span>
                    <span className={styles.containerMensagem}>Mensagem: {mensagem.mensagem}</span>
                
                <h2>Editar mensagem</h2>
                <form onSubmit={handleEditar}>
                    <input 
                        className={styles.input} 
                        type="text" 
                        placeholder='Editar Titulo' 
                        value={newTitulo}
                        onChange = {(e) => setTitulo(e.target.value)}
                    />
                    <input 
                        className={styles.input} 
                        type="text" 
                        placeholder='Editar Mensagem' 
                        value={newMensagem}
                        onChange = {(e) => setMensagem(e.target.value)}
                    />
                    <label className={styles.label}>
                                <span>
                                    <FiUpload size={25} color="var(--azul2)"/>
                                </span>
                                <input type="file" accept="image/jpeg, image/png, application/pdf" onChange={handleFile}/>
                                {avatarUrl &&(
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        className={styles.preview}
                                        src={avatarUrl} 
                                        alt="imagem arquivo"
                                        width={150}
                                        height={150}
                                    />
                                )}
                            </label>

                    <div>
                        <button style={{background: 'transparent', border:0,marginLeft:'5rem'}} onClick={()=>handleExcluir(mensagem.id)} >
                          <MdDeleteForever size={45} color="red"/>
                        </button>

                        <button type='submit' style={{background: 'transparent', border:0, marginLeft:'5rem'}}>
                           <BiEdit size={45} color="blue" />
                        </button>
                    </div>

                    
                </form>

                </div>



        </Modal>
    )

}