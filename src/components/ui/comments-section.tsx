import { useState, useEffect } from 'react';
import { Button } from './button';
import { Textarea } from './textarea';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { MessageCircle, Send, User, AtSign } from 'lucide-react';
import { Comment, getComments, addComment, users, formatTextWithMentions } from '../../lib/collaboration';
import { useToast } from './toast-provider';

interface CommentsSectionProps {
  documentId: string;
}

export function CommentsSection({ documentId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const toast = useToast();

  useEffect(() => {
    setComments(getComments(documentId));
  }, [documentId]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;
    
    setNewComment(value);
    setCursorPosition(cursor);
    
    // Check for @ mentions
    const textBeforeCursor = value.substring(0, cursor);
    const mentionMatch = textBeforeCursor.match(/@([A-Za-zÀ-ÿ\s]*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }
  };

  const handleMentionSelect = (userName: string) => {
    const textBeforeCursor = newComment.substring(0, cursorPosition);
    const textAfterCursor = newComment.substring(cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@([A-Za-zÀ-ÿ\s]*)$/);
    
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
      const newText = `${beforeMention}@${userName} ${textAfterCursor}`;
      setNewComment(newText);
    }
    
    setShowMentions(false);
    setMentionQuery('');
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const comment = await addComment(documentId, newComment, 'Usuário Atual');
      setComments(prev => [...prev, comment]);
      setNewComment('');
      
      if (comment.mentions.length > 0) {
        toast.success('Comentário adicionado', `${comment.mentions.length} pessoa(s) mencionada(s) serão notificadas`);
      } else {
        toast.success('Comentário adicionado', 'Comentário publicado com sucesso');
      }
    } catch (error) {
      toast.error('Erro ao adicionar comentário', 'Tente novamente');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'há poucos minutos';
    } else if (diffInHours < 24) {
      return `há ${Math.floor(diffInHours)} horas`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="font-medium">Comentários ({comments.length})</h3>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-[var(--muted)] text-center py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="bg-[var(--bg)]">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-[var(--muted)]">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                      {comment.mentions.length > 0 && (
                        <Badge variant="outline" className="text-xs gap-1 flex items-center">
                          <AtSign className="w-3 h-3" />
                          {comment.mentions.length}
                        </Badge>
                      )}
                    </div>
                    <div 
                      className="text-sm"
                      dangerouslySetInnerHTML={{ 
                        __html: formatTextWithMentions(comment.content) 
                      }}
                      style={{
                        '--mention-bg': 'var(--primary)',
                        '--mention-color': 'white',
                      } as any}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Comment */}
      <div className="relative">
        <Textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Adicione um comentário... Use @nome para mencionar alguém"
          rows={3}
          className="resize-none"
        />
        
        {/* Mentions Dropdown */}
        {showMentions && filteredUsers.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg max-h-32 overflow-y-auto z-10">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 hover:bg-[var(--bg)] cursor-pointer"
                onClick={() => handleMentionSelect(user.name)}
              >
                <div className="w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-[var(--primary)]" />
                </div>
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-[var(--muted)]">
            Digite @ para mencionar alguém
          </div>
          <Button 
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            size="sm"
            className="gap-1"
          >
            <Send className="w-3 h-3" />
            Comentar
          </Button>
        </div>
      </div>

      <style jsx>{`
        :global(.mention) {
          background-color: var(--mention-bg);
          color: var(--mention-color);
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}