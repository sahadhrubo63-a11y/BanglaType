const output = document.getElementById('output');
const popupMenu = document.getElementById('popup-menu');
let pressTimer;
const LONG_PRESS_TIME = 450; // জোড়ে বা চেপে ধরে রাখার সময় (৪৫০ মিলি-সেকেন্ড)

document.querySelectorAll('.key').forEach(button => {
    
    // মাউস প্রেস শুরু (চেপে ধরে রাখা)
    button.addEventListener('mousedown', (e) => {
        const variants = button.getAttribute('data-variants');

        if (variants) {
            pressTimer = setTimeout(() => {
                showVariants(e.clientX, e.clientY, variants);
                button.setAttribute('data-long-pressed', 'true');
            }, LONG_PRESS_TIME);
        }
    });

    // মাউস ছেড়ে দেওয়া
    button.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        
        // যদি লং-প্রেস না হয়ে থাকে তবে মূল একক অক্ষরটি টাইপ হবে
        if (!button.hasAttribute('data-long-pressed')) {
            const char = button.getAttribute('data-char');
            insertText(char);
        } else {
            button.removeAttribute('data-long-pressed');
        }
    });

    // মাউস কার্সার বাটন থেকে সরে গেলে বাতিল করা
    button.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
        button.removeAttribute('data-long-pressed');
    });
});

// টেক্সট ইনপুট ফাংশন
function insertText(text) {
    output.value += text;
    output.scrollTop = output.scrollHeight; // স্ক্রল অটোমেটিক নিচে নামবে
}

// গ্রিড আকারে যুক্তবর্ণের পপআপ মেনু তৈরি
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

    // স্ক্রিনের পজিশন ঠিক করা যেন স্ক্রিনের বাইরে চলে না যায়
    popupMenu.style.left = `${Math.max(10, x - 100)}px`;
    popupMenu.style.top = `${Math.max(10, y - 140)}px`;
    popupMenu.classList.remove('hidden');
}

// বাইরে ক্লিক করলে পপআপ মেনু বন্ধ হবে
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('key') && !popupMenu.contains(e.target)) {
        popupMenu.classList.add('hidden');
    }
});

// কন্ট্রোল বোতামসমূহের কাজ
document.getElementById('space').addEventListener('click', () => insertText(' '));
document.getElementById('backspace').addEventListener('click', () => {
    output.value = output.value.slice(0, -1);
});
document.getElementById('clear').addEventListener('click', () => {
    output.value = '';
});
