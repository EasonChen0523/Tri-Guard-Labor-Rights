import React, { useState } from 'react';
import { X, Smartphone, Monitor, QrCode, CreditCard, Fingerprint, CheckCircle, Download, ArrowRight } from 'lucide-react';

interface IdentityGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const IdentityGuide: React.FC<IdentityGuideProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'verify'>('register');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-indigo-600" />
              行動自然人憑證教學
            </h2>
            <p className="text-slate-500 text-sm mt-1">免讀卡機，手機就是您的數位身分證</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-center font-bold text-sm md:text-base transition-colors relative ${
              activeTab === 'register' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            1. 申請開通 (首次設定)
            {activeTab === 'register' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600" />}
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`flex-1 py-4 text-center font-bold text-sm md:text-base transition-colors relative ${
              activeTab === 'verify' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            2. 驗證操作 (線上檢舉用)
            {activeTab === 'verify' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600" />}
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {activeTab === 'register' && (
            <div className="space-y-8">
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-sm mb-6 flex gap-3">
                <div className="flex-shrink-0 mt-0.5">ℹ️</div>
                <div>
                  <strong>準備物品：</strong> 智慧型手機、電腦、讀卡機、實體自然人憑證卡片。<br/>
                  (若無讀卡機，可至超商 Kiosk 多媒體機台或戶政事務所辦理)
                </div>
              </div>

              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-200">1</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">下載 App</h3>
                  <p className="text-slate-600 text-sm">在手機 App Store 或 Google Play 搜尋並下載「行動自然人憑證」App。</p>
                </div>
                <div className="w-64 h-32 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-4 p-4">
                   <div className="text-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2 text-indigo-600">
                        <Download className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">下載 App</span>
                   </div>
                   <ArrowRight className="text-slate-300" />
                   <div className="w-16 h-24 border-2 border-slate-800 rounded-lg relative bg-white flex flex-col items-center justify-center">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg mb-1"></div>
                      <span className="text-[8px] text-slate-500">Hi PKI</span>
                   </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-200">2</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">電腦申請與綁定</h3>
                  <p className="text-slate-600 text-sm">前往 <a href="https://fido.moi.gov.tw" target="_blank" className="text-indigo-600 underline">fido.moi.gov.tw</a>，插入實體卡片登入，選擇「註冊裝置」。</p>
                </div>
                <div className="w-64 h-32 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-center">
                   <Monitor className="w-48 h-32 text-slate-300 absolute -bottom-4" />
                   <div className="absolute top-6 bg-blue-50 border border-blue-100 px-3 py-2 rounded shadow-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-bold text-slate-600">插入卡片</span>
                   </div>
                   <div className="absolute bottom-4 right-8 w-16 h-16 bg-white p-1 rounded border border-slate-200">
                      <QrCode className="w-full h-full text-slate-800" />
                   </div>
                </div>
              </div>

               {/* Step 3 */}
               <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-200">3</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">掃描 QR Code 綁定</h3>
                  <p className="text-slate-600 text-sm">打開手機 App，點擊「註冊新裝置」，掃描電腦螢幕上的 QR Code，並設定生物辨識(臉部/指紋)。</p>
                </div>
                <div className="w-64 h-32 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center p-4">
                   <div className="w-16 h-24 border-2 border-slate-800 rounded-lg relative bg-white flex flex-col items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-slate-800/10 flex items-center justify-center">
                         <div className="w-10 h-10 border-2 border-green-400 rounded-lg"></div>
                      </div>
                   </div>
                   <div className="w-8 border-t-2 border-dashed border-slate-300 mx-2"></div>
                   <div className="text-center">
                      <Fingerprint className="w-8 h-8 text-indigo-600 mx-auto mb-1" />
                      <span className="text-xs font-bold text-slate-600">設定驗證</span>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verify' && (
             <div className="space-y-8">
               <div className="bg-green-100 text-green-800 p-4 rounded-lg text-sm mb-6 flex gap-3">
                <div className="flex-shrink-0 mt-0.5">✅</div>
                <div>
                  <strong>使用時機：</strong> 勞保局e化服務系統、線上勞檢申訴、稅務申報等網站。<br/>
                  選擇登入方式時，請選<strong>「行動自然人憑證」</strong>。
                </div>
              </div>

              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-green-200">1</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">網站選擇登入方式</h3>
                  <p className="text-slate-600 text-sm">在檢舉/申訴網站登入頁面，選擇「行動自然人憑證」選項，畫面會出現 QR Code。</p>
                </div>
                <div className="w-64 h-32 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden">
                   <div className="w-full h-8 bg-slate-100 absolute top-0 border-b border-slate-200 flex items-center px-2 gap-1">
                     <div className="w-2 h-2 rounded-full bg-red-400"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                     <div className="w-2 h-2 rounded-full bg-green-400"></div>
                   </div>
                   <div className="mt-6 flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-500 mb-1">政府網站登入</span>
                      <div className="w-16 h-16 bg-white border border-slate-200 p-1">
                        <QrCode className="w-full h-full text-slate-800" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-green-200">2</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">手機掃碼與驗證</h3>
                  <p className="text-slate-600 text-sm">開啟「行動自然人憑證」App，點擊「掃描」，掃描螢幕 QR Code 後進行生物辨識(指紋/臉部)。</p>
                </div>
                <div className="w-64 h-32 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-6 p-4">
                    <div className="w-12 h-20 border-2 border-slate-800 rounded-lg relative bg-white flex items-center justify-center">
                       <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-xs text-slate-500 font-bold">
                       驗證成功<br/>完成登入
                    </div>
                </div>
              </div>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold transition-colors"
          >
            我瞭解了
          </button>
        </div>

      </div>
    </div>
  );
};

export default IdentityGuide;