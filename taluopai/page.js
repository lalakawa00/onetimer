'use client'; // This directive is necessary for using hooks in Next.js App Router

// All necessary imports for the React component
import React, { useState, useRef, useEffect } from 'react';
import { Camera, KeyRound, Wand2, LoaderCircle, AlertTriangle, Send, Sparkles } from 'lucide-react';

// Helper component for displaying loading spinner (No changes)
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <LoaderCircle className="w-12 h-12 animate-spin text-purple-300" />
    <p className="text-purple-200 text-lg">AI正在连接宇宙的能量，请稍候...</p>
    <p className="text-sm text-gray-400">这可能需要10到20秒</p>
  </div>
);

// Helper component for displaying error messages (No changes)
const ErrorMessage = ({ message }) => (
  <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center gap-3">
    <AlertTriangle className="w-6 h-6 text-red-400" />
    <div>
      <p className="font-bold">出现错误</p>
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

// Main Application Component
export default function App() {
  // State variables (No changes)
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [question, setQuestion] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // useEffect for preview (No changes)
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  // handleFileChange (No changes)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setError('');
    }
  };

  // --- MODIFIED handleSubmit function ---
  // This is the main change. The logic now sends data to our own backend API route.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation (No changes)
    if (!imageFile) {
      setError('请上传一张塔罗牌阵的图片。');
      return;
    }
    if (!question.trim()) {
      setError('请输入你心中的困惑或问题。');
      return;
    }
    if (!apiKey.trim()) {
      setError('请输入你的OpenAI API Key才能进行解读。');
      return;
    }
    
    setError('');
    setInterpretation('');
    setIsLoading(true);

    // Use FormData to send the file and other data to the backend
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('question', question);
    formData.append('apiKey', apiKey);

    try {
      // Send the request to our own API endpoint
      const response = await fetch('/api/interpret', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // If the server returns an error, use its message
        throw new Error(result.error || '请求失败，请稍后再试。');
      }
      
      setInterpretation(result.interpretation);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // The JSX for rendering the component remains the same
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-white mb-2 flex items-center justify-center gap-3">
            <Wand2 size={40} /> AI 塔罗之心
          </h1>
          <p className="text-gray-400">上传你的牌阵，让AI为你揭示内在的智慧</p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl shadow-purple-900/20 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Image Upload */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-purple-300 flex items-center gap-2"><Sparkles size={20} />第一步：上传你的牌阵</label>
              <div
                className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-gray-800 transition-all duration-300"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Tarot Spread Preview" className="mx-auto max-h-48 rounded-lg shadow-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Camera className="w-12 h-12 mb-2" />
                    <p className="font-semibold">点击此处或拖拽图片上传</p>
                    <p className="text-sm">支持 PNG, JPG, WEBP 格式</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Question Input */}
            <div className="space-y-4">
                <label htmlFor="question" className="text-lg font-semibold text-purple-300 flex items-center gap-2"><Sparkles size={20} />第二步：写下你的问题</label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例如：关于我目前的工作发展，我需要知道些什么？"
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none h-28"
              />
            </div>

            {/* Step 3: API Key Input */}
            <div className="space-y-4">
              <label htmlFor="apiKey" className="text-lg font-semibold text-purple-300 flex items-center gap-2"><KeyRound size={20} />第三步：输入你的密钥</label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请在此输入你的OpenAI API Key (sk-...)"
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
               <p className="text-xs text-gray-500">提示：你的API Key只会被用于本次解读，我们不会在服务器上储存它。</p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1"
              >
                {isLoading ? <><LoaderCircle className="animate-spin" /> 正在解读中...</> : <><Send /> 获取解读</>}
              </button>
            </div>
          </form>

          {/* Result Section */}
          {(isLoading || error || interpretation) && (
            <div className="mt-10 pt-8 border-t border-gray-700">
              <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">来自宇宙的回响</h2>
              <div className="bg-gray-900/80 p-6 rounded-xl min-h-[10rem] flex items-center justify-center">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorMessage message={error} />}
                {interpretation && (
                  <div
                    className="prose prose-invert prose-p:text-gray-300 prose-headings:text-purple-200 max-w-none whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br />') }}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
