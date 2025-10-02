export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateField(value: string, rules: ValidationRule): ValidationResult {
  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    return { isValid: false, error: 'Este campo é obrigatório' };
  }

  // Skip other validations if field is empty and not required
  if (!value && !rules.required) {
    return { isValid: true, error: null };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, error: `Mínimo ${rules.minLength} caracteres` };
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, error: `Máximo ${rules.maxLength} caracteres` };
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

  return { isValid: true, error: null };
}

export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value.includes('@')) return 'Email deve conter @';
      return null;
    }
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
      return null;
    }
  },
  taskTitle: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  assignee: {
    required: true,
    minLength: 2
  }
};

export const fileValidation = {
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  maxSize: 50 * 1024 * 1024, // 50MB
  
  validateFile: (file: File): ValidationResult => {
    // Type validation
    if (!fileValidation.allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Tipo de arquivo não permitido. Use PDF, imagens ou documentos Word.' 
      };
    }

    // Size validation
    if (file.size > fileValidation.maxSize) {
      return { 
        isValid: false, 
        error: `Arquivo muito grande. Máximo ${fileValidation.maxSize / 1024 / 1024}MB.` 
      };
    }

    // Name validation
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(file.name)) {
      return { 
        isValid: false, 
        error: 'Nome do arquivo contém caracteres inválidos.' 
      };
    }

    return { isValid: true, error: null };
  }
};