
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
        successcallback(data);
        console.log(data)
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

///////////////////
/// accordion
///////////////////


const accordions= document.querySelectorAll("[data-accordion]");

const initAccordion= function(ele){

    const button= ele.querySelector("[data-accordion-btn]");
    let isExpanded= false;
    button.addEventListener('click', function(){
        isExpanded= isExpanded? false: true;
        this.setAttribute("aria-expanded", isExpanded);
    });

}
for(const accordion of accordions){
     initAccordion(accordion);
}

const filterBar= document.querySelector("[data-filter-bar]");
const filterTogglers= document.querySelectorAll("[data-filter-toggler]");
const overlay= document.querySelector("[data-overlay]");

addEventOnElements(filterTogglers, 'click', function(){
    filterBar.classList.toggle("active");
    overlay.classList.toggle("active");
    const bodyOverflow= document.body.style.overflow;
    document.body.style.overflow= bodyOverflow==="hidden"?"visible":"hidden";
})


////////////////////////////////////
//filter clear and apply
////////////////////////////////////


const filterSubmit= document.querySelector("[data-filter-submit]");
const filterClear= document.querySelector("[data-filter-clear]");
const filterSearch= filterBar.querySelector("input[type='search']");

filterSubmit.addEventListener('click', function(){
    const checkboxes= filterBar.querySelectorAll("input:checked");
    const queries= [];

    if(filterSearch.value) queries.push(["q", filterSearch.value]);
    if(checkboxes.length){
        for(const checkbox of checkboxes){
            const key= checkbox.parentElement.parentElement.dataset.filter;
            queries.push([key,checkbox.value]);
        }
    }
    window.location= queries.length ? `?${queries.join("&").replace(/,/g,"=")}`: "/recipes";
})

filterSearch.addEventListener("keydown",(e)=>{
    if(e.key==="Enter") filterSubmit.click();
});

filterClear.addEventListener('click',function(){
    const checkboxes= filterBar.querySelectorAll("input:checked");
    checkboxes?.forEach((ele)=>{
         ele.checked= false;
    })
    filterSearch.value &&= "";

})

const queryStr= window.location.search.slice(1);
const queries= queryStr && queryStr.split("&").map(i=> i.split("="));
const filterCount= document.querySelector("[data-filter-count]");

if(queries.length){
    filterCount.style.display= "block";
    filterCount.innerHTML= queries.length;
}
else{
    filterCount.style.display= "none";
}

queryStr && queryStr.split("&").map(i=> {
    if(i.split("=")[0]=== "q"){
        filterBar.querySelector("input[type='search']").value= i.split("=")[1].replace(/%20/g, " ");
    }
    else{
        filterBar.querySelector(`[value="${i.split("=")[1].replace(/%20/g, " ")}"]`).checked= true;
    }
})

const filterBtn= document.querySelector("[data-filter-btn]");
window.addEventListener("scroll", (e)=>{
    filterBtn.classList[window.scrollY >= 120 ?"add":"remove"]("active");
})


////////////////////////////////////
//render recipe 
// card lgaye h 20
////////////////////////////////////


const gridList= document.querySelector("[data-grid-list]");
const loadMore= document.querySelector("[data-load-more]");
const defaultQueries= [
    ["mealType","breakfast"],
    ["mealType","dinner"],
    ["mealType","lunch"],
    ["mealType","snack"],
    ["mealType","teatime"],
    ...cardQueries
];
gridList.innerHTML= skeletonCard.repeat(20);
let nextpageurl= "";

const renderRecipe= (data)=>{

    data.hits.map((item,index)=>{
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

        const card= document.createElement("div");
        card.classList.add("card");
        card.style.animationDelay= `${100*index}ms`

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

    });

}

let requestedBefore= true;
fetchData(queries || defaultQueries , (data)=>{
    console.log(data);
    const{
        _links:{
            next
        }
    }= data;
    nextpageurl= next?.href;

    gridList.innerHTML= "";
    requestedBefore= false;

    if(data.hits.length){
        renderRecipe(data);
    }
    else{
        loadMore.innerHTML= `<p class="body-medium info-txt">No recipe found</p>`
    }
});

////////////////////////////////////
//render recipe 
// card ko infinite kerdiya
////////////////////////////////////

const container_max_width= 1200;
const container_max_card= 6;

window.addEventListener("scroll", async(e)=>{

    if(loadMore.getBoundingClientRect().top < window.innerHeight && !requestedBefore && nextpageurl){

        let c= Math.round((loadMore.clientWidth/container_max_width)*container_max_card);
        loadMore.innerHTML= skeletonCard.repeat(Math.round(c));
        requestedBefore= true;
        const response= await fetch(nextpageurl);
        const data= await response.json();

        const { _links: {next}}= data;
        nextpageurl= next?.href;

        renderRecipe(data);
        loadMore.innerHTML= "";
        requestedBefore= false;
    }
    if(nextpageurl){
        loadMore.innerHTML= `<p class="body-medium info-txt">No more recipe found</p>`;
    }

});


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
})
*/
