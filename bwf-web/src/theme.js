import { createTheme } from '@mui/material/styles';
import { orange, lightBlue } from "@mui/material/colors"


const theme = createTheme({
    palette: {
        primary: orange,
        secondary: lightBlue
    },
    colors: {
        bgColor: '#7f7f7f',
        bgLightColor: '#888',
        bgLighterColor: '#DADADA',
        mainAccentColor: '#e2a748',
    }
});

export default theme