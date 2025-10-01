export interface Comment {
  id: string;
  documentId: string;
  author: string;
  content: string;
  timestamp: string;
  mentions: string[];
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export const users: User[] = [
  { id: '1', name: 'João Silva' },
  { id: '2', name: 'Maria Santos' },
  { id: '3', name: 'Pedro Costa' },
  { id: '4', name: 'Ana Oliveira' },
  { id: '5', name: 'Carlos Lima' },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    documentId: 'doc_001',
    author: 'Maria Santos',
    content: 'Este equipamento já apresentou problemas similares no mês passado. @João Silva pode confirmar?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    mentions: ['João Silva'],
  },
  {
    id: '2',
    documentId: 'doc_001',
    author: 'João Silva',
    content: 'Confirmado @Maria Santos. Recomendo inspeção imediata antes que se torne crítico.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    mentions: ['Maria Santos'],
  },
];

export function extractMentions(text: string): string[] {
  const mentionRegex = /@([A-Za-zÀ-ÿ\s]+?)(?=\s|$|[^\w\sÀ-ÿ])/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    const mentionedName = match[1].trim();
    if (users.some(user => user.name === mentionedName)) {
      mentions.push(mentionedName);
    }
  }
  
  return mentions;
}

export function formatTextWithMentions(text: string): string {
  return text.replace(
    /@([A-Za-zÀ-ÿ\s]+?)(?=\s|$|[^\w\sÀ-ÿ])/g,
    (match, name) => {
      const trimmedName = name.trim();
      if (users.some(user => user.name === trimmedName)) {
        return `<span class="mention">@${trimmedName}</span>`;
      }
      return match;
    }
  );
}

export async function addComment(documentId: string, content: string, author: string): Promise<Comment> {
  const mentions = extractMentions(content);
  const comment: Comment = {
    id: `comment_${Date.now()}`,
    documentId,
    author,
    content,
    timestamp: new Date().toISOString(),
    mentions,
  };
  
  mockComments.push(comment);
  return comment;
}

export function getComments(documentId: string): Comment[] {
  return mockComments
    .filter(comment => comment.documentId === documentId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}