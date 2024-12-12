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
const topTippingPlateXPositions = [280, 800, 1320, 1840, 2360];
const bottomTippingPlateXPositions = [2360, 1840, 1320, 800, 280];
const topTippingPlateYPositions = [240, 240, 240, 240, 240];
const bottomTippingPlateYPositions = [720, 720, 720, 720, 720];
const tippingPlateLength = 230;
const tippingPlateBodies = [];
const TapeBottomYPos = {
  first: 340,
  second: 320,
  third: 360,
  fourth: 300,
  fifth: 380,
};
const TapeTopYPos = {
  first: 140,
  second: 160,
  third: 120,
  fourth: 180,
  fifth: 100,
};
const fixedPuryXPos = {
  first: 10,
  second: 10,
  third: 10,
  fourth: 10,
  fifth: 10,
  sixth: 10,
  seventh: 10,
  eighth: 10,
  ninth: 10,
};

const fixedTapeBottomYPos = {
  first: 340,
  second: 320,
  third: 360,
  fourth: 300,
  fifth: 380,
  sixth: 400,
  seventh: 420,
  eighth: 440,
  ninth: 460,
};
const fixedTapeTopYPos = {
  first: 140,
  second: 160,
  third: 120,
  fourth: 180,
  fifth: 100,
  sixth: 80,
  seventh: 60,
  eighth: 40,
  ninth: 20,
};

const turnBackPointYPos = 480;
const turnBackAdjustment = {
  first: 110,
  second: 120,
  third: 100,
  fourth: 130,
  fifth: 90,
  sixth: 100,
  seventh: 110,
  eighth: 120,
  ninth: 130,
};

const turnBackAdjustment2 = {
  first: 220,
  second: 210,
  third: 230,
  fourth: 200,
  fifth: 240,
  sixth: 200,
  seventh: 210,
  eighth: 220,
  ninth: 230,
};

const fixedXPosition = 2650;
const turnBackFixedXPosition = 10;

// 連立方程式のパラメータ
const coef = [
  { a: 70, b: 80, c: 30, d: 10, e: -20, f: 90 }, // 70x + 80y + 30z + 10w - 20u + 90 = 0
  { a: -20, b: 20, c: 90, d: 30, e: -40, f: 20 }, // -20x + 20y + 90z + 30w - 40u + 20 = 0
  { a: 40, b: -30, c: -20, d: -30, e: 30, f: -30 }, // 40x - 30y - 20z - 30w + 30u - 30 = 0
  { a: -40, b: -100, c: -40, d: -70, e: 70, f: 50 }, // -40x - 100y - 40z - 70w + 70u + 50 = 0
  { a: -100, b: 50, c: 50, d: 50, e: 10, f: -10 }, // -100x + 50y + 50z + 50w + 10u - 10 = 0
];

let hoge = util.solveLinearEquations(
  [
    [70, 80, 30, 10, -20],
    [-20, 20, 90, 30, -40],
    [40, -30, -20, -30, 30],
    [-40, -100, -40, -70, 70],
    [-100, 50, 50, 50, 10],
  ],
  [90, 20, -30, 50, -10]
);
console.log(hoge);

// lusolve関数よりx, yを計算
const solution = util.solveLinearEquations(
  [
    [coef[0].a, coef[0].b, coef[0].c, coef[0].d, coef[0].e],
    [coef[1].a, coef[1].b, coef[1].c, coef[1].d, coef[1].e],
    [coef[2].a, coef[2].b, coef[2].c, coef[2].d, coef[2].e],
    [coef[3].a, coef[3].b, coef[3].c, coef[3].d, coef[3].e],
    [coef[4].a, coef[4].b, coef[4].c, coef[4].d, coef[4].e],
  ],
  [coef[0].f, coef[1].f, coef[2].f, coef[3].f, coef[4].f]
);
// x, y, z, w, u, v, t, s, r
const x = solution[0];
const y = solution[1];
const z = solution[2];
const w = solution[3];
const u = solution[4];

