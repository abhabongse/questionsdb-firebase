import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
    // fontSize: 14,
    htmlFontSize: 16,
  },
  palette: {
    primary: {
      main: "#1ba757",
    },
    secondary: {
      main: "#eb1e35",
    },
    tertiary: {
      main: "#0b4f6c",
      light: "rgb(59, 114, 137)",
      dark: "rgb(7, 55, 75)",
      contrastText: "#fff",
    },
    topbar: "linear-gradient(45deg, #A6A65A 0%, #168C7A 30%, #0B4F6C 70%, #114677 100%)"
  },
});

export default theme;
