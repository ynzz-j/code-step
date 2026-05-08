# 多语言课程体系设计

> 版本：V1.3 | 日期：2026-05-08 | 状态：规划中

---

## 一、课程体系概览

### 1.1 支持语言

| 语言 | 定位 | 目标用户 | 环境依赖 | 包体积 |
|------|------|---------|---------|--------|
| **Java** | 主力语言 | 后端开发者 | JDK (需安装) | - |
| **Python** | 主力语言 | 数据/AI/脚本开发者 | Pyodide (WASM) | ~12MB |
| **C/C++** | 进阶语言 | 系统/嵌入式开发者 | MinGW (需安装) | ~150MB |
| **JavaScript** | 脚本语言 | 前端/全栈开发者 | 内置 V8/JSC | 0 |

### 1.2 难度分布

```
入门 ──→ 基础 ──→ 困难 ──→ 地狱
 (★)     (★★)    (★★★)   (★★★★)
```

| 难度 | 课程数量（每语言） | 步数/课程 | 总步数（每语言） |
|------|------------------|-----------|------------------|
| 入门 | 3 门 | 8-10 步 | ~30 步 |
| 基础 | 4 门 | 10-15 步 | ~50 步 |
| 困难 | 3 门 | 15-20 步 | ~50 步 |
| 地狱 | 2 门 | 20+ 步 | ~45 步 |
| **合计** | **12 门** | - | **~175 步** |

---

## 二、Python 课程体系

### 2.1 语言特点

- 语法简洁，缩进敏感
- 动态类型，无需声明
- 丰富的标准库
- 应用场景：数据科学、AI、Web 后端、自动化脚本

### 2.2 课程目录结构

```
courses/python/
├── course.json           # 课程索引
├── hello/                # 入门：Hello World
│   └── steps/
├── variables/            # 入门：变量与数据类型
├── control-flow/         # 基础：控制流程
├── function/             # 基础：函数
├── data-structure/       # 基础：数据结构
├── oop/                  # 困难：面向对象
├── modules/              # 困难：模块与包
└── advanced/            # 地狱：高级特性
```

### 2.3 课程大纲

#### 【入门级】Python 入门

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `python-hello` | Hello World | beginner | 8 | print、注释、运行 |
| `python-vars` | 变量与数据类型 | beginner | 10 | 整数、浮点、字符串、布尔 |
| `python-operators` | 运算符 | beginner | 8 | 算术、比较、逻辑运算符 |

#### 【基础级】Python 基础

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `python-control` | 控制流程 | intermediate | 12 | if/elif/else、for、while |
| `python-function` | 函数 | intermediate | 10 | def、参数、返回值、默认参数 |
| `python-string` | 字符串处理 | intermediate | 10 | 切片、格式化、常用方法 |
| `python-list` | 列表与元组 | intermediate | 12 | 创建、索引、切片、常用方法 |

#### 【困难级】Python 进阶

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `python-dict` | 字典与集合 | advanced | 15 | dict、set、推导式 |
| `python-oop` | 面向对象 | advanced | 18 | 类、对象、继承、多态 |
| `python-file` | 文件操作 | advanced | 12 | 读写文件、with 语句 |

#### 【地狱级】Python 高级

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `python-decorator` | 装饰器 | hell | 20 | 闭包、装饰器、高阶函数 |
| `python-generator` | 生成器与迭代器 | hell | 18 | yield、迭代器协议、生成器表达式 |

### 2.4 示例步骤文件

```json
// python-hello/steps/step-01.json
{
  "type": "typing",
  "title": "第一行代码",
  "concept": "print 函数",
  "difficulty": "beginner",
  "instruction": "在 Python 中，使用 print() 函数来输出内容。\n\n请在编辑器中输入以下代码：",
  "targetCode": "print('Hello, World!')",
  "expectedOutput": "Hello, World!"
}

// python-hello/steps/step-02.json
{
  "type": "typing",
  "title": "多行输出",
  "concept": "print 函数",
  "difficulty": "beginner",
  "instruction": "print() 可以连续调用来输出多行内容。\n\n请输入：",
  "targetCode": "print('第一行')\nprint('第二行')\nprint('第三行')",
  "expectedOutput": "第一行\n第二行\n第三行"
}

// python-control/steps/step-10.json
{
  "type": "typing",
  "title": "for 循环遍历列表",
  "concept": "for 循环",
  "difficulty": "intermediate",
  "instruction": "使用 for 循环遍历列表中的每个元素。\n\n遍历 fruits 列表并打印每个水果：",
  "targetCode": "fruits = ['苹果', '香蕉', '橙子']\nfor fruit in fruits:\n    print(fruit)"
}
```

