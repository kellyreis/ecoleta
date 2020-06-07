
import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import CadastradoComSucesso from './pages/CadastroSucesso';
const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" />
      <Route component={CadastradoComSucesso} path="/cadastrado-com-sucesso" />
    </BrowserRouter>
  )
}

export default Routes