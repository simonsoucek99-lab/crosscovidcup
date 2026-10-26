// ============================================================
// CROSS COVID CUP — DATA, VÝSLEDKY A NAVIGACE
// ============================================================

// Mockovaná data kol
const roundsData = {
    1: {
        id: 1,
        title: "Kolo 1: Prokopské údolí & Dívčí hrady",
        subtitle: "1. kolo seriálu • UZAVŘENO",
        status: "closed",
        statusText: "UZAVŘENO — VÝSLEDKY ODHALENY",
        date: "Víkend 18.–19. října 2026",
        distance: "8.4 KM",
        elevation: "+280 M",
        terrain: "VÁPENEC / LESNÍ TRAIL",
        startInfo: "Neděle 10:00 (Hlubočepy, viadukt)",
        description: "Klasický okruh členitým terénem Prokopského údolí se stoupáním na Dívčí hrady s panoramatickým výhledem na celou Prahu. Prudké skalnaté seběhy a technické pasáže na vápenci prověřily sílu v kotnících i tempo na hranici ANP.",
        mapyUrl: "https://mapy.com/s/prokopske-udoli",
        mapName: "Prokopské údolí (8.4 km okruh)",
        // Neděle 23:59 už proběhla
        revealDeadline: "2026-10-19T23:59:59",
        defaultResults: [
            { name: "Martin Černý", time: "36:42" },
            { name: "Petr Svoboda", time: "38:15" },
            { name: "Tomáš Dvořák", time: "39:50" },
            { name: "Jana Novotná", time: "41:20" },
            { name: "Eva Kučerová", time: "43:05" },
            { name: "Michal Horák", time: "45:30" },
            { name: "Jakub Král", time: "48:10" },
            { name: "David Marek", time: "52:40" }
        ]
    },
    2: {
        id: 2,
        title: "Kolo 2: Vidoule & Park Cibulka",
        subtitle: "2. kolo seriálu • AKTUÁLNÍ KOLO",
        status: "live",
        statusText: "LIVE — PROBÍHÁ ZÁPIS ČASŮ",
        date: "Víkend 25.–26. října 2026",
        distance: "7.2 KM",
        elevation: "+210 M",
        terrain: "LESOPARK / SCHODY / PĚŠINY",
        startInfo: "Neděle 10:00 (Čínský pavilon Cibulka) nebo kdykoliv sólo",
        description: "Rychlejší, ale zrádný okruh kolem stolové hory Vidoule. Kombinace táhlých výběhů a technických kliček mezi stromy v přírodním parku Košíře-Motol a lesoparku Cibulka. Ideální pro tempový běh.",
        mapyUrl: "https://mapy.com/s/vidoule-cibulka",
        mapName: "Vidoule & Cibulka okruh (7.2 km)",
        // Termín odhalení výsledků: neděle v noci
        revealDeadline: "2026-10-26T23:59:59",
        defaultResults: [
            { name: "Petr Svoboda", time: "32:10" },
            { name: "Jana Novotná", time: "34:45" },
            { name: "Martin Černý", time: "35:12" },
            { name: "Filip Beneš", time: "37:50" },
            { name: "Lucie Pokorná", time: "39:20" },
            { name: "Michal Horák", time: "41:05" }
        ]
    },
    3: {
        id: 3,
        title: "Kolo 3: Radotínské údolí & Lochkov",
        subtitle: "3. kolo seriálu • PŘÍPRAVA",
        status: "upcoming",
        statusText: "PŘIPRAVUJE SE",
        date: "Víkend 1.–2. listopadu 2026",
        distance: "9.6 KM",
        elevation: "+320 M",
        terrain: "KAMENITÁ ROKLE / PŘECHOD HŘEBENE",
        startInfo: "Neděle 10:00 (Radotín, lávka u řeky)",
        description: "Královská etapa seriálu v divokém Radotínském údolí podél potoka s technickým traverzovým seběhem zpět. Maximální prověrka vytrvalosti a práce v kopcích.",
        mapyUrl: "https://mapy.com/s/radotinske-udoli",
        mapName: "Radotínská rokle (9.6 km)",
        revealDeadline: "2026-11-02T23:59:59",
        defaultResults: []
    }
};

// Simulace stavu času pro účely testování UI (null = reálný čas, 'hidden' = skryto, 'revealed' = odhaleno)
let simulationOverride = null;

