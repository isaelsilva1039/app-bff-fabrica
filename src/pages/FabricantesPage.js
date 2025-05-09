import React, { useEffect, useState } from 'react';
import { fetchFabricantes, updateFabricante, deleteFabricante, createFabricante } from '../services/fabricanteService'; 
import { FaEdit, FaTrashAlt, FaFilter } from 'react-icons/fa'; 
import { Button, Offcanvas, Pagination, Modal, Form, Spinner, Toast } from 'react-bootstrap';
import { useTable, useFilters, usePagination } from 'react-table'; 

function FabricantesPage() {
  const [fabricantes, setFabricantes] = useState([]); 
  const [showFilters, setShowFilters] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [selectedFabricante, setSelectedFabricante] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [filterValues, setFilterValues] = useState({
    fabricanteNome: '',
    cnpj: '',
  });

  const [newFabricante, setNewFabricante] = useState({
    nome: '',
    cnpj: '',
  });

  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(8); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(true); 
  const [toastMessage, setToastMessage] = useState(''); 
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const getFabricantes = async () => {
      try {
        const data = await fetchFabricantes(); 
        setFabricantes(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error('Erro ao buscar os fabricantes:', error);
      }
    };
    
    getFabricantes();
    setLoading(false); 
  }, []); 

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Nome',
        accessor: 'nome',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'CNPJ',
        accessor: 'cnpj',
        Filter: DefaultColumnFilter,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter, 
  } = useTable(
    {
      columns,
      data: fabricantes,
    },
    useFilters,
    usePagination
  );

  const toggleFilters = () => setShowFilters(!showFilters); 

  const handleFilterChange = (e, columnId) => {
    const value = e.target.value;
    setFilter(columnId, value || undefined);
    setFilterValues(prevValues => ({
      ...prevValues,
      [columnId]: value,
    }));
  };
  
  const applyFilters = () => {
    Object.keys(filterValues).forEach(columnId => {
      setFilter(columnId, filterValues[columnId] || undefined);
    });
    setShowFilters(false); 
    setCurrentPage(1); 
  };



  const indexOfLastFabricante = currentPage * itemsPerPage;
  const indexOfFirstFabricante = indexOfLastFabricante - itemsPerPage;
  const currentFabricantes = fabricantes.slice(indexOfFirstFabricante, indexOfLastFabricante);


  const handleRowClick = (fabricante) => {
    setSelectedFabricante(fabricante);
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFabricante(null);
  };

  const handleEdit = async () => {
    try {
      const response = await updateFabricante(selectedFabricante.id, {
        nome: selectedFabricante.nome,
        cnpj: selectedFabricante.cnpj,
      });
  
      if (response.status === 200) {
        setToastMessage('Fabricante atualizado com sucesso!');
        setShowToast(true);
        setShowModal(false);
        setFabricantes(fabricantes.map(fabricante => 
          fabricante.id === selectedFabricante.id ? selectedFabricante : fabricante
        ));
      } else {
        setToastMessage('Erro ao editar o fabricante');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro ao editar o fabricante');
      setShowToast(true);
      console.error('Erro ao editar fabricante:', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const response = await deleteFabricante(selectedFabricante.id);
      if (response.status === 200) {
        setToastMessage('Fabricante excluído com sucesso!');
        setShowToast(true);
        setShowModal(false);
        setFabricantes(fabricantes.filter(fabricante => fabricante.id !== selectedFabricante.id));
      } else {
        setToastMessage('Fabricante tem produtos vinculados a ele ');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro ao excluir o fabricante');
      setShowToast(true);
      console.error('Erro ao excluir fabricante:', error);
    }
  };

  const handleCreate = async () => { 
    try {
      const response = await createFabricante(newFabricante);
      if (response.status === 201) {
        const data = await fetchFabricantes(); 
        setFabricantes(data);
        setToastMessage('Fabricante criado com sucesso!');
        setShowToast(true);
        setShowCreateModal(false);
      } else {
        setToastMessage('Erro ao criar o fabricante');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro ao criar o fabricante');
      setShowToast(true);
      console.error('Erro ao criar fabricante:', error);
    }
  };

  // Alterar a página atual
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      <h2>Fabricantes</h2>

      <div style={{ display: 'flex', justifyContent: 'end', gap:'12px' }}>

        <Button variant="primary" className="bt-filtra" onClick={toggleFilters}>
          <FaFilter /> Filtros
        </Button>

        <Button variant="outline-primary" className="bt-filtra" onClick={() => setShowCreateModal(true)}>Novo Fabricante</Button>

      </div>

      <Offcanvas show={showFilters} onHide={toggleFilters} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filtros</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="filters-row">
              {headerGroup.headers.map(column => (
                <div className="filter-column" key={column.id}>
                  {column.render('Header')}
                  <div className="filter-container">
                    {column.canFilter ? (
                      <input
                        value={filterValues[column.id] || ''}
                        onChange={(e) => handleFilterChange(e, column.id)}
                        placeholder={`Filtrar...`}
                        className="filter-input"
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <Button variant="success" onClick={applyFilters}>Filtrar</Button>
        </Offcanvas.Body>
      </Offcanvas>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="table-header">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index} className="table-row" onClick={() => handleRowClick(row.original)}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="table-cell">{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="pagination-controls">
        <Pagination>
          <Pagination.Prev 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item 
              key={i} 
              active={i + 1 === currentPage} 
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar ou Excluir Fabricante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFabricante && (
            <Form>
              <Form.Group controlId="fabricanteId">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedFabricante.id}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="fabricanteNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedFabricante.nome}
                  onChange={(e) => setSelectedFabricante({ ...selectedFabricante, nome: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="fabricanteCnpj">
                <Form.Label>CNPJ</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedFabricante.cnpj}
                  onChange={(e) => setSelectedFabricante({ ...selectedFabricante, cnpj: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FaTrashAlt /> Excluir
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            <FaEdit /> Editar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Novo Fabricante */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Criar Novo Fabricante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={newFabricante.nome}
                onChange={(e) => setNewFabricante({ ...newFabricante, nome: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="cnpj">
              <Form.Label>CNPJ</Form.Label>
              <Form.Control
                type="text"
                value={newFabricante.cnpj}
                onChange={(e) => setNewFabricante({ ...newFabricante, cnpj: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Fechar</Button>
          <Button variant="primary" onClick={handleCreate}>Criar</Button>
        </Modal.Footer>
      </Modal>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: 'absolute', top: 20, right: 20 }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
}

const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <input
      value={filterValue || ''}
      onChange={e => setFilter(e.target.value || undefined)}
      placeholder={`Filtrar...`}
      className="filter-input"
    />
  );
};

export default FabricantesPage;
