# React 官网文档学习
[文档地址(v16.9.0)](https://zh-hans.reactjs.org/docs/getting-started.html)
# 核心概念
## JSX
### 什么是JSX：
![avatar](./images/WX20190925-171841.png)
JSX 是 React 重要的一个特性，可以用于更直观友好的管理代码。（不过当初我第一次使用 J）

### JSX 中潜入表达式
```javascript
const name = "YonDee";
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
)
```
注意这里的 `{name}` 在JSX中用大括号`{}`来使用表达式。
> 在 JSX 语法中，可以在打括号内放置任何有效的 JavaScript 表达式。<br />
例如: `2+2` 一个计算表达式, `user.firstName` 访问一个对象属性, `formatName(user)` 函数调用

函数使用示例：
```javascript
function formatName(user){
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Yon',
  lastName: 'Dee'
};

// 使用括号 '()' 来将 JSX 拆分成多行
const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getELementById('root')
);
```

### JSX 也是一个表达式
在编译之后，JSX 表达式会被转为普通 JavaScript 函数调用，并且对其取值后得到 JavaScript 对象。

也就是说，可以在 `if` 语句和 `for` 循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX。
```javascript
// 之前 tic-tac-toe 循环渲染方块
render() {
  let element = [];
  for (let index = 0; index < 3; index++) {
    const i = (index + 1) * 3
    element.push(
      <div className="board-row" key={i}>
        {this.renderSquare(i - 3)}
        {this.renderSquare(i - 2)}
        {this.renderSquare(i - 1)}
      </div>
    );
  }
  return (
    <div>
      { element }
    </div>
  );
}
```
这里的 JSX 用`push`向`element`推入，数组`element`最终在另一个 JSX 中使用。

### JSX 特定属性
```javascript
// 可以通过引号，来将属性值指定为字符串字面量
const element = <div tabIndex="0"></div>;
```
```javascript
// 在属性中嵌入JSX表达式，不要在打括号外面加上引号。引号——对于字符串值，大括号——对于表达式
const element = <img src={user.avatarUrl}></img>;
```
> 因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 camelCase (小驼峰命名)来定义属性的名称，而不使用 HTML 属性名称的命名规定。
<br />
JSX 中的 class 变成了 className, 而 tabIndex 变为 tabIndex

### 使用 JSX 指定子元素
```javascript
// 加入一个标签里没有内容，可以使用 `/>`，就像 XML 语法一样
const element = <img src={user.avatarUrl} />;

// JSX 标签里能够包含很多子元素
const element = (
  <div>
    <h1>Hello!</h1>
    <h1>Good to see you here.</h1>
  </div>
)
```

### JSX 防止注入攻击
```javascript
// 可以安全的在JSX中插入用户输入内容
const title = response.potentiallMaliciousInput;
const element = <h1>{title}</h1>;
```
> React DOM 在渲染所有输入内容之前，默认会进行转义。可以有效防止XSS攻击。

### JSX 表示对象
Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。
```javascript
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
)

// 等效于下面
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```
`React.createElement()` 会预先执行一些检查。创建了如下这样的对象：
```javascript
// 注：这是个简化过的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
}
```
这些对象被称为 “React 元素”。它们描述了你希望在屏幕上看到的内容。React 通过读取这些对象，然后使用它们来构建 DOM 以及保持随时更新。


# 元素渲染
## 概念
```
元素是构成 React 应用的最小砖块
元素描述了你在屏幕上想看到的内容。
```
> 组件是由元素构成的，两个并不是一个概念。

## 讲一个元素渲染为 DOM
假设一个根节点
```html
<div id="root"></div>
```
```javascript
// 先创建需要添加到根节点中的 React 元素
const element = <h1>Hello world!</h1>;
// 使用 ReactDOM.render() 方法传入
ReactDOM.render(element, document.getElementById('root'));
```

> 仅使用 React 构建的应用通常只有单一的根 DOM 节点。如果你在将 React 集成进一个已有应用，那么你可以在应用中包含任意多的独立根 DOM 节点。

## 更新已渲染的元素
React 元素是不可变对象，创建了就无法更改它的子元素或者属性。
> 官网这个形容特别好：一个元素就像电影的单帧：它代表了某个特定时刻的 UI。

根据现有的知识(组件无状态)，想要更新UI的方式，是创建一个新的元素，传入`ReactDOM.render()`，也就是替换掉之前渲染的元素。

> 一般一个应用只调用一次 `ReactDOM.render()`，所以需要将代码封装到有状态组件中。

## React 只更新它需要更新的部分
React DOM 会将元素和它的子元素与它们之前的状态进行比较，只进行必要的更新，来使 DOM 达到预期的状态。
