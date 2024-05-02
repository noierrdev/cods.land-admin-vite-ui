import React from "react";

const Loadable=PassedComponent=>props=>{
    return(
        <React.Suspense fallback={<></>} >
            <PassedComponent {...props} />
        </React.Suspense>
    )
    
}
export default Loadable;