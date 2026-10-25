// CROSS COVID CUP - Kalkulačka bodování

const calcRunners = document.getElementById('calcRunners');
const calcPos = document.getElementById('calcPos');
const scoreValue = document.getElementById('scoreValue');
const scoreExplanation = document.getElementById('scoreExplanation');

function updatePoints() {
    if (!calcRunners || !calcPos || !scoreValue || !scoreExplanation) return;

    const total = parseInt(calcRunners.value, 10);
    const pos = parseInt(calcPos.value, 10);

    if (isNaN(total) || isNaN(pos) || total < 1 || pos < 1) {
        scoreValue.textContent = "0";
        scoreExplanation.textContent = "(Zadej platná čísla)";
        return;
    }

    if (pos > total) {
        scoreValue.textContent = "1";
        scoreExplanation.textContent = `(Pozice ${pos} je větší než počet běžců ${total} — min. 1 bod za účast)`;
        return;
    }

    const beaten = total - pos;
    const points = 1 + beaten;

    scoreValue.textContent = points;

    let inflected = "předběhnutých";
    if (beaten === 1) inflected = "předběhnutý";
    else if (beaten >= 2 && beaten <= 4) inflected = "předběhnutí";

    scoreExplanation.textContent = `(1 bod účast + ${beaten} ${inflected})`;
}

if (calcRunners && calcPos) {
    calcRunners.addEventListener('input', updatePoints);
    calcPos.addEventListener('input', updatePoints);
    updatePoints();
}
