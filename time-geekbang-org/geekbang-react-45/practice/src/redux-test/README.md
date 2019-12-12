- [Redux 基础用法](#redux-%e5%9f%ba%e7%a1%80%e7%94%a8%e6%b3%95)
  - [快速创建一个 Store](#%e5%bf%ab%e9%80%9f%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa-store)
  - [Action](#action)
    - [Action Creator](#action-creator)
  - [store.dispatch()](#storedispatch)
  - [Reducer](#reducer)
    - [为什么这个函数叫 Reducer 呢？](#%e4%b8%ba%e4%bb%80%e4%b9%88%e8%bf%99%e4%b8%aa%e5%87%bd%e6%95%b0%e5%8f%ab-reducer-%e5%91%a2)
  - [纯函数](#%e7%ba%af%e5%87%bd%e6%95%b0)
  - [store.subscribe()](#storesubscribe)
  - [Store 的实现](#store-%e7%9a%84%e5%ae%9e%e7%8e%b0)
  - [Reducer 的拆分](#reducer-%e7%9a%84%e6%8b%86%e5%88%86)
    - [为什么要拆分](#%e4%b8%ba%e4%bb%80%e4%b9%88%e8%a6%81%e6%8b%86%e5%88%86)
  - [工作流程（总结）](#%e5%b7%a5%e4%bd%9c%e6%b5%81%e7%a8%8b%e6%80%bb%e7%bb%93)
- [高级用法](#%e9%ab%98%e7%ba%a7%e7%94%a8%e6%b3%95)

## 声明：
用来确认自己把内容看进脑子的“复印”文章，只有少许理解，还有顺便方便自己复习。如果真有人看请移步下方参考的链接文章中学习。

## 参考：
- [阮一峰Redux入门教程（一）：基本用法](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
- [阮一峰Redux入门教程（二）：中间件与异步操作](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
- [阮一峰Redux入门教程（三）：React-Redux 的用法](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)


# Redux 基础用法
## 快速创建一个 Store
快速创建一个对象（Redux 是单例模式创建的 Store）  
代码：
![](./images/2019-12-11-11-32-13.png)
控制台结果：
![](./images/2019-12-11-11-30-38.png)

- **Redux** 规定， 一个 **State** 对应一个 **View**。只要 **State** 相同，**View** 就相同。你知道 **State**，就知道 **View** 是什么样，反之亦然。
- **State** 的变化，会导致 **View** 的变化。但是，用户接触不到 **State**，只能接触到 **View**。所以，**State** 的变化必须是 **View** 导致的。**Action** 就是 **View** 发出的通知，表示 **State** 应该要发生变化了。

**Action** 是一个对象。其中的 `type` 属性是必须的，表示 **Action** 的名称。
```js
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
}
```

## Action
**Action** 可以理解为当前发生的事情。改变 **State** 的*唯一*办法。
![](./images/2019-12-12-15-20-09.png)

### Action Creator
**View** 要发送多少种消息，就会有多少种 **Action**。为了方便我们使用 **Action Creator** 函数来生成 **Action**。

```js
const ADD_TODO = '添加 TODO';

function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

const action = addTodo('Learn Redux');
```
这里的`addTodo`函数就是一个 **Action Creator**

## store.dispatch()
`store.dispatch()` 是 View 发出 Action 的唯一方法。
```js
import { createStore } from 'redux';
const store = createStore(fn);

store,dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
```
> `dispatch`本身是来自**Redux** 的 `createStore()` 所生成的对象中的一个方法，参数就是接收一个 **action**，将它发出去。参数也可以是一个 **Action Creator** 函数，它会返回一个**action**。

## Reducer
**Store** 收到 **Action** 之后，必须给出一个新的 **State**，这样 **View** 才会变化。这种 **State** 的计算过程就叫 **Reducer**。（这也是在 geektime 学习中没有弄清楚的内容）

```js
const reducer = function (state, action) {
  // ...
  return new_state;
}
```
应用的初始状态（默认呈现的状态），可作为 State 的默认值。
```js
const defaultState = 0;
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD':
      return state + action.payload;
    default:
      return state;
  }
};

const state = reducer(1, {
  type: 'ADD',
  payload: 2
});
```
**Reducer** 收到了一个`type: 'ADD'`的 Action，便在函数中实现了加的处理，state 从而更新了。  
  
实际应用`store.dispatch`方法会触发 **Reducer** 的自动执行，需要将 **Reducer** 传入 `createStore` 方法。
```js
import { createState } from 'redux';
const store = createStore(reducer);
```
这样将**reducer**作为`createStore`函数的参数传入，每当`store.dispatch`发送过来一个新的**Action**，就会自动调用 **Reducer**，得到新的 State。  
  
### 为什么这个函数叫 Reducer 呢？
因为它可以作为数组的 `reduce` 方法的参数(MDN对于 reduce 函数的函数参数就叫 reducer)。[Array.prototype.reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
```js
const actions = [
  { type: 'ADD', payload: 0 },
  { type: 'ADD', payload: 1 },
  { type: 'ADD', payload: 2 }
];

// reducer 是我们自己的处理函数
const total = actions.reduce(reducer, 0); // 3
```

## 纯函数
**Reducer** 函数最重要的特征是，它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出。  
纯函数是函数式变成的概念，必须遵守下一些约束。
- 不得改写参数
- 不能调用系统 I/O 的 API
- 不能调用`Date.now()`或者`Math.rendom()`等不纯的方法，因为**每次会得到不一样的结果**
由于 Reducer 是纯函数，就可以保证同样的 State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State,必须返回一个全新的对象，请参考下面的写法。(每次想要改变的 State，都会产生一个新的 State)  

like this:
```js
// State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}

// State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}
```

## store.subscribe()
使用`store.subscribe()`来设置监听函数，一旦 State 发生变化，就自动执行这个函数(listener)。(一般比如用来监听组件的render函数)
```js
import { createStore } from 'redux';
const store = createStore(reducer);

store.subscribe(listener);
```
store.subscribe方法返回一个函数，调用这个函数就可以解除监听。
```js
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

unsubscribe();
```
## Store 的实现
总结上面的内容
```js
import { createStore } from 'redux';
let { subscribe, dispatch, getState } = createStore(reducer);

/**
 * we can use:
 * store.getState()
 * store.dispatch()
 * store.subscribe()
 * /
```
createStore 方法还可以接收第二个参数，第二个参数表示 State 的最初状态，例如数据是从服务器拉取的默认值，那么这样设置就对了。
```js
let store = createStore(todoApp, window.STATE_FROM_SERVER)
```
如果提供了 `window.STATE_FROM_SERVER` ，那么它就是整个应用的初始值，**会覆盖 Reducer 函数的默认值**(本地设置的默认值优先级将会被代替)。  

`createStore`方法的简单实现：
```js
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};
```
## Reducer 的拆分
### 为什么要拆分
Reducer 函数负责生成(新的) State，由于整个应用只有一个 State 对象，包含所有数据，对于大型应用来说，这个 State 必然十分庞大，导致 Reducer 函数也十分庞大。  
所要用到的方案之前在学习的时候也知道，按照单一的功能进行拆分，不同的函数处理不同的属性，例如本来一个`switch`要`case`一系列毫无关系的`Action`(type)，就可以按照 Action 属性所表示的行为进行函数拆分，不同函数处理不同属性，最终把它们合并成一个大的 Reducer 即可。  


例如：
```js
const chatReducer = (state = defaultState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_CHAT:
      return Object.assign({}, state, {
        chatLog: state.chatLog.concat(payload)
      });
    case CHANGE_STATUS:
      return Object.assign({}, state, {
        statusMessage: payload
      });
    case CHANGE_USERNAME:
      return Object.assign({}, state, {
        userName: payload
      });
    default: return state;
  }
};

// -------- 拆分后再组合成一个Reducer：
const chatReducer = (state = defaultState, action = {}) => {
  return {
    chatLog: chatLog(state.chatLog, action),
    statusMessage: statusMessage(state.statusMessage, action),
    userName: userName(state.userName, action)
  }
};

```
这时候就好理解之前课程中学习到的Redux提供的`combineReducers`方法了，这个方法的作用就是将 Reducer 合并成一个大的函数。
```js
import { combineReducers } from 'redux';

const chatReducer = combineReducers({
  chatLog,
  statusMessage,
  userName
})

// 如果 State 的属性名与 Reducer 不同名，就需要像下面这样：
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})

// 等同于
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  }
}

export default todoApp;
```
也可以把所有子 Reducer 放在一个文件中，之后统一引入：
```js
import { combineReducers } from 'redux'
import * as reducers from './reducers'

const reducer = combineReducers(reducers)
```

## 工作流程（总结）
![](./images/2019-12-12-16-01-33.png)
- 首先，用户发出 Action。
```js
store.dispatch(action);
```
(比如用户点击了组件（view）上的一个按钮，按钮绑定了`click`事件，事件会触发`dispatch`，`dispatch`的参数是我们之前设定好的`action`，`action`是一个具有标识，并且用`type`属性简单说明的普通对象)

- Store 自动调用 Reducer,并且传入两个参数：当前 State（最初的数据）和收到的 Action（需要改变的数据），Reducer 是个纯函数，不会对传入的参数进行修改，所以会返回一个新的 State。

- State 一旦有变化，Store 就会调用监听函数。
```
// 设置监听函数，例如组件的 render 函数
store.subscribe(listener);
```
- listener 可以通过 `store.getState()` 得到当前状态。如果用的是 React，这时可以触发重新渲染 View。


# 高级用法
...