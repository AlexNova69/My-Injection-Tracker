import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-card dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md m-auto relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={24} />
            </button>
        </div>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;