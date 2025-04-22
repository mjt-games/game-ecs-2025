import { testEcsBridgeMessageBus } from "./tests/testEcsBridgeMessageBus";
import { testLocalRemoteBinaryWindow } from "./tests/testLocalRemoteBinaryWindow";
import { testLocalRemoteWindow } from "./tests/testLocalRemoteWindow";
import { testSystems } from "./tests/testSystems";

export const TESTS: (() => Promise<void>)[] = [
  testLocalRemoteWindow,
  testLocalRemoteBinaryWindow,
  testEcsBridgeMessageBus,
  testSystems,
];
