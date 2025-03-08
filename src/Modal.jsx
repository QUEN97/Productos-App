import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        {/* Boton para cerrar el odal */}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 float-right"
        >
          ✖
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
