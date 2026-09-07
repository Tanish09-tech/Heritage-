import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Sparkles, 
  Globe, 
  Tag, 
  Play, 
  Pause, 
  CheckCircle2, 
  ShieldAlert, 
  Volume2,
  Radio,
  FileAudio
} from 'lucide-react';

export default function KnowledgeVaultView({ archivedItems = [], onAddArchivedItem, currentUser }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showRecordingResult, setShowRecordingResult] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState('Public Educational Access');
  const [playingId, setPlayingId] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Dynamic user details
  const userName = currentUser?.name || 'Shahir Tukaram Jagtap';
  const userRole = currentUser?.role === 'LEARNER' ? 'Shishya' : (currentUser?.role === 'PRACTITIONER' ? 'Guru' : 'Master Custodian');
  const userState = currentUser?.state || 'Maharashtra';
  const userTradition = currentUser?.expertTradition || currentUser?.hobbies || 'Shahiri Powada';

  // Speech-to-Text dynamic generator based on user details
  const getDynamicTranscript = () => {
    if (userState === 'Punjab' || userTradition.includes('Gatka')) {
      return {
        transcript: "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥ ਬੋਲੇ ਸੋ ਨਿਹਾਲ, ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਗਤਕਾ ਸ਼ਸਤਰ ਵਿਦਿਆ ਦਾ ਜੈਕਾਰਾ।",
        translation: "Victory to the eternal truth! Roar of Gatka traditional martial rhythm and Shastar Vidiya!"
      };
    }
    if (userState === 'Gujarat' || userTradition.includes('Bhavai') || userTradition.includes('Garba')) {
      return {
        transcript: "જય અંબે! ભવાઈ વેશ અને પ્રાચીન ગરબાની મધુર લોકવાણી... તાલીઓના તાલે નૃત્ય।",
        translation: "Salutations to Divine Mother! The melodic oral lore of Bhavai street theatre and Prachin Garba!"
      };
    }
    if (userState === 'Kerala' || userTradition.includes('Koodiyattam')) {
      return {
        transcript: "നമസ്തേ! കൂടിയാട്ടം സംസ്കൃത രംഗകലയുടെ നേത്ര മുദ്രകളും മിഴാവ് വാദ്യ ഘോഷവും।",
        translation: "Intricate eye mudras and Mizhavu drum resonance of 2000-year-old Koodiyattam Sanskrit theatre!"
      };
    }
    if (userState === 'Assam' || userTradition.includes('Bihu')) {
      return {
        transcript: "ব’হাগৰ বিহুৰ ৰঙেৰে ৰঙালী বসন্তৰ ধোল আৰু পেপাৰ সুৰীয়া ধ্বনি।",
        translation: "The melodious resonance of the Dhol drum and Pepa buffalo-horn flute celebrating Rongali Bihu!"
      };
    }
    // Default Marathi / Maharashtra Powada
    return {
      transcript: "शिवछत्रपतींचे नाव गाजे, गडकिल्ल्यांवर भगवा साजे... तुंतुन्याची तार वाजे!",
      translation: "The name of Chhatrapati Shivaji resounds across hill forts... As the Tuntuna vibrates, the balladeer roars!"
    };
  };

  const dynamicSpeechData = getDynamicTranscript();

  // Start Voice Recording
  const startRecording = async () => {
    setIsRecording(true);
    setShowRecordingResult(false);
    setRecordingTime(0);

    // Try requesting actual browser microphone stream if available
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        if (window.MediaRecorder) {
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          recorder.start();
        }
      }
    } catch (err) {
      console.warn('Microphone access fallback to studio timer:', err.message);
    }

    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  // Stop Recording
  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }

    setShowRecordingResult(true);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Save Record to Archive
  const handleSaveToArchive = () => {
    const newItem = {
      id: `kn-${Date.now()}`,
      title: `${userTradition} Oral Composition (${userName})`,
      tradition: userTradition,
      practitioner: userName,
      type: "Voice Recording + Auto Metadata",
      language: `${userState} Regional Dialect`,
      duration: `${recordingTime > 0 ? recordingTime : 14} secs`,
      date: new Date().toISOString().split('T')[0],
      tags: [userState, userTradition.split(' ')[0], "Oral Heritage", "Studio Recording"],
      consent: selectedConsent,
      transcriptExcerpt: dynamicSpeechData.transcript,
      englishTranslation: dynamicSpeechData.translation
    };

    if (onAddArchivedItem) {
      onAddArchivedItem(newItem);
    }
    
    setShowRecordingResult(false);
    setRecordingTime(0);
  };

  // Play audio transcript out loud via Speech Synthesis
  const handlePlayAudio = (item) => {
    if (playingId === item.id) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(item.id);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${item.title}. ${item.englishTranslation}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <Mic className="w-5 h-5 text-[#104333]" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl md:text-2xl font-bold text-stone-900">
                AI-Assisted Knowledge Documentation Vault
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                Consent-Based Audio Archiving • Speech-to-Text Pipeline • Metadata Auto-Tagging
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Strict Practitioner Consent Verification</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Oral Knowledge Studio */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-center">
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-extrabold tracking-wider text-stone-400">
                Oral Knowledge Studio
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>Ready ({userName.split(' ')[0]})</span>
              </span>
            </div>

            {/* Live Waveform & Meter */}
            <div className="h-32 bg-stone-900 rounded-2xl border border-stone-800 flex flex-col items-center justify-center gap-2 px-4 relative overflow-hidden text-white shadow-inner">
              {isRecording ? (
                <>
                  <div className="flex items-end gap-1.5 h-16 w-full justify-center">
                    {[40, 70, 30, 90, 50, 80, 100, 60, 45, 85, 30, 95, 60, 75, 40, 80, 50, 90].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-emerald-500 via-amber-400 to-red-500 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse flex items-center gap-1">
                    <span>● LIVE AUDIO CAPTURE IN PROGRESS</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-stone-400 space-y-1">
                  <Volume2 className="w-8 h-8 mx-auto stroke-1 text-amber-400" />
                  <span className="text-xs font-medium block text-stone-300">Click button below to start audio capture</span>
                  <span className="text-[10px] text-stone-500 block">Records oral folklore & translates automatically</span>
                </div>
              )}
            </div>

            {/* Timer Output */}
            <div className="font-mono text-2xl font-bold text-stone-900 tracking-wider">
              00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center pt-1">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-amber-300" />
                  <span>Start Voice Recording</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop & Process Audio</span>
                </button>
              )}
            </div>

          </div>

          {/* AI Speech-to-Text Pipeline Output Card */}
          {showRecordingResult && (
            <div className="bg-white p-6 rounded-3xl border border-amber-300 shadow-md space-y-4 bg-gradient-to-br from-white to-amber-50/50 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>AI Speech-to-Text Pipeline Output</span>
                </div>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  Auto-Processed
                </span>
              </div>

              <div className="space-y-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Speech-to-Text Transcript ({userState}):</span>
                  <p className="text-stone-900 italic mt-0.5 font-serif font-medium">
                    "{dynamicSpeechData.transcript}"
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">English Translation:</span>
                  <p className="text-stone-800 mt-0.5 font-medium">
                    "{dynamicSpeechData.translation}"
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-stone-800 font-bold block">Select Knowledge Access Consent:</label>
                <select
                  value={selectedConsent}
                  onChange={(e) => setSelectedConsent(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="Public Educational Access">Public Educational Access</option>
                  <option value="Verified Community Access">Verified Community Access Only</option>
                  <option value="Apprentice-Only Access">Apprentice-Only Restricted Access</option>
                </select>
              </div>

              <button
                onClick={handleSaveToArchive}
                className="w-full py-3 rounded-2xl bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Save Record to Searchable Archive</span>
              </button>
            </div>
          )}

        </div>

        {/* Right: Archived Living Oral Compositions List */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-stone-500 px-1">
            <span>Archived Living Oral Compositions ({archivedItems.length})</span>
            <span className="text-[10px] text-stone-400 font-semibold">Pan-India Heritage Archive</span>
          </div>

          <div className="space-y-4">
            {archivedItems.map((item) => {
              const isCurrentlyPlaying = playingId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white p-5 sm:p-6 rounded-3xl border transition-all shadow-2xs space-y-3 ${
                    isCurrentlyPlaying ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-cinzel font-bold text-base text-stone-900 leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-semibold">
                        <span className="text-[#104333] font-bold">{item.practitioner}</span>
                        <span>• {item.tradition}</span>
                        <span>• {item.duration}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(item)}
                      className={`flex items-center justify-center w-11 h-11 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                        isCurrentlyPlaying 
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md animate-pulse' 
                          : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                      }`}
                      title={isCurrentlyPlaying ? "Pause Audio" : "Play Audio Transcript"}
                    >
                      {isCurrentlyPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 text-[#104333]" />}
                    </button>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
                    <p className="text-stone-900 font-serif italic text-sm">
                      "{item.transcriptExcerpt}"
                    </p>
                    <p className="text-stone-600 text-xs font-medium">
                      Translation: "{item.englishTranslation}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-stone-100 text-xs font-medium">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-stone-700 bg-stone-100 px-2.5 py-1 rounded-xl border border-stone-200 text-[11px] font-semibold">
                          <Tag className="w-3 h-3 text-[#104333]" />
                          {t}
                        </span>
                      ))}
                    </div>

                    <span className="text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-[11px]">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      {item.consent}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
