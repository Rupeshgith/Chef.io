

"use strict";

const $html= document.documentElement;
const isDark= window.matchMedia("(prefers-color-scheme:dark)").matches;

if(sessionStorage.getItem("theme")){
    $html.dataset.theme= sessionStorage.getItem("theme");
}
else{
    $html.dataset.theme= isDark ? "dark" : "light";
}

let isPressed= false;
const changeTheme= ()=>{
    const themeBtn= this.document.querySelector("[data-theme-btn]");
    isPressed= isPressed? false : true;
    themeBtn.setAttribute("arial-pressed",isPressed);
    $html.setAttribute("data-theme", ($html.dataset.theme=== "light")? "dark": "light");
    sessionStorage.setItem("theme",$html.dataset.theme);
      
}
window.addEventListener("load",function(){
    const themeBtn= this.document.querySelector("[data-theme-btn]");
    themeBtn.addEventListener('click',changeTheme);
});

