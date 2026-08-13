import { gql } from "@apollo/client";

import {
  apolloClient
} from "../api/apolloClient";


import {
  LOGIN_MUTATION
} from "../graphql/mutations/loginMutation";


import {
  SIGNUP_MUTATION
} from "../graphql/mutations/signupMutation";


import type {
  LoginInput,
  SignupInput,
  LoginResponse,
  SignupResponse
} from "../interfaces/auth";



export async function loginUser(
  input: LoginInput
) {


const response =
await apolloClient.mutate<LoginResponse>({

  mutation:
    gql(LOGIN_MUTATION),

  variables:{
    input
  }

});



if(!response.data){

  throw new Error(
    "Login failed: no data returned"
  );

}



return response.data.login.data;

}





export async function signupUser(
  input: SignupInput
) {


const response =
await apolloClient.mutate<SignupResponse>({

  mutation:
    gql(SIGNUP_MUTATION),

  variables:{
    input
  }

});



if(!response.data){

  throw new Error(
    "Signup failed: no data returned"
  );

}



return response.data.signup.data;

}
