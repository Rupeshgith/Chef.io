
"use strict";

window.ACCESS_POINT= "https://api.edamam.com/api/recipes/v2";
const Api_ID= "b02102c4";
const Api_key= "9049c5655c0a15de45a226d5f29ba7ad";
const type= "public";

export const fetchData= async function(queries, successcallback){
      const query= queries?.join("&")
      .replace(/,/g, "=")
      .replace(/ /g, "%20")
      .replace(/\+/g, "%2B");

      const url= `${ACCESS_POINT}?app_id=${Api_ID}&app_key=${Api_key}&type=${type}${query ? `&${query}`:"" }`;

      const response= await fetch(url);
      if(response.ok){
        const data= await response.json();
        successcallback(data);
      }
}

