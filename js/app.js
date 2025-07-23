// --- I18N (Internationalization) ---

const translations = {
    en: {
        'title': 'AI Tarot Reading | Free Online Tarot Divination',
        'description': 'Explore the mysteries of fate! Upload your tarot card photo for a professional, insightful online tarot reading powered by AI. We offer various spreads like Single Card, Three Card, and Celtic Cross to provide precise guidance on your career, love life, and future.',
        'keywords': 'AI Tarot, Tarot Reading, Online Tarot, Free Tarot, Tarot Divination, Tarot Spreads, Career Reading, Love Reading, Future Reading',
        'og:title': 'AI Tarot Reading | Free Online Tarot Divination',
        'og:description': 'Upload a photo of your tarot cards and instantly receive a professional, insightful online reading from our AI. Explore your career, love, and future.',
        'twitter:title': 'AI Tarot Reading | Free Online Tarot Divination',
        'twitter:description': 'Instant, intelligent AI tarot readings. Snap a picture of your spread and unveil the secrets of your future.',
        'main-title': '🔮 AI Tarot Reading 🔮',
        'subtitle': 'Upload a photo of your tarot cards, and our AI will reveal the mysteries of your fate.',
        'upload-title': 'Upload Tarot Card Photo',
        'upload-desc': 'Supports JPG, PNG formats, max 10MB',
        'upload-btn': 'Select Image',
        'question-title': 'Your Question or Focus',
        'question-placeholder': 'Describe the question you want to ask, for example: How is my career developing? Or how is our relationship progressing...',
        'spread-title': 'Choose a Spread',
        'spread-single': 'Single Card',
        'spread-three': 'Three Cards (Past-Present-Future)',
        'spread-celtic': 'Celtic Cross',
        'seo-title': 'Explore the Mystical World of AI Tarot',
        'seo-p1': 'Welcome to AI Tarot Reading, a mystical space that combines ancient wisdom with cutting-edge technology. Here, you don\'t need to find a tarot reader. With just a simple photo of a tarot card, our powerful AI can provide you with a deep interpretation comparable to an expert. Whether you are a tarot novice or an experienced enthusiast, you can get clear guidance here.',
        'seo-p2': 'Our service is completely free. Just choose your spread, enter the question you care about—whether it’s confusion about love, a career choice, or an exploration of the future—and then upload your card photo. The AI will immediately generate an exclusive tarot revelation for you, helping you gain insight into your current situation and find the direction forward.',
        'read-btn': 'Start Reading',
        'loading-text': 'Reading...',
        'result-title': 'Your Tarot Revelation',
        'save-btn': 'Save Reading',
        'footer-text': '© 2025 AI Tarot Reading | This service is for entertainment and reference only and does not constitute professional advice.',
        'loading-state-message': 'Connecting to mystical forces, please wait...',
        'error-message-title': 'Sorry, an error occurred during the reading. Please check your network or API key and try again.',
        'retry-btn': 'Retry',
        'save-success': 'Reading saved!',
        'image-type-error': 'Please upload an image file!',
        'image-size-error': 'Image size cannot exceed 10MB!'
    },
    zh: {
        'title': 'AI塔罗牌解读 | 免费在线塔罗占卜',
        'description': '探索命运的奥秘！上传您的塔罗牌照片，体验由AI驱动的专业、深刻的在线塔罗解读。我们提供单张牌、三张牌、凯尔特十字等多种牌阵，为您提供关于事业、爱情和未来的精准指引。',
        'keywords': 'AI塔罗, 塔罗牌解读, 在线塔罗, 免费塔罗, 塔罗占卜, 塔罗牌阵, 事业运, 感情运, 未来运势, AI Tarot, Online Tarot Reading, Free Tarot',
        'og:title': 'AI塔罗牌解读 | 免费在线塔罗占卜',
        'og:description': '上传塔罗牌照片，即刻获得由AI提供的专业、深刻的在线解读。探索您的事业、爱情与未来。',
        'twitter:title': 'AI塔罗牌解读 | 免费在线塔罗占卜',
        'twitter:description': '即时、智能的AI塔罗牌解读。拍下您的牌面，揭示未来的秘密。',
        'main-title': '🔮 AI塔罗牌解读 🔮',
        'subtitle': '上传您抽到的塔罗牌照片，AI将为您揭示命运的奥秘',
        'upload-title': '上传塔罗牌照片',
        'upload-desc': '支持 JPG、PNG 格式，最大 10MB',
        'upload-btn': '选择图片',
        'question-title': '您的问题或关注点',
        'question-placeholder': '请描述您想要咨询的问题，比如：我的事业发展如何？或者我们的感情发展...',
        'spread-title': '选择牌阵',
        'spread-single': '单张牌',
        'spread-three': '三张牌（过去-现在-未来）',
        'spread-celtic': '凯尔特十字',
        'seo-title': '探索AI塔罗的神秘世界',
        'seo-p1': '欢迎来到AI塔罗牌解读，一个结合了古老智慧与前沿科技的神秘空间。在这里，您无需寻找塔罗师，只需一张简单的塔罗牌照片，我们强大的人工智能就能为您提供媲美专家的深度解读。无论您是塔罗新手还是资深爱好者，都能在这里获得清晰的指引。',
        'seo-p2': '我们的服务完全免费。只需选择您的牌阵，输入您关心的问题——无论是关于爱情的困惑、事业的抉择，还是对未来的探索——然后上传您的牌面照片。AI将立即为您生成一份专属的塔罗启示，帮助您洞察现状，找到前行的方向。',
        'read-btn': '开始解读',
        'loading-text': '解读中...',
        'result-title': '您的塔罗启示',
        'save-btn': '保存解读',
        'footer-text': '© 2025 AI塔罗牌解读 | 本服务结果仅供娱乐和参考，不构成专业建议。',
        'loading-state-message': '正在连接神秘力量，请稍候...',
        'error-message-title': '抱歉，解读过程中出现了错误。请检查网络或API密钥后重试。',
        'retry-btn': '重试',
        'save-success': '解读已保存！',
        'image-type-error': '请上传图片文件！',
        'image-size-error': '图片大小不能超过10MB！'
    }
};

