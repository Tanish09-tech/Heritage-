import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Lock, CheckCircle2, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function ChatModal({ 
  application, 
  currentUser, 
  onClose,
  onStatusChange 
}) {
  const [messages, setMessages] = useState(application?.messages || []);
  const [status, setStatus] = useState(application?.status || 'PENDING');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const isLearner = currentUser?.role === 'LEARNER';
  const isPractitioner = currentUser?.role === 'PRACTITIONER';
  const otherPartyName = isLearner 
    ? (application?.practitionerName || 'Guru') 
    : (application?.learnerName || 'Shishya');
  const traditionName = application?.tradition || 'Living Heritage Tradition';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (application?.id) {
      fetchMessages();
    }
  }, [application?.id]);

  const fetchMessages = async () => {
    if (!application?.id) return;
    try {
      const res = await api.getMessages(application.id);
      if (res.messages) {
        setMessages(res.messages);
      }
      if (res.status) {
        setStatus(res.status);
      }
    } catch (err) {
      console.warn('Failed to fetch messages:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    if (status !== 'ACCEPTED') {
      alert('Chat is locked until the Guru approves this apprenticeship request.');
      return;
    }

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender: currentUser?.name || (isLearner ? 'Shishya' : 'Guru'),
      senderRole: isLearner ? 'LEARNER' : 'PRACTITIONER',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await api.sendMessage(application.id, {
        sender: tempMsg.sender,
        senderRole: tempMsg.senderRole,
        text: textToSend
      });
      if (res.chatMessage) {
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.chatMessage : m));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await api.respondToLearnerRequest(application.id, 'ACCEPTED');
      setStatus('ACCEPTED');
      if (onStatusChange) onStatusChange(application.id, 'ACCEPTED');
    } catch (err) {
      console.error('Failed to approve request:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col h-[560px] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#2e3e55] text-white p-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm shadow-xs">
              {otherPartyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm leading-snug">{otherPartyName}</h3>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                  status === 'ACCEPTED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                }`}>
                  {status === 'ACCEPTED' ? '✓ Connected Guru & Shishya' : '⏳ Pending Approval'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                {traditionName} Gurukul Mentorship
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lock Banner if PENDING */}
        {status !== 'ACCEPTED' && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 px-4 flex items-center justify-between text-xs text-amber-900 shrink-0">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isLearner 
                  ? 'Request Sent. Direct chat will unlock once the Guru approves your request.'
                  : 'Pending apprentice request. Approve this request to start chatting.'}
              </span>
            </div>
            {isPractitioner && (
              <button
                onClick={handleApprove}
                className="px-3 py-1 bg-[#133e31] text-white font-bold rounded-lg hover:bg-[#0e2d23] transition text-[11px] shrink-0"
              >
                Approve Now
              </button>
            )}
          </div>
        )}

        {/* Messages List Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfaf6]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-stone-300" />
              <p className="text-xs font-medium">No messages yet.</p>
              {status === 'ACCEPTED' && (
                <p className="text-[11px] text-stone-500">Send your first message to begin learning!</p>
              )}
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = (isLearner && msg.senderRole === 'LEARNER') || (isPractitioner && msg.senderRole === 'PRACTITIONER');

              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-stone-400 mb-1 px-1">
                    {msg.sender} • {msg.senderRole === 'LEARNER' ? 'Shishya' : 'Guru'}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                      isMine
                        ? 'bg-[#133e31] text-white rounded-br-none'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span className="text-[9px] text-stone-400 mt-1 px-1">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={status !== 'ACCEPTED'}
            placeholder={
              status === 'ACCEPTED'
                ? `Type message to ${otherPartyName}...`
                : "Chat disabled until request is approved..."
            }
            className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
          />

          <button
            type="submit"
            disabled={status !== 'ACCEPTED' || !inputText.trim() || sending}
            className="px-4 py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] disabled:bg-stone-300 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
}