---

## 三、C/C++ 课程体系

### 3.1 语言特点

- 编译型语言，语法严格
- 手动内存管理
- 性能优异，适合系统编程
- 应用场景：操作系统、游戏引擎、嵌入式、编译器

### 3.2 课程目录结构

```
courses/cpp/
├── course.json           # 课程索引
├── hello/                # 入门：Hello World
│   └── steps/
├── variables/            # 入门：变量与数据类型
├── control-flow/         # 基础：控制流程
├── function/             # 基础：函数
├── pointer/             # 困难：指针
├── array-string/        # 困难：数组与字符串
└── memory/             # 地狱：内存管理
```

### 3.3 课程大纲

#### 【入门级】C++ 入门

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `cpp-hello` | Hello World | beginner | 8 | iostream、main、cout |
| `cpp-vars` | 变量与数据类型 | beginner | 10 | int、float、double、char |
| `cpp-io` | 输入输出 | beginner | 8 | cin、cout、格式化 |

#### 【基础级】C++ 基础

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `cpp-control` | 控制流程 | intermediate | 12 | if/switch/for/while |
| `cpp-function` | 函数 | intermediate | 12 | 函数定义、参数传递、递归 |
| `cpp-array` | 数组 | intermediate | 10 | 一维数组、二维数组、遍历 |

#### 【困难级】C++ 进阶

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `cpp-pointer` | 指针 | advanced | 18 | 地址运算符、指针运算、指针与数组 |
| `cpp-string` | 字符串 | advanced | 12 | char 数组、string 类、常用函数 |

#### 【地狱级】C++ 高级

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `cpp-memory` | 动态内存 | hell | 20 | new/delete、malloc/free、智能指针 |
| `cpp-struct` | 结构体与类 | hell | 18 | struct、class、封装、构造函数 |

### 3.4 示例步骤文件

```json
// cpp-hello/steps/step-01.json
{
  "type": "typing",
  "title": "第一个 C++ 程序",
  "concept": "程序结构",
  "difficulty": "beginner",
  "instruction": "每个 C++ 程序都从 main() 函数开始执行。\n\n请输入以下代码：",
  "targetCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}",
  "expectedOutput": "Hello, World!"
}

// cpp-pointer/steps/step-05.json
{
  "type": "typing",
  "title": "指针与数组",
  "concept": "指针运算",
  "difficulty": "advanced",
  "instruction": "数组名本身就是一个指针，指向首元素地址。\n\n使用指针遍历数组：",
  "targetCode": "int arr[] = {10, 20, 30, 40, 50};\nint* p = arr;\nfor (int i = 0; i < 5; i++) {\n    cout << *p << \" \";\n    p++;\n}",
  "expectedOutput": "10 20 30 40 50 "
}
```

---

## 四、JavaScript 课程体系

### 4.1 语言特点

- 动态类型，灵活多变
- 基于原型的面向对象
- 单线程，事件驱动
- 应用场景：Web 前端、后端(Node.js)、移动端(React Native)

### 4.2 课程目录结构

```
courses/javascript/
├── course.json           # 课程索引
├── hello/                # 入门：Hello World
│   └── steps/
├── variables/            # 入门：变量与数据类型
├── functions/            # 基础：函数
├── array/               # 基础：数组
├── object/              # 基础：对象
├── async/               # 困难：异步编程
├── es6/                 # 困难：ES6+ 新特性
└── closure/             # 地狱：闭包与作用域
```

### 4.3 课程大纲

#### 【入门级】JavaScript 入门

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `js-hello` | Hello World | beginner | 6 | console.log、注释 |
| `js-vars` | 变量与数据类型 | beginner | 10 | let、const、数据类型 |
| `js-operators` | 运算符与表达式 | beginner | 8 | 算术、比较、逻辑运算符 |

#### 【基础级】JavaScript 基础

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `js-function` | 函数 | intermediate | 12 | 函数声明、箭头函数、回调 |
| `js-array` | 数组 | intermediate | 12 | 创建、遍历、高阶方法(map/filter/reduce) |
| `js-object` | 对象 | intermediate | 10 | 对象字面量、属性访问、方法 |

#### 【困难级】JavaScript 进阶

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `js-async` | 异步编程 | advanced | 15 | Promise、async/await、fetch |
| `js-es6` | ES6+ 新特性 | advanced | 12 | 解构、展开符、模块、类语法糖 |

#### 【地狱级】JavaScript 高级

