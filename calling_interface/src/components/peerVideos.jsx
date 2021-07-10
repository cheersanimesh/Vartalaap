import VideoElement from "./VideoElement";
import '../styles/Room.css'

const PeerVideos = ({peers})=>{     //passing all the peers of an client into the prop

    return(
        <div className="d-flex">
            {/* Mapping refrence from 
                each peer, to a video element  and thus streaming from the peer
            */}
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