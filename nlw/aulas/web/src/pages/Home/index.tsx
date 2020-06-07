import React from 'react';
import './styles.css';
import {Link} from 'react-router-dom';
import logo from '../../assets/logo.svg';
import {FiLogIn} from 'react-icons/fi';
const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"></img>
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                    <Link to="/create-point">
                        <span><FiLogIn /></span>
                        <strong>Cadastres um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}
export default Home;