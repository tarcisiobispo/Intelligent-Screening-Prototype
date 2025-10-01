export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateField(value: string, rules: ValidationRule): ValidationResult {
  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    return { isValid: false, error: 'Este campo é obrigatório' };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return { isValid: true };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return { 
      isValid: false, 
      error: `Mínimo de ${rules.minLength} caracteres` 
    };
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return { 
      isValid: false, 
      error: `Máximo de ${rules.maxLength} caracteres` 
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: 'Formato inválido' };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true };
}

export const validationRules = {
  taskTitle: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  taskDescription: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  date: {
    required: true,
    custom: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        return 'A data não pode ser anterior a hoje';
      }
      return null;
    },
  },
  fileName: {
    required: true,
    minLength: 1,
    maxLength: 255,
    custom: (value: string) => {
      const invalidChars = /[<>:"/\\|?*]/;
      if (invalidChars.test(value)) {
        return 'Nome contém caracteres inválidos';
      }
      return null;
    },
  },
};