
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
const  cardQueries = [
    ["field", "uri"],
    ["field", "label"],
    ["field", "image"],
    ["field", "totalTime"]
];

//import { fetchData } from "./api";
window.apii= "https://api.edamam.com/api/recipes/v2";


const ROOT= "https://api.edamam.com/api/recipes/v2";
window.saveRecipe= function(element,recipeId){
    const isSaved= window.localStorage.getItem(`cookio-recipe${recipeId}`);
    apii= `${ROOT}/${recipeId}`;

    if(!isSaved){
        fetchData(cardQueries,function(data){
            window.localStorage.setItem(`cookio-recipe${recipeId}`, JSON.stringify(data));
            element.classList.toggle("saved");
            element.classList.toggle("removed");
        });
        apii= ROOT;
    }
    else{
        window.localStorage.removeItem(`cookio-recipe${recipeId}`);
        element.classList.toggle("saved");
        element.classList.toggle("removed");
    }
}

const Api_ID= "b02102c4";
const Api_key= "9049c5655c0a15de45a226d5f29ba7ad";
const type= "public";

const fetchData= async function(defaultQuery,successcallback){
      const url= `${apii}?type=public&q=${defaultQuery}&app_id=${Api_ID}&app_key=${Api_key}`;

      const response= await fetch(url);
      if(response.ok){
        const data= await response.json();
        console.log(data);
        successcallback(data);
      }
}


console.log("detail.js");
const detailContainer= document.querySelector("[data-detail-container]");
apii += `/${window.location.search.slice(window.location.search.indexOf("=") + 1)}`;

const /** array */ cuisineType= ["Asian", "French"];

fetchData(null , data =>{
    console.log(data);
        const {
                image,
                images:{LARGE, REGULAR, SMALL, THUMBNAIL },
                label:title,
                source: author,
                ingredients:[],
                totalTime: cookingTime=0,
                calories=0,
                cuisineType=[],
                dietLabels=[],
                dishType=[],
                yield: servings=0,
                ingredientLines=[],
                uri
        }= data.recipe;
    

    document.title= `${title} - Cook.io`;
    const banner= LARGE ?? REGULAR ?? SMALL ?? THUMBNAIL;
    const {uri:bannerurl, width, height}= banner;
    const /**array */ tags= [...cuisineType, ...dietLabels, ...dishType];
    let tagElements= "";
    let IngrItems= "";

    const recipeId= uri.slice(uri.lastIndexOf("_") + 1);
    const isSaved= window.localStorage.getItem(`cookio-recipe${recipeId}`);

    tags.map(tag=>{
        let type= "";
        if(cuisineType.includes(tag)){
            type= "cuisineType";
        }else if(dietLabels.includes(tag)){
            type= "diet";
        }else{
            type= "dishType"
        }

        tagElements += `<a href="./recipes?${type}=${tag.toLowerCase()}" class="filter-chip label-large has-state">${tag}</a>`
    })

    ingredientLines.map(ingredient=>{
        IngrItems += `<li class="ingr-item">${ingredient}</li>`
    });

    detailContainer.innerHTML= `
        <figure class="detail-banner img-holder">
            <img src="${image}" width="${450}" height="${450}" alt="${title}" class="img-cover">
        </figure>

        <div class="detail-content">
            <div class="title-wrapper">
                <h1 class="display-small">${title ?? "Untitled"}</h1>
                <button class="btn btn-secondary has-state has-icon ${isSaved ? "saved": "removed" }" onclick= "saveRecipe(this, '${recipeId}')">
                    <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                    <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                    <span class="label-large save-text">Save</span>
                    <span class="label-large unsaved-text">Unsaved</span>
                </button>
            </div>

            <div class="detail-author label-large">
                <span class="span">by </span>${author}
            </div>
            <div class="detail-stats">
                <div class="stats-item">
                    <span class="display-medium">${ingredientLines.length}</span>
                    <span class="label-medium">Ingredients</span>
                </div>

                <div class="stats-item">
                    <span class="display-medium">${cookingTime || "<45"}</span>
                    <span class="label-medium">Minutes</span>
                </div>

                <div class="stats-item">
                    <span class="display-medium">${Math.floor(calories)}</span>
                    <span class="label-medium">Calories</span>
                </div>

                
            </div>

           ${tagElements ?  `<div class="tag-list">${tagElements}</div>`: ""}
            <h2 class="title-medium ingr-title">
                Ingredients
                <span class="label-medium">for ${servings} Servings</span>
            </h2>

            ${IngrItems ?  `<ul class="body-large ingr-list">${IngrItems}</ul>`: ""}

        </div>
    
    `;


});
 

///////////////////////////////////////
///login
//////////////////////////////////////

const wrapper= document.querySelector(".wrapper");
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
})