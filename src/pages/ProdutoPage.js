import React, { useEffect, useState } from 'react';
import { fetchProdutos, fetchFabricantes, updateProduto, deleteProduto, createProduto } from '../services/produtoService'; 
import { FaEdit, FaTrashAlt, FaFilter } from 'react-icons/fa'; 
import { Button, Offcanvas, Pagination, Modal, Form, Spinner, Toast } from 'react-bootstrap';
import { useTable, useFilters, usePagination } from 'react-table'; 

function FabricantesPage() {
  const [produtos, setProdutos] = useState([]); 
  const [fabricantes, setFabricantes] = useState([]); 
  const [showFilters, setShowFilters] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false); 

  const [filterValues, setFilterValues] = useState({
    produtoId: '',
    produtoNome: '',
    codigoBarras: '',
    fabricanteNome: '',
  });

  const [newProduct, setNewProduct] = useState({
    nome: '',
    codigoBarras: '',
    fabricanteId: '',
  });

  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(8); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(true); 
  const [toastMessage, setToastMessage] = useState(''); 
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const getProdutos = async () => {
      try {
        const data = await fetchProdutos(); 
        setProdutos(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage)); // Calcular número total de páginas
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };
    
    const getFabricantes = async () => {
      try {
        const data = await fetchFabricantes();
        setFabricantes(data); 
      } catch (error) {
        console.error('Erro ao buscar os fabricantes:', error);
      }
    };
    
    getProdutos();
    getFabricantes();
    setLoading(false); 
  }, []); 

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'produtoId',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Nome',
        accessor: 'produtoNome',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Código de Barras',
        accessor: 'codigoBarras',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Fabricante Nome',
        accessor: 'fabricanteNome', 
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
      data: produtos,
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
    setCurrentPage(1); // Resetar para a primeira página após aplicar filtros
  };

  const handleGlobalSearch = (e) => {
    const value = e.target.value;

    setFilterValues((prevValues) => {
      const updatedFilters = {};
      Object.keys(prevValues).forEach((key) => {
        updatedFilters[key] = value; 
      });
      return updatedFilters;
    });

    Object.keys(filterValues).forEach((columnId) => {
      setFilter(columnId, value || undefined); 
    });
    setCurrentPage(1); // Resetar para a primeira página após busca global
  };

  // Lógica de paginação
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = produtos.slice(indexOfFirstProduct, indexOfLastProduct);

  // Funções de modais de edição e exclusão
  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleEdit = async () => {
    try {
      const response = await updateProduto(selectedProduct.produtoId, {
        nome: selectedProduct.produtoNome,
        codigoBarras: selectedProduct.codigoBarras,
        fabricanteId: selectedProduct.fabricanteId,
      });
  
      if (response.status === 200) {
        setToastMessage('Produto atualizado com sucesso!');
        setShowToast(true);
        setShowModal(false);
        setProdutos(produtos.map(product => 
          product.produtoId === selectedProduct.produtoId ? selectedProduct : product
        ));
      } else {
        setToastMessage('Erro ao editar o produto');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro ao editar o produto');
      setShowToast(true);
      console.error('Erro ao editar produto:', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const response = await deleteProduto(selectedProduct.produtoId);
      if (response.status === 200) {
        setToastMessage('Produto excluído com sucesso!');
        setShowToast(true);
        setShowModal(false);
        setProdutos(produtos.filter(product => product.produtoId !== selectedProduct.produtoId));
      } else {
        setToastMessage('Erro ao excluir o produto');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro ao excluir o produto');
      setShowToast(true);
      console.error('Erro ao excluir produto:', error);
    }
  };

  const handleCreate = async () => { 
    try {
      const response = await createProduto(newProduct);
      if (response.status === 201) {
        const data = await fetchProdutos(); 
        setProdutos(data);
        setToastMessage('Produto criado com sucesso!');
        setShowToast(true);
        setShowCreateModal(false);
      } else {
        setToastMessage('Erro ao criar o produto');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro ao criar o produto');
      setShowToast(true);
      console.error('Erro ao criar produto:', error);
    }
  };

  // Alterar a página atual
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      <h2>Prosutos</h2>

      <div style={{ display: 'flex', justifyContent: 'end', gap:'12px' }}>
        <Button variant="primary" className="bt-filtra" onClick={toggleFilters}>
          <FaFilter /> Filtros
        </Button>

        <Button variant="outline-primary" className="bt-filtra" onClick={() => setShowCreateModal(true)}>Novo Produto</Button>

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
          <Modal.Title>Editar ou Excluir Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form>
              <Form.Group controlId="produtoId">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.produtoId}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="produtoNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.produtoNome}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, produtoNome: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="codigoBarras">
                <Form.Label>Código de Barras</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.codigoBarras}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, codigoBarras: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="fabricanteNome">
                <Form.Label>Fabricante Nome</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProduct.fabricanteId || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, fabricanteId: e.target.value })}
                >
                  <option value="">Selecione um fabricante</option>
                  {fabricantes.map(fabricante => (
                    <option key={fabricante.id} value={fabricante.id}>
                      {fabricante.nome}
                    </option>
                  ))}
                </Form.Control>
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

      {/* Modal para Novo Produto */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Criar Novo Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.nome}
                onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="codigoBarras">
              <Form.Label>Código de Barras</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.codigoBarras}
                onChange={(e) => setNewProduct({ ...newProduct, codigoBarras: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="fabricanteId">
              <Form.Label>Fabricante</Form.Label>
              <Form.Control
                as="select"
                value={newProduct.fabricanteId}
                onChange={(e) => setNewProduct({ ...newProduct, fabricanteId: e.target.value })}
              >
                <option value="">Selecione um fabricante</option>
                {fabricantes.map(fabricante => (
                  <option key={fabricante.id} value={fabricante.id}>
                    {fabricante.nome}
                  </option>
                ))}
              </Form.Control>
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
