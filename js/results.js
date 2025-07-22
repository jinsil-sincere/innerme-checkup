
// const responses = JSON.parse(localStorage.getItem("innermeResponses")) || {};

// const domains = [
//   { name: 'emotion', questions: [1,2,3], mean: 5.8, sd: 1.2 },
//   { name: 'thinking', questions: [4,5,6], mean: 6.3, sd: 0.9 },
//   { name: 'self', questions: [7,8,9], mean: 6.0, sd: 1.0 },
//   { name: 'relationship', questions: [10,11,12], mean: 6.1, sd: 1.1 },
//   { name: 'life', questions: [13,14,15], mean: 5.9, sd: 1.3 }
// ];

// const scores = [];

// function normalCDF(z) {
//   const t = 1 / (1 + 0.2316419 * Math.abs(z));
//   const d = 0.3989423 * Math.exp(-z * z / 2);
//   let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
//   if (z > 0) return 1 - prob;
//   else return prob;
// }


// domains.forEach(domain => {
//   const sum = domain.questions.reduce((acc, q) => acc + (parseInt(responses[q]) || 0), 0);
//   const avg = sum / domain.questions.length;  
//   const score = Math.round(((avg - 1) / 3) * 10);  
//   scores.push(score);
  
//   const z = (score - domain.mean) / domain.sd;
//   const percentile = normalCDF(z);  
//   const rank = Math.max(1, Math.min(100, Math.round((1 - percentile) * 100)));  
  
//   document.querySelector(`.result-score.result-${domain.name} .big-score`).textContent = score;
//   document.querySelector(`.result-level.result-${domain.name} strong`).textContent = `${rank}등`;
// });


// document.querySelectorAll('.result-age').forEach(el => el.classList.remove('active'));
// const avgScore = scores.reduce((acc, score) => acc + score, 0) / scores.length;
// document.querySelector(avgScore < 2.5 ? '.result-age1' : avgScore < 5.0 ? '.result-age2' : avgScore < 7.5 ? '.result-age3' : '.result-age4').classList.add('active');





// function saveAsImage() {
//   const saveBtn = document.querySelector('.btn-save');
//   const shareBtn = document.querySelector('.btn-share');
//   const shareMessage = document.getElementById('share-message');
  
//   saveBtn.style.display = 'none';
//   shareBtn.style.display = 'none';
//   shareMessage.style.display = 'none';
  
//   const element = document.body;
  
//   html2canvas(element, {
//     scale: 2,
//     useCORS: true,
//     backgroundColor: '#ffffff'
//   }).then(canvas => {
//     saveBtn.style.display = 'flex';
//     shareBtn.style.display = 'flex';
    
//     const link = document.createElement('a');
//     link.download = 'InnerMe_Checkup_Report.png';
//     link.href = canvas.toDataURL('image/png');
//     link.click();
//   }).catch(error => {
//     saveBtn.style.display = 'flex';
//     shareBtn.style.display = 'flex';
    
//     console.error('Error:', error);
//     alert('이미지 저장에 실패했습니다.');
//   });
// }

// function share() {
//   navigator.clipboard.writeText('https://innerme-checkup.netlify.app/');
// }


// window.saveAsImage = saveAsImage;
// window.share = share;









// function createRadarChart(scores) {
//   const canvas = document.getElementById('radarChart');
//   if (!canvas) {
//     console.error('radarChart canvas not found');
//     return;
//   }
  
//   const ctx = canvas.getContext('2d');
//   const labels = ['감정 <br> 돌보기', '유연하게 <br> 생각하기', '자기 <br> 수용하기', '편안한 <br> 관계맺기', '삶의 방향 <br> 세우기'];
  
//   const isMobile = window.innerWidth <= 768;
//   const width = isMobile ? 300 : 350;
//   const height = isMobile ? 300 : 350;
  
//   canvas.width = width;
//   canvas.height = height;
  
//   const centerX = width / 2;
//   const centerY = height / 2;
//   const radius = Math.min(width, height) * 0.35;
  
//   ctx.strokeStyle = '#e0e0e0';
//   ctx.lineWidth = 1;
//   for (let i = 1; i <= 5; i++) {
//     const currentRadius = (radius / 10) * i * 2; 
//     ctx.beginPath();
//     ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI);
//     ctx.stroke();
//   }
  
//   ctx.strokeStyle = '#e0e0e0';
//   ctx.lineWidth = 1;
//   for (let i = 0; i < 5; i++) {
//     const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
//     const x = centerX + Math.cos(angle) * radius;
//     const y = centerY + Math.sin(angle) * radius;
    
//     ctx.beginPath();
//     ctx.moveTo(centerX, centerY);
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   }
  
