import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Toast } from './Toast';
import type { ToastType } from './Toast';

interface ChatPanelProps {
  onClose: () => void;
  onRefine: (prompt: string) => Promise<void>;
}

export function ChatPanel({ onClose, onRefine }: ChatPanelProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const { isGenerating, setIsGenerating } = useStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    try {
      setIsGenerating(true);
      await onRefine(input);
      setInput('');
    } catch (error) {
      console.error('Chat error:', error);
      setToast({ message: t('chat.aiError'), type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white border-l border-t border-gray-200 shadow-xl rounded-tl-xl flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h3 className="font-semibold text-gray-800">{t('chat.title')}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-sm text-gray-600 mb-4">
          <p className="mb-2">{t('chat.greeting')}</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>{t('chat.help1')}</li>
            <li>{t('chat.help2')}</li>
            <li>{t('chat.help3')}</li>
            <li>{t('chat.help4')}</li>
          </ul>
        </div>
      </div>

      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            disabled={isGenerating}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Toast 提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
