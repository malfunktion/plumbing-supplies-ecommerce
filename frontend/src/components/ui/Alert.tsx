import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface AlertProps {
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  onClose?: () => void;
}

const alertStyles = {
  error: 'bg-red-50 text-red-800',
  warning: 'bg-yellow-50 text-yellow-800',
  success: 'bg-green-50 text-green-800',
  info: 'bg-blue-50 text-blue-800'
};

const iconStyles = {
  error: 'text-red-400',
  warning: 'text-yellow-400',
  success: 'text-green-400',
  info: 'text-blue-400'
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  onClose
}) => {
  return (
    <div className={`rounded-md p-4 ${alertStyles[type]}`}>
      <div className="flex">
        <div className="flex-1">
          <p className="text-sm font-medium">
            {title}
          </p>
        </div>
        {onClose && (
          <div className="ml-3">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 ${iconStyles[type]} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
