import "./Quote.css";

import type { QuoteProps } from "../../interfaces/components";


export default function Quote({

text

}:QuoteProps){


return(

<div className="quote">

"{text}"

</div>

);


}
