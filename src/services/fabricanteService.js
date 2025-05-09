const FABRICANTE_URL = 'http://localhost:8086/api/v1/fabricante';

// Função para buscar os fabricantes
export const fetchFabricantes = async () => {
  try {
    const response = await fetch(FABRICANTE_URL, {
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
    console.error('Erro ao buscar os fabricantes:', error);
    throw error;
  }
};

// Função para criar um fabricante
export const createFabricante = async (fabricanteData) => {
  try {
    const response = await fetch(FABRICANTE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'JSESSIONID=3052417C9A9128C217D14609AF8FA38C',
      },
      body: JSON.stringify(fabricanteData),
    });

    return response;
  } catch (error) {
    console.error('Erro ao criar o fabricante:', error);
    throw error;
  }
};

// Função para atualizar um fabricante
export const updateFabricante = async (fabricanteId, fabricanteData) => {
  try {
    const response = await fetch(`${FABRICANTE_URL}/${fabricanteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fabricanteData),
    });


    return response;
    
  } catch (error) {
    console.error('Erro ao atualizar o fabricante:', error);
    throw error;
  }
};

// Função para deletar um fabricante
export const deleteFabricante = async (fabricanteId) => {
  try {
    const response = await fetch(`${FABRICANTE_URL}/${fabricanteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });


    return response;

  } catch (error) {
    console.error('Fabricante contem produtos vinculados a ele ', error);
    throw error;
  }
};
