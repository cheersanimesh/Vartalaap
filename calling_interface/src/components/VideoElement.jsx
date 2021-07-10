import { useRef,useEffect } from "react";
import StyledVideo from "./StyledVideo";

// a custom video element
const VideoElement = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

export default VideoElement