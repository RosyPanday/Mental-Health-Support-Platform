export const LOGIN_MUTATION = `

mutation Login($input: InputLogin) {

 login(input:$input){

  message

  data{

   user{

    username

   }

   token

  }

 }

}

`;
