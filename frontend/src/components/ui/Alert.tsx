import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = ''
}) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const Icon = icons[type];

  return (
    <div className={`rounded-md p-4 border ${styles[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          {children && (
            <div className="mt-2 text-sm">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
