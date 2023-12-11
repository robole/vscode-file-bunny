// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");

const util = require("./util");

class MultiStepPicker {
  constructor(steps = []) {
    this.currentStepNum = 1;
    this.steps = steps;

    let command1 = vscode.commands.registerCommand("filebunny.back", () => {
      this.goBack();
    });
    let command2 = vscode.commands.registerCommand(
      "filebunny.next",
      () => {} // prevents error
    );

    util.enableKeyBindings();

    this.running = false;
    this.picker = vscode.window.createQuickPick();
    this.picker.totalSteps = this.steps.length;
    this.picker.ignoreFocusOut = true;

    let disposable1 = this.picker.onDidHide(this.onDidHide.bind(this));
    let disposable2 = this.picker.onDidTriggerButton(
      this.onDidTriggerButton.bind(this)
    );
    let disposable3 = this.picker.onDidAccept(this.onDidAccept.bind(this));

    this.disposables = [
      command1,
      command2,
      disposable1,
      disposable2,
      disposable3,
    ];
  }

  async run() {
    if (this.picker !== null && this.steps.length > 0) {
      this.picker.totalSteps = this.steps.length;
      this.setCurrentStep(this.steps[0]);
      this.picker.show();
      this.running = true;
    }
  }

  setCurrentStep(step) {
    this.currentStepNum = step.numOfStep;

    this.picker.title = step.title;
    this.picker.step = step.numOfStep;
    this.picker.placeholder = step.placeholder;
    this.picker.items = step.items;
    this.picker.value = step.value;
    this.picker.buttons = step.buttons;
  }

  goBack() {
    if (this.currentStepNum > 1) {
      let previousIndex = this.currentStepNum - 2;

      this.picker.enabled = false;
      this.setCurrentStep(this.steps[previousIndex]);

      // required to clear filter if text was entered in last step
      setTimeout(() => {
        this.picker.value = this.steps[previousIndex].value;
        this.picker.items = this.steps[previousIndex].items;
      }, 20);
      this.picker.enabled = true;
    }
  }

  goForward() {
    if (this.hasMoreSteps()) {
      this.setCurrentStep(this.steps[this.currentStepNum]);
    }
  }

  hasMoreSteps() {
    return this.currentStepNum < this.picker.totalSteps;
  }

  onDidAccept() {
    // set value of current step and updates the picker with next step
    this.steps[this.currentStepNum - 1].value = this.picker.value;
    this.picker.value = "";

    if (this.hasMoreSteps()) {
      this.currentStepNum += 1;
      this.setCurrentStep(this.steps[this.currentStepNum - 1]);
    } else {
      this.close();
      this.running = false;
    }
  }

  onDidTriggerButton(btn) {
    if (btn === vscode.QuickInputButtons.Back) {
      this.goBack();
    }
  }

  onDidHide() {
    this.dispose();
  }

  dispose() {
    util.disableKeyBindings();
    this.disposables.forEach((item) => {
      item.dispose();
    });
    this.picker.dispose();
  }

  close() {
    this.dispose();
    this.picker.hide();
  }
}

module.exports = MultiStepPicker;
