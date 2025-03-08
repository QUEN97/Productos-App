import React, { useState } from 'react';
import reactLogo from '../assets/react.svg'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
      });

      Swal.fire('Éxito', 'Inicio de sesión exitoso', 'success');
      localStorage.setItem('token', response.data.token); // Guarda el token en localStorage
      navigate('/products'); // Redirige a productos
    } catch (error) {
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
        <img src={reactLogo} className="w-24 h-24 logo react" alt="React logo" />
        </div>
  
        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Iniciar Sesión
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo de Usuario */}
            <div>
              <label
                className="block text-gray-600 font-medium mb-2"
                htmlFor="username"
              >
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                placeholder="Ingrese su nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-400"
              />
            </div>
  
            {/* Campo de Contraseña */}
            <div>
              <label
                className="block text-gray-600 font-medium mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-400"
              />
            </div>
  
            {/* Botón */}
            <button
              type="submit"
              className="w-full text-white bg-[#24292F] hover:bg-[#24292F]/90  font-medium py-2 rounded-lg transition duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default Login;
