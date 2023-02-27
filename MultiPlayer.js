import React from "react";
import Player from "./player/Player";
export default function MultiPlayer(){
  const src="https://test-audio-player-listening.s3.us-west-2.amazonaws.com/Audio/Test+1+Part+1.mp3";
  return(
      <div>
        <Player src={src}/>
        <Player src={src}/>
        <Player src={src}/>
        <Player src={src}/>
        <Player src={src}/>
      </div>
  )
}