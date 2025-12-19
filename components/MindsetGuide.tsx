import React from 'react';
import { X, MessageSquare, Scale, Ban, FileCheck2, Lightbulb, Check, ShieldCheck, UserCheck, Search, Info, DollarSign, Building2, AlertTriangle, ArrowRight, ClipboardCheck, Zap } from 'lucide-react';

interface MindsetGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const MindsetGuide: React.FC<MindsetGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              同步三線心法：法律攻防完全攻略
            </h2>
            <p className="text-slate-500 text-sm mt-1">基於《勞動事件法》與最高法院判例之權益保全指南</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-8">
            
            {/* Principle 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 relative w-full md:w-48 h-32 flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                    <div className="absolute inset-0 flex items-center justify-center gap-4">
                         <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-500 z-10 shadow-sm">
                            <X className="w-6 h-6 text-red-600" strokeWidth={3} />
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-500 z-10 shadow-sm">
                            <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        證據保全：不接受「無痕」溝通
                    </h3>
                    <p className="text-lg font-bold text-amber-700 mb-2 leading-snug">
                        錄音是權力、截圖是武器
                    </p>
                    <div className="text-slate-600 text-sm leading-relaxed space-y-2">
                        <p>老闆要求「當面講」？請務必錄音。依據<strong>《通保法》第 29 條第 3 款</strong>，通訊一方非出於不法目的之錄音具備法律效力。</p>
                        <p className="bg-amber-50 p-2 rounded border-l-2 border-amber-300">
                            <strong>專家提醒：</strong> 對話截圖必須包含「日期與時間」。若有口頭承諾（如獎金、補貼），請事後發 Line 訊息回傳「剛才老闆提到的...」進行確認，完成「舉證責任」。
                        </p>
                    </div>
                </div>
            </div>

            {/* Principle 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 relative w-full md:w-48 h-32 flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                    <Scale className="w-24 h-24 text-slate-200 absolute top-4 left-1/2 -translate-x-1/2" />
                    <Ban className="w-16 h-16 text-red-500 absolute z-10 opacity-80" />
                </div>
                <div className="flex-1">
                     <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        權益剛性：私下協商無效
                    </h3>
                    <p className="text-lg font-bold text-amber-700 mb-2 leading-snug">
                        法律強行法規，超越私人契約
                    </p>
                    <div className="text-slate-600 text-sm leading-relaxed space-y-2">
                        <p>依據<strong>《民法》第 71 條</strong>，違反強制規定之法律行為無效。勞保、勞退金屬於強行法規，僱主負有投保義務。</p>
                        <p className="bg-red-50 p-2 rounded border-l-2 border-red-300">
                            <strong>法律現實：</strong> 即便您簽署了「自願放棄勞保」或「同意不領加班費」切結書，該合約在法律上<strong>自始無效</strong>。
                        </p>
                    </div>
                </div>
            </div>

            {/* Substantial Employment Relationship Logic */}
            <div className="bg-indigo-50 p-6 md:p-8 rounded-2xl border border-indigo-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-md w-full md:w-56 flex-shrink-0">
                         <div className="flex items-center justify-center mb-4 relative">
                            <UserCheck className="w-16 h-16 text-indigo-600" />
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center">
                                <Search className="w-4 h-4 text-white" />
                            </div>
                         </div>
                         <h3 className="text-center font-bold text-indigo-900">實質僱傭認定</h3>
                         <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest mt-1">Supreme Court Standard</p>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                            判準：最高法院 81 年台上字第 347 號
                        </h3>
                        <p className="text-lg font-bold text-indigo-700 mb-3 leading-snug">
                            名義上的「承攬/合夥」不能逃避僱主責任
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            只要符合以下三大從屬性，您就是法定「勞工」，僱主必須投保！
                        </p>
                    </div>
                </div>

                {/* The Three Subordinations Table */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-indigo-600 text-white p-3 font-bold text-sm flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> 人格從屬性
                        </div>
                        <div className="p-4 flex-1">
                            <p className="text-xs font-bold text-indigo-800 mb-2 underline decoration-indigo-200">指揮監督與親自履行</p>
                            <ul className="text-xs text-slate-600 space-y-2">
                                <li className="flex gap-1">● 須遵守出勤/打卡、請假規則</li>
                                <li className="flex gap-1">● <strong>不能由他人代班</strong>（須親自勞務）</li>
                                <li className="flex gap-1">● 接受獎懲考核、服從管理</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-indigo-600 text-white p-3 font-bold text-sm flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> 經濟從屬性
                        </div>
                        <div className="p-4 flex-1">
                            <p className="text-xs font-bold text-indigo-800 mb-2 underline decoration-indigo-200">風險承擔判定</p>
                            <ul className="text-xs text-slate-600 space-y-2">
                                <li className="flex gap-1">● 勞工不需負擔經營盈虧風險</li>
                                <li className="flex gap-1">● <strong>生產工具由公司提供</strong>（水電設備）</li>
                                <li className="flex gap-1">● 領取底薪、非完全按件計酬</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-indigo-600 text-white p-3 font-bold text-sm flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> 組織從屬性
                        </div>
                        <div className="p-4 flex-1">
                            <p className="text-xs font-bold text-indigo-800 mb-2 underline decoration-indigo-200">納入組織分工體系</p>
                            <ul className="text-xs text-slate-600 space-y-2">
                                <li className="flex gap-1">● 與其他同仁分工合作</li>
                                <li className="flex gap-1">● <strong>納入排班表與組織編制</strong></li>
                                <li className="flex gap-1">● 在指定場所執行業務</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Principle 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 relative w-full md:w-48 h-32 flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                    <Zap className="w-16 h-16 text-indigo-600 animate-pulse" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                        行政勾稽：啟動機關連鎖反應
                    </h3>
                    <p className="text-lg font-bold text-amber-700 mb-2 leading-snug">
                        國稅局的申報資料，是僱主最致命的自白
                    </p>
                    <div className="text-slate-600 text-sm leading-relaxed space-y-2">
                        <p>透過三線同步，國稅局證明「有給薪(代號50)」，勞保局與勞檢處即可自動勾稽發現「有領薪卻沒投保/沒加班費」。</p>
                        <p className="bg-indigo-50 p-2 rounded border-l-2 border-indigo-300 italic">
                            「當三個單位同時上門，慣老闆的僥倖心理就會徹底瓦解。」
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-bold transition-colors shadow-lg shadow-amber-500/30"
          >
            我瞭解了，開始爭取權益
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindsetGuide;