// プーリーを結ぶ線の作成
topTippingPlateXPositions.forEach(function (xPos, index) {
  var body = world.createBody({
    type: "dynamic",
    position: Vec2(xPos, topTippingPlateYPositions[index]),
    angle: 0,
  });
  tippingPlateBodies.push(body);
});
bottomTippingPlateXPositions.forEach(function (xPos, index) {
  var body = world.createBody({
    type: "dynamic",
    position: Vec2(xPos, bottomTippingPlateYPositions[index]),
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

    const tippingPlateAngle = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
    if (index === 0) {
      tippingPlateAngle.a = angle;
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.a) / x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.f) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.f) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.f) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.f) * u);
    } else if (index === 1) {
      tippingPlateAngle.b = angle;
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.b) / y);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.f) * x);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.f) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.f) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.f) * u);
    } else if (index === 2) {
      tippingPlateAngle.c = angle;
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.c) / z);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.f) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.f) * y);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.f) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.f) * u);
    } else if (index === 3) {
      tippingPlateAngle.d = angle;
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.d) / w);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.f) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.f) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.f) * z);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.f) * u);
    } else if (index === 4) {
      tippingPlateAngle.e = angle;
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.e) / u);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.f) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.f) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.f) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.f) * w);
    } else if (index === 5) {
      tippingPlateAngle.f = angle;
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.f) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.f) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.f) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.f) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.f) * u);
    }
    tippingPlateBodies[0].setAngle(tippingPlateAngle.a);
    tippingPlateBodies[1].setAngle(tippingPlateAngle.b);
    tippingPlateBodies[2].setAngle(tippingPlateAngle.c);
    tippingPlateBodies[3].setAngle(tippingPlateAngle.d);
    tippingPlateBodies[4].setAngle(tippingPlateAngle.e);
    tippingPlateBodies[5].setAngle(tippingPlateAngle.f);
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
  document.getElementById("tippingPlate1AngleRad").textContent = angles[0];
  document.getElementById("tippingPlate2AngleRad").textContent = angles[1];
  document.getElementById("tippingPlate3AngleRad").textContent = angles[2];
  document.getElementById("tippingPlate4AngleRad").textContent = angles[3];
  document.getElementById("tippingPlate5AngleRad").textContent = angles[4];
  document.getElementById("tippingPlate6AngleRad").textContent = angles[5];
  document.getElementById("tippingPlate1AngleDeg").textContent = util.radToDeg(angles[0]);
  document.getElementById("tippingPlate2AngleDeg").textContent = util.radToDeg(angles[1]);
  document.getElementById("tippingPlate3AngleDeg").textContent = util.radToDeg(angles[2]);
  document.getElementById("tippingPlate4AngleDeg").textContent = util.radToDeg(angles[3]);
  document.getElementById("tippingPlate5AngleDeg").textContent = util.radToDeg(angles[4]);
  document.getElementById("tippingPlate6AngleDeg").textContent = util.radToDeg(angles[5]);

  // 計算
  let tmpx = 0,
    tmpy = 0,
    tmpz = 0,
    tmpw = 0,
    tmpu = 0;
  if (angles[5] != 0) {
    tmpx = Math.sin(angles[0]) / Math.sin(angles[5]);
    tmpy = Math.sin(angles[1]) / Math.sin(angles[5]);
    tmpz = Math.sin(angles[2]) / Math.sin(angles[5]);
    tmpw = Math.sin(angles[3]) / Math.sin(angles[5]);
    tmpu = Math.sin(angles[4]) / Math.sin(angles[5]);
  }
  document.getElementById("x").textContent = tmpx;
  document.getElementById("y").textContent = tmpy;
  document.getElementById("z").textContent = tmpz;
  document.getElementById("w").textContent = tmpw;
  document.getElementById("u").textContent = tmpu;

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
    y04Arr = [],
    x05Arr = [],
    y05Arr = [];
  var x10Arr = [],
    y10Arr = [],
    x11Arr = [],
    y11Arr = [],
    x12Arr = [],
    y12Arr = [],
    x13Arr = [],
    y13Arr = [],
    x14Arr = [],
    y14Arr = [],
    x15Arr = [],
    y15Arr = [];
  var x20Arr = [],
    y20Arr = [],
    x21Arr = [],
    y21Arr = [],
    x22Arr = [],
    y22Arr = [],
    x23Arr = [],
    y23Arr = [],
    x24Arr = [],
    y24Arr = [],
    x25Arr = [],
    y25Arr = [];
  var x30Arr = [],
    y30Arr = [],
    x31Arr = [],
    y31Arr = [],
    x32Arr = [],
    y32Arr = [],
    x33Arr = [],
    y33Arr = [],
    x34Arr = [],
    y34Arr = [],
    x35Arr = [],
    y35Arr = [];
  var x40Arr = [],
    y40Arr = [],
    x41Arr = [],
    y41Arr = [],
    x42Arr = [],
    y42Arr = [],
    x43Arr = [],
    y43Arr = [],
    x44Arr = [],
    y44Arr = [],
    x45Arr = [],
    y45Arr = [];

  // 読み取り線の描画
  drawer.drawDashedLine(0, topTippingPlateYPositions[0], canvas.width, topTippingPlateYPositions[0]);
  drawer.drawDashedLine(0, bottomTippingPlateYPositions[0], canvas.width, bottomTippingPlateYPositions[0]);

  // 折り返し線の描画
  drawer.drawDashedLine(0, turnBackPointYPos, canvas.width, turnBackPointYPos, "#888888");

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
      var x40 = pos.x + coef[4].a * Math.cos(angle);
      var y40 = pos.y + coef[4].a * Math.sin(angle);
      x00Arr.push(x00);
      y00Arr.push(y00);
      x10Arr.push(x10);
      y10Arr.push(y10);
      x20Arr.push(x20);
      y20Arr.push(y20);
      x30Arr.push(x30);
      y30Arr.push(y30);
      x40Arr.push(x40);
      y40Arr.push(y40);
    } else if (index === 1) {
      var x01 = pos.x + coef[0].b * Math.cos(angle);
      var y01 = pos.y + coef[0].b * Math.sin(angle);
      var x11 = pos.x + coef[1].b * Math.cos(angle);
      var y11 = pos.y + coef[1].b * Math.sin(angle);
      var x21 = pos.x + coef[2].b * Math.cos(angle);
      var y21 = pos.y + coef[2].b * Math.sin(angle);
      var x31 = pos.x + coef[3].b * Math.cos(angle);
      var y31 = pos.y + coef[3].b * Math.sin(angle);
      var x41 = pos.x + coef[4].b * Math.cos(angle);
      var y41 = pos.y + coef[4].b * Math.sin(angle);
      x01Arr.push(x01);
      y01Arr.push(y01);
      x11Arr.push(x11);
      y11Arr.push(y11);
      x21Arr.push(x21);
      y21Arr.push(y21);
      x31Arr.push(x31);
      y31Arr.push(y31);
      x41Arr.push(x41);
      y41Arr.push(y41);
    } else if (index === 2) {
      var x02 = pos.x + coef[0].c * Math.cos(angle);
      var y02 = pos.y + coef[0].c * Math.sin(angle);
      var x12 = pos.x + coef[1].c * Math.cos(angle);
      var y12 = pos.y + coef[1].c * Math.sin(angle);
      var x22 = pos.x + coef[2].c * Math.cos(angle);
      var y22 = pos.y + coef[2].c * Math.sin(angle);
      var x32 = pos.x + coef[3].c * Math.cos(angle);
      var y32 = pos.y + coef[3].c * Math.sin(angle);
      var x42 = pos.x + coef[4].c * Math.cos(angle);
      var y42 = pos.y + coef[4].c * Math.sin(angle);
      x02Arr.push(x02);
      y02Arr.push(y02);
      x12Arr.push(x12);
      y12Arr.push(y12);
      x22Arr.push(x22);
      y22Arr.push(y22);
      x32Arr.push(x32);
      y32Arr.push(y32);
      x42Arr.push(x42);
      y42Arr.push(y42);
    } else if (index === 3) {
      var x03 = pos.x + coef[0].d * Math.cos(angle);
      var y03 = pos.y + coef[0].d * Math.sin(angle);
      var x13 = pos.x + coef[1].d * Math.cos(angle);
      var y13 = pos.y + coef[1].d * Math.sin(angle);
      var x23 = pos.x + coef[2].d * Math.cos(angle);
      var y23 = pos.y + coef[2].d * Math.sin(angle);
      var x33 = pos.x + coef[3].d * Math.cos(angle);
      var y33 = pos.y + coef[3].d * Math.sin(angle);
      var x43 = pos.x + coef[4].d * Math.cos(angle);
      var y43 = pos.y + coef[4].d * Math.sin(angle);
      x03Arr.push(x03);
      y03Arr.push(y03);
      x13Arr.push(x13);
      y13Arr.push(y13);
      x23Arr.push(x23);
      y23Arr.push(y23);
      x33Arr.push(x33);
      y33Arr.push(y33);
      x43Arr.push(x43);
      y43Arr.push(y43);
    } else if (index === 4) {
      var x04 = pos.x + coef[0].e * Math.cos(angle);
      var y04 = pos.y + coef[0].e * Math.sin(angle);
      var x14 = pos.x + coef[1].e * Math.cos(angle);
      var y14 = pos.y + coef[1].e * Math.sin(angle);
      var x24 = pos.x + coef[2].e * Math.cos(angle);
      var y24 = pos.y + coef[2].e * Math.sin(angle);
      var x34 = pos.x + coef[3].e * Math.cos(angle);
      var y34 = pos.y + coef[3].e * Math.sin(angle);
      var x44 = pos.x + coef[4].e * Math.cos(angle);
      var y44 = pos.y + coef[4].e * Math.sin(angle);
      x04Arr.push(x04);
      y04Arr.push(y04);
      x14Arr.push(x14);
      y14Arr.push(y14);
      x24Arr.push(x24);
      y24Arr.push(y24);
      x34Arr.push(x34);
      y34Arr.push(y34);
      x44Arr.push(x44);
      y44Arr.push(y44);
    } else if (index === 5) {
      var x05 = pos.x + coef[0].f * Math.cos(angle);
      var y05 = pos.y + coef[0].f * Math.sin(angle);
      var x15 = pos.x + coef[1].f * Math.cos(angle);
      var y15 = pos.y + coef[1].f * Math.sin(angle);
      var x25 = pos.x + coef[2].f * Math.cos(angle);
      var y25 = pos.y + coef[2].f * Math.sin(angle);
      var x35 = pos.x + coef[3].f * Math.cos(angle);
      var y35 = pos.y + coef[3].f * Math.sin(angle);
      var x45 = pos.x + coef[4].f * Math.cos(angle);
      var y45 = pos.y + coef[4].f * Math.sin(angle);
      x05Arr.push(x05);
      y05Arr.push(y05);
      x15Arr.push(x15);
      y15Arr.push(y15);
      x25Arr.push(x25);
      y25Arr.push(y25);
      x35Arr.push(x35);
      y35Arr.push(y35);
      x45Arr.push(x45);
      y45Arr.push(y45);
    }
  });

  // 滑車の描画
  // 最初のテープに対する滑車
  drawer.drawPuryForFirstTape(x00Arr[0] - 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x00Arr[0] + 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x01Arr[0] - 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x01Arr[0] + 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x02Arr[0] - 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x02Arr[0] + 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x03Arr[0] - 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x03Arr[0] + 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x04Arr[0] - 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x04Arr[0] + 12, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(x05Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x05Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x00Arr[0] - 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x00Arr[0] + 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x01Arr[0] - 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x01Arr[0] + 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x02Arr[0] - 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x02Arr[0] + 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x03Arr[0] - 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x03Arr[0] + 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x04Arr[0] - 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x04Arr[0] + 12, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(x05Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(x05Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(fixedPuryXPos["first"] + 6, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(fixedPuryXPos["first"] + 6, TapeBottomYPos["first"] - 6);
  drawer.drawPuryForFirstTape(fixedPuryXPos["first"] + 6, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(fixedPuryXPos["first"] + 6, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  // 2番目のテープに対する滑車
  drawer.drawPuryForSecondTape(x10Arr[0] - 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x10Arr[0] + 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x11Arr[0] - 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x11Arr[0] + 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x12Arr[0] - 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x12Arr[0] + 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x13Arr[0] - 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x13Arr[0] + 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x14Arr[0] - 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x14Arr[0] + 12, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(x15Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x15Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x10Arr[0] - 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x10Arr[0] + 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x11Arr[0] - 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x11Arr[0] + 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x12Arr[0] - 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x12Arr[0] + 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x13Arr[0] - 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x13Arr[0] + 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x14Arr[0] - 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x14Arr[0] + 12, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(x15Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(x15Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(fixedPuryXPos["second"] + 6, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(fixedPuryXPos["second"] + 6, TapeBottomYPos["second"] - 6);
  drawer.drawPuryForSecondTape(fixedPuryXPos["second"] + 6, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(fixedPuryXPos["second"] + 6, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  // 3番目のテープに対する滑車
  drawer.drawPuryForThirdTape(x20Arr[0] - 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x20Arr[0] + 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x21Arr[0] - 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x21Arr[0] + 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x22Arr[0] - 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x22Arr[0] + 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x23Arr[0] - 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x23Arr[0] + 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x24Arr[0] - 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x24Arr[0] + 12, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(x25Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x25Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x20Arr[0] - 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x20Arr[0] + 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x21Arr[0] - 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x21Arr[0] + 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x22Arr[0] - 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x22Arr[0] + 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x23Arr[0] - 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x23Arr[0] + 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x24Arr[0] - 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x24Arr[0] + 12, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(x25Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(x25Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(fixedPuryXPos["third"] + 6, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(fixedPuryXPos["third"] + 6, TapeBottomYPos["third"] - 6);
  drawer.drawPuryForThirdTape(fixedPuryXPos["third"] + 6, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(fixedPuryXPos["third"] + 6, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  // 4番目のテープに対する滑車
  drawer.drawPuryForFourthTape(x30Arr[0] - 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x30Arr[0] + 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x31Arr[0] - 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x31Arr[0] + 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x32Arr[0] - 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x32Arr[0] + 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x33Arr[0] - 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x33Arr[0] + 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x34Arr[0] - 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x34Arr[0] + 12, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(x35Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x35Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x30Arr[0] - 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x30Arr[0] + 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x31Arr[0] - 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x31Arr[0] + 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x32Arr[0] - 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x32Arr[0] + 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x33Arr[0] - 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x33Arr[0] + 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x34Arr[0] - 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x34Arr[0] + 12, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(x35Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(x35Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(fixedPuryXPos["fourth"] + 6, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(fixedPuryXPos["fourth"] + 6, TapeBottomYPos["fourth"] - 6);
  drawer.drawPuryForFourthTape(fixedPuryXPos["fourth"] + 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(fixedPuryXPos["fourth"] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);

  // 5番目のテープに対する滑車
  drawer.drawPuryForFifthTape(x40Arr[0] - 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x40Arr[0] + 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x41Arr[0] - 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x41Arr[0] + 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x42Arr[0] - 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x42Arr[0] + 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x43Arr[0] - 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x43Arr[0] + 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x44Arr[0] - 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x44Arr[0] + 12, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(x45Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x45Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x40Arr[0] - 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x40Arr[0] + 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x41Arr[0] - 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x41Arr[0] + 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x42Arr[0] - 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x42Arr[0] + 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x43Arr[0] - 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x43Arr[0] + 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x44Arr[0] - 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x44Arr[0] + 12, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(x45Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(x45Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(fixedPuryXPos["fifth"] + 6, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(fixedPuryXPos["fifth"] + 6, TapeBottomYPos["fifth"] - 6);
  drawer.drawPuryForFifthTape(fixedPuryXPos["fifth"] + 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(fixedPuryXPos["fifth"] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);

  // ティッピングプレートに対する滑車
  drawer.drawPuryForTippingPlate(x00Arr[0], y00Arr[0]);
  drawer.drawPuryForTippingPlate(x01Arr[0], y01Arr[0]);
  drawer.drawPuryForTippingPlate(x02Arr[0], y02Arr[0]);
  drawer.drawPuryForTippingPlate(x03Arr[0], y03Arr[0]);
  drawer.drawPuryForTippingPlate(x04Arr[0], y04Arr[0]);
  drawer.drawPuryForTippingPlate(x05Arr[0], y05Arr[0]);
  drawer.drawPuryForTippingPlate(x10Arr[0], y10Arr[0]);
  drawer.drawPuryForTippingPlate(x11Arr[0], y11Arr[0]);
  drawer.drawPuryForTippingPlate(x12Arr[0], y12Arr[0]);
  drawer.drawPuryForTippingPlate(x13Arr[0], y13Arr[0]);
  drawer.drawPuryForTippingPlate(x14Arr[0], y14Arr[0]);
  drawer.drawPuryForTippingPlate(x15Arr[0], y15Arr[0]);
  drawer.drawPuryForTippingPlate(x20Arr[0], y20Arr[0]);
  drawer.drawPuryForTippingPlate(x21Arr[0], y21Arr[0]);
  drawer.drawPuryForTippingPlate(x22Arr[0], y22Arr[0]);
  drawer.drawPuryForTippingPlate(x23Arr[0], y23Arr[0]);
  drawer.drawPuryForTippingPlate(x24Arr[0], y24Arr[0]);
  drawer.drawPuryForTippingPlate(x25Arr[0], y25Arr[0]);
  drawer.drawPuryForTippingPlate(x30Arr[0], y30Arr[0]);
  drawer.drawPuryForTippingPlate(x31Arr[0], y31Arr[0]);
  drawer.drawPuryForTippingPlate(x32Arr[0], y32Arr[0]);
  drawer.drawPuryForTippingPlate(x33Arr[0], y33Arr[0]);
  drawer.drawPuryForTippingPlate(x34Arr[0], y34Arr[0]);
  drawer.drawPuryForTippingPlate(x35Arr[0], y35Arr[0]);
  drawer.drawPuryForTippingPlate(x40Arr[0], y40Arr[0]);
  drawer.drawPuryForTippingPlate(x41Arr[0], y41Arr[0]);
  drawer.drawPuryForTippingPlate(x42Arr[0], y42Arr[0]);
  drawer.drawPuryForTippingPlate(x43Arr[0], y43Arr[0]);
  drawer.drawPuryForTippingPlate(x44Arr[0], y44Arr[0]);
  drawer.drawPuryForTippingPlate(x45Arr[0], y45Arr[0]);

  // 最初のテープを描画
  // 下
  drawer.drawLineForFirstTape(fixedXPosition, TapeTopYPos["first"] + turnBackPointYPos, x05Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x05Arr[0] + 6, TapeTopYPos["first"] + turnBackPointYPos + 6, x05Arr[0] + 6, y05Arr[0]);
  drawer.drawLineForFirstTape(x05Arr[0] - 6, TapeBottomYPos["first"] + turnBackPointYPos - 6, x05Arr[0] - 6, y05Arr[0]);
  drawer.drawLineForFirstTape(x05Arr[0] + 6, y05Arr[0], x05Arr[0] + 6, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawLineForFirstTape(x05Arr[0] - 6, y05Arr[0], x05Arr[0] - 6, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawLineForFirstTape(fixedPuryXPos["first"] + 6, TapeTopYPos["first"] + turnBackPointYPos, x05Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(fixedPuryXPos["first"] + 6, TapeBottomYPos["first"] + turnBackPointYPos, x05Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x05Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["first"] + turnBackPointYPos);
  // 上
  drawer.drawLineForFirstTape(fixedXPosition, TapeTopYPos["first"], x04Arr[0] + 12, TapeTopYPos["first"]);
  drawer.drawLineForFirstTape(x04Arr[0] + 6, TapeTopYPos["first"] + 6, x04Arr[0] + 6, y04Arr[0]);
  drawer.drawLineForFirstTape(x04Arr[0] - 6, y04Arr[0], x04Arr[0] - 6, TapeTopYPos["first"] + 6);
  drawer.drawLineForFirstTape(x04Arr[0] - 12, TapeTopYPos["first"], x03Arr[0] + 12, TapeTopYPos["first"]);
  drawer.drawLineForFirstTape(x03Arr[0] + 6, TapeTopYPos["first"] + 6, x03Arr[0] + 6, y03Arr[0]);
  drawer.drawLineForFirstTape(x03Arr[0] - 6, y03Arr[0], x03Arr[0] - 6, TapeTopYPos["first"] + 6);
  drawer.drawLineForFirstTape(x03Arr[0] - 12, TapeTopYPos["first"], x02Arr[0] + 12, TapeTopYPos["first"]);
  drawer.drawLineForFirstTape(x02Arr[0] + 6, TapeTopYPos["first"] + 6, x02Arr[0] + 6, y02Arr[0]);
  drawer.drawLineForFirstTape(x02Arr[0] - 6, y02Arr[0], x02Arr[0] - 6, TapeTopYPos["first"] + 6);
  drawer.drawLineForFirstTape(x02Arr[0] - 12, TapeTopYPos["first"], x01Arr[0] + 12, TapeTopYPos["first"]);
  drawer.drawLineForFirstTape(x01Arr[0] + 6, TapeTopYPos["first"] + 6, x01Arr[0] + 6, y01Arr[0]);
  drawer.drawLineForFirstTape(x01Arr[0] - 6, y01Arr[0], x01Arr[0] - 6, TapeTopYPos["first"] + 6);
  drawer.drawLineForFirstTape(x01Arr[0] - 12, TapeTopYPos["first"], x00Arr[0] + 12, TapeTopYPos["first"]);
  drawer.drawLineForFirstTape(x00Arr[0] + 6, TapeTopYPos["first"] + 6, x00Arr[0] + 6, y00Arr[0]);
  drawer.drawLineForFirstTape(x00Arr[0] - 6, y00Arr[0], x00Arr[0] - 6, TapeTopYPos["first"] + 6);
  drawer.drawLineForFirstTape(x00Arr[0] - 12, TapeTopYPos["first"], fixedPuryXPos["first"] + 6, TapeTopYPos["first"]);
  drawer.drawLineForFirstTape(fixedPuryXPos["first"], TapeTopYPos["first"] + 6, fixedPuryXPos["first"], TapeBottomYPos["first"] - 6);
  drawer.drawLineForFirstTape(fixedPuryXPos["first"] + 6, TapeBottomYPos["first"], x00Arr[0] - 12, TapeBottomYPos["first"]);
  drawer.drawLineForFirstTape(x00Arr[0] - 6, TapeBottomYPos["first"] - 6, x00Arr[0] - 6, y00Arr[0]);
  drawer.drawLineForFirstTape(x00Arr[0] + 6, y00Arr[0], x00Arr[0] + 6, TapeBottomYPos["first"] - 6);
  drawer.drawLineForFirstTape(x00Arr[0] + 12, TapeBottomYPos["first"], x01Arr[0] - 12, TapeBottomYPos["first"]);
  drawer.drawLineForFirstTape(x01Arr[0] - 6, TapeBottomYPos["first"] - 6, x01Arr[0] - 6, y01Arr[0]);
  drawer.drawLineForFirstTape(x01Arr[0] + 6, y01Arr[0], x01Arr[0] + 6, TapeBottomYPos["first"] - 6);
  drawer.drawLineForFirstTape(x01Arr[0] + 12, TapeBottomYPos["first"], x02Arr[0] - 12, TapeBottomYPos["first"]);
  drawer.drawLineForFirstTape(x02Arr[0] - 6, TapeBottomYPos["first"] - 6, x02Arr[0] - 6, y02Arr[0]);
  drawer.drawLineForFirstTape(x02Arr[0] + 6, y02Arr[0], x02Arr[0] + 6, TapeBottomYPos["first"] - 6);
  drawer.drawLineForFirstTape(x02Arr[0] + 12, TapeBottomYPos["first"], x03Arr[0] - 12, TapeBottomYPos["first"]);
  drawer.drawLineForFirstTape(x03Arr[0] - 6, TapeBottomYPos["first"] - 6, x03Arr[0] - 6, y03Arr[0]);
  drawer.drawLineForFirstTape(x03Arr[0] + 6, y03Arr[0], x03Arr[0] + 6, TapeBottomYPos["first"] - 6);
  drawer.drawLineForFirstTape(x03Arr[0] + 12, TapeBottomYPos["first"], x04Arr[0] - 12, TapeBottomYPos["first"]);
  drawer.drawLineForFirstTape(x04Arr[0] - 6, TapeBottomYPos["first"] - 6, x04Arr[0] - 6, y04Arr[0]);
  drawer.drawLineForFirstTape(x04Arr[0] + 6, y04Arr[0], x04Arr[0] + 6, TapeBottomYPos["first"] - 6);
  drawer.drawLineForFirstTape(x04Arr[0] + 12, TapeBottomYPos["first"], fixedXPosition, TapeBottomYPos["first"]);
  // 最初のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForFirstTape(fixedXPosition, TapeBottomYPos["first"], fixedXPosition + turnBackAdjustment["first"], TapeBottomYPos["first"]);
  drawer.drawLineForFirstTape(fixedXPosition + turnBackAdjustment["first"], TapeBottomYPos["first"], fixedXPosition + turnBackAdjustment["first"], fixedTapeTopYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(fixedXPosition + turnBackAdjustment["first"], fixedTapeTopYPos["first"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["first"] + turnBackPointYPos);
  // 最初のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForFirstTape(fixedXPosition, fixedTapeTopYPos["first"], fixedXPosition + turnBackAdjustment2["first"], fixedTapeTopYPos["first"]);
  drawer.drawLineForFirstTape(fixedXPosition + turnBackAdjustment2["first"], fixedTapeTopYPos["first"], fixedXPosition + turnBackAdjustment2["first"], TapeBottomYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(fixedXPosition + turnBackAdjustment2["first"], TapeBottomYPos["first"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["first"] + turnBackPointYPos);

  // 2番目のテープを描画
  // 上
  drawer.drawLineForSecondTape(fixedXPosition, TapeTopYPos["second"] + turnBackPointYPos, x15Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x15Arr[0] + 6, TapeTopYPos["second"] + turnBackPointYPos + 6, x15Arr[0] + 6, y15Arr[0]);
  drawer.drawLineForSecondTape(x15Arr[0] - 6, TapeBottomYPos["second"] + turnBackPointYPos - 6, x15Arr[0] - 6, y15Arr[0]);
  drawer.drawLineForSecondTape(x15Arr[0] + 6, y15Arr[0], x15Arr[0] + 6, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawLineForSecondTape(x15Arr[0] - 6, y15Arr[0], x15Arr[0] - 6, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawLineForSecondTape(fixedPuryXPos["second"] + 6, TapeTopYPos["second"] + turnBackPointYPos, x15Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(fixedPuryXPos["second"] + 6, TapeBottomYPos["second"] + turnBackPointYPos, x15Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x15Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["second"] + turnBackPointYPos);
  // 下
  drawer.drawLineForSecondTape(fixedXPosition, TapeTopYPos["second"], x14Arr[0] + 12, TapeTopYPos["second"]);
  drawer.drawLineForSecondTape(x14Arr[0] + 6, TapeTopYPos["second"] + 6, x14Arr[0] + 6, y14Arr[0]);
  drawer.drawLineForSecondTape(x14Arr[0] - 6, y14Arr[0], x14Arr[0] - 6, TapeTopYPos["second"] + 6);
  drawer.drawLineForSecondTape(x14Arr[0] - 12, TapeTopYPos["second"], x13Arr[0] + 12, TapeTopYPos["second"]);
  drawer.drawLineForSecondTape(x13Arr[0] + 6, TapeTopYPos["second"] + 6, x13Arr[0] + 6, y13Arr[0]);
  drawer.drawLineForSecondTape(x13Arr[0] - 6, y13Arr[0], x13Arr[0] - 6, TapeTopYPos["second"] + 6);
  drawer.drawLineForSecondTape(x13Arr[0] - 12, TapeTopYPos["second"], x12Arr[0] + 12, TapeTopYPos["second"]);
  drawer.drawLineForSecondTape(x12Arr[0] + 6, TapeTopYPos["second"] + 6, x12Arr[0] + 6, y12Arr[0]);
  drawer.drawLineForSecondTape(x12Arr[0] - 6, y12Arr[0], x12Arr[0] - 6, TapeTopYPos["second"] + 6);
  drawer.drawLineForSecondTape(x12Arr[0] - 12, TapeTopYPos["second"], x11Arr[0] + 12, TapeTopYPos["second"]);
  drawer.drawLineForSecondTape(x11Arr[0] + 6, TapeTopYPos["second"] + 6, x11Arr[0] + 6, y11Arr[0]);
  drawer.drawLineForSecondTape(x11Arr[0] - 6, y11Arr[0], x11Arr[0] - 6, TapeTopYPos["second"] + 6);
  drawer.drawLineForSecondTape(x11Arr[0] - 12, TapeTopYPos["second"], x10Arr[0] + 12, TapeTopYPos["second"]);
  drawer.drawLineForSecondTape(x10Arr[0] + 6, TapeTopYPos["second"] + 6, x10Arr[0] + 6, y10Arr[0]);
  drawer.drawLineForSecondTape(x10Arr[0] - 6, y10Arr[0], x10Arr[0] - 6, TapeTopYPos["second"] + 6);
  drawer.drawLineForSecondTape(x10Arr[0] - 12, TapeTopYPos["second"], fixedPuryXPos["second"] + 6, TapeTopYPos["second"]);
  drawer.drawLineForSecondTape(fixedPuryXPos["second"], TapeTopYPos["second"] + 6, fixedPuryXPos["second"], TapeBottomYPos["second"] - 6);
  drawer.drawLineForSecondTape(fixedPuryXPos["second"] + 6, TapeBottomYPos["second"], x10Arr[0] - 12, TapeBottomYPos["second"]);
  drawer.drawLineForSecondTape(x10Arr[0] - 6, TapeBottomYPos["second"] - 6, x10Arr[0] - 6, y10Arr[0]);
  drawer.drawLineForSecondTape(x10Arr[0] + 6, y10Arr[0], x10Arr[0] + 6, TapeBottomYPos["second"] - 6);
  drawer.drawLineForSecondTape(x10Arr[0] + 12, TapeBottomYPos["second"], x11Arr[0] - 12, TapeBottomYPos["second"]);
  drawer.drawLineForSecondTape(x11Arr[0] - 6, TapeBottomYPos["second"] - 6, x11Arr[0] - 6, y11Arr[0]);
  drawer.drawLineForSecondTape(x11Arr[0] + 6, y11Arr[0], x11Arr[0] + 6, TapeBottomYPos["second"] - 6);
  drawer.drawLineForSecondTape(x11Arr[0] + 12, TapeBottomYPos["second"], x12Arr[0] - 12, TapeBottomYPos["second"]);
  drawer.drawLineForSecondTape(x12Arr[0] - 6, TapeBottomYPos["second"] - 6, x12Arr[0] - 6, y12Arr[0]);
  drawer.drawLineForSecondTape(x12Arr[0] + 6, y12Arr[0], x12Arr[0] + 6, TapeBottomYPos["second"] - 6);
  drawer.drawLineForSecondTape(x12Arr[0] + 12, TapeBottomYPos["second"], x13Arr[0] - 12, TapeBottomYPos["second"]);
  drawer.drawLineForSecondTape(x13Arr[0] - 6, TapeBottomYPos["second"] - 6, x13Arr[0] - 6, y13Arr[0]);
  drawer.drawLineForSecondTape(x13Arr[0] + 6, y13Arr[0], x13Arr[0] + 6, TapeBottomYPos["second"] - 6);
  drawer.drawLineForSecondTape(x13Arr[0] + 12, TapeBottomYPos["second"], x14Arr[0] - 12, TapeBottomYPos["second"]);
  drawer.drawLineForSecondTape(x14Arr[0] - 6, TapeBottomYPos["second"] - 6, x14Arr[0] - 6, y14Arr[0]);
  drawer.drawLineForSecondTape(x14Arr[0] + 6, y14Arr[0], x14Arr[0] + 6, TapeBottomYPos["second"] - 6);
  drawer.drawLineForSecondTape(x14Arr[0] + 12, TapeBottomYPos["second"], fixedXPosition, TapeBottomYPos["second"]);
  // 2番目のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForSecondTape(fixedXPosition, TapeBottomYPos["second"], fixedXPosition + turnBackAdjustment["second"], TapeBottomYPos["second"]);
  drawer.drawLineForSecondTape(fixedXPosition + turnBackAdjustment["second"], TapeBottomYPos["second"], fixedXPosition + turnBackAdjustment["second"], fixedTapeTopYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(fixedXPosition + turnBackAdjustment["second"], fixedTapeTopYPos["second"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["second"] + turnBackPointYPos);
  // 2番目のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForSecondTape(fixedXPosition, fixedTapeTopYPos["second"], fixedXPosition + turnBackAdjustment2["second"], fixedTapeTopYPos["second"]);
  drawer.drawLineForSecondTape(
    fixedXPosition + turnBackAdjustment2["second"],
    fixedTapeTopYPos["second"],
    fixedXPosition + turnBackAdjustment2["second"],
    TapeBottomYPos["second"] + turnBackPointYPos
  );
  drawer.drawLineForSecondTape(fixedXPosition + turnBackAdjustment2["second"], TapeBottomYPos["second"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["second"] + turnBackPointYPos);

  // 3番目のテープを描画
  // 下
  drawer.drawLineForThirdTape(fixedXPosition, TapeTopYPos["third"] + turnBackPointYPos, x25Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x25Arr[0] + 6, TapeTopYPos["third"] + turnBackPointYPos + 6, x25Arr[0] + 6, y25Arr[0]);
  drawer.drawLineForThirdTape(x25Arr[0] - 6, TapeBottomYPos["third"] + turnBackPointYPos - 6, x25Arr[0] - 6, y25Arr[0]);
  drawer.drawLineForThirdTape(x25Arr[0] + 6, y25Arr[0], x25Arr[0] + 6, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawLineForThirdTape(x25Arr[0] - 6, y25Arr[0], x25Arr[0] - 6, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawLineForThirdTape(fixedPuryXPos["third"] + 6, TapeTopYPos["third"] + turnBackPointYPos, x25Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(fixedPuryXPos["third"] + 6, TapeBottomYPos["third"] + turnBackPointYPos, x25Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x25Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["third"] + turnBackPointYPos);
  // 上
  drawer.drawLineForThirdTape(fixedXPosition, TapeTopYPos["third"], x24Arr[0] + 12, TapeTopYPos["third"]);
  drawer.drawLineForThirdTape(x24Arr[0] + 6, TapeTopYPos["third"] + 6, x24Arr[0] + 6, y24Arr[0]);
  drawer.drawLineForThirdTape(x24Arr[0] - 6, y24Arr[0], x24Arr[0] - 6, TapeTopYPos["third"] + 6);
  drawer.drawLineForThirdTape(x24Arr[0] - 12, TapeTopYPos["third"], x23Arr[0] + 12, TapeTopYPos["third"]);
  drawer.drawLineForThirdTape(x23Arr[0] + 6, TapeTopYPos["third"] + 6, x23Arr[0] + 6, y23Arr[0]);
  drawer.drawLineForThirdTape(x23Arr[0] - 6, y23Arr[0], x23Arr[0] - 6, TapeTopYPos["third"] + 6);
  drawer.drawLineForThirdTape(x23Arr[0] - 12, TapeTopYPos["third"], x22Arr[0] + 12, TapeTopYPos["third"]);
  drawer.drawLineForThirdTape(x22Arr[0] + 6, TapeTopYPos["third"] + 6, x22Arr[0] + 6, y22Arr[0]);
  drawer.drawLineForThirdTape(x22Arr[0] - 6, y22Arr[0], x22Arr[0] - 6, TapeTopYPos["third"] + 6);
  drawer.drawLineForThirdTape(x22Arr[0] - 12, TapeTopYPos["third"], x21Arr[0] + 12, TapeTopYPos["third"]);
  drawer.drawLineForThirdTape(x21Arr[0] + 6, TapeTopYPos["third"] + 6, x21Arr[0] + 6, y21Arr[0]);
  drawer.drawLineForThirdTape(x21Arr[0] - 6, y21Arr[0], x21Arr[0] - 6, TapeTopYPos["third"] + 6);
  drawer.drawLineForThirdTape(x21Arr[0] - 12, TapeTopYPos["third"], x20Arr[0] + 12, TapeTopYPos["third"]);
  drawer.drawLineForThirdTape(x20Arr[0] + 6, TapeTopYPos["third"] + 6, x20Arr[0] + 6, y20Arr[0]);
  drawer.drawLineForThirdTape(x20Arr[0] - 6, y20Arr[0], x20Arr[0] - 6, TapeTopYPos["third"] + 6);
  drawer.drawLineForThirdTape(x20Arr[0] - 12, TapeTopYPos["third"], fixedPuryXPos["third"] + 6, TapeTopYPos["third"]);
  drawer.drawLineForThirdTape(fixedPuryXPos["third"], TapeTopYPos["third"] + 6, fixedPuryXPos["third"], TapeBottomYPos["third"] - 6);
  drawer.drawLineForThirdTape(fixedPuryXPos["third"] + 6, TapeBottomYPos["third"], x20Arr[0] - 12, TapeBottomYPos["third"]);
  drawer.drawLineForThirdTape(x20Arr[0] - 6, TapeBottomYPos["third"] - 6, x20Arr[0] - 6, y20Arr[0]);
  drawer.drawLineForThirdTape(x20Arr[0] + 6, y20Arr[0], x20Arr[0] + 6, TapeBottomYPos["third"] - 6);
  drawer.drawLineForThirdTape(x20Arr[0] + 12, TapeBottomYPos["third"], x21Arr[0] - 12, TapeBottomYPos["third"]);
  drawer.drawLineForThirdTape(x21Arr[0] - 6, TapeBottomYPos["third"] - 6, x21Arr[0] - 6, y21Arr[0]);
  drawer.drawLineForThirdTape(x21Arr[0] + 6, y21Arr[0], x21Arr[0] + 6, TapeBottomYPos["third"] - 6);
  drawer.drawLineForThirdTape(x21Arr[0] + 12, TapeBottomYPos["third"], x22Arr[0] - 12, TapeBottomYPos["third"]);
  drawer.drawLineForThirdTape(x22Arr[0] - 6, TapeBottomYPos["third"] - 6, x22Arr[0] - 6, y22Arr[0]);
  drawer.drawLineForThirdTape(x22Arr[0] + 6, y22Arr[0], x22Arr[0] + 6, TapeBottomYPos["third"] - 6);
  drawer.drawLineForThirdTape(x22Arr[0] + 12, TapeBottomYPos["third"], x23Arr[0] - 12, TapeBottomYPos["third"]);
  drawer.drawLineForThirdTape(x23Arr[0] - 6, TapeBottomYPos["third"] - 6, x23Arr[0] - 6, y23Arr[0]);
  drawer.drawLineForThirdTape(x23Arr[0] + 6, y23Arr[0], x23Arr[0] + 6, TapeBottomYPos["third"] - 6);
  drawer.drawLineForThirdTape(x23Arr[0] + 12, TapeBottomYPos["third"], x24Arr[0] - 12, TapeBottomYPos["third"]);
  drawer.drawLineForThirdTape(x24Arr[0] - 6, TapeBottomYPos["third"] - 6, x24Arr[0] - 6, y24Arr[0]);
  drawer.drawLineForThirdTape(x24Arr[0] + 6, y24Arr[0], x24Arr[0] + 6, TapeBottomYPos["third"] - 6);
  drawer.drawLineForThirdTape(x24Arr[0] + 12, TapeBottomYPos["third"], fixedXPosition, TapeBottomYPos["third"]);
  // 3番目のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForThirdTape(fixedXPosition, TapeBottomYPos["third"], fixedXPosition + turnBackAdjustment["third"], TapeBottomYPos["third"]);
  drawer.drawLineForThirdTape(fixedXPosition + turnBackAdjustment["third"], TapeBottomYPos["third"], fixedXPosition + turnBackAdjustment["third"], fixedTapeTopYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(fixedXPosition + turnBackAdjustment["third"], fixedTapeTopYPos["third"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["third"] + turnBackPointYPos);
  // 3番目のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForThirdTape(fixedXPosition, fixedTapeTopYPos["third"], fixedXPosition + turnBackAdjustment2["third"], fixedTapeTopYPos["third"]);
  drawer.drawLineForThirdTape(fixedXPosition + turnBackAdjustment2["third"], fixedTapeTopYPos["third"], fixedXPosition + turnBackAdjustment2["third"], TapeBottomYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(fixedXPosition + turnBackAdjustment2["third"], TapeBottomYPos["third"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["third"] + turnBackPointYPos);

  // 4番目のテープを描画
  // 下
  drawer.drawLineForFourthTape(fixedXPosition, TapeTopYPos["fourth"] + turnBackPointYPos, x35Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x35Arr[0] + 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6, x35Arr[0] + 6, y35Arr[0]);
  drawer.drawLineForFourthTape(x35Arr[0] - 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6, x35Arr[0] - 6, y35Arr[0]);
  drawer.drawLineForFourthTape(x35Arr[0] + 6, y35Arr[0], x35Arr[0] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawLineForFourthTape(x35Arr[0] - 6, y35Arr[0], x35Arr[0] - 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawLineForFourthTape(fixedPuryXPos["fourth"] + 6, TapeTopYPos["fourth"] + turnBackPointYPos, x35Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(fixedPuryXPos["fourth"] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos, x35Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x35Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["fourth"] + turnBackPointYPos);
  // 上
  drawer.drawLineForFourthTape(fixedXPosition, TapeTopYPos["fourth"], x34Arr[0] + 12, TapeTopYPos["fourth"]);
  drawer.drawLineForFourthTape(x34Arr[0] + 6, TapeTopYPos["fourth"] + 6, x34Arr[0] + 6, y34Arr[0]);
  drawer.drawLineForFourthTape(x34Arr[0] - 6, y34Arr[0], x34Arr[0] - 6, TapeTopYPos["fourth"] + 6);
  drawer.drawLineForFourthTape(x34Arr[0] - 12, TapeTopYPos["fourth"], x33Arr[0] + 12, TapeTopYPos["fourth"]);
  drawer.drawLineForFourthTape(x33Arr[0] + 6, TapeTopYPos["fourth"] + 6, x33Arr[0] + 6, y33Arr[0]);
  drawer.drawLineForFourthTape(x33Arr[0] - 6, y33Arr[0], x33Arr[0] - 6, TapeTopYPos["fourth"] + 6);
  drawer.drawLineForFourthTape(x33Arr[0] - 12, TapeTopYPos["fourth"], x32Arr[0] + 12, TapeTopYPos["fourth"]);
  drawer.drawLineForFourthTape(x32Arr[0] + 6, TapeTopYPos["fourth"] + 6, x32Arr[0] + 6, y32Arr[0]);
  drawer.drawLineForFourthTape(x32Arr[0] - 6, y32Arr[0], x32Arr[0] - 6, TapeTopYPos["fourth"] + 6);
  drawer.drawLineForFourthTape(x32Arr[0] - 12, TapeTopYPos["fourth"], x31Arr[0] + 12, TapeTopYPos["fourth"]);
  drawer.drawLineForFourthTape(x31Arr[0] + 6, TapeTopYPos["fourth"] + 6, x31Arr[0] + 6, y31Arr[0]);
  drawer.drawLineForFourthTape(x31Arr[0] - 6, y31Arr[0], x31Arr[0] - 6, TapeTopYPos["fourth"] + 6);
  drawer.drawLineForFourthTape(x31Arr[0] - 12, TapeTopYPos["fourth"], x30Arr[0] + 12, TapeTopYPos["fourth"]);
  drawer.drawLineForFourthTape(x30Arr[0] + 6, TapeTopYPos["fourth"] + 6, x30Arr[0] + 6, y30Arr[0]);
  drawer.drawLineForFourthTape(x30Arr[0] - 6, y30Arr[0], x30Arr[0] - 6, TapeTopYPos["fourth"] + 6);
  drawer.drawLineForFourthTape(x30Arr[0] - 12, TapeTopYPos["fourth"], fixedPuryXPos["fourth"] + 6, TapeTopYPos["fourth"]);
  drawer.drawLineForFourthTape(fixedPuryXPos["fourth"], TapeTopYPos["fourth"] + 6, fixedPuryXPos["fourth"], TapeBottomYPos["fourth"] - 6);
  drawer.drawLineForFourthTape(fixedPuryXPos["fourth"] + 6, TapeBottomYPos["fourth"], x30Arr[0] - 12, TapeBottomYPos["fourth"]);
  drawer.drawLineForFourthTape(x30Arr[0] - 6, TapeBottomYPos["fourth"] - 6, x30Arr[0] - 6, y30Arr[0]);
  drawer.drawLineForFourthTape(x30Arr[0] + 6, y30Arr[0], x30Arr[0] + 6, TapeBottomYPos["fourth"] - 6);
  drawer.drawLineForFourthTape(x30Arr[0] + 12, TapeBottomYPos["fourth"], x31Arr[0] - 12, TapeBottomYPos["fourth"]);
  drawer.drawLineForFourthTape(x31Arr[0] - 6, TapeBottomYPos["fourth"] - 6, x31Arr[0] - 6, y31Arr[0]);
  drawer.drawLineForFourthTape(x31Arr[0] + 6, y31Arr[0], x31Arr[0] + 6, TapeBottomYPos["fourth"] - 6);
  drawer.drawLineForFourthTape(x31Arr[0] + 12, TapeBottomYPos["fourth"], x32Arr[0] - 12, TapeBottomYPos["fourth"]);
  drawer.drawLineForFourthTape(x32Arr[0] - 6, TapeBottomYPos["fourth"] - 6, x32Arr[0] - 6, y32Arr[0]);
  drawer.drawLineForFourthTape(x32Arr[0] + 6, y32Arr[0], x32Arr[0] + 6, TapeBottomYPos["fourth"] - 6);
  drawer.drawLineForFourthTape(x32Arr[0] + 12, TapeBottomYPos["fourth"], x33Arr[0] - 12, TapeBottomYPos["fourth"]);
  drawer.drawLineForFourthTape(x33Arr[0] - 6, TapeBottomYPos["fourth"] - 6, x33Arr[0] - 6, y33Arr[0]);
  drawer.drawLineForFourthTape(x33Arr[0] + 6, y33Arr[0], x33Arr[0] + 6, TapeBottomYPos["fourth"] - 6);
  drawer.drawLineForFourthTape(x33Arr[0] + 12, TapeBottomYPos["fourth"], x34Arr[0] - 12, TapeBottomYPos["fourth"]);
  drawer.drawLineForFourthTape(x34Arr[0] - 6, TapeBottomYPos["fourth"] - 6, x34Arr[0] - 6, y34Arr[0]);
  drawer.drawLineForFourthTape(x34Arr[0] + 6, y34Arr[0], x34Arr[0] + 6, TapeBottomYPos["fourth"] - 6);
  drawer.drawLineForFourthTape(x34Arr[0] + 12, TapeBottomYPos["fourth"], fixedXPosition, TapeBottomYPos["fourth"]);
  // 4番目のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForFourthTape(fixedXPosition, TapeBottomYPos["fourth"], fixedXPosition + turnBackAdjustment["fourth"], TapeBottomYPos["fourth"]);
  drawer.drawLineForFourthTape(fixedXPosition + turnBackAdjustment["fourth"], TapeBottomYPos["fourth"], fixedXPosition + turnBackAdjustment["fourth"], fixedTapeTopYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(fixedXPosition + turnBackAdjustment["fourth"], fixedTapeTopYPos["fourth"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["fourth"] + turnBackPointYPos);
  // 4番目のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForFourthTape(fixedXPosition, fixedTapeTopYPos["fourth"], fixedXPosition + turnBackAdjustment2["fourth"], fixedTapeTopYPos["fourth"]);
  drawer.drawLineForFourthTape(
    fixedXPosition + turnBackAdjustment2["fourth"],
    fixedTapeTopYPos["fourth"],
    fixedXPosition + turnBackAdjustment2["fourth"],
    TapeBottomYPos["fourth"] + turnBackPointYPos
  );
  drawer.drawLineForFourthTape(fixedXPosition + turnBackAdjustment2["fourth"], TapeBottomYPos["fourth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["fourth"] + turnBackPointYPos);

  // 5番目のテープを描画
  // 下
  drawer.drawLineForFifthTape(fixedXPosition, TapeTopYPos["fifth"] + turnBackPointYPos, x45Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x45Arr[0] + 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6, x45Arr[0] + 6, y45Arr[0]);
  drawer.drawLineForFifthTape(x45Arr[0] - 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6, x45Arr[0] - 6, y45Arr[0]);
  drawer.drawLineForFifthTape(x45Arr[0] + 6, y45Arr[0], x45Arr[0] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawLineForFifthTape(x45Arr[0] - 6, y45Arr[0], x45Arr[0] - 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawLineForFifthTape(fixedPuryXPos["fifth"] + 6, TapeTopYPos["fifth"] + turnBackPointYPos, x45Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(fixedPuryXPos["fifth"] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos, x45Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x45Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["fifth"] + turnBackPointYPos);
  // 上
  drawer.drawLineForFifthTape(fixedXPosition, TapeTopYPos["fifth"], x44Arr[0] + 12, TapeTopYPos["fifth"]);
  drawer.drawLineForFifthTape(x44Arr[0] + 6, TapeTopYPos["fifth"] + 6, x44Arr[0] + 6, y44Arr[0]);
  drawer.drawLineForFifthTape(x44Arr[0] - 6, y44Arr[0], x44Arr[0] - 6, TapeTopYPos["fifth"] + 6);
  drawer.drawLineForFifthTape(x44Arr[0] - 12, TapeTopYPos["fifth"], x43Arr[0] + 12, TapeTopYPos["fifth"]);
  drawer.drawLineForFifthTape(x43Arr[0] + 6, TapeTopYPos["fifth"] + 6, x43Arr[0] + 6, y43Arr[0]);
  drawer.drawLineForFifthTape(x43Arr[0] - 6, y43Arr[0], x43Arr[0] - 6, TapeTopYPos["fifth"] + 6);
  drawer.drawLineForFifthTape(x43Arr[0] - 12, TapeTopYPos["fifth"], x42Arr[0] + 12, TapeTopYPos["fifth"]);
  drawer.drawLineForFifthTape(x42Arr[0] + 6, TapeTopYPos["fifth"] + 6, x42Arr[0] + 6, y42Arr[0]);
  drawer.drawLineForFifthTape(x42Arr[0] - 6, y42Arr[0], x42Arr[0] - 6, TapeTopYPos["fifth"] + 6);
  drawer.drawLineForFifthTape(x42Arr[0] - 12, TapeTopYPos["fifth"], x41Arr[0] + 12, TapeTopYPos["fifth"]);
  drawer.drawLineForFifthTape(x41Arr[0] + 6, TapeTopYPos["fifth"] + 6, x41Arr[0] + 6, y41Arr[0]);
  drawer.drawLineForFifthTape(x41Arr[0] - 6, y41Arr[0], x41Arr[0] - 6, TapeTopYPos["fifth"] + 6);
  drawer.drawLineForFifthTape(x41Arr[0] - 12, TapeTopYPos["fifth"], x40Arr[0] + 12, TapeTopYPos["fifth"]);
  drawer.drawLineForFifthTape(x40Arr[0] + 6, TapeTopYPos["fifth"] + 6, x40Arr[0] + 6, y40Arr[0]);
  drawer.drawLineForFifthTape(x40Arr[0] - 6, y40Arr[0], x40Arr[0] - 6, TapeTopYPos["fifth"] + 6);
  drawer.drawLineForFifthTape(x40Arr[0] - 12, TapeTopYPos["fifth"], fixedPuryXPos["fifth"] + 6, TapeTopYPos["fifth"]);
  drawer.drawLineForFifthTape(fixedPuryXPos["fifth"], TapeTopYPos["fifth"] + 6, fixedPuryXPos["fifth"], TapeBottomYPos["fifth"] - 6);
  drawer.drawLineForFifthTape(fixedPuryXPos["fifth"] + 6, TapeBottomYPos["fifth"], x40Arr[0] - 12, TapeBottomYPos["fifth"]);
  drawer.drawLineForFifthTape(x40Arr[0] - 6, TapeBottomYPos["fifth"] - 6, x40Arr[0] - 6, y40Arr[0]);
  drawer.drawLineForFifthTape(x40Arr[0] + 6, y40Arr[0], x40Arr[0] + 6, TapeBottomYPos["fifth"] - 6);
  drawer.drawLineForFifthTape(x40Arr[0] + 12, TapeBottomYPos["fifth"], x41Arr[0] - 12, TapeBottomYPos["fifth"]);
  drawer.drawLineForFifthTape(x41Arr[0] - 6, TapeBottomYPos["fifth"] - 6, x41Arr[0] - 6, y41Arr[0]);
  drawer.drawLineForFifthTape(x41Arr[0] + 6, y41Arr[0], x41Arr[0] + 6, TapeBottomYPos["fifth"] - 6);
  drawer.drawLineForFifthTape(x41Arr[0] + 12, TapeBottomYPos["fifth"], x42Arr[0] - 12, TapeBottomYPos["fifth"]);
  drawer.drawLineForFifthTape(x42Arr[0] - 6, TapeBottomYPos["fifth"] - 6, x42Arr[0] - 6, y42Arr[0]);
  drawer.drawLineForFifthTape(x42Arr[0] + 6, y42Arr[0], x42Arr[0] + 6, TapeBottomYPos["fifth"] - 6);
  drawer.drawLineForFifthTape(x42Arr[0] + 12, TapeBottomYPos["fifth"], x43Arr[0] - 12, TapeBottomYPos["fifth"]);
  drawer.drawLineForFifthTape(x43Arr[0] - 6, TapeBottomYPos["fifth"] - 6, x43Arr[0] - 6, y43Arr[0]);
  drawer.drawLineForFifthTape(x43Arr[0] + 6, y43Arr[0], x43Arr[0] + 6, TapeBottomYPos["fifth"] - 6);
  drawer.drawLineForFifthTape(x43Arr[0] + 12, TapeBottomYPos["fifth"], x44Arr[0] - 12, TapeBottomYPos["fifth"]);
  drawer.drawLineForFifthTape(x44Arr[0] - 6, TapeBottomYPos["fifth"] - 6, x44Arr[0] - 6, y44Arr[0]);
  drawer.drawLineForFifthTape(x44Arr[0] + 6, y44Arr[0], x44Arr[0] + 6, TapeBottomYPos["fifth"] - 6);
  drawer.drawLineForFifthTape(x44Arr[0] + 12, TapeBottomYPos["fifth"], fixedXPosition, TapeBottomYPos["fifth"]);
  // 5番目のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForFifthTape(fixedXPosition, TapeBottomYPos["fifth"], fixedXPosition + turnBackAdjustment["fifth"], TapeBottomYPos["fifth"]);
  drawer.drawLineForFifthTape(fixedXPosition + turnBackAdjustment["fifth"], TapeBottomYPos["fifth"], fixedXPosition + turnBackAdjustment["fifth"], fixedTapeTopYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(fixedXPosition + turnBackAdjustment["fifth"], fixedTapeTopYPos["fifth"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["fifth"] + turnBackPointYPos);
  // 5番目のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForFifthTape(fixedXPosition, fixedTapeTopYPos["fifth"], fixedXPosition + turnBackAdjustment2["fifth"], fixedTapeTopYPos["fifth"]);
  drawer.drawLineForFifthTape(fixedXPosition + turnBackAdjustment2["fifth"], fixedTapeTopYPos["fifth"], fixedXPosition + turnBackAdjustment2["fifth"], TapeBottomYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(fixedXPosition + turnBackAdjustment2["fifth"], TapeBottomYPos["fifth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["fifth"] + turnBackPointYPos);

  // 固定点の描画
  context.fillStyle = "#666666";
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["first"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["second"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["third"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["fourth"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["fifth"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["sixth"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["seventh"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["eighth"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["ninth"] - 4, 8, 8);

  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["first"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["second"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["third"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["fourth"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["fifth"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["sixth"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["seventh"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["eighth"] - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["ninth"] - 4, 8, 8);

  // 固定点の描画
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["first"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["second"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["third"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["fourth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["fifth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["sixth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["seventh"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["eighth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeBottomYPos["ninth"] + turnBackPointYPos - 4, 8, 8);

  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["first"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["second"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["third"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["fourth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["fifth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["sixth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["seventh"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["eighth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(fixedXPosition - 4, fixedTapeTopYPos["ninth"] + turnBackPointYPos - 4, 8, 8);

  requestAnimationFrame(update);
}

update();
