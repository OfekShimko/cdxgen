import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@jest/globals";

import { readBinary, writeBinary } from "./protobom.js";
import { getTmpDir } from "./utils.js";

const tempDir = mkdtempSync(join(getTmpDir(), "bin-tests-"));
const testBom = JSON.parse(
  readFileSync("./test/data/bom-java.json", { encoding: "utf-8" }),
);

test("proto binary tests", () => {
  const binFile = join(tempDir, "test.cdx.bin");
  writeBinary({}, binFile);
  expect(existsSync(binFile)).toBeTruthy();
  writeBinary(testBom, binFile);
  expect(existsSync(binFile)).toBeTruthy();
  let bomObject = readBinary(binFile);
  expect(bomObject).toBeDefined();
  expect(bomObject.serialNumber).toEqual(
    "urn:uuid:cc8b5a04-2698-4375-b04c-cedfa4317fee",
  );
  expect(bomObject.specVersion).toEqual("1.5");
  bomObject = readBinary(binFile, false, 1.5);
  expect(bomObject).toBeDefined();
  expect(bomObject.serialNumber).toEqual(
    "urn:uuid:cc8b5a04-2698-4375-b04c-cedfa4317fee",
  );
  expect(bomObject.specVersion).toEqual("1.5");
  if (tempDir?.startsWith(getTmpDir()) && rmSync) {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
