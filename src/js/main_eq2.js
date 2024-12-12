import planck from "planck";
import { Drawer } from "./common/drawer.js";
import { Utils } from "./common/util.js";

// 初期設定
const pl = planck;
const Vec2 = pl.Vec2;
const world = new pl.World(Vec2(0, 0));
const canvas = document.getElementById("eqsolver");
const context = canvas.getContext("2d");
const drawer = new Drawer(context);
const util = new Utils();

// 位置や角度のパラメータ
const tippingPlateXPositions = [180, 420, 660];
const tippingPlateYPositions = [200, 200, 200];
const tippingPlateLength = 100;
const tippingPlateBodies = [];
const firstTapeBottomYPosition = 320;
const secondTapeBottomYPosition = 280;
const firstTapeTopYPosition = 80;
const secondTapeTopYPosition = 120;
const fixedFirstPuryXPosition = 50;
const fixedSecondPuryXPosition = 20;
const fixedXPosition = 780;

// 連立方程式のパラメータ
const coef = [
  { a: 60, b: 40, c: -20 }, // 60x + 40y -20 = 0
  { a: -20, b: 20, c: -60 }, // -20x + 20y -60 = 0
];

// lusolve関数よりx, yを計算
const solution = util.solveLinearEquations(
  [
    [coef[0].a, coef[0].b],
    [coef[1].a, coef[1].b],
  ],
  [coef[0].c, coef[1].c]
);
const x = solution[0];
const y = solution[1];

// プーリーを結ぶ線の作成
tippingPlateXPositions.forEach(function (xPos, index) {
  var body = world.createBody({
    type: "dynamic",
    position: Vec2(xPos, tippingPlateYPositions[index]),
    angle: 0,
  });
  tippingPlateBodies.push(body);
});

