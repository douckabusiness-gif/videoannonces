'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  fileName?: string;
}

export default function AgentEditeurPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<FileNode[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedFileName, setGeneratedFileName] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Vérifier l'accès admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  // Charger les fichiers au démarrage
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await fetch('/api/ai-dev/files');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Erreur chargement fichiers:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: files,
        }),
      });

      const data = await res.json();

      if (data.code) {
        setGeneratedCode(data.code);
        setGeneratedFileName(data.fileName || 'nouveau-fichier.tsx');
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: data.response,
        code: data.code,
        fileName: data.fileName,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Erreur lors de la communication avec l\'IA.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const applyCode = async () => {
    if (!generatedCode || !generatedFileName) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai-dev/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: generatedFileName,
          code: generatedCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ Fichier créé avec succès : ${generatedFileName}`,
        }]);
        setGeneratedCode('');
        setGeneratedFileName('');
        loadFiles();
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `❌ Erreur : ${data.error}`,
        }]);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-700 rounded cursor-pointer">
          <span>{node.type === 'directory' ? '📁' : '📄'}</span>
          <span className="text-sm text-gray-300">{node.name}</span>
        </div>
        {node.children && renderFileTree(node.children, level + 1)}
      </div>
    ));
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Explorateur de fichiers - Gauche */}
      <div className="w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">📂 Explorateur</h2>
          <button
            onClick={loadFiles}
            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            🔄 Rafraîchir
          </button>
        </div>
        <div className="p-2">
          {renderFileTree(files)}
        </div>
      </div>

      {/* Chat + Code - Droite */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <h1 className="text-2xl font-bold">🤖 AI Dev Agent</h1>
          <p className="text-sm text-gray-400">Générez et modifiez du code avec l'IA</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${msg.role === 'user'
                ? 'bg-blue-900 ml-12'
                : 'bg-gray-800 mr-12'
                }`}
            >
              <div className="font-semibold mb-2">
                {msg.role === 'user' ? '👤 Vous' : '🤖 AI'}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.code && (
                <div className="mt-4">
                  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    {/* Header with filename and copy button */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <span className="text-xs text-gray-400">{msg.fileName}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.code || '');
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition flex items-center gap-1"
                      >
                        {copiedCode ? (
                          <>
                            <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copié
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copier
                          </>
                        )}
                      </button>
                    </div>
                    {/* Code with syntax highlighting */}
                    <div className="overflow-x-auto max-h-96">
                      <SyntaxHighlighter
                        language="typescript"
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          fontSize: '0.875rem',
                          background: 'transparent'
                        }}
                        showLineNumbers
                      >
                        {msg.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                  {idx === messages.length - 1 && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={applyCode}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 flex items-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Créer fichier
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedCode('');
                          setGeneratedFileName('');
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="text-center text-gray-400">
              <div className="animate-pulse">🤖 L'IA réfléchit...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Demandez à l'IA de créer ou modifier du code..."
              className="flex-1 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
