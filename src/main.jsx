import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductProvider from './context/ProductContext';
import './index.css';
import App from './App.jsx';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </BrowserRouter>
    </ProductProvider>
  </StrictMode>
);

