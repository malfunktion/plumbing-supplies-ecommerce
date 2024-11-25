import React from 'react';

interface RadioOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options
}) => {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div
          key={option.id}
          className={`relative flex items-start p-4 cursor-pointer rounded-lg border ${
            value === option.value
              ? 'border-primary-500 ring-2 ring-primary-500'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange(option.value)}
        >
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900">
              {option.label}
            </div>
            {option.description && (
              <div className="mt-1 text-sm text-gray-500">
                {option.description}
              </div>
            )}
          </div>
          <div className="ml-3 flex h-5 items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
