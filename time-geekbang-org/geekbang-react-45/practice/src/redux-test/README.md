# Redux 练习
- [Redux 练习](#redux-%e7%bb%83%e4%b9%a0)
  - [声明：](#%e5%a3%b0%e6%98%8e)
  - [参考：](#%e5%8f%82%e8%80%83)
  - [快速创建一个 Store](#%e5%bf%ab%e9%80%9f%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa-store)
  - [Action Creator](#action-creator)
  - [store.dispatch()](#storedispatch)
  - [Reducer](#reducer)
    - [为什么这个函数叫 Reducer 呢？](#%e4%b8%ba%e4%bb%80%e4%b9%88%e8%bf%99%e4%b8%aa%e5%87%bd%e6%95%b0%e5%8f%ab-reducer-%e5%91%a2)
  - [纯函数](#%e7%ba%af%e5%87%bd%e6%95%b0)
  - [store.subscribe()](#storesubscribe)
  - [Store 的实现](#store-%e7%9a%84%e5%ae%9e%e7%8e%b0)

## 声明：
用来确认自己把内容看进脑子的“复印”文章，只有少许理解，还有顺便方便自己复习。如果真有人看请移步下方参考的链接文章中学习。

## 参考：
- [阮一峰Redux入门教程（一）：基本用法](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
- [阮一峰Redux入门教程（二）：中间件与异步操作](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
- [阮一峰Redux入门教程（三）：React-Redux 的用法](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)


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
**Action** 可以理解为当前发生的事情。改变 **State** 的*唯一*办法。

## Action Creator
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
使用`store.subscribe()`来设置监听函数，一旦 State 发生变化，就自动执行这个函数(listener)。
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
