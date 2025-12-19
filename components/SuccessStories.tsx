import React from 'react';
import { Trophy, Users, TrendingUp, ShieldCheck, Briefcase, Zap, Info } from 'lucide-react';

const SuccessStories: React.FC = () => {
  const stories = [
    {
      title: "電商倉儲人員 - 成功補回勞保",
      scenario: "被公司要求簽署「合夥協議」，工作受主管高度指揮卻無勞保。",
      impact: "透過本工具生成「實質僱傭關係」認定文案，同步向勞保局與勞檢處申訴。",
      result: "主管機關判定為僱傭關係，公司受罰 10 萬並補足勞保與 6% 勞退金。",
      color: "border-blue-500",
      icon: <Briefcase className="w-6 h-6 text-blue-500" />
    },
    {
      title: "設計師 - 追回高薪低報差額",
      scenario: "實領 6 萬但投保等級僅 27,470 元，離職後發現勞退金大幅縮水。",
      impact: "生成三線文案，同步通知國稅局（所得不實）與勞保局（高薪低報）。",
      result: "公司因逃漏稅與少繳保費被連環開罰，勞工成功追回 12 萬元的差額。",
      color: "border-red-500",
      icon: <TrendingUp className="w-6 h-6 text-red-500" />
    },
    {
      title: "連鎖餐飲員工 - 爭取加班費",
      scenario: "長期被要求「先打卡再加班」，國定假日也無加倍工資。",
      impact: "利用本工具整理「排班表」與「對話紀錄」附件說明，精準引用勞基法。",
      result: "勞檢處突擊檢查，公司補發過去兩年全體員工總計 80 萬元的加班費。",
      color: "border-yellow-500",
      icon: <Zap className="w-6 h-6 text-yellow-600" />
    }
  ];

  return (
    <section className="max-w-5xl mx-auto mt-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          實戰守護案例：三線並進的力量
        </h2>
        <p className="text-slate-500">了解其他勞工如何利用本工具精準出擊，拿回屬於自己的權益</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((story, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-2xl p-6 border-l-4 ${story.color} shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}
          >
            <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              {story.icon}
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-3">{story.title}</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">遇到困境</span>
                <p className="text-sm text-slate-600 leading-relaxed">{story.scenario}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">三線守護協助</span>
                <p className="text-sm text-slate-700 font-medium">{story.impact}</p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700 font-bold">{story.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400 text-xs bg-slate-100 px-4 py-1.5 rounded-full">
          <Info className="w-3 h-3" />
          <span>本工具致力於協助勞工簡化權益爭取流程，旨在降低法律救濟門檻</span>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
