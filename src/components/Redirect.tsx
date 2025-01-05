import { useEffect } from "react"
import { useNavigate } from "react-router"

interface RedirectProps {
    path: string
}

function Redirect(props: RedirectProps) {

    const navigate = useNavigate()
    
    useEffect(() => {
        navigate(props.path)
    }, [])

    return <></>
}

export default Redirect