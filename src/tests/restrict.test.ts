//NOTE: This test may fail if the owner of the example work changes it to unrestricted!

import { checkLocks } from "..";

describe("Checks status of a restricted work.", () => {
 test("Checks a known restricted work.", async () => {
  const work = await checkLocks( { workID: "15461226" } )

  expect(work).toMatchObject({
   locked: true,
  })

 });

 test("Checks a known unrestricted work.", async () => {
  const work = await checkLocks( { workID: "923647" })

  expect(work).toMatchObject({
   locked: false,
  })
 })

})