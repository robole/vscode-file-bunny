class Step {
  constructor(numOfStep, title, placeholder, items = [], buttons = []) {
    this.numOfStep = numOfStep;
    this.title = title;
    this.placeholder = placeholder;
    this.value = "";
    this.buttons = buttons;
    this.items = items;
    this.selectedItems = [];
  }
}

module.exports = Step;
