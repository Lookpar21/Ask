let lastResult = '';
let history = [];

let bigEyeValue = '';
let smallValue = '';
let cockroachValue = '';

function setResult(value) {
    lastResult = value;
    document.getElementById('output').innerHTML = 'ผลล่าสุด: ' + value;
}

function setEye(road, value) {
    if (road === 'big') bigEyeValue = value;
    if (road === 'small') smallValue = value;
    if (road === 'cockroach') cockroachValue = value;
}

function analyzeAsk() {
    const pAsk = [randDot(), randDot(), randDot()];
    const bAsk = [randDot(), randDot(), randDot()];

    const scoreP = pAsk.filter(dot => dot === '🔵').length;
    const scoreB = bAsk.filter(dot => dot === '🔵').length;

    let suggestion = '';
    if (scoreP > scoreB) {
        suggestion = `🎯 แทง P (P Ask)`;
    } else if (scoreB > scoreP) {
        suggestion = `🎯 แทง B (B Ask)`;
    } else {
        suggestion = `⚠️ เค้าใกล้เคียงกัน`;
    }

    const current = {
        result: lastResult,
        big: bigEyeValue,
        small: smallValue,
        cockroach: cockroachValue,
        pAsk,
        bAsk,
        suggestion
    };

    history.unshift(current);
    updateTable();
    updateStats();
    showAskResult(pAsk, bAsk, suggestion);

    // Reset visually
    document.getElementById('output').innerHTML = '';
}

function showAskResult(pAsk, bAsk, suggestion) {
    let html = `<h2>📊 จำลองผลล่วงหน้า</h2>`;
    html += `P Ask: ${pAsk.join(' ')}<br>`;
    html += `B Ask: ${bAsk.join(' ')}<br><br>`;
    html += `<b>${suggestion}</b>`;
    document.getElementById('output').innerHTML = html;
}

function updateTable() {
    const tbody = document.getElementById('historyBody');
    tbody.innerHTML = '';

    for (let i = 0; i < history.length; i++) {
        const item = history[i];

        if (item === 'divider') {
            const dividerRow = document.createElement('tr');
            dividerRow.innerHTML = `<td colspan="10" style="text-align:center; background:#222; color:#fff;">-- เริ่มรอบใหม่ --</td>`;
            tbody.appendChild(dividerRow);
            continue;
        }

        const next = history[i + 1] || {};
        const combo = next.big + next.small + next.cockroach;
        const stats = countNextStats(combo);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.result || '-'}</td>
            <td>${next.big || '-'}</td>
            <td>${next.small || '-'}</td>
            <td>${next.cockroach || '-'}</td>
            <td>${item.pAsk.join(' ')}</td>
            <td>${item.bAsk.join(' ')}</td>
            <td>${item.suggestion}</td>
            <td>P=${stats.P} / B=${stats.B}</td>
            <td><button onclick="removeItem(${i})">ลบ</button></td>
        `;
        tbody.appendChild(row);
    }
}

function updateStats() {
    let lastValid = history.find(item => item !== 'divider');
    if (!lastValid) {
        document.getElementById('statsOutput').innerHTML = 'ไม่มีข้อมูล';
        return;
    }

    const next = history[history.indexOf(lastValid) + 1];
    const combo = next?.big + next?.small + next?.cockroach || '';
    const stats = countNextStats(combo);

    let html = `<b>เค้ารอง:</b> ${combo} <br>`;
    html += `<b>ผลถัดไปที่เคยออก:</b> P = ${stats.P} / B = ${stats.B}`;
    document.getElementById('statsOutput').innerHTML = html;
}

function countNextStats(combo) {
    let count = { P: 0, B: 0 };
    for (let i = 0; i < history.length - 1; i++) {
        const item = history[i];
        const next = history[i + 1];

        if (item === 'divider' || next === 'divider') continue;

        const nextCombo = next.big + next.small + next.cockroach;
        if (nextCombo === combo) {
            if (item.result === 'P') count.P++;
            else if (item.result === 'B') count.B++;
        }
    }
    return count;
}

function randDot() {
    return Math.random() > 0.5 ? '🔵' : '🔴';
}

function resetAll() {
    lastResult = '';
    history = [];
    document.getElementById('output').innerHTML = '';
    document.getElementById('historyBody').innerHTML = '';
    document.getElementById('statsOutput').innerHTML = '';
}

function newSession() {
    history.unshift('divider');
    updateTable();
    updateStats();
}

function removeItem(index) {
    history.splice(index, 1);
    updateTable();
    updateStats();
}
