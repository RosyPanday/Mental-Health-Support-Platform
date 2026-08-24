export const SIGNUP_MUTATION = `

mutation Signup($input: InputSignup) {

  signup(input: $input) {

    message

    data {

      token

      user {

        id

        username

        phoneNumber

        role

      }

    }

  }

}

`;