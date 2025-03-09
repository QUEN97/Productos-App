import React, { useContext, useEffect, useState } from 'react';
import Modal from '../Modal'; 
import ProductForm from './ProductForm';
import { ProductContext } from '../context/ProductContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const Products = () => {
    const { products, setProducts } = useContext(ProductContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); //editar producto

    // paginación
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const totalPages = Math.ceil(products.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = products.slice(indexOfFirstRecord, indexOfLastRecord);

    useEffect(() => {
        if (products.length === 0) { // cargar productos 
            axios.get('https://dummyjson.com/products')
                .then((response) => setProducts(response.data.products))
                .catch(() => Swal.fire('Error', 'No se pudieron cargar los productos', 'error'));
        }
    }, [products, setProducts]);

    const deleteProduct = (id) => {
        const isLocalProduct = typeof id === 'string' && id.startsWith('b');

        if (isLocalProduct) {
            setProducts((prev) => prev.filter((product) => product.id !== id));
            Swal.fire('Eliminado', 'Producto eliminado localmente', 'success');
        } else {
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¡Esto no se podrá deshacer!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`https://dummyjson.com/products/${id}`)
                        .then(() => {
                            setProducts((prev) => prev.filter((product) => product.id !== id));
                            Swal.fire('Eliminado', 'Producto eliminado con éxito', 'success');
                        })
                        .catch(() => Swal.fire('Error', 'No se pudo eliminar el producto', 'error'));
                }
            });
        }
    };

    const openModal = (product = null) => {
        setSelectedProduct(product); // Si hay producto, significa que es para edición
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    //botones paginacion
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="p-12">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                {/* Encabezado */}
                <h1 className="text-3xl font-bold text-gray-800 uppercase text-center sm:text-left">
                    Productos
                </h1>

                {/* Botón para añadir producto */}
                {/* <Link
                    to="/products/new"
                    className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
                >
                    Añadir Producto
                </Link> */}
                <button
                    onClick={() => openModal()} 
                    className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
                >
                    Añadir Producto
                </button>
            </div>



            {/* Tabla */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs uppercase bg-[#24292F] dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3 text-left text-zinc-200 font-medium uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-zinc-200 font-medium uppercase">Precio</th>
                            <th className="px-6 py-3 text-left text-zinc-200 font-medium uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentRecords.map((product, index) => (
                            <tr
                                key={product.id}
                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="px-6 py-4 text-gray-800">{product.title}</td>
                                <td className="px-6 py-4 text-gray-800">{typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : 'Precio no disponible'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        {/* <Link
                                            to={`/products/edit/${product.id}`}
                                            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Editar
                                        </Link> */}
                                        <button
                                            onClick={() => openModal(product)} // Abrir modal para editar producto
                                            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Detalles
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {currentRecords.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white dark:bg-gray-800 space-y-3 p-4 rounded-lg shadow"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                {product.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Precio: ${product.price.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            {/* <Link
                                to={`/products/edit/${product.id}`}
                                className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Editar
                            </Link> */}
                            <button
                                onClick={() => openModal(product)} 
                                className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Detalles
                            </button>
                            <button
                                onClick={() => deleteProduct(product.id)}
                                className="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* botones paginacin */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
                >
                    Anterior
                </button>
                <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
                >
                    Siguiente
                </button>
            </div>
            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ProductForm
                    product={selectedProduct} 
                    onClose={closeModal}
                    setProducts={setProducts}
                />
            </Modal>

        </div>
    );

};

export default Products;