let currentLang = 'zh';

function setLanguage(lang) {
    currentLang = translations[lang] ? lang : 'zh';
    document.documentElement.lang = currentLang;
    document.documentElement.setAttribute('data-lang', currentLang);

    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        const translation = translations[currentLang][key];
        if (translation) {
            if (elem.tagName === 'META' || elem.tagName === 'TITLE') {
                elem.content = translation;
            } else if (elem.tagName === 'TEXTAREA') {
                elem.placeholder = translation;
            }
            else {
                elem.innerHTML = translation;
            }
        }
    });
}


// --- App Logic ---

let uploadedImage = null;
let isProcessing = false;
let tarotAI = null;

document.addEventListener('DOMContentLoaded', function() {
    const userLang = navigator.language || navigator.userLanguage;
    setLanguage(userLang.startsWith('en') ? 'en' : 'zh');
    initializeApp();
});

function initializeApp() {
    tarotAI = new TarotAIClient();
    document.getElementById('tarotImage').addEventListener('change', handleImageUpload);
    document.getElementById('readButton').addEventListener('click', startReading);
    document.getElementById('userQuestion').addEventListener('input', updateReadButtonState);
    document.querySelector('.remove-btn').addEventListener('click', removeImage);
    setupDragAndDrop();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert(translations[currentLang]['image-type-error']);
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert(translations[currentLang]['image-size-error']);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = e.target.result;
        showPreview(uploadedImage);
        updateReadButtonState();
    };
    reader.readAsDataURL(file);
}

function showPreview(imageSrc) {
    document.getElementById('previewImage').src = imageSrc;
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('previewArea').style.display = 'block';
}