// Načtení výsledků kola (z localStorage nebo výchozích dat)
function getRoundResults(roundId) {
    const storageKey = `ccc_results_round_${roundId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Chyba při načítání z localStorage", e);
        }
    }
    return [...roundsData[roundId].defaultResults];
}

// Uložení výsledků kola do localStorage
function saveRoundResults(roundId, results) {
    const storageKey = `ccc_results_round_${roundId}`;
    localStorage.setItem(storageKey, JSON.stringify(results));
}

// Převod času "MM:SS" na sekundy pro přesné řazení
function timeToSeconds(timeStr) {
    if (!timeStr) return 999999;
    const parts = timeStr.trim().split(":");
    if (parts.length === 2) {
        return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 999999;
}

// Kontrola, zda jsou výsledky kola již odhaleny (podle času nebo simulace)
function isRoundRevealed(round) {
    if (simulationOverride !== null) {
        return simulationOverride === 'revealed';
    }
    if (round.status === 'closed') return true;
    if (round.status === 'upcoming') return false;

    // Kontrola vůči aktuálnímu času a nedělnímu termínu
    const now = new Date();
    const deadline = new Date(round.revealDeadline);
    return now >= deadline;
}

// ============================================================
// PŘEPÍNÁNÍ POHLEDŮ (ROUTER)
// ============================================================
let currentRoundId = 2;

function navigateTo(target, roundId) {
    // Skrytí všech panelů
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    if (target === 'round') {
        const rId = roundId || currentRoundId;
        currentRoundId = rId;
        renderRoundDetail(rId);
        document.getElementById('view-round').classList.add('active');

        // Označení aktivního kola v sidebaru
        const roundNav = document.querySelector(`.nav-round[data-round="${rId}"]`);
        if (roundNav) roundNav.classList.add('active');
        window.location.hash = `kolo-${rId}`;
    } else if (target === 'standings') {
        renderOverallStandings();
        document.getElementById('view-standings').classList.add('active');
        const standingsBtn = document.querySelector('[data-view="standings"]');
        if (standingsBtn) standingsBtn.classList.add('active');
        window.location.hash = 'celkove-vysledky';
    } else {
        // Home
        document.getElementById('view-home').classList.add('active');
        const homeBtn = document.querySelector('[data-view="home"]');
        if (homeBtn) homeBtn.classList.add('active');
        window.location.hash = 'uvod';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// VYKRESLENÍ DETAILU KOLA
// ============================================================
function renderRoundDetail(roundId) {
    const round = roundsData[roundId];
    const container = document.getElementById('roundDetailContainer');
    if (!round || !container) return;

    const revealed = isRoundRevealed(round);
    const results = getRoundResults(roundId);

    // Seřazení výsledků od nejrychlejšího
    const sortedResults = [...results].sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));

    let resultsContentHtml = "";
    if (!revealed) {
        resultsContentHtml = `
            <div class="results-hidden-box">
                <div class="lock-icon">🔒</div>
                <h4>VÝSLEDKY JSOU SKRYTÉ</h4>
                <p>Výsledky jsou do nedělní půlnoci skryté pro zachování napětí. Zobrazí se automaticky po nedělní půlnoci seřazené podle dosaženého času.</p>
                <div class="registered-runners-count">
                    AKTIVNÍ ZÁPISY: ${sortedResults.length} BĚŽCŮ JIŽ ZAPSALO SVŮJ ČAS
                </div>
            </div>
        `;
    } else if (sortedResults.length === 0) {
        resultsContentHtml = `
            <div class="results-hidden-box" style="background:#f1f5f9;">
                <h4>ZATÍM ŽÁDNÉ ZÁPISY</h4>
                <p>V tomto kole zatím nebyl zaznamenán žádný čas.</p>
            </div>
        `;
    } else {
        const total = sortedResults.length;
        const rowsHtml = sortedResults.map((r, idx) => {
            const rank = idx + 1;
            // Vzorec Cross Covid Cupu: 1 bod za účast + počet předběhnutých
            const beaten = total - rank;
            const points = 1 + beaten;
            let badgeClass = "rank-other";
            if (rank === 1) badgeClass = "rank-1";
            else if (rank === 2) badgeClass = "rank-2";
            else if (rank === 3) badgeClass = "rank-3";

            return `
                <tr>
                    <td class="th-rank"><span class="rank-badge ${badgeClass}">${rank}.</span></td>
                    <td><strong>${escapeHtml(r.name)}</strong></td>
                    <td class="td-time">${escapeHtml(r.time)}</td>
                    <td class="td-points">+${points} b</td>
                </tr>
            `;
        }).join("");

        resultsContentHtml = `
            <div class="table-container">
                <table class="neo-table">
                    <thead>
                        <tr>
                            <th class="th-rank">POŘADÍ</th>
                            <th>BĚŽEC / BĚŽKYNĚ</th>
                            <th class="th-num">ČAS (MM:SS)</th>
                            <th class="th-num">BODY DO POHÁRU</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    }

    container.innerHTML = `
        <article class="neo-card">
            <!-- Záhlaví detailu kola -->
            <div class="card-header">
                <div class="card-header-left">
                    <span class="section-tag">KOLO ${round.id}</span>
                    <h2>${escapeHtml(round.title)}</h2>
                </div>
                <div class="round-status-badge ${round.status}">
                    ${round.status === 'live' ? '<span class="dot"></span>' : ''}
                    ${round.statusText}
                </div>
            </div>

            <div class="card-body">
                <!-- Parametry kola -->
                <div class="round-params-grid">
                    <div class="param-box">
                        <span class="param-label">VZDÁLENOST</span>
                        <div class="param-value">${round.distance}</div>
                    </div>
                    <div class="param-box">
                        <span class="param-label">PŘEVÝŠENÍ</span>
                        <div class="param-value">${round.elevation}</div>
                    </div>
                    <div class="param-box">
                        <span class="param-label">TERÉN</span>
                        <div class="param-value" style="font-size:1.15rem;">${round.terrain}</div>
                    </div>
                    <div class="param-box">
                        <span class="param-label">START</span>
                        <div class="param-value" style="font-size:1rem;">NEDĚLE 10:00</div>
                    </div>
                </div>

                <!-- Propozice a popis -->
                <div class="round-desc-card">
                    <h3>PROPOZICE & CHARAKTER TRATI</h3>
                    <p>${escapeHtml(round.description)}</p>
                    <p style="margin-top:8px; font-weight:700; color:var(--accent-red);">
                        📍 Místo startu: ${escapeHtml(round.startInfo)}
                    </p>
                </div>

                <!-- Mapa trati (Iframe placeholder Mapy.cz) & GPX soubor -->
                <div class="map-section">
                    <div class="map-header-row">
                        <h3>MAPA TRATI & NAVIGACE</h3>
                        <button class="btn-gpx" onclick="downloadGpx(${round.id})">
                            💾 STÁHNOUT GPX SOUBOR TRATI
                        </button>
                    </div>

                    <div class="map-iframe-container">
                        <div class="map-terrain-decor"></div>
                        <div class="map-content-overlay">
                            <span class="map-logo-tag">MAPY.CZ • ZÁSTUPNÝ NÁHLED</span>
                            <h4>${escapeHtml(round.mapName)}</h4>
                            <p>Členitá trať vedená přírodními lokalitami Městské části Praha 5. Interaktivní GPX trasa a výškový profil.</p>
                            <a href="${round.mapyUrl}" target="_blank" rel="noopener noreferrer" class="btn-mapy">
                                ↗ OTEVŘÍT TRASU NA MAPY.CZ
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Formulář pro zápis času -->
                <div class="entry-form-card">
                    <div class="entry-form-header">
                        <h3>⏱️ ZÁPIS ČASU DO KOLA ${round.id}</h3>
                        <span class="form-info-tag">FORMULÁŘ V DETAILU TRATI</span>
                    </div>

                    <form id="timeEntryForm" onsubmit="handleTimeSubmit(event, ${round.id})">
                        <div class="neo-form-row">
                            <div class="form-field">
                                <label for="runnerName">JMÉNO A PŘÍJMENÍ BĚŽCE:</label>
                                <input type="text" id="runnerName" placeholder="např. Jan Novák" required>
                            </div>
                            <div class="form-field">
                                <label for="runnerTime">DOSAŽENÝ ČAS (MM:SS):</label>
                                <input type="text" id="runnerTime" placeholder="např. 38:45" pattern="^[0-9]{1,3}:[0-5][0-9]$" title="Zadejte čas ve formátu MM:SS (např. 35:20)" required>
                            </div>
                            <button type="submit" class="btn-submit-time">
                                ODESLAT ČAS ➔
                            </button>
                        </div>
                    </form>
                    <div id="formFeedback" class="form-feedback"></div>
                </div>

                <!-- Výsledky kola -->
                <div class="results-card">
                    <div class="results-header-bar">
                        <h3>🏆 VÝSLEDKY KOLA ${round.id}</h3>
                        <button class="btn-simulate" onclick="toggleTimeSimulation(${round.id})">
                            ⏱️ TEST: ${simulationOverride === 'revealed' ? 'Přepnout na SKRYTO (Před půlnocí)' : 'Přepnout na ODHALENO (Po půlnoci)'}
                        </button>
                    </div>

                    ${resultsContentHtml}
                </div>

            </div>
        </article>
    `;
}

