export const SEARCH_THERAPISTS_QUERY = `

query SearchTherapists(
$input: searchTherapistsInput
){

searchTherapists(input:$input){

message

data{

recommendedTherapists{

id

name

specialization

yearsOfExperience

educationalDocument1

educationalDocument2

professionalDoc

language

role

profilePic

}

}

}

}

`;
