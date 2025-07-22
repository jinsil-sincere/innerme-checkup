
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
  return z > 0 ? 1 - prob : prob;
}

domains.forEach(domain => {
  const sum = domain.questions.reduce((acc, q) => acc + (parseInt(responses[q]) || 0), 0);
  const score = Math.round(((sum / domain.questions.length - 1) / 3) * 10);  
  scores.push(score);
  
  const rank = Math.max(1, Math.min(100, Math.round((1 - normalCDF((score - domain.mean) / domain.sd)) * 100)));
  
  document.querySelector(`.result-score.result-${domain.name} .big-score`).textContent = score;
  document.querySelector(`.result-level.result-${domain.name} strong`).textContent = `${rank}등`;
});

document.querySelectorAll('.result-age').forEach(el => el.classList.remove('active'));
const avgScore = scores.reduce((a, b) => a + b) / 5;
document.querySelector(avgScore < 2.5 ? '.result-age1' : avgScore < 5.0 ? '.result-age2' : avgScore < 7.5 ? '.result-age3' : '.result-age4').classList.add('active');

function createRadarChart(scores) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const size = window.innerWidth <= 480 ? 300 : window.innerWidth <= 768 ? 300 : 350;
  
  canvas.width = canvas.height = size;
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  
  const center = size / 2;
  const radius = center - 80;
  const labels = ['나를\n수용하기', '삶의 방향\n세우기', '편안한\n관계맺기', '유연하게\n생각하기', '감정\n돌보기'];
  
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(center, center, radius * i / 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();
  }
  
  for (let i = 0; i < 5; i++) {
    const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
    
    ctx.fillStyle = '#000';
    ctx.font = `${size <= 300 ? 12 : 12}px Arial`;
    ctx.textAlign = 'center';
    
    const labelX = center + Math.cos(angle) * (radius + 30);
    const labelY = center + Math.sin(angle) * (radius + 30);
    
    labels[i].split('\n').forEach((line, j) => {
      ctx.fillText(line, labelX, labelY + j * 12 - 6);
    });
  }
  
  const reorderedScores = [scores[2], scores[4], scores[3], scores[1], scores[0]];
  
  ctx.beginPath();
  reorderedScores.forEach((score, i) => {
    const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
    const x = center + Math.cos(angle) * (score / 10 * radius);
    const y = center + Math.sin(angle) * (score / 10 * radius);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(112, 154, 200, 0.3)';
  ctx.fill();
  ctx.strokeStyle = '#709ac8';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function createChartAnalysis(scores) {
  const box = document.getElementById('chart-analysis');
  if (!box) return;
  
  const names = ['감정 돌보기', '유연하게 생각하기', '나를 수용하기', '편안한 관계맺기', '삶의 방향 세우기'];
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const avg = Math.round(scores.reduce((a, b) => a + b) *2);

  const strongest = scores.map((s, i) => s === max ? names[i] : null).filter(Boolean);
  const weakest = scores.map((s, i) => s === min ? names[i] : null).filter(Boolean);
  
  let text = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongest.join("', '")}'</span>입니다. `;
  text += max >= 8 ? '이 영역에서 매우 우수한 역량을 보여주고 있습니다.' : max >= 6 ? '이 영역에서 우수한 역량을 보여주고 있습니다.' : '이 영역을 더 발전시킬 수 있는 여지가 있습니다.';
  text += `<br><br>또한 종합 점수는 <span class="highlight-strength">${avg}점</span>이며, `;
  text += max - min > 3 ? `점수 차이가 큰 편입니다. 균형 있는 발전을 위해 <span class="highlight-strength">'${weakest.join("', '")}'</span> 영역에 더 관심을 기울여보세요.` : '점수가 비교적 균형 잡혀 있습니다. 모든 영역에서 고르게 발전하고 있습니다.';
  
  box.innerHTML = text;
}

function saveAsImage() {
  document.querySelectorAll('.btn-save, .btn-share, #share-message').forEach(el => el.style.display = 'none');
  html2canvas(document.body, { scale: 2, backgroundColor: '#ffffff' })
    .then(canvas => {
      document.querySelectorAll('.btn-save, .btn-share').forEach(el => el.style.display = 'flex');
      const link = document.createElement('a');
      link.download = 'InnerMe_Checkup_Report.png';
      link.href = canvas.toDataURL();
      link.click();
    });
}

function share() {
  navigator.clipboard.writeText('https://innerme-checkup.netlify.app/');
}

window.saveAsImage = saveAsImage;
window.share = share;

createRadarChart(scores);
createChartAnalysis(scores);
