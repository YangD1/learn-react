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

## 将一个元素渲染为 DOM
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

# 组件 & Props
组件允许你将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思。

## 概念
组件，从概念上类似于 JavaScript 函数。它接受任意的入参（props）,并返回用于描述页面展示内容的 React 元素。

## 函数组件与 class 组件
定义组件最简单的方式就是编写 JavaScript 函数：
```javascript
funciton Welcome(props){
  return <h1>Hello, {props.name}</h1>;
}
```
该函数是一个有效的 React 组件，因为它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。这类组件被称为“函数组件”，因为它本质上就是 JavaScript 函数。(因为这个结构和数据交互逻辑达到了组件所需的程度)

还有一种比较常见的方式（ES6 class）:
```javascript
class Welcome extends React.Component {
  render() {
    // 注意这里相对于函数组件的区别，props对象由this访问
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
组件等效于上面的函数组件

## 渲染组件
React 元素除了 HTML 标签还可以是用户自定义的组件：
```javascript
// 调用用户自定义声明好的 Welcome 组件
const element = <Welcome  name="Sara" />;
```
当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）转换为单个对象传递给组件，这个对象被称之为 “props”。（比如上面代码中的`name='Sara'`）

此时调用`ReactDOM.render()`将会渲染出组件中的 React 元素，按照传入的 props 显示相应的内容。

发生的步骤如下：
1. 调用 `ReactDOM.render()` 函数，并传入`<Welcome name="Sara" />`(`element`变量) 作为参数。
2. React 调用 `Welcome` 组件，并将 `{name: 'Sara'}`(组件标签中的`name='Sara'`属性转的单个对象) 作为 props 传入。
3. `Welcome` 组件将 `<h1>Hello, Sara</h1>` 元素作为返回值。
4. `ReactDOM`将`DOM`高效地更新为`<h1>Hello, Sara</h1>`(返回的 HTML 元素和 React 元素差不多，除了我们自定义的内容由 props 决定了。)

> 注意： **组件名称必须以大写开头**<br />
React 将以小写字母开头的组件,视为原生 DOM 标签。<br />
例如，`<div />` 代表 HTML 的 div 标签，而 `<Welcome />` 则代表一个组件，并且需在作用域内使用 Welcome。

## 组合组件
组件可以在其输出中引用其他组件。这就可以让我们用同一组件来抽象出任意层次的细节。（在组件中组合别的组件来渲染出所预期的 DOM） 。按钮，表单，对话框，甚至整个屏幕的内容：在 React 应用程序中，这些通常都会以组件的形式表示。（组件尽可能的简单，通过组合使用组件来尽可能的解耦）

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      // 这里使用了三个上面定义的 Welcome 组件,组成了新的 App组件
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,  // 这个组件里包含了三个 Welcome 组件
  document.getElementById('root')
);
```

## 提取(拆分)组件
将组件拆分为更小的组件，提取组件可能是一件繁重的工作，但是，在大型应用中，构建可复用组件库是完全值得的。(拆分的越细复用程度越高，唯一缺点就是组件数量多，需要管理好维护好拆分的组件。)

## Props 的只读属性
组件无论是使用函数声明还是通过 class 声明，都决不能修改自身的 props。
> 所有 React 组件都必须像纯函数(相同的入参返回相同的结果，而不是在函数内部改变参数内容)一样保护它们的 props 不被更改。

