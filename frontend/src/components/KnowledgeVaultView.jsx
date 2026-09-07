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
  Bot,
  Search,
  BookOpen,
  VolumeX,
  Languages
} from 'lucide-react';
import { retrieveKnowledgeChunk, KNOWLEDGE_CHUNKS } from '../services/knowledgeChunks';

export default function KnowledgeVaultView({ archivedItems = [], onAddArchivedItem, currentUser }) {
  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [spokenQuery, setSpokenQuery] = useState('');
  const [listeningTime, setListeningTime] = useState(0);
  
  // Knowledge Retrieval Chunk State
  const [retrievedChunk, setRetrievedChunk] = useState(null);
  const [selectedLang, setSelectedLang] = useState('en'); // 'en' | 'mr' | 'hi' | 'pb' | 'gu' | 'ml' | 'as'
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  
  // Pan-India Archive Playing State
  const [playingId, setPlayingId] = useState(null);
  const [selectedConsent, setSelectedConsent] = useState('Public Educational Access');

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Language options matching header selector
  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'pb', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'ml', label: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'as', label: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
  ];

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = selectedLang === 'mr' ? 'mr-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setSpokenQuery(currentTranscript);
        }
      };

      rec.onerror = (err) => {
        console.warn('Speech recognition notice:', err.error);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [selectedLang]);

  // Start Voice Listening
  const startListening = () => {
    setIsListening(true);
    setSpokenQuery('');
    setListeningTime(0);
    setRetrievedChunk(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }

    timerRef.current = setInterval(() => {
      setListeningTime(prev => prev + 1);
    }, 1000);
  };

  // Stop Listening & Chunk Retrieval from data.md
  const stopListeningAndProcess = (queryText) => {
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const textToSearch = queryText || spokenQuery || "Powada Shahiri Tukaram";
    setSpokenQuery(textToSearch);

    // Retrieve Chunk from data.md
    const chunk = retrieveKnowledgeChunk(textToSearch);
    setRetrievedChunk(chunk);

    // Speak AI Response
    speakAiBotAnswer(chunk, selectedLang);
  };

  // Quick Preset Sample Question click
  const handleSelectPresetQuery = (presetText) => {
    setSpokenQuery(presetText);
    stopListeningAndProcess(presetText);
  };

  // AI Voice Bot Speech Synthesis
  const speakAiBotAnswer = (chunk, langCode) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const targetText = chunk?.languagesAvailable[langCode] || chunk?.languagesAvailable['en'] || "Information retrieved successfully.";
    
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Set voice language code
    if (langCode === 'mr') utterance.lang = 'mr-IN';
    else if (langCode === 'hi') utterance.lang = 'hi-IN';
    else if (langCode === 'pb') utterance.lang = 'pa-IN';
    else if (langCode === 'gu') utterance.lang = 'gu-IN';
    else if (langCode === 'ml') utterance.lang = 'ml-IN';
    else if (langCode === 'as') utterance.lang = 'bn-IN';
    else utterance.lang = 'en-US';

    setIsBotSpeaking(true);
    utterance.onend = () => setIsBotSpeaking(false);
    utterance.onerror = () => setIsBotSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop Bot Speaking
  const stopBotSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsBotSpeaking(false);
  };

  // Handle Language Change
  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    if (retrievedChunk) {
      speakAiBotAnswer(retrievedChunk, newLang);
    }
  };

  // Save Retrieved Voice Record to Pan-India Archive
  const handleSaveRecord = () => {
    if (!retrievedChunk) return;

    const answerText = retrievedChunk.languagesAvailable[selectedLang] || retrievedChunk.languagesAvailable['en'];
    const newItem = {
      id: `kn-${Date.now()}`,
      title: `${retrievedChunk.tradition} (${retrievedChunk.state})`,
      tradition: retrievedChunk.tradition,
      practitioner: currentUser?.name || 'Master Practitioner',
      type: "Voice AI Query & Knowledge Retrieval",
      language: selectedLang.toUpperCase(),
      duration: `${listeningTime > 0 ? listeningTime : 8} secs`,
      date: new Date().toISOString().split('T')[0],
      tags: [retrievedChunk.state, "AI Retrieved", "Voice Archive", "data.md"],
      consent: selectedConsent,
      transcriptExcerpt: spokenQuery || "Voice Inquiry from User",
      englishTranslation: answerText
    };

    if (onAddArchivedItem) {
      onAddArchivedItem(newItem);
    }

    setRetrievedChunk(null);
    setSpokenQuery('');
  };

  // Play audio transcript from archive list
  const handlePlayArchiveAudio = (item) => {
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
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <Bot className="w-6 h-6 text-[#104333]" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
              AI Voice Knowledge Assistant & Documentation Vault
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Listen User Voice • Chunking & Retrieval from `data.md` • Multilingual Speaking Bot
            </p>
          </div>
        </div>

        {/* Global State Language Selector for Voice Bot */}
        <div className="flex items-center gap-2 bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200 text-xs font-bold text-stone-800">
          <Languages className="w-4 h-4 text-[#104333] shrink-0" />
          <span>Voice Bot Language:</span>
          <select
            value={selectedLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-white border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-900 focus:outline-hidden cursor-pointer shadow-2xs"
          >
            {languageOptions.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: AI Voice Input Studio */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-center">
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-extrabold tracking-wider text-stone-400 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#104333]" />
                <span>Voice Listening Studio</span>
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                isListening ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                <Radio className="w-3 h-3" />
                <span>{isListening ? 'Listening Voice...' : 'Mic Ready'}</span>
              </span>
            </div>

            {/* Audio Visualizer & Realtime Transcript Box */}
            <div className="min-h-32 bg-stone-900 rounded-2xl border border-stone-800 p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden text-white shadow-inner">
              {isListening ? (
                <>
                  <div className="flex items-end gap-1.5 h-12 w-full justify-center">
                    {[40, 80, 30, 95, 60, 85, 100, 70, 45, 90, 35, 95, 60, 80, 50, 85].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-red-500 via-amber-400 to-emerald-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-amber-300 font-serif italic text-center px-2">
                    "{spokenQuery || 'Listening to your query... speak now'}"
                  </div>
                </>
              ) : (
                <div className="text-center text-stone-300 space-y-1">
                  <Bot className="w-9 h-9 mx-auto text-amber-400 stroke-1" />
                  <span className="text-xs font-semibold block text-stone-200">
                    Click "Start Voice Listening" & Ask Any Question
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    e.g. "Tell me about Powada", "What is Warli Art?", "Explain Baisakhi Gatka"
                  </span>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="font-mono text-xl font-bold text-stone-800 tracking-wider">
              00:{listeningTime < 10 ? `0${listeningTime}` : listeningTime}
            </div>

            {/* Listening Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>Start Voice Listening</span>
                </button>
              ) : (
                <button
                  onClick={() => stopListeningAndProcess(spokenQuery)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop & Retrieve Chunk Answer</span>
                </button>
              )}
            </div>

            {/* Sample Voice Question Chips */}
            <div className="pt-3 border-t border-stone-100 text-left space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Or Select Sample Voice Questions (`data.md` Chunks):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Tell me about Powada & Shahir Tukaram",
                  "What is Warli Art & Tarpa ritual?",
                  "Explain Baisakhi & Gatka martial art",
                  "What is Bhavai Folk Theatre & Garba?",
                  "Explain Koodiyattam Sanskrit Theatre",
                  "What is Rongali Bihu of Assam?"
                ].map((qText) => (
                  <button
                    key={qText}
                    type="button"
                    onClick={() => handleSelectPresetQuery(qText)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 text-stone-700 font-semibold transition cursor-pointer"
                  >
                    🎤 {qText}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* AI Bot Output & Chunk Retrieval Card */}
          {retrievedChunk && (
            <div className="bg-white p-6 rounded-3xl border border-amber-300 shadow-md space-y-4 bg-gradient-to-br from-white via-amber-50/30 to-emerald-50/20 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <Bot className="w-4.5 h-4.5 text-[#104333]" />
                  <span>AI Bot Retrieved Chunk Answer</span>
                </div>
                <div className="flex items-center gap-1">
                  {isBotSpeaking ? (
                    <button
                      onClick={stopBotSpeaking}
                      className="flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 cursor-pointer animate-pulse"
                    >
                      <VolumeX className="w-3 h-3" /> Stop Speaking
                    </button>
                  ) : (
                    <button
                      onClick={() => speakAiBotAnswer(retrievedChunk, selectedLang)}
                      className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 cursor-pointer hover:bg-emerald-200"
                    >
                      <Volume2 className="w-3 h-3 text-emerald-700" /> Speak Answer
                    </button>
                  )}
                </div>
              </div>

              {/* Chunk Details */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-cinzel text-sm font-bold text-[#104333]">
                    {retrievedChunk.tradition}
                  </span>
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-bold">
                    {retrievedChunk.state}
                  </span>
                </div>

                {/* Spoken Answer in Selected Language */}
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    AI Bot Answer ({languageOptions.find(l => l.code === selectedLang)?.label}):
                  </span>
                  <p className="text-stone-900 text-xs mt-1 font-serif leading-relaxed font-semibold">
                    "{retrievedChunk.languagesAvailable[selectedLang] || retrievedChunk.languagesAvailable['en']}"
                  </p>
                </div>
              </div>

              {/* Consent Selection & Save */}
              <div className="space-y-2 pt-1">
                <label className="text-xs text-stone-800 font-bold block">Knowledge Access Consent:</label>
                <select
                  value={selectedConsent}
                  onChange={(e) => setSelectedConsent(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="Public Educational Access">Public Educational Access</option>
                  <option value="Verified Community Access">Verified Community Access Only</option>
                  <option value="Apprentice-Only Access">Apprentice-Only Restricted Access</option>
                </select>

                <button
                  onClick={handleSaveRecord}
                  className="w-full py-3 rounded-2xl bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Save Record to Searchable Archive</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right: Pan-India Archive & Retrieved Audio Records */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between text-xs font-bold uppercase text-stone-500 px-1">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#104333]" />
              <span>Archived Living Oral Compositions ({archivedItems.length})</span>
            </span>
            <span className="text-[10px] text-stone-400 font-semibold">Pan-India Archive (`data.md`)</span>
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
                      onClick={() => handlePlayArchiveAudio(item)}
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
                    <p className="text-stone-900 font-serif italic text-xs sm:text-sm">
                      "{item.transcriptExcerpt}"
                    </p>
                    <p className="text-stone-700 text-xs font-medium">
                      Translation / Answer: "{item.englishTranslation}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-stone-100 text-xs font-medium">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.tags?.map((t, idx) => (
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
