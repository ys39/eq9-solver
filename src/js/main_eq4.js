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
const tippingPlateXPositions = [180, 420, 660, 900, 1160];
const tippingPlateYPositions = [200, 200, 200, 200, 200];
const tippingPlateLength = 100;
const tippingPlateBodies = [];
const firstTapeBottomYPosition = 320;
const secondTapeBottomYPosition = 280;
const thirdTapeBottomYPosition = 360;
const fourthTapeBottomYPosition = 250;
const firstTapeTopYPosition = 80;
const secondTapeTopYPosition = 120;
const thirdTapeTopYPosition = 40;
const fourthTapeTopYPosition = 150;
const fixedFirstPuryXPosition = 50;
const fixedSecondPuryXPosition = 20;
const fixedThirdPuryXPosition = 80;
const fixedFourthPuryXPosition = 30;
const fixedXPosition = 1280;

// 連立方程式のパラメータ
const coef = [
  { a: 20, b: 40, c: 30, d: 10, e: -20 }, // 20x + 40y + 30z + 10w - 20 = 0
  { a: -20, b: 20, c: 50, d: 30, e: -40 }, // -20x + 20y + 40z + 30w - 40 = 0
  { a: 40, b: -30, c: -20, d: -30, e: 30 }, // 30x - 30y - 20z - 30w + 30 = 0
  { a: -40, b: -10, c: -40, d: -10, e: 50 }, // -40x - 10y - 40z - 10w + 50 = 0
];

let hoge = util.solveLinearEquations(
  [
    [20, 40, 30, 10],
    [-20, 20, 50, 30],
    [40, -30, -20, -30],
    [-40, -10, -40, -10],
  ],
  [-20, -40, 30, 50]
);
console.log(hoge);

