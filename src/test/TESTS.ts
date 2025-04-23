import { testEcsBridgeMessageBus } from "../core/testEcsBridge";
import { testLocalRemoteBinaryWindow } from "../core/testLocalRemoteBinaryWindow";
import { testLocalRemoteWindow } from "../core/testLocalRemoteWindowEmitter";
import { testManyWindowEmitter } from "../core/testManyWindowEmitter";
import { testSystems } from "../core/testSystems";

export const TESTS: (() => Promise<void>)[] = [
  testLocalRemoteWindow,
  testLocalRemoteBinaryWindow,
  testEcsBridgeMessageBus,
  testSystems,
  testManyWindowEmitter,
];
