"use strict"
export function formatNewDateToString(){
    let date = new Date();
    let ye = date.toLocaleString('en', {year: 'numeric'});
    let mo = date.toLocaleString('en', {month: '2-digit'});
    let da = date.toLocaleString('en', {day: '2-digit'});
    return`${ye}-${mo}-${da}`
    }