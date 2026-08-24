export const REQUEST_CONSULTATION_MUTATION = `

mutation RequestConsultation(
$input: RequestConsultationInput!
){

requestConsultation(input:$input){

message

}

}

`;