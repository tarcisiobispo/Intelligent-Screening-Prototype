export interface ErrorMessage {
  title: string;
  description: string;
  suggestion: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  helpLink?: string;
}

export const errorMessages = {
  // Authentication errors
  INVALID_CREDENTIALS: {
    title: 'Email ou senha incorretos',
    description: 'As credenciais fornecidas não correspondem a nenhuma conta.',
    suggestion: 'Verifique se digitou o email e senha corretamente. Use "admin@triagem.com" e "demo123" para demonstração.',
    action: {
      label: 'Usar credenciais demo',
      onClick: () => {}
    }
  },

  NETWORK_ERROR: {
    title: 'Problema de conexão',
    description: 'Não foi possível conectar ao servidor.',
    suggestion: 'Verifique sua conexão com a internet e tente novamente em alguns segundos.',
    action: {
      label: 'Tentar novamente',
      onClick: () => window.location.reload()
    }
  },

  // File upload errors
  FILE_TOO_LARGE: (fileName: string, maxSize: string) => ({
    title: 'Arquivo muito grande',
    description: `O arquivo "${fileName}" excede o limite permitido.`,
    suggestion: `Reduza o tamanho do arquivo para menos de ${maxSize} ou use um formato mais compacto como PDF.`,
    helpLink: '/help/file-size'
  }),

  INVALID_FILE_TYPE: (fileName: string, allowedTypes: string) => ({
    title: 'Tipo de arquivo não suportado',
    description: `O arquivo "${fileName}" não é um formato aceito pelo sistema.`,
    suggestion: `Use apenas: ${allowedTypes}. Converta seu arquivo ou escaneie como PDF/imagem.`,
    helpLink: '/help/file-formats'
  }),

  UPLOAD_FAILED: (fileName: string) => ({
    title: 'Falha no upload',
    description: `Não foi possível enviar o arquivo "${fileName}".`,
    suggestion: 'Verifique sua conexão e tente novamente. Se o problema persistir, tente um arquivo menor.',
    action: {
      label: 'Tentar novamente',
      onClick: () => {}
    }
  }),

  // Form validation errors
  REQUIRED_FIELD: (fieldName: string) => ({
    title: 'Campo obrigatório',
    description: `O campo "${fieldName}" deve ser preenchido.`,
    suggestion: 'Este campo é necessário para continuar. Preencha com informações válidas.',
  }),

  INVALID_EMAIL: {
    title: 'Email inválido',
    description: 'O formato do email não está correto.',
    suggestion: 'Use o formato: nome@dominio.com. Exemplo: joao@empresa.com',
  },

  PASSWORD_TOO_SHORT: {
    title: 'Senha muito curta',
    description: 'A senha deve ter pelo menos 6 caracteres.',
    suggestion: 'Use uma combinação de letras, números e símbolos para maior segurança.',
  },

  // Data loading errors
  DOCUMENTS_LOAD_FAILED: {
    title: 'Erro ao carregar documentos',
    description: 'Não foi possível buscar a lista de documentos.',
    suggestion: 'Verifique sua conexão e tente atualizar a página. Se o erro persistir, contate o suporte.',
    action: {
      label: 'Recarregar página',
      onClick: () => window.location.reload()
    },
    helpLink: '/help/troubleshooting'
  },

  TASKS_LOAD_FAILED: {
    title: 'Erro ao carregar tarefas',
    description: 'Não foi possível buscar suas tarefas.',
    suggestion: 'Tente atualizar a página ou verificar se você tem permissão para acessar as tarefas.',
    action: {
      label: 'Atualizar',
      onClick: () => {}
    }
  },

  // OCR and processing errors
  OCR_LOW_CONFIDENCE: (confidence: number) => ({
    title: 'Texto pouco legível',
    description: `O OCR conseguiu ler apenas ${confidence}% do documento com confiança.`,
    suggestion: 'Tente uma imagem com melhor qualidade, mais luz ou escaneie em resolução maior (300 DPI).',
    action: {
      label: 'Reprocessar',
      onClick: () => {}
    },
    helpLink: '/help/ocr-tips'
  }),

  PROCESSING_FAILED: (documentName: string) => ({
    title: 'Falha no processamento',
    description: `Não foi possível analisar o documento "${documentName}".`,
    suggestion: 'Verifique se o arquivo não está corrompido e tente novamente. Para PDFs protegidos, remova a senha primeiro.',
    action: {
      label: 'Tentar novamente',
      onClick: () => {}
    }
  }),

  // Permission errors
  ACCESS_DENIED: {
    title: 'Acesso negado',
    description: 'Você não tem permissão para realizar esta ação.',
    suggestion: 'Entre em contato com o administrador do sistema para solicitar as permissões necessárias.',
    helpLink: '/help/permissions'
  },

  // Generic fallback
  UNKNOWN_ERROR: {
    title: 'Algo deu errado',
    description: 'Ocorreu um erro inesperado no sistema.',
    suggestion: 'Tente novamente em alguns instantes. Se o problema persistir, anote o que estava fazendo e contate o suporte.',
    action: {
      label: 'Reportar problema',
      onClick: () => window.open('/help/report-bug', '_blank')
    },
    helpLink: '/help/troubleshooting'
  }
};

export function getErrorMessage(errorCode: string, ...params: any[]): ErrorMessage {
  const messageFactory = (errorMessages as any)[errorCode];
  
  if (typeof messageFactory === 'function') {
    return messageFactory(...params);
  }
  
  if (messageFactory) {
    return messageFactory;
  }
  
  return errorMessages.UNKNOWN_ERROR;
}