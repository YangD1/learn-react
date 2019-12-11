import { createStore } from "redux";
import React from "react";

// reducer
function fn(){
  console.log('reducer fn!')
}
const store = createStore(fn); // 这里的 createStore 接受一个函数作为参数
console.log(store)

export default class ReduxTest extends React.Component {
  render() {
    return (
      <div>打开开发工具查看Redux的Store数据</div>
    )
  }
}