// GLOBLE STYLES
// -------------------------------------------------


// BUTTONS
export const BUTTON_ICON_STYLE = {
    fontSize : "18px",
     color : "#1f1f1f"
}

export const GRADIENT_BUTTON_STYLE = {
    bg : "linear-gradient(60deg, #4796e3, #336dff,#492cbe)",
    color : "white",
    borderRadius : "full",
    transition : "background-position 0.3s ease-in-out",
    bgSize : "200% 200%",
    bgPos : "0% 0%",
    _hover : { bgPos: "100% 0%" },
    _active : { bgPos: "100% 0%", opacity: 0.9 },
    display : "flex",
    alignItems : "center",
    gap : "1",
    textTransform : "capitalize"
}


// TOOLTIPS
export const TOOLTIPS_STYLE = {
    bg : "#1f1f1f",
    borderRadius : "4px",
    fontWeight : "400",
}