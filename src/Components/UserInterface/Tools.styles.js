import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    paddingTop: "90px",
    paddingBottom: "40px",
  },

  headerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "40px",
    padding: "0 15px",
  },

  header: {
    textAlign: "center",
    padding: "20px 40px",
    fontFamily: '"Poppins", sans-serif',
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "1px",
    background: "linear-gradient(135deg, #00796b 0%, #006e74 100%)",
    color: "#ffffff",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "1200px",
    boxShadow: "0 8px 32px rgba(0, 121, 107, 0.3)",
    animation: "$slideInDown 0.6s ease-out",

    "@media (max-width: 600px)": {
      fontSize: "24px",
      padding: "15px 30px",
      borderRadius: "15px",
    },
  },

  contentWrapper: {
    width: "100%",
    padding: "0 20px",
    display: "flex",
    justifyContent: "center",
  },

  gridContainer: {
    width: "100%",
    maxWidth: "1400px",
    padding: "0 !important",
  },

  // Main Tool Card - Apple Glassmorphism Look
  toolCard: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1.2",
    minHeight: "160px",
    maxHeight: "200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "20px 15px",
    background: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    overflow: "hidden",

    "&:hover": {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: "0 20px 40px rgba(0, 121, 107, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)",
      borderColor: "rgba(0, 121, 107, 0.3)",
      background: "rgba(255, 255, 255, 0.95)",

      "& $iconContainer": {
        transform: "scale(1.1)",
        background: "linear-gradient(135deg, rgba(0, 121, 107, 0.12) 0%, rgba(0, 110, 116, 0.22) 100%)",
        boxShadow: "0 12px 24px rgba(0, 121, 107, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
      },

      "& $toolName": {
        color: "#00796b",
        fontWeight: 700,
      },
    },

    "@media (max-width: 960px)": {
      minHeight: "150px",
      maxHeight: "190px",
      padding: "18px 12px",
    },

    "@media (max-width: 600px)": {
      minHeight: "140px",
      maxHeight: "180px",
      padding: "16px 10px",
      borderRadius: "18px",
    },
  },

  // Apple-style Glass Icon Container
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "70px",
    height: "70px",
    minWidth: "70px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, rgba(224, 242, 241, 0.6) 0%, rgba(178, 223, 219, 0.3) 100%)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    marginBottom: "14px",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 8px 20px rgba(0, 121, 107, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    position: "relative",

    "@media (max-width: 960px)": {
      width: "60px",
      height: "60px",
      minWidth: "60px",
      borderRadius: "16px",
      marginBottom: "10px",
    },

    "@media (max-width: 600px)": {
      width: "52px",
      height: "52px",
      minWidth: "52px",
      borderRadius: "14px",
      marginBottom: "8px",
    },
  },

  iconInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Tool Name Container
  toolNameContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    minHeight: "40px",
    textAlign: "center",
    padding: "0 5px",
  },

  toolName: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: "13px",
    fontWeight: 600,
    color: "#2b2c2c",
    lineHeight: "1.3",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
    transition: "all 0.3s ease",
    letterSpacing: "0.3px",

    "@media (max-width: 960px)": {
      fontSize: "12px",
    },

    "@media (max-width: 600px)": {
      fontSize: "11px",
    },
  },

  // Animations
  "@keyframes slideInDown": {
    from: {
      opacity: 0,
      transform: "translateY(-30px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  gridContainer: {
    width: "100%",
    maxWidth: "1400px",
    padding: "0 !important",
  },
}));