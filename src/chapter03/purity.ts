
export const powerGreedy = (exp: number) => (x: bigint) => {
  let v: bigint = BigInt(1);
  for (let curExp = 1; curExp <= exp; curExp++) {
    v = x * v;
  }
  return v;
};
export const power100 = powerGreedy(100);
export const power50 = powerGreedy(50);
