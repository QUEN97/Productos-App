import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      axios.get('https://dummyjson.com/products')
  .then((response) => {
    const cleanedProducts = response.data.products.map((product) => ({
      ...product,
      price: parseFloat(product.price) || 0,
    }));
    setProducts(cleanedProducts);
  })
  .catch((error) => console.error('Error al cargar productos iniciales:', error));

    }
  }, [isLoaded]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