// lusolve関数よりx, yを計算
const solution = util.solveLinearEquations(
  [
    [coef[0].a, coef[0].b, coef[0].c, coef[0].d],
    [coef[1].a, coef[1].b, coef[1].c, coef[1].d],
    [coef[2].a, coef[2].b, coef[2].c, coef[2].d],
    [coef[3].a, coef[3].b, coef[3].c, coef[3].d],
  ],
  [coef[0].e, coef[1].e, coef[2].e, coef[3].e]
);
const x = solution[0];
const y = solution[1];
const z = solution[2];
const w = solution[3];

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

    const tippingPlateAngle = { a: 0, b: 0, c: 0, d: 0, e: 0 };
    if (index === 0) {
      tippingPlateAngle.a = angle;
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.a) / x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.e) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.e) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.e) * w);
    } else if (index === 1) {
      tippingPlateAngle.b = angle;
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.b) / y);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.e) * x);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.e) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.e) * w);
    } else if (index === 2) {
      tippingPlateAngle.c = angle;
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.c) / z);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.e) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.e) * y);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.e) * w);
    } else if (index === 3) {
      tippingPlateAngle.d = angle;
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.d) / w);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.e) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.e) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.e) * z);
    } else if (index === 4) {
      tippingPlateAngle.e = angle;
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.e) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.e) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.e) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.e) * w);
    }
    tippingPlateBodies[0].setAngle(tippingPlateAngle.a);
    tippingPlateBodies[1].setAngle(tippingPlateAngle.b);
    tippingPlateBodies[2].setAngle(tippingPlateAngle.c);
    tippingPlateBodies[3].setAngle(tippingPlateAngle.d);
    tippingPlateBodies[4].setAngle(tippingPlateAngle.e);
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
  document.getElementById("tippingPlate4Angle").textContent = angles[3];
  document.getElementById("tippingPlate5Angle").textContent = angles[4];

  // 計算
  let tmpx = 0,
    tmpy = 0,
    tmpz = 0,
    tmpw = 0;
  if (angles[4] != 0) {
    tmpx = Math.sin(angles[0]) / Math.sin(angles[4]);
    tmpy = Math.sin(angles[1]) / Math.sin(angles[4]);
    tmpz = Math.sin(angles[2]) / Math.sin(angles[4]);
    tmpw = Math.sin(angles[3]) / Math.sin(angles[4]);
  }
  document.getElementById("x").textContent = tmpx;
  document.getElementById("y").textContent = tmpy;
  document.getElementById("z").textContent = tmpz;
  document.getElementById("w").textContent = tmpw;

  // 各種座標の計算結果を格納する配列
  var x00Arr = [],
    y00Arr = [],
    x01Arr = [],
    y01Arr = [],
    x02Arr = [],
    y02Arr = [],
    x03Arr = [],
    y03Arr = [],
    x04Arr = [],
    y04Arr = [];
  var x10Arr = [],
    y10Arr = [],
    x11Arr = [],
    y11Arr = [],
    x12Arr = [],
    y12Arr = [],
    x13Arr = [],
    y13Arr = [],
    x14Arr = [],
    y14Arr = [];
  var x20Arr = [],
    y20Arr = [],
    x21Arr = [],
    y21Arr = [],
    x22Arr = [],
    y22Arr = [],
    x23Arr = [],
    y23Arr = [],
    x24Arr = [],
    y24Arr = [];
  var x30Arr = [],
    y30Arr = [],
    x31Arr = [],
    y31Arr = [],
    x32Arr = [],
    y32Arr = [],
    x33Arr = [],
    y33Arr = [],
    x34Arr = [],
    y34Arr = [];

  // 読み取り線の描画
  drawer.drawDashedLine(0, tippingPlateYPositions[0], canvas.width, tippingPlateYPositions[0]);

  // ボディ（線）の描画と関連する座標の計算
  tippingPlateBodies.forEach(function (body, index) {
    var pos = body.getPosition();
    var angle = body.getAngle();

    // ティッピングプレートの描画
    context.save();
    drawer.drawTippingPlate(pos.x, pos.y, angle, tippingPlateLength);
    context.restore();

    // 各種座標の計算
    if (index === 0) {
      var x00 = pos.x + coef[0].a * Math.cos(angle);
      var y00 = pos.y + coef[0].a * Math.sin(angle);
      var x10 = pos.x + coef[1].a * Math.cos(angle);
      var y10 = pos.y + coef[1].a * Math.sin(angle);
      var x20 = pos.x + coef[2].a * Math.cos(angle);
      var y20 = pos.y + coef[2].a * Math.sin(angle);
      var x30 = pos.x + coef[3].a * Math.cos(angle);
      var y30 = pos.y + coef[3].a * Math.sin(angle);
      x00Arr.push(x00);
      y00Arr.push(y00);
      x10Arr.push(x10);
      y10Arr.push(y10);
      x20Arr.push(x20);
      y20Arr.push(y20);
      x30Arr.push(x30);
      y30Arr.push(y30);
    } else if (index === 1) {
      var x01 = pos.x + coef[0].b * Math.cos(angle);
      var y01 = pos.y + coef[0].b * Math.sin(angle);
      var x11 = pos.x + coef[1].b * Math.cos(angle);
      var y11 = pos.y + coef[1].b * Math.sin(angle);
      var x21 = pos.x + coef[2].b * Math.cos(angle);
      var y21 = pos.y + coef[2].b * Math.sin(angle);
      var x31 = pos.x + coef[3].b * Math.cos(angle);
      var y31 = pos.y + coef[3].b * Math.sin(angle);
      x01Arr.push(x01);
      y01Arr.push(y01);
      x11Arr.push(x11);
      y11Arr.push(y11);
      x21Arr.push(x21);
      y21Arr.push(y21);
      x31Arr.push(x31);
      y31Arr.push(y31);
    } else if (index === 2) {
      var x02 = pos.x + coef[0].c * Math.cos(angle);
      var y02 = pos.y + coef[0].c * Math.sin(angle);
      var x12 = pos.x + coef[1].c * Math.cos(angle);
      var y12 = pos.y + coef[1].c * Math.sin(angle);
      var x22 = pos.x + coef[2].c * Math.cos(angle);
      var y22 = pos.y + coef[2].c * Math.sin(angle);
      var x32 = pos.x + coef[3].c * Math.cos(angle);
      var y32 = pos.y + coef[3].c * Math.sin(angle);
      x02Arr.push(x02);
      y02Arr.push(y02);
      x12Arr.push(x12);
      y12Arr.push(y12);
      x22Arr.push(x22);
      y22Arr.push(y22);
      x32Arr.push(x32);
      y32Arr.push(y32);
    } else if (index === 3) {
      var x03 = pos.x + coef[0].d * Math.cos(angle);
      var y03 = pos.y + coef[0].d * Math.sin(angle);
      var x13 = pos.x + coef[1].d * Math.cos(angle);
      var y13 = pos.y + coef[1].d * Math.sin(angle);
      var x23 = pos.x + coef[2].d * Math.cos(angle);
      var y23 = pos.y + coef[2].d * Math.sin(angle);
      var x33 = pos.x + coef[3].d * Math.cos(angle);
      var y33 = pos.y + coef[3].d * Math.sin(angle);
      x03Arr.push(x03);
      y03Arr.push(y03);
      x13Arr.push(x13);
      y13Arr.push(y13);
      x23Arr.push(x23);
      y23Arr.push(y23);
      x33Arr.push(x33);
      y33Arr.push(y33);
    } else if (index === 4) {
      var x04 = pos.x + coef[0].e * Math.cos(angle);
      var y04 = pos.y + coef[0].e * Math.sin(angle);
      var x14 = pos.x + coef[1].e * Math.cos(angle);
      var y14 = pos.y + coef[1].e * Math.sin(angle);
      var x24 = pos.x + coef[2].e * Math.cos(angle);
      var y24 = pos.y + coef[2].e * Math.sin(angle);
      var x34 = pos.x + coef[3].e * Math.cos(angle);
      var y34 = pos.y + coef[3].e * Math.sin(angle);
      x04Arr.push(x04);
      y04Arr.push(y04);
      x14Arr.push(x14);
      y14Arr.push(y14);
      x24Arr.push(x24);
      y24Arr.push(y24);
      x34Arr.push(x34);
      y34Arr.push(y34);
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
  drawer.drawPuryForFirstTape(x03Arr[0] - 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x03Arr[0] + 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x04Arr[0] - 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x04Arr[0] + 12, firstTapeBottomYPosition - 6);
  drawer.drawPuryForFirstTape(x00Arr[0] - 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x00Arr[0] + 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x01Arr[0] - 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x01Arr[0] + 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x02Arr[0] - 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x02Arr[0] + 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x03Arr[0] - 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x03Arr[0] + 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x04Arr[0] - 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(x04Arr[0] + 12, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(fixedFirstPuryXPosition + 6, firstTapeTopYPosition + 6);
  drawer.drawPuryForFirstTape(fixedFirstPuryXPosition + 6, firstTapeBottomYPosition - 6);
  // 2番目のテープに対する滑車
  drawer.drawPuryForSecondTape(x10Arr[0] - 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x10Arr[0] + 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x11Arr[0] - 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x11Arr[0] + 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x12Arr[0] - 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x12Arr[0] + 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x13Arr[0] - 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x13Arr[0] + 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x14Arr[0] - 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x14Arr[0] + 12, secondTapeBottomYPosition - 6);
  drawer.drawPuryForSecondTape(x10Arr[0] - 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x10Arr[0] + 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x11Arr[0] - 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x11Arr[0] + 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x12Arr[0] - 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x12Arr[0] + 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x13Arr[0] - 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x13Arr[0] + 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x14Arr[0] - 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(x14Arr[0] + 12, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(fixedSecondPuryXPosition + 6, secondTapeTopYPosition + 6);
  drawer.drawPuryForSecondTape(fixedSecondPuryXPosition + 6, secondTapeBottomYPosition - 6);
  // 3番目のテープに対する滑車
  drawer.drawPuryForThirdTape(x20Arr[0] - 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x20Arr[0] + 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x21Arr[0] - 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x21Arr[0] + 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x22Arr[0] - 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x22Arr[0] + 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x23Arr[0] - 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x23Arr[0] + 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x24Arr[0] - 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x24Arr[0] + 12, thirdTapeBottomYPosition - 6);
  drawer.drawPuryForThirdTape(x20Arr[0] - 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x20Arr[0] + 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x21Arr[0] - 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x21Arr[0] + 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x22Arr[0] - 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x22Arr[0] + 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x23Arr[0] - 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x23Arr[0] + 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x24Arr[0] - 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(x24Arr[0] + 12, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(fixedThirdPuryXPosition + 6, thirdTapeTopYPosition + 6);
  drawer.drawPuryForThirdTape(fixedThirdPuryXPosition + 6, thirdTapeBottomYPosition - 6);
  // 4番目のテープに対する滑車
  drawer.drawPuryForFourthTape(x30Arr[0] - 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x30Arr[0] + 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x31Arr[0] - 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x31Arr[0] + 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x32Arr[0] - 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x32Arr[0] + 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x33Arr[0] - 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x33Arr[0] + 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x34Arr[0] - 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x34Arr[0] + 12, fourthTapeBottomYPosition - 6);
  drawer.drawPuryForFourthTape(x30Arr[0] - 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x30Arr[0] + 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x31Arr[0] - 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x31Arr[0] + 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x32Arr[0] - 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x32Arr[0] + 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x33Arr[0] - 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x33Arr[0] + 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x34Arr[0] - 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(x34Arr[0] + 12, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(fixedFourthPuryXPosition + 6, fourthTapeTopYPosition + 6);
  drawer.drawPuryForFourthTape(fixedFourthPuryXPosition + 6, fourthTapeBottomYPosition - 6);

  // ティッピングプレートに対する滑車
  drawer.drawPuryForTippingPlate(x00Arr[0], y00Arr[0]);
  drawer.drawPuryForTippingPlate(x01Arr[0], y01Arr[0]);
  drawer.drawPuryForTippingPlate(x02Arr[0], y02Arr[0]);
  drawer.drawPuryForTippingPlate(x03Arr[0], y03Arr[0]);
  drawer.drawPuryForTippingPlate(x04Arr[0], y04Arr[0]);
  drawer.drawPuryForTippingPlate(x10Arr[0], y10Arr[0]);
  drawer.drawPuryForTippingPlate(x11Arr[0], y11Arr[0]);
  drawer.drawPuryForTippingPlate(x12Arr[0], y12Arr[0]);
  drawer.drawPuryForTippingPlate(x13Arr[0], y13Arr[0]);
  drawer.drawPuryForTippingPlate(x14Arr[0], y14Arr[0]);
  drawer.drawPuryForTippingPlate(x20Arr[0], y20Arr[0]);
  drawer.drawPuryForTippingPlate(x21Arr[0], y21Arr[0]);
  drawer.drawPuryForTippingPlate(x22Arr[0], y22Arr[0]);
  drawer.drawPuryForTippingPlate(x23Arr[0], y23Arr[0]);
  drawer.drawPuryForTippingPlate(x24Arr[0], y24Arr[0]);
  drawer.drawPuryForTippingPlate(x30Arr[0], y30Arr[0]);
  drawer.drawPuryForTippingPlate(x31Arr[0], y31Arr[0]);
  drawer.drawPuryForTippingPlate(x32Arr[0], y32Arr[0]);
  drawer.drawPuryForTippingPlate(x33Arr[0], y33Arr[0]);
  drawer.drawPuryForTippingPlate(x34Arr[0], y34Arr[0]);

  // 最初のテープを描画
  drawer.drawLineForFirstTape(fixedXPosition, firstTapeTopYPosition, x04Arr[0] + 12, firstTapeTopYPosition);
  drawer.drawLineForFirstTape(x04Arr[0] + 6, firstTapeTopYPosition + 6, x04Arr[0] + 6, y04Arr[0]);
  drawer.drawLineForFirstTape(x04Arr[0] - 6, y04Arr[0], x04Arr[0] - 6, firstTapeTopYPosition + 6);
  drawer.drawLineForFirstTape(x04Arr[0] - 12, firstTapeTopYPosition, x03Arr[0] + 12, firstTapeTopYPosition);
  drawer.drawLineForFirstTape(x03Arr[0] + 6, firstTapeTopYPosition + 6, x03Arr[0] + 6, y03Arr[0]);
  drawer.drawLineForFirstTape(x03Arr[0] - 6, y03Arr[0], x03Arr[0] - 6, firstTapeTopYPosition + 6);
  drawer.drawLineForFirstTape(x03Arr[0] - 12, firstTapeTopYPosition, x02Arr[0] + 12, firstTapeTopYPosition);
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
  drawer.drawLineForFirstTape(x02Arr[0] + 12, firstTapeBottomYPosition, x03Arr[0] - 12, firstTapeBottomYPosition);
  drawer.drawLineForFirstTape(x03Arr[0] - 6, firstTapeBottomYPosition - 6, x03Arr[0] - 6, y03Arr[0]);
  drawer.drawLineForFirstTape(x03Arr[0] + 6, y03Arr[0], x03Arr[0] + 6, firstTapeBottomYPosition - 6);
  drawer.drawLineForFirstTape(x03Arr[0] + 12, firstTapeBottomYPosition, x04Arr[0] - 12, firstTapeBottomYPosition);
  drawer.drawLineForFirstTape(x04Arr[0] - 6, firstTapeBottomYPosition - 6, x04Arr[0] - 6, y04Arr[0]);
  drawer.drawLineForFirstTape(x04Arr[0] + 6, y04Arr[0], x04Arr[0] + 6, firstTapeBottomYPosition - 6);
  drawer.drawLineForFirstTape(x04Arr[0] + 12, firstTapeBottomYPosition, fixedXPosition, firstTapeBottomYPosition);

  // 2番目のテープを描画
  drawer.drawLineForSecondTape(fixedXPosition, secondTapeTopYPosition, x14Arr[0] + 12, secondTapeTopYPosition);
  drawer.drawLineForSecondTape(x14Arr[0] + 6, secondTapeTopYPosition + 6, x14Arr[0] + 6, y14Arr[0]);
  drawer.drawLineForSecondTape(x14Arr[0] - 6, y14Arr[0], x14Arr[0] - 6, secondTapeTopYPosition + 6);
  drawer.drawLineForSecondTape(x14Arr[0] - 12, secondTapeTopYPosition, x13Arr[0] + 12, secondTapeTopYPosition);
  drawer.drawLineForSecondTape(x13Arr[0] + 6, secondTapeTopYPosition + 6, x13Arr[0] + 6, y13Arr[0]);
  drawer.drawLineForSecondTape(x13Arr[0] - 6, y13Arr[0], x13Arr[0] - 6, secondTapeTopYPosition + 6);
  drawer.drawLineForSecondTape(x13Arr[0] - 12, secondTapeTopYPosition, x12Arr[0] + 12, secondTapeTopYPosition);
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
  drawer.drawLineForSecondTape(x12Arr[0] + 12, secondTapeBottomYPosition, x13Arr[0] - 12, secondTapeBottomYPosition);
  drawer.drawLineForSecondTape(x13Arr[0] - 6, secondTapeBottomYPosition - 6, x13Arr[0] - 6, y13Arr[0]);
  drawer.drawLineForSecondTape(x13Arr[0] + 6, y13Arr[0], x13Arr[0] + 6, secondTapeBottomYPosition - 6);
  drawer.drawLineForSecondTape(x13Arr[0] + 12, secondTapeBottomYPosition, x14Arr[0] - 12, secondTapeBottomYPosition);
  drawer.drawLineForSecondTape(x14Arr[0] - 6, secondTapeBottomYPosition - 6, x14Arr[0] - 6, y14Arr[0]);
  drawer.drawLineForSecondTape(x14Arr[0] + 6, y14Arr[0], x14Arr[0] + 6, secondTapeBottomYPosition - 6);
  drawer.drawLineForSecondTape(x14Arr[0] + 12, secondTapeBottomYPosition, fixedXPosition, secondTapeBottomYPosition);

  // 3番目のテープを描画
  drawer.drawLineForThirdTape(fixedXPosition, thirdTapeTopYPosition, x24Arr[0] + 12, thirdTapeTopYPosition);
  drawer.drawLineForThirdTape(x24Arr[0] + 6, thirdTapeTopYPosition + 6, x24Arr[0] + 6, y24Arr[0]);
  drawer.drawLineForThirdTape(x24Arr[0] - 6, y24Arr[0], x24Arr[0] - 6, thirdTapeTopYPosition + 6);
  drawer.drawLineForThirdTape(x24Arr[0] - 12, thirdTapeTopYPosition, x23Arr[0] + 12, thirdTapeTopYPosition);
  drawer.drawLineForThirdTape(x23Arr[0] + 6, thirdTapeTopYPosition + 6, x23Arr[0] + 6, y23Arr[0]);
  drawer.drawLineForThirdTape(x23Arr[0] - 6, y23Arr[0], x23Arr[0] - 6, thirdTapeTopYPosition + 6);
  drawer.drawLineForThirdTape(x23Arr[0] - 12, thirdTapeTopYPosition, x22Arr[0] + 12, thirdTapeTopYPosition);
  drawer.drawLineForThirdTape(x22Arr[0] + 6, thirdTapeTopYPosition + 6, x22Arr[0] + 6, y22Arr[0]);
  drawer.drawLineForThirdTape(x22Arr[0] - 6, y22Arr[0], x22Arr[0] - 6, thirdTapeTopYPosition + 6);
  drawer.drawLineForThirdTape(x22Arr[0] - 12, thirdTapeTopYPosition, x21Arr[0] + 12, thirdTapeTopYPosition);
  drawer.drawLineForThirdTape(x21Arr[0] + 6, thirdTapeTopYPosition + 6, x21Arr[0] + 6, y21Arr[0]);
  drawer.drawLineForThirdTape(x21Arr[0] - 6, y21Arr[0], x21Arr[0] - 6, thirdTapeTopYPosition + 6);
  drawer.drawLineForThirdTape(x21Arr[0] - 12, thirdTapeTopYPosition, x20Arr[0] + 12, thirdTapeTopYPosition);
  drawer.drawLineForThirdTape(x20Arr[0] + 6, thirdTapeTopYPosition + 6, x20Arr[0] + 6, y20Arr[0]);
  drawer.drawLineForThirdTape(x20Arr[0] - 6, y20Arr[0], x20Arr[0] - 6, thirdTapeTopYPosition + 6);
  drawer.drawLineForThirdTape(x20Arr[0] - 12, thirdTapeTopYPosition, fixedThirdPuryXPosition + 6, thirdTapeTopYPosition);
  drawer.drawLineForThirdTape(fixedThirdPuryXPosition, thirdTapeTopYPosition + 6, fixedThirdPuryXPosition, thirdTapeBottomYPosition - 6);
  drawer.drawLineForThirdTape(fixedThirdPuryXPosition + 6, thirdTapeBottomYPosition, x20Arr[0] - 12, thirdTapeBottomYPosition);
  drawer.drawLineForThirdTape(x20Arr[0] - 6, thirdTapeBottomYPosition - 6, x20Arr[0] - 6, y20Arr[0]);
  drawer.drawLineForThirdTape(x20Arr[0] + 6, y20Arr[0], x20Arr[0] + 6, thirdTapeBottomYPosition - 6);
  drawer.drawLineForThirdTape(x20Arr[0] + 12, thirdTapeBottomYPosition, x21Arr[0] - 12, thirdTapeBottomYPosition);
  drawer.drawLineForThirdTape(x21Arr[0] - 6, thirdTapeBottomYPosition - 6, x21Arr[0] - 6, y21Arr[0]);
  drawer.drawLineForThirdTape(x21Arr[0] + 6, y21Arr[0], x21Arr[0] + 6, thirdTapeBottomYPosition - 6);
  drawer.drawLineForThirdTape(x21Arr[0] + 12, thirdTapeBottomYPosition, x22Arr[0] - 12, thirdTapeBottomYPosition);
  drawer.drawLineForThirdTape(x22Arr[0] - 6, thirdTapeBottomYPosition - 6, x22Arr[0] - 6, y22Arr[0]);
  drawer.drawLineForThirdTape(x22Arr[0] + 6, y22Arr[0], x22Arr[0] + 6, thirdTapeBottomYPosition - 6);
  drawer.drawLineForThirdTape(x22Arr[0] + 12, thirdTapeBottomYPosition, x23Arr[0] - 12, thirdTapeBottomYPosition);
  drawer.drawLineForThirdTape(x23Arr[0] - 6, thirdTapeBottomYPosition - 6, x23Arr[0] - 6, y23Arr[0]);
  drawer.drawLineForThirdTape(x23Arr[0] + 6, y23Arr[0], x23Arr[0] + 6, thirdTapeBottomYPosition - 6);
  drawer.drawLineForThirdTape(x23Arr[0] + 12, thirdTapeBottomYPosition, x24Arr[0] - 12, thirdTapeBottomYPosition);
  drawer.drawLineForThirdTape(x24Arr[0] - 6, thirdTapeBottomYPosition - 6, x24Arr[0] - 6, y24Arr[0]);
  drawer.drawLineForThirdTape(x24Arr[0] + 6, y24Arr[0], x24Arr[0] + 6, thirdTapeBottomYPosition - 6);
  drawer.drawLineForThirdTape(x24Arr[0] + 12, thirdTapeBottomYPosition, fixedXPosition, thirdTapeBottomYPosition);

  // 4番目のテープを描画
  drawer.drawLineForFourthTape(fixedXPosition, fourthTapeTopYPosition, x34Arr[0] + 12, fourthTapeTopYPosition);
  drawer.drawLineForFourthTape(x34Arr[0] + 6, fourthTapeTopYPosition + 6, x34Arr[0] + 6, y34Arr[0]);
  drawer.drawLineForFourthTape(x34Arr[0] - 6, y34Arr[0], x34Arr[0] - 6, fourthTapeTopYPosition + 6);
  drawer.drawLineForFourthTape(x34Arr[0] - 12, fourthTapeTopYPosition, x33Arr[0] + 12, fourthTapeTopYPosition);
  drawer.drawLineForFourthTape(x33Arr[0] + 6, fourthTapeTopYPosition + 6, x33Arr[0] + 6, y33Arr[0]);
  drawer.drawLineForFourthTape(x33Arr[0] - 6, y33Arr[0], x33Arr[0] - 6, fourthTapeTopYPosition + 6);
  drawer.drawLineForFourthTape(x33Arr[0] - 12, fourthTapeTopYPosition, x32Arr[0] + 12, fourthTapeTopYPosition);
  drawer.drawLineForFourthTape(x32Arr[0] + 6, fourthTapeTopYPosition + 6, x32Arr[0] + 6, y32Arr[0]);
  drawer.drawLineForFourthTape(x32Arr[0] - 6, y32Arr[0], x32Arr[0] - 6, fourthTapeTopYPosition + 6);
  drawer.drawLineForFourthTape(x32Arr[0] - 12, fourthTapeTopYPosition, x31Arr[0] + 12, fourthTapeTopYPosition);
  drawer.drawLineForFourthTape(x31Arr[0] + 6, fourthTapeTopYPosition + 6, x31Arr[0] + 6, y31Arr[0]);
  drawer.drawLineForFourthTape(x31Arr[0] - 6, y31Arr[0], x31Arr[0] - 6, fourthTapeTopYPosition + 6);
  drawer.drawLineForFourthTape(x31Arr[0] - 12, fourthTapeTopYPosition, x30Arr[0] + 12, fourthTapeTopYPosition);
  drawer.drawLineForFourthTape(x30Arr[0] + 6, fourthTapeTopYPosition + 6, x30Arr[0] + 6, y30Arr[0]);
  drawer.drawLineForFourthTape(x30Arr[0] - 6, y30Arr[0], x30Arr[0] - 6, fourthTapeTopYPosition + 6);
  drawer.drawLineForFourthTape(x30Arr[0] - 12, fourthTapeTopYPosition, fixedFourthPuryXPosition + 6, fourthTapeTopYPosition);
  drawer.drawLineForFourthTape(fixedFourthPuryXPosition, fourthTapeTopYPosition + 6, fixedFourthPuryXPosition, fourthTapeBottomYPosition - 6);
  drawer.drawLineForFourthTape(fixedFourthPuryXPosition + 6, fourthTapeBottomYPosition, x30Arr[0] - 12, fourthTapeBottomYPosition);
  drawer.drawLineForFourthTape(x30Arr[0] - 6, fourthTapeBottomYPosition - 6, x30Arr[0] - 6, y30Arr[0]);
  drawer.drawLineForFourthTape(x30Arr[0] + 6, y30Arr[0], x30Arr[0] + 6, fourthTapeBottomYPosition - 6);
  drawer.drawLineForFourthTape(x30Arr[0] + 12, fourthTapeBottomYPosition, x31Arr[0] - 12, fourthTapeBottomYPosition);
  drawer.drawLineForFourthTape(x31Arr[0] - 6, fourthTapeBottomYPosition - 6, x31Arr[0] - 6, y31Arr[0]);
  drawer.drawLineForFourthTape(x31Arr[0] + 6, y31Arr[0], x31Arr[0] + 6, fourthTapeBottomYPosition - 6);
  drawer.drawLineForFourthTape(x31Arr[0] + 12, fourthTapeBottomYPosition, x32Arr[0] - 12, fourthTapeBottomYPosition);
  drawer.drawLineForFourthTape(x32Arr[0] - 6, fourthTapeBottomYPosition - 6, x32Arr[0] - 6, y32Arr[0]);
  drawer.drawLineForFourthTape(x32Arr[0] + 6, y32Arr[0], x32Arr[0] + 6, fourthTapeBottomYPosition - 6);
  drawer.drawLineForFourthTape(x32Arr[0] + 12, fourthTapeBottomYPosition, x33Arr[0] - 12, fourthTapeBottomYPosition);
  drawer.drawLineForFourthTape(x33Arr[0] - 6, fourthTapeBottomYPosition - 6, x33Arr[0] - 6, y33Arr[0]);
  drawer.drawLineForFourthTape(x33Arr[0] + 6, y33Arr[0], x33Arr[0] + 6, fourthTapeBottomYPosition - 6);
  drawer.drawLineForFourthTape(x33Arr[0] + 12, fourthTapeBottomYPosition, x34Arr[0] - 12, fourthTapeBottomYPosition);
  drawer.drawLineForFourthTape(x34Arr[0] - 6, fourthTapeBottomYPosition - 6, x34Arr[0] - 6, y34Arr[0]);
  drawer.drawLineForFourthTape(x34Arr[0] + 6, y34Arr[0], x34Arr[0] + 6, fourthTapeBottomYPosition - 6);
  drawer.drawLineForFourthTape(x34Arr[0] + 12, fourthTapeBottomYPosition, fixedXPosition, fourthTapeBottomYPosition);

  // 固定点の描画
  context.fillStyle = "#666666";
  context.fillRect(fixedXPosition - 4, firstTapeBottomYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, secondTapeBottomYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, thirdTapeBottomYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fourthTapeBottomYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, firstTapeTopYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, secondTapeTopYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, thirdTapeTopYPosition - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fourthTapeTopYPosition - 4, 8, 8);

  requestAnimationFrame(update);
}

update();