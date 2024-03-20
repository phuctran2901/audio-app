import { useState } from 'react'
import PropTypes from 'prop-types'
import { storage, database } from '../../configFirebase'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { AiFillCloseCircle } from 'react-icons/ai'
import './style.css'
import { toast } from 'react-toastify'
import { IconContext } from 'react-icons/lib'

Uploadfiles.propTypes = {
  toggleFormUpload: PropTypes.bool,
  handleUploadSong: PropTypes.func,
  handleToggleFormUpload: PropTypes.func
}
Uploadfiles.default = {
  toggleFormUpload: false,
  handleUploadSong: null,
  handleToggleFormUpload: null
}

function Uploadfiles(props) {
  const [fileAudio, setfileAudio] = useState(null)
  const [fileImage, setfileImage] = useState(null)
  const [urlAudio, setUrlAudio] = useState(null)
  const [urlImage, setUrlImage] = useState(null)
  const [progessAudio, setProgessAudio] = useState(0)
  const [progessImage, setProgessImage] = useState(0)
  const [artistName, setAristName] = useState('')
  const [audioName, setAudioName] = useState('')
  const { toggleFormUpload, handleUploadSong, handleToggleFormUpload } = props
  const handleChangeFiles = (e) => {
    if (e.target.name === 'fileAudio') {
      setfileAudio(e.target.files[0])
    }
    if (e.target.name === 'fileImage') {
      setfileImage(e.target.files[0])
    }
  }
  const handleChangeText = (e) => {
    if (e.target.name === 'audioName') {
      setAudioName(e.target.value)
    } else {
      setAristName(e.target.value)
    }
  }
  const handleSaveAudio = () => {
    if (fileAudio) {
      const uploadTask = storage.ref(`Audios/${fileAudio.name}`).put(fileAudio)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressBarAudio = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
          setProgessAudio(progressBarAudio)
        },
        (error) => {
          console.log('err', error)
        },
        () => {
          storage
            .ref(`Audios`)
            .child(fileAudio.name)
            .getDownloadURL()
            .then((urlAudio) => {
              setUrlAudio(urlAudio)
            })
        }
      )
    } else {
      toast('Chọn file bạn muốn up!', {
        position: 'top-left',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    }
  }
  const handleSaveImage = () => {
    if (fileImage) {
      const uploadTask = storage
        .ref(`Pictures/${fileImage.name}`)
        .put(fileImage)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressBarImage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
          setProgessImage(progressBarImage)
        },
        (error) => {
          console.log('err', error)
        },
        () => {
          storage
            .ref(`Pictures`)
            .child(fileImage.name)
            .getDownloadURL()
            .then((urlImage) => {
              setUrlImage(urlImage)
            })
        }
      )
    } else {
      toast('Chọn file bạn muốn up!', {
        position: 'top-left',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    }
  }
  const onUploadDatabase = () => {
    const databaseRef = database.ref('Audios')
    if (fileAudio && fileImage) {
      if (urlAudio && urlImage) {
        if (audioName && artistName) {
          databaseRef.push({
            src: urlAudio,
            image: urlImage,
            name: audioName,
            artist: artistName
          })
          handleUploadSong({
            src: urlAudio,
            image: urlImage,
            name: audioName,
            artist: artistName
          })
          toast.success('Upload bài hát thành công!', {
            position: 'top-left',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })
          handleToggleFormUpload(false)
          // reset value
          setAristName('')
          setAudioName('')
          setProgessAudio(0)
          setProgessImage(0)
        } else {
          toast('Vui lòng nhập thông tin bài hát!', {
            position: 'top-left',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          })
        }
      } else {
        toast('Tải file đã(hoặc chờ tải file)!', {
          position: 'top-left',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }
    } else {
      toast('Vui lòng up file!', {
        position: 'top-left',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    }
  }
  const onToggleFormUpload = () => {
    handleToggleFormUpload(false)
  }

  console.log(progessAudio, progessImage)
  return (
    <div className={`form-upload ${toggleFormUpload ? 'open' : ''}`}>
      <div onClick={onToggleFormUpload}>
        <IconContext.Provider value={{ className: 'files-close', size: 30 }}>
          <AiFillCloseCircle />
        </IconContext.Provider>
      </div>
      <p className='files-title'>Upload Files</p>
      <div className='files-audio'>
        <span className='files-name'>Audio</span>
        <input
          type='file'
          name='fileAudio'
          accept='.mp3'
          className='files-input'
          onChange={handleChangeFiles}
        />
        <button className='files-button' onClick={handleSaveAudio}>
          <IconContext.Provider value={{ size: 20, color: '#ffffff' }}>
            <FaCloudUploadAlt />
          </IconContext.Provider>
        </button>

        <div className='progress' style={{ height: '8px' }}>
          <div
            className='progress-bar progress-bar-striped '
            role='progressbar'
            aria-valuemin='0'
            aria-valuemax='100'
            style={{
              width: `${progessAudio}%`,
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 5
            }}
          ></div>
        </div>
      </div>
      <div className='files-image'>
        <span className='files-name'>Image</span>
        <input
          accept='.jpg'
          type='file'
          name='fileImage'
          className='files-input'
          onChange={handleChangeFiles}
        />
        <button className='files-button' onClick={handleSaveImage}>
          <IconContext.Provider value={{ size: 20, color: '#ffffff' }}>
            <FaCloudUploadAlt />
          </IconContext.Provider>
        </button>
        <div
          className='progress'
          style={{ height: '8px', Backgroundcolor: '#56184d' }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 5,
              width: `${progessImage}%`,
              height: '100%'
            }}
            className='progress-bar progress-bar-striped'
            role='progressbar'
            aria-valuemin='0'
            aria-valuemax='100'
          ></div>
        </div>
      </div>
      <div className='wrapper-upload'>
        <input
          placeholder='Artist Name'
          name='artistName'
          className='files-text'
          value={artistName}
          onChange={handleChangeText}
          type='text'
        />
        <input
          placeholder='Audio Name'
          onChange={handleChangeText}
          name='audioName'
          value={audioName}
          className='files-text'
          type='text'
        />
        <button className='files-button__upload' onClick={onUploadDatabase}>
          Lưu lại
        </button>
      </div>
    </div>
  )
}

export default Uploadfiles