// マウスをクリックした際に、クリック位置に最も近いボディを探す
canvas.addEventListener("mousedown", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  let closestBody = null;
  let minDistance = Infinity;
  tippingPlateBodies.forEach(function (body) {
    const pos = body.getPosition();
    const distance = Math.hypot(pos.x - mouseX, pos.y - mouseY);
    if (distance < minDistance) {
      minDistance = distance;
      closestBody = body;
    }
  });

  if (closestBody) {
    // 角度を計算して設定
    const angle = Math.atan2(mouseY - closestBody.getPosition().y, mouseX - closestBody.getPosition().x);
    const index = tippingPlateBodies.indexOf(closestBody);

    const tippingPlateAngle = { a: 0, b: 0, c: 0 };
    if (index === 0) {
      tippingPlateAngle.a = angle;
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.a) / x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.c) * y);
    } else if (index === 1) {
      tippingPlateAngle.b = angle;
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.b) / y);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.c) * x);
    } else if (index === 2) {
      tippingPlateAngle.c = angle;
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.c) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.c) * y);
    }
    tippingPlateBodies[0].setAngle(tippingPlateAngle.a);
    tippingPlateBodies[1].setAngle(tippingPlateAngle.b);
    tippingPlateBodies[2].setAngle(tippingPlateAngle.c);
  }
});

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#000000";
  context.lineWidth = 1;

  // 角度の配列
  const angles = tippingPlateBodies.map(function (body) {
    return body.getAngle();
  });
  document.getElementById("tippingPlate1Angle").textContent = angles[0];
  document.getElementById("tippingPlate2Angle").textContent = angles[1];
  document.getElementById("tippingPlate3Angle").textContent = angles[2];

  // 計算
  let tmpx, tmpy;
  if (angles[2] == 0) {
    tmpx = 0;
    tmpy = 0;
  } else {
    tmpx = Math.sin(angles[0]) / Math.sin(angles[2]);
    tmpy = Math.sin(angles[1]) / Math.sin(angles[2]);
  }
  document.getElementById("x").textContent = tmpx;
  document.getElementById("y").textContent = tmpy;

  // 各種座標の計算結果を格納する配列
  var x00Arr = [],
    y00Arr = [],
    x01Arr = [],
    y01Arr = [],
    x02Arr = [],
    y02Arr = [];
  var x10Arr = [],
    y10Arr = [],
    x11Arr = [],
    y11Arr = [],
    x12Arr = [],
    y12Arr = [];

  // 読み取り線の描画
  drawer.drawDashedLine(0, tippingPlateYPositions[0], canvas.width, tippingPlateYPositions[0]);

  // ボディ（線）の描画と関連する座標の計算
  tippingPlateBodies.forEach(function (body, index) {
    var pos = body.getPosition();
    var angle = body.getAngle();

    context.save();
    context.lineWidth = 3;
    context.strokeStyle = "#666666";
    context.translate(pos.x, pos.y);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(-tippingPlateLength, 0);
    context.lineTo(tippingPlateLength, 0);
    context.stroke();

    // 棒の中心に円を描画
    context.beginPath();
    context.arc(0, 0, 5, 0, 2 * Math.PI);
    context.fillStyle = "#666666";
    context.fill();

    context.restore();

    // 各種座標の計算
    if (index === 0) {
      var x00 = pos.x + coef[0].a * Math.cos(angle);
      var y00 = pos.y + coef[0].a * Math.sin(angle);
      var x10 = pos.x + coef[1].a * Math.cos(angle);
      var y10 = pos.y + coef[1].a * Math.sin(angle);
      x00Arr.push(x00);
      y00Arr.push(y00);
      x10Arr.push(x10);
      y10Arr.push(y10);
    } else if (index === 1) {
      var x01 = pos.x + coef[0].b * Math.cos(angle);
      var y01 = pos.y + coef[0].b * Math.sin(angle);
      var x11 = pos.x + coef[1].b * Math.cos(angle);
      var y11 = pos.y + coef[1].b * Math.sin(angle);
      x01Arr.push(x01);
      y01Arr.push(y01);
      x11Arr.push(x11);
      y11Arr.push(y11);
    } else if (index === 2) {
      var x02 = pos.x + coef[0].c * Math.cos(angle);
      var y02 = pos.y + coef[0].c * Math.sin(angle);
      var x12 = pos.x + coef[1].c * Math.cos(angle);
      var y12 = pos.y + coef[1].c * Math.sin(angle);
      x02Arr.push(x02);
      y02Arr.push(y02);
      x12Arr.push(x12);
      y12Arr.push(y12);
    }
  });

  // 滑車の描画
  // 最初のテープに対する滑車
  drawer.drawPuryForFirstTape(x00Arr[0] - 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x00Arr[0] + 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x01Arr[0] - 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x01Arr[0] + 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x02Arr[0] - 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x02Arr[0] + 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x00Arr[0] - 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x00Arr[0] + 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x01Arr[0] - 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x01Arr[0] + 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x02Arr[0] - 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x02Arr[0] + 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(fixedFirstPuryXPosition + 6, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(fixedFirstPuryXPosition + 6, firstTapeBottomYPosition - 6);
  // 2番目のテープに対する滑車
  drawer.drawPuryForSecondTape(x10Arr[0] - 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x10Arr[0] + 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x11Arr[0] - 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x11Arr[0] + 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x12Arr[0] - 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x12Arr[0] + 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x10Arr[0] - 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x10Arr[0] + 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x11Arr[0] - 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x11Arr[0] + 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x12Arr[0] - 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x12Arr[0] + 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(fixedSecondPuryXPosition + 6, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(fixedSecondPuryXPosition + 6, secondTapeBottomYPosition - 6);
  // ティッピングプレートに対する滑車
  drawer.drawPuryForTippingPlate(x00Arr[0], y00Arr[0]);
  drawer.drawPuryForTippingPlate(x01Arr[0], y01Arr[0]);
  drawer.drawPuryForTippingPlate(x02Arr[0], y02Arr[0]);
  drawer.drawPuryForTippingPlate(x10Arr[0], y10Arr[0]);
  drawer.drawPuryForTippingPlate(x11Arr[0], y11Arr[0]);
  drawer.drawPuryForTippingPlate(x12Arr[0], y12Arr[0]);

  // 最初のテープを描画
  drawer.drawLineForFirstTape(fixedXPosition, firstTapeTopYPosition, x02Arr[0] + 12, firstTapeTopYPosition);
  drawer.drawLineForFirstTape(x02Arr[0] + 6, firstTapeTopYPosition + 6, x02Arr[0] + 6, y02Arr[0]);
  drawer.drawLineForFirstTape(x02Arr[0] - 6, y02Arr[0], x02Arr[0] - 6, firstTapeTopYPosition + 6);
  drawer.drawLineForFirstTape(x02Arr[0] - 12, firstTapeTopYPosition, x01Arr[0] + 12, firstTapeTopYPosition);
  drawer.drawLineForFirstTape(x01Arr[0] + 6, firstTapeTopYPosition + 6, x01Arr[0] + 6, y01Arr[0]);
  drawer.drawLineForFirstTape(x01Arr[0] - 6, y01Arr[0], x01Arr[0] - 6, firstTapeTopYPosition + 6);
  drawer.drawLineForFirstTape(x01Arr[0] - 12, firstTapeTopYPosition, x00Arr[0] + 12, firstTapeTopYPosition);
  drawer.drawLineForFirstTape(x00Arr[0] + 6, firstTapeTopYPosition + 6, x00Arr[0] + 6, y00Arr[0]);
  drawer.drawLineForFirstTape(x00Arr[0] - 6, y00Arr[0], x00Arr[0] - 6, firstTapeTopYPosition + 6);
  drawer.drawLineForFirstTape(x00Arr[0] - 12, firstTapeTopYPosition, fixedFirstPuryXPosition + 6, firstTapeTopYPosition);
  drawer.drawLineForFirstTape(fixedFirstPuryXPosition, firstTapeTopYPosition + 6, fixedFirstPuryXPosition, firstTapeBottomYPosition - 6);
  drawer.drawLineForFirstTape(fixedFirstPuryXPosition + 6, firstTapeBottomYPosition, x00Arr[0] - 12, firstTapeBottomYPosition);
  drawer.drawLineForFirstTape(x00Arr[0] - 6, firstTapeBottomYPosition - 6, x00Arr[0] - 6, y00Arr[0]);
  drawer.drawLineForFirstTape(x00Arr[0] + 6, y00Arr[0], x00Arr[0] + 6, firstTapeBottomYPosition - 6);
  drawer.drawLineForFirstTape(x00Arr[0] + 12, firstTapeBottomYPosition, x01Arr[0] - 12, firstTapeBottomYPosition);
  drawer.drawLineForFirstTape(x01Arr[0] - 6, firstTapeBottomYPosition - 6, x01Arr[0] - 6, y01Arr[0]);
  drawer.drawLineForFirstTape(x01Arr[0] + 6, y01Arr[0], x01Arr[0] + 6, firstTapeBottomYPosition - 6);
  drawer.drawLineForFirstTape(x01Arr[0] + 12, firstTapeBottomYPosition, x02Arr[0] - 12, firstTapeBottomYPosition);
  drawer.drawLineForFirstTape(x02Arr[0] - 6, firstTapeBottomYPosition - 6, x02Arr[0] - 6, y02Arr[0]);
  drawer.drawLineForFirstTape(x02Arr[0] + 6, y02Arr[0], x02Arr[0] + 6, firstTapeBottomYPosition - 6);
  drawer.drawLineForFirstTape(x02Arr[0] + 12, firstTapeBottomYPosition, fixedXPosition, firstTapeBottomYPosition);

  // 2番目のテープを描画
  drawer.drawLineForSecondTape(fixedXPosition, secondTapeTopYPosition, x12Arr[0] + 12, secondTapeTopYPosition);
  drawer.drawLineForSecondTape(x12Arr[0] + 6, secondTapeTopYPosition + 6, x12Arr[0] + 6, y12Arr[0]);
  drawer.drawLineForSecondTape(x12Arr[0] - 6, y12Arr[0], x12Arr[0] - 6, secondTapeTopYPosition + 6);
  drawer.drawLineForSecondTape(x12Arr[0] - 12, secondTapeTopYPosition, x11Arr[0] + 12, secondTapeTopYPosition);
  drawer.drawLineForSecondTape(x11Arr[0] + 6, secondTapeTopYPosition + 6, x11Arr[0] + 6, y11Arr[0]);
  drawer.drawLineForSecondTape(x11Arr[0] - 6, y11Arr[0], x11Arr[0] - 6, secondTapeTopYPosition + 6);
  drawer.drawLineForSecondTape(x11Arr[0] - 12, secondTapeTopYPosition, x10Arr[0] + 12, secondTapeTopYPosition);
  drawer.drawLineForSecondTape(x10Arr[0] + 6, secondTapeTopYPosition + 6, x10Arr[0] + 6, y10Arr[0]);
  drawer.drawLineForSecondTape(x10Arr[0] - 6, y10Arr[0], x10Arr[0] - 6, secondTapeTopYPosition + 6);
  drawer.drawLineForSecondTape(x10Arr[0] - 12, secondTapeTopYPosition, fixedSecondPuryXPosition + 6, secondTapeTopYPosition);
  drawer.drawLineForSecondTape(fixedSecondPuryXPosition, secondTapeTopYPosition + 6, fixedSecondPuryXPosition, secondTapeBottomYPosition - 6);
  drawer.drawLineForSecondTape(fixedSecondPuryXPosition + 6, secondTapeBottomYPosition, x10Arr[0] - 12, secondTapeBottomYPosition);
  drawer.drawLineForSecondTape(x10Arr[0] - 6, secondTapeBottomYPosition - 6, x10Arr[0] - 6, y10Arr[0]);
  drawer.drawLineForSecondTape(x10Arr[0] + 6, y10Arr[0], x10Arr[0] + 6, secondTapeBottomYPosition - 6);
  drawer.drawLineForSecondTape(x10Arr[0] + 12, secondTapeBottomYPosition, x11Arr[0] - 12, secondTapeBottomYPosition);
  drawer.drawLineForSecondTape(x11Arr[0] - 6, secondTapeBottomYPosition - 6, x11Arr[0] - 6, y11Arr[0]);
  drawer.drawLineForSecondTape(x11Arr[0] + 6, y11Arr[0], x11Arr[0] + 6, secondTapeBottomYPosition - 6);
  drawer.drawLineForSecondTape(x11Arr[0] + 12, secondTapeBottomYPosition, x12Arr[0] - 12, secondTapeBottomYPosition);
  drawer.drawLineForSecondTape(x12Arr[0] - 6, secondTapeBottomYPosition - 6, x12Arr[0] - 6, y12Arr[0]);
  drawer.drawLineForSecondTape(x12Arr[0] + 6, y12Arr[0], x12Arr[0] + 6, secondTapeBottomYPosition - 6);
  drawer.drawLineForSecondTape(x12Arr[0] + 12, secondTapeBottomYPosition, fixedXPosition, secondTapeBottomYPosition);

  // 固定点の描画
  context.fillStyle = "#666666";
  context.fillRect(fixedXPosition - 4, firstTapeBottomYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, secondTapeBottomYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, firstTapeTopYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, secondTapeTopYPosition - 4, 8, 8);

  requestAnimationFrame(update);
}

update();