function removeImage() {
    uploadedImage = null;
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('tarotImage').value = '';
    updateReadButtonState();
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('tarotImage').files = files;
            handleImageUpload({ target: { files: files } });
        }
    });
}

function updateReadButtonState() {
    const readButton = document.getElementById('readButton');
    const userQuestion = document.getElementById('userQuestion').value.trim();
    
    readButton.disabled = !uploadedImage || !userQuestion || isProcessing;
}

async function startReading() {
    if (isProcessing) return;

    isProcessing = true;
    updateUIForProcessing(true);
    
    try {
        const question = document.getElementById('userQuestion').value.trim();
        const spreadType = document.querySelector('input[name="spread"]:checked').value;
        
        showLoadingState();
        
        const reading = await tarotAI.readTarot(uploadedImage, question, spreadType, currentLang);
        
        displayResult(reading);
        
    } catch (error) {
        console.error('Reading failed:', error);
        showError(error.message || translations[currentLang]['error-message-title']);
    } finally {
        isProcessing = false;
        updateUIForProcessing(false);
    }
}

function updateUIForProcessing(processing) {
    const readButton = document.getElementById('readButton');
    const btnText = readButton.querySelector('.btn-text');
    const loading = readButton.querySelector('.loading');
    
    readButton.disabled = processing;
    if (processing) {
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
    } else {
        btnText.style.display = 'inline-block';
        loading.style.display = 'none';
        updateReadButtonState();
    }
}

function showLoadingState() {
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    
    resultSection.style.display = 'block';
    resultContent.innerHTML = `
        <div class="loading-animation">
            <div class="crystal-ball">🔮</div>
            <p>${translations[currentLang]['loading-state-message']}</p>
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function displayResult(reading) {
    const resultContent = document.getElementById('resultContent');
    const converter = new showdown.Converter();
    const html = converter.makeHtml(reading.unifiedReading || reading);
    resultContent.innerHTML = `
        <div class="reading-result">
            <div class="unified-reading">
                <div class="reading-text">${html}</div>
            </div>
        </div>
    `;
}

function showError(message) {
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <p>${message}</p>
            <button onclick="startReading()" class="retry-btn">${translations[currentLang]['retry-btn']}</button>
        </div>
    `;
}

function saveReading() {
    const resultContent = document.getElementById('resultContent').innerText;
    const question = document.getElementById('userQuestion').value;
    
    const readingData = {
        question: question,
        timestamp: new Date().toLocaleString(currentLang),
        result: resultContent
    };
    
    const blob = new Blob([JSON.stringify(readingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TarotReading_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(translations[currentLang]['save-success']);
}

const additionalStyles = `
<style>
.loading-animation { text-align: center; padding: 40px; }
.crystal-ball { font-size: 4rem; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 1; } }
.loading-dots span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ffd700; margin: 0 3px; animation: bounce 1.4s infinite ease-in-out both; }
.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
.reading-result { line-height: 1.8; }
.reading-result h4 { color: #ffd700; margin: 20px 0 10px 0; font-size: 1.2rem; }
.cards-list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
.card-item { background: rgba(139, 92, 246, 0.2); padding: 8px 15px; border-radius: 20px; border: 1px solid #8b5cf6; }
.interpretation-text, .advice-text { background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 10px; border-left: 3px solid #ffd700; white-space: pre-wrap; }
.error-message { text-align: center; padding: 40px; }
.error-icon { font-size: 3rem; margin-bottom: 20px; }
.retry-btn { background: linear-gradient(45deg, #ff6b35, #ffd700); color: white; border: none; padding: 10px 25px; border-radius: 20px; cursor: pointer; margin-top: 15px; }
.dragover { border-color: #ffd700 !important; background: rgba(255, 215, 0, 0.2) !important; }
</style>
`;
document.head.insertAdjacentHTML('beforeend', additionalStyles);
