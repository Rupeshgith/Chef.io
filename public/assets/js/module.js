

"use strict";

 const getTime= minute =>{
    const hour= Math.floor(minute/60);
    const day= math.floor(hour/24);
    const time= day|| hour || minute;
    const unitIndex= [day,hour,minute].lastIndexOf(time);
    const timeUnit= ["days", "hours", "minutes"][unitIndex];

    return [time,timeUnit];
}