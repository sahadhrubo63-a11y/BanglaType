const output = document.getElementById('output');
const popupMenu = document.getElementById('popup-menu');
const suggestionBar = document.getElementById('suggestion-bar');
let pressTimer;
const LONG_PRESS_TIME = 450; // জোড়ে প্রেস করার টাইম

// বাংলা শব্দের সমৃদ্ধ ডিকশনারি (অটো-সাজেশনের জন্য)
const banglaDictionary = [
    "আমি", "আমার", "আমাদের", "আমরা", "আপনি", "আপনার", "আজ", "আকাশ", "আলো", "আবহাওয়া", "আড্ডা", "আস্থা",
    "ইচ্ছা", "ইতিহাস", "ইন্টারনেট", "ঈগল", "ঈশ্বর", "উচিত", "উত্তর", "উদযাপন", "উপহার", "একসাথে", "একটি", "এমন",
    "করব", "করছি", "করতে", "কাজ", "কলম", "কথা", "কখন", "কম্পিউটার", "কীবোর্ড", "কষ্ট", "কাছে", "কোনো",
    "খবর", "খাবার", "খেলা", "খুব", "খুশি", "খোলা", "খোঁজ",
    "গান", "গল্প", "গ্রাম", "গাছ", "গাড়ি", "গাণিতিক", "গুরুত্বপূর্ণ", "গঠন", "গবেষণা",
    "ঘর", "ঘুম", "ঘড়ি", "ঘোড়া", "ঘটনা", "ঘোরাঘুরি",
    "চলতি", "চিত্র", "চেষ্টা", "চাই", "চলো", "চাকরি", "চমৎকার", "চিন্তা",
    "ছাত্র", "ছবি", "ছোট", "ছুটি", "ছাতা",
    "জনগণ", "জীবন", "জল", "জানি", "জিনিস", "যোগাযোগ", "জরুরি", "জয়ের",
    "টাকা", "ঠিক", "টেবিল", "টেলিফোন", "টান",
    "তুমি", "তোমার", "তৈরি", "তাকানো", "তথ্য", "তারিখ", "তাহলে", "তুমিই",
    "দিন", "দিয়ে", "দেশ", "দেখা", "দোকান", "ধন্যবাদ", "ধর্ম", "দলিল", "দুনিয়া",
    "না", "নাম", "নতুন", "নিয়ে", "নিচে", "নদী", "নরম", "নিয়ম",
    "পানি", "পড়া", "পাখি", "পৃথিবী", "পছন্দ", "প্রজেক্ট", "পড়ালেখা", "প্রকাশ",
    "ফল", "ফুল", "ফেসবুক", "ফাইল", "ফলাফল",
    "বাংলাদেশ", "বাংলা", "বই", "বন্ধু", "ব্যবহার", "ব্যঞ্জন", "বর্ণ", "বিকাশ", "বসে",
    "ভালো", "ভাত", "ভাষা", "ভারত", "ভুল", "ভবিষ্যত", "ভ্রমণ",
    "মা", "মানুষ", "মন", "মাউস", "মোবাইল", "মুক্ত", "মজা", "মিষ্টি",
    "যা", "যাবে", "যুদ্ধ", "যোগ", "যথেষ্ট", "যেমন",
    "রাস্তা", "রাত", "রাম", "রং", "রক্ত", "রাজা", "রানার",
    "লেখা", "লিংক", "লাল", "ল্যাপটপ", "লক্ষ্য", "লোক", "লাভ",
    "সবাই", "সুন্দর", "সহজ", "স্ক্রিন", "সময়", "সরকারি", "স্বাগতম", "স্বরবর্ণ", "সংগ্রহ", "সকাল", "সিনেমার",
    "হাতে", "হবে", "হৃদয়", "হলুদ", "হাঁস", "হঠাৎ", "হাজার"
];

