import { FiPlay, FiPause, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useState, useEffect, useRef, SyntheticEvent } from "react"
import classes from "./Audio.module.css"

type Song = {
  id: number
  title: string
  artist: string
  file: string
  image: string
}
const Audio = (props: {
  isPlaying: boolean
  setIsPlaying: Function
  songs: Song[]
  trackPlaying: number
  setTrackPlaying: Function
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [timeSongInfo, setTimeSongInfo] = useState<{
    currentTime: Number
    duration: number
  }>({
    currentTime: 0,
    duration: 0,
  })

  const handlePlay = (): void => {
    props.setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const handlePause = (): void => {
    props.setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const handlePreviousOrNext = (arg: string) => {
    let thisTrackPlaying = getNumberOfNextOrPrevioussTrack(arg)
    props.setTrackPlaying(thisTrackPlaying)
  }
  const getNumberOfNextOrPrevioussTrack = (arg: string): number => {
    let thisTrackPlaying = props.trackPlaying
    let numberOfTracks = props.songs.length

    if (arg === "previous") {
      thisTrackPlaying--
      if (thisTrackPlaying < 0) {
        thisTrackPlaying = numberOfTracks - 1
      }
    }
    if (arg === "next") {
      thisTrackPlaying++
      if (thisTrackPlaying >= numberOfTracks) {
        thisTrackPlaying = 0
      }
    }
    return thisTrackPlaying
  }
  // Quand il y a un changement dans les states on regarde si c'était en train de jouer avant (On joue automatiquement la musique sinon musique en pause)
  useEffect(() => {
    if (props.isPlaying) {
      if (audioRef.current) {
        audioRef.current.play()
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [props.trackPlaying, props.isPlaying])

  const handleTimeUpdate = (e: SyntheticEvent<EventTarget>): void => {
    const current = (e.target as HTMLMediaElement).currentTime
    const duration = (e.target as HTMLMediaElement).duration

    if (current === duration) {
      handlePreviousOrNext("next")
    } else {
      let timeSongInfo = {
        currentTime: current,
        duration: duration,
      }
      setTimeSongInfo(timeSongInfo)
    }
  }

  const getTime = (time: number): string => {
    return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
  }

  const handleDragging = (e: SyntheticEvent<EventTarget>): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseInt(
        (e.target as HTMLInputElement).value,
      )
    }
    setTimeSongInfo({
      ...timeSongInfo,
      currentTime: parseInt((e.target as HTMLInputElement).value),
    })
  }

  return (
    <div>
      <div className={classes.rangeInfos}>
        <p>{getTime(timeSongInfo.currentTime)}</p>
        <input
          type="range"
          className={classes.range}
          min={0}
          max={timeSongInfo.duration}
          value={timeSongInfo.currentTime}
          onChange={handleDragging}
        />
        <p>{getTime(timeSongInfo.duration)}</p>
      </div>
      <div className={classes.controls}>
        <audio
          ref={audioRef}
          src={props.songs[props.trackPlaying].file}
          className={classes.controlAudioPlayer}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
        />
        <FiChevronLeft
          size={24}
          onClick={() => handlePreviousOrNext("previous")}
        />
        {props.isPlaying ? (
          <FiPause size={32} onClick={() => handlePause()} />
        ) : (
          <FiPlay size={32} onClick={() => handlePlay()} />
        )}
        <FiChevronRight
          size={24}
          onClick={() => handlePreviousOrNext("next")}
        />
      </div>
    </div>
  )
}

export default Audio
