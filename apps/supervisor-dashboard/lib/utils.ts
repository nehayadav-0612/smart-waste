export function getAuthToken():string|null{if(typeof window==='undefined')return null;try{return localStorage.getItem('supervisor_token');}catch{return null;}}
export function setAuthToken(token:string):void{if(typeof window==='undefined')return;try{localStorage.setItem('supervisor_token',token);}catch{}}
export function removeAuthToken():void{if(typeof window==='undefined')return;try{localStorage.removeItem('supervisor_token');}catch{}}
export function cn(...classes:string[]){return classes.filter(Boolean).join(' ');}
