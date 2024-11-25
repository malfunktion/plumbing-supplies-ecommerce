import { Theme } from '@mui/material/styles';

export interface ThemeDocument {
  _id?: string;
  name: string;
  isDefault: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    headingFontFamily?: string;
  };
  spacing?: {
    unit?: number;
    containerPadding?: number;
  };
  borderRadius?: number;
  boxShadow?: string;
  components?: {
    [key: string]: {
      styleOverrides?: any;
      defaultProps?: any;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomTheme extends Theme {
  custom?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}
