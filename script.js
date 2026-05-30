const output = document.getElementById('output');
const popupMenu = document.getElementById('popup-menu');
let pressTimer;
const LONG_PRESS_TIME = 500; // ৫০০ মিলি-সেকেন্ড চেপে ধরে রাখলে পপআপ আসবে

// সাধারণ মাউস ক্লিকের লজিক
document.querySelectorAll('.key').forEach(button => {
    
    // মাউস ডাউন (চেপে ধরা শুরু)
    button.addEventListener('mousedown', (e) => {
        const char = button.getAttribute('data-char');
        const variants = button.getAttribute('data-variants');

        // যদি লং-প্রেস ভ্যারিয়েন্ট থাকে, তবে টাইমার চালু হবে
        if (variants) {
            pressTimer = setTimeout(() => {
                showVariants(e.clientX, e.clientY, variants);
                button.setAttribute('data-long-pressed', 'true');
            }, LONG_PRESS_TIME);
        }
    });

    // মাউস আপ (ছেড়ে দেওয়া)
    button.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        
        // যদি লং-প্রেস না হয়ে থাকে, তবে সাধারণ অক্ষরটি ইনপুট হবে
        if (!button.hasAttribute('data-long-pressed')) {
            const char = button.getAttribute('data-char');
            output.value += char;
        } else {
            button.removeAttribute('data-long-pressed');
        }
    });

    // মাউস বাটন থেকে সরে গেলে টাইমার বাতিল
    button.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
        button.removeAttribute('data-long-pressed');
    });
});

// ভ্যারিয়েন্ট পপআপ দেখানোর ফাংশন
function showVariants(x, y, variants) {
    popupMenu.innerHTML = '';
    const variantArray = variants.split(',');

    variantArray.forEach(v => {
        const btn = document.createElement('button');
        btn.innerText = v;
        btn.addEventListener('click', () => {
            output.value += v;
            popupMenu.classList.add('hidden');
        });
        popupMenu.appendChild(btn);
    });

    popupMenu.style.left = `${x}px`;
    popupMenu.style.top = `${y - 60}px`; // মাউসের একটু উপরে দেখাবে
    popupMenu.classList.remove('hidden');
}

// স্ক্রিনের অন্য কোথাও ক্লিক করলে পপআপ বন্ধ হবে
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('key') && !popupMenu.contains(e.target)) {
        popupMenu.classList.add('hidden');
    }
});

// স্পেস, ব্যাকস্পেস এবং ক্লিয়ার বাটনের কাজ
document.getElementById('space').addEventListener('click', () => output.value += ' ');
document.getElementById('backspace').addEventListener('click', () => output.value = output.value.slice(0, -1));
document.getElementById('clear').addEventListener('click', () => output.value = '');
