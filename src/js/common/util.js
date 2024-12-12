import { lusolve, asin } from "mathjs";

export class Utils {
  constructor() {}

  /**
   * 連立方程式を解くラッパーmethod
   * @param {Array<Array<number>>} A 係数行列
   * @param {Array<number>} b 定数ベクトル
   * @return {Array<number>} 解の配列
   */
  solveLinearEquations(A, b) {
    // 連立方程式を解き、結果を1次元配列として返す
    const result = lusolve(A, b);
    return result.map((v) => v[0]);
  }

  // asin関数（引数を -1 ～ 1 の範囲に制限）
  clampedAsin(value) {
    if (value > 1) value = 1;
    if (value < -1) value = -1;
    return asin(value);
  }
  // 角度をラジアンに変換
  radToDeg(radians) {
    return radians * (180 / Math.PI);
  }
  // 表示を小数点..桁に丸める
  displayRound(value) {
    return value.toFixed(3);
  }
}
