import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
        if (products.length === 0) {
          axios.get('https://dummyjson.com/products')
            .then((response) => setProducts(response.data.products))
            .catch((error) => console.error('Error al cargar productos iniciales:', error));
        }
      }, [products]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
