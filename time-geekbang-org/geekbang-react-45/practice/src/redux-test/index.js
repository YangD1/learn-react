import { createStore } from "redux";
import React from "react";

let defaultState = 0;
const action = {
  type: 'ADD',
  payload: 1
};
function reducer(state = defaultState, action) {
  // let newState = []
  switch(action.type){
    case "ADD":
      return state + action.payload
  }
  // return {...state, ...newState}
}
const store = createStore(reducer); // 这里的 createStore 接受一个函数作为参数

store.dispatch(action)

console.log(store.getState())

export default class ReduxTest extends React.Component {
  render() {
    return (
      <div>
        <span>{}</span>
      </div>
    )
  }
}