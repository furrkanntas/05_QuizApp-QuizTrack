export class Question {
  constructor(index, questionData) {
      this.index = index;
      this.questionText = questionData.question;
      this.options = questionData.options;
  }

  createQuestionElement() {
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('list-group-item', 'flex', 'items-start', 'gap-2', 'bg-white/30', 'mt-4', 'rounded-xl', 'border-l-4', 'border-orange-300', 'hover:border-blue-300', 'shadow-md');
      questionDiv.setAttribute('data-question-index', this.index);
      questionDiv.innerHTML = `
      <div class="flex flex-col p-3 pr-6">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-door-closed text-orange-600 text-2xl"></i>
          <i class="fa-solid fa-door-open text-orange-600 text-2xl hidden"></i>
          <span class="font-bold username">q-${this.index + 1}:</span>
          <span class="message font-semibold">${this.questionText}</span>
          <i class="fa-solid fa-question text-orange-600 text-xl"></i>
        </div>
        <div class="flex flex-col items-start justify-center gap-2 mt-4 mb-3">
          ${this.createOptionsElements()}
        </div>
      </div>
      `;
      return questionDiv;
  }

  createOptionsElements() {
      return Object.entries(this.options)
          .map(([key, value]) => this.createOptionElement(key, value))
          .join('');
  }

  createOptionElement(optionKey, optionText) {
      return `
      <div class="option flex items-center border-[1px] border-green-700 hover:bg-yellow-200 cursor-pointer py-2 px-3 rounded-full gap-2" data-option-key="${optionKey}">
        <i class="fa-solid fa-key text-purple-500"></i>
        <div class="${optionKey}">${optionText}</div>
      </div>
      `;
  }
}