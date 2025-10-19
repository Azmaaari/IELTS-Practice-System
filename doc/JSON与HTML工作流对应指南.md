# JSON格式与HTML工作流对应指南

> **版本**: 1.0.0  
> **创建日期**: 2025-10-16  
> **目的**: 确保JSON数据格式与现有PDF转HTML工作流完全匹配

---

## 📌 重要说明

本文档基于 **`PDF转网页工作流.md`** 中定义的HTML结构，确保JSON数据能够正确渲染到现有的HTML模板中。所有JSON格式必须与工作流中的HTML结构、CSS类名、JavaScript逻辑完全对应。

---

## 1. 题型映射表（JSON ↔ HTML）

### 1.1 完整映射关系

| JSON题型代码 | HTML实现方式 | CSS类名 | HTML示例 | 工作流中的名称 |
|-------------|-------------|---------|----------|--------------|
| `true-false-ng` | `<input type="radio">` | 无特殊类 | `<input type="radio" name="q1" value="TRUE">` | T/F/NG |
| `yes-no-ng` | `<input type="radio">` | 无特殊类 | `<input type="radio" name="q1" value="YES">` | Y/N/NG |
| `multiple-choice-single` | `<input type="radio">` | 无特殊类 | `<input type="radio" name="q40" value="A">` | Multiple Choice (Single) |
| `multiple-choice-multiple` | `<input type="checkbox">` | 无特殊类 | `<input type="checkbox" name="q20-21" value="A">` | Multiple Choice (Multiple) |
| `notes-completion` | `<input class="blank">` | `.blank` | `<input class="blank" name="q1">` | Fill in the Blanks |
| `summary-completion` | `<input class="blank">` | `.blank` | `<input class="blank" name="q18">` | Summary Completion |
| `sentence-completion` | `<input class="blank">` | `.blank` | `<input class="blank" name="q5">` | Fill in the Blanks |
| `paragraph-matching` | 拖拽 | `.card`, `.dropzone` | 见下方详细说明 | Matching (Drag-and-Drop) |
| `feature-matching` | 拖拽或radio | `.card`, `.dropzone` | 见下方详细说明 | Matching |
| `statement-matching` | 拖拽 | `.card`, `.dropzone` | 见下方详细说明 | Matching (People) |
| `heading-matching` | 拖拽或dropdown | - | 见下方详细说明 | Matching (Headings) |

---

## 2. 拖拽题的详细对应关系

### 2.1 HTML结构（来自工作流）

```html
<!-- 拖拽题完整结构 -->
<div class="group">
  <h4>Questions 14–19</h4>
  <p>Which paragraph contains the following information?</p>
  <p>NB You may use any letter more than once.</p>
  
  <!-- 题目列表 -->
  <p>
    <a id="q14-anchor"></a>
    <span class="dropzone" data-target="q14"></span>
    14 A specific example of a successful project.
  </p>
  <p>
    <span class="dropzone" data-target="q15"></span>
    15 Another information point.
  </p>
  
  <!-- 选项池 -->
  <div class="option-pool" id="pool-para">
    <div class="card" draggable="true" data-value="A" data-clone="true">A</div>
    <div class="card" draggable="true" data-value="B" data-clone="true">B</div>
    <div class="card" draggable="true" data-value="C" data-clone="true">C</div>
    <div class="card" draggable="true" data-value="D" data-clone="true">D</div>
    <div class="card" draggable="true" data-value="E" data-clone="true">E</div>
    <div class="card" draggable="true" data-value="F" data-clone="true">F</div>
    <div class="card" draggable="true" data-value="G" data-clone="true">G</div>
  </div>
</div>
```

### 2.2 JSON对应格式

```json
{
  "questionNumber": 14,
  "type": "paragraph-matching",
  "instruction": "Which paragraph contains the following information? Write the correct letter, A-G. NB You may use any letter more than once.",
  "content": {
    "statement": "A specific example of a successful project.",
    "paragraphOptions": ["A", "B", "C", "D", "E", "F", "G"],
    "canReuse": true,
    "renderType": "drag-drop",
    "optionPoolId": "pool-para",
    "dropzoneTarget": "q14"
  },
  "answer": "C",
  "explanation": "Paragraph C contains the specific example mentioned."
}
```

### 2.3 关键属性对应

| JSON字段 | HTML属性 | 说明 |
|---------|---------|------|
| `content.canReuse` | `data-clone="true"` | true = 可重复使用选项 |
| `content.paragraphOptions` | `.card` 元素 | 生成每个可拖拽的卡片 |
| `content.dropzoneTarget` | `data-target="q14"` | 放置区域的目标ID |
| `content.optionPoolId` | `id="pool-para"` | 选项池的DOM ID |
| `answer` | `data-value="C"` | 正确答案对应的卡片值 |

---

## 3. 多选题的特殊处理

### 3.1 HTML结构（来自工作流）

