import { InferGetStaticPropsType } from "next"
import Image from "next/image"
import { useState } from "react"
import styles from "../styles/Home.module.css"
import Song from "../components/Song/Song"
import Audio from "../components/Audio/Audio"

const SONGS: Song[] = [
  {
    id: 0,
    title: "OVER THE TOP",
    artist: "Hiroshi Kitadani",
    file: "OVER THE TOP - Hiroshi Kitadani.mp3",
    image: "/1.jpg",
  },
  {
    id: 1,
    title: "Spy X Family Op 2",
    artist: "Unknown",
    file: "SPY x FAMILY OP  2.mp3",
    image: "/2.jpg",
  },
  {
    id: 2,
    title: "Kickback",
    artist: "Unknown",
    file: "Kick back - Chainsaw man.mp3",
    image: "/3.jpg",
  },
  {
    id: 3,
    title: "Fixette",
    artist: "Ziak",
    file: "Fixette - Ziak.mp3",
    image: "/4.jpg",
  },
]

// Récupère les données une seule fois lors de la compilation de l'appli
export const getStaticProps = async () => {
  const allSongs: Song[] = SONGS
  return {
    props: {
      songs: allSongs,
    },
    revalidate: 3600,
  }
}

const Home: NextPage<{ songs: Song[] }> = ({ songs }) => {
  const [trackPlaying, setTrackPlaying] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  return (
    <div className={styles.container}>
      <div className={styles.songPlaying}>
        <Song
          isPlaying={isPlaying}
          trackPlaying={trackPlaying}
          song={songs[trackPlaying]}
        />
      </div>
      <Audio
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        songs={songs}
        trackPlaying={trackPlaying}
        setTrackPlaying={setTrackPlaying}
      />
    </div>
  )
}

export default Home
