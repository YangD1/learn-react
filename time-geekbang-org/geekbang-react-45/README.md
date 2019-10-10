# 【极客时间】React实战进阶45讲

地址：[极客时间](https://time.geekbang.org/course/intro/100)

## 初步理解 React 组件
### 以组件化的方式思考UI的构建
用react来描述一个html页面，将UI组织成组件树的形式
```javascript
class CommentBox extends React.Component{
	render(){
	  <div className="comment-box">
		<h1>Comments</h1>
		<CommentList />
		<CommentForm />
	  </div>
	};
}

// use
ReactDOM.render(
	<CommentBox />
)
```
个人理解：
首先我声明了一个CommentBox的类， 这个类继承了Component类，我们向这个类中传递一个方法参数，方法为`render(){}`，方法中使用html标签写了一个组件，组件中嵌套了组件 CommentList 和 CommentForm 。值得注意的是按照平常的写法标签中的class写成了Element中的className属性。

> ES5利用原型链来实现继承，在ES6中使用class和extends语法糖，旨在更加清晰方便的呈现继承关系

### 什么是React组件
![avatar](./images/179A570A-1495-4230-A83B-020619D38628.png)

1. React组件一般不提供方法，而是某种状态机
2. React组件可以理解为一个纯函数
3. 单向数据绑定（不是双向数据绑定）

> 单项绑定：把Model绑定到View，当我们用JavaScript代码更新Model时，View就会更新。
> 双向绑定：更新了View，Model数据也自动被更新了。
> 优缺点方面，双向比单向更加消耗性能

一般创建一个react组件需要考虑到：
1. 静态UI
2. 组件的状态组成
3. 组件的交互方式

### React组件的类型
两种类型：
1. 受控组件 - 表单元素状态由使用者维护
2. 非受控组件 - 表单元素状态 DOM 自身维护

### React 组件的创建原则
1. 单一指责原则
	- 每个组件只做一件事
	- 组件复杂拆分小组件（性能问题，组件过大刷新的性能损耗越大，反之拆分后变成小组件性能损耗也就越小。）
2. 数据状态管理：DRY(Don’t Repeat Yourself)原则
	 - 能计算得到的状态就不要单独存储（用的时候计算获取，不需要单独存储）
	 - 组件尽量无状态，所需数据通过props获取

## 什么是 JSX
JSX的本质：动态创建组件的语法糖
![avatar](./images/CB9CDD74-AA99-44C1-983A-A2344CC0F6BB.png)
如图所示，如果不使用JSX，那么我们就需要调用React的`createElement()`方法来创建我们想要渲染的元素。

JSX 的特点：
- JSX 本身也是表达式 `const element = <h1>Hello, world!</h1>;`
- 在属性中使用表达式 `<MyComonent foo={1 + 2 + 3 + 4} />`
- 延展属性(扩展运算符 - ES6)
```js
const props = {firstName: 'Ben', lastName: 'Hector'};
const greeting = <Greeting {...props} />;
```
- 表达式作为子元素 `const element = <li>{props.message}</li>`
> 用打括号`{}`包含JavaScript的表达式

JSX 的优点：
1. 声明式创建界面的直观
2. 代码动态创建界面的灵活（利用`state`和`props`来管理组件的呈现方式和内容）
3. 无需学习新的模版语言（区别于模版引擎的优势）

约定：自定义组件以大些字母开头
1. React 认为小写的 tag 是原生 DOM 节点, 例如`<div>`
2. 大写字母开头为自定义组件 (已经创建好的类(class)组件或者组件函数)
3. JSX 标记可以直接使用属性语法，例如`<menu.item />`(这可以忽略自定义组件大写开头的约定)

## 声明周期和使用场景
生命周期的阶段：
1. Render 阶段（纯净且没有副作用，可能会被React暂停终止或重新启动）
2. PreCommit 阶段（没有真正的去更新DOM，可以读取DOM）
3. Commit 阶段（DOM更新，可以使用 DOM，运行副作用，安排更新）

> 生命周期图
![avatar](../../reactjs-docs/images/2590688E-8EF6-46E6-9763-1829115A013D.png)
红框是不常用的生命周期

### constructor
1. 用于初始化内部状态，很少使用
2. 唯一可以直接修改 state 的地方
> 需要初始化的时候一般会丢给别的生命周期去做

### getDerivedStateFromProps*(16.3 新引入)
1. 当 state 需要 props 初始化时使用
2. 尽量不要使用：维护两者状态一致性会增加复杂度
3. 每次 render 都会调用
4. 典型场景： 表单空间获取默认值

### componentDidMount
1. UI 渲染完成后调用
2. 只执行一次
3. 典型场景：获取外部资源(Ajax请求等等)

### componentWillUnmount
1. 组件移除时被调用
2. 典型场景：资源释放

### getSnapshotBeforeUpdate
1. 在页面 render 之前调用，state 已更新
2. 典型场景： 获取 render 之前的 DOM 状态

### componentDidUpdate
1. 每次 UI 更新时被调用
2. 典型场景：页面需要更具 props 变化重新获取数据

### shouldComponentUpdate
1. 决定 Virtual DOM 是否要重绘
2. 一般可以由 PureComponent 自动实现(React内置)
3. 典型场景：性能优化

## 理解 Virtual DOM 及 Key 属性的作用
