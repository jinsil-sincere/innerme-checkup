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
  
  const scoreElement = document.querySelector(`.result-score.result-${domain.name} .big-score`);
  const rankElement = document.querySelector(`.result-level.result-${domain.name} strong`);
  
  if (scoreElement) scoreElement.textContent = score;
  if (rankElement) rankElement.textContent = `${rank}등`;
});

document.querySelectorAll('.result-age').forEach(el => el.classList.remove('active'));
const avgScore = scores.reduce((a, b) => a + b) / 5;
const ageElement = document.querySelector(avgScore < 2.5 ? '.result-age1' : avgScore < 5.0 ? '.result-age2' : avgScore < 7.5 ? '.result-age3' : '.result-age4');
if (ageElement) ageElement.classList.add('active');

function createDistributionChart(canvasId, score, mean, sd) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  
  const isMobile = window.innerWidth <= 768;
  const padding = 6;
  const rectHeight = 16;
  const mobilePadding = isMobile ? 4 : 6;
  const mobileRectHeight = isMobile ? 14 : 16;
  const actualPadding = isMobile ? mobilePadding : padding;
  const actualRectHeight = isMobile ? mobileRectHeight : rectHeight;
  
  ctx.clearRect(0, 0, width, height);
  
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  const points = [];
  for (let x = 0; x <= width; x += 2) {
    const scoreValue = (x / width) * 10;
    const z = (scoreValue - mean) / sd;
    const y = height - (height * 0.85 * Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI)) - 30;
    points.push({x, y});
  }
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  
  const meanX = (mean / 10) * width;
  
  ctx.strokeStyle = 'rgba(112, 154, 200, 0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(meanX, 0);
  ctx.lineTo(meanX, height - 13);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.fillStyle = '#a1c3e8';
  const meanTextWidth = ctx.measureText(' 점').width;
  const meanPadding = actualPadding;
  const meanRectWidth = meanTextWidth + meanPadding * 2;
  const meanRectHeight = actualRectHeight;
  
  let meanRectX = meanX - meanRectWidth / 2;
  let meanRectY = height - meanRectHeight - 9;
  
  if (mean <= 1) {
    meanRectX = meanX + 5;
  } else if (mean >= 9) {
    meanRectX = meanX - meanRectWidth - 5;
  }
  
  ctx.fillRect(meanRectX, meanRectY, meanRectWidth, meanRectHeight);
  
  ctx.fillStyle = '#ffffff';
  const meanFontSize = isMobile ? '400 8px Arial' : '400 9px Arial';
  ctx.font = meanFontSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('평균', meanRectX + meanRectWidth / 2, meanRectY + meanRectHeight / 2);
  
  const userX = (score / 10) * width;
  
  let adjustedUserX = userX;
  if (score <= 1) {
    adjustedUserX = userX + 3;
  } else if (score >= 9) {
    adjustedUserX = userX - 3;
  }
  
  ctx.strokeStyle = '#709ac8';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(adjustedUserX, 0);
  ctx.lineTo(adjustedUserX, height - 10);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.fillStyle = '#709ac8';
  const textWidth = ctx.measureText(`${score}점`).width;
  const actualRectWidth = textWidth + actualPadding * 2;
  
  let rectX = userX - actualRectWidth / 2;
  let rectY = height - actualRectHeight - 9;
  
  if (score <= 1) {
    rectX = userX + 5;
  } else if (score >= 9) {
    rectX = userX - actualRectWidth - 5;
  }
  
  if (score === 0) {
    rectX = rectX - 2;
  } else if (score === 10) {
    rectX = rectX + 2;
  }
  
  ctx.fillRect(rectX, rectY, actualRectWidth, actualRectHeight);
  
  ctx.fillStyle = '#ffffff';
  const fontSize = isMobile ? '400 9px Arial' : '400 10px Arial';
  ctx.font = fontSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${score}점`, rectX + actualRectWidth / 2, rectY + actualRectHeight / 2);
  
  ctx.fillStyle = '#999999';
  const axisFontSize = isMobile ? '200 9px Arial' : '200 10px Arial';
  ctx.font = axisFontSize;
  ctx.textAlign = 'center';
  ctx.fillText('0', 10, height - 19);
  ctx.fillText('10', width - 10, height - 19);
}

function createRadarChart(scores) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const size = window.innerWidth <= 480 ? 300 : window.innerWidth <= 768 ? 300 : 350;
  
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  ctx.scale(dpr, dpr);
  
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
    ctx.font = '12px Arial';
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

  const strongest = scores.map((s, i) => s === max ? names[i] : null).filter(Boolean);
  const weakest = scores.map((s, i) => s === min ? names[i] : null).filter(Boolean);
  
  let text = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongest.join("', '")}'</span>입니다. `;
  text += max >= 8 ? '이 영역에서 매우 우수한 역량을 보여주고 있습니다. ' : max >= 6 ? '이 영역에서 우수한 역량을 보여주고 있습니다. ' : '이 영역을 더 발전시킬 수 있는 여지가 있습니다. ';
  text += max - min > 3 ? `<br><br>영역별 점수 차이가 큰 편입니다. 균형 있는 발전을 위해 <span class="highlight-strength">'${weakest.join("', '")}'</span> 영역에 더 관심을 기울여보세요.` : `<br><br>영역별 점수가 비슷한 편입니다. 한 단계 더 성장하려면 <span class="highlight-strength">'${weakest.join("', '")}'</span> 영역에 조금 더 관심을 기울여보세요.`;
  
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

