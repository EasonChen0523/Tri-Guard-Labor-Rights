
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, MapPin, Calendar, ShieldCheck, Loader2 } from 'lucide-react';

interface CollectionCameraProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CollectionCamera: React.FC<CollectionCameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Start camera and get location
  useEffect(() => {
    const startCamera = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
          audio: false
        });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setIsReady(true);
      } catch (err) {
        console.error("Camera access error:", err);
        setError("無法啟動相機，請確認已授予相機權限。");
      }
    };

    const getGeoLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            });
          },
          (err) => {
            console.error("Location access error:", err);
            // Non-fatal error
          }
        );
      }
    };

    startCamera();
    getGeoLocation();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setIsReady(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Prepare watermark content
    const now = new Date();
    const dateStr = now.toLocaleString('zh-TW', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false 
    });
    const locStr = location 
      ? `GPS: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` 
      : "GPS: 位置獲取中...";
    
    // Watermark Styling
    const padding = 20;
    const fontSize = Math.max(14, canvas.width / 40);
    ctx.font = `bold ${fontSize}px sans-serif`;
    
    // Background overlay for legibility
    const bgHeight = fontSize * 3.5;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, canvas.height - bgHeight, canvas.width, bgHeight);

    // Text with shadow/outline
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Draw Date
    ctx.fillText(`🕒 ${dateStr}`, padding, canvas.height - bgHeight + padding + fontSize);
    
    // Draw Location
    ctx.fillText(`📍 ${locStr}`, padding, canvas.height - padding);
    
    // Draw App Branding
    ctx.textAlign = 'right';
    ctx.fillText('🛡️ 勞權三線守護 - 蒐證相機', canvas.width - padding, canvas.height - padding);

    // Convert to base64 and export
    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    onCapture(base64);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-fade-in">
      {/* Header Info */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold tracking-wide">蒐證模式已啟動</h3>
            <p className="text-[10px] text-slate-300 opacity-80 uppercase tracking-tighter">Automatic Legal Watermarking</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera Feed Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-6 space-y-4">
            <X className="w-12 h-12 text-red-500 mx-auto" />
            <p className="font-bold">{error}</p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 rounded-lg font-bold"
            >
              返回表單
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
            />
            {!isReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400 gap-3">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="text-sm font-bold animate-pulse">啟動影像模組...</span>
              </div>
            )}
            
            {/* On-screen Location Display (Mock/Preview) */}
            {isReady && (
              <div className="absolute bottom-28 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white space-y-1">
                 <div className="flex items-center gap-2 text-xs font-bold">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    {new Date().toLocaleTimeString()}
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "定位獲取中..."}
                 </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="absolute bottom-0 w-full p-8 flex justify-around items-center bg-gradient-to-t from-black/80 to-transparent">
        <button 
          onClick={toggleCamera}
          className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all transform active:scale-90"
          title="切換鏡頭"
        >
          <RefreshCw className="w-6 h-6" />
        </button>

        <button 
          onClick={capturePhoto}
          disabled={!isReady}
          className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all transform active:scale-90 ${!isReady ? 'opacity-50' : 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'}`}
        >
          <div className="w-16 h-16 bg-white rounded-full border-2 border-black" />
        </button>

        <div className="w-14" /> {/* Spacer to match symmetry */}
      </div>

      {/* Visual Indicator for capture success */}
      <div id="flash" className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-150" />
    </div>
  );
};

export default CollectionCamera;
