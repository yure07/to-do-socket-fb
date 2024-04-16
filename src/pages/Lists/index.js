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
  const [progressTask, setProgressTask] = useState('To Do')
  const [memberTask, setMemberTask] = useState('')

  const [tileTask, setTitleTask] = useState('')
  const [descriptionTask, setDescriptionTask] = useState('')

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

      div_count_lists.onclick = () => {
        applyStylesOnList(div_count_lists)
      }

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

  const addNewTask = async () => {
    if(tileTask === '' || descriptionTask === '') alert('Por favor preencha todos os campos!')
    else {
      try {
        await addDoc(collection(db, `${currentList.title}, ${currentList.description}, ${id_user}`), {
          title: tileTask,
          progress: progressTask,
          member: memberTask,
          description: descriptionTask,
          user_id: id_user
        })
        setModalAddTask(false)
      } catch (error) {
        console.log(error)
      }
    }
  }
  
  const addListOnScreen = () => {
    const list_container = document.getElementById("list-container")

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
    const tasks_to_do = document.getElementById("tasks-to-do")
    const tasks_doing = document.getElementById("tasks-doing")
    const tasks_done = document.getElementById("tasks-done")
    cleanTasksOnScreen(tasks_to_do)
    cleanTasksOnScreen(tasks_doing)
    cleanTasksOnScreen(tasks_done)
    const querySnapshot = await getDocs(collection(db, `${title}, ${description}, ${idUser}`));
    querySnapshot.forEach((doc) => {
      /* console.log(title, description, idUser)
      console.log(doc.id)
      console.log(doc.data()) */
      
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

        const options1 = ['To Do', 'Doing', 'Done']
        const options2 = ['Doing', 'To Do', 'Done']
        const options3 = ['Done', 'To Do', 'Doing']

        let options
        if(doc.data().progress === 'To Do') options = options1
        else if(doc.data().progress === 'Doing') options = options2
        else options = options3
        options.forEach((optionText) => {
          const option = document.createElement('option')
          option.text = optionText
          option.value = optionText
          select_progress_task.add(option)
        })
        
        const container_bottom_task = document.createElement('div')
        container_bottom_task.classList = 'container-bottom-task'
        
        const description_task = document.createElement('p')
        description_task.innerHTML = doc.data().description
        
        const div_member_task = document.createElement('div')
        div_member_task.classList = 'member-task'

        const img_profile_icon = document.createElement('img')
        img_profile_icon.src = '../assets/profile-small-icon.png'
        
        const member_task = document.createElement('span')
        member_task.innerHTML = doc.data().member
        
        div_member_task.appendChild(img_profile_icon)
        div_member_task.appendChild(member_task)
        container_bottom_task.appendChild(description_task)
        container_bottom_task.appendChild(div_member_task)
        div_title_task.appendChild(img_paper_icon)
        div_title_task.appendChild(title_task_content)
        container_top_task.appendChild(div_title_task)
        container_top_task.appendChild(rocket_img_select)
        container_top_task.appendChild(select_progress_task)
        task.appendChild(container_top_task)
        task.appendChild(container_bottom_task)

        if(doc.data().progress === 'To Do'){
          tasks_to_do.appendChild(task)
        }
        else if(doc.data().progress === 'Doing'){
          tasks_doing.appendChild(task)
        }
        else{
          tasks_done.appendChild(task)
        }

      }
    })
  }

  const cleanTasksOnScreen = (divParent) => {
    while (divParent.firstChild){
      divParent.removeChild(divParent.firstChild)
    }
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
    const list_container = document.getElementById("list-container")
    const children = [...list_container.children]
    children.forEach((list) => {
      if(list.style.backgroundColor === 'rgba(128, 128, 128, 0.3)'){
        list.style.backgroundColor = '#fff'
        list.style.borderRight = 'none'
      }
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
    setTitleList(title_open_list)
    loadTasks(title_open_list, description_open_list, id_user)
  }

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
          <h1 className="title-list" id="title-list">{currentList ? currentList.title : 'Selecione uma Lista'}</h1>
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
          <input 
            type="text" 
            placeholder="Make the dinner" 
            onChange={(e) => setTitleTask(e.target.value)}
          />
          <label>Progress</label>
          <select 
            name="progress" 
            id="progress-task" 
            onChange={(e) => setProgressTask(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
          <label>Member</label>
          <input
            type='text'
            placeholder='Member'
            onChange={(e) => setMemberTask(e.target.value)}
          />
          <label>Description</label>
          <input 
            type="text" 
            placeholder="Buy mass and tomato in the market" 
            onChange={(e) => setDescriptionTask(e.target.value)}
          />
        </div>
        <button 
          className="btn-add-task"
          onClick={() => addNewTask()}>
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