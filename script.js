// Cross Covid Cup - Interaktivita

// 1. Přepínání motivu (Tmavý / Světlý)
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            document.body.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙';
        }
    });
}

// 2. Kalkulačka bodů seriálu
const totalRunnersInput = document.getElementById('totalRunners');
const finishPositionInput = document.getElementById('finishPosition');
const pointsDisplay = document.getElementById('pointsDisplay');
const resultBreakdown = document.getElementById('resultBreakdown');

function calculatePoints() {
    const total = parseInt(totalRunnersInput.value, 10);
    const position = parseInt(finishPositionInput.value, 10);

    if (isNaN(total) || isNaN(position) || total < 1 || position < 1) {
        pointsDisplay.textContent = '0';
        resultBreakdown.textContent = 'Zadejte platná čísla.';
        return;
    }

    if (position > total) {
        pointsDisplay.textContent = '1';
        resultBreakdown.textContent = `Pozice (${position}) nemůže být větší než počet běžců (${total}). Získáváte 1 bod za účast.`;
        return;
    }

    // Vzorec: 1 bod za účast + počet předběhnutých závodníků
    const beaten = total - position;
    const totalPoints = 1 + beaten;

    pointsDisplay.textContent = totalPoints;
    resultBreakdown.textContent = `1 bod za účast + ${beaten} ${getRunnersInflection(beaten)} za vámi`;
}

// Pomocná funkce pro české skloňování
function getRunnersInflection(count) {
    if (count === 1) return 'poražený soupeř';
    if (count >= 2 && count <= 4) return 'poražení soupeři';
    return 'poražených soupeřů';
}

if (totalRunnersInput && finishPositionInput) {
    totalRunnersInput.addEventListener('input', calculatePoints);
    finishPositionInput.addEventListener('input', calculatePoints);
    calculatePoints(); // Spočítat výchozí hodnoty při načtení
}

// 3. Tlačítko pro oznámení / informaci o příštím kole
const alertNoticeBtn = document.getElementById('alertNoticeBtn');
if (alertNoticeBtn) {
    alertNoticeBtn.addEventListener('click', () => {
        alert(
            "🏃 Cross Covid Cup – Informace k příštímu startu:\n\n" +
            "• Trasa a STRAVA segment budou vyhlášeny před víkendem ve společné skupině.\n" +
            "• Start probíhá ve vlnách v přírodních lokalitách Prahy 5.\n" +
            "• Nezapomeňte si zapnout hodinky nebo telefon pro záznam na Stravu!\n\n" +
            "Těšíme se na vás na startu!"
        );
    });
}
