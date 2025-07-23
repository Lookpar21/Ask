let lastResult = '';
let history = [];

function setResult(value) {
    lastResult = value;
    document.getElementById('output').innerHTML = 'ผลล่าสุด: ' + value;
}

function analyzeAsk() {
    const big = document.getElementById('bigEye').value;
    const small = document.getElementById('small').value;
    const cockroach = document.getElementById('cockroach').value;

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
        big,
        small,
        cockroach,
        pAsk,
        bAsk,
        suggestion
    };

    history.unshift(current);
    updateTable();
    updateStats();
    showAskResult(pAsk, bAsk, suggestion);
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

    history.forEach((item, index) => {
        const combo = item.big + item.small + item.cockroach;
        const stats = countNextStats(combo, index); // ใช้ผลถัดไปแทน

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.result || '-'}</td>
            <td>${item.big}</td>
            <td>${item.small}</td>
            <td>${item.cockroach}</td>
            <td>${item.pAsk.join(' ')}</td>
            <td>${item.bAsk.join(' ')}</td>
            <td>${item.suggestion}</td>
            <td>P=${stats.P} / B=${stats.B}</td>
            <td><button onclick="removeItem(${index})">ลบ</button></td>
        `;
        tbody.appendChild(row);
    });
}

function updateStats() {
    if (history.length < 2) {
        document.getElementById('statsOutput').innerHTML = 'ไม่มีข้อมูล';
        return;
    }

    const latest = history[0];
    const combo = latest.big + latest.small + latest.cockroach;
    const stats = countNextStats(combo, 0);

    let html = `<b>เค้ารอง:</b> ${combo} <br>`;
    html += `<b>ผลถัดไปที่เคยออก:</b> P = ${stats.P} / B = ${stats.B}`;
    document.getElementById('statsOutput').innerHTML = html;
}

function countNextStats(combo, startIndex = 0) {
    let count = { P: 0, B: 0 };
    for (let i = startIndex; i < history.length - 1; i++) {
        const item = history[i];
        const nextItem = history[i + 1];
        if (item.big + item.small + item.cockroach === combo) {
            if (nextItem.result === 'P') count.P++;
            else if (nextItem.result === 'B') count.B++;
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

// ✅ ใหม่: ปุ่มเริ่มรอบใหม่
function newSession() {
    history = [];
    document.getElementById('historyBody').innerHTML = '';
    document.getElementById('statsOutput').innerHTML = 'ไม่มีข้อมูล';
}

// ✅ ใหม่: ลบข้อมูลเฉพาะรายการ
function removeItem(index) {
    history.splice(index, 1);
    updateTable();
    updateStats();
}
