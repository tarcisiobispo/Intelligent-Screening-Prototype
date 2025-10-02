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
  message: string;
}

export function validateField(value: string, rules: ValidationRule): ValidationResult {
  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    const message = 'Este campo é obrigatório';
    return { isValid: false, error: message, message };
  }

  // Skip other validations if field is empty and not required
  if (!value && !rules.required) {
    return { isValid: true, error: null, message: '' };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    const message = `Mínimo ${rules.minLength} caracteres`;
    return { isValid: false, error: message, message };
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    const message = `Máximo ${rules.maxLength} caracteres`;
    return { isValid: false, error: message, message };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    const message = 'Formato inválido';
    return { isValid: false, error: message, message };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError, message: customError };
    }
  }

  return { isValid: true, error: null, message: '' };
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
      const message = 'Tipo de arquivo não permitido. Use PDF, imagens ou documentos Word.';
      return { isValid: false, error: message, message };
    }

    // Size validation
    if (file.size > fileValidation.maxSize) {
      const message = `Arquivo muito grande. Máximo ${fileValidation.maxSize / 1024 / 1024}MB.`;
      return { isValid: false, error: message, message };
    }

    // Name validation
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(file.name)) {
      const message = 'Nome do arquivo contém caracteres inválidos.';
      return { isValid: false, error: message, message };
    }

    return { isValid: true, error: null, message: '' };
  }
};