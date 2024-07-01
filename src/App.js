import './App.css';
import {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQmOM_BbX8QIDnxuS5dUTuRfJkQ28Wnr8",
  authDomain: "todo-list-e15e6.firebaseapp.com",
  projectId: "todo-list-e15e6",
  storageBucket: "todo-list-e15e6.appspot.com",
  messagingSenderId: "1056973131778",
  appId: "1:1056973131778:web:b5d5fb6d6827fa1304571b",
  measurementId: "G-79194YHS2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const db = getFirestore(app);

const TodoItemInputField = (props) => {
  const [input, setInput] = useState("");

  const onSubmit = () => {
    props.onSubmit(input);
    setInput("");
  }
  return (
    <div>
      <TextField
        id="todo-item-input"
        label="Todo Item"
        variant="outlined"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <Button variant="outlined" onClick={onSubmit}>Submit</Button>
    </div>
  );
};

const TodoItem = (props) => {
  const style = props.todoItem.isFinished ? { textDecoration: 'line-through' } : {};
   return (<li>
     <span style={style} onClick={() => props.onTodoItemClick(props.todoItem)}>{props.todoItem.todoItemContent}</span>
     <Button variant="outlined" onClick={() => props.onRemoveClick(props.todoItem)}>Remove</Button>
   </li>);
 };


const TodoItemList = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => {
    return <TodoItem
      key={index}
      todoItem={todoItem}
      onTodoItemClick={props.onTodoItemClick}
      onRemoveClick={props.onRemoveClick}
    />;
  });
  return (<div>
    <ul>{todoList}</ul>
  </div>);
};


function App() {
  const [todoItemList, setTodoItemList] = useState([]);

  const onSubmit = async (newTodoItem) => {
    const docRef = await addDoc(collection(db, "todoItem"), {
      todoItemContent: newTodoItem,
      isFinished: false,
    });

    setTodoItemList([...todoItemList, {
      id: docRef.id,
      todoItemContent: newTodoItem,
      isFinished: false,
    }]);
    console.log(docRef.id);
  };

  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, {isFinished: !clickedTodoItem.isFinished}, {merge: true});

    setTodoItemList(todoItemList.map((todoItem) => {
      if(clickedTodoItem.id === todoItem.id){
        return {
          id: clickedTodoItem.id,
          todoItemContent: clickedTodoItem.todoItemContent,
          isFinished: !clickedTodoItem.isFinished,
        };
      }
      else{
        return todoItem;
      }
    }));
  };

  const onRemoveClick = async (removedTodoItem) => {
    const todoItemTef = doc(db, "todoItem", removedTodoItem.id);
    await deleteDoc(todoItemTef);
    setTodoItemList(todoItemList.filter((todoItem) => {
      return todoItem.id !== removedTodoItem.id;
    }));
  };


  return (
    <div className="App">
      <TodoItemInputField onSubmit={onSubmit} />
        <TodoItemList 
          todoItemList={todoItemList}
          onTodoItemClick={onTodoItemClick}
          onRemoveClick={onRemoveClick}
        />
    </div>
  );
}

export default App;
