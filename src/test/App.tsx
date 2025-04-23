import { Button } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { testLocalRemoteWindow } from "../core/testLocalRemoteWindowEmitter";

export const App = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 20,
      }}
    >
      {/* <TopMenu /> */}
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Button onClick={() => testLocalRemoteWindow()}>Test</Button>
        {/* <Tick /> */}
        {/* <Sandbox /> */}
      </Stack>
    </Box>
  );
};
