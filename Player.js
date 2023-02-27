import React,{useState,useEffect,useRef} from "react";
import {useNavigate} from 'react-router-dom';

import {
  styled,Typography,Slider,
    Paper,Stack,Box,FormControl,InputLabel,Select,MenuItem
} from "@mui/material";
// #region ------------ ICONS ---------
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';


import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {common} from "@mui/material/colors";
// #endregion ------------ ICONS ---------
// #region -------- Styled Components -----------------------------------------
const Div=styled('div')(({theme})=>({
  backgroundColor:'black',
  height:'100vh',
  width:'100vw',
  paddingTop:theme.spacing(6)
}))

const CustomerPaper=styled(Paper)(({theme})=>({
  backgroundColor:'#4c4c4c',
  marginLeft:theme.spacing(6),
  marginRight:theme.spacing(6),
  padding:theme.spacing(2)
}))

const PSlider=styled(Slider)(({theme,...props})=>({
  color:'lime',
  height:2,
  '&:hover':{
    cursor:'auto'
  },
  '&.MuiSlider-thumb':{
    width:'13px',
    height:'13px',
    display:props.thumbless ? 'none':'block',
  }
}))


function Player(props){
  const {src}=props;

  const audioPlayer=useRef();
  const progressBar=useRef();
  const [mute,setMute]=useState(false);
  const [volume,setVolume]=useState(30);
  const [isPlaying,setIsPlaying]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const [duration,setDuration]=useState(0);
  const [playRate,setPlayRate]=useState(1.0);

  // audioPlayer.current.playbackRate=2.6;

  const navigate=useNavigate();
  const goHome=()=>{
    navigate('/');
  }

  useEffect(()=>{
    if (audioPlayer){
      audioPlayer.current.volume=volume/100;
    }
    if (isPlaying){
      setInterval(()=>{
        const _duration = Math.floor(audioPlayer?.current?.duration);
        const _elapsed = Math.floor(audioPlayer?.current?.currentTime);
        setDuration(_duration);
        setElapsed(_elapsed);
      },100)
    }
  },[volume,isPlaying,playRate])

  function calculateTime(value){
    const minutes = Math.floor(value / 60) < 10 ? `0${Math.floor(value / 60)}` : Math.floor(value / 60)

    const seconds = Math.floor(value % 60) < 10 ? `0${Math.floor(value % 60)}` : Math.floor(value % 60)

    return `${minutes}:${seconds}`
  }

  const onScrub=(value)=>{
    audioPlayer.current.currentTime=value;
  }
  const handlePlayRate=(e)=>{
    setPlayRate(e.target.value);
    audioPlayer.current.playbackRate=playRate;
  }

  const togglePlay=()=>{
    if (!isPlaying){
      audioPlayer.current.play();
    }else {
      audioPlayer.current.pause();
    }
    setIsPlaying(prev=>!prev)
  }

  const toggleBackward=()=>{
    audioPlayer.current.currentTime-=10;
  }

  const toggleForward=()=>{
    audioPlayer.current.currentTime+=10;
  }

  function VolumeBtns(){
    return mute
        ?<VolumeOffIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={()=>setMute(!mute)}/>
        :volume<=20 ? <VolumeMuteIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={()=>setMute(!mute)}/>
            :volume<=75 ? <VolumeDownIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />
                : <VolumeUpIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)}/>

  }
  return(
      <div style={{textAlign:'center'}}>
        <h1>This is player</h1>
        <div>
          <Div>
            <audio src={src} ref={audioPlayer} muted={mute}/>
            <CustomerPaper>
              <Box sx={{display:'flex',justifyContent:'space-between'}}>
                {/*control volume*/}
                <Stack direction='row' spacing={1}
                        sx={{display:'flex',
                        justifyContent:'flex-start',
                        width:'20%',
                        alignItems:'center'}}>
                  <VolumeBtns/>
                  <PSlider min={0} max={100} value={volume}
                           onChange={(e,v)=>setVolume(v)}/>
                </Stack>
                {/*control forward and backward*/}
                <Stack direction='row' spacing={1}
                        sx={{
                          display:'flex',
                          width:'30%',
                          alignItems:'center'}}>
                  <FastRewindIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={toggleBackward}/>
                  {!isPlaying
                      ? <PlayArrowIcon fontSize={'large'} sx={{color: 'lime', '&:hover': {color: 'white'}}}
                                       onClick={togglePlay}/>
                      : <PauseIcon fontSize={'large'} sx={{color: 'lime', '&:hover': {color: 'white'}}}
                                 onClick={togglePlay}/>
                  }
                  <FastForwardIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={toggleForward}/>
                </Stack>
                {/*倍速播放*/}
                <Stack direction='row' spacing={1}
                        sx={{
                          display:'flex',
                          width:'18%',
                        }}>
                  <FormControl variant="filled"
                               color="success"
                               fullWidth
                               size='small'
                  >
                    <InputLabel id="demo-simple-select-label" sx={{color: 'lime'}}>speed</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={playRate}
                        label="speed"
                        onChange={handlePlayRate}
                    >
                      <MenuItem value={1.0}>1.0</MenuItem>
                      <MenuItem value={1.25}>1.25</MenuItem>
                      <MenuItem value={1.5}>1.5</MenuItem>
                      <MenuItem value={1.75}>1.75</MenuItem>
                      <MenuItem value={2.0}>2.0</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack
                  sx={{
                    display:'flex',
                    justifyContent:'flex-end'
                  }}/>
              </Box>
              {/*progress bar*/}
              <Stack spacing={1} direction='row' sx={{
                display:'flex',
                alignItems:'center'
              }}>
                <Typography sx={{color: 'lime'}}>{calculateTime(elapsed)}</Typography>
                <PSlider value={elapsed} max={duration} ref={progressBar} onChange={(e)=>onScrub(e.target.value)}/>
                <Typography sx={{color: 'lime'}}>{calculateTime(duration - elapsed)}</Typography>
              </Stack>
            </CustomerPaper>
          </Div>
        </div>
        <button onClick={goHome}>Home</button>
      </div>
  )
}

export default Player;
