
const responses = JSON.parse(localStorage.getItem("innermeResponses")) || {};

const domains = [
  { name: 'emotion', questions: [1,2,3], mean: 5.8, sd: 1.2 },
  { name: 'thinking', questions: [4,5,6], mean: 6.3, sd: 0.9 },
  { name: 'self', questions: [7,8,9], mean: 6.0, sd: 1.0 },
  { name: 'relationship', questions: [10,11,12], mean: 6.1, sd: 1.1 },
  { name: 'life', questions: [13,14,15], mean: 5.9, sd: 1.3 }
];

const scores = [];

function normalCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) return 1 - prob;
  else return prob;
}


domains.forEach(domain => {
  const sum = domain.questions.reduce((acc, q) => acc + (parseInt(responses[q]) || 0), 0);
  const avg = sum / domain.questions.length;  
  const score = Math.round(((avg - 1) / 3) * 10);  
  scores.push(score);
  
  const z = (score - domain.mean) / domain.sd;
  const percentile = normalCDF(z);  
  const rank = Math.max(1, Math.min(100, Math.round((1 - percentile) * 100)));  
  
  document.querySelector(`.result-score.result-${domain.name} .big-score`).textContent = score;
  document.querySelector(`.result-level.result-${domain.name} strong`).textContent = `${rank}등`;
});


document.querySelectorAll('.result-age').forEach(el => el.classList.remove('active'));
const avgScore = scores.reduce((acc, score) => acc + score, 0) / scores.length;
document.querySelector(avgScore < 2.5 ? '.result-age1' : avgScore < 5.0 ? '.result-age2' : avgScore < 7.5 ? '.result-age3' : '.result-age4').classList.add('active');





function saveAsImage() {
  const element = document.body;
  html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'InnerMe_Checkup_Report.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(error => {
    console.error('Error:', error);
    alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
  });
}


function shareResults() {
  const baseUrl = window.location.origin + window.location.pathname.replace('results.html', '');
  const url = baseUrl + 'index.html';
  const textArea = document.createElement('textarea');
  textArea.value = url;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
  } catch (err) {
    document.body.removeChild(textArea);
    const msg = document.getElementById('share-message');
    msg.innerHTML = `링크: <br><strong>${url}</strong><br>위 링크를 복사해서 공유하세요`;
    msg.style.display = 'block';
  }
}


window.saveAsImage = saveAsImage;
window.shareResults = shareResults;


