
let lastResult = '';
function setResult(value) {
    lastResult = value;
    document.getElementById('output').innerHTML = 'ผลล่าสุด: ' + value;
}

function analyzeAsk() {
    let big = document.getElementById('bigEye').value;
    let small = document.getElementById('small').value;
    let cockroach = document.getElementById('cockroach').value;

    let pAsk = [randDot(), randDot(), randDot()];
    let bAsk = [randDot(), randDot(), randDot()];

    let scoreP = pAsk.filter(dot => dot === '🔵').length;
    let scoreB = bAsk.filter(dot => dot === '🔵').length;

    let result = `<h2>📊 จำลองผลล่วงหน้า</h2>`;
    result += `P Ask: ${pAsk.join(' ')}<br>`;
    result += `B Ask: ${bAsk.join(' ')}<br><br>`;

    if (scoreP > scoreB) {
        result += `🎯 <b>แนะนำ: แทง P (P Ask)</b>`;
    } else if (scoreB > scoreP) {
        result += `🎯 <b>แนะนำ: แทง B (B Ask)</b>`;
    } else {
        result += `⚠️ เค้าใกล้เคียงกัน รอดู 1 ตา`;
    }

    document.getElementById('output').innerHTML = result;
}

function randDot() {
    return Math.random() > 0.5 ? '🔵' : '🔴';
}

function resetAll() {
    lastResult = '';
    document.getElementById('output').innerHTML = '';
}
