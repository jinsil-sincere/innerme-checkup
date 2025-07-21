const responses = JSON.parse(localStorage.getItem("innermeResponses")) || {};

document.querySelectorAll('.choice').forEach(choice => {
  choice.addEventListener('click', function () {
    const questionBox = this.closest('.question-box');
    questionBox.querySelectorAll('.choice').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    
    responses[questionBox.getAttribute('data-question')] = this.getAttribute('data-value');
    localStorage.setItem("innermeResponses", JSON.stringify(responses));
  });
});

document.querySelector('.btn-next')?.addEventListener('click', function (e) {
  const unanswered = document.querySelectorAll('.question-box').length - document.querySelectorAll('.choice.active').length;
  if (unanswered > 0) {
    alert('응답하지 않은 문항이 있습니다.');
    e.preventDefault();
  }
});