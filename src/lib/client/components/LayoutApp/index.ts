import { DefaultTheme, createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0px auto;
    min-height: 100%;
  }

  body {
    padding: 0px;

    & > #root {
      min-height: 100%;
    }
  }

`;

export const DefaultThemes: DefaultTheme = {
  color: {
    neutral_color: "#fff",
    primary_color: "#5b2b16",
    primary_dark_color: "#5b2b16",
    primary_medium_light_color: "#e9f6ff",
    primary_light_color: "#F5F8FD",
    primary_text_color: "#3B3B3B",
    secondary_text_color: "#6E6E6E",
    secondary_text_light_color: "#9E9E9E",
    error_color: "#FF5245",
    success_color: "#3CE36F",
    success_light_color: "#F2FFF6",
    warning_color: "#FFF9A0",
    warning_dark_color: "#BAB129",
    secondary_color: "#FC843C",
    secondary_light_color: "#FFF2EB",
    disabled_color: "#BEBEBE",
    disabled_light_color: "#EAEAEA",
  },
  font_family: {
    primary: "sans-serif",
    secondary: "",
  },
};
