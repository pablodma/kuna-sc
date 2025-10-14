'use client';

import { useState } from 'react';
import { Comment } from '@/lib/types';
import { MessageSquare, Reply, Send } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface CommentThreadProps {
  comments: Comment[];
  onAddComment: (texto: string, parentId?: string) => void;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (texto: string, parentId: string) => void;
  depth?: number;
}

function CommentItem({ comment, onReply, depth = 0 }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(replyText, comment.id);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'LIDER':
        return 'bg-purple-100 text-purple-800';
      case 'COMERCIAL_KAVAK':
        return 'bg-blue-100 text-blue-800';
      case 'COMERCIAL_KUNA':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-3' : 'mb-4'}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2E5BFF] to-[#00D4AA] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {comment.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{comment.userName}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(comment.userRole)}`}>
                {formatRole(comment.userRole)}
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(comment.timestamp).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        {/* Content */}
        <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{comment.texto}</p>

        {/* Actions */}
        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="flex items-center text-[#2E5BFF] hover:text-[#00D4AA] text-sm font-medium transition-colors"
        >
          <Reply className="w-4 h-4 mr-1" />
          Responder
        </button>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-3 flex space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              placeholder="Escribe tu respuesta..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent text-sm"
            />
            <button
              onClick={handleReply}
              className="px-4 py-2 bg-[#2E5BFF] text-white rounded-lg hover:bg-[#00D4AA] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.respuestas && comment.respuestas.length > 0 && (
        <div className="mt-2">
          {comment.respuestas.map((respuesta) => (
            <CommentItem
              key={respuesta.id}
              comment={respuesta}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentThread({ comments, onAddComment }: CommentThreadProps) {
  const [newCommentText, setNewCommentText] = useState('');
  const { user } = useAuthStore();

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      onAddComment(newCommentText);
      setNewCommentText('');
    }
  };

  const handleReply = (texto: string, parentId: string) => {
    onAddComment(texto, parentId);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <MessageSquare className="w-5 h-5 text-[#2E5BFF] mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comentarios ({comments.filter(c => !c.parentId).length})
        </h3>
      </div>

      {/* New Comment Input */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2E5BFF] to-[#00D4AA] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Agrega un comentario..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newCommentText.trim()}
                className="flex items-center px-4 py-2 bg-[#2E5BFF] text-white rounded-lg hover:bg-[#00D4AA] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                Comentar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments
            .filter(comment => !comment.parentId)
            .map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
              />
            ))}
        </div>
      )}
    </div>
  );
}

