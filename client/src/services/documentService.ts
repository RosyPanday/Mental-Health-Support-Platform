import { restRequest } from "../api/restClient";



export async function uploadTherapistDocuments(

formData: FormData

){

const response = await restRequest(

"/upload/therapist-document",

{

method:"POST",

headers:{

Authorization:

`Bearer ${localStorage.getItem("token")}`

},

body:formData

}

);



if(!response.ok){

throw new Error(
"Document upload failed"
);

}



return await response.json();

}