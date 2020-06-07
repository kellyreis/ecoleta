import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import Axios from 'axios';
import Dropzone from '../../components/dropzone';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}
interface IBGECityResponse {
    nome: string;
}
const CreatePoint = () => {
    const [initionPosition, setinitionPositionPosition] = useState<[number, number]>([0, 0]);
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUFs] = useState<string[]>([]);
    const [selectedUF, setSelectedUf] = useState('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setselectedCity] = useState('0');
    const [selectedPosition, setselectedPosition] = useState<[number, number]>([0, 0]);
    const [setectedItens, setsetectedItens] = useState<number[]>([]);
    const [formData, setformData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const [selectedFileUrl, setselectedFileUrl] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setinitionPositionPosition([latitude, longitude]);
        })
    }, [])


    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);


    useEffect(() => {

        //Pega APi do Ibge Estados
        Axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {

            const ufInitials = response.data.map(uf => uf.sigla);
            setUFs(ufInitials);

        });
    }, []);


    useEffect(() => {
        //Carregar as cidades sempre que a UF mudar
        if (selectedUF === '0') {
            return;
        }
        Axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
            .then(response => {

                const cityNames = response.data.map(city => city.nome);
                setCities(cityNames);

            });

    }, [selectedUF]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setselectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setselectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }


    function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target;
        setformData({
            ...formData, [name]: value
        });
    }


    function handleSelectItem(id: number) {

        const alreadySelected = setectedItens.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = setectedItens.filter(item => item !== id);

            setsetectedItens(filteredItems);
        }
        else {
            setsetectedItens([

                ...setectedItens, id
            ]);
        }

    }


    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = setectedItens;

        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('city', city);
        data.append('uf', uf);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(',')); 

        if (selectedFileUrl) {
            data.append('image', selectedFileUrl);
        }
        await api.post('points', data);

        history.push('/cadastrado-com-sucesso');

    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"></img>
                <Link to="/">
                    <FiArrowLeft />  Voltar para Home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1> Cadastro do <br /> ponto de coleta</h1>

                <Dropzone

                    onFileUploaded={setselectedFileUrl}

                />


                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={HandleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={HandleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={HandleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço do mapa</span>
                    </legend>
                    <Map onClick={handleMapClick} center={initionPosition} zoom={15}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select value={selectedUF} onChange={handleSelectUf} name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select value={selectedCity}
                                onChange={handleSelectCity}
                                name="city"
                                id="city">
                                <option value="0">Selecione uma cidade</option>

                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>ítens de coleta</h2>
                        <span>Selecione um ou mais intens abaixo</span>
                    </legend>
                    <ul className="items-grid">

                        {
                            items.map(item => (<li key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={setectedItens.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title} </span>
                            </li>))
                        }
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
};

export default CreatePoint;