// কীবোর্ড কি-সমূহের ইভেন্ট লিসেনার
document.querySelectorAll('.key').forEach(button => {
    
    // জোড়ে বা চেপে ধরে রাখা (লং-প্রেস) শুরু
    button.addEventListener('mousedown', (e) => {
        const variants = button.getAttribute('data-variants');
        if (variants) {
            pressTimer = setTimeout(() => {
                showVariants(e.clientX, e.clientY, variants);
                button.setAttribute('data-long-pressed', 'true');
            }, LONG_PRESS_TIME);
        }
    });

    // মাউস ছেড়ে দিলে টাইপ হবে
    button.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        
        if (!button.hasAttribute('data-long-pressed')) {
            const char = button.getAttribute('data-char');
            insertText(char);
        } else {
            button.removeAttribute('data-long-pressed');
        }
    });

    button.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
        button.removeAttribute('data-long-pressed');
    });
});

// টেক্সট ইনপুট দেওয়া এবং সাজেশন আপডেট করা
function insertText(text) {
    output.value += text;
    output.scrollTop = output.scrollHeight; 
    updateWordSuggestions();
}

// জোড়ে প্রেসের জন্য পপআপ মেনু (যুক্তবর্ণের জন্য)
function showVariants(x, y, variants) {
    popupMenu.innerHTML = '';
    const variantArray = variants.split(',');

    variantArray.forEach(v => {
        const btn = document.createElement('button');
        btn.innerText = v;
        btn.addEventListener('click', () => {
            insertText(v);
            popupMenu.classList.add('hidden');
        });
        popupMenu.appendChild(btn);
    });

    popupMenu.style.left = `${Math.max(10, x - 100)}px`;
    popupMenu.style.top = `${Math.max(10, y - 140)}px`;
    popupMenu.classList.remove('hidden');
}

// রিয়েল-টাইম শব্দ সাজেশনের মূল লজিক
function updateWordSuggestions() {
    const fullText = output.value;
    
    // রেগুলার এক্সপ্রেশন দিয়ে স্পেস, পাংচুয়েশন, ব্র্যাকেট বা গাণিতিক চিহ্নের সাপেক্ষে শেষ শব্দটি বের করা
    const words = fullText.split(/[\s,।.?!\-+=*/%()\[\]{}<>৳$€£₹:‘’"']+/);
    const currentLastWord = words[words.length - 1];

    // যদি টেক্সটবক্স ফাঁকা থাকে
    if (!currentLastWord || currentLastWord.trim() === "") {
        suggestionBar.innerHTML = '<span class="placeholder-text">টাইপ করলে শব্দের সাজেশন এখানে ভেসে উঠবে...</span>';
        return;
    }

    // ডিকশনারি থেকে বর্তমান টাইপ করা অক্ষরের সাথে মিলানো শব্দ ফিল্টার করা
    const matchingWords = banglaDictionary.filter(word => word.startsWith(currentLastWord));

    suggestionBar.innerHTML = '';

    if (matchingWords.length === 0) {
        suggestionBar.innerHTML = '<span class="placeholder-text">কোনো সাজেশন নেই</span>';
        return;
    }

    // কীবোর্ডের ঠিক উপরে ২ থেকে ৪টি (বা সর্বোচ্চ ৬টি) সম্ভাব্য শব্দ প্রদর্শন
    matchingWords.slice(0, 6).forEach(word => {
        const wordBtn = document.createElement('button');
        wordBtn.className = 'suggested-word';
        wordBtn.innerText = word;
        
        // সাজেস্টেড শব্দে ক্লিক করলে অসম্পূর্ণ শব্দের জায়গায় পুরো শব্দ বসে যাবে
        wordBtn.addEventListener('click', () => {
            const lastWordOffset = fullText.lastIndexOf(currentLastWord);
            output.value = fullText.substring(0, lastWordOffset) + word + ' '; // শব্দ শেষে একটি অটো স্পেস দেবে
            output.focus();
            updateWordSuggestions(); // বারটি রিফ্রেশ করবে
        });
        
        suggestionBar.appendChild(wordBtn);
    });
}

// ফাঁকা জায়গায় ক্লিক করলে পপআপ মেনু বন্ধ করা
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('key') && !popupMenu.contains(e.target)) {
        popupMenu.classList.add('hidden');
    }
});

// কন্ট্রোল বাটন ইভেন্ট
document.getElementById('space').addEventListener('click', () => insertText(' '));
document.getElementById('backspace').addEventListener('click', () => {
    output.value = output.value.slice(0, -1);
    updateWordSuggestions();
});
document.getElementById('clear').addEventListener('click', () => {
    output.value = '';
    updateWordSuggestions();
});
