

"use strict";

//import { getTime } from "./module";

 const getTime= (minute) =>{
    const hour= Math.floor(minute/60);
    const day= math.floor(hour/24);
    const time= day|| hour || minute;
    const unitIndex= [day,hour,minute].lastIndexOf(time);
    const timeUnit= ["days", "hours", "minutes"][unitIndex];
    
    return [time,timeUnit];
}


//import { cardQueries } from "./global";
const /**Array */ cardQueries = [
    ["field", "uri"],
    ["field", "label"],
    ["field", "image"],
    ["field", "totalTime"]
];

//import { fetchData } from "./api";
window.ACCESS_POINT= "https://api.edamam.com/api/recipes/v2";
const Api_ID= "b02102c4";
const Api_key= "9049c5655c0a15de45a226d5f29ba7ad";
const type= "public";

 const fetchData= async function(queries, successcallback){
      const query= queries?.join("&")
      .replace(/,/g, "=")
      .replace(/ /g, "%20")
      .replace(/\+/g, "%2B");

      const url= `${ACCESS_POINT}?app_id=${Api_ID}&app_key=${Api_key}&type=${type}${query ? `&${query}`:"" }`;

      const response= await fetch(url);
      if(response.ok){
        const data= await response.json();
        console.log(data)
        successcallback(data);
      }
}
const ROOT= "https://api.edamam.com/api/recipes/v2";
window.saveRecipe= function(element,recipeId){
    const isSaved= window.localStorage.getItem(`cookio-recipe${recipeId}`);
    ACCESS_POINT= `${ROOT}/${recipeId}`;

    if(!isSaved){
        fetchData(cardQueries,function(data){
            window.localStorage.setItem(`cookio-recipe${recipeId}`, JSON.stringify(data));
            element.classList.toggle("saved");
            element.classList.toggle("removed");
        });
        ACCESS_POINT= ROOT;
    }
    else{
        window.localStorage.removeItem(`cookio-recipe${recipeId}`);
        element.classList.toggle("saved");
        element.classList.toggle("removed");
    }
}



//import { skeletonCard, cardQueries } from "./global";
 const skeletonCard = `
    <div class="card skeleton-card">
        <div class="skeleton card-banner"></div>
            <div class="card-body">
            <div class="skeleton card-title"></div>
            <div class="skeleton card-text"></div>
        </div>
    </div>
`;

/////////////////////////
///searchbtn ki js
////////////////////////
const searchfield= document.querySelector("[data-search-field]");
const searchBtn= document.querySelector("[data-search-btn]");

searchBtn.addEventListener("click", function(){
    if(searchfield.value) window.location= `/recipes?q=${searchfield.value}`;
});
///// search submit when press enter key
searchfield.addEventListener("keydown",(e)=>{
    if(e.key==="Enter") searchBtn.click();
});


/////////////////////////////////
///tabbtn and panels ki js
///////////////////////////////

const tabBtns= document.querySelectorAll("[data-tab-btn]");
const tabPanels= document.querySelectorAll("[data-tab-panel]");

let [lastActiveTabPanel]= tabPanels;
let [lastActiveTabBtn]= tabBtns;

addEventOnElements(tabBtns,"click", function(){
    //////////  hrr tabpanel and btn per ye kaam kiya
    lastActiveTabPanel.setAttribute("hidden","");
    lastActiveTabBtn.setAttribute("aria-selected",false);
    lastActiveTabBtn.setAttribute("tabindex",-1);
    ///////// current panel btn per ye kiya
    const currentTabPanel= document.querySelector(`#${this.getAttribute("aria-controls")}`);
    currentTabPanel.removeAttribute("hidden");
    this.setAttribute("aria-selected",true);
    this.setAttribute("tabindex",0);

    lastActiveTabPanel= currentTabPanel;
    lastActiveTabBtn= this;
    addTabContent(this,currentTabPanel);
});


///////////////////////////////////////
///work with api
///fetch data for tab content
//////////////////////////////////////

