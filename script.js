let count = 0;
const actionBtn = document.getElementById('actionBtn');
const clickCount = document.getElementById('clickCount');
const themeToggle = document.getElementById('themeToggle');

// Interaktivní počítadlo
if (actionBtn && clickCount) {
    actionBtn.addEventListener('click', () => {
        count++;
        clickCount.textContent = `Kliknuto: ${count}×`;
    });
}

// Přepínání tmavého / světlého režimu
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            themeToggle.textContent = '🌙 Změnit režim';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️ Změnit režim';
        }
    });
}
