const API_URL = 'http://localhost:8086/api/v1/produto';
const FABRICANTE_URL = 'http://localhost:8086/api/v1/fabricante';

export const fetchProdutos = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar os produtos:', error);
    throw error;
  }
};

export const fetchFabricantes = async () => {
  try {
    const response = await fetch(FABRICANTE_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar os fabricantes:', error);
    throw error;
  }
};

export const updateProduto = async (produtoId, produtoData) => {
    const response = await fetch(`http://localhost:8086/api/v1/produto/${produtoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'JSESSIONID=3052417C9A9128C217D14609AF8FA38C'
      },
      body: JSON.stringify(produtoData)
    });
  
    return response; // Retorna a resposta completa da requisição
  };

  
  
export const deleteProduto = async (produtoId) => {

    const response = await fetch(`${API_URL}/${produtoId}`, {
      method: 'DELETE',

    });
    
    return response;
 
};



export const createProduto = async (produtoData) => {

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoData),
      });
  
      return response;
  };
  