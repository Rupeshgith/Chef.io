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

/*****************************
 main work start from here
 ************************************/

const savedRecipes= Object.keys(window.localStorage).filter(
    item=>{
        return item.startsWith("cookio-recipe");
    });
    console.log(savedRecipes);

const savedRecipeContainer= document.querySelector("[data-saved-recipe-container]");
savedRecipeContainer.innerHTML= `<h2 class="headline-small section-title"> All Saved Recipes</h2>`;

const gridList= document.createElement("div");
gridList.classList.add("grid-list");

if(savedRecipes.length){
    savedRecipes.map((savedRecipe,index)=>{

        const {
            recipe:{
                image,
                label:title,
                totalTime:cookingTime,
                uri
            }
        }= JSON.parse(window.localStorage.getItem(savedRecipe));

        const recipeId= uri.slice(uri.lastIndexOf("_") + 1);
        const isSaved= window.localStorage.getItem(`cookio-recipe${recipeId}`);
    
        const card= document.createElement("div");
        card.classList.add("card");
        card.style.animationDelay= `${100*index}ms`;

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
    })

    
}
else{
    savedRecipeContainer.innerHTML += `<p class="body-large">You don't save any recipe yet</p>`
}
savedRecipeContainer.appendChild(gridList);