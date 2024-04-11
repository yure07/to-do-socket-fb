//packages
import auth from '../../firebaseConnection'
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'

//style
import './style.css'

//route
import { Link } from "react-router-dom"

//images
import clockImg from '../../assets/images/clock-image.png'
import tasksImg from '../../assets/images/tasks-image.png'
import googleIcon from '../../assets/images/google-icon.webp'
import vetorModalImg from '../../assets/images/vetor-modal-login.png'
import iconCloseImg from '../../assets/images//icon-close.png'
import vetorModalErrImg from '../../assets/images/vetor-modal-login-error.png'

const Login = () => {
  return(
    <main class="main-container-login">
      <article class="aside-presentation">
        <img src={clockImg} alt="clock" class="clock-img"/>
        <section class="text-todo-presentation">
          <p>Everything you </p>
          <p>need to do in one</p>
          <p>place.</p>
        </section>
        <img src={tasksImg} alt="tasks" class="tasks-img"/>
    </article>
    <article class="form-main-container">
      <section class="form-container">
        <h1 class="text-login">Login</h1>
        <input type="text" placeholder="Email Address" id="input-email"/>
        <input type="password" placeholder="Password" id="input-password"/>
        <button class="btn-login" id="btn-login">Login</button>
        <p class="text-alternative-login-account">Or</p>
        <button class="btn-login signin-google" id="signin-google">
          <img src={googleIcon} alt="icon-google"/>
          Login with Google
        </button>
        <p class="text-no-account">Do not have an account yet?</p>
        <Link to="register" class="text-no-account" id="text-no-account">Sign up</Link>
      </section>
    </article>
    <section class="modal-login-success" id="modal-login-success">
      <div class="container-left">
        <img src={vetorModalImg} alt="login-vetor" class="login-check-vetor"/>
        <p>Login successfully</p>
      </div>
      <div class="container-right">
        <button class="btn-redirect-modal-login">redirecting...</button>
        <img src={iconCloseImg} alt="close-modal-icon" class="close-modal-login"/>
      </div>
    </section>
    <section class="modal-login-error" id="modal-login-error">
      <img src={vetorModalErrImg} alt="login-vetor-error"/>
      <div class="container-text-modal-error">
        <h4>Failed to login</h4>
        <p>An error occurred, check if the password and/or email are correct</p>
      </div>
      <button class="btn-close-modal-error">Close</button>
    </section>
  </main>
  )
}
export default Login