```html
<div class="question-item">
  <p><strong>20-21</strong> Which TWO of the following are mentioned?</p>
  <div class="radio-options">
    <label><input type="checkbox" name="q20-21" value="A"> A economic growth</label>
    <label><input type="checkbox" name="q20-21" value="B"> B reduced pollution</label>
    <label><input type="checkbox" name="q20-21" value="C"> C improved healthcare</label>
    <label><input type="checkbox" name="q20-21" value="D"> D cultural diversity</label>
    <label><input type="checkbox" name="q20-21" value="E"> E lower costs</label>
  </div>
</div>
```

### 3.2 JavaScript答案格式（来自工作流）

```javascript
const answers = {
    "q20-21": ["A", "D"]  // 数组格式，包含多个正确答案
};
```

### 3.3 JSON格式

**方案A：作为单个题目（推荐）**

```json
{
  "questionNumber": 20,
  "type": "multiple-choice-multiple",
  "instruction": "Choose TWO letters, A-E.",
  "content": {
    "questionText": "Which TWO of the following are mentioned as benefits of cities?",
    "options": [
      { "label": "A", "text": "economic growth" },
      { "label": "B", "text": "reduced pollution" },
      { "label": "C", "text": "improved healthcare" },
      { "label": "D", "text": "cultural diversity" },
      { "label": "E", "text": "lower costs" }
    ],
    "numberOfAnswers": 2,
    "checkboxGroupName": "q20-21"
  },
  "answer": ["A", "D"],
  "explanation": "The passage mentions economic growth (A) and cultural diversity (D) as key benefits."
}
```

---

## 4. 答案规范化规则（来自工作流）

### 4.1 强制规则

根据工作流第51-55行的要求：

1. **所有答案键使用小写**：`"q14"` 而不是 `"Q14"`
2. **所有字符串答案使用小写**：`"central europe"` 而不是 `"Central Europe"`
3. **多选题答案必须是数组**：`["A", "D"]` 而不是 `"A, D"`
4. **去除首尾空格**：`"disease"` 而不是 `" disease "`

### 4.2 JavaScript答案对象示例（来自工作流）

```javascript
const answers = {
    q14: "b",                    // 小写单个字符
    q15: "a", 
    q16: "a", 
    q17: "c",
    q18: "e", 
    q19: "c", 
    q20: "f", 
    q21: "d",
    q22: "animals",              // 小写单词
    q23: "blood", 
    q24: "electricity", 
    q25: "weather", 
    q26: "fear",
    "q20-21": ["A", "D"]         // 多选题使用数组
};
```

### 4.3 JSON答案格式对应

```json
{
  "questions": [
    {
      "questionNumber": 14,
      "answer": "b"              // ✅ 小写
    },
    {
      "questionNumber": 22,
      "answer": "animals"        // ✅ 小写单词
    },
    {
      "questionNumber": 20,
      "answer": ["A", "D"]       // ✅ 数组格式
    }
  ]
}
```

---

## 5. 填空题的HTML类名对应

### 5.1 工作流中的HTML

```html
<!-- 使用 class="blank" -->
<input class="blank" name="q22">
<input class="blank" name="q23">
```

### 5.2 JSON渲染提示

```json
{
  "questionNumber": 22,
  "type": "notes-completion",
  "content": {
    "blankPosition": 22,
    "wordLimit": "ONE WORD ONLY",
    "htmlInputClass": "blank",      // ⬅️ 指定HTML class名
    "htmlInputName": "q22"          // ⬅️ 指定HTML name属性
  },
  "answer": "animals"
}
```

---

## 6. 题号命名约定

### 6.1 工作流中的命名规则

| 元素类型 | 命名格式 | 示例 |
|---------|---------|------|
| 输入框 name | `qN` | `name="q14"` |
| Dropzone target | `qN` | `data-target="q14"` |
| 导航按钮 ID | `qN-nav` | `id="q14-nav"` |
| 锚点 ID | `qN-anchor` | `id="q14-anchor"` |
| JavaScript答案键 | `qN` | `q14: "b"` |

### 6.2 JSON中的对应

```json
{
  "questionNumber": 14,           // 数字
  "content": {
    "anchorId": "q14-anchor",     // 锚点ID（可选）
    "navId": "q14-nav",           // 导航ID（可选）
    "inputName": "q14"            // 输入框name（必需）
  }
}
```

---

## 7. 问题与解决方案

### ❓ 问题1：段落标签的处理

**工作流中**：段落可能有或没有字母标签（A、B、C...）

```html
<!-- 有标签 -->
<h4>A</h4>
<p>Paragraph content...</p>

<!-- 无标签 -->
<p>Paragraph content...</p>
```

**JSON解决方案**：

```json
{
  "passage": {
    "paragraphs": [
      {
        "label": "A",           // ✅ 如果有标签
        "content": "..."
      },
      {
        "label": null,          // ✅ 如果没有标签
        "content": "..."
      }
    ]
  }
}
```

