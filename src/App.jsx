import { useEffect, useRef, useState } from 'react'

import UploadFiles from './components/UploadFiles'
import AudioItems from './components/AudioItems'
import TimeSlider from 'react-input-slider'
import { database } from './configFirebase'
import { FaFacebookSquare } from 'react-icons/fa'
import {
  AiOutlinePauseCircle,
  AiOutlinePlayCircle,
  AiOutlineCloseCircle
} from 'react-icons/ai'
import { BiSkipNextCircle, BiSkipPreviousCircle } from 'react-icons/bi'
import { CgMenuGridR } from 'react-icons/cg'
import { IconContext } from 'react-icons/lib'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
const databaseRef = database.ref('Audios')

const findIndex = (id, array) => {
  let result = -1
  array.forEach((ob, index) => {
    if (ob.id === id) {
      result = index
    }
  })
  return result
}

function App() {
  const audioRef = useRef()
  const [playAndPauseAudio, setplayAndPauseAudio] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [index, setIndex] = useState(0)
  const [activeID, setActiveID] = useState(0)
  const [toggleListAudio, setToggleListAudio] = useState(true)
  const [widthInput, setWidthInput] = useState(0)
  const [toggleFormUpload, setToggleFormUpload] = useState(false)
  const [audios, setAudios] = useState([
    {
      src: '',
      image:
        'https://e1.pngegg.com/pngimages/893/102/png-clipart-iconlab-itunes-itunes-sunset-red-and-yellow-musical-note.png',
      title: 'Vui lòng chờ...',
      artist: 'Vui lòng chờ tải dữ liệu...',
      id: 0
    }
  ])
  useEffect(() => {
    const widthScreen = window.screen.width
    setWidthInput(widthScreen)
    async function fetchData() {
      try {
        await databaseRef.once('value').then((res) => {
          const data = []
          console.log(res.val())
          const keys = Object.keys(res.val())
          const values = Object.values(res.val())
          keys.map((key, index) => {
            values[index].id = key
            data.push(values[index])
            return data
          })
          setAudios(data)
        })
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])
  const handleOnChangeSlider = ({ x }) => {
    audioRef.current.currentTime = x
    setCurrentTime(x)
    if (!playAndPauseAudio) {
      setplayAndPauseAudio(true)
      audioRef.current.play()
    }
  }
  const onClickAudio = () => {
    if (!playAndPauseAudio) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
    setplayAndPauseAudio(!playAndPauseAudio)
  }
  const handleOnLoadedData = () => {
    setDuration(audioRef.current.duration)
    if (playAndPauseAudio) {
      audioRef.current.play()
    }
  }
  const renderTime = () => {
    let html = null
    let cMinute = Math.floor(currentTime / 60)
    let cSecond = Math.floor(currentTime % 60)
    let dMinute = Math.floor(duration / 60)
    let dSecond = Math.floor(duration % 60)
    let cTime = `${cMinute} : ${cSecond < 10 ? `0${cSecond}` : `${cSecond}`}`
    let dTime = `${dMinute} : ${dSecond < 10 ? `0${dSecond}` : `${dSecond}`}`
    html = `${cTime} / ${dTime}`
    return html
  }
  const selectIndex = (id) => {
    let index = findIndex(id, audios)
    if (index !== -1) {
      setIndex(index)
      setActiveID(index)
    }
  }
  const onToggleListAudio = () => {
    setToggleListAudio(!toggleListAudio)
  }
  const onToggleFormUpload = (bool) => {
    setToggleFormUpload(bool)
  }
  const handleUploadSong = (song) => {
    const newAudios = [...audios]
    newAudios.push(song)
    setAudios(newAudios)
  }
  const nextSong = () => {
    let lengthAudio = audios.length
    if (index >= lengthAudio - 1) {
      setIndex(0)
      setActiveID(0)
    } else {
      setIndex(index + 1)
      setActiveID(index + 1)
    }
    if (playAndPauseAudio) {
      audioRef.current.play()
      setplayAndPauseAudio(true)
    }
  }
  const preSong = () => {
    let lengthAudio = audios.length
    if (index <= 0) {
      setIndex(lengthAudio - 1)
      setActiveID(lengthAudio - 1)
    } else {
      setIndex(index - 1)
      setActiveID(index - 1)
    }
    if (playAndPauseAudio) {
      audioRef.current.play()
      setplayAndPauseAudio(true)
    }
  }
  return (
    <div className='container-w'>
      <div className='marquee'>
        <div className='marquee__inner'>
          <p className='marquee__line'>List songs by Nguyen Thi Thanh Vinh</p>
          <p className='marquee__line'>List songs by Nguyen Thi Thanh Vinh</p>
        </div>
      </div>
      <UploadFiles
        toggleFormUpload={toggleFormUpload}
        handleToggleFormUpload={onToggleFormUpload}
        handleUploadSong={handleUploadSong}
      />

      <div>
        {!toggleListAudio ? (
          <div onClick={onToggleListAudio}>
            <IconContext.Provider
              value={{
                size: 40,
                color: 'white',
                className: 'icon-open active'
              }}
            >
              <CgMenuGridR />
            </IconContext.Provider>
          </div>
        ) : (
          ''
        )}
        <div className='wrapper-audio'>
          <img
            className={`audio-img ${playAndPauseAudio ? 'active' : ''}`}
            src={audios[index].image}
            alt={audios[0].name}
          />
          <p className='audio-name'>{audios[index].name}</p>
          <p className='audio-artist'>{audios[index].artist}</p>
          <audio
            ref={audioRef}
            src={audios[index].src}
            onLoadedData={handleOnLoadedData}
            onTimeUpdate={() => {
              setCurrentTime(audioRef.current.currentTime)
            }}
            onEnded={() => {
              nextSong()
            }}
          ></audio>
          <p className='audio-time'>{renderTime()}</p>
          <div className='audio-controls'>
            <button className='audio-button' onClick={preSong}>
              <IconContext.Provider value={{ size: 40 }}>
                <BiSkipPreviousCircle />
              </IconContext.Provider>
            </button>
            <button className='audio-button' onClick={onClickAudio}>
              <IconContext.Provider value={{ size: 40 }}>
                {playAndPauseAudio ? (
                  <AiOutlinePauseCircle />
                ) : (
                  <AiOutlinePlayCircle />
                )}
              </IconContext.Provider>
            </button>
            <button className='audio-button' onClick={nextSong}>
              <IconContext.Provider value={{ size: 40 }}>
                <BiSkipNextCircle />
              </IconContext.Provider>
            </button>
          </div>
          <TimeSlider
            axis='x'
            xmin={0}
            x={currentTime}
            xmax={duration}
            onChange={handleOnChangeSlider}
            styles={{
              track: {
                backgroundColor: '#e3e3e3',
                height: '8px',
                width: `${widthInput - (widthInput * 50) / 100}px`
              },
              active: {
                backgroundColor: 'black',
                height: '8px'
              },
              thumb: {
                width: '20px',
                height: '20px',
                backgroundColor: '#e183e3',
                borderRadius: '50px'
              }
            }}
          />
        </div>
        <div className={`wrapper-song ${toggleListAudio ? 'active' : ''}`}>
          <div onClick={onToggleListAudio}>
            <IconContext.Provider
              value={{ size: 40, color: 'white', className: 'icon-close' }}
            >
              <AiOutlineCloseCircle />
            </IconContext.Provider>
          </div>
          <p className='title-song'>List Audio</p>
          <AudioItems
            active={activeID}
            data={audios}
            handleSaveIndex={selectIndex}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <button
              onClick={() => onToggleFormUpload(true)}
              className='btn-upload'
            >
              Upload Song
            </button>
          </div>
          <a
            href='https://www.facebook.com/profile.php?id=100010467708316'
            className='messenger'
          >
            Báo lỗi tại <FaFacebookSquare />
          </a>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default App
