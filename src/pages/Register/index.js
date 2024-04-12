import './style.css'

import auth from '../../firebaseConnection'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import clockImg from '../../assets/images/clock-image.png'
import tasksImg from '../../assets/images/tasks-image.png'
import googleIcon from '../../assets/images/google-icon.webp'
import vetorModalImg from '../../assets/images/vetor-modal-login.png'
import vetorModalErrImg from '../../assets/images/vetor-modal-login-error.png'

const Register = () => {
  const navigate = useNavigate()
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPaswword] = useState('')

  const [modalRegisterSuccess, setModalRegisterSuccess] = useState(false)
  const [modalRegisterErrorEmail, setModalRegisterErrorEmail] = useState(false)
  const [modalRegisterErrorPassword, setModalRegisterErrorPassword] = useState(false)
  const [modalRegisterErrorUser, setModalRegisterErrorUser] = useState(false)

  const regex_password_nums = /[0-9]/g
  const regex_password_letters = /[a-zA-Z]/g

  const handleCreate = async () => {
    if(!inputEmail.includes('@') || !inputEmail.includes('.com')){
      console.log('poorsa')
      console.log(inputEmail)
      setModalRegisterErrorEmail(true)
      setTimeout(() => {
        setModalRegisterErrorEmail(false)
      }, 2500)
    } else if(inputPassword.length < 8 || !regex_password_nums.test(inputPassword) || 
    !regex_password_letters.test(inputPassword)){
      setModalRegisterErrorPassword(true)
      setTimeout(() => {
        setModalRegisterErrorPassword(false)
      }, 2500)
      }
    else {
      await createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
      .then((response) => {
        const idUser = response.user.auth.lastNotifiedUid
        localStorage.setItem("@id_user", idUser)
        setModalRegisterSuccess(true)
        setTimeout(() => {
          navigate('/lists')
        }, 2500)
      })
      .catch((error) => {
        if(error.code === 'auth/email-already-in-use'){
          setModalRegisterErrorUser(true)
          setInputEmail('')
          setInputPaswword('')
          setTimeout(() => {
            setModalRegisterErrorUser(false)
          }, 2500)
        } else {
          console.log(error)
        }
      })
    }
  }

  const createWGoogle = async () => {
    const provider = await new GoogleAuthProvider()
    signInWithPopup(auth, provider)
    .then((response) => {
      const photoUser = response.user.reloadUserInfo.photoUrl
      const idUser = response.user.auth.lastNotifiedUid
      localStorage.setItem("@urlImg_user", photoUser)
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
        <div className="text-create-account">
          <p className="text-register">Create</p>
          <p className="text-register">Account</p>
        </div>
        <input 
          type="text" 
          placeholder="Full Name" 
        />
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
        <button className="btn-login" onClick={handleCreate}>Create Account</button>
        <p className="text-alternative-create-account">Or</p>
        <button className="btn-login signin-google" onClick={createWGoogle}>
          <img src={googleIcon} alt="icon-google"/>
          Sign In with Google
        </button>
        <p className="text-no-account">Already have an account?</p>
        <Link to="login" className="text-no-account" id="text-no-account">Log in</Link>
      </section>  
    </article>

    {modalRegisterSuccess && (
      <section className="modal-register-success">
        <div className="container-left">
          <img src={vetorModalImg} alt="login-vetor" className="register-check-vetor"/>
          <p>Registration completed</p>
        </div>
        <button className="btn-redirect-modal-register">redirecting...</button>
      </section>
    )}

    {modalRegisterErrorEmail && (
      <section className="modal-register-error-email modal-error">
        <img src={vetorModalErrImg} alt="register-vetor-error" className="vetor-error-register"/>
        <div className="container-text-modal-error-email">
          <h4>Failed to register</h4>
          <p>Enter a valid email</p>
        </div>
        <button className="btn-close-modal-error">Close</button>
      </section>
    )}

    {modalRegisterErrorPassword && (
      <section className="modal-register-error-password modal-error">
        <img src={vetorModalErrImg} alt="register-vetor-error" className="vetor-error-register"/>
        <div className="container-text-modal-error">
          <h4>Failed to register</h4>
          <p>Your password must have at least 8 characters, letters and numbers</p>
        </div>
        <button className="btn-close-modal-error">Close</button>
      </section>
    )}

    {modalRegisterErrorUser && (
      <section className="modal-register-error-user modal-error">
        <img src={vetorModalErrImg} alt="register-vetor-error" className="vetor-error-register"/>
        <div className="container-text-modal-error-user">
          <h4>Failed to register</h4>
          <p>User already exists</p>
        </div>
        <button className="btn-close-modal-error" onClick={() => navigate('/login')}>Login</button>
      </section>
    )}
  </main>
  )
}
export default Register