domains.forEach((domain, index) => {
  const canvasId = `${domain.name}Distribution`;
  createDistributionChart(canvasId, scores[index], domain.mean, domain.sd);
});







function createMindAgeVisualization() {
  const canvas = document.getElementById('mindAgeChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // 고해상도 지원
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  
  // 모바일 반응형
  const isMobile = window.innerWidth <= 768;
  const barHeight = isMobile ? 40 : 50;
  const fontSize = isMobile ? 12 : 14;
  const pointerSize = isMobile ? 8 : 10;
  
  // 여백 설정
  const margin = { top: 5, right: 15, bottom: 50, left: 15 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = barHeight;
  
  // 중앙 위치 계산
  const startY = (height - chartHeight) / 2;
  
  ctx.clearRect(0, 0, width, height);
  
  // 단계별 구간 정의 (파란색 계열, 점점 진하게)
  const stages = [
    { name: '아기', range: [0, 2.5], color: '#e0e7eeff', textColor: '#48484aff' },
    { name: '어린이', range: [2.5, 5.0], color: '#c3d4e7ff', textColor: '#48484aff' },
    { name: '청소년', range: [5.0, 7.5], color: '#9dbcddff', textColor: '#48484aff' },
    { name: '성인', range: [7.5, 10], color: '#6d99c8ff', textColor: '#48484aff' }
  ];
  
  // 배경 막대 그리기
  stages.forEach(stage => {
    const startX = margin.left + (stage.range[0] / 10) * chartWidth;
    const stageWidth = ((stage.range[1] - stage.range[0]) / 10) * chartWidth;
    
    ctx.fillStyle = stage.color;
    ctx.fillRect(startX, startY, stageWidth, chartHeight);
    

    ctx.strokeStyle = '#DDDDDD';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + chartHeight);
    ctx.stroke();
  });
  
  ctx.beginPath();
  ctx.moveTo(margin.left + chartWidth, startY);
  ctx.lineTo(margin.left + chartWidth, startY + chartHeight);
  ctx.stroke();
  

  ctx.strokeStyle = '#ffffffff';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(margin.left, startY, chartWidth, chartHeight);
  

  ctx.font = `600 ${fontSize}px Arial`;
  stages.forEach(stage => {
    const centerX = margin.left + ((stage.range[0] + stage.range[1]) / 2 / 10) * chartWidth;
    const centerY = startY + chartHeight / 2 + 5;
    
    ctx.fillStyle = stage.textColor;
    ctx.textAlign = 'center';
    ctx.fillText(stage.name, centerX, centerY);
  });
  

  const currentScore = typeof avgScore !== 'undefined' ? avgScore : 5; 
  const pointerX = margin.left + (currentScore / 10) * chartWidth;

  
  ctx.fillStyle = '#de596fff';
  ctx.beginPath();
  ctx.moveTo(pointerX, startY + chartHeight + 5); 
  ctx.lineTo(pointerX - pointerSize, startY + chartHeight + 15); 
  ctx.lineTo(pointerX + pointerSize, startY + chartHeight + 15); 
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = '#de596fff';
  ctx.font = `500 ${fontSize+2.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('당신의 마음 나이', pointerX, startY + chartHeight + 36.5);
}


createMindAgeVisualization();