//   ctx.fillStyle = 'rgba(112, 154, 200, 0.8)';
//   ctx.strokeStyle = 'rgba(112, 154, 200, 1)';
//   ctx.lineWidth = 2;
  
//   ctx.beginPath();
//   for (let i = 0; i < scores.length; i++) {
//     const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
//     const scoreRadius = (scores[i] / 10) * radius; 
//     const x = centerX + Math.cos(angle) * scoreRadius;
//     const y = centerY + Math.sin(angle) * scoreRadius;
    
//     if (i === 0) {
//       ctx.moveTo(x, y);
//     } else {
//       ctx.lineTo(x, y);
//     }
//   }
//   ctx.closePath();
//   ctx.fill();
//   ctx.stroke();
  

//   ctx.fillStyle = 'rgba(112, 154, 200, 1)';
//   for (let i = 0; i < scores.length; i++) {
//     const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
//     const scoreRadius = (scores[i] / 10) * radius; 
//     const x = centerX + Math.cos(angle) * scoreRadius;
//     const y = centerY + Math.sin(angle) * scoreRadius;
    
//     ctx.beginPath();
//     ctx.arc(x, y, 4, 0, 2 * Math.PI);
//     ctx.fill();
//   }
  
//   ctx.fillStyle = '#373b42';
//   ctx.font = '400 12px Arial';
//   ctx.textAlign = 'center';
//   for (let i = 0; i < labels.length; i++) {
//     const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
//     const labelRadius = radius + 20;
//     const x = centerX + Math.cos(angle) * labelRadius;
//     const y = centerY + Math.sin(angle) * labelRadius + 4;
    
//     ctx.fillText(labels[i], x, y);
//   }
// }

// console.log('Creating radar chart with scores:', scores);
// createRadarChart(scores);
// createChartAnalysis(scores);

// function createRadarChart(scores) {
//     const canvas = document.getElementById('radarChart');
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
    
//     const dpr = window.devicePixelRatio || 1;
//     const rect = canvas.getBoundingClientRect();
    
//     canvas.width = rect.width * dpr;
//     canvas.height = rect.height * dpr;
//     ctx.scale(dpr, dpr);
    
//     const centerX = canvas.width / dpr / 2;
//     const centerY = canvas.height / dpr / 2;
    
//     const radius = Math.min(centerX, centerY) - 70;
//     const labelOffset = 45;
    
//     const labels = [
//       '나를\n수용하기', 
//       '삶의 방향\n세우기', 
//       '편안한\n관계맺기', 
//       '유연하게\n생각하기', 
//       '감정\n돌보기'
//     ];
//     const colors = ['#709ac8', '#a1c3e8', '#cae1fb', '#e8f2ff', '#f0f8ff'];
    
//     ctx.strokeStyle = '#e0e0e0';
//     ctx.lineWidth = 1;
//     for (let i = 1; i <= 5; i++) {
//       const r = (radius / 5) * i;
//       ctx.beginPath();
//       ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
//       ctx.stroke();
//     }
    
//     ctx.strokeStyle = '#cccccc';
//     ctx.lineWidth = 1;
//     for (let i = 0; i < labels.length; i++) {
//       const angle = (i * 2 * Math.PI) / labels.length - Math.PI / 2;
//       const x = centerX + Math.cos(angle) * radius;
//       const y = centerY + Math.sin(angle) * radius;
      
//       ctx.beginPath();
//       ctx.moveTo(centerX, centerY);
//       ctx.lineTo(x, y);
//       ctx.stroke();

//       ctx.fillStyle = '#000000';
//       ctx.font = '300 14px Arial';
//       ctx.textAlign = 'center';
//       const labelX = centerX + Math.cos(angle) * (radius + labelOffset);
//       let labelY = centerY + Math.sin(angle) * (radius + labelOffset);
      
//       if (i === 0) { 
//         labelY += 25;
//       } else if (i === 1) { 
//         labelY += 8;
//       } else if (i === 2) {
//         labelY += 8;
//       } else if (i === 3) { 
//         labelY += 8;
//       } else if (i === 4) { 
//         labelY += 25;
//       }
      
//       const labelLines = labels[i].split('\n');
//       const lineHeight = 15; 
//       labelLines.forEach((line, index) => {
//         const lineY = labelY + (index - 0.5) * lineHeight;
//         ctx.fillText(line, labelX, lineY);
//       });
//     }
    
//     ctx.fillStyle = 'rgba(112, 154, 200, 0.3)';
//     ctx.strokeStyle = '#709ac8';
//     ctx.lineWidth = 2;
    
//     const reorderedScores = [
//       scores[2], 
//       scores[4], 
//       scores[3], 
//       scores[1], 
//       scores[0]  
//     ];
    
