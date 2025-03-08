import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductForm = ({ product, onClose, setProducts }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] =useState('');

  // Cargar datos del producto si se está editando
  useEffect(() => {
    //console.log('producto recibido:', product);
    if (product) {
      setTitle(product.title);
      setPrice(product.price);
    } else {
      // Resetear los campos si es para creación
      setTitle('');
      setPrice('');
    }
  }, [product]);

  // Manejo del formulario para agregar o editar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      title,
      price: parseFloat(price),
    };

    try {
      if (product) {
        // Verifica si es un producto local o de la API
        const isLocalProduct = typeof product.id === 'string';

        if (isLocalProduct) {
          // Actualizar producto localmente
          setProducts((prev) =>
            prev.map((prod) =>
              prod.id === product.id ? { ...prod, ...newProduct } : prod
            )
          );
          Swal.fire('Éxito', 'Producto actualizado localmente', 'success');
        } else {
          // Actualizar producto en la API
          const response = await axios.put(
            `https://dummyjson.com/products/${product.id}`,
            newProduct
          );
          setProducts((prev) =>
            prev.map((prod) => (prod.id === product.id ? response.data : prod))
          );
          Swal.fire('Éxito', 'Producto actualizado', 'success');
        }
      } else {
        // Crear producto nuevo
        const response = await axios.post(
          'https://dummyjson.com/products/add',
          newProduct
        );
        setProducts((prev) => [
          ...prev,
          { ...response.data, id: Math.random().toString(36).substring(2, 9) }, // ID local
        ]);
        Swal.fire('Éxito', 'Producto creado', 'success');
      }
      onClose(); // Cerrar el modal
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el producto', 'error');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Envabezado */}
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        {product ? 'Editar Producto' : 'Crear Producto'}
      </h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título del Producto */}
        <div>
          <label className="block text-gray-600 font-medium mb-2" htmlFor="title">
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

        {/* Precio */}
        <div>
          <label className="block text-gray-600 font-medium mb-2" htmlFor="price">
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

        {/* Guardar */}
        <button
          type="submit"
          className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white font-medium py-2 rounded-lg transition duration-200"
        >
          {product ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
