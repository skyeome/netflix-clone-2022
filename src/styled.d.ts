// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;
    colors: {
      text: string;
      bg: string;
      btn: string;
    };
  }
}