//     ctx.beginPath();
//     for (let i = 0; i < reorderedScores.length; i++) {
//       const angle = (i * 2 * Math.PI) / reorderedScores.length - Math.PI / 2;
//       const r = (reorderedScores[i] / 10) * radius; 
//       const x = centerX + Math.cos(angle) * r;
//       const y = centerY + Math.sin(angle) * r;
      
//       if (i === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     }
//     ctx.closePath();
//     ctx.fill();
//     ctx.stroke();
// }

// const isMobile = window.innerWidth <= 768;
// const isSmallMobile = window.innerWidth <= 480;
// const fontSize = isSmallMobile ? 11 : isMobile ? 12 : 14;
// const fontSize = isSmallMobile ? 11 : isMobile ? 12 : 14;



// function createChartAnalysis(scores) {
//     const analysisBox = document.getElementById('chart-analysis');
//     if (!analysisBox) return;
//     const domainNames = ['감정 돌보기', '유연하게 생각하기', '나를 수용하기', '편안한 관계맺기', '삶의 방향 세우기'];
//     const shortNames = ['감정 돌보기', '유연하게 생각하기', '나를 수용하기', '편안한 관계맺기', '삶의 방향 세우기'];

//     const maxScore = Math.max(...scores);
//     const maxIndices = scores.map((score, index) => score === maxScore ? index : -1).filter(index => index !== -1);
//     const strongestDomains = maxIndices.map(index => shortNames[index]);
//     const minScore = Math.min(...scores);
//     const minIndices = scores.map((score, index) => score === minScore ? index : -1).filter(index => index !== -1);
//     const weakestDomains = minIndices.map(index => shortNames[index]);
    
//     const avgScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
//     let analysisText = '';
    
//     if (maxScore >= 8) {
//       if (strongestDomains.length === 1) {
//         analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains[0]}'</span>입니다. 이 영역에서 매우 우수한 역량을 보여주고 있습니다.`;
//       } else {
//         analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains.join("', '")}'</span>입니다. 이 영역들에서 매우 우수한 역량을 보여주고 있습니다.`;
//       }
//     } else if (maxScore >= 6) {
//       if (strongestDomains.length === 1) {
//         analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains[0]}'</span>입니다. 이 영역에서 우수한 역량을 보여주고 있습니다.`;
//       } else {
//         analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains.join("', '")}'</span>입니다. 이 영역들에서 우수한 역량을 보여주고 있습니다.`;
//       }
//     } else {
//       if (strongestDomains.length === 1) {
//         analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains[0]}'</span>입니다. 이 영역을 더 발전시킬 수 있는 여지가 있습니다.`;
//       } else {
//         analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains.join("', '")}'</span>입니다. 이 영역들을 더 발전시킬 수 있는 여지가 있습니다.`;
//       }
//     }
    
//     analysisText += `<br><br>전체 평균 점수는 <span class="highlight-strength">${avgScore}점</span>이며,`;
    
//     if (maxScore - minScore > 3) {
//       if (weakestDomains.length === 1) {
//         analysisText += `점수 차이가 큰 편입니다. 균형 있는 발전을 위해 <span class="highlight-strength">'${weakestDomains[0]}'</span> 영역에 더 많은 관심을 기울여보세요.`;
//       } else {
//         analysisText += `점수 차이가 큰 편입니다. 균형 있는 발전을 위해 <span class="highlight-strength">'${weakestDomains.join("', '")}'</span> 영역들에 더 많은 관심을 기울여보세요.`;
//       }
//     } else {
//       analysisText += `모든 영역에서 고르게 발전하고 있습니다.`;
//     }
//     analysisBox.innerHTML = analysisText;
//   }


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
  const size = window.innerWidth <= 480 ? 260 : window.innerWidth <= 768 ? 300 : 350;
  
  canvas.width = canvas.height = size;
  
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
    ctx.font = `${size <= 260 ? 10 : 12}px Arial`;
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
  const avg = Math.round(scores.reduce((a, b) => a + b) / 5);
  
  const strongest = scores.map((s, i) => s === max ? names[i] : null).filter(Boolean);
  const weakest = scores.map((s, i) => s === min ? names[i] : null).filter(Boolean);
  
  let text = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongest.join("', '")}'</span>입니다. `;
  text += max >= 8 ? '매우 우수한 역량을 보여주고 있습니다.' : max >= 6 ? '우수한 역량을 보여주고 있습니다.' : '발전시킬 여지가 있습니다.';
  text += `<br><br>전체 평균 점수는 <span class="highlight-strength">${avg}점</span>이며, `;
  text += max - min > 3 ? `균형 있는 발전을 위해 <span class="highlight-strength">'${weakest.join("', '")}'</span> 영역에 더 관심을 기울여보세요.` : '모든 영역에서 고르게 발전하고 있습니다.';
  
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
