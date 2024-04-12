import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import auth from '../../firebaseConnection'
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'

import './style.css'

import { Link } from "react-router-dom"

//images
import clockImg from '../../assets/images/clock-image.png'
import tasksImg from '../../assets/images/tasks-image.png'
import googleIcon from '../../assets/images/google-icon.webp'
import vetorModalImg from '../../assets/images/vetor-modal-login.png'
import iconCloseImg from '../../assets/images//icon-close.png'
import vetorModalErrImg from '../../assets/images/vetor-modal-login-error.png'

const Login = () => {
  const navigate = useNavigate()
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPaswword] = useState('')

  const [showModalLoginError, setShowModalLoginError] = useState(false)
  const [showModalLoginSuccess, setShowModalLoginSuccess] = useState(false)

  const handleLogin = async () => {
    if(inputEmail === '' || inputPassword === ''){
      setShowModalLoginError(true)
      setTimeout(() => {
        setShowModalLoginError(false)
      }, 2500)
    } else {
      await signInWithEmailAndPassword(auth, inputEmail, inputPassword)
      .then((response) => {
        const idUser = response.user.auth.lastNotifiedUid
        localStorage.setItem("@id_user", idUser)
        setShowModalLoginSuccess(true)
        setTimeout(() => {
          setShowModalLoginSuccess(false)
          navigate('/lists')
        }, 2500)
      })
      .catch((error) => {
        console.log(error)
        setShowModalLoginError(true)
        setInputEmail('')
        setInputPaswword('')
        setTimeout(() => {
          setShowModalLoginError(false)
        }, 2500)

      })
    }
  }

  const loginGoogle = async () => {
    const provider = await new GoogleAuthProvider()
    signInWithPopup(auth, provider)
    .then((response) => {
      const idUser = response.user.auth.lastNotifiedUid
      localStorage.setItem("@id_user", idUser)
      navigate('/lists')
    })
  }

  return(
    <main className="main-container-login">
      <article className="aside-presentation">
        <img src={clockImg} alt="clock" className="clock-img"/>
        <section className="text-todo-presentation">
          <p>Everything you </p>
          <p>need to do in one</p>
          <p>place.</p>
        </section>
        <img src={tasksImg} alt="tasks" className="tasks-img"/>
    </article>
    <article className="form-main-container">
      <section className="form-container">
        <h1 className="text-login">Login</h1>
        <input 
          type="text" 
          placeholder="Email Address" 
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setInputPaswword(e.target.value)}
        />
        <button className="btn-login" onClick={handleLogin}>Login</button>
        <p className="text-alternative-login-account">Or</p>
        <button className="btn-login signin-google" onClick={loginGoogle}>
          <img src={googleIcon} alt="icon-google"/>
          Login with Google
        </button>
        <p className="text-no-account">Do not have an account yet?</p>
        <Link to="register" className="text-no-account">Sign up</Link>
      </section>
    </article>

    {showModalLoginSuccess && (
      <section className="modal-login-success">
        <div className="container-left">
          <img src={vetorModalImg} alt="login-vetor" className="login-check-vetor"/>
          <p>Login successfully</p>
        </div>
        <div className="container-right">
          <button className="btn-redirect-modal-login">redirecting...</button>
          <img src={iconCloseImg} alt="close-modal-icon" className="close-modal-login"/>
        </div>
      </section>
    )}

    {showModalLoginError && (
      <section className="modal-login-error">
        <img src={vetorModalErrImg} alt="login-vetor-error"/>
        <div className="container-text-modal-error">
          <h4>Failed to login</h4>
          <p>An error occurred, check if the password and/or email are correct</p>
        </div>
        <button className="btn-close-modal-error">Close</button>
      </section>
    )}
  </main>
  )
}
export default Login