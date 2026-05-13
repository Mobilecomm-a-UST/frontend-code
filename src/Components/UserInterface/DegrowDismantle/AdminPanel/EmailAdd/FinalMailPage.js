import { lazy } from "react";
import { Box, Stack } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";

import {MemoTo} from "./To";
import {MemoCc} from "./Cc";

// const MemoTo = lazy(() => import("./To"));   // ✅ picks up default export
// const MemoCc = lazy(() => import("./Cc"));

const FinalMailPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh"
      }}
    >
      {/* 🔹 Breadcrumb Section */}
      <Box
        sx={{
          mb: -2,   // space below breadcrumb
          ml: 1
        }}
      >
         
        <div style={{ margin: 10, marginLeft: -15, marginTop: -15 }}>
        <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" onClick={() => navigate("/tools")}>
            Tools
          </Link>
          <Link underline="hover" onClick={() => navigate("/tools/full_site_dismantle")}>
            Full Site Dismantle
          </Link>
          <Typography color="text.primary">Email Add</Typography>
        </Breadcrumbs>
        </div>
      </Box>

      {/* 🔹 Main Content */}
      <Stack
        spacing={-5}   // 👉 space between TO & CC boxes
        sx={{
          px: -2,       // left-right padding
        }}
      >
        <Box sx={{ mb: 1 }}>
          <MemoTo />
        </Box>

        <Box sx={{ mt: 1 }}>
          <MemoCc />
        </Box>
      </Stack>
    </Box>
  );
};

export default FinalMailPage;

