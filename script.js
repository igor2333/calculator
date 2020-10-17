class Calculator {
  constructor(previousOperand, currentOperand) {
    this.previousOperand = previousOperand;
    this.currentOperand = currentOperand;
    this.isCompleted = false;
    this.clear();
  }

  setOperation(operation) {
    if (this.current === '' && operation === '-') {
      this.typeNumber(operation);
      return;
    }
    if (this.current === '') return;
    if (this.current !== '' && this.previous !== '') this.calculate();
    this.operation = operation !== 'xy' ? operation : '^';
    this.previous = this.current;
    this.current = '';
    this.isCompleted = false;
    if (operation === '√') {
      this.calculate();
      this.display();
    }
  }

  clear() {
    this.previous = '';
    this.current = '';
    this.operation = null;
  }

  typeNumber(number) {
    if (this.isCompleted) {
      this.current = '';
      this.isCompleted = false;
    }
    if (number === '.' && this.current.includes('.')) return;
    if (number === '-' && this.current.includes('-')) return;
    this.current = `${this.current}${number}`;
  }

  delete() {
    this.current = this.current.toString().slice(0, -1);
  }

  getFormattedNumber(number) {
    const strNumber = number.toString();
    let [intPart, decPart] = strNumber.split('.');
    if (decPart && decPart.length > 7) decPart = parseFloat(+number.toFixed(7)).toString().split('.')[1];
    let int = intPart && !isNaN(intPart) ? parseFloat(intPart).toLocaleString('en', { maximumFractionDigits: 0 }) : '';
    if (number === '-') int = '-';
    const dec = decPart ? `${decPart}` : '';
    let dot = strNumber.includes('.') ? '.' : '';
    if (int && !dec && this.isCompleted) dot = '';
    return `${int}${dot}${dec}`;
  }

  display() {
    this.currentOperand.innerText = this.getFormattedNumber(this.current);
    this.previousOperand.innerText = `${this.getFormattedNumber(this.previous)} ${this.operation ? this.operation : ''}`;
  }

  calculate() {
    const prev = parseFloat(this.previous);
    let curr = parseFloat(this.current);
    if (isNaN(prev)) return;
    if (isNaN(curr)) curr = prev;
    let result;
    switch (this.operation) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '×': result = prev * curr; break;
      case '÷': result = prev / curr; break;
      case '√': result = Math.sqrt(prev); break;
      case '^': result = prev ** curr; break;
    }
    this.previous = '';
    this.current = result;
    this.operation = null;
    this.isCompleted = true;
  }
}

const previousOperand = document.querySelector('[data-previous-operand]');
const currentOperand = document.querySelector('[data-current-operand]');
const numbers = document.querySelectorAll('[data-number]');
const operations = document.querySelectorAll('[data-operation]');
const delBtn = document.querySelector('[data-delete]');
const clearBtn = document.querySelector('[data-clear-all]');
const equalsBtn = document.querySelector('[data-equals]');

const calculator = new Calculator(previousOperand, currentOperand);

numbers.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.typeNumber(button.innerText);
    calculator.display();
  });
}); 

operations.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.setOperation(button.innerText);
    calculator.display();
  });
});

delBtn.addEventListener('click', () => {
  calculator.delete();
  calculator.display();
});

clearBtn.addEventListener('click', () => {
  calculator.clear();
  calculator.display();
});

equalsBtn.addEventListener('click', () => {
  calculator.calculate();
  calculator.display();
});
