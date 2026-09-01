import {

createContext,

useContext,

useState,


} from "react";

import type {
  AuthContextType,
  AuthProviderProps,
  User,
} from "../interfaces/auth";



const AuthContext =
createContext<AuthContextType | null>(null);



export function AuthProvider({

children

}: AuthProviderProps){


const [user,setUser]=useState<User|null>(

()=>{

const savedUser =
localStorage.getItem("user");


return savedUser
?
JSON.parse(savedUser)
:
null;

}

);



const login=(

user:User,

token:string

)=>{


localStorage.setItem(

"token",

token

);



localStorage.setItem(

"user",

JSON.stringify(user)

);



setUser(user);


};




const logout=()=>{


localStorage.removeItem(

"token"

);


localStorage.removeItem(

"user"

);



setUser(null);


};




return(

<AuthContext.Provider

value={{

user,

login,

logout

}}

>

{children}

</AuthContext.Provider>

);


}




export function useAuth(){


const context =
useContext(AuthContext);



if(!context){

throw new Error(
"useAuth must be inside AuthProvider"
);

}



return context;


}
