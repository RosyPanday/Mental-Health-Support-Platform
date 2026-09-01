const API_URL =import.meta.env.VITE_API_URI || "http://localhost:3001/api";

export const BASE_URL = import.meta.env.VITE_BASE_URI || "http://localhost:3001";

export async function restRequest(

endpoint:string,

options:RequestInit

){

return fetch(

`${API_URL}${endpoint}`,

options

);

}