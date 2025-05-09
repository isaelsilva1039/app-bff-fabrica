import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importando as funções de navegação do React Router
import Menu from './components/Menu'; // Importando o Menu
import FabricantesPage from './pages/FabricantesPage'; // Página de Fabricantes
import ProdutoPage from './pages/ProdutoPage'; // Página de Produto

function App() {
  const [key, setKey] = useState('fabricantes'); // Estado para a tab ativa

  return (
    <BrowserRouter>  {/* Envolvendo a aplicação com BrowserRouter para habilitar as rotas */}
      {/* Menu de Navegação */}
      <Menu />

      <div className="container mt-4">
        <Routes>
          <Route path="/fabricantes" element={<FabricantesPage />} /> {/* Rota para Fabricantes */}
          <Route path="/produto" element={<ProdutoPage />} /> {/* Rota para Produto */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
