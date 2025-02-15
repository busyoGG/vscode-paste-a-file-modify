# Paste a File Modify

## 📌 Fork 信息  

本插件是从 [jon-of-us/vscode-paste-a-file](https://github.com/jon-of-us/vscode-paste-a-file) fork 过来的，并在此基础上进行修改和扩展。  

原项目遵循 [MIT License](https://opensource.org/licenses/MIT)，如果你希望使用原版插件，请访问 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=jon-of-us.paste-a-file)。  

### ✨ 变更内容  
- 修改读取模板路径的方式，支持相对路径和绝对路径。  

## 功能介绍

在光标位置插入文件内容（例如模板或代码片段）。

- 在 **命令面板**（`Ctrl + Shift + P`）中选择 **"Paste a File Modify"**。  
- 选择一个文件。  
- 该文件的内容将被粘贴到当前活动文件中。  

## 选项

- **指定文件选择的文件夹**。  
- **指定要匹配或忽略的文件的全局模式（glob pattern）**。  
- **指定在粘贴前需要删除的正则表达式模式**。  
- **默认模式**：  
  - 你可以在文件中添加注释 `paste-a-file-modify START` 和 `paste-a-file-modify STOP`，用于标记要粘贴的内容部分。

例如，原文件内容：
```
xxxx
xxxxxxx
// paste-a-file-modify START
oo
oooo
# paste-a-file-modify STOP
xxxx xxx
xxxxxxx
xxxxxxxxxxxxx
/* paste-a-file-modify START */
ooo
```
最终粘贴结果：
```
oo
oooo
ooo
```

## 扩展设置

**`settings.json` 配置示例**
```json
"paste-a-file-modify.directory": {
  "type": "string",
  "default": "",
  "description": "搜索要粘贴文件的目录路径。默认为当前打开的工作区目录。支持相对路径和绝对路径。"
},
"paste-a-file-modify.filePattern": {
  "type": "string",
  "default": "**/*",
  "description": "匹配选定文件夹中的文件的全局模式"
},
"paste-a-file-modify.ignoreFilePatterns": {
  "type": "array",
  "default": [],
  "description": "要忽略的文件的全局模式数组"
},
"paste-a-file-modify.excludeFromFilePatterns": {
  "type": "array",
  "default": [
    {
      "body": "(((?=[\\s\\S]*paste-a-file-modify START)^)|(?=.*paste-a-file-modify STOP.*\\r?\\n))[\\s\\S]*?((?<=.*paste-a-file-modify START.*\\r?\\n)|$)\\s*",
      "flags": "g"
    }
  ],
  "description": "在插入文件之前，要删除的正则表达式模式数组"
}
```

## 配置示例

```json
"paste-a-file-modify.filePattern": "**/*.{cc, cpp}",
"paste-a-file-modify.ignoreFilePatterns": [
  "**/*.test.{cc, cpp}"
]
```

## 绑定快捷键

在 `keybindings.json` 中添加以下配置：
```json
{
  "key": "alt+p",
  "command": "paste-a-file-modify.paste"
}
```

## 许可证

本软件基于 **MIT 许可证** 发布，详情请参阅 LICENSE 文件。

