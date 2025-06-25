# 国际化功能说明 (Internationalization)

本项目已经添加了完整的国际化支持，支持中文、英语、德语、日语四种语言。

## 功能特点

### 🌍 多语言支持
- **中文 (zh)**: 默认语言，包含完整的中文界面
- **英语 (en)**: English interface with full translation
- **德语 (de)**: Deutsche Benutzeroberfläche mit vollständiger Übersetzung
- **日语 (ja)**: 日本語インターフェース完全翻訳

### 🎵 多语言语音
- 每种语言都有对应的语音朗读功能
- 自动根据当前语言选择合适的语音引擎
- 支持公式的多语言朗读

### 🔧 实时切换
- 在页面头部可以实时切换语言
- 语言偏好自动保存到本地存储
- 切换语言时无需刷新页面

## 技术实现

### 文件结构
```
├── i18n.ts                      # 国际化配置
├── messages/                    # 语言文件目录
│   ├── zh.json                 # 中文翻译
│   ├── en.json                 # 英文翻译
│   ├── de.json                 # 德文翻译
│   └── ja.json                 # 日文翻译
├── app/
│   ├── hooks/
│   │   └── use-locale.ts       # 语言管理Hook
│   └── components/
│       ├── language-switcher.tsx  # 语言切换组件
│       └── client-layout.tsx   # 客户端布局组件
```

### 核心组件

#### useLocale Hook
```typescript
const { locale, t, changeLocale } = useLocale();
```
- `locale`: 当前语言代码
- `t`: 翻译函数，用法：`t('common.title')`
- `changeLocale`: 切换语言函数

#### 语言切换器
位于页面头部的下拉菜单，支持：
- 显示当前语言
- 下拉选择其他语言
- 响应式设计，在小屏幕上只显示图标

### 语音功能增强

乘法公式的多语言朗读：
- **中文**: "三三得九"
- **英语**: "3 times 3 equals 9"
- **德语**: "3 mal 3 ist 9"
- **日语**: "3 かける 3 は 9"

## 使用方法

### 添加新的翻译
1. 在 `messages/` 目录下的对应语言文件中添加新的键值对
2. 在组件中使用 `t('your.new.key')` 调用翻译

### 添加新语言
1. 在 `i18n.ts` 中的 `locales` 数组添加新的语言代码
2. 在 `languageConfig` 中添加新语言的配置
3. 在 `messages/` 目录下创建对应的 JSON 文件
4. 在 `lib/multiplication-utils.ts` 中的 `getFormulaByLocale` 函数添加新语言的公式格式

### 翻译函数使用示例
```typescript
// 简单翻译
t('common.title')  // 返回 "乘法口诀" (中文) 或 "Multiplication Table" (英文)

// 带参数的翻译
t('grid.formula', { num1: 3, num2: 3, result: 9 })
// 返回 "3 乘以 3 等于 9" (中文) 或 "3 times 3 equals 9" (英文)
```

## 语言文件结构

每个语言文件都包含以下部分：
- `common`: 通用文本（标题、按钮等）
- `modes`: 模式名称（学习、答题、复习）
- `grid`: 乘法表相关文本
- `quiz`: 答题模式文本
- `achievements`: 成就系统文本
- `stats`: 统计信息文本
- `speech`: 语音功能文本
- `language`: 语言切换相关文本
- `learn`: 学习模式专用文本

## 注意事项

1. **语音支持**: 不同浏览器对各语言的语音支持程度不同
2. **本地存储**: 用户的语言偏好保存在 localStorage 中
3. **回退机制**: 如果翻译缺失，会显示翻译键名作为回退
4. **性能**: 语言文件按需动态加载，不会影响初始加载性能

## 贡献翻译

欢迎为项目贡献更准确的翻译或添加新的语言支持！请确保：
1. 翻译准确且符合目标语言的表达习惯
2. 保持所有语言文件的结构一致
3. 测试语音功能在目标语言下的表现 