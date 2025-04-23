import { testEcsBridgeMessageBus } from "./tests/testEcsBridgeMessageBus";
import { testLocalRemoteBinaryWindow } from "./tests/testLocalRemoteBinaryWindow";
import { testLocalRemoteWindow } from "./tests/testLocalRemoteWindowEmitter";
import { testManyWindowEmitter } from "./tests/testManyWindowEmitter";
import { testSystems } from "./tests/testSystems";

export const TESTS: (() => Promise<void>)[] = [
  testLocalRemoteWindow,
  testLocalRemoteBinaryWindow,
  testEcsBridgeMessageBus,
  testSystems,
  testManyWindowEmitter,
];