| 课程 ID | 标题 | 难度 | 步数 | 核心概念 |
|--------|------|------|------|----------|
| `js-closure` | 闭包与作用域 | hell | 18 | 闭包、作用域链、this、执行上下文 |
| `js-prototype` | 原型与继承 | hell | 15 | 原型链、构造函数、class extends |

### 4.4 示例步骤文件

```json
// js-hello/steps/step-01.json
{
  "type": "typing",
  "title": "在浏览器控制台输出",
  "concept": "console.log",
  "difficulty": "beginner",
  "instruction": "JavaScript 中最常用的输出方式是 console.log()。\n\n请输入：",
  "targetCode": "console.log('Hello, JavaScript!');",
  "expectedOutput": "Hello, JavaScript!"
}

// js-closure/steps/step-03.json
{
  "type": "typing",
  "title": "计数器闭包",
  "concept": "闭包应用",
  "difficulty": "hell",
  "instruction": "闭包可以创建私有变量。\n\n使用闭包创建一个计数器：",
  "targetCode": "function createCounter() {\n    let count = 0;\n    return function() {\n        count++;\n        return count;\n    };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3",
  "expectedOutput": "1\n2\n3"
}
```

---

## 五、课程元数据模板

### 5.1 course.json 结构

```json
{
  "id": "python",
  "title": "Python 编程课程",
  "description": "从零开始学习 Python 编程",
  "language": "python",
  "courses": [
    {
      "id": "python-hello",
      "title": "Python 入门：Hello World",
      "description": "写出你的第一个 Python 程序",
      "language": "python",
      "difficulty": "beginner",
      "category": "fundamentals",
      "concepts": ["print", "注释", "运行"],
      "estimatedMinutes": 10,
      "steps": [
        "steps/step-01.json",
        "steps/step-02.json"
      ]
    }
  ]
}
```

### 5.2 Step 类型说明

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| `typing` | 照打代码，即时验证对错 | 语法练习、肌肉记忆 |
| `coding` | 自由编写，需运行环境验证 | 算法题、实际应用 |

### 5.3 Validation 类型

```typescript
// 验证规则类型
type ValidationType =
  | 'exact'        // 完全匹配
  | 'contains'      // 包含指定内容
  | 'output'        // 输出匹配
  | 'regex';        // 正则匹配
```

---

## 六、跨语言对比课程（可选）

设计一组「对比学习」课程，让用户在学习过程中对比不同语言的语法差异：

| 课程 ID | 标题 | 难度 | 说明 |
|--------|------|------|------|
| `compare-hello` | Hello World 各语言写法 | beginner | 对比 Java/Python/JS 的 Hello World |
| `compare-loop` | 循环语法对比 | intermediate | for 循环在不同语言的写法 |
| `compare-function` | 函数定义对比 | intermediate | 函数定义在不同语言的语法 |
| `compare-oop` | 面向对象对比 | advanced | 类/继承/多态的语法差异 |

---

## 七、开发工作量估算

### 7.1 内容创作

| 语言 | 课程数 | 步骤数 | 预估工时 |
|------|--------|--------|----------|
| Python | 12 门 | ~175 步 | ~35h |
| C/C++ | 10 门 | ~150 步 | ~30h |
| JavaScript | 10 门 | ~130 步 | ~26h |
| **合计** | **32 门** | **~455 步** | **~91h** |

### 7.2 技术实现

| 任务 | 工作量 | 说明 |
|------|--------|------|
| Python 环境集成 | 1-2 天 | Pyodide 接入 |
| C++ 环境检测 | 0.5 天 | 复用 Java 环境检测 |
| JavaScript 环境 | 0 | 内置，无需额外工作 |
| 课程数据导入 | 1 天 | 批量导入工具 |
| UI 适配 | 0.5 天 | 各语言配色/图标 |

### 7.3 优先级建议

```
第一阶段（1-2周）：Python
├── Python 环境成熟（Pyodide）
├── 语法简洁，适合入门
└── 课程数量：入门级 3 门

第二阶段（3-4周）：JavaScript
├── 内置环境，零成本
├── Web 开发者刚需
└── 课程数量：入门级 3 门

第三阶段（5-6周）：C/C++
├── 环境检测复用
├── 进阶用户群体
└── 课程数量：入门级 3 门
```

---

## 八、附录：各语言 Hello World 对比

```java
// Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

```python
# Python
print("Hello, World!")
```

```cpp
// C++
#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
```

```javascript
// JavaScript
console.log("Hello, World!");
```

---

> **设计原则**：
> 1. 每门课程控制在 10-20 步，避免用户中途放弃
> 2. 先设计步骤，再编写内容
> 3. 每个步骤聚焦一个概念，避免信息过载
> 4. 利用语言对比帮助用户理解通用编程概念
