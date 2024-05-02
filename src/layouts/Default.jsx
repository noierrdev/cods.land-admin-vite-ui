import {Outlet} from 'react-router-dom'

const DefaultLayout=props=>{
    return (
        <Outlet {...props} />
    )
}
export default DefaultLayout