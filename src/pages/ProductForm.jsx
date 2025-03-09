import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductForm = ({ product, onClose, setProducts }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] =useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  // Cargar datos del producto si se está editando
  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setPrice(product.price || '');
      setDescription(product.description || '');
      setCategory(product.category || '');
      setStock(product.stock || ''); 
    } else {
      // Resetear campos para creación
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
      setStock('');
    }
  }, [product]);

  // Manejo del formulario para agregar o editar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      title,
      price: parseFloat(price),
      description,
      category,
      stock: parseInt(stock, 10),
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
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-full md:max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
        {product ? 'Editar Producto' : 'Crear Producto'}
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
        <div className="md:col-span-2">
          <label className="block text-gray-600 font-medium mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        
        <div className="md:col-span-2">
          <label className="block text-gray-600 font-medium mb-2">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-2">Precio</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-2">Categoría</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>
        
        <div>
          <label className="block text-gray-600 font-medium mb-2">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>
        

        
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
