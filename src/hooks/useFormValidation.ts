import { useState, useCallback } from 'react';
import { validateField, ValidationRule, ValidationResult } from '../lib/validation';

export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export function useFormValidation(initialValues: Record<string, string>, schema: ValidationSchema) {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        touched: false,
      };
    });
    return state;
  });

  const validateSingleField = useCallback((name: string, value: string): ValidationResult => {
    const rules = schema[name];
    if (!rules) return { isValid: true };
    return validateField(value, rules);
  }, [schema]);

  const updateField = useCallback((name: string, value: string) => {
    setFormState(prev => {
      const validation = validateSingleField(name, value);
      return {
        ...prev,
        [name]: {
          value,
          touched: true,
          error: validation.isValid ? undefined : validation.error,
        },
      };
    });
  }, [validateSingleField]);

  const touchField = useCallback((name: string) => {
    setFormState(prev => {
      if (prev[name]?.touched) return prev;
      
      const validation = validateSingleField(name, prev[name]?.value || '');
      return {
        ...prev,
        [name]: {
          ...prev[name],
          touched: true,
          error: validation.isValid ? undefined : validation.error,
        },
      };
    });
  }, [validateSingleField]);

  const validateAll = useCallback(() => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(schema).forEach(name => {
      const value = formState[name]?.value || '';
      const validation = validateSingleField(name, value);
      
      if (!validation.isValid) {
        errors[name] = validation.error!;
        isValid = false;
      }
    });

    setFormState(prev => {
      const newState: FormState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = {
          ...prev[key],
          touched: true,
          error: errors[key],
        };
      });
      return newState;
    });

    return { isValid, errors };
  }, [formState, schema, validateSingleField]);

  const getFieldProps = useCallback((name: string) => {
    const field = formState[name];
    return {
      value: field?.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        updateField(name, e.target.value),
      onBlur: () => touchField(name),
      'aria-invalid': field?.touched && !!field?.error,
    };
  }, [formState, updateField, touchField]);

  const getFieldError = useCallback((name: string) => {
    const field = formState[name];
    return field?.touched ? field?.error : undefined;
  }, [formState]);

  const getValues = useCallback(() => {
    const values: Record<string, string> = {};
    Object.keys(formState).forEach(key => {
      values[key] = formState[key].value;
    });
    return values;
  }, [formState]);

  const isFormValid = Object.values(formState).every(field => !field.error);

  return {
    formState,
    updateField,
    touchField,
    validateAll,
    getFieldProps,
    getFieldError,
    getValues,
    isFormValid,
  };
}