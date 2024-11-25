import React from 'react';

interface RadioOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {options.map((option) => (
        <div key={option.id} className="flex items-center">
          <input
            id={option.id}
            name={name}
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={option.id} className="ml-3">
            <span className="block text-sm font-medium text-gray-700">
              {option.label}
            </span>
            {option.description && (
              <span className="block text-sm text-gray-500">
                {option.description}
              </span>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};
