import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";
import "./App.css";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEdit, setIsEdit] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const submitHandler = (e) => {
    e.preventDefault();
    if (!name) {
      //display alert
      showAlert(true, "please enter value", "danger");
    } else if (name && isEdit) {
      //handle edit
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEdit(false);
    } else {
      showAlert(true, "Added one new item", "success");
      const newValues = { id: new Date().getTime().toString(), title: name };
      setList([...list, newValues]);
      setName("");
    }
  };
  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };
  const clearList = () => {
    showAlert(true, "Delete all item", "danger");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "You remove one item", "danger");
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id == id);
    setIsEdit(true);
    setEditID(id);
    setName(specificItem.title);
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={submitHandler}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} />}
        <h3>Grocery Bud</h3>
        <div className="form-control">
          {" "}
          <input
            type="text"
            className="grocery"
            value={name}
            placeholder="eg.egg"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button type="submit" className="submit-btn">
            {isEdit ? "Edit" : "Submit"}
          </button>
        </div>
      </form>

      <div className="grocery-container">
        <List items={list} removeItem={removeItem} editItem={editItem} />
        <button className="clear-btn" onClick={clearList}>
          Clear All
        </button>
      </div>
    </section>
  );
}

export default App;