// Přepínání simulace stavu před / po nedělní půlnoci
function toggleTimeSimulation(roundId) {
    if (simulationOverride === 'revealed') {
        simulationOverride = 'hidden';
    } else {
        simulationOverride = 'revealed';
    }
    renderRoundDetail(roundId);
}

// Odeslání nového času
function handleTimeSubmit(event, roundId) {
    event.preventDefault();
    const nameInput = document.getElementById('runnerName');
    const timeInput = document.getElementById('runnerTime');
    const feedback = document.getElementById('formFeedback');

    const name = nameInput.value.trim();
    const time = timeInput.value.trim();

    if (!name || !time) return;

    // Přidání do výsledků kola
    const currentResults = getRoundResults(roundId);
    currentResults.push({ name, time });
    saveRoundResults(roundId, currentResults);

    feedback.textContent = `✓ Výborně, ${name}! Tvůj čas ${time} byl úspěšně zapsán do výsledků Kola ${roundId}.`;
    feedback.className = "form-feedback success";

    nameInput.value = "";
    timeInput.value = "";

    // Přenastavení detailu kola za 1 sekundu
    setTimeout(() => {
        renderRoundDetail(roundId);
    }, 1200);
}

// Generování a stažení dummy GPX souboru
function downloadGpx(roundId) {
    const round = roundsData[roundId];
    const gpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Cross Covid Cup 2026 - Praha 5" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${round.title}</name>
    <desc>Trať běžeckého seriálu Cross Covid Cup v Praze 5 (${round.distance})</desc>
  </metadata>
  <trk>
    <name>${round.title}</name>
    <trkseg>
      <trkpt lat="50.0450" lon="14.3980"><ele>210</ele></trkpt>
      <trkpt lat="50.0465" lon="14.3950"><ele>240</ele></trkpt>
      <trkpt lat="50.0490" lon="14.3910"><ele>280</ele></trkpt>
      <trkpt lat="50.0450" lon="14.3980"><ele>210</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crosscovidcup_kolo_${roundId}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================================
// CELKOVÉ VÝSLEDKY SERIÁLU (AGREGACE)
// ============================================================
function renderOverallStandings() {
    const tbody = document.getElementById('overallStandingsBody');
    if (!tbody) return;

    // Získání bodů z Kola 1
    const r1 = getRoundResults(1).sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));
    const r1Total = r1.length;
    const r1Scores = {};
    r1.forEach((r, idx) => {
        r1Scores[r.name] = 1 + (r1Total - (idx + 1));
    });

    // Získání bodů z Kola 2
    const r2 = getRoundResults(2).sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));
    const r2Total = r2.length;
    const r2Scores = {};
    r2.forEach((r, idx) => {
        r2Scores[r.name] = 1 + (r2Total - (idx + 1));
    });

    // Agregace všech unikátních běžců
    const runnersMap = {};
    const allNames = new Set([...Object.keys(r1Scores), ...Object.keys(r2Scores)]);

    allNames.forEach(name => {
        const p1 = r1Scores[name] || 0;
        const p2 = r2Scores[name] || 0;
        runnersMap[name] = {
            name,
            kolo1: p1,
            kolo2: p2,
            total: p1 + p2
        };
    });

    const standingsArray = Object.values(runnersMap).sort((a, b) => b.total - a.total);

    tbody.innerHTML = standingsArray.map((runner, index) => {
        const rank = index + 1;
        let badgeClass = "rank-other";
        if (rank === 1) badgeClass = "rank-1";
        else if (rank === 2) badgeClass = "rank-2";
        else if (rank === 3) badgeClass = "rank-3";

        return `
            <tr>
                <td class="th-rank"><span class="rank-badge ${badgeClass}">${rank}.</span></td>
                <td><strong>${escapeHtml(runner.name)}</strong></td>
                <td class="th-num">${runner.kolo1 > 0 ? runner.kolo1 + ' b' : '—'}</td>
                <td class="th-num">${runner.kolo2 > 0 ? runner.kolo2 + ' b' : '—'}</td>
                <td class="td-total-points">${runner.total} b</td>
            </tr>
        `;
    }).join("");
}

// Pomocná ochrana proti XSS
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================================
// KALKULAČKA BODŮ (ZACHOVÁNA Z ÚVODU)
// ============================================================
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

// ============================================================
// INICIALIZACE A OBSLUHA HASH HISTORIE
// ============================================================
function handleHashChange() {
    const hash = window.location.hash;
    if (hash.startsWith('#kolo-')) {
        const id = parseInt(hash.replace('#kolo-', ''), 10);
        if (roundsData[id]) {
            navigateTo('round', id);
            return;
        }
    } else if (hash === '#celkove-vysledky') {
        navigateTo('standings');
        return;
    }
    navigateTo('home');
}

// Klikací obsluha pro všechny položky s data-view
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-view]').forEach(item => {
        item.addEventListener('click', (e) => {
            const view = item.getAttribute('data-view');
            const roundId = item.getAttribute('data-round');
            navigateTo(view, roundId ? parseInt(roundId, 10) : null);
        });
    });

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
});
