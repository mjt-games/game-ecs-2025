import { TESTS } from "./TESTS";


export const runAllTests = async () => {
  for (const test of TESTS) {
    await test();
  }
};
