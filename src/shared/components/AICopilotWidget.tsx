'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { AiQueryResponse } from '@/modules/ai-assistant/ai.types';

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  response?: AiQueryResponse;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Summarize network bottlenecks & health',
  'How to mitigate Kanpur corridor congestion?',
  'Recommend special trains for festival surge',
  'List delayed trains and rerouting options',
];

export const AICopilotWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_initial',
      sender: 'AI',
      text: `Hello Controller. I am **RailSutra AI Copilot**. I am connected to the live operational state. Ask me anything about bottlenecks, train delays, or festival capacity optimization.`,
      timestamp: '08:30 IST',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`AI service returned ${res.statusText}`);
      }

      const data = await res.json();
      const aiResponseData: AiQueryResponse = data.data;

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        sender: 'AI',
        text: aiResponseData.answer,
        response: aiResponseData,
        timestamp: aiResponseData.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'AI',
          text: `⚠️ **Operational Notice**: AI Assistant request failed (${err.message}). Local simulation telemetry remains fully operational.`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Widget Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Bot size={16} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              RailSutra AI Copilot
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--color-primary-light)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                LIVE
              </span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Operational Decision Support (Gemini + Local Fallback)
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 500,
          }}
        >
          <Zap size={12} /> State Grounded
        </span>
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            style={{
              flexShrink: 0,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={11} style={{ color: 'var(--color-primary-light)' }} />
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Chat Feed */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '260px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
              maxWidth: msg.sender === 'USER' ? '80%' : '95%',
              backgroundColor: msg.sender === 'USER' ? 'var(--color-primary)' : 'var(--surface-secondary)',
              color: msg.sender === 'USER' ? '#ffffff' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '12px',
              lineHeight: 1.5,
              border: msg.sender === 'USER' ? 'none' : '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: msg.sender === 'USER' ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span>{msg.sender === 'USER' ? 'You' : 'AI Copilot'}</span>
              <span>{msg.timestamp}</span>
            </div>

            <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

            {/* Actionable Recommendations Pills */}
            {msg.response?.recommendations && msg.response.recommendations.length > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-primary-light)', textTransform: 'uppercase' }}>
                  Recommended Operational Actions:
                </div>
                {msg.response.recommendations.map((rec, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      backgroundColor: 'rgba(11, 22, 38, 0.6)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ChevronRight size={12} /> {rec.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px' }}>
                      {rec.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Provider Source Pill */}
            {msg.response && (
              <div style={{ marginTop: '6px', fontSize: '9px', color: 'var(--text-muted)' }}>
                Source: {msg.response.provider === 'GEMINI' ? '✨ Google Gemini 1.5 Flash' : '⚡ Local Operational Engine (Demo-Safe)'}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'var(--surface-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={14} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
            Evaluating railway network telemetry and operational recommendations...
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '4px',
        }}
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI Copilot (e.g. 'How to handle Kanpur congestion?')..."
          disabled={isLoading}
          style={{
            flex: 1,
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: inputQuery.trim() && !isLoading ? 'pointer' : 'not-allowed',
            opacity: inputQuery.trim() && !isLoading ? 1 : 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Send size={13} />
          Send
        </button>
      </form>
    </div>
  );
};
