import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateField, ValidationRule, ValidationResult } from '../../lib/validation';

interface ValidatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidation?: (result: ValidationResult) => void;
  rules: ValidationRule;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  onBlur?: () => void;
}

export function ValidatedInput({
  label,
  value,
  onChange,
  onValidation,
  rules,
  placeholder,
  type = 'text',
  className = '',
  disabled = false,
  onBlur
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, error: null, message: '' });

  useEffect(() => {
    const result = validateField(value, rules);
    setValidation(result);
    onValidation?.(result);
  }, [value, rules, onValidation]);

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  const showError = touched && !validation.isValid;
  const showSuccess = touched && validation.isValid && value.length > 0;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-1">
        {label}
        {rules.required && (
          <span className="text-[var(--danger)] text-sm" aria-label="obrigatório">*</span>
        )}
      </Label>
      
      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`${className} ${
            showError ? 'border-[var(--danger)] focus:border-[var(--danger)]' : 
            showSuccess ? 'border-[var(--success)] focus:border-[var(--success)]' : ''
          } pr-10`}
          disabled={disabled}
          aria-invalid={showError}
          aria-describedby={showError ? `${label}-error` : undefined}
        />
        
        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {showError && (
            <AlertCircle className="w-4 h-4 text-[var(--danger)]" />
          )}
          {showSuccess && (
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {showError && (
        <p 
          id={`${label}-error`}
          className="text-xs text-[var(--danger)] flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="w-3 h-3" />
          {validation.message || validation.error}
        </p>
      )}
      
      {/* Success Message */}
      {showSuccess && rules.required && (
        <p className="text-xs text-[var(--success)] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Campo válido
        </p>
      )}
    </div>
  );
}