---

### ❓ 问题2：多选题的题号连续性

**场景**：Questions 20-21是一个多选题，但占用两个题号

**解决方案**：

```json
{
  "questionNumber": 20,
  "type": "multiple-choice-multiple",
  "content": {
    "questionText": "Which TWO...",
    "occupiesQuestions": [20, 21],  // ⬅️ 明确占用的题号
    "checkboxGroupName": "q20-21"
  },
  "answer": ["A", "D"]
}
```

然后在题目列表中跳过21号，或者创建一个占位符：

```json
{
  "questionNumber": 21,
  "type": "multiple-choice-multiple-placeholder",
  "linkedTo": 20,
  "content": null,
  "answer": null
}
```

---

### ❓ 问题3：拖拽题的答案提取

**工作流中的JavaScript**：

```javascript
// 从dropzone提取答案
const dropzone = document.querySelector(`.dropzone[data-target="q14"]`);
const card = dropzone.querySelector('.card');
const userAnswer = card ? card.dataset.value : '';
```

**JSON中需要确保**：

- `answer` 字段的值必须与 `data-value` 一致
- 选项池中的每个选项都有对应的 `data-value`

---

## 8. 完整示例：从HTML到JSON的转换

### 8.1 HTML源码（来自工作流）

```html
<div class="group">
  <h4>Questions 14–19</h4>
  <p>Which paragraph contains the following information?</p>
  <p>NB You may use any letter more than once.</p>
  
  <p><a id="q14-anchor"></a><span class="dropzone" data-target="q14"></span>14 A specific example.</p>
  <p><span class="dropzone" data-target="q15"></span>15 Another example.</p>
  
  <div class="option-pool" id="pool-para">
    <div class="card" draggable="true" data-value="A" data-clone="true">A</div>
    <div class="card" draggable="true" data-value="B" data-clone="true">B</div>
    <div class="card" draggable="true" data-value="C" data-clone="true">C</div>
  </div>
</div>

<div class="group">
  <h4>Questions 20–21</h4>
  <p>Complete the notes below. Choose ONE WORD ONLY from the passage.</p>
  
  <p>Problems: dirt and <input class="blank" name="q20"></p>
  <p>But there were commercial and <input class="blank" name="q21"> reasons.</p>
</div>
```

### 8.2 JavaScript答案

```javascript
const answers = {
    q14: "c",
    q15: "a",
    q20: "disease",
    q21: "political"
};
```

### 8.3 转换后的JSON实例

```json
{
  "id": "e001",
  "passage": {
    "title": "Sample Article",
    "paragraphs": [
      { "label": "A", "content": "..." },
      { "label": "B", "content": "..." },
      { "label": "C", "content": "..." }
    ]
  },
  "questions": [
    {
      "questionNumber": 14,
      "type": "paragraph-matching",
      "instruction": "Which paragraph contains the following information? Write the correct letter, A-C. NB You may use any letter more than once.",
      "content": {
        "statement": "A specific example.",
        "paragraphOptions": ["A", "B", "C"],
        "canReuse": true,
        "renderType": "drag-drop",
        "htmlClass": "dropzone",
        "htmlDataTarget": "q14",
        "optionPoolId": "pool-para"
      },
      "answer": "c",
      "explanation": "Paragraph C contains the specific example."
    },
    {
      "questionNumber": 15,
      "type": "paragraph-matching",
      "instruction": "Which paragraph contains the following information? Write the correct letter, A-C. NB You may use any letter more than once.",
      "content": {
        "statement": "Another example.",
        "paragraphOptions": ["A", "B", "C"],
        "canReuse": true,
        "renderType": "drag-drop",
        "htmlClass": "dropzone",
        "htmlDataTarget": "q15",
        "optionPoolId": "pool-para"
      },
      "answer": "a",
      "explanation": "Paragraph A contains this information."
    },
    {
      "questionNumber": 20,
      "type": "notes-completion",
      "instruction": "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.",
      "content": {
        "notesStructure": [
          {
            "section": "Problems",
            "items": [
              "dirt",
              "{20}"
            ]
          }
        ],
        "blankPosition": 20,
        "wordLimit": "ONE WORD ONLY",
        "htmlInputClass": "blank",
        "htmlInputName": "q20"
      },
      "answer": "disease",
      "explanation": "The passage mentions 'disease' as one of the problems."
    },
    {
      "questionNumber": 21,
      "type": "notes-completion",
      "instruction": "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.",
      "content": {
        "blankPosition": 21,
        "wordLimit": "ONE WORD ONLY",
        "htmlInputClass": "blank",
        "htmlInputName": "q21"
      },
      "answer": "political",
      "explanation": "The passage states there were 'commercial and political reasons'."
    }
  ],
  "metadata": {
    "difficulty": 1,
    "totalQuestions": 4
  }
}
```

---
