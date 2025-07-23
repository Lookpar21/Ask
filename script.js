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

    // บันทึกข้อมูลในตาราง
    const current = {
        result: lastResult,
        big, small, cockroach
    };

    history.unshift(current); // เพิ่มรายการใหม่ไว้ด้านบน

    updateTable();
    updateStats();
}

function updateTable() {
    const tbody = document.getElementById('historyBody');
    tbody.innerHTML = '';

    history.forEach((item, index) => {
        const row = document.createElement('tr');

        const combo = item.big + item.small + item.cockroach;
        const stats = countStats(combo);

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.result || '-'}</td>
            <td>${item.big}</td>
            <td>${item.small}</td>
            <td>${item.cockroach}</td>
            <td>P=${stats.P} / B=${stats.B}</td>
        `;

        tbody.appendChild(row);
    });
}

function updateStats() {
    if (history.length === 0) {
        document.getElementById('statsOutput').innerHTML = 'ไม่มีข้อมูล';
        return;
    }

    const latest = history[0];
    const combo = latest.big + latest.small + latest.cockroach;
    const stats = countStats(combo);

    let html = `<b>เค้ารอง:</b> ${combo} <br>`;
    html += `<b>เคยออก:</b> P = ${stats.P} / B = ${stats.B}`;
    document.getElementById('statsOutput').innerHTML = html;
}

function countStats(combo) {
    let count = { P: 0, B: 0 };
    history.forEach(item => {
        if (item.big + item.small + item.cockroach === combo) {
            if (item.result === 'P') count.P++;
            else if (item.result === 'B') count.B++;
        }
    });
    return count;
}

function resetAll() {
    lastResult = '';
    history = [];
    document.getElementById('output').innerHTML = '';
    document.getElementById('historyBody').innerHTML = '';
    document.getElementById('statsOutput').innerHTML = '';
}
