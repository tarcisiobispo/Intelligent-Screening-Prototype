import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
  RefreshCw,
  Send,
  Cloud,
  HardDrive,
} from 'lucide-react';
import { mockApi } from '../../lib/mockApi';
import { useToast } from '../ui/toast-provider';

interface UploadedFile {
  file: File;
  id?: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  ocrConfidence?: number;
  score?: number;
}

export function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = async (newFiles: File[]) => {
    // Validate files before processing
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach((file) => {
      // File size validation (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        errors.push(`${file.name}: Muito grande (máximo 50MB)`);
        return;
      }

      // File type validation
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Formato não aceito`);
        return;
      }

      // File name validation
      const invalidChars = /[<>:"/\\|?*]/;
      if (invalidChars.test(file.name)) {
        errors.push(`${file.name}: Nome com caracteres especiais`);
        return;
      }

      validFiles.push(file);
    });

    // Show validation errors
    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error('Arquivo inválido', error);
      });
    }

    // Process only valid files
    if (validFiles.length === 0) return;

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      file,
      status: 'uploading' as const,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);

    // Simulate upload and OCR processing
    for (let i = 0; i < validFiles.length; i++) {
      const fileIndex = files.length + i;

      // Upload phase
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setFiles((prev) => {
          const updated = [...prev];
          updated[fileIndex] = { ...updated[fileIndex], progress };
          return updated;
        });
      }

      // Processing phase
      setFiles((prev) => {
        const updated = [...prev];
        updated[fileIndex] = { ...updated[fileIndex], status: 'processing' };
        return updated;
      });

      // Simulate OCR
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

      const ocrConfidence = 0.3 + Math.random() * 0.65;
      const score = Math.random();

      setFiles((prev) => {
        const updated = [...prev];
        updated[fileIndex] = {
          ...updated[fileIndex],
          status: 'complete',
          id: `doc_${Date.now()}_${i}`,
          ocrConfidence,
          score,
          progress: 100,
        };
        return updated;
      });

      toast.success('Documento processado!', `${validFiles[i].name} foi analisado com sucesso`);
    }
  };

  const handleReprocess = async (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: 'processing', progress: 50 };
      return updated;
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: 'complete',
        ocrConfidence: Math.min(0.95, (updated[index].ocrConfidence || 0) + 0.15),
        progress: 100,
      };
      return updated;
    });

    toast.success('Documento reprocessado', 'OCR executado novamente com sucesso');
  };

  const handleRequestResend = (index: number) => {
    toast.success('Solicitação enviada', 'O responsável será notificado para reenviar o documento');
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConnectDrive = () => {
    toast.loading('Conectando...', 'Autenticando com Google Drive');
    setTimeout(() => {
      toast.error('Funcionalidade em desenvolvimento', 'Esta opção estará disponível em breve');
    }, 2000);
  };

  const handleConnectSharePoint = () => {
    toast.loading('Conectando...', 'Autenticando com SharePoint');
    setTimeout(() => {
      toast.error('Funcionalidade em desenvolvimento', 'Esta opção estará disponível em breve');
    }, 2000);
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return { label: 'High', color: 'var(--success)' };
    } else if (confidence >= 0.5) {
      return { label: 'Med', color: 'var(--warning)' };
    } else {
      return { label: 'Low', color: 'var(--danger)' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Enviar Documentos</h1>
        <p className="text-[var(--muted)]">
          Faça upload dos seus arquivos para análise automática e classificação inteligente
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all
              ${
                isDragging
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                  : 'border-[var(--border)] hover:border-[var(--primary)]/50'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-12 h-12 mx-auto mb-4 text-[var(--primary)]" />
            <h3 className="mb-2">Solte seus arquivos aqui</h3>
            <p className="text-[var(--muted)] mb-4">
              PDF, imagens, Word (até 50MB cada)
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  className="bg-[var(--primary)] hover:bg-[var(--primary-700)] gap-2 cursor-pointer"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                  }}
                >
                  <HardDrive className="w-4 h-4" />
                  Escolher Arquivos
                </Button>
              </label>

              <Button variant="outline" className="gap-2" onClick={handleConnectDrive}>
                <Cloud className="w-4 h-4" />
                Google Drive
              </Button>

              <Button variant="outline" className="gap-2" onClick={handleConnectSharePoint}>
                <Cloud className="w-4 h-4" />
                SharePoint
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Arquivos ({files.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((uploadedFile, index) => {
              const confidenceBadge = uploadedFile.ocrConfidence
                ? getConfidenceBadge(uploadedFile.ocrConfidence)
                : null;

              return (
                <div
                  key={index}
                  className="border border-[var(--border)] rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-medium truncate">{uploadedFile.file.name}</div>
                        <button
                          onClick={() => handleRemove(index)}
                          className="p-1 hover:bg-[var(--bg)] rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-sm text-[var(--muted)]">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 mt-2">
                        {uploadedFile.status === 'uploading' && (
                          <>
                            <span className="text-sm text-[var(--muted)]">Carregando...</span>
                            <Progress value={uploadedFile.progress} className="flex-1" />
                          </>
                        )}

                        {uploadedFile.status === 'processing' && (
                          <>
                            <RefreshCw className="w-4 h-4 text-[var(--primary)] animate-spin" />
                            <span className="text-sm text-[var(--primary)]">
                              Analisando texto...
                            </span>
                          </>
                        )}

                        {uploadedFile.status === 'complete' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                            <span className="text-sm text-[var(--success)]">Pronto</span>
                            {confidenceBadge && (
                              <Badge
                                variant="secondary"
                                style={{
                                  backgroundColor: `${confidenceBadge.color}20`,
                                  color: confidenceBadge.color,
                                }}
                              >
                                OCR: {confidenceBadge.label} (
                                {(uploadedFile.ocrConfidence! * 100).toFixed(0)}%)
                              </Badge>
                            )}
                            {uploadedFile.score !== undefined && (
                              <Badge
                                variant="secondary"
                                style={{
                                  backgroundColor:
                                    uploadedFile.score > 0.7
                                      ? 'var(--danger)'
                                      : 'var(--muted)',
                                  color: 'white',
                                }}
                              >
                                Score: {(uploadedFile.score * 100).toFixed(0)}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>

                      {/* Low confidence warning */}
                      {uploadedFile.status === 'complete' &&
                        uploadedFile.ocrConfidence! < 0.7 && (
                          <Alert className="mt-3 bg-[var(--warning)]/10 border-[var(--warning)]">
                            <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                            <AlertDescription>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm">
                                  Texto não ficou muito claro. Tentar novamente?
                                </span>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() => handleReprocess(index)}
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Tentar Novamente
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() => handleRequestResend(index)}
                                  >
                                    <Send className="w-3 h-3" />
                                    Pedir Reenvio
                                  </Button>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {files.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Como obter melhores resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                <span className="text-[var(--text)]">Fotos nítidas com boa luz funcionam melhor</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                <span className="text-[var(--text)]">PDFs digitais são mais precisos que fotos</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                <span className="text-[var(--text)]">Use alta qualidade (300 DPI ou mais)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                <span className="text-[var(--text)]">Evite marcas d'água ou textos sobrepostos</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}