import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ProductContext } from '../context/ProductContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setProducts } = useContext(ProductContext);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  // Cargar datos del producto si se está editando
  useEffect(() => {
    if (id) {
      // Verifica si el producto existe localmente
      const localProduct = products.find((product) => product.id === id);
      if (localProduct) {
        setTitle(localProduct.title);
        setPrice(localProduct.price);
      } else {
        // Si no está en el estado local, intenta buscarlo en la API
        axios.get(`https://dummyjson.com/products/${id}`)
          .then((response) => {
            setTitle(response.data.title);
            setPrice(response.data.price);
          })
          .catch(() => Swal.fire('Error', 'No se pudo cargar el producto', 'error'));
      }
    }
  }, [id, products]);

  // Manejo del formulario para agregar o editar producto
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const product = { title, price };
  
    // Verifica si es un producto local (ID generado localmente)
    const isLocalProduct = typeof id === 'string'; // Consideramos que IDs locales son cadenas
  
    if (isLocalProduct) {
      // Actualiza el producto directamente en el estado local
      setProducts((prev) =>
        prev.map((prod) => (prod.id === id ? { ...prod, ...product } : prod))
      );
  
      Swal.fire('Éxito', 'Producto actualizado', 'success');
      navigate('/products');
      return; // Finaliza aquí si es un producto local
    }
  
    // Solicitud para productos existentes en la API
    const request = id
      ? axios.put(`https://dummyjson.com/products/${id}`, product)
      : axios.post('https://dummyjson.com/products/add', product);
  
    request
      .then((response) => {
        const updatedProduct = response.data;
  
        if (id) {
          setProducts((prev) =>
            prev.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
          );
        } else {
          setProducts((prev) => [
            ...prev,
            { ...updatedProduct, id: Math.random().toString(36).substring(2, 9) },
          ]);
        }
  
        Swal.fire('Éxito', 'Producto guardado con éxito', 'success');
        navigate('/products');
      })
      .catch(() => Swal.fire('Error', 'No se pudo guardar el producto', 'error'));
  };

  
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          {/* Título Dinámico */}
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            {id ? "Editar Producto" : "Crear Producto"}
          </h1>
    
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Título del Producto */}
            <div>
              <label
                className="block text-gray-600 font-medium mb-2"
                htmlFor="title"
              >
                Título del Producto
              </label>
              <input
                type="text"
                id="title"
                placeholder="Ingrese el título del producto"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-400"
              />
            </div>
    
            {/* Campo Precio */}
            <div>
              <label
                className="block text-gray-600 font-medium mb-2"
                htmlFor="price"
              >
                Precio
              </label>
              <input
                type="number"
                id="price"
                placeholder="Ingrese el precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-400"
              />
            </div>
    
            {/* Botón de Guardar */}
            <button
              type="submit"
              className="w-full text-white bg-[#24292F] hover:bg-[#24292F]/90 font-medium py-2 rounded-lg transition duration-200"
            >
              {id ? "Actualizar Producto" : "Guardar Producto"}
            </button>
          </form>
        </div>
      </div>
    );
};

export default ProductForm;
