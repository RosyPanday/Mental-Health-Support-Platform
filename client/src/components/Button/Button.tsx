import "./Button.css";

import type { ButtonProps } from "../../interfaces/components";


export default function Button({

text,

onClick,

type="button"

}:ButtonProps){


return (

<button

className="button"

onClick={onClick}

type={type}

>

{text}

</button>


);


}
