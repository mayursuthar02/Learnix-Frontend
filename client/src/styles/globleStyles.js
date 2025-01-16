// GLOBLE STYLES
// -------------------------------------------------


// BUTTONS
export const GRADIENT_BUTTON_STYLE = {
    bg : "linear-gradient(90deg, #4796E3, #6658ff, #ff5546)",
    color : "white",
    borderRadius : "full",
    transition : "background-position 0.3s ease-in-out",
    bgSize : "200% 200%",
    bgPos : "0% 0%",
    _hover : { bgPos: "100% 0%" },
    _active : { bgPos: "100% 0%", opacity: 0.9 },
    fontWeight : "500"    
}
export const BUTTON_STYLE = {
    borderRadius : "full",
    fontWeight : "400",
    bg : "#1e1f20",
    color : "#fff",
    _hover : {bg: "#333"},    
    transition : "background .3s ease"
}


// INPUTS
export const INPUT_STYLE = {
    borderColor : "#222", 
    _hover : {borderColor: "#444"},
    fontWeight : "400"
}


// TOOLTIPS
export const TOOLTIP_STYLE = {
    bg : "#222",
    color : "#fff",
    fontWeight : "400"
}