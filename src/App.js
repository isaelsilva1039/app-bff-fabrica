import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import FabricantesPage from './pages/FabricantesPage';
import ProdutoPage from './pages/ProdutoPage';

function App() {
  const [key, setKey] = useState('fabricantes');

  return (
    <BrowserRouter>  
      <Menu />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<FabricantesPage />} />
          <Route path="/produto" element={<ProdutoPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
