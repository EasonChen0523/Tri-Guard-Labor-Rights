
import React, { useState, useEffect } from 'react';
import { ReportResult, GeneratedReport, AGENCY_ATTACHMENTS } from '../types';
import { Copy, Check, FileCheck, Printer, Image as ImageIcon, Link as LinkIcon, Download, FileArchive, FileText, AlertCircle } from 'lucide-react';

interface ReportViewerProps { 
  reports: ReportResult; 
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reports }) => {
  const availableTabs = [
    { id: 'laborInsurance', label: '勞保局 (保險/退休金)', color: 'blue', content: reports.laborInsurance },
    { id: 'laborInspection', label: '勞檢處 (勞基法)', color: 'yellow', content: reports.laborInspection },
    { id: 'taxBureau', label: '國稅局 (稅務)', color: 'red', content: reports.taxBureau },
  ].filter(tab => tab.content !== null);

  const [activeTab, setActiveTab] = useState<string>(availableTabs[0]?.id || 'laborInspection');

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id);
    }
  }, [reports]);

  const handleDownloadTxt = () => {
    const { laborInsurance, laborInspection, taxBureau } = reports;
    const dateStr = new Date().toLocaleString('zh-TW', { hour12: false });
    const fileDate = new Date().toISOString().split('T')[0];

    let content = `================================================================================\n`;
    content += `         勞權三線守護基地 - 完整檢舉文案包 (Tri-Guard Report Package)           \n`;
    content += `================================================================================\n`;
    content += `生成時間：${dateStr}\n`;
    content += `================================================================================\n\n`;

    const addReport = (title: string, report: GeneratedReport | null) => {
      if (!report) return;
      content += `################################################################################\n`;
      content += `【 單位：${title} 】\n`;
      content += `################################################################################\n\n`;
      content += `>> 投遞指引：\n${report.submissionGuide}\n\n`;
      content += `>> 建議附件清單：\n`;
      if (report.requiredDocuments && report.requiredDocuments.length > 0) {
          report.requiredDocuments.forEach(doc => content += `- ${doc}\n`);
      }
      content += `\n>> 信件主旨：\n${report.subject}\n\n`;
      content += `>> 信件正文內容：\n--------------------------------------------------------------------------------\n`;
      content += `${report.body}\n`;
      content += `--------------------------------------------------------------------------------\n\n\n`;
    };

    addReport("勞動部勞工保險局", laborInsurance);
    addReport("各縣市勞動檢查處", laborInspection);
    addReport("財政部國稅局", taxBureau);
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `勞權三線守護_檢舉文案_${fileDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    window.focus();
    window.print();
  };

  const highlightPlaceholders = (text: string) => {
    // 尋找 [請在此填寫：...] 格式的佔位符
    const parts = text.split(/(\[請在此填寫：[^\]]+\])/);
    return parts.map((part, i) => {
      if (part.startsWith('[請在此填寫：')) {
        return (
          <span key={i} className="bg-yellow-200 text-red-700 px-1 rounded font-bold border-b-2 border-red-500 mx-0.5 print:bg-slate-100 print:text-black print:border-slate-300">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const getThemeColor = (tabId: string) => {
    switch (tabId) {
      case 'laborInspection': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'taxBureau': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const renderAttachments = (agencyId: keyof typeof AGENCY_ATTACHMENTS, isPrint: boolean = false) => {
    const allowedCodes = AGENCY_ATTACHMENTS[agencyId];
    const relevantCovers = reports.evidenceCovers.filter(cover => allowedCodes.includes(cover.code));

    if (relevantCovers.length === 0) return null;

    return (
      <div className={`mt-8 ${!isPrint ? 'border-t border-slate-200 pt-6' : 'mt-10'}`}>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-slate-600" />
          相關證據附件預覽
        </h3>
        <div className="space-y-6">
          {relevantCovers.map((cover, idx) => {
            const images = reports.evidenceImages[cover.code] || [];
            
            return (
              <div key={idx} className={`border border-slate-200 rounded-xl overflow-hidden bg-white ${isPrint ? 'break-inside-avoid shadow-none' : 'shadow-sm'}`}>
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 text-sm">附件 {cover.code} - {cover.title}</h4>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-600 mb-3 whitespace-pre-wrap leading-relaxed">
                    {highlightPlaceholders(cover.description)}
                  </p>
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((img, imgIdx) => (
                        <img key={imgIdx} src={img} className="w-full h-32 object-cover rounded border border-slate-100" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSingleReport = (report: GeneratedReport | null, agencyId: string, isPrint: boolean = false) => {
    if (!report) return null;
    return (
      <div className={`${isPrint ? 'block py-10 border-b border-slate-300 last:border-0 break-after-page' : 'space-y-6'}`}>
        {isPrint && (
          <div className="mb-6 text-center border-b-2 border-slate-900 pb-4">
            <h2 className="text-2xl font-black text-slate-900">檢舉呈報書：{agencyId === 'laborInsurance' ? '勞工保險局' : agencyId === 'laborInspection' ? '勞動檢查處' : '國稅局'}</h2>
          </div>
        )}

        {!isPrint && (
          <div className={`mb-6 p-4 rounded-lg border ${getThemeColor(agencyId)}`}>
            <h4 className="font-bold mb-2 flex items-center gap-2"><FileCheck className="w-5 h-5" /> 投遞指引</h4>
            <p className="text-sm font-medium">{report.submissionGuide}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className={`font-bold mb-2 ${isPrint ? 'text-lg text-black' : 'text-sm text-slate-500 uppercase tracking-wider'}`}>信件主旨</h3>
          <div className={`${isPrint ? 'text-xl font-black border-l-4 border-black pl-4 py-2 mb-6' : 'bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 font-bold text-lg'}`}>
            {highlightPlaceholders(report.subject)}
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`font-bold mb-2 ${isPrint ? 'text-lg text-black' : 'text-sm text-slate-500 uppercase tracking-wider'}`}>信件正文內容</h3>
          <div className={`${isPrint ? 'text-base leading-relaxed text-black' : 'bg-slate-50 p-8 rounded-lg border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed text-base'}`}>
            <div className="whitespace-pre-wrap">{highlightPlaceholders(report.body)}</div>
          </div>
        </div>

        {renderAttachments(agencyId as any, isPrint)}
      </div>
    );
  };

  if (availableTabs.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-20 px-4">
      {/* 偵測到佔位符的提示 */}
      {(reports.laborInsurance?.body.includes('[請在此填寫') || 
        reports.laborInspection?.body.includes('[請在此填寫') || 
        reports.taxBureau?.body.includes('[請在此填寫')) && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 p-4 rounded-xl flex gap-3 items-center animate-pulse print:hidden">
           <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
           <p className="text-sm text-red-800 font-bold">
             注意：文案中包含 [佔位符]，表示資料庫中缺少相關事實（如日期或部位）。投遞前請務必手動補齊黃色高亮處。
           </p>
        </div>
      )}

      {/* Print View */}
      <div className="hidden print:block print:p-10 bg-white">
        {renderSingleReport(reports.laborInsurance, 'laborInsurance', true)}
        {renderSingleReport(reports.laborInspection, 'laborInspection', true)}
        {renderSingleReport(reports.taxBureau, 'taxBureau', true)}
      </div>

      {/* Screen View */}
      <div className="print:hidden">
        <div className="bg-indigo-600 rounded-2xl p-6 mb-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl"><FileArchive className="w-8 h-8 text-white" /></div>
              <div className="text-white">
                 <h2 className="text-xl font-bold">檢舉文案已生成 ({availableTabs.length} 單位)</h2>
                 <p className="text-indigo-100 text-sm opacity-90">建議下載 TXT 文案或匯出 PDF 作為完整存檔。</p>
              </div>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <button onClick={handleDownloadTxt} className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition"><Download className="w-5 h-5" /> 下載 TXT</button>
              <button onClick={handlePrint} className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-400 transition"><Printer className="w-5 h-5" /> 匯出 PDF</button>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-sm md:text-base font-bold whitespace-nowrap transition-colors relative
                  ${activeTab === tab.id ? 'text-slate-900 bg-white' : 'text-slate-500 bg-slate-50 hover:bg-slate-100'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className={`absolute bottom-0 left-0 w-full h-1 ${tab.id === 'laborInsurance' ? 'bg-blue-500' : tab.id === 'laborInspection' ? 'bg-yellow-500' : 'bg-red-500'}`} />}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
               {renderSingleReport((reports as any)[activeTab], activeTab, false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
