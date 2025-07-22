
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
  const saveBtn = document.querySelector('.btn-save');
  const shareBtn = document.querySelector('.btn-share');
  const shareMessage = document.getElementById('share-message');
  
  saveBtn.style.display = 'none';
  shareBtn.style.display = 'none';
  shareMessage.style.display = 'none';
  
  const element = document.body;
  
  html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    saveBtn.style.display = 'flex';
    shareBtn.style.display = 'flex';
    
    const link = document.createElement('a');
    link.download = 'InnerMe_Checkup_Report.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(error => {
    saveBtn.style.display = 'flex';
    shareBtn.style.display = 'flex';
    
    console.error('Error:', error);
    alert('이미지 저장에 실패했습니다.');
  });
}


function shareResults() {
  const url = window.location.href.replace('results.html', 'index.html');
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
    msg.innerHTML = `링크: <br><strong>${url}</strong><br>위 링크를 복사해주세요`;
    msg.style.display = 'block';
  }
}


window.saveAsImage = saveAsImage;
window.shareResults = shareResults;





function createChartAnalysis(scores) {
    const analysisBox = document.getElementById('chart-analysis');
    if (!analysisBox) return;
    const domainNames = ['감정 돌보기', '유연하게 생각하기', '나를 수용하기', '편안한 관계맺기', '삶의 방향 세우기'];
    const shortNames = ['감정 돌보기', '유연하게 생각하기', '나를 수용하기', '편안한 관계맺기', '삶의 방향 세우기'];

    const maxScore = Math.max(...scores);
    const maxIndices = scores.map((score, index) => score === maxScore ? index : -1).filter(index => index !== -1);
    const strongestDomains = maxIndices.map(index => shortNames[index]);
    const minScore = Math.min(...scores);
    const minIndices = scores.map((score, index) => score === minScore ? index : -1).filter(index => index !== -1);
    const weakestDomains = minIndices.map(index => shortNames[index]);
    
    const avgScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
    let analysisText = '';
    
    if (maxScore >= 8) {
      if (strongestDomains.length === 1) {
        analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains[0]}'</span>입니다. 이 영역에서 매우 우수한 역량을 보여주고 있습니다.`;
      } else {
        analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains.join("', '")}'</span>입니다. 이 영역들에서 매우 우수한 역량을 보여주고 있습니다.`;
      }
    } else if (maxScore >= 6) {
      if (strongestDomains.length === 1) {
        analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains[0]}'</span>입니다. 이 영역에서 우수한 역량을 보여주고 있습니다.`;
      } else {
        analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains.join("', '")}'</span>입니다. 이 영역들에서 우수한 역량을 보여주고 있습니다.`;
      }
    } else {
      if (strongestDomains.length === 1) {
        analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains[0]}'</span>입니다. 이 영역을 더 발전시킬 수 있는 여지가 있습니다.`;
      } else {
        analysisText = `당신의 가장 강점이 되는 영역은 <span class="highlight-strength">'${strongestDomains.join("', '")}'</span>입니다. 이 영역들을 더 발전시킬 수 있는 여지가 있습니다.`;
      }
    }
    
    analysisText += `<br><br>전체 평균 점수는 <span class="highlight-strength">${avgScore}점</span>이며, `;
    
    if (maxScore - minScore > 3) {
      if (weakestDomains.length === 1) {
        analysisText += `점수 차이가 큰 편입니다. 균형 있는 발전을 위해 <span class="highlight-strength">'${weakestDomains[0]}'</span> 영역에 더 많은 관심을 기울여보세요.`;
      } else {
        analysisText += `점수 차이가 큰 편입니다. 균형 있는 발전을 위해 <span class="highlight-strength">'${weakestDomains.join("', '")}'</span> 영역들에 더 많은 관심을 기울여보세요.`;
      }
    } else {
      analysisText += `점수가 비교적 균형 잡혀 있습니다. 모든 영역에서 고르게 발전하고 있습니다.`;
    }
    analysisBox.innerHTML = analysisText;
  }


