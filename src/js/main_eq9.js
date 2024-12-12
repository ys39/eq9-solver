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
  sixth: 400,
  seventh: 420,
  eighth: 440,
  ninth: 460,
  tenth: 480,
};
const TapeTopYPos = {
  first: 140,
  second: 160,
  third: 120,
  fourth: 180,
  fifth: 100,
  sixth: 80,
  seventh: 60,
  eighth: 40,
  ninth: 20,
  tenth: 0,
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
  sixth: 80,
  seventh: 70,
  eighth: 60,
  ninth: 50,
};

const turnBackAdjustment2 = {
  first: 220,
  second: 210,
  third: 230,
  fourth: 200,
  fifth: 240,
  sixth: 250,
  seventh: 260,
  eighth: 270,
  ninth: 280,
};

const fixedXPosition = 2650;
const turnBackFixedXPosition = 10;

// 連立方程式のパラメータ
const coef = [
  { a: 70, b: 60, c: 40, d: 10, e: -20, f: 70, g: 60, h: 30, i: 10, j: -20 }, // 70x + 60y + 40z + 10w - 20u + 70v + 60t + 30s + 10r - 20 = 0
  { a: -20, b: 20, c: 20, d: -30, e: -40, f: 20, g: 20, h: 10, i: 50, j: -40 }, // -20x + 20y + 20z - 30w - 40u + 20v + 20t + 10s + 50r - 40 = 0
  { a: 40, b: -10, c: -20, d: -10, e: 10, f: -30, g: -20, h: -30, i: 30, j: 30 }, // 40x - 10y - 20z - 10w + 10u - 30v - 20t - 30s + 30r + 30 = 0
  { a: -40, b: -30, c: -40, d: 20, e: 30, f: 40, g: 30, h: -10, i: -20, j: 10 }, // -40x - 30y - 40z + 20w + 30u + 40v + 30t - 10s - 20r + 10 = 0
  { a: -100, b: 80, c: 60, d: -50, e: 100, f: -10, g: -80, h: -90, i: -90, j: -60 }, // -100x + 80y + 60z - 50w + 100u - 10v - 80t - 90s - 90r - 60 = 0
  { a: 90, b: 40, c: -60, d: 110, e: -80, f: 90, g: 100, h: -70, i: 80, j: -100 }, // 90x + 40y - 60z + 110w - 80u + 90v + 100t - 70s + 80r - 100 = 0
  { a: 20, b: -50, c: 80, d: 70, e: 70, f: 110, g: 30, h: 120, i: 120, j: -120 }, // 20x - 50y + 80z + 70w + 70u + 110v + 30t + 120s + 120r - 120 = 0
  { a: 70, b: 100, c: 100, d: 90, e: 150, f: 150, g: 80, h: 80, i: 100, j: 120 }, // 70x + 100y + 100z + 90w + 150u + 150v + 80t + 80s + 100r + 120 = 0
  { a: -60, b: -70, c: -80, d: -130, e: -110, f: -50, g: 100, h: -30, i: -70, j: -140 }, // -60x - 70y - 80z - 130w - 110u - 50v + 100t - 30s - 70r - 140 = 0
];

const ans = util.solveLinearEquations(
  [
    [70, 60, 40, 10, -20, 70, 60, 30, 10],
    [-20, 20, 20, -30, -40, 20, 20, 10, 50],
    [40, -10, -20, -10, 10, -30, -20, -30, 30],
    [-40, -30, -40, 20, 30, 40, 30, -10, -20],
    [-100, 80, 60, -50, 100, -10, -80, -90, -90],
    [90, 40, -60, 110, -80, 90, 100, -70, 80],
    [20, -50, 80, 70, 70, 110, 30, 120, 120],
    [70, 100, 100, 90, 150, 150, 80, 80, 100],
    [-60, -70, -80, -130, -110, -50, 100, -30, -70],
  ],
  [-20, -40, 30, 10, -60, -100, -120, 120, -140]
);
console.log(ans);

// lusolve関数よりx, yを計算
const solution = util.solveLinearEquations(
  [
    [coef[0].a, coef[0].b, coef[0].c, coef[0].d, coef[0].e, coef[0].f, coef[0].g, coef[0].h, coef[0].i],
    [coef[1].a, coef[1].b, coef[1].c, coef[1].d, coef[1].e, coef[1].f, coef[1].g, coef[1].h, coef[1].i],
    [coef[2].a, coef[2].b, coef[2].c, coef[2].d, coef[2].e, coef[2].f, coef[2].g, coef[2].h, coef[2].i],
    [coef[3].a, coef[3].b, coef[3].c, coef[3].d, coef[3].e, coef[3].f, coef[3].g, coef[3].h, coef[3].i],
    [coef[4].a, coef[4].b, coef[4].c, coef[4].d, coef[4].e, coef[4].f, coef[4].g, coef[4].h, coef[4].i],
    [coef[5].a, coef[5].b, coef[5].c, coef[5].d, coef[5].e, coef[5].f, coef[5].g, coef[5].h, coef[5].i],
    [coef[6].a, coef[6].b, coef[6].c, coef[6].d, coef[6].e, coef[6].f, coef[6].g, coef[6].h, coef[6].i],
    [coef[7].a, coef[7].b, coef[7].c, coef[7].d, coef[7].e, coef[7].f, coef[7].g, coef[7].h, coef[7].i],
    [coef[8].a, coef[8].b, coef[8].c, coef[8].d, coef[8].e, coef[8].f, coef[8].g, coef[8].h, coef[8].i],
  ],
  [coef[0].j, coef[1].j, coef[2].j, coef[3].j, coef[4].j, coef[5].j, coef[6].j, coef[7].j, coef[8].j]
);
// x, y, z, w, u, v, t, s, r
const x = solution[0];
const y = solution[1];
const z = solution[2];
const w = solution[3];
const u = solution[4];
const v = solution[5];
const t = solution[6];
const s = solution[7];
const r = solution[8];

