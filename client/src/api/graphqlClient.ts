import type { GraphQLRequest } from "../interfaces/api";

const GRAPHQL_URL =
"http://localhost:3001/graphql";



export async function graphqlRequest({

query,

variables

}:GraphQLRequest){


const response = await fetch(

GRAPHQL_URL,

{

method:"POST",

headers:{

"Content-Type":
"application/json",

},

body:JSON.stringify({

query,

variables

})

}

);



const result =
await response.json();



return result;

}
