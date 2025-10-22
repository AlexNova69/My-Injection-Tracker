import React from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onCancel}>
      <div className="bg-card dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md m-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">{title}</h2>
        </div>
        <div className="p-6">
            <p className="text-text-secondary dark:text-gray-300 mb-6">{message}</p>
            <div className="flex justify-end space-x-4">
                <button 
                  onClick={onCancel} 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Отмена
                </button>
                <button 
                  onClick={onConfirm} 
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Удалить
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;