// プーリーを結ぶ線の作成
topTippingPlateXPositions.forEach(function (xPos, index) {
  let body = world.createBody({
    type: "dynamic",
    position: Vec2(xPos, topTippingPlateYPositions[index]),
    angle: 0,
  });
  tippingPlateBodies.push(body);
});
bottomTippingPlateXPositions.forEach(function (xPos, index) {
  let body = world.createBody({
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

    const tippingPlateAngle = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0 };
    if (index === 0) {
      tippingPlateAngle.a = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.a) / x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    } else if (index === 1) {
      tippingPlateAngle.b = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.b) / y);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    } else if (index === 2) {
      tippingPlateAngle.c = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.c) / z);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    } else if (index === 3) {
      tippingPlateAngle.d = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.d) / w);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    } else if (index === 4) {
      tippingPlateAngle.e = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.e) / u);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    } else if (index === 5) {
      tippingPlateAngle.f = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.f) / v);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    } else if (index === 6) {
      tippingPlateAngle.g = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.g) / t);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    } else if (index === 7) {
      tippingPlateAngle.h = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.h) / s);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    } else if (index === 8) {
      tippingPlateAngle.i = angle;
      tippingPlateAngle.j = util.clampedAsin(Math.sin(tippingPlateAngle.i) / r);
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
    } else if (index === 9) {
      tippingPlateAngle.j = angle;
      tippingPlateAngle.a = util.clampedAsin(Math.sin(tippingPlateAngle.j) * x);
      tippingPlateAngle.b = util.clampedAsin(Math.sin(tippingPlateAngle.j) * y);
      tippingPlateAngle.c = util.clampedAsin(Math.sin(tippingPlateAngle.j) * z);
      tippingPlateAngle.d = util.clampedAsin(Math.sin(tippingPlateAngle.j) * w);
      tippingPlateAngle.e = util.clampedAsin(Math.sin(tippingPlateAngle.j) * u);
      tippingPlateAngle.f = util.clampedAsin(Math.sin(tippingPlateAngle.j) * v);
      tippingPlateAngle.g = util.clampedAsin(Math.sin(tippingPlateAngle.j) * t);
      tippingPlateAngle.h = util.clampedAsin(Math.sin(tippingPlateAngle.j) * s);
      tippingPlateAngle.i = util.clampedAsin(Math.sin(tippingPlateAngle.j) * r);
    }

    tippingPlateBodies[0].setAngle(tippingPlateAngle.a);
    tippingPlateBodies[1].setAngle(tippingPlateAngle.b);
    tippingPlateBodies[2].setAngle(tippingPlateAngle.c);
    tippingPlateBodies[3].setAngle(tippingPlateAngle.d);
    tippingPlateBodies[4].setAngle(tippingPlateAngle.e);
    tippingPlateBodies[5].setAngle(tippingPlateAngle.f);
    tippingPlateBodies[6].setAngle(tippingPlateAngle.g);
    tippingPlateBodies[7].setAngle(tippingPlateAngle.h);
    tippingPlateBodies[8].setAngle(tippingPlateAngle.i);
    tippingPlateBodies[9].setAngle(tippingPlateAngle.j);
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

  for (let i = 0; i < 10; i++) {
    document.getElementById(`tippingPlate${i + 1}AngleRad`).textContent = util.displayRound(angles[i]);
    document.getElementById(`tippingPlate${i + 1}AngleDeg`).textContent = util.displayRound(util.radToDeg(angles[i]));
  }

  // 計算
  let tmpx = 0,
    tmpy = 0,
    tmpz = 0,
    tmpw = 0,
    tmpu = 0,
    tmpv = 0,
    tmpt = 0,
    tmps = 0,
    tmpr = 0;
  if (angles[9] != 0) {
    tmpx = Math.sin(angles[0]) / Math.sin(angles[9]);
    tmpy = Math.sin(angles[1]) / Math.sin(angles[9]);
    tmpz = Math.sin(angles[2]) / Math.sin(angles[9]);
    tmpw = Math.sin(angles[3]) / Math.sin(angles[9]);
    tmpu = Math.sin(angles[4]) / Math.sin(angles[9]);
    tmpv = Math.sin(angles[5]) / Math.sin(angles[9]);
    tmpt = Math.sin(angles[6]) / Math.sin(angles[9]);
    tmps = Math.sin(angles[7]) / Math.sin(angles[9]);
    tmpr = Math.sin(angles[8]) / Math.sin(angles[9]);
  }
  document.getElementById("x").textContent = tmpx;
  document.getElementById("y").textContent = tmpy;
  document.getElementById("z").textContent = tmpz;
  document.getElementById("w").textContent = tmpw;
  document.getElementById("u").textContent = tmpu;
  document.getElementById("v").textContent = tmpv;
  document.getElementById("t").textContent = tmpt;
  document.getElementById("s").textContent = tmps;
  document.getElementById("r").textContent = tmpr;

  // 各種座標の計算結果を格納する配列
  let x00Arr = [],
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
    y05Arr = [],
    x06Arr = [],
    y06Arr = [],
    x07Arr = [],
    y07Arr = [],
    x08Arr = [],
    y08Arr = [],
    x09Arr = [],
    y09Arr = [];
  let x10Arr = [],
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
    y15Arr = [],
    x16Arr = [],
    y16Arr = [],
    x17Arr = [],
    y17Arr = [],
    x18Arr = [],
    y18Arr = [],
    x19Arr = [],
    y19Arr = [];
  let x20Arr = [],
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
    y25Arr = [],
    x26Arr = [],
    y26Arr = [],
    x27Arr = [],
    y27Arr = [],
    x28Arr = [],
    y28Arr = [],
    x29Arr = [],
    y29Arr = [];
  let x30Arr = [],
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
    y35Arr = [],
    x36Arr = [],
    y36Arr = [],
    x37Arr = [],
    y37Arr = [],
    x38Arr = [],
    y38Arr = [],
    x39Arr = [],
    y39Arr = [];
  let x40Arr = [],
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
    y45Arr = [],
    x46Arr = [],
    y46Arr = [],
    x47Arr = [],
    y47Arr = [],
    x48Arr = [],
    y48Arr = [],
    x49Arr = [],
    y49Arr = [];
  let x50Arr = [],
    y50Arr = [],
    x51Arr = [],
    y51Arr = [],
    x52Arr = [],
    y52Arr = [],
    x53Arr = [],
    y53Arr = [],
    x54Arr = [],
    y54Arr = [],
    x55Arr = [],
    y55Arr = [],
    x56Arr = [],
    y56Arr = [],
    x57Arr = [],
    y57Arr = [],
    x58Arr = [],
    y58Arr = [],
    x59Arr = [],
    y59Arr = [];
  let x60Arr = [],
    y60Arr = [],
    x61Arr = [],
    y61Arr = [],
    x62Arr = [],
    y62Arr = [],
    x63Arr = [],
    y63Arr = [],
    x64Arr = [],
    y64Arr = [],
    x65Arr = [],
    y65Arr = [],
    x66Arr = [],
    y66Arr = [],
    x67Arr = [],
    y67Arr = [],
    x68Arr = [],
    y68Arr = [],
    x69Arr = [],
    y69Arr = [];
  let x70Arr = [],
    y70Arr = [],
    x71Arr = [],
    y71Arr = [],
    x72Arr = [],
    y72Arr = [],
    x73Arr = [],
    y73Arr = [],
    x74Arr = [],
    y74Arr = [],
    x75Arr = [],
    y75Arr = [],
    x76Arr = [],
    y76Arr = [],
    x77Arr = [],
    y77Arr = [],
    x78Arr = [],
    y78Arr = [],
    x79Arr = [],
    y79Arr = [];
  let x80Arr = [],
    y80Arr = [],
    x81Arr = [],
    y81Arr = [],
    x82Arr = [],
    y82Arr = [],
    x83Arr = [],
    y83Arr = [],
    x84Arr = [],
    y84Arr = [],
    x85Arr = [],
    y85Arr = [],
    x86Arr = [],
    y86Arr = [],
    x87Arr = [],
    y87Arr = [],
    x88Arr = [],
    y88Arr = [],
    x89Arr = [],
    y89Arr = [];

  // 読み取り線の描画
  drawer.drawDashedLine(0, topTippingPlateYPositions[0], canvas.width, topTippingPlateYPositions[0]);
  drawer.drawDashedLine(0, bottomTippingPlateYPositions[0], canvas.width, bottomTippingPlateYPositions[0]);

  // 折り返し線の描画
  drawer.drawDashedLine(0, turnBackPointYPos, canvas.width, turnBackPointYPos);

  // ボディ（線）の描画と関連する座標の計算
  tippingPlateBodies.forEach(function (body, index) {
    let pos = body.getPosition();
    let angle = body.getAngle();

    // ティッピングプレートの描画
    context.save();
    drawer.drawTippingPlate(pos.x, pos.y, angle, tippingPlateLength);
    context.restore();

    // 各種座標の計算
    if (index === 0) {
      let x00 = pos.x + coef[0].a * Math.cos(angle);
      let y00 = pos.y + coef[0].a * Math.sin(angle);
      let x10 = pos.x + coef[1].a * Math.cos(angle);
      let y10 = pos.y + coef[1].a * Math.sin(angle);
      let x20 = pos.x + coef[2].a * Math.cos(angle);
      let y20 = pos.y + coef[2].a * Math.sin(angle);
      let x30 = pos.x + coef[3].a * Math.cos(angle);
      let y30 = pos.y + coef[3].a * Math.sin(angle);
      let x40 = pos.x + coef[4].a * Math.cos(angle);
      let y40 = pos.y + coef[4].a * Math.sin(angle);
      let x50 = pos.x + coef[5].a * Math.cos(angle);
      let y50 = pos.y + coef[5].a * Math.sin(angle);
      let x60 = pos.x + coef[6].a * Math.cos(angle);
      let y60 = pos.y + coef[6].a * Math.sin(angle);
      let x70 = pos.x + coef[7].a * Math.cos(angle);
      let y70 = pos.y + coef[7].a * Math.sin(angle);
      let x80 = pos.x + coef[8].a * Math.cos(angle);
      let y80 = pos.y + coef[8].a * Math.sin(angle);
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
      x50Arr.push(x50);
      y50Arr.push(y50);
      x60Arr.push(x60);
      y60Arr.push(y60);
      x70Arr.push(x70);
      y70Arr.push(y70);
      x80Arr.push(x80);
      y80Arr.push(y80);
    } else if (index === 1) {
      let x01 = pos.x + coef[0].b * Math.cos(angle);
      let y01 = pos.y + coef[0].b * Math.sin(angle);
      let x11 = pos.x + coef[1].b * Math.cos(angle);
      let y11 = pos.y + coef[1].b * Math.sin(angle);
      let x21 = pos.x + coef[2].b * Math.cos(angle);
      let y21 = pos.y + coef[2].b * Math.sin(angle);
      let x31 = pos.x + coef[3].b * Math.cos(angle);
      let y31 = pos.y + coef[3].b * Math.sin(angle);
      let x41 = pos.x + coef[4].b * Math.cos(angle);
      let y41 = pos.y + coef[4].b * Math.sin(angle);
      let x51 = pos.x + coef[5].b * Math.cos(angle);
      let y51 = pos.y + coef[5].b * Math.sin(angle);
      let x61 = pos.x + coef[6].b * Math.cos(angle);
      let y61 = pos.y + coef[6].b * Math.sin(angle);
      let x71 = pos.x + coef[7].b * Math.cos(angle);
      let y71 = pos.y + coef[7].b * Math.sin(angle);
      let x81 = pos.x + coef[8].b * Math.cos(angle);
      let y81 = pos.y + coef[8].b * Math.sin(angle);
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
      x51Arr.push(x51);
      y51Arr.push(y51);
      x61Arr.push(x61);
      y61Arr.push(y61);
      x71Arr.push(x71);
      y71Arr.push(y71);
      x81Arr.push(x81);
      y81Arr.push(y81);
    } else if (index === 2) {
      let x02 = pos.x + coef[0].c * Math.cos(angle);
      let y02 = pos.y + coef[0].c * Math.sin(angle);
      let x12 = pos.x + coef[1].c * Math.cos(angle);
      let y12 = pos.y + coef[1].c * Math.sin(angle);
      let x22 = pos.x + coef[2].c * Math.cos(angle);
      let y22 = pos.y + coef[2].c * Math.sin(angle);
      let x32 = pos.x + coef[3].c * Math.cos(angle);
      let y32 = pos.y + coef[3].c * Math.sin(angle);
      let x42 = pos.x + coef[4].c * Math.cos(angle);
      let y42 = pos.y + coef[4].c * Math.sin(angle);
      let x52 = pos.x + coef[5].c * Math.cos(angle);
      let y52 = pos.y + coef[5].c * Math.sin(angle);
      let x62 = pos.x + coef[6].c * Math.cos(angle);
      let y62 = pos.y + coef[6].c * Math.sin(angle);
      let x72 = pos.x + coef[7].c * Math.cos(angle);
      let y72 = pos.y + coef[7].c * Math.sin(angle);
      let x82 = pos.x + coef[8].c * Math.cos(angle);
      let y82 = pos.y + coef[8].c * Math.sin(angle);
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
      x52Arr.push(x52);
      y52Arr.push(y52);
      x62Arr.push(x62);
      y62Arr.push(y62);
      x72Arr.push(x72);
      y72Arr.push(y72);
      x82Arr.push(x82);
      y82Arr.push(y82);
    } else if (index === 3) {
      let x03 = pos.x + coef[0].d * Math.cos(angle);
      let y03 = pos.y + coef[0].d * Math.sin(angle);
      let x13 = pos.x + coef[1].d * Math.cos(angle);
      let y13 = pos.y + coef[1].d * Math.sin(angle);
      let x23 = pos.x + coef[2].d * Math.cos(angle);
      let y23 = pos.y + coef[2].d * Math.sin(angle);
      let x33 = pos.x + coef[3].d * Math.cos(angle);
      let y33 = pos.y + coef[3].d * Math.sin(angle);
      let x43 = pos.x + coef[4].d * Math.cos(angle);
      let y43 = pos.y + coef[4].d * Math.sin(angle);
      let x53 = pos.x + coef[5].d * Math.cos(angle);
      let y53 = pos.y + coef[5].d * Math.sin(angle);
      let x63 = pos.x + coef[6].d * Math.cos(angle);
      let y63 = pos.y + coef[6].d * Math.sin(angle);
      let x73 = pos.x + coef[7].d * Math.cos(angle);
      let y73 = pos.y + coef[7].d * Math.sin(angle);
      let x83 = pos.x + coef[8].d * Math.cos(angle);
      let y83 = pos.y + coef[8].d * Math.sin(angle);
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
      x53Arr.push(x53);
      y53Arr.push(y53);
      x63Arr.push(x63);
      y63Arr.push(y63);
      x73Arr.push(x73);
      y73Arr.push(y73);
      x83Arr.push(x83);
      y83Arr.push(y83);
    } else if (index === 4) {
      let x04 = pos.x + coef[0].e * Math.cos(angle);
      let y04 = pos.y + coef[0].e * Math.sin(angle);
      let x14 = pos.x + coef[1].e * Math.cos(angle);
      let y14 = pos.y + coef[1].e * Math.sin(angle);
      let x24 = pos.x + coef[2].e * Math.cos(angle);
      let y24 = pos.y + coef[2].e * Math.sin(angle);
      let x34 = pos.x + coef[3].e * Math.cos(angle);
      let y34 = pos.y + coef[3].e * Math.sin(angle);
      let x44 = pos.x + coef[4].e * Math.cos(angle);
      let y44 = pos.y + coef[4].e * Math.sin(angle);
      let x54 = pos.x + coef[5].e * Math.cos(angle);
      let y54 = pos.y + coef[5].e * Math.sin(angle);
      let x64 = pos.x + coef[6].e * Math.cos(angle);
      let y64 = pos.y + coef[6].e * Math.sin(angle);
      let x74 = pos.x + coef[7].e * Math.cos(angle);
      let y74 = pos.y + coef[7].e * Math.sin(angle);
      let x84 = pos.x + coef[8].e * Math.cos(angle);
      let y84 = pos.y + coef[8].e * Math.sin(angle);
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
      x54Arr.push(x54);
      y54Arr.push(y54);
      x64Arr.push(x64);
      y64Arr.push(y64);
      x74Arr.push(x74);
      y74Arr.push(y74);
      x84Arr.push(x84);
      y84Arr.push(y84);
    } else if (index === 5) {
      let x05 = pos.x + coef[0].f * Math.cos(angle);
      let y05 = pos.y + coef[0].f * Math.sin(angle);
      let x15 = pos.x + coef[1].f * Math.cos(angle);
      let y15 = pos.y + coef[1].f * Math.sin(angle);
      let x25 = pos.x + coef[2].f * Math.cos(angle);
      let y25 = pos.y + coef[2].f * Math.sin(angle);
      let x35 = pos.x + coef[3].f * Math.cos(angle);
      let y35 = pos.y + coef[3].f * Math.sin(angle);
      let x45 = pos.x + coef[4].f * Math.cos(angle);
      let y45 = pos.y + coef[4].f * Math.sin(angle);
      let x55 = pos.x + coef[5].f * Math.cos(angle);
      let y55 = pos.y + coef[5].f * Math.sin(angle);
      let x65 = pos.x + coef[6].f * Math.cos(angle);
      let y65 = pos.y + coef[6].f * Math.sin(angle);
      let x75 = pos.x + coef[7].f * Math.cos(angle);
      let y75 = pos.y + coef[7].f * Math.sin(angle);
      let x85 = pos.x + coef[8].f * Math.cos(angle);
      let y85 = pos.y + coef[8].f * Math.sin(angle);
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
      x55Arr.push(x55);
      y55Arr.push(y55);
      x65Arr.push(x65);
      y65Arr.push(y65);
      x75Arr.push(x75);
      y75Arr.push(y75);
      x85Arr.push(x85);
      y85Arr.push(y85);
    } else if (index === 6) {
      let x06 = pos.x + coef[0].g * Math.cos(angle);
      let y06 = pos.y + coef[0].g * Math.sin(angle);
      let x16 = pos.x + coef[1].g * Math.cos(angle);
      let y16 = pos.y + coef[1].g * Math.sin(angle);
      let x26 = pos.x + coef[2].g * Math.cos(angle);
      let y26 = pos.y + coef[2].g * Math.sin(angle);
      let x36 = pos.x + coef[3].g * Math.cos(angle);
      let y36 = pos.y + coef[3].g * Math.sin(angle);
      let x46 = pos.x + coef[4].g * Math.cos(angle);
      let y46 = pos.y + coef[4].g * Math.sin(angle);
      let x56 = pos.x + coef[5].g * Math.cos(angle);
      let y56 = pos.y + coef[5].g * Math.sin(angle);
      let x66 = pos.x + coef[6].g * Math.cos(angle);
      let y66 = pos.y + coef[6].g * Math.sin(angle);
      let x76 = pos.x + coef[7].g * Math.cos(angle);
      let y76 = pos.y + coef[7].g * Math.sin(angle);
      let x86 = pos.x + coef[8].g * Math.cos(angle);
      let y86 = pos.y + coef[8].g * Math.sin(angle);
      x06Arr.push(x06);
      y06Arr.push(y06);
      x16Arr.push(x16);
      y16Arr.push(y16);
      x26Arr.push(x26);
      y26Arr.push(y26);
      x36Arr.push(x36);
      y36Arr.push(y36);
      x46Arr.push(x46);
      y46Arr.push(y46);
      x56Arr.push(x56);
      y56Arr.push(y56);
      x66Arr.push(x66);
      y66Arr.push(y66);
      x76Arr.push(x76);
      y76Arr.push(y76);
      x86Arr.push(x86);
      y86Arr.push(y86);
    } else if (index === 7) {
      let x07 = pos.x + coef[0].h * Math.cos(angle);
      let y07 = pos.y + coef[0].h * Math.sin(angle);
      let x17 = pos.x + coef[1].h * Math.cos(angle);
      let y17 = pos.y + coef[1].h * Math.sin(angle);
      let x27 = pos.x + coef[2].h * Math.cos(angle);
      let y27 = pos.y + coef[2].h * Math.sin(angle);
      let x37 = pos.x + coef[3].h * Math.cos(angle);
      let y37 = pos.y + coef[3].h * Math.sin(angle);
      let x47 = pos.x + coef[4].h * Math.cos(angle);
      let y47 = pos.y + coef[4].h * Math.sin(angle);
      let x57 = pos.x + coef[5].h * Math.cos(angle);
      let y57 = pos.y + coef[5].h * Math.sin(angle);
      let x67 = pos.x + coef[6].h * Math.cos(angle);
      let y67 = pos.y + coef[6].h * Math.sin(angle);
      let x77 = pos.x + coef[7].h * Math.cos(angle);
      let y77 = pos.y + coef[7].h * Math.sin(angle);
      let x87 = pos.x + coef[8].h * Math.cos(angle);
      let y87 = pos.y + coef[8].h * Math.sin(angle);
      x07Arr.push(x07);
      y07Arr.push(y07);
      x17Arr.push(x17);
      y17Arr.push(y17);
      x27Arr.push(x27);
      y27Arr.push(y27);
      x37Arr.push(x37);
      y37Arr.push(y37);
      x47Arr.push(x47);
      y47Arr.push(y47);
      x57Arr.push(x57);
      y57Arr.push(y57);
      x67Arr.push(x67);
      y67Arr.push(y67);
      x77Arr.push(x77);
      y77Arr.push(y77);
      x87Arr.push(x87);
      y87Arr.push(y87);
    } else if (index === 8) {
      let x08 = pos.x + coef[0].i * Math.cos(angle);
      let y08 = pos.y + coef[0].i * Math.sin(angle);
      let x18 = pos.x + coef[1].i * Math.cos(angle);
      let y18 = pos.y + coef[1].i * Math.sin(angle);
      let x28 = pos.x + coef[2].i * Math.cos(angle);
      let y28 = pos.y + coef[2].i * Math.sin(angle);
      let x38 = pos.x + coef[3].i * Math.cos(angle);
      let y38 = pos.y + coef[3].i * Math.sin(angle);
      let x48 = pos.x + coef[4].i * Math.cos(angle);
      let y48 = pos.y + coef[4].i * Math.sin(angle);
      let x58 = pos.x + coef[5].i * Math.cos(angle);
      let y58 = pos.y + coef[5].i * Math.sin(angle);
      let x68 = pos.x + coef[6].i * Math.cos(angle);
      let y68 = pos.y + coef[6].i * Math.sin(angle);
      let x78 = pos.x + coef[7].i * Math.cos(angle);
      let y78 = pos.y + coef[7].i * Math.sin(angle);
      let x88 = pos.x + coef[8].i * Math.cos(angle);
      let y88 = pos.y + coef[8].i * Math.sin(angle);
      x08Arr.push(x08);
      y08Arr.push(y08);
      x18Arr.push(x18);
      y18Arr.push(y18);
      x28Arr.push(x28);
      y28Arr.push(y28);
      x38Arr.push(x38);
      y38Arr.push(y38);
      x48Arr.push(x48);
      y48Arr.push(y48);
      x58Arr.push(x58);
      y58Arr.push(y58);
      x68Arr.push(x68);
      y68Arr.push(y68);
      x78Arr.push(x78);
      y78Arr.push(y78);
      x88Arr.push(x88);
      y88Arr.push(y88);
    } else if (index === 9) {
      let x09 = pos.x + coef[0].j * Math.cos(angle);
      let y09 = pos.y + coef[0].j * Math.sin(angle);
      let x19 = pos.x + coef[1].j * Math.cos(angle);
      let y19 = pos.y + coef[1].j * Math.sin(angle);
      let x29 = pos.x + coef[2].j * Math.cos(angle);
      let y29 = pos.y + coef[2].j * Math.sin(angle);
      let x39 = pos.x + coef[3].j * Math.cos(angle);
      let y39 = pos.y + coef[3].j * Math.sin(angle);
      let x49 = pos.x + coef[4].j * Math.cos(angle);
      let y49 = pos.y + coef[4].j * Math.sin(angle);
      let x59 = pos.x + coef[5].j * Math.cos(angle);
      let y59 = pos.y + coef[5].j * Math.sin(angle);
      let x69 = pos.x + coef[6].j * Math.cos(angle);
      let y69 = pos.y + coef[6].j * Math.sin(angle);
      let x79 = pos.x + coef[7].j * Math.cos(angle);
      let y79 = pos.y + coef[7].j * Math.sin(angle);
      let x89 = pos.x + coef[8].j * Math.cos(angle);
      let y89 = pos.y + coef[8].j * Math.sin(angle);
      x09Arr.push(x09);
      y09Arr.push(y09);
      x19Arr.push(x19);
      y19Arr.push(y19);
      x29Arr.push(x29);
      y29Arr.push(y29);
      x39Arr.push(x39);
      y39Arr.push(y39);
      x49Arr.push(x49);
      y49Arr.push(y49);
      x59Arr.push(x59);
      y59Arr.push(y59);
      x69Arr.push(x69);
      y69Arr.push(y69);
      x79Arr.push(x79);
      y79Arr.push(y79);
      x89Arr.push(x89);
      y89Arr.push(y89);
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
  drawer.drawPuryForFirstTape(x06Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x06Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x07Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x07Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x08Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x08Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x09Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawPuryForFirstTape(x09Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos - 6);
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
  drawer.drawPuryForFirstTape(x06Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(x06Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(x07Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(x07Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(x08Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(x08Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(x09Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(x09Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawPuryForFirstTape(fixedPuryXPos["first"] + 6, TapeTopYPos["first"] + 6);
  drawer.drawPuryForFirstTape(fixedPuryXPos["first"] + 6, TapeBottomYPos["first"] - 6);

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
  drawer.drawPuryForSecondTape(x16Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x16Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x17Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x17Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x18Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x18Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x19Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawPuryForSecondTape(x19Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos - 6);
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
  drawer.drawPuryForSecondTape(x16Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(x16Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(x17Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(x17Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(x18Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(x18Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(x19Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(x19Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawPuryForSecondTape(fixedPuryXPos["second"] + 6, TapeTopYPos["second"] + 6);
  drawer.drawPuryForSecondTape(fixedPuryXPos["second"] + 6, TapeBottomYPos["second"] - 6);

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
  drawer.drawPuryForThirdTape(x26Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x26Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x27Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x27Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x28Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x28Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x29Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawPuryForThirdTape(x29Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos - 6);
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
  drawer.drawPuryForThirdTape(x26Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(x26Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(x27Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(x27Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(x28Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(x28Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(x29Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(x29Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawPuryForThirdTape(fixedPuryXPos["third"] + 6, TapeTopYPos["third"] + 6);
  drawer.drawPuryForThirdTape(fixedPuryXPos["third"] + 6, TapeBottomYPos["third"] - 6);

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
  drawer.drawPuryForFourthTape(x36Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x36Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x37Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x37Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x38Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x38Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x39Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFourthTape(x39Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
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
  drawer.drawPuryForFourthTape(x36Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(x36Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(x37Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(x37Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(x38Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(x38Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(x39Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(x39Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFourthTape(fixedPuryXPos["fourth"] + 6, TapeTopYPos["fourth"] + 6);
  drawer.drawPuryForFourthTape(fixedPuryXPos["fourth"] + 6, TapeBottomYPos["fourth"] - 6);

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
  drawer.drawPuryForFifthTape(x46Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x46Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x47Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x47Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x48Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x48Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x49Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawPuryForFifthTape(x49Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
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
  drawer.drawPuryForFifthTape(x46Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(x46Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(x47Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(x47Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(x48Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(x48Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(x49Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(x49Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawPuryForFifthTape(fixedPuryXPos["fifth"] + 6, TapeTopYPos["fifth"] + 6);
  drawer.drawPuryForFifthTape(fixedPuryXPos["fifth"] + 6, TapeBottomYPos["fifth"] - 6);

  // 6番目のテープに対する滑車
  drawer.drawPuryForSixthTape(x50Arr[0] - 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x50Arr[0] + 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x51Arr[0] - 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x51Arr[0] + 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x52Arr[0] - 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x52Arr[0] + 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x53Arr[0] - 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x53Arr[0] + 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x54Arr[0] - 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x54Arr[0] + 12, TapeBottomYPos["sixth"] - 6);
  drawer.drawPuryForSixthTape(x55Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x55Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x56Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x56Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x57Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x57Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x58Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x58Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x59Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x59Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawPuryForSixthTape(x50Arr[0] - 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x50Arr[0] + 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x51Arr[0] - 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x51Arr[0] + 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x52Arr[0] - 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x52Arr[0] + 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x53Arr[0] - 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x53Arr[0] + 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x54Arr[0] - 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x54Arr[0] + 12, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(x55Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x55Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x56Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x56Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x57Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x57Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x58Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x58Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x59Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(x59Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawPuryForSixthTape(fixedPuryXPos["sixth"] + 6, TapeTopYPos["sixth"] + 6);
  drawer.drawPuryForSixthTape(fixedPuryXPos["sixth"] + 6, TapeBottomYPos["sixth"] - 6);

  // 7番目のテープに対する滑車
  drawer.drawPuryForSeventhTape(x60Arr[0] - 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x60Arr[0] + 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x61Arr[0] - 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x61Arr[0] + 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x62Arr[0] - 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x62Arr[0] + 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x63Arr[0] - 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x63Arr[0] + 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x64Arr[0] - 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x64Arr[0] + 12, TapeBottomYPos["seventh"] - 6);
  drawer.drawPuryForSeventhTape(x65Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x65Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x66Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x66Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x67Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x67Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x68Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x68Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x69Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x69Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawPuryForSeventhTape(x60Arr[0] - 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x60Arr[0] + 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x61Arr[0] - 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x61Arr[0] + 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x62Arr[0] - 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x62Arr[0] + 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x63Arr[0] - 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x63Arr[0] + 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x64Arr[0] - 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x64Arr[0] + 12, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(x65Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x65Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x66Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x66Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x67Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x67Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x68Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x68Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x69Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(x69Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawPuryForSeventhTape(fixedPuryXPos["seventh"] + 6, TapeTopYPos["seventh"] + 6);
  drawer.drawPuryForSeventhTape(fixedPuryXPos["seventh"] + 6, TapeBottomYPos["seventh"] - 6);

  // 8番目のテープに対する滑車
  drawer.drawPuryForEighthTape(x70Arr[0] - 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x70Arr[0] + 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x71Arr[0] - 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x71Arr[0] + 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x72Arr[0] - 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x72Arr[0] + 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x73Arr[0] - 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x73Arr[0] + 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x74Arr[0] - 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x74Arr[0] + 12, TapeBottomYPos["eighth"] - 6);
  drawer.drawPuryForEighthTape(x75Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x75Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x76Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x76Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x77Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x77Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x78Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x78Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x79Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x79Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawPuryForEighthTape(x70Arr[0] - 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x70Arr[0] + 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x71Arr[0] - 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x71Arr[0] + 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x72Arr[0] - 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x72Arr[0] + 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x73Arr[0] - 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x73Arr[0] + 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x74Arr[0] - 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x74Arr[0] + 12, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(x75Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x75Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x76Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x76Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x77Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x77Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x78Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x78Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x79Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(x79Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawPuryForEighthTape(fixedPuryXPos["eighth"] + 6, TapeTopYPos["eighth"] + 6);
  drawer.drawPuryForEighthTape(fixedPuryXPos["eighth"] + 6, TapeBottomYPos["eighth"] - 6);

  // 9番目のテープに対する滑車
  drawer.drawPuryForNinthTape(x80Arr[0] - 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x80Arr[0] + 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x81Arr[0] - 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x81Arr[0] + 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x82Arr[0] - 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x82Arr[0] + 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x83Arr[0] - 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x83Arr[0] + 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x84Arr[0] - 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x84Arr[0] + 12, TapeBottomYPos["ninth"] - 6);
  drawer.drawPuryForNinthTape(x85Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x85Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x86Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x86Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x87Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x87Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x88Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x88Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x89Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x89Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawPuryForNinthTape(x80Arr[0] - 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x80Arr[0] + 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x81Arr[0] - 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x81Arr[0] + 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x82Arr[0] - 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x82Arr[0] + 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x83Arr[0] - 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x83Arr[0] + 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x84Arr[0] - 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x84Arr[0] + 12, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(x85Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x85Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x86Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x86Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x87Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x87Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x88Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x88Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x89Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(x89Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawPuryForNinthTape(fixedPuryXPos["ninth"] + 6, TapeTopYPos["ninth"] + 6);
  drawer.drawPuryForNinthTape(fixedPuryXPos["ninth"] + 6, TapeBottomYPos["ninth"] - 6);

  // ティッピングプレートに対する滑車
  drawer.drawPuryForTippingPlate(x00Arr[0], y00Arr[0]);
  drawer.drawPuryForTippingPlate(x01Arr[0], y01Arr[0]);
  drawer.drawPuryForTippingPlate(x02Arr[0], y02Arr[0]);
  drawer.drawPuryForTippingPlate(x03Arr[0], y03Arr[0]);
  drawer.drawPuryForTippingPlate(x04Arr[0], y04Arr[0]);
  drawer.drawPuryForTippingPlate(x05Arr[0], y05Arr[0]);
  drawer.drawPuryForTippingPlate(x06Arr[0], y06Arr[0]);
  drawer.drawPuryForTippingPlate(x07Arr[0], y07Arr[0]);
  drawer.drawPuryForTippingPlate(x08Arr[0], y08Arr[0]);
  drawer.drawPuryForTippingPlate(x09Arr[0], y09Arr[0]);
  drawer.drawPuryForTippingPlate(x10Arr[0], y10Arr[0]);
  drawer.drawPuryForTippingPlate(x11Arr[0], y11Arr[0]);
  drawer.drawPuryForTippingPlate(x12Arr[0], y12Arr[0]);
  drawer.drawPuryForTippingPlate(x13Arr[0], y13Arr[0]);
  drawer.drawPuryForTippingPlate(x14Arr[0], y14Arr[0]);
  drawer.drawPuryForTippingPlate(x15Arr[0], y15Arr[0]);
  drawer.drawPuryForTippingPlate(x16Arr[0], y16Arr[0]);
  drawer.drawPuryForTippingPlate(x17Arr[0], y17Arr[0]);
  drawer.drawPuryForTippingPlate(x18Arr[0], y18Arr[0]);
  drawer.drawPuryForTippingPlate(x19Arr[0], y19Arr[0]);
  drawer.drawPuryForTippingPlate(x20Arr[0], y20Arr[0]);
  drawer.drawPuryForTippingPlate(x21Arr[0], y21Arr[0]);
  drawer.drawPuryForTippingPlate(x22Arr[0], y22Arr[0]);
  drawer.drawPuryForTippingPlate(x23Arr[0], y23Arr[0]);
  drawer.drawPuryForTippingPlate(x24Arr[0], y24Arr[0]);
  drawer.drawPuryForTippingPlate(x25Arr[0], y25Arr[0]);
  drawer.drawPuryForTippingPlate(x26Arr[0], y26Arr[0]);
  drawer.drawPuryForTippingPlate(x27Arr[0], y27Arr[0]);
  drawer.drawPuryForTippingPlate(x28Arr[0], y28Arr[0]);
  drawer.drawPuryForTippingPlate(x29Arr[0], y29Arr[0]);
  drawer.drawPuryForTippingPlate(x30Arr[0], y30Arr[0]);
  drawer.drawPuryForTippingPlate(x31Arr[0], y31Arr[0]);
  drawer.drawPuryForTippingPlate(x32Arr[0], y32Arr[0]);
  drawer.drawPuryForTippingPlate(x33Arr[0], y33Arr[0]);
  drawer.drawPuryForTippingPlate(x34Arr[0], y34Arr[0]);
  drawer.drawPuryForTippingPlate(x35Arr[0], y35Arr[0]);
  drawer.drawPuryForTippingPlate(x36Arr[0], y36Arr[0]);
  drawer.drawPuryForTippingPlate(x37Arr[0], y37Arr[0]);
  drawer.drawPuryForTippingPlate(x38Arr[0], y38Arr[0]);
  drawer.drawPuryForTippingPlate(x39Arr[0], y39Arr[0]);
  drawer.drawPuryForTippingPlate(x40Arr[0], y40Arr[0]);
  drawer.drawPuryForTippingPlate(x41Arr[0], y41Arr[0]);
  drawer.drawPuryForTippingPlate(x42Arr[0], y42Arr[0]);
  drawer.drawPuryForTippingPlate(x43Arr[0], y43Arr[0]);
  drawer.drawPuryForTippingPlate(x44Arr[0], y44Arr[0]);
  drawer.drawPuryForTippingPlate(x45Arr[0], y45Arr[0]);
  drawer.drawPuryForTippingPlate(x46Arr[0], y46Arr[0]);
  drawer.drawPuryForTippingPlate(x47Arr[0], y47Arr[0]);
  drawer.drawPuryForTippingPlate(x48Arr[0], y48Arr[0]);
  drawer.drawPuryForTippingPlate(x49Arr[0], y49Arr[0]);
  drawer.drawPuryForTippingPlate(x50Arr[0], y50Arr[0]);
  drawer.drawPuryForTippingPlate(x51Arr[0], y51Arr[0]);
  drawer.drawPuryForTippingPlate(x52Arr[0], y52Arr[0]);
  drawer.drawPuryForTippingPlate(x53Arr[0], y53Arr[0]);
  drawer.drawPuryForTippingPlate(x54Arr[0], y54Arr[0]);
  drawer.drawPuryForTippingPlate(x55Arr[0], y55Arr[0]);
  drawer.drawPuryForTippingPlate(x56Arr[0], y56Arr[0]);
  drawer.drawPuryForTippingPlate(x57Arr[0], y57Arr[0]);
  drawer.drawPuryForTippingPlate(x58Arr[0], y58Arr[0]);
  drawer.drawPuryForTippingPlate(x59Arr[0], y59Arr[0]);
  drawer.drawPuryForTippingPlate(x60Arr[0], y60Arr[0]);
  drawer.drawPuryForTippingPlate(x61Arr[0], y61Arr[0]);
  drawer.drawPuryForTippingPlate(x62Arr[0], y62Arr[0]);
  drawer.drawPuryForTippingPlate(x63Arr[0], y63Arr[0]);
  drawer.drawPuryForTippingPlate(x64Arr[0], y64Arr[0]);
  drawer.drawPuryForTippingPlate(x65Arr[0], y65Arr[0]);
  drawer.drawPuryForTippingPlate(x66Arr[0], y66Arr[0]);
  drawer.drawPuryForTippingPlate(x67Arr[0], y67Arr[0]);
  drawer.drawPuryForTippingPlate(x68Arr[0], y68Arr[0]);
  drawer.drawPuryForTippingPlate(x69Arr[0], y69Arr[0]);
  drawer.drawPuryForTippingPlate(x70Arr[0], y70Arr[0]);
  drawer.drawPuryForTippingPlate(x71Arr[0], y71Arr[0]);
  drawer.drawPuryForTippingPlate(x72Arr[0], y72Arr[0]);
  drawer.drawPuryForTippingPlate(x73Arr[0], y73Arr[0]);
  drawer.drawPuryForTippingPlate(x74Arr[0], y74Arr[0]);
  drawer.drawPuryForTippingPlate(x75Arr[0], y75Arr[0]);
  drawer.drawPuryForTippingPlate(x76Arr[0], y76Arr[0]);
  drawer.drawPuryForTippingPlate(x77Arr[0], y77Arr[0]);
  drawer.drawPuryForTippingPlate(x78Arr[0], y78Arr[0]);
  drawer.drawPuryForTippingPlate(x79Arr[0], y79Arr[0]);
  drawer.drawPuryForTippingPlate(x80Arr[0], y80Arr[0]);
  drawer.drawPuryForTippingPlate(x81Arr[0], y81Arr[0]);
  drawer.drawPuryForTippingPlate(x82Arr[0], y82Arr[0]);
  drawer.drawPuryForTippingPlate(x83Arr[0], y83Arr[0]);
  drawer.drawPuryForTippingPlate(x84Arr[0], y84Arr[0]);
  drawer.drawPuryForTippingPlate(x85Arr[0], y85Arr[0]);
  drawer.drawPuryForTippingPlate(x86Arr[0], y86Arr[0]);
  drawer.drawPuryForTippingPlate(x87Arr[0], y87Arr[0]);
  drawer.drawPuryForTippingPlate(x88Arr[0], y88Arr[0]);
  drawer.drawPuryForTippingPlate(x89Arr[0], y89Arr[0]);

  // 最初のテープを描画
  // 下
  drawer.drawLineForFirstTape(x09Arr[0] + 6, TapeTopYPos["first"] + turnBackPointYPos + 6, x09Arr[0] + 6, y09Arr[0]);
  drawer.drawLineForFirstTape(x09Arr[0] - 6, TapeBottomYPos["first"] + turnBackPointYPos - 6, x09Arr[0] - 6, y09Arr[0]);
  drawer.drawLineForFirstTape(x09Arr[0] + 6, y09Arr[0], x09Arr[0] + 6, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawLineForFirstTape(x09Arr[0] - 6, y09Arr[0], x09Arr[0] - 6, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawLineForFirstTape(fixedPuryXPos["first"] + 6, TapeTopYPos["first"] + turnBackPointYPos, x09Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(fixedPuryXPos["first"] + 6, TapeBottomYPos["first"] + turnBackPointYPos, x09Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x09Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos, x08Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x08Arr[0] + 6, TapeTopYPos["first"] + turnBackPointYPos + 6, x08Arr[0] + 6, y08Arr[0]);
  drawer.drawLineForFirstTape(x08Arr[0] - 6, TapeBottomYPos["first"] + turnBackPointYPos - 6, x08Arr[0] - 6, y08Arr[0]);
  drawer.drawLineForFirstTape(x08Arr[0] + 6, y08Arr[0], x08Arr[0] + 6, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawLineForFirstTape(x08Arr[0] - 6, y08Arr[0], x08Arr[0] - 6, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawLineForFirstTape(x09Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos, x08Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x08Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos, x07Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x07Arr[0] + 6, TapeTopYPos["first"] + turnBackPointYPos + 6, x07Arr[0] + 6, y07Arr[0]);
  drawer.drawLineForFirstTape(x07Arr[0] - 6, TapeBottomYPos["first"] + turnBackPointYPos - 6, x07Arr[0] - 6, y07Arr[0]);
  drawer.drawLineForFirstTape(x07Arr[0] + 6, y07Arr[0], x07Arr[0] + 6, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawLineForFirstTape(x07Arr[0] - 6, y07Arr[0], x07Arr[0] - 6, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawLineForFirstTape(x08Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos, x07Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x07Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos, x06Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x06Arr[0] + 6, TapeTopYPos["first"] + turnBackPointYPos + 6, x06Arr[0] + 6, y06Arr[0]);
  drawer.drawLineForFirstTape(x06Arr[0] - 6, TapeBottomYPos["first"] + turnBackPointYPos - 6, x06Arr[0] - 6, y06Arr[0]);
  drawer.drawLineForFirstTape(x06Arr[0] + 6, y06Arr[0], x06Arr[0] + 6, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawLineForFirstTape(x06Arr[0] - 6, y06Arr[0], x06Arr[0] - 6, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawLineForFirstTape(x07Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos, x06Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x06Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos, x05Arr[0] - 12, TapeBottomYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x05Arr[0] + 6, TapeTopYPos["first"] + turnBackPointYPos + 6, x05Arr[0] + 6, y05Arr[0]);
  drawer.drawLineForFirstTape(x05Arr[0] - 6, TapeBottomYPos["first"] + turnBackPointYPos - 6, x05Arr[0] - 6, y05Arr[0]);
  drawer.drawLineForFirstTape(x05Arr[0] + 6, y05Arr[0], x05Arr[0] + 6, TapeBottomYPos["first"] + turnBackPointYPos - 6);
  drawer.drawLineForFirstTape(x05Arr[0] - 6, y05Arr[0], x05Arr[0] - 6, TapeTopYPos["first"] + turnBackPointYPos + 6);
  drawer.drawLineForFirstTape(x06Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos, x05Arr[0] - 12, TapeTopYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x05Arr[0] + 12, TapeBottomYPos["first"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["first"] + turnBackPointYPos);
  drawer.drawLineForFirstTape(x05Arr[0] + 12, TapeTopYPos["first"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["first"] + turnBackPointYPos);
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
  // 下
  drawer.drawLineForSecondTape(x19Arr[0] + 6, TapeTopYPos["second"] + turnBackPointYPos + 6, x19Arr[0] + 6, y19Arr[0]);
  drawer.drawLineForSecondTape(x19Arr[0] - 6, TapeBottomYPos["second"] + turnBackPointYPos - 6, x19Arr[0] - 6, y19Arr[0]);
  drawer.drawLineForSecondTape(x19Arr[0] + 6, y19Arr[0], x19Arr[0] + 6, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawLineForSecondTape(x19Arr[0] - 6, y19Arr[0], x19Arr[0] - 6, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawLineForSecondTape(fixedPuryXPos["second"] + 6, TapeTopYPos["second"] + turnBackPointYPos, x19Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(fixedPuryXPos["second"] + 6, TapeBottomYPos["second"] + turnBackPointYPos, x19Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x19Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos, x18Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x18Arr[0] + 6, TapeTopYPos["second"] + turnBackPointYPos + 6, x18Arr[0] + 6, y18Arr[0]);
  drawer.drawLineForSecondTape(x18Arr[0] - 6, TapeBottomYPos["second"] + turnBackPointYPos - 6, x18Arr[0] - 6, y18Arr[0]);
  drawer.drawLineForSecondTape(x18Arr[0] + 6, y18Arr[0], x18Arr[0] + 6, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawLineForSecondTape(x18Arr[0] - 6, y18Arr[0], x18Arr[0] - 6, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawLineForSecondTape(x19Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos, x18Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x18Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos, x17Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x17Arr[0] + 6, TapeTopYPos["second"] + turnBackPointYPos + 6, x17Arr[0] + 6, y17Arr[0]);
  drawer.drawLineForSecondTape(x17Arr[0] - 6, TapeBottomYPos["second"] + turnBackPointYPos - 6, x17Arr[0] - 6, y17Arr[0]);
  drawer.drawLineForSecondTape(x17Arr[0] + 6, y17Arr[0], x17Arr[0] + 6, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawLineForSecondTape(x17Arr[0] - 6, y17Arr[0], x17Arr[0] - 6, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawLineForSecondTape(x18Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos, x17Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x17Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos, x16Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x16Arr[0] + 6, TapeTopYPos["second"] + turnBackPointYPos + 6, x16Arr[0] + 6, y16Arr[0]);
  drawer.drawLineForSecondTape(x16Arr[0] - 6, TapeBottomYPos["second"] + turnBackPointYPos - 6, x16Arr[0] - 6, y16Arr[0]);
  drawer.drawLineForSecondTape(x16Arr[0] + 6, y16Arr[0], x16Arr[0] + 6, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawLineForSecondTape(x16Arr[0] - 6, y16Arr[0], x16Arr[0] - 6, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawLineForSecondTape(x17Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos, x16Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x16Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos, x15Arr[0] - 12, TapeBottomYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x15Arr[0] + 6, TapeTopYPos["second"] + turnBackPointYPos + 6, x15Arr[0] + 6, y15Arr[0]);
  drawer.drawLineForSecondTape(x15Arr[0] - 6, TapeBottomYPos["second"] + turnBackPointYPos - 6, x15Arr[0] - 6, y15Arr[0]);
  drawer.drawLineForSecondTape(x15Arr[0] + 6, y15Arr[0], x15Arr[0] + 6, TapeBottomYPos["second"] + turnBackPointYPos - 6);
  drawer.drawLineForSecondTape(x15Arr[0] - 6, y15Arr[0], x15Arr[0] - 6, TapeTopYPos["second"] + turnBackPointYPos + 6);
  drawer.drawLineForSecondTape(x16Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos, x15Arr[0] - 12, TapeTopYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x15Arr[0] + 12, TapeBottomYPos["second"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["second"] + turnBackPointYPos);
  drawer.drawLineForSecondTape(x15Arr[0] + 12, TapeTopYPos["second"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["second"] + turnBackPointYPos);
  // 上
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
  drawer.drawLineForThirdTape(x29Arr[0] + 6, TapeTopYPos["third"] + turnBackPointYPos + 6, x29Arr[0] + 6, y29Arr[0]);
  drawer.drawLineForThirdTape(x29Arr[0] - 6, TapeBottomYPos["third"] + turnBackPointYPos - 6, x29Arr[0] - 6, y29Arr[0]);
  drawer.drawLineForThirdTape(x29Arr[0] + 6, y29Arr[0], x29Arr[0] + 6, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawLineForThirdTape(x29Arr[0] - 6, y29Arr[0], x29Arr[0] - 6, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawLineForThirdTape(fixedPuryXPos["third"] + 6, TapeTopYPos["third"] + turnBackPointYPos, x29Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(fixedPuryXPos["third"] + 6, TapeBottomYPos["third"] + turnBackPointYPos, x29Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x29Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos, x28Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x28Arr[0] + 6, TapeTopYPos["third"] + turnBackPointYPos + 6, x28Arr[0] + 6, y28Arr[0]);
  drawer.drawLineForThirdTape(x28Arr[0] - 6, TapeBottomYPos["third"] + turnBackPointYPos - 6, x28Arr[0] - 6, y28Arr[0]);
  drawer.drawLineForThirdTape(x28Arr[0] + 6, y28Arr[0], x28Arr[0] + 6, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawLineForThirdTape(x28Arr[0] - 6, y28Arr[0], x28Arr[0] - 6, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawLineForThirdTape(x29Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos, x28Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x28Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos, x27Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x27Arr[0] + 6, TapeTopYPos["third"] + turnBackPointYPos + 6, x27Arr[0] + 6, y27Arr[0]);
  drawer.drawLineForThirdTape(x27Arr[0] - 6, TapeBottomYPos["third"] + turnBackPointYPos - 6, x27Arr[0] - 6, y27Arr[0]);
  drawer.drawLineForThirdTape(x27Arr[0] + 6, y27Arr[0], x27Arr[0] + 6, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawLineForThirdTape(x27Arr[0] - 6, y27Arr[0], x27Arr[0] - 6, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawLineForThirdTape(x28Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos, x27Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x27Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos, x26Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x26Arr[0] + 6, TapeTopYPos["third"] + turnBackPointYPos + 6, x26Arr[0] + 6, y26Arr[0]);
  drawer.drawLineForThirdTape(x26Arr[0] - 6, TapeBottomYPos["third"] + turnBackPointYPos - 6, x26Arr[0] - 6, y26Arr[0]);
  drawer.drawLineForThirdTape(x26Arr[0] + 6, y26Arr[0], x26Arr[0] + 6, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawLineForThirdTape(x26Arr[0] - 6, y26Arr[0], x26Arr[0] - 6, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawLineForThirdTape(x27Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos, x26Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x26Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos, x25Arr[0] - 12, TapeBottomYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x25Arr[0] + 6, TapeTopYPos["third"] + turnBackPointYPos + 6, x25Arr[0] + 6, y25Arr[0]);
  drawer.drawLineForThirdTape(x25Arr[0] - 6, TapeBottomYPos["third"] + turnBackPointYPos - 6, x25Arr[0] - 6, y25Arr[0]);
  drawer.drawLineForThirdTape(x25Arr[0] + 6, y25Arr[0], x25Arr[0] + 6, TapeBottomYPos["third"] + turnBackPointYPos - 6);
  drawer.drawLineForThirdTape(x25Arr[0] - 6, y25Arr[0], x25Arr[0] - 6, TapeTopYPos["third"] + turnBackPointYPos + 6);
  drawer.drawLineForThirdTape(x26Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos, x25Arr[0] - 12, TapeTopYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x25Arr[0] + 12, TapeBottomYPos["third"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["third"] + turnBackPointYPos);
  drawer.drawLineForThirdTape(x25Arr[0] + 12, TapeTopYPos["third"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["third"] + turnBackPointYPos);
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
  drawer.drawLineForFourthTape(x39Arr[0] + 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6, x39Arr[0] + 6, y39Arr[0]);
  drawer.drawLineForFourthTape(x39Arr[0] - 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6, x39Arr[0] - 6, y39Arr[0]);
  drawer.drawLineForFourthTape(x39Arr[0] + 6, y39Arr[0], x39Arr[0] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawLineForFourthTape(x39Arr[0] - 6, y39Arr[0], x39Arr[0] - 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawLineForFourthTape(fixedPuryXPos["fourth"] + 6, TapeTopYPos["fourth"] + turnBackPointYPos, x39Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(fixedPuryXPos["fourth"] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos, x39Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x39Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos, x38Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x38Arr[0] + 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6, x38Arr[0] + 6, y38Arr[0]);
  drawer.drawLineForFourthTape(x38Arr[0] - 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6, x38Arr[0] - 6, y38Arr[0]);
  drawer.drawLineForFourthTape(x38Arr[0] + 6, y38Arr[0], x38Arr[0] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawLineForFourthTape(x38Arr[0] - 6, y38Arr[0], x38Arr[0] - 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawLineForFourthTape(x39Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos, x38Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x38Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos, x37Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x37Arr[0] + 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6, x37Arr[0] + 6, y37Arr[0]);
  drawer.drawLineForFourthTape(x37Arr[0] - 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6, x37Arr[0] - 6, y37Arr[0]);
  drawer.drawLineForFourthTape(x37Arr[0] + 6, y37Arr[0], x37Arr[0] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawLineForFourthTape(x37Arr[0] - 6, y37Arr[0], x37Arr[0] - 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawLineForFourthTape(x38Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos, x37Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x37Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos, x36Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x36Arr[0] + 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6, x36Arr[0] + 6, y36Arr[0]);
  drawer.drawLineForFourthTape(x36Arr[0] - 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6, x36Arr[0] - 6, y36Arr[0]);
  drawer.drawLineForFourthTape(x36Arr[0] + 6, y36Arr[0], x36Arr[0] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawLineForFourthTape(x36Arr[0] - 6, y36Arr[0], x36Arr[0] - 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawLineForFourthTape(x37Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos, x36Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x36Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos, x35Arr[0] - 12, TapeBottomYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x35Arr[0] + 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6, x35Arr[0] + 6, y35Arr[0]);
  drawer.drawLineForFourthTape(x35Arr[0] - 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6, x35Arr[0] - 6, y35Arr[0]);
  drawer.drawLineForFourthTape(x35Arr[0] + 6, y35Arr[0], x35Arr[0] + 6, TapeBottomYPos["fourth"] + turnBackPointYPos - 6);
  drawer.drawLineForFourthTape(x35Arr[0] - 6, y35Arr[0], x35Arr[0] - 6, TapeTopYPos["fourth"] + turnBackPointYPos + 6);
  drawer.drawLineForFourthTape(x36Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos, x35Arr[0] - 12, TapeTopYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x35Arr[0] + 12, TapeBottomYPos["fourth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["fourth"] + turnBackPointYPos);
  drawer.drawLineForFourthTape(x35Arr[0] + 12, TapeTopYPos["fourth"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["fourth"] + turnBackPointYPos);
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
  drawer.drawLineForFifthTape(x49Arr[0] + 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6, x49Arr[0] + 6, y49Arr[0]);
  drawer.drawLineForFifthTape(x49Arr[0] - 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6, x49Arr[0] - 6, y49Arr[0]);
  drawer.drawLineForFifthTape(x49Arr[0] + 6, y49Arr[0], x49Arr[0] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawLineForFifthTape(x49Arr[0] - 6, y49Arr[0], x49Arr[0] - 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawLineForFifthTape(fixedPuryXPos["fifth"] + 6, TapeTopYPos["fifth"] + turnBackPointYPos, x49Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(fixedPuryXPos["fifth"] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos, x49Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x49Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos, x48Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x48Arr[0] + 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6, x48Arr[0] + 6, y48Arr[0]);
  drawer.drawLineForFifthTape(x48Arr[0] - 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6, x48Arr[0] - 6, y48Arr[0]);
  drawer.drawLineForFifthTape(x48Arr[0] + 6, y48Arr[0], x48Arr[0] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawLineForFifthTape(x48Arr[0] - 6, y48Arr[0], x48Arr[0] - 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawLineForFifthTape(x49Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos, x48Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x48Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos, x47Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x47Arr[0] + 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6, x47Arr[0] + 6, y47Arr[0]);
  drawer.drawLineForFifthTape(x47Arr[0] - 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6, x47Arr[0] - 6, y47Arr[0]);
  drawer.drawLineForFifthTape(x47Arr[0] + 6, y47Arr[0], x47Arr[0] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawLineForFifthTape(x47Arr[0] - 6, y47Arr[0], x47Arr[0] - 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawLineForFifthTape(x48Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos, x47Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x47Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos, x46Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x46Arr[0] + 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6, x46Arr[0] + 6, y46Arr[0]);
  drawer.drawLineForFifthTape(x46Arr[0] - 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6, x46Arr[0] - 6, y46Arr[0]);
  drawer.drawLineForFifthTape(x46Arr[0] + 6, y46Arr[0], x46Arr[0] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawLineForFifthTape(x46Arr[0] - 6, y46Arr[0], x46Arr[0] - 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawLineForFifthTape(x47Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos, x46Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x46Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos, x45Arr[0] - 12, TapeBottomYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x45Arr[0] + 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6, x45Arr[0] + 6, y45Arr[0]);
  drawer.drawLineForFifthTape(x45Arr[0] - 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6, x45Arr[0] - 6, y45Arr[0]);
  drawer.drawLineForFifthTape(x45Arr[0] + 6, y45Arr[0], x45Arr[0] + 6, TapeBottomYPos["fifth"] + turnBackPointYPos - 6);
  drawer.drawLineForFifthTape(x45Arr[0] - 6, y45Arr[0], x45Arr[0] - 6, TapeTopYPos["fifth"] + turnBackPointYPos + 6);
  drawer.drawLineForFifthTape(x46Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos, x45Arr[0] - 12, TapeTopYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x45Arr[0] + 12, TapeBottomYPos["fifth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["fifth"] + turnBackPointYPos);
  drawer.drawLineForFifthTape(x45Arr[0] + 12, TapeTopYPos["fifth"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["fifth"] + turnBackPointYPos);
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

  // 6番目のテープを描画
  // 下
  drawer.drawLineForSixthTape(x59Arr[0] + 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6, x59Arr[0] + 6, y59Arr[0]);
  drawer.drawLineForSixthTape(x59Arr[0] - 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6, x59Arr[0] - 6, y59Arr[0]);
  drawer.drawLineForSixthTape(x59Arr[0] + 6, y59Arr[0], x59Arr[0] + 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawLineForSixthTape(x59Arr[0] - 6, y59Arr[0], x59Arr[0] - 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawLineForSixthTape(fixedPuryXPos["sixth"] + 6, TapeTopYPos["sixth"] + turnBackPointYPos, x59Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(fixedPuryXPos["sixth"] + 6, TapeBottomYPos["sixth"] + turnBackPointYPos, x59Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x59Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos, x58Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x58Arr[0] + 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6, x58Arr[0] + 6, y58Arr[0]);
  drawer.drawLineForSixthTape(x58Arr[0] - 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6, x58Arr[0] - 6, y58Arr[0]);
  drawer.drawLineForSixthTape(x58Arr[0] + 6, y58Arr[0], x58Arr[0] + 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawLineForSixthTape(x58Arr[0] - 6, y58Arr[0], x58Arr[0] - 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawLineForSixthTape(x59Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos, x58Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x58Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos, x57Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x57Arr[0] + 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6, x57Arr[0] + 6, y57Arr[0]);
  drawer.drawLineForSixthTape(x57Arr[0] - 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6, x57Arr[0] - 6, y57Arr[0]);
  drawer.drawLineForSixthTape(x57Arr[0] + 6, y57Arr[0], x57Arr[0] + 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawLineForSixthTape(x57Arr[0] - 6, y57Arr[0], x57Arr[0] - 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawLineForSixthTape(x58Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos, x57Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x57Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos, x56Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x56Arr[0] + 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6, x56Arr[0] + 6, y56Arr[0]);
  drawer.drawLineForSixthTape(x56Arr[0] - 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6, x56Arr[0] - 6, y56Arr[0]);
  drawer.drawLineForSixthTape(x56Arr[0] + 6, y56Arr[0], x56Arr[0] + 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawLineForSixthTape(x56Arr[0] - 6, y56Arr[0], x56Arr[0] - 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawLineForSixthTape(x57Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos, x56Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x56Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos, x55Arr[0] - 12, TapeBottomYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x55Arr[0] + 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6, x55Arr[0] + 6, y55Arr[0]);
  drawer.drawLineForSixthTape(x55Arr[0] - 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6, x55Arr[0] - 6, y55Arr[0]);
  drawer.drawLineForSixthTape(x55Arr[0] + 6, y55Arr[0], x55Arr[0] + 6, TapeBottomYPos["sixth"] + turnBackPointYPos - 6);
  drawer.drawLineForSixthTape(x55Arr[0] - 6, y55Arr[0], x55Arr[0] - 6, TapeTopYPos["sixth"] + turnBackPointYPos + 6);
  drawer.drawLineForSixthTape(x56Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos, x55Arr[0] - 12, TapeTopYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x55Arr[0] + 12, TapeBottomYPos["sixth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(x55Arr[0] + 12, TapeTopYPos["sixth"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["sixth"] + turnBackPointYPos);
  // 上
  drawer.drawLineForSixthTape(fixedXPosition, TapeTopYPos["sixth"], x54Arr[0] + 12, TapeTopYPos["sixth"]);
  drawer.drawLineForSixthTape(x54Arr[0] + 6, TapeTopYPos["sixth"] + 6, x54Arr[0] + 6, y54Arr[0]);
  drawer.drawLineForSixthTape(x54Arr[0] - 6, y54Arr[0], x54Arr[0] - 6, TapeTopYPos["sixth"] + 6);
  drawer.drawLineForSixthTape(x54Arr[0] - 12, TapeTopYPos["sixth"], x53Arr[0] + 12, TapeTopYPos["sixth"]);
  drawer.drawLineForSixthTape(x53Arr[0] + 6, TapeTopYPos["sixth"] + 6, x53Arr[0] + 6, y53Arr[0]);
  drawer.drawLineForSixthTape(x53Arr[0] - 6, y53Arr[0], x53Arr[0] - 6, TapeTopYPos["sixth"] + 6);
  drawer.drawLineForSixthTape(x53Arr[0] - 12, TapeTopYPos["sixth"], x52Arr[0] + 12, TapeTopYPos["sixth"]);
  drawer.drawLineForSixthTape(x52Arr[0] + 6, TapeTopYPos["sixth"] + 6, x52Arr[0] + 6, y52Arr[0]);
  drawer.drawLineForSixthTape(x52Arr[0] - 6, y52Arr[0], x52Arr[0] - 6, TapeTopYPos["sixth"] + 6);
  drawer.drawLineForSixthTape(x52Arr[0] - 12, TapeTopYPos["sixth"], x51Arr[0] + 12, TapeTopYPos["sixth"]);
  drawer.drawLineForSixthTape(x51Arr[0] + 6, TapeTopYPos["sixth"] + 6, x51Arr[0] + 6, y51Arr[0]);
  drawer.drawLineForSixthTape(x51Arr[0] - 6, y51Arr[0], x51Arr[0] - 6, TapeTopYPos["sixth"] + 6);
  drawer.drawLineForSixthTape(x51Arr[0] - 12, TapeTopYPos["sixth"], x50Arr[0] + 12, TapeTopYPos["sixth"]);
  drawer.drawLineForSixthTape(x50Arr[0] + 6, TapeTopYPos["sixth"] + 6, x50Arr[0] + 6, y50Arr[0]);
  drawer.drawLineForSixthTape(x50Arr[0] - 6, y50Arr[0], x50Arr[0] - 6, TapeTopYPos["sixth"] + 6);
  drawer.drawLineForSixthTape(x50Arr[0] - 12, TapeTopYPos["sixth"], fixedPuryXPos["sixth"] + 6, TapeTopYPos["sixth"]);
  drawer.drawLineForSixthTape(fixedPuryXPos["sixth"], TapeTopYPos["sixth"] + 6, fixedPuryXPos["sixth"], TapeBottomYPos["sixth"] - 6);
  drawer.drawLineForSixthTape(fixedPuryXPos["sixth"] + 6, TapeBottomYPos["sixth"], x50Arr[0] - 12, TapeBottomYPos["sixth"]);
  drawer.drawLineForSixthTape(x50Arr[0] - 6, TapeBottomYPos["sixth"] - 6, x50Arr[0] - 6, y50Arr[0]);
  drawer.drawLineForSixthTape(x50Arr[0] + 6, y50Arr[0], x50Arr[0] + 6, TapeBottomYPos["sixth"] - 6);
  drawer.drawLineForSixthTape(x50Arr[0] + 12, TapeBottomYPos["sixth"], x51Arr[0] - 12, TapeBottomYPos["sixth"]);
  drawer.drawLineForSixthTape(x51Arr[0] - 6, TapeBottomYPos["sixth"] - 6, x51Arr[0] - 6, y51Arr[0]);
  drawer.drawLineForSixthTape(x51Arr[0] + 6, y51Arr[0], x51Arr[0] + 6, TapeBottomYPos["sixth"] - 6);
  drawer.drawLineForSixthTape(x51Arr[0] + 12, TapeBottomYPos["sixth"], x52Arr[0] - 12, TapeBottomYPos["sixth"]);
  drawer.drawLineForSixthTape(x52Arr[0] - 6, TapeBottomYPos["sixth"] - 6, x52Arr[0] - 6, y52Arr[0]);
  drawer.drawLineForSixthTape(x52Arr[0] + 6, y52Arr[0], x52Arr[0] + 6, TapeBottomYPos["sixth"] - 6);
  drawer.drawLineForSixthTape(x52Arr[0] + 12, TapeBottomYPos["sixth"], x53Arr[0] - 12, TapeBottomYPos["sixth"]);
  drawer.drawLineForSixthTape(x53Arr[0] - 6, TapeBottomYPos["sixth"] - 6, x53Arr[0] - 6, y53Arr[0]);
  drawer.drawLineForSixthTape(x53Arr[0] + 6, y53Arr[0], x53Arr[0] + 6, TapeBottomYPos["sixth"] - 6);
  drawer.drawLineForSixthTape(x53Arr[0] + 12, TapeBottomYPos["sixth"], x54Arr[0] - 12, TapeBottomYPos["sixth"]);
  drawer.drawLineForSixthTape(x54Arr[0] - 6, TapeBottomYPos["sixth"] - 6, x54Arr[0] - 6, y54Arr[0]);
  drawer.drawLineForSixthTape(x54Arr[0] + 6, y54Arr[0], x54Arr[0] + 6, TapeBottomYPos["sixth"] - 6);
  drawer.drawLineForSixthTape(x54Arr[0] + 12, TapeBottomYPos["sixth"], fixedXPosition, TapeBottomYPos["sixth"]);
  // 6番目のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForSixthTape(fixedXPosition, TapeBottomYPos["sixth"], fixedXPosition + turnBackAdjustment["sixth"], TapeBottomYPos["sixth"]);
  drawer.drawLineForSixthTape(fixedXPosition + turnBackAdjustment["sixth"], TapeBottomYPos["sixth"], fixedXPosition + turnBackAdjustment["sixth"], fixedTapeTopYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(fixedXPosition + turnBackAdjustment["sixth"], fixedTapeTopYPos["sixth"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["sixth"] + turnBackPointYPos);
  // 6番目のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForSixthTape(fixedXPosition, fixedTapeTopYPos["sixth"], fixedXPosition + turnBackAdjustment2["sixth"], fixedTapeTopYPos["sixth"]);
  drawer.drawLineForSixthTape(fixedXPosition + turnBackAdjustment2["sixth"], fixedTapeTopYPos["sixth"], fixedXPosition + turnBackAdjustment2["sixth"], TapeBottomYPos["sixth"] + turnBackPointYPos);
  drawer.drawLineForSixthTape(fixedXPosition + turnBackAdjustment2["sixth"], TapeBottomYPos["sixth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["sixth"] + turnBackPointYPos);

  // 7番目のテープを描画
  // 下
  drawer.drawLineForSeventhTape(x69Arr[0] + 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6, x69Arr[0] + 6, y69Arr[0]);
  drawer.drawLineForSeventhTape(x69Arr[0] - 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6, x69Arr[0] - 6, y69Arr[0]);
  drawer.drawLineForSeventhTape(x69Arr[0] + 6, y69Arr[0], x69Arr[0] + 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawLineForSeventhTape(x69Arr[0] - 6, y69Arr[0], x69Arr[0] - 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawLineForSeventhTape(fixedPuryXPos["seventh"] + 6, TapeTopYPos["seventh"] + turnBackPointYPos, x69Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(fixedPuryXPos["seventh"] + 6, TapeBottomYPos["seventh"] + turnBackPointYPos, x69Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x69Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos, x68Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x68Arr[0] + 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6, x68Arr[0] + 6, y68Arr[0]);
  drawer.drawLineForSeventhTape(x68Arr[0] - 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6, x68Arr[0] - 6, y68Arr[0]);
  drawer.drawLineForSeventhTape(x68Arr[0] + 6, y68Arr[0], x68Arr[0] + 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawLineForSeventhTape(x68Arr[0] - 6, y68Arr[0], x68Arr[0] - 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawLineForSeventhTape(x69Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos, x68Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x68Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos, x67Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x67Arr[0] + 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6, x67Arr[0] + 6, y67Arr[0]);
  drawer.drawLineForSeventhTape(x67Arr[0] - 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6, x67Arr[0] - 6, y67Arr[0]);
  drawer.drawLineForSeventhTape(x67Arr[0] + 6, y67Arr[0], x67Arr[0] + 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawLineForSeventhTape(x67Arr[0] - 6, y67Arr[0], x67Arr[0] - 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawLineForSeventhTape(x68Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos, x67Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x67Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos, x66Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x66Arr[0] + 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6, x66Arr[0] + 6, y66Arr[0]);
  drawer.drawLineForSeventhTape(x66Arr[0] - 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6, x66Arr[0] - 6, y66Arr[0]);
  drawer.drawLineForSeventhTape(x66Arr[0] + 6, y66Arr[0], x66Arr[0] + 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawLineForSeventhTape(x66Arr[0] - 6, y66Arr[0], x66Arr[0] - 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawLineForSeventhTape(x67Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos, x66Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x66Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos, x65Arr[0] - 12, TapeBottomYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x65Arr[0] + 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6, x65Arr[0] + 6, y65Arr[0]);
  drawer.drawLineForSeventhTape(x65Arr[0] - 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6, x65Arr[0] - 6, y65Arr[0]);
  drawer.drawLineForSeventhTape(x65Arr[0] + 6, y65Arr[0], x65Arr[0] + 6, TapeBottomYPos["seventh"] + turnBackPointYPos - 6);
  drawer.drawLineForSeventhTape(x65Arr[0] - 6, y65Arr[0], x65Arr[0] - 6, TapeTopYPos["seventh"] + turnBackPointYPos + 6);
  drawer.drawLineForSeventhTape(x66Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos, x65Arr[0] - 12, TapeTopYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x65Arr[0] + 12, TapeBottomYPos["seventh"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["seventh"] + turnBackPointYPos);
  drawer.drawLineForSeventhTape(x65Arr[0] + 12, TapeTopYPos["seventh"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["seventh"] + turnBackPointYPos);
  // 上
  drawer.drawLineForSeventhTape(fixedXPosition, TapeTopYPos["seventh"], x64Arr[0] + 12, TapeTopYPos["seventh"]);
  drawer.drawLineForSeventhTape(x64Arr[0] + 6, TapeTopYPos["seventh"] + 6, x64Arr[0] + 6, y64Arr[0]);
  drawer.drawLineForSeventhTape(x64Arr[0] - 6, y64Arr[0], x64Arr[0] - 6, TapeTopYPos["seventh"] + 6);
  drawer.drawLineForSeventhTape(x64Arr[0] - 12, TapeTopYPos["seventh"], x63Arr[0] + 12, TapeTopYPos["seventh"]);
  drawer.drawLineForSeventhTape(x63Arr[0] + 6, TapeTopYPos["seventh"] + 6, x63Arr[0] + 6, y63Arr[0]);
  drawer.drawLineForSeventhTape(x63Arr[0] - 6, y63Arr[0], x63Arr[0] - 6, TapeTopYPos["seventh"] + 6);
  drawer.drawLineForSeventhTape(x63Arr[0] - 12, TapeTopYPos["seventh"], x62Arr[0] + 12, TapeTopYPos["seventh"]);
  drawer.drawLineForSeventhTape(x62Arr[0] + 6, TapeTopYPos["seventh"] + 6, x62Arr[0] + 6, y62Arr[0]);
  drawer.drawLineForSeventhTape(x62Arr[0] - 6, y62Arr[0], x62Arr[0] - 6, TapeTopYPos["seventh"] + 6);
  drawer.drawLineForSeventhTape(x62Arr[0] - 12, TapeTopYPos["seventh"], x61Arr[0] + 12, TapeTopYPos["seventh"]);
  drawer.drawLineForSeventhTape(x61Arr[0] + 6, TapeTopYPos["seventh"] + 6, x61Arr[0] + 6, y61Arr[0]);
  drawer.drawLineForSeventhTape(x61Arr[0] - 6, y61Arr[0], x61Arr[0] - 6, TapeTopYPos["seventh"] + 6);
  drawer.drawLineForSeventhTape(x61Arr[0] - 12, TapeTopYPos["seventh"], x60Arr[0] + 12, TapeTopYPos["seventh"]);
  drawer.drawLineForSeventhTape(x60Arr[0] + 6, TapeTopYPos["seventh"] + 6, x60Arr[0] + 6, y60Arr[0]);
  drawer.drawLineForSeventhTape(x60Arr[0] - 6, y60Arr[0], x60Arr[0] - 6, TapeTopYPos["seventh"] + 6);
  drawer.drawLineForSeventhTape(x60Arr[0] - 12, TapeTopYPos["seventh"], fixedPuryXPos["seventh"] + 6, TapeTopYPos["seventh"]);
  drawer.drawLineForSeventhTape(fixedPuryXPos["seventh"], TapeTopYPos["seventh"] + 6, fixedPuryXPos["seventh"], TapeBottomYPos["seventh"] - 6);
  drawer.drawLineForSeventhTape(fixedPuryXPos["seventh"] + 6, TapeBottomYPos["seventh"], x60Arr[0] - 12, TapeBottomYPos["seventh"]);
  drawer.drawLineForSeventhTape(x60Arr[0] - 6, TapeBottomYPos["seventh"] - 6, x60Arr[0] - 6, y60Arr[0]);
  drawer.drawLineForSeventhTape(x60Arr[0] + 6, y60Arr[0], x60Arr[0] + 6, TapeBottomYPos["seventh"] - 6);
  drawer.drawLineForSeventhTape(x60Arr[0] + 12, TapeBottomYPos["seventh"], x61Arr[0] - 12, TapeBottomYPos["seventh"]);
  drawer.drawLineForSeventhTape(x61Arr[0] - 6, TapeBottomYPos["seventh"] - 6, x61Arr[0] - 6, y61Arr[0]);
  drawer.drawLineForSeventhTape(x61Arr[0] + 6, y61Arr[0], x61Arr[0] + 6, TapeBottomYPos["seventh"] - 6);
  drawer.drawLineForSeventhTape(x61Arr[0] + 12, TapeBottomYPos["seventh"], x62Arr[0] - 12, TapeBottomYPos["seventh"]);
  drawer.drawLineForSeventhTape(x62Arr[0] - 6, TapeBottomYPos["seventh"] - 6, x62Arr[0] - 6, y62Arr[0]);
  drawer.drawLineForSeventhTape(x62Arr[0] + 6, y62Arr[0], x62Arr[0] + 6, TapeBottomYPos["seventh"] - 6);
  drawer.drawLineForSeventhTape(x62Arr[0] + 12, TapeBottomYPos["seventh"], x63Arr[0] - 12, TapeBottomYPos["seventh"]);
  drawer.drawLineForSeventhTape(x63Arr[0] - 6, TapeBottomYPos["seventh"] - 6, x63Arr[0] - 6, y63Arr[0]);
  drawer.drawLineForSeventhTape(x63Arr[0] + 6, y63Arr[0], x63Arr[0] + 6, TapeBottomYPos["seventh"] - 6);
  drawer.drawLineForSeventhTape(x63Arr[0] + 12, TapeBottomYPos["seventh"], x64Arr[0] - 12, TapeBottomYPos["seventh"]);
  drawer.drawLineForSeventhTape(x64Arr[0] - 6, TapeBottomYPos["seventh"] - 6, x64Arr[0] - 6, y64Arr[0]);
  drawer.drawLineForSeventhTape(x64Arr[0] + 6, y64Arr[0], x64Arr[0] + 6, TapeBottomYPos["seventh"] - 6);
  drawer.drawLineForSeventhTape(x64Arr[0] + 12, TapeBottomYPos["seventh"], fixedXPosition, TapeBottomYPos["seventh"]);
  // 7番目のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForSeventhTape(fixedXPosition, TapeBottomYPos["seventh"], fixedXPosition + turnBackAdjustment["seventh"], TapeBottomYPos["seventh"]);
  drawer.drawLineForSeventhTape(
    fixedXPosition + turnBackAdjustment["seventh"],
    TapeBottomYPos["seventh"],
    fixedXPosition + turnBackAdjustment["seventh"],
    fixedTapeTopYPos["seventh"] + turnBackPointYPos
  );
  drawer.drawLineForSeventhTape(fixedXPosition + turnBackAdjustment["seventh"], fixedTapeTopYPos["seventh"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["seventh"] + turnBackPointYPos);
  // 7番目のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForSeventhTape(fixedXPosition, fixedTapeTopYPos["seventh"], fixedXPosition + turnBackAdjustment2["seventh"], fixedTapeTopYPos["seventh"]);
  drawer.drawLineForSeventhTape(
    fixedXPosition + turnBackAdjustment2["seventh"],
    fixedTapeTopYPos["seventh"],
    fixedXPosition + turnBackAdjustment2["seventh"],
    TapeBottomYPos["seventh"] + turnBackPointYPos
  );
  drawer.drawLineForSeventhTape(fixedXPosition + turnBackAdjustment2["seventh"], TapeBottomYPos["seventh"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["seventh"] + turnBackPointYPos);

  // 8番目のテープを描画
  // 下
  drawer.drawLineForEighthTape(x79Arr[0] + 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6, x79Arr[0] + 6, y79Arr[0]);
  drawer.drawLineForEighthTape(x79Arr[0] - 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6, x79Arr[0] - 6, y79Arr[0]);
  drawer.drawLineForEighthTape(x79Arr[0] + 6, y79Arr[0], x79Arr[0] + 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawLineForEighthTape(x79Arr[0] - 6, y79Arr[0], x79Arr[0] - 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawLineForEighthTape(fixedPuryXPos["eighth"] + 6, TapeTopYPos["eighth"] + turnBackPointYPos, x79Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(fixedPuryXPos["eighth"] + 6, TapeBottomYPos["eighth"] + turnBackPointYPos, x79Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x79Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos, x78Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x78Arr[0] + 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6, x78Arr[0] + 6, y78Arr[0]);
  drawer.drawLineForEighthTape(x78Arr[0] - 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6, x78Arr[0] - 6, y78Arr[0]);
  drawer.drawLineForEighthTape(x78Arr[0] + 6, y78Arr[0], x78Arr[0] + 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawLineForEighthTape(x78Arr[0] - 6, y78Arr[0], x78Arr[0] - 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawLineForEighthTape(x79Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos, x78Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x78Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos, x77Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x77Arr[0] + 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6, x77Arr[0] + 6, y77Arr[0]);
  drawer.drawLineForEighthTape(x77Arr[0] - 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6, x77Arr[0] - 6, y77Arr[0]);
  drawer.drawLineForEighthTape(x77Arr[0] + 6, y77Arr[0], x77Arr[0] + 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawLineForEighthTape(x77Arr[0] - 6, y77Arr[0], x77Arr[0] - 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawLineForEighthTape(x78Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos, x77Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x77Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos, x76Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x76Arr[0] + 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6, x76Arr[0] + 6, y76Arr[0]);
  drawer.drawLineForEighthTape(x76Arr[0] - 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6, x76Arr[0] - 6, y76Arr[0]);
  drawer.drawLineForEighthTape(x76Arr[0] + 6, y76Arr[0], x76Arr[0] + 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawLineForEighthTape(x76Arr[0] - 6, y76Arr[0], x76Arr[0] - 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawLineForEighthTape(x77Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos, x76Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x76Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos, x75Arr[0] - 12, TapeBottomYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x75Arr[0] + 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6, x75Arr[0] + 6, y75Arr[0]);
  drawer.drawLineForEighthTape(x75Arr[0] - 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6, x75Arr[0] - 6, y75Arr[0]);
  drawer.drawLineForEighthTape(x75Arr[0] + 6, y75Arr[0], x75Arr[0] + 6, TapeBottomYPos["eighth"] + turnBackPointYPos - 6);
  drawer.drawLineForEighthTape(x75Arr[0] - 6, y75Arr[0], x75Arr[0] - 6, TapeTopYPos["eighth"] + turnBackPointYPos + 6);
  drawer.drawLineForEighthTape(x76Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos, x75Arr[0] - 12, TapeTopYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x75Arr[0] + 12, TapeBottomYPos["eighth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(x75Arr[0] + 12, TapeTopYPos["eighth"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["eighth"] + turnBackPointYPos);
  // 上
  drawer.drawLineForEighthTape(fixedXPosition, TapeTopYPos["eighth"], x74Arr[0] + 12, TapeTopYPos["eighth"]);
  drawer.drawLineForEighthTape(x74Arr[0] + 6, TapeTopYPos["eighth"] + 6, x74Arr[0] + 6, y74Arr[0]);
  drawer.drawLineForEighthTape(x74Arr[0] - 6, y74Arr[0], x74Arr[0] - 6, TapeTopYPos["eighth"] + 6);
  drawer.drawLineForEighthTape(x74Arr[0] - 12, TapeTopYPos["eighth"], x73Arr[0] + 12, TapeTopYPos["eighth"]);
  drawer.drawLineForEighthTape(x73Arr[0] + 6, TapeTopYPos["eighth"] + 6, x73Arr[0] + 6, y73Arr[0]);
  drawer.drawLineForEighthTape(x73Arr[0] - 6, y73Arr[0], x73Arr[0] - 6, TapeTopYPos["eighth"] + 6);
  drawer.drawLineForEighthTape(x73Arr[0] - 12, TapeTopYPos["eighth"], x72Arr[0] + 12, TapeTopYPos["eighth"]);
  drawer.drawLineForEighthTape(x72Arr[0] + 6, TapeTopYPos["eighth"] + 6, x72Arr[0] + 6, y72Arr[0]);
  drawer.drawLineForEighthTape(x72Arr[0] - 6, y72Arr[0], x72Arr[0] - 6, TapeTopYPos["eighth"] + 6);
  drawer.drawLineForEighthTape(x72Arr[0] - 12, TapeTopYPos["eighth"], x71Arr[0] + 12, TapeTopYPos["eighth"]);
  drawer.drawLineForEighthTape(x71Arr[0] + 6, TapeTopYPos["eighth"] + 6, x71Arr[0] + 6, y71Arr[0]);
  drawer.drawLineForEighthTape(x71Arr[0] - 6, y71Arr[0], x71Arr[0] - 6, TapeTopYPos["eighth"] + 6);
  drawer.drawLineForEighthTape(x71Arr[0] - 12, TapeTopYPos["eighth"], x70Arr[0] + 12, TapeTopYPos["eighth"]);
  drawer.drawLineForEighthTape(x70Arr[0] + 6, TapeTopYPos["eighth"] + 6, x70Arr[0] + 6, y70Arr[0]);
  drawer.drawLineForEighthTape(x70Arr[0] - 6, y70Arr[0], x70Arr[0] - 6, TapeTopYPos["eighth"] + 6);
  drawer.drawLineForEighthTape(x70Arr[0] - 12, TapeTopYPos["eighth"], fixedPuryXPos["eighth"] + 6, TapeTopYPos["eighth"]);
  drawer.drawLineForEighthTape(fixedPuryXPos["eighth"], TapeTopYPos["eighth"] + 6, fixedPuryXPos["eighth"], TapeBottomYPos["eighth"] - 6);
  drawer.drawLineForEighthTape(fixedPuryXPos["eighth"] + 6, TapeBottomYPos["eighth"], x70Arr[0] - 12, TapeBottomYPos["eighth"]);
  drawer.drawLineForEighthTape(x70Arr[0] - 6, TapeBottomYPos["eighth"] - 6, x70Arr[0] - 6, y70Arr[0]);
  drawer.drawLineForEighthTape(x70Arr[0] + 6, y70Arr[0], x70Arr[0] + 6, TapeBottomYPos["eighth"] - 6);
  drawer.drawLineForEighthTape(x70Arr[0] + 12, TapeBottomYPos["eighth"], x71Arr[0] - 12, TapeBottomYPos["eighth"]);
  drawer.drawLineForEighthTape(x71Arr[0] - 6, TapeBottomYPos["eighth"] - 6, x71Arr[0] - 6, y71Arr[0]);
  drawer.drawLineForEighthTape(x71Arr[0] + 6, y71Arr[0], x71Arr[0] + 6, TapeBottomYPos["eighth"] - 6);
  drawer.drawLineForEighthTape(x71Arr[0] + 12, TapeBottomYPos["eighth"], x72Arr[0] - 12, TapeBottomYPos["eighth"]);
  drawer.drawLineForEighthTape(x72Arr[0] - 6, TapeBottomYPos["eighth"] - 6, x72Arr[0] - 6, y72Arr[0]);
  drawer.drawLineForEighthTape(x72Arr[0] + 6, y72Arr[0], x72Arr[0] + 6, TapeBottomYPos["eighth"] - 6);
  drawer.drawLineForEighthTape(x72Arr[0] + 12, TapeBottomYPos["eighth"], x73Arr[0] - 12, TapeBottomYPos["eighth"]);
  drawer.drawLineForEighthTape(x73Arr[0] - 6, TapeBottomYPos["eighth"] - 6, x73Arr[0] - 6, y73Arr[0]);
  drawer.drawLineForEighthTape(x73Arr[0] + 6, y73Arr[0], x73Arr[0] + 6, TapeBottomYPos["eighth"] - 6);
  drawer.drawLineForEighthTape(x73Arr[0] + 12, TapeBottomYPos["eighth"], x74Arr[0] - 12, TapeBottomYPos["eighth"]);
  drawer.drawLineForEighthTape(x74Arr[0] - 6, TapeBottomYPos["eighth"] - 6, x74Arr[0] - 6, y74Arr[0]);
  drawer.drawLineForEighthTape(x74Arr[0] + 6, y74Arr[0], x74Arr[0] + 6, TapeBottomYPos["eighth"] - 6);
  drawer.drawLineForEighthTape(x74Arr[0] + 12, TapeBottomYPos["eighth"], fixedXPosition, TapeBottomYPos["eighth"]);
  // 8番目のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForEighthTape(fixedXPosition, TapeBottomYPos["eighth"], fixedXPosition + turnBackAdjustment["eighth"], TapeBottomYPos["eighth"]);
  drawer.drawLineForEighthTape(fixedXPosition + turnBackAdjustment["eighth"], TapeBottomYPos["eighth"], fixedXPosition + turnBackAdjustment["eighth"], fixedTapeTopYPos["eighth"] + turnBackPointYPos);
  drawer.drawLineForEighthTape(fixedXPosition + turnBackAdjustment["eighth"], fixedTapeTopYPos["eighth"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["eighth"] + turnBackPointYPos);
  // 8番目のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForEighthTape(fixedXPosition, fixedTapeTopYPos["eighth"], fixedXPosition + turnBackAdjustment2["eighth"], fixedTapeTopYPos["eighth"]);
  drawer.drawLineForEighthTape(
    fixedXPosition + turnBackAdjustment2["eighth"],
    fixedTapeTopYPos["eighth"],
    fixedXPosition + turnBackAdjustment2["eighth"],
    TapeBottomYPos["eighth"] + turnBackPointYPos
  );
  drawer.drawLineForEighthTape(fixedXPosition + turnBackAdjustment2["eighth"], TapeBottomYPos["eighth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["eighth"] + turnBackPointYPos);

  // 9番目のテープを描画
  // 下
  drawer.drawLineForNinthTape(x89Arr[0] + 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6, x89Arr[0] + 6, y89Arr[0]);
  drawer.drawLineForNinthTape(x89Arr[0] - 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6, x89Arr[0] - 6, y89Arr[0]);
  drawer.drawLineForNinthTape(x89Arr[0] + 6, y89Arr[0], x89Arr[0] + 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawLineForNinthTape(x89Arr[0] - 6, y89Arr[0], x89Arr[0] - 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawLineForNinthTape(fixedPuryXPos["ninth"] + 6, TapeTopYPos["ninth"] + turnBackPointYPos, x89Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(fixedPuryXPos["ninth"] + 6, TapeBottomYPos["ninth"] + turnBackPointYPos, x89Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x89Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos, x88Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x88Arr[0] + 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6, x88Arr[0] + 6, y88Arr[0]);
  drawer.drawLineForNinthTape(x88Arr[0] - 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6, x88Arr[0] - 6, y88Arr[0]);
  drawer.drawLineForNinthTape(x88Arr[0] + 6, y88Arr[0], x88Arr[0] + 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawLineForNinthTape(x88Arr[0] - 6, y88Arr[0], x88Arr[0] - 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawLineForNinthTape(x89Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos, x88Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x88Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos, x87Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x87Arr[0] + 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6, x87Arr[0] + 6, y87Arr[0]);
  drawer.drawLineForNinthTape(x87Arr[0] - 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6, x87Arr[0] - 6, y87Arr[0]);
  drawer.drawLineForNinthTape(x87Arr[0] + 6, y87Arr[0], x87Arr[0] + 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawLineForNinthTape(x87Arr[0] - 6, y87Arr[0], x87Arr[0] - 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawLineForNinthTape(x88Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos, x87Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x87Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos, x86Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x86Arr[0] + 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6, x86Arr[0] + 6, y86Arr[0]);
  drawer.drawLineForNinthTape(x86Arr[0] - 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6, x86Arr[0] - 6, y86Arr[0]);
  drawer.drawLineForNinthTape(x86Arr[0] + 6, y86Arr[0], x86Arr[0] + 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawLineForNinthTape(x86Arr[0] - 6, y86Arr[0], x86Arr[0] - 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawLineForNinthTape(x87Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos, x86Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x86Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos, x85Arr[0] - 12, TapeBottomYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x85Arr[0] + 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6, x85Arr[0] + 6, y85Arr[0]);
  drawer.drawLineForNinthTape(x85Arr[0] - 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6, x85Arr[0] - 6, y85Arr[0]);
  drawer.drawLineForNinthTape(x85Arr[0] + 6, y85Arr[0], x85Arr[0] + 6, TapeBottomYPos["ninth"] + turnBackPointYPos - 6);
  drawer.drawLineForNinthTape(x85Arr[0] - 6, y85Arr[0], x85Arr[0] - 6, TapeTopYPos["ninth"] + turnBackPointYPos + 6);
  drawer.drawLineForNinthTape(x86Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos, x85Arr[0] - 12, TapeTopYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x85Arr[0] + 12, TapeBottomYPos["ninth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(x85Arr[0] + 12, TapeTopYPos["ninth"] + turnBackPointYPos, fixedXPosition, TapeTopYPos["ninth"] + turnBackPointYPos);
  // 上
  drawer.drawLineForNinthTape(fixedXPosition, TapeTopYPos["ninth"], x84Arr[0] + 12, TapeTopYPos["ninth"]);
  drawer.drawLineForNinthTape(x84Arr[0] + 6, TapeTopYPos["ninth"] + 6, x84Arr[0] + 6, y84Arr[0]);
  drawer.drawLineForNinthTape(x84Arr[0] - 6, y84Arr[0], x84Arr[0] - 6, TapeTopYPos["ninth"] + 6);
  drawer.drawLineForNinthTape(x84Arr[0] - 12, TapeTopYPos["ninth"], x83Arr[0] + 12, TapeTopYPos["ninth"]);
  drawer.drawLineForNinthTape(x83Arr[0] + 6, TapeTopYPos["ninth"] + 6, x83Arr[0] + 6, y83Arr[0]);
  drawer.drawLineForNinthTape(x83Arr[0] - 6, y83Arr[0], x83Arr[0] - 6, TapeTopYPos["ninth"] + 6);
  drawer.drawLineForNinthTape(x83Arr[0] - 12, TapeTopYPos["ninth"], x82Arr[0] + 12, TapeTopYPos["ninth"]);
  drawer.drawLineForNinthTape(x82Arr[0] + 6, TapeTopYPos["ninth"] + 6, x82Arr[0] + 6, y82Arr[0]);
  drawer.drawLineForNinthTape(x82Arr[0] - 6, y82Arr[0], x82Arr[0] - 6, TapeTopYPos["ninth"] + 6);
  drawer.drawLineForNinthTape(x82Arr[0] - 12, TapeTopYPos["ninth"], x81Arr[0] + 12, TapeTopYPos["ninth"]);
  drawer.drawLineForNinthTape(x81Arr[0] + 6, TapeTopYPos["ninth"] + 6, x81Arr[0] + 6, y81Arr[0]);
  drawer.drawLineForNinthTape(x81Arr[0] - 6, y81Arr[0], x81Arr[0] - 6, TapeTopYPos["ninth"] + 6);
  drawer.drawLineForNinthTape(x81Arr[0] - 12, TapeTopYPos["ninth"], x80Arr[0] + 12, TapeTopYPos["ninth"]);
  drawer.drawLineForNinthTape(x80Arr[0] + 6, TapeTopYPos["ninth"] + 6, x80Arr[0] + 6, y80Arr[0]);
  drawer.drawLineForNinthTape(x80Arr[0] - 6, y80Arr[0], x80Arr[0] - 6, TapeTopYPos["ninth"] + 6);
  drawer.drawLineForNinthTape(x80Arr[0] - 12, TapeTopYPos["ninth"], fixedPuryXPos["ninth"] + 6, TapeTopYPos["ninth"]);
  drawer.drawLineForNinthTape(fixedPuryXPos["ninth"], TapeTopYPos["ninth"] + 6, fixedPuryXPos["ninth"], TapeBottomYPos["ninth"] - 6);
  drawer.drawLineForNinthTape(fixedPuryXPos["ninth"] + 6, TapeBottomYPos["ninth"], x80Arr[0] - 12, TapeBottomYPos["ninth"]);
  drawer.drawLineForNinthTape(x80Arr[0] - 6, TapeBottomYPos["ninth"] - 6, x80Arr[0] - 6, y80Arr[0]);
  drawer.drawLineForNinthTape(x80Arr[0] + 6, y80Arr[0], x80Arr[0] + 6, TapeBottomYPos["ninth"] - 6);
  drawer.drawLineForNinthTape(x80Arr[0] + 12, TapeBottomYPos["ninth"], x81Arr[0] - 12, TapeBottomYPos["ninth"]);
  drawer.drawLineForNinthTape(x81Arr[0] - 6, TapeBottomYPos["ninth"] - 6, x81Arr[0] - 6, y81Arr[0]);
  drawer.drawLineForNinthTape(x81Arr[0] + 6, y81Arr[0], x81Arr[0] + 6, TapeBottomYPos["ninth"] - 6);
  drawer.drawLineForNinthTape(x81Arr[0] + 12, TapeBottomYPos["ninth"], x82Arr[0] - 12, TapeBottomYPos["ninth"]);
  drawer.drawLineForNinthTape(x82Arr[0] - 6, TapeBottomYPos["ninth"] - 6, x82Arr[0] - 6, y82Arr[0]);
  drawer.drawLineForNinthTape(x82Arr[0] + 6, y82Arr[0], x82Arr[0] + 6, TapeBottomYPos["ninth"] - 6);
  drawer.drawLineForNinthTape(x82Arr[0] + 12, TapeBottomYPos["ninth"], x83Arr[0] - 12, TapeBottomYPos["ninth"]);
  drawer.drawLineForNinthTape(x83Arr[0] - 6, TapeBottomYPos["ninth"] - 6, x83Arr[0] - 6, y83Arr[0]);
  drawer.drawLineForNinthTape(x83Arr[0] + 6, y83Arr[0], x83Arr[0] + 6, TapeBottomYPos["ninth"] - 6);
  drawer.drawLineForNinthTape(x83Arr[0] + 12, TapeBottomYPos["ninth"], x84Arr[0] - 12, TapeBottomYPos["ninth"]);
  drawer.drawLineForNinthTape(x84Arr[0] - 6, TapeBottomYPos["ninth"] - 6, x84Arr[0] - 6, y84Arr[0]);
  drawer.drawLineForNinthTape(x84Arr[0] + 6, y84Arr[0], x84Arr[0] + 6, TapeBottomYPos["ninth"] - 6);
  drawer.drawLineForNinthTape(x84Arr[0] + 12, TapeBottomYPos["ninth"], fixedXPosition, TapeBottomYPos["ninth"]);
  // 9番目のテープの折り返し部分を描画(bottom -> top)
  drawer.drawLineForNinthTape(fixedXPosition, TapeBottomYPos["ninth"], fixedXPosition + turnBackAdjustment["ninth"], TapeBottomYPos["ninth"]);
  drawer.drawLineForNinthTape(fixedXPosition + turnBackAdjustment["ninth"], TapeBottomYPos["ninth"], fixedXPosition + turnBackAdjustment["ninth"], fixedTapeTopYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(fixedXPosition + turnBackAdjustment["ninth"], fixedTapeTopYPos["ninth"] + turnBackPointYPos, fixedXPosition, fixedTapeTopYPos["ninth"] + turnBackPointYPos);
  // 9番目のテープの折り返し部分を描画(top -> bottom)
  drawer.drawLineForNinthTape(fixedXPosition, fixedTapeTopYPos["ninth"], fixedXPosition + turnBackAdjustment2["ninth"], fixedTapeTopYPos["ninth"]);
  drawer.drawLineForNinthTape(fixedXPosition + turnBackAdjustment2["ninth"], fixedTapeTopYPos["ninth"], fixedXPosition + turnBackAdjustment2["ninth"], TapeBottomYPos["ninth"] + turnBackPointYPos);
  drawer.drawLineForNinthTape(fixedXPosition + turnBackAdjustment2["ninth"], TapeBottomYPos["ninth"] + turnBackPointYPos, fixedXPosition, TapeBottomYPos["ninth"] + turnBackPointYPos);

  // 固定点の描画
  context.fillStyle = "#666666";
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["first"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["second"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["third"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["fourth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["fifth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["sixth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["seventh"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["eighth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeBottomYPos["ninth"] + turnBackPointYPos - 4, 8, 8);

  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["first"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["second"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["third"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["fourth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["fifth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["sixth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["seventh"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["eighth"] + turnBackPointYPos - 4, 8, 8);
  context.fillRect(turnBackFixedXPosition, fixedTapeTopYPos["ninth"] + turnBackPointYPos - 4, 8, 8);

  requestAnimationFrame(update);
}

update();
