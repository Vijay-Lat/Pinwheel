import { createElement } from 'react';
import './App.css';
import { useEffect, useRef } from 'react';
import { Effect } from './effect';
import { useState } from 'react';

function App() {
  const canvasRef = useRef();
  const videoRef = useRef();
  const [play,setPlay]=useState(false)

  const receiveVideo = async () => {
    try {
      // const video = document.createElement("video")
      // video.setAttribute("ref",videoRef)
      const rawData = await navigator.mediaDevices.getUserMedia({ video: true })
      if (rawData) {
        videoRef.current.srcObject = rawData;
        await videoRef.current.play();
         videoRef.current.onloadeddata =  () => {
          // const ctx = canvasRef.current.getContext("2d");
          // ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
            new Effect(canvasRef.current, videoRef.current)
        }
      }

    }
    catch (err) {
      throw new Error(err);
    }
  }
  useEffect(() => {
   if(play)receiveVideo()
  }, [play])


  return (
    <div className='centerItems'>
     {play? <canvas width={window.innerWidth} height={window.innerHeight-100} className='canvas' ref={canvasRef} />:<div className="openText">Click Open thrice to get in </div>}
      <footer className='buttonPosition'>
      <button onClick={()=>setPlay((p)=>!p)}>Open</button>
      <p>Hi ,Welcome to magical Pinwheel</p>
      </footer>
      <video className='video' ref={videoRef} />
    </div>
  );
}

export default App;
