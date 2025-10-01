import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import { AlertTriangle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'date' | 'textarea';
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  required?: boolean;
  rows?: number;
  'aria-invalid'?: boolean;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  required,
  rows,
  'aria-invalid': ariaInvalid,
}: FormFieldProps) {
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="flex items-center gap-1">
        {label}
        {required && <span className="text-[var(--danger)]">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          aria-invalid={ariaInvalid}
          aria-describedby={error ? errorId : undefined}
          className={error ? 'border-[var(--danger)] focus-visible:border-[var(--danger)]' : ''}
        />
      ) : (
        <Input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={ariaInvalid}
          aria-describedby={error ? errorId : undefined}
          className={error ? 'border-[var(--danger)] focus-visible:border-[var(--danger)]' : ''}
        />
      )}
      
      {error && (
        <div id={errorId} className="flex items-center gap-1 text-sm text-[var(--danger)]">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}