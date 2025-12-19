
// Add React to imports to fix 'Cannot find namespace React'
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, ShieldCheck, AlertCircle, Trash2, History, FileText, Database } from 'lucide-react';
import { createLaborLawChat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';
import { Message, CaseDetails, ReportResult } from '../types';

interface AIChatAssistantProps {
  projectId: string | null;
  projectName: string | null;
  projectData?: CaseDetails | null;
  projectReports?: ReportResult | null;
  history: Message[];
  onUpdateHistory: (newHistory: Message[]) => void;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ 
  projectId, 
  projectName, 
  projectData,
  projectReports,
  history, 
  onUpdateHistory 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContextInfo, setShowContextInfo] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 構建專案上下文文字描述
  const contextString = useMemo(() => {
    if (!projectData) return "";
    let context = `案件公司：${projectData.companyName}\n`;
    context += `違法項目：${projectData.violations.join(", ")}\n`;
    context += `案情描述：${projectData.description}\n`;
    if (projectReports) {
      context += `已生成文案預覽：包含 ${Object.keys(projectReports).filter(k => (projectReports as any)[k] !== null && k !== 'evidenceCovers' && k !== 'evidenceImages' && k !== 'evidenceLinks').length} 個單位的檢舉信。`;
    }
    return context;
  }, [projectData, projectReports]);

  // Default welcome message if history is empty
  const defaultMessage: Message = { 
    role: 'model', 
    text: projectName 
      ? `您好！我是您的勞權 AI 助手。我已成功載入「${projectName}」的專案資料作為背景知識。您可以直接詢問有關此案件的細節、法律分析或文案修改建議。`
      : '您好！我是您的勞權 AI 助手。您可以先點選「我的專案」載入案件，或直接在這裡向我諮詢一般的勞資問題。請問有什麼我可以幫您的？'
  };

  const messages = history.length > 0 ? history : [defaultMessage];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Reset chat instance when project changes OR context significantly changes
  useEffect(() => {
    chatRef.current = null;
  }, [projectId, contextString]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsgText = input.trim();
    setInput('');
    
    const newUserMsg: Message = { role: 'user', text: userMsgText };
    const currentHistory = [...messages, newUserMsg];
    onUpdateHistory(currentHistory);

    setIsLoading(true);

    try {
      if (!chatRef.current) {
        // 傳入當前的專案資料作為 AI 的系統上下文
        chatRef.current = createLaborLawChat(contextString);
      }

      const response = await chatRef.current.sendMessageStream({ message: userMsgText });
      let fullText = '';
      
      const historyWithModelSlot = [...currentHistory, { role: 'model', text: '' } as Message];
      onUpdateHistory(historyWithModelSlot);

      for await (const chunk of response) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          const updatedHistory = [...currentHistory, { role: 'model', text: fullText } as Message];
          onUpdateHistory(updatedHistory);
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorHistory = [...currentHistory, { role: 'model', text: '抱歉，目前連線出現問題或無法回覆該內容，請稍後再試。' } as Message];
      onUpdateHistory(errorHistory);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm('確定要清空此專案的對話紀錄嗎？')) {
      onUpdateHistory([]);
      chatRef.current = null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[450px] h-[600px] max-h-[80vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center relative">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">勞權 AI 法律助理</h3>
                {projectName ? (
                  <button 
                    onClick={() => setShowContextInfo(!showContextInfo)}
                    className="text-[10px] text-indigo-100 flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded mt-0.5 hover:bg-white/20 transition-colors"
                  >
                    <Database className="w-2.5 h-2.5" /> 參考專案：{projectName}
                  </button>
                ) : (
                  <p className="text-[10px] text-indigo-100 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> 基於台灣勞動法規
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="hover:bg-white/10 p-2 rounded-lg transition-colors text-indigo-100"
                  title="清空紀錄"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Info Popup */}
            {showContextInfo && projectData && (
              <div className="absolute top-full left-0 w-full bg-slate-800 p-3 z-20 text-[10px] text-slate-300 border-t border-slate-700 animate-in fade-in slide-in-from-top-1">
                 <div className="flex justify-between items-center mb-1 text-white font-bold">
                    <span>AI 目前參考的專案資料：</span>
                    <button onClick={() => setShowContextInfo(false)}><X className="w-3 h-3" /></button>
                 </div>
                 <p className="line-clamp-3 opacity-80">{contextString}</p>
                 <div className="mt-2 flex items-center gap-1 text-indigo-300">
                    <FileText className="w-3 h-3" /> 回話時 AI 將自動對齊上述事實
                 </div>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-2">
               <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
               <p className="text-[11px] text-amber-700 leading-relaxed">
                 AI 助理已載入專案資料。建議僅供參考，不具正式法律代理效力。
               </p>
            </div>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-white border border-slate-200'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-indigo-600" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200 shadow-md' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-200 shadow-sm'
                  }`}>
                    {msg.text || (isLoading && idx === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
                    {msg.role === 'model' && projectName && idx > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                         <ShieldCheck className="w-3 h-3 text-green-500" /> 已根據專案資料優化回覆
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={projectName ? `針對案件「${projectName}」發問...` : "請輸入您的勞資爭議問題..."}
                className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-full transition-all ${!input.trim() || isLoading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all transform hover:scale-110 active:scale-95 group ${isOpen ? 'bg-slate-800' : 'bg-indigo-600'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
        {!isOpen && (
          <div className="absolute right-16 bg-white text-slate-800 px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100">
            {projectName ? `與專案助理「${projectName}」諮詢中` : '有勞權問題？問問 AI 助理'}
          </div>
        )}
      </button>
    </div>
  );
};

export default AIChatAssistant;
