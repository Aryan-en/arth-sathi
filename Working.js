// =================================================================
        //  STEP 1: PASTE YOUR GOOGLE GEMINI API KEY BELOW (INSIDE QUOTES)
        // =================================================================
        const apiKey = ""; 
        // =================================================================

        const LANGUAGE_DATA = {
            haryanvi: {
                name: "Haryanvi", color: "orange", voice: "hi-IN", prompt: "Haryanvi (Desi dialect)",
                dictionary: { "i": "manne", "my": "mhara", "money": "pisa", "loan": "karza", "bank": "bank", "interest": "byaaj", "scheme": "skeem", "farmer": "kisaan" },
                phrases: ["Money for seeds", "Where is the bank?", "Interest rate", "Government scheme"]
            },
            bhojpuri: {
                name: "Bhojpuri", color: "purple", voice: "hi-IN", prompt: "Bhojpuri language",
                dictionary: { "i": "ham", "my": "hamar", "money": "paisa", "loan": "karja", "bank": "bank", "interest": "sud", "scheme": "yojna", "farmer": "kisan" },
                phrases: ["Biya khatir paisa", "Bank kaha ba?", "Byaaj dar", "Sarkari yojna"]
            },
            tamil: {
                name: "Tamil", color: "rose", voice: "ta-IN", prompt: "Tamil language",
                dictionary: { "i": "naan", "money": "panam", "loan": "kadan", "bank": "vanki", "interest": "vatti", "scheme": "thittam", "farmer": "vivasaayi" },
                phrases: ["Vithaigalukku panam", "Vanki enge?", "Vatti vigitham", "Arasu thittam"]
            }
        };

        const OFFLINE_RESPONSES = {
            default: "Offline Mode: Contact bank manager for details.",
            keywords: { "loan": "KCC loan is best (7% interest).", "kcc": "Kisan Credit Card gives loans at low interest.", "bank": "Bank opens at 10 AM. Carry Aadhaar." }
        };

        let activeLang = 'haryanvi';
        let direction = 'eng-to-target';
        let currentText = "";
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
        }

        // --- UI FUNCTIONS ---
        function showLanding() {
            document.getElementById('landing-page').style.display = 'flex';
            document.getElementById('app-interface').classList.add('hidden');
            window.scrollTo(0, 0);
            updateStatus();
        }

        function launchApp(mode) {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('app-interface').classList.remove('hidden');
            switchTab(mode);
            updateUI();
            updateStatus();
            if(mode === 'ledger') renderLedger();
        }

        function toggleModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal.classList.contains('opacity-0')) {
                modal.classList.remove('opacity-0', 'pointer-events-none');
                modal.querySelector('div').classList.remove('scale-95');
                modal.querySelector('div').classList.add('scale-100');
            } else {
                modal.classList.add('opacity-0', 'pointer-events-none');
                modal.querySelector('div').classList.remove('scale-100');
                modal.querySelector('div').classList.add('scale-95');
            }
        }

        function updateStatus() {
            const statusEl = document.getElementById('ai-status');
            const dot = statusEl.previousElementSibling;
            if(apiKey && apiKey.length > 5) {
                statusEl.innerText = "Online (AI Active)";
                statusEl.classList.remove('text-red-200');
                dot.classList.remove('bg-red-400');
                dot.classList.add('bg-green-400');
            } else {
                statusEl.innerText = "Offline Mode";
                statusEl.classList.add('text-red-200');
                dot.classList.remove('bg-green-400');
                dot.classList.add('bg-red-400');
            }
        }

        function switchTab(mode) {
            const tabs = ['translator', 'chatbot', 'blog', 'ledger'];
            tabs.forEach(t => {
                const view = document.getElementById(`view-${t}`);
                if (t === mode) view.classList.remove('hidden');
                else view.classList.add('hidden');
            });
        }

        function changeLanguage() {
            activeLang = document.getElementById('language-select').value;
            updateUI();
        }

        function updateUI() {
            const data = LANGUAGE_DATA[activeLang];
            document.getElementById('label-target').innerText = data.name;
            
            const phraseContainer = document.getElementById('quick-phrases');
            phraseContainer.innerHTML = '';
            data.phrases.forEach(p => {
                const btn = document.createElement('button');
                btn.className = "px-4 py-2 bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-200 rounded-xl text-sm font-medium text-slate-600 transition shadow-sm";
                btn.innerText = p;
                btn.onclick = () => { document.getElementById('input-text').value = p; };
                phraseContainer.appendChild(btn);
            });
        }

        function toggleDirection() {
            direction = direction === 'eng-to-target' ? 'target-to-eng' : 'eng-to-target';
            const s = document.getElementById('label-source');
            const t = document.getElementById('label-target');
            const tempText = s.innerText;
            const tempClass = s.className;
            
            s.innerText = t.innerText;
            s.className = t.className;
            t.innerText = tempText;
            t.className = tempClass;
            
            document.getElementById('input-text').value = '';
            document.getElementById('output-text').innerHTML = `
            <div class="text-slate-300 flex flex-col items-center">
                <div class="bg-white p-4 rounded-full shadow-sm mb-3">
                    <i class="fas fa-magic text-2xl text-slate-200"></i>
                </div>
                <span class="text-sm font-medium">Translation will appear here</span>
            </div>`;
        }

        function toggleLike(btn) {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-red-500');
                btn.classList.add('text-red-500');
            } else {
                icon.classList.remove('fas', 'text-red-500');
                icon.classList.add('far');
                btn.classList.remove('text-red-500');
            }
        }

        // --- LEDGER LOGIC ---
        function getLedgerData() {
            return JSON.parse(localStorage.getItem('gramin_ledger_data')) || [];
        }

        function saveLedgerData(data) {
            localStorage.setItem('gramin_ledger_data', JSON.stringify(data));
            renderLedger();
        }

        function addTransaction() {
            const type = document.getElementById('transaction-type').value;
            const itemInput = document.getElementById('trans-item');
            const amountInput = document.getElementById('trans-amount');
            const item = itemInput.value.trim();
            const amount = parseFloat(amountInput.value);

            if (item && amount) {
                const data = getLedgerData();
                data.unshift({
                    id: Date.now(),
                    type: type, // 'income' or 'expense'
                    item: item,
                    amount: amount,
                    date: new Date().toLocaleDateString()
                });
                saveLedgerData(data);
                itemInput.value = '';
                amountInput.value = '';
            }
        }

        function deleteExpense(id) {
            const data = getLedgerData();
            const newData = data.filter(entry => entry.id !== id);
            saveLedgerData(newData);
        }

        function renderLedger() {
            const data = getLedgerData();
            const listEl = document.getElementById('ledger-list');
            const incEl = document.getElementById('ledger-income');
            const expEl = document.getElementById('ledger-expense');
            const balEl = document.getElementById('ledger-balance');
            
            let totalIncome = 0;
            let totalExpense = 0;
            listEl.innerHTML = '';

            if (data.length === 0) {
                listEl.innerHTML = '<div class="text-center text-slate-400 py-10 flex flex-col items-center"><div class="bg-slate-50 p-4 rounded-full mb-3"><i class="fas fa-clipboard-list text-2xl text-slate-300"></i></div><span>No transactions yet.</span></div>';
            } else {
                data.forEach(entry => {
                    if(entry.type === 'income') totalIncome += entry.amount;
                    else totalExpense += entry.amount;

                    const isIncome = entry.type === 'income';
                    const el = document.createElement('div');
                    el.className = 'bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition';
                    el.innerHTML = `
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}">
                                <i class="fas ${isIncome ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-700">${entry.item}</h4>
                                <p class="text-xs text-slate-400 capitalize">${entry.date} • ${entry.type}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="font-bold ${isIncome ? 'text-green-600' : 'text-red-500'}">${isIncome ? '+' : '-'} ₹${entry.amount}</span>
                            <button onclick="deleteExpense(${entry.id})" class="text-slate-300 hover:text-red-500 transition"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                    listEl.appendChild(el);
                });
            }
            
            incEl.innerText = totalIncome;
            expEl.innerText = totalExpense;
            balEl.innerText = totalIncome - totalExpense;
        }

        // --- VOICE & LOGIC ---
        function startVoiceTranslation() {
            if (!recognition) { alert("Voice not supported."); return; }
            const isEnglish = direction === 'eng-to-target';
            recognition.lang = isEnglish ? 'en-US' : LANGUAGE_DATA[activeLang].voice;
            const btn = document.getElementById('mic-translator');
            btn.classList.add('mic-active');
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                document.getElementById('input-text').value = transcript;
                btn.classList.remove('mic-active');
                handleTranslate();
            };
            recognition.onend = function() { btn.classList.remove('mic-active'); };
            recognition.start();
        }

        function startVoiceChat() {
            if (!recognition) { alert("Voice not supported."); return; }
            recognition.lang = 'en-US'; 
            const btn = document.getElementById('mic-chatbot');
            btn.classList.add('mic-active');
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chat-input').value = transcript;
                btn.classList.remove('mic-active');
                handleChat();
            };
            recognition.onend = function() { btn.classList.remove('mic-active'); };
            recognition.start();
        }

        async function handleTranslate() {
            const text = document.getElementById('input-text').value.trim();
            if(!text) return;
            const outputDiv = document.getElementById('output-text');
            outputDiv.innerHTML = '<div class="flex flex-col items-center"><i class="fas fa-spinner fa-spin text-3xl text-primary mb-2"></i><span class="text-sm text-slate-400">Translating...</span></div>';

            const source = direction === 'eng-to-target' ? 'English' : LANGUAGE_DATA[activeLang].prompt;
            const target = direction === 'eng-to-target' ? LANGUAGE_DATA[activeLang].prompt : 'English';

            try {
                if(!apiKey) throw new Error("No API Key");
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: `Translate "${text}" from ${source} to ${target}. Output ONLY translated text.` }] }] })
                });
                const data = await response.json();
                if(data.error) throw new Error(data.error.message);
                currentText = data.candidates[0].content.parts[0].text;
                outputDiv.innerText = currentText;
            } catch (e) {
                // Offline Logic
                let res = text;
                const dict = LANGUAGE_DATA[activeLang].dictionary;
                Object.keys(dict).forEach(k => {
                    if(text.toLowerCase().includes(k)) res = res.replace(new RegExp(k, 'gi'), dict[k]);
                });
                if(res === text) res = "Translation unavailable offline.";
                currentText = res;
                outputDiv.innerText = res + " (Offline)";
            }
        }

        function setChat(txt) { document.getElementById('chat-input').value = txt; }

        async function handleChat() {
            const input = document.getElementById('chat-input');
            const text = input.value.trim();
            if(!text) return;
            
            const history = document.getElementById('chat-history');
            
            // User Msg
            history.innerHTML += `
            <div class="flex justify-end">
                <div class="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-br-none shadow-md text-sm leading-relaxed max-w-[85%]">
                    ${text}
                </div>
            </div>`;
            input.value = '';
            history.scrollTop = history.scrollHeight;

            // Bot Response
            try {
                let botText = "";
                if(!apiKey) throw new Error("No API Key");
                const systemPrompt = `You are 'Sahayak', a helpful rural financial assistant. Answer in ${LANGUAGE_DATA[activeLang].prompt}. Keep it short. User: ${text}`;
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
                });
                const data = await response.json();
                botText = data.candidates[0].content.parts[0].text;

                history.innerHTML += `
                <div class="flex justify-start">
                    <div class="flex items-end gap-2 max-w-[85%]">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-xs shadow-md"><i class="fas fa-robot"></i></div>
                        <div class="bg-white text-slate-700 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 text-sm leading-relaxed">
                            ${botText} <br>
                            <button onclick="speakText('${botText.replace(/'/g, "\\'")}')" class="mt-2 text-xs text-primary font-bold hover:text-orange-700 flex items-center gap-1"><i class="fas fa-volume-up"></i> Listen</button>
                        </div>
                    </div>
                </div>`;
            } catch(e) {
                // Offline fallback
                let reply = OFFLINE_RESPONSES.default;
                const lowerText = text.toLowerCase();
                for (const [key, value] of Object.entries(OFFLINE_RESPONSES.keywords)) {
                    if (lowerText.includes(key)) { reply = value; break; }
                }
                history.innerHTML += `
                <div class="flex justify-start">
                    <div class="flex items-end gap-2 max-w-[85%]">
                        <div class="w-8 h-8 rounded-full bg-slate-400 flex-shrink-0 flex items-center justify-center text-white text-xs shadow-md"><i class="fas fa-wifi-slash"></i></div>
                        <div class="bg-white text-slate-700 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 text-sm leading-relaxed">
                            ${reply} (Offline)
                        </div>
                    </div>
                </div>`;
            }
            history.scrollTop = history.scrollHeight;
        }

        function speakOutput() { if(currentText) speakText(currentText); }
        function speakText(txt) {
            const u = new SpeechSynthesisUtterance(txt);
            u.lang = direction === 'eng-to-target' ? LANGUAGE_DATA[activeLang].voice : 'en-US';
            window.speechSynthesis.speak(u);
        }

        updateUI();
        updateStatus();