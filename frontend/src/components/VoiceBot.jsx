import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Languages, ChevronDown, Gauge } from 'lucide-react';

// ─── Supported Languages ────────────────────────────────────────────────────────
export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'mr-IN', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
  { code: 'as-IN', label: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
  { code: 'ur-PK', label: 'اردو (Urdu)', flag: '🇮🇳' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
  { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja-JP', label: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'zh-CN', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ar-SA', label: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
];

const SPEED_OPTIONS = [1, 1.25, 1.5];

// ─── VoiceBot / Read Aloud Component ───────────────────────────────────────────
export default function VoiceBot({ textToRead, tradition, selectedLang: externalLang, onLanguageChange }) {
  const [internalLang, setInternalLang] = useState(SUPPORTED_LANGUAGES[0]);
  const currentLang = externalLang || internalLang;

  const [speechSpeed, setSpeechSpeed] = useState(1.5);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const langDropdownRef = useRef(null);
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const sentenceQueueRef = useRef([]);
  const isCancelledRef = useRef(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const stopSpeaking = useCallback(() => {
    isCancelledRef.current = true;
    sentenceQueueRef.current = [];
    if (ttsSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Speech cancel error:', e);
      }
    }
    setIsReading(false);
  }, [ttsSupported]);

  // Listen to global stop event to halt any other VoiceBot instances
  useEffect(() => {
    const handleGlobalStop = () => stopSpeaking();
    window.addEventListener('sanskriti-stop-tts', handleGlobalStop);
    return () => {
      window.removeEventListener('sanskriti-stop-tts', handleGlobalStop);
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // ─── Sentence-Chunked TTS Engine (Speed-aware Read Aloud) ────────────────────
  const speakText = useCallback((text, langCode, targetSpeed) => {
    if (!ttsSupported || !text || !text.trim()) return;

    // Stop any other active reading on the page
    window.dispatchEvent(new CustomEvent('sanskriti-stop-tts'));
    stopSpeaking();

    // Reset cancellation flag for this new reading session
    isCancelledRef.current = false;

    const targetLangCode = langCode || currentLang.code;
    const speedRate = targetSpeed ?? speechSpeed;
    const cleanText = text.replace(/[*_#`~]/g, '').trim();

    // Chunk text into sentences to prevent browser TTS timeout on long passages
    const sentences = cleanText
      .split(/(?<=[.!?।\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (sentences.length === 0) return;

    let currentIndex = 0;
    setIsReading(true);

    const speakNextSentence = () => {
      if (isCancelledRef.current || currentIndex >= sentences.length) {
        setIsReading(false);
        return;
      }

      const currentSentence = sentences[currentIndex];
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.lang = targetLangCode;
      utterance.rate = speedRate;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Select matching voice for language
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langPrefix = targetLangCode.split('-')[0];
        const exactMatch = voices.find(v => v.lang === targetLangCode);
        const prefixMatch = voices.find(v => v.lang.startsWith(langPrefix));
        const defaultMatch = voices.find(v => v.lang.startsWith('en'));
        
        if (exactMatch) utterance.voice = exactMatch;
        else if (prefixMatch) utterance.voice = prefixMatch;
        else if (defaultMatch) utterance.voice = defaultMatch;
      }

      utterance.onend = () => {
        if (isCancelledRef.current) {
          setIsReading(false);
          return;
        }
        currentIndex++;
        speakNextSentence();
      };

      utterance.onerror = (err) => {
        if (isCancelledRef.current) {
          setIsReading(false);
          return;
        }
        console.warn('TTS utterance error:', err);
        currentIndex++;
        speakNextSentence();
      };

      window.speechSynthesis.speak(utterance);
    };

    // Ensure voices are loaded before speaking
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        if (!isCancelledRef.current) speakNextSentence();
      };
    } else {
      speakNextSentence();
    }
  }, [currentLang.code, speechSpeed, ttsSupported, stopSpeaking]);

  const handleReadSection = () => {
    if (isReading) {
      stopSpeaking();
      return;
    }
    const text = textToRead || currentTraditionDescription(tradition);
    speakText(text, currentLang.code, speechSpeed);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeechSpeed(newSpeed);
    if (isReading) {
      const text = textToRead || currentTraditionDescription(tradition);
      speakText(text, currentLang.code, newSpeed);
    }
  };

  const handleLangSelect = (lang) => {
    stopSpeaking();
    if (onLanguageChange) {
      onLanguageChange(lang);
    } else {
      setInternalLang(lang);
    }
    setIsLangOpen(false);
  };

  function currentTraditionDescription(t) {
    if (!t) return 'This section contains living heritage tradition details.';
    return t.description || `${t.name} is an indigenous heritage tradition from ${t.state || 'India'}.`;
  }

  return (
    <div style={{ fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      
      {/* ── Language Selector Dropdown ───────────────────────────────────── */}
      <div ref={langDropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setIsLangOpen(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '20px',
            background: '#f5f3ff', border: '1.5px solid #c4b5fd',
            cursor: 'pointer', fontSize: '11px', fontWeight: 700,
            color: '#4c1d95', transition: 'all 0.15s',
            boxShadow: '0 1px 3px rgba(124, 58, 237, 0.08)'
          }}
          title="Select language for translation & read aloud"
        >
          <Languages style={{ width: 13, height: 13, color: '#7c3aed' }} />
          <span>{currentLang.flag} {currentLang.label}</span>
          <ChevronDown style={{
            width: 12, height: 12, color: '#7c3aed',
            transform: isLangOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s'
          }} />
        </button>

        {isLangOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 9999,
            background: 'white', borderRadius: 12, boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
            border: '1.5px solid #e5e7eb', minWidth: 210, overflow: 'hidden'
          }}>
            <div style={{
              padding: '8px 12px 6px', fontSize: 10, fontWeight: 700,
              color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em',
              borderBottom: '1px solid #f3f4f6', background: '#fafafa'
            }}>
              Select Language
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLangSelect(lang)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', textAlign: 'left', padding: '8px 12px',
                    fontSize: 11, fontWeight: currentLang.code === lang.code ? 700 : 500,
                    color: currentLang.code === lang.code ? '#5b21b6' : '#374151',
                    background: currentLang.code === lang.code ? '#ede9fe' : 'transparent',
                    border: 'none', cursor: 'pointer', transition: 'background 0.1s'
                  }}
                  onMouseEnter={e => { if (currentLang.code !== lang.code) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={e => { if (currentLang.code !== lang.code) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 14 }}>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Read / Stop Button ────────────────────────────────────────────── */}
      {ttsSupported && (
        <button
          onClick={handleReadSection}
          title={isReading ? 'Stop reading' : `Read text in ${currentLang.label} at ${speechSpeed}× speed`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 20,
            background: isReading ? '#dc2626' : '#ecfdf5',
            border: `1.5px solid ${isReading ? '#dc2626' : '#34d399'}`,
            color: isReading ? '#ffffff' : '#065f46',
            cursor: 'pointer', fontSize: 11, fontWeight: 700,
            transition: 'all 0.2s ease',
            boxShadow: isReading ? '0 0 12px rgba(220, 38, 38, 0.4)' : '0 1px 3px rgba(5, 150, 105, 0.1)'
          }}
        >
          {isReading ? (
            <>
              <VolumeX style={{ width: 14, height: 14 }} />
              <span>Stop</span>
              {/* Soundwave animation */}
              <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 12, marginLeft: 2 }}>
                {[8, 12, 6, 14, 9].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: 2,
                      height: `${h}px`,
                      background: '#ffffff',
                      borderRadius: 1,
                      animation: 'voiceBotSoundwave 0.5s ease-in-out infinite alternate',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </span>
            </>
          ) : (
            <>
              <Volume2 style={{ width: 14, height: 14, color: '#059669' }} />
              <span>Read</span>
            </>
          )}
        </button>
      )}

      {/* ── Speed Selector Options (1x, 1.25x, 1.5x) ────────────────────────── */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#f1f5f9',
        borderRadius: '20px',
        padding: '2px',
        border: '1.5px solid #cbd5e1',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
      }}>
        <Gauge style={{ width: 12, height: 12, color: '#64748b', marginLeft: 6, marginRight: 2 }} />
        {SPEED_OPTIONS.map(speed => (
          <button
            key={speed}
            onClick={() => handleSpeedChange(speed)}
            style={{
              padding: '3px 8px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              background: speechSpeed === speed ? '#059669' : 'transparent',
              color: speechSpeed === speed ? '#ffffff' : '#475569',
              transition: 'all 0.15s ease',
              boxShadow: speechSpeed === speed ? '0 1px 3px rgba(0,0,0,0.15)' : 'none'
            }}
            title={`Set reading speed to ${speed}x`}
          >
            {speed}x
          </button>
        ))}
      </div>

      <style>{`
        @keyframes voiceBotSoundwave {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}


