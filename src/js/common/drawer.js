export class Drawer {
  constructor(context) {
    if (!context) {
      throw new Error("context is required.");
    }
    this.context = context;
  }

  // プーリーの描画
  #drawPury(x, y, color = "#000000") {
    this.context.lineWidth = 1.2;
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.arc(x, y, 6, 0, 2 * Math.PI);
    this.context.stroke();
  }

  // カラーコードリスト
  #colorCodeList = ["#FF4B00", "#005AFF", "#03AF7A", "#4DC4FF", "#F6AA00", "#881111", "#436611", "#990099", "#84919E"];

  drawPuryForTippingPlate(x, y) {
    this.#drawPury(x, y, "#000000");
  }

  drawPuryForFirstTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[0]);
  }

  drawPuryForSecondTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[1]);
  }

  drawPuryForThirdTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[2]);
  }

  drawPuryForFourthTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[3]);
  }

  drawPuryForFifthTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[4]);
  }

  drawPuryForSixthTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[5]);
  }

  drawPuryForSeventhTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[6]);
  }

  drawPuryForEighthTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[7]);
  }

  drawPuryForNinthTape(x, y) {
    this.#drawPury(x, y, this.#colorCodeList[8]);
  }

  // テープの描画
  #drawLine(x0, y0, x1, y1, color = "#000000") {
    this.context.lineWidth = 1.5;
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.moveTo(x0, y0);
    this.context.lineTo(x1, y1);
    this.context.stroke();
  }

  drawLineForFirstTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[0]);
  }

  drawLineForSecondTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[1]);
  }

  drawLineForThirdTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[2]);
  }

  drawLineForFourthTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[3]);
  }

  drawLineForFifthTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[4]);
  }

  drawLineForSixthTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[5]);
  }

  drawLineForSeventhTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[6]);
  }

  drawLineForEighthTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[7]);
  }

  drawLineForNinthTape(x0, y0, x1, y1) {
    this.#drawLine(x0, y0, x1, y1, this.#colorCodeList[8]);
  }

  // 点線の描画
  drawDashedLine(x0, y0, x1, y1, color = "#000000") {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.setLineDash([5, 5]);
    this.context.moveTo(x0, y0);
    this.context.lineTo(x1, y1);
    this.context.stroke();
    this.context.setLineDash([]);
  }

  // ティッピングプレートの描画
  drawTippingPlate(x, y, angle, length) {
    // プレートの描画
    this.context.lineWidth = 3;
    this.context.strokeStyle = "#666666";
    this.context.translate(x, y);
    this.context.rotate(angle);
    this.context.beginPath();
    this.context.moveTo(-length, 0);
    this.context.lineTo(length, 0);
    this.context.stroke();

    // プレートの軸の描画
    this.context.beginPath();
    this.context.arc(0, 0, 5, 0, 2 * Math.PI);
    this.context.fillStyle = "#666666";
    this.context.fill();
  }
}
