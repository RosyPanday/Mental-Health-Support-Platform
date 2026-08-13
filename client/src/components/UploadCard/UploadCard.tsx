import "./UploadCard.css";

import type { UploadCardProps } from "../../interfaces/components";



export default function UploadCard({

title,

name,

onChange

}:UploadCardProps){



return(

<div className="upload-card">


<h3>

{title}

</h3>



<input

type="file"

name={name}

onChange={onChange}

/>


</div>

);


}
