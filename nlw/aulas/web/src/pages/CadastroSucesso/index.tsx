import React from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import iconCheck from '../../assets/sucess.svg';

const CadastradoComSucesso = () => {

    const history = useHistory();
    
    function redirectPageHome(){

        window.setTimeout(() => {
            history.push('/');
         }, 2000);
    }

    return (
        <div onLoad={redirectPageHome} className="page-cadastrado">
            <img src={iconCheck} alt="Cadastrado com sucesso"></img>
            <h1>Cadastro concluído!</h1>
        </div>
    );
};

export default CadastradoComSucesso;
