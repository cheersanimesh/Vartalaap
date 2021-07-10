import VideoElement from "./VideoElement";
import '../styles/Room.css'

const PeerVideos = ({peers})=>{

    return(
        <div className="d-flex">
            {peers.map((peer,index) =>{
                return(
                <div class="vh-80 vw-50">
                    <VideoElement key={index} peer={peer} />
                </div>
                )
            })}
        </div>
    );
}

export default PeerVideos;