const addTabContent= (currentTabBtn, currentTabPanel)=>{
    const gridList= document.createElement("div");
    gridList.classList.add("grid-list");

    currentTabPanel.innerHTML= `
    <div class="grid-list">
     ${skeletonCard.repeat(10)}
     </div>
    `;

    fetchData([['mealType', currentTabBtn.textContent.trim().toLowerCase()], ...cardQueries],function(data){
        console.log(data);
        currentTabPanel.innerHTML= "";
        for(let i=0;i<10;i++){
            const {
                recipe:{
                    image,
                    label:title,
                    totalTime:cookingTime,
                    uri
                }
            
            }= data.hits[i];
            console.log(uri);
            const recipeId= uri.slice(uri.lastIndexOf("_") + 1);
            const isSaved= window.localStorage.getItem(`cookio-recipe${recipeId}`);
        
        const card= document.createElement("div");
        card.classList.add("card");
        card.style.animationDelay= `${100*i}ms`;

        card.innerHTML= `
                <figure class="card-media img-holder">
                <img src=${image} width="100%" height="200" alt=${title} class="img-cover"
                loading="lazy">
            </figure>
            
            <div class="card-body">
                <h3 class="title-small">
                <a href="./detail?recipe=${recipeId}" class="card-link">Recipe Name: ${title ?? "untitled"}</a>
                </h3>

                
                <div class="meta-wrapper">
                <div class="meta-item">
                    <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                    <span class="label-medium"> ${cookingTime || "<45"} minutes</span>
                </div>

                <button class="icon-btn has-state ${isSaved ? "saved": "removed" }" aria-label="Add to saved-recipes" onclick= "saveRecipe(this, '${recipeId}')">
                    <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add
                    </span>
                    <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                </button>
                </div>

            </div>
        `;
             gridList.appendChild(card);
        }

        currentTabPanel.appendChild(gridList);
        currentTabPanel.innerHTML += `
            <a href="./recipes?mealType=${currentTabBtn.textContent.trim().toLowerCase()}" class="btn btn-secondary label-large has-state" style= "color:black;">Show More</a>
        `;
    });

}
addTabContent(lastActiveTabBtn, lastActiveTabPanel);

///////////////////////////////////////
///fetch data for slider card
//////////////////////////////////////


const /** array */ cuisineType= ["Asian", "French"];
const sliderSections= document.querySelectorAll("[data-slider-section]");

for(const [index,sliderSection] of sliderSections.entries()){
    sliderSection.innerHTML= `
    <div class="container">
      <h2 class="section-title headline-small" id="slider-label-1">Latest ${cuisineType[index]} Recipe</h2>
      <div class="slider">
         <ul class="slider-wrapper">
           ${`<li class="slider-item">${skeletonCard}</li>`.repeat(10)}
         </ul>
      </div>
    </div>
    `;

    const container= document.createElement("div");
    container.classList.add("container");

    const slider= document.createElement("div");
    container.classList.add("slider");

    const sliderWrapper= sliderSection.querySelector(".slider-wrapper");

    fetchData([...cardQueries,["cuisineType", cuisineType[index]]], function(data){
        sliderWrapper.innerHTML= "";
        data.hits.map((item)=>{

            const {
                recipe:{
                    image,
                    label:title,
                    totalTime:cookingTime,
                    uri
                }

            }= item;

            const recipeId= uri.slice(uri.lastIndexOf("_") + 1);
            const isSaved= window.localStorage.getItem(`cookio-recipe${recipeId}`);
            const sliderItem= document.createElement("li");
            sliderItem.classList.add("slider-item");

            sliderItem.innerHTML= `
                <div class= "card">
                    <figure class="card-media img-holder">
                        <img src=${image} width="100%" height="200" alt=${title} class="img-cover"
                        loading="lazy">
                    </figure>
                
                   <div class="card-body">
                     <h3 class="title-small">
                       <a href="./detail?recipe=${recipeId}" class="card-link">Recipe Name: ${title ?? "untitled"}</a>
                     </h3>

                    
                    <div class="meta-wrapper">
                    <div class="meta-item">
                        <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                        <span class="label-medium"> ${cookingTime || "<45"} minutes</span>
                    </div>

                    <button class="icon-btn has-state ${isSaved ? "saved": "removed" }" aria-label="Add to saved-recipes" onclick= "saveRecipe(this, '${recipeId}')">
                        <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add
                        </span>
                        <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                    </button>
                    </div>

                   </div>
                </div>
            
            `;
            sliderWrapper.appendChild(sliderItem);

        })
        sliderWrapper.innerHTML += `
            <li class="slider-item" data-slider-item>
                  <a href="./recipes" class="load-more-card has-state">
                    <span class="label-large">Show More</span>
                  </a>
            </li>
        `;
         console.log(sliderWrapper) ;
       
    });
    

}

///////////////////////////////////////
///login
//////////////////////////////////////

/*const wrapper= document.querySelector(".wrapper");
const loginlink= document.querySelector(".login-link")
const registerlink= document.querySelector(".register-link")
const popup= document.querySelector(".btnlogin-popup")
const iconClose= document.querySelector(".icon-close")
const loginbtn = document.querySelector(".login-btn")

registerlink.addEventListener("click",()=>{
    wrapper.classList.add("active")
})
loginlink.addEventListener("click",()=>{
    wrapper.classList.remove("active")
})
loginbtn.addEventListener("click",()=>{
    wrapper.classList.remove("active-popup")
})

popup.addEventListener('click',()=>{
    wrapper.classList.toggle("active-popup");
})
iconClose.addEventListener('click',()=>{
    wrapper.classList.remove("active-popup");
})*/
