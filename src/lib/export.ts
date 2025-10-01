import { Document, Task } from './mockApi';

// Export para Excel
export const exportToExcel = (data: Document[] | Task[], filename: string) => {
  const headers = data.length > 0 && 'title' in data[0] 
    ? ['Título', 'Tipo', 'Score', 'Status', 'Data Upload', 'Resumo']
    : ['Título', 'Descrição', 'Responsável', 'Prioridade', 'Status', 'Prazo'];
  
  const rows = data.map(item => {
    if ('title' in item && 'type' in item) {
      // Document
      const doc = item as Document;
      return [
        doc.title,
        doc.type,
        `${(doc.score * 100).toFixed(0)}%`,
        doc.status === 'pending' ? 'Pendente' : 'Revisado',
        new Date(doc.uploadedAt).toLocaleDateString('pt-BR'),
        doc.summary.split('\n')[0]
      ];
    } else {
      // Task
      const task = item as Task;
      return [
        task.title,
        task.description,
        task.assignee,
        task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa',
        task.status === 'todo' ? 'A fazer' : task.status === 'in_progress' ? 'Em andamento' : 'Concluída',
        new Date(task.dueDate).toLocaleDateString('pt-BR')
      ];
    }
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

// Export para PDF
export const exportToPDF = (data: Document[] | Task[], filename: string) => {
  const isDocuments = data.length > 0 && 'title' in data[0];
  
  let content = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .high { color: #dc3545; font-weight: bold; }
          .medium { color: #ffc107; font-weight: bold; }
          .low { color: #28a745; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${isDocuments ? 'Relatório de Documentos' : 'Relatório de Tarefas'}</h1>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        <p>Total de registros: ${data.length}</p>
        <table>
  `;

  if (isDocuments) {
    content += `
      <thead>
        <tr>
          <th>Título</th>
          <th>Tipo</th>
          <th>Score</th>
          <th>Status</th>
          <th>Data Upload</th>
        </tr>
      </thead>
      <tbody>
    `;
    
    (data as Document[]).forEach(doc => {
      const scoreClass = doc.score >= 0.7 ? 'high' : doc.score >= 0.3 ? 'medium' : 'low';
      content += `
        <tr>
          <td>${doc.title}</td>
          <td>${doc.type}</td>
          <td class="${scoreClass}">${(doc.score * 100).toFixed(0)}%</td>
          <td>${doc.status === 'pending' ? 'Pendente' : 'Revisado'}</td>
          <td>${new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</td>
        </tr>
      `;
    });
  } else {
    content += `
      <thead>
        <tr>
          <th>Título</th>
          <th>Responsável</th>
          <th>Prioridade</th>
          <th>Status</th>
          <th>Prazo</th>
        </tr>
      </thead>
      <tbody>
    `;
    
    (data as Task[]).forEach(task => {
      const priorityClass = task.priority;
      const priorityLabel = task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa';
      const statusLabel = task.status === 'todo' ? 'A fazer' : task.status === 'in_progress' ? 'Em andamento' : 'Concluída';
      
      content += `
        <tr>
          <td>${task.title}</td>
          <td>${task.assignee}</td>
          <td class="${priorityClass}">${priorityLabel}</td>
          <td>${statusLabel}</td>
          <td>${new Date(task.dueDate).toLocaleDateString('pt-BR')}</td>
        </tr>
      `;
    });
  }

  content += `
      </tbody>
    </table>
  </body>
</html>
  `;

  const blob = new Blob([content], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.html`;
  link.click();
};

// Webhook para sistemas externos
export const sendWebhook = async (event: string, data: any) => {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    data
  };

  // Simula envio de webhook (em produção, usar URL real)
  console.log('📡 Webhook enviado:', payload);
  
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simula sucesso (em produção, fazer fetch real)
  return { 
    success: true, 
    message: `Webhook "${event}" enviado para sistemas externos` 
  };
};