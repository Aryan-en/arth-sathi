import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Landing from './components/Landing';
import Translator from './components/Translator';
import Chatbot from './components/Chatbot';
import Blog from './components/Blog';
import Ledger from './components/Ledger';
import LoginModal from './components/LoginModal';
import { LANGUAGE_DATA, OFFLINE_RESPONSES } from './data/languageData';

function App() {
  const [view, setView] = useState('landing');
  const [activeLang, setActiveLang] = useState('haryanvi');
  const [direction, setDirection] = useState('eng-to-target');
  const [currentText, setCurrentText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      recognitionRef.current = rec;
    }
  }, []);

  function showLanding() { setView('landing'); window.scrollTo(0,0); }
  function launchApp(mode) { setView(mode); }
  function toggleModal() { setShowLogin(v => !v); }
  function changeLanguage(lang) { setActiveLang(lang); }
  function toggleDirection() { setDirection(d => d === 'eng-to-target' ? 'target-to-eng' : 'eng-to-target'); }

  async function handleTranslate(text) {
    if (!text) return null;
    const source = direction === 'eng-to-target' ? 'English' : LANGUAGE_DATA[activeLang].prompt;
    const target = direction === 'eng-to-target' ? LANGUAGE_DATA[activeLang].prompt : 'English';
    try {
      if(!apiKey) throw new Error('No API Key');
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Translate "${text}" from ${source} to ${target}. Output ONLY translated text.` }] }] })
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message || 'API error');
      const res = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setCurrentText(res);
      return res;
    } catch (e) {
      // offline fallback using simple dictionary
      let res = text;
      const dict = LANGUAGE_DATA[activeLang].dictionary;
      Object.keys(dict).forEach(k => {
        if (text.toLowerCase().includes(k)) {
          res = res.replace(new RegExp(k, 'gi'), dict[k]);
        }
      });
      if (res === text) res = 'Translation unavailable offline.';
      setCurrentText(res + ' (Offline)');
      return res + ' (Offline)';
    }
  }

  async function handleChat(text) {
    if(!text) return null;
    try {
      if(!apiKey) throw new Error('No API Key');
      const systemPrompt = `You are 'Sahayak', a helpful rural financial assistant. Answer in ${LANGUAGE_DATA[activeLang].prompt}. Keep it short. User: ${text}`;
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
      });
      const data = await resp.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return botText;
    } catch (e) {
      // offline fallback
      let reply = OFFLINE_RESPONSES.default;
      const lower = text.toLowerCase();
      for (const [k,v] of Object.entries(OFFLINE_RESPONSES.keywords)) {
        if (lower.includes(k)) { reply = v; break; }
      }
      return reply + ' (Offline)';
    }
  }

  return (
    <div className="App">
      <Header onLaunch={launchApp} onShowLanding={showLanding} onToggleModal={toggleModal} />

      {view === 'landing' && <Landing onLaunch={launchApp} onOpenLogin={toggleModal} />}
      {view === 'translator' && <Translator
        activeLang={activeLang}
        changeLanguage={changeLanguage}
        direction={direction}
        toggleDirection={toggleDirection}
        handleTranslate={handleTranslate}
        currentText={currentText}
        recognitionRef={recognitionRef}
      />}

      {view === 'chatbot' && <Chatbot activeLang={activeLang} handleChat={handleChat} recognitionRef={recognitionRef} />}

      {view === 'blog' && <Blog />}

      {view === 'ledger' && <Ledger />}

      <LoginModal open={showLogin} onClose={toggleModal} onLogin={() => { toggleModal(); launchApp('translator'); }} setApiKey={setApiKey} />
    </div>
  );
}

export default App;
