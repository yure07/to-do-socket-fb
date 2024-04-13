import './style.css'

import { useState } from 'react'
import { useEffect } from 'react'

import { doc, addDoc, updateDoc, collection, getDocs } from 'firebase/firestore'

import { db } from '../../firebaseConnection'

import userIcon from '../../assets/images/user-icon.png'
import settingsIcon from '../../assets/images/settings-icon.png'
import previousIcon from '../../assets/images/previous-icon.png'
import deleteBtnIcon from '../../assets/images/delete-button-list.png'
import bgTasks from '../../assets/images/bg-tasks.png'
import closeListIcon from '../../assets/images/icon-close-lists.png'
import checkIcon from '../../assets/images/check-icon.png'
import addIcon from '../../assets/images/add-icon.png'
import shapeIcon from '../../assets/images/Shape.png'
import rocketIcon from '../../assets/images/icon-rocket.png'

const Lists = () => {
  const [noTasks, setNoTasks] = useState(false)
  const [dataTask, setDataTask] = useState(false)

  const [modalAddList, setModalAddList] = useState(false)
  const [modalAddTask, setModalAddTask] = useState(false)
  const [modalInvite, setModalInvite] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)

  const [titleList, setTitleList] = useState('')
  const [descriptionList, setDescriptionList] = useState('')
  const [childrenOptions, setChildrenOptions] = useState()

  const [currentList, setCurrentList] = useState()

  const id_user = localStorage.getItem('@id_user')

  useEffect(() => {
    const list_task_user = JSON.parse(localStorage.getItem(`@list_user${id_user}`))
    if(!list_task_user){
      setNoTasks(true)
      setDataTask(false)
    } else {
      loadLists()
      setDataTask(true)
    }
  }, [])

  const loadLists = () => {
    const list_container = document.getElementById("list-container")
    const list_task_user = JSON.parse(localStorage.getItem(`@list_user${id_user}`))
    list_task_user.map((list) => {
      const div_count_lists = document.createElement('div')
      div_count_lists.classList = 'count-lists'

      const title_new_list = document.createElement('p')
      title_new_list.innerHTML = list.title

      const description_new_list = document.createElement('span')
      description_new_list.innerHTML = list.description

      div_count_lists.appendChild(title_new_list)
      div_count_lists.appendChild(description_new_list)
      list_container.appendChild(div_count_lists)
    })
  }

  const createNewList = async (nameList, descriptionList, idUser) => {
    await addDoc(collection(db, `${nameList}, ${descriptionList}, ${idUser}`), {})
    .then(() => {
      console.log('nova coleção vazia criada com sucesso')
    })
    .catch((error) => {
      console.log(error)
    })
  }
  
  const addListOnScreen = () => {
    const list_container = document.getElementById("list-container")
    setChildrenOptions(Array.from(list_container.children))

    const div_count_lists = document.createElement('div')
    div_count_lists.classList = 'count-lists'

    const title_new_list = document.createElement('p')
    title_new_list.innerHTML = titleList

    const description_new_list = document.createElement('span')
    description_new_list.innerHTML = descriptionList

    div_count_lists.appendChild(title_new_list)
    div_count_lists.appendChild(description_new_list)
    list_container.appendChild(div_count_lists)

    const list_user = `@list_user${id_user}`
    let list_already_save = JSON.parse(localStorage.getItem(list_user))

    if(!list_already_save) list_already_save = []

    list_already_save.push({
      title: titleList,
      description: descriptionList
    })
    localStorage.setItem(list_user, JSON.stringify(list_already_save))
  }


  const loadTasks = async (title, description, idUser) => {
    const querySnapshot = await getDocs(collection(db, `${title}, ${description}, ${idUser}`));
    querySnapshot.forEach((doc) => {

      if(doc.data().user_id === id_user){
        const task = document.createElement('div')
        if(doc.data().progress === 'Doing'){
          task.classList = 'task task-doing'
        }
        else if(doc.data().progress === 'To Do'){
          task.classList = 'task'
        }
        else if(doc.data().progress === 'Done'){
          task.classList = 'task task-done'
        }

        const container_top_task = document.createElement('div')
        container_top_task.classList = 'container-top-task'
        
        const div_title_task = document.createElement('div')
        div_title_task.classList = 'title-task'

        const img_paper_icon = document.createElement('img')
        img_paper_icon.src = shapeIcon

        const title_task_content = document.createElement('p')
        title_task_content.innerHTML = doc.data().title

        const rocket_img_select = document.createElement('img')
        rocket_img_select.src = rocketIcon
        rocket_img_select.classList = 'rocket-icon'

        const select_progress_task = document.createElement('select')
        select_progress_task.classList = 'select-current'
        select_progress_task.onclick = () => {
          updateSelect(select_progress_task.value, doc.id, title, description, idUser)
        }
      }
    })
  }

  const updateSelect = (value, idDoc, titleList, descriptionList, idUserList) => {
    const docRef = doc(db, `${titleList}, ${descriptionList}, ${idUserList}`, idDoc)
    const newProgress = {
      progress: value
    }
    handleUpdateTask(docRef, newProgress)
  }

  const handleUpdateTask = async (docRef, newData) => {
    await updateDoc(docRef, newData)
    .then(() => {
      console.log('documento atualizado com sucesso')
    })
    .catch((error) => {
      console.log('erro: ', error)
    })
  }

  const cleanStylesOnList = () => {
    childrenOptions.forEach(element => {
      element.style.backgroundColor = '#fff'
      element.style.borderRight = 'none'
    })
  }
    
  const applyStylesOnList = (element) => {
    cleanStylesOnList()
    element.style.backgroundColor = '#8080804D'
    element.style.borderRight = '3px solid #5AC7AA'
    const title_open_list = element.children[0].innerHTML
    const description_open_list = element.children[1].innerHTML
    if(currentList && currentList.title === title_open_list) return
    setCurrentList({
      title: title_open_list,
      description: description_open_list,
      idUser: id_user
    })
    titleList.innerHTML = currentList.title
    loadTasks(title_open_list, description_open_list, id_user)
  }

  const list_container = document.getElementById("list-container")
  const children_list_container = Array.from(list_container.children)
  childrenOptions && childrenOptions.slice(1).forEach((list) => {
    list.addEventListener('click', () => {
      applyStylesOnList(list)
    })
  })

  return(
    <main className="container-page-lists">
    <aside className="sidebar-container">
      <section className="menu-sidebar">
        <div className="container-top-menu-sidebar">
          <img src={userIcon} alt="icon-user" className="img-profile-user" id="img-profile-user"/>
          <img src={settingsIcon} alt="icon-settings"/>
        </div>
        <img src={previousIcon} alt="icon-previous" id="icon-previous"/>
      </section>
      <section className="list-container" id="list-container">
        <header className="header-list-container">
          <h1>Lists</h1>
          <button id="btn-open-modal" onClick={() => setModalAddList(!modalAddList)}>+</button>
        </header>
      </section>
    </aside>

    {dataTask && (
      <article className="data-tasks" id="data-tasks">
        <section className="header-list">
          <h1 className="title-list" id="title-list"></h1>
          <div className="actions-header-list">
            <button className="btn-delete-list" onClick={() => setModalDelete(!modalDelete)}>
              <img src={deleteBtnIcon} alt="delete-button"/>
            </button>
            <button 
              className="btn-add-to-do btn-list" 
              onClick={() => setModalAddTask(!modalAddTask)}>
              + Add Todo
            </button>
            <button 
              className="btn-invite-people btn-list" 
              onClick={() => setModalInvite(!modalInvite)}>
              + Invite People
            </button>
          </div>
        </section>
        <section className="labels-tasks">
          <div className="progress-label-task">
            To Do
            <div className="container-tasks-list to-do" id="tasks-to-do">
              {/* task */}
            </div>
          </div>

          <div className="progress-label-task">
            Doing
            <div className="container-tasks-list doing" id="tasks-doing">
              {/* task */}
            </div>
          </div>

          <div className="progress-label-task">
            Done
            <div className="container-tasks-list done" id="tasks-done">
              {/* task */}
            </div>
          </div>
        </section>
      </article>
    )}

    {noTasks && (
      <article className="container-tasks" id="container-tasks">
        <img src={bgTasks} alt="bg-no-tasks"/>
        <p id="start-new-list-text" onClick={() => setModalAddList(true)}>Select a list or start a new one</p>
      </article>
    )}
    
    {modalAddList && (
      <section className="modal-add-list" id="modal-add-list">
        <header className="header-modal-add-list">
          <p>List</p>
          <button id="btn-close-modal">
            <img 
              src={closeListIcon} 
              alt="icon-close-modal-img" 
              onClick={() => setModalAddList(false)}
            />
          </button>
        </header>
        <div className="container-inputs">
          <label>Title</label>
          <input 
            type="text" 
            placeholder="Make the dinner" 
            onChange={(e) => setTitleList(e.target.value)}
          />
          <label>Member</label>
          <input type="text" placeholder="James" id="input-member-list"/>
          <label>Description</label>
          <input 
            type="text" 
            placeholder="Buy mass and tomato in the market" 
            onChange={(e) => setDescriptionList(e.target.value)}
          />
        </div>
        <button 
          onClick={() => {
            if(titleList !== '' || descriptionList !== ''){
              createNewList(titleList, descriptionList, id_user)
              addListOnScreen()
              setModalAddList(false)
              setDataTask(true)
              loadTasks(titleList, descriptionList, id_user)
            } else alert('Preencha todos os campos!')
          }}>
          <img src={checkIcon} alt="check-icon-modal"/>
          Save
        </button>
      </section>
    )}

    {modalAddTask && (
      <section className="modal-add-task" id="modal-add-task">
        <header className="header-modal-add-task">
          <p>To do</p>
          <button id="btn-close-modal-task">
            <img 
              src={closeListIcon} 
              alt="icon-close-modal-img" 
              className="icon-close-modal-add-task"
              onClick={() => setModalAddTask(false)}  
            />
          </button>
        </header>
        <div className="container-inputs">
          <label>Title</label>
          <input type="text" placeholder="Make the dinner" id="title-task"/>
          <label>Progress</label>
          <select name="progress" id="progress-task">
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
          <label>Member</label>
          <select name="progress" id="member-task">
            <option value="Yure">Yure</option>
            <option value="Joao">Joao</option>
            <option value="Lucas">Lucas</option>
            <option value="Emma">Emma</option>
          </select>
          <label>Description</label>
          <input type="text" placeholder="Buy mass and tomato in the market" id="description-task"/>
        </div>
        <button id="add-new-task" className="btn-add-task">
          <img src={checkIcon} alt="check-icon-modal"/>
          Save
        </button>
      </section>
    )}

    {modalInvite && (
      <section className="modal-invite-people" id="modal-invite-people">
        <header className="header-modal-invite-people">
          <p>Invite People</p>
          <button id="btn-close-modal-invite">
            <img 
              src={closeListIcon} 
              alt="icon-close-modal-img" 
              className="icon-close-modal-invite-people"
              onClick={() => setModalInvite(false)}
            />
          </button>
        </header>
          <div className="container-inputs">
            <label>Email</label>
            <input type="text" id="email-invite" placeholder="person@email.com"/>
            <label>Nome</label>
            <input type="text" id="name-invite" placeholder="lorem ipsum"/>
          </div>
          <button className="btn-add-new-people" id="btn-invite-people-inside">
            <img src={addIcon} alt="add-icon-modal"/>
            Invite
          </button>
      </section>
    )}

    {modalDelete && (
      <section className="modal-delete-list" id="modal-delete-list">
        <button id="btn-close-modal-delete-list">
          <img 
            src={closeListIcon} 
            alt="icon-close-modal-img" 
            className="icon-close-modal-invite-people"
            onClick={() => setModalDelete(false)}
          />
        </button>
        <h1>Do you really want to delete this list?</h1>
        <div className="btns">
          <button className="btn-confirm-delete-list" id="btn-confirm-delete-list">Confirm</button>
          <button className="btn-cancel-delete-list" id="btn-cancel-delete-list" onClick={() => setModalDelete(false)}>Cancel</button>
        </div>
      </section>
    )}
  </main>
  )
}
export default Lists