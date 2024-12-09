# Paste a File

## Features

Insert the content of a file (for example template or snippet) at the cursor position.

- Choose `Paste a File` from the Command Palette (`Ctrl + Shift + P`). 
- Now you can pick a file 
- Its content is pasted into the active file

## Options

- specify a folder from where the file should be picked from 
- specify glob pattern of files that shoud be picked or ignored
- specify regex patterns that should be deleted from the file, before it is pasted
- the default pattern allows you to add comments ```paste-a-file START```and ```paste-a-file STOP``` in your files to mark which content should be pasted

for example
```
xxxx
xxxxxxx
// paste-a-file START
oo
oooo
# paste-a-file STOP
xxxx xxx
xxxxxxx
xxxxxxxxxxxxx
/* paste-a-file START */
ooo
```
would be pasted as 
```
oo
oooo
ooo
```

## Extension Settings

settings.json
```json
"paste-a-file.directory": {
  "type": "string",
  "default": "",
  "description": "Path/To/Directory in which files to paste are searched. Default is the open workspacefolder"
},
"paste-a-file.filePattern": {
  "type": "string",
  "default": "**/*",
  "description": "A glob pattern for files that are matched in the selected folder"
},
"paste-a-file.ignoreFilePatterns": {
  "type": "array",
  "default": [],
  "description": "An array of glob patterns for files that are not matched"
},
"paste-a-file.excludeFromFilePatterns": {
  "type": "array",
  "default": [
    {
      "body": "(((?=[\\s\\S]*paste-a-file START)^)|(?=.*paste-a-file STOP.*\\r?\\n))[\\s\\S]*?((?<=.*paste-a-file START.*\\r?\\n)|$)\\s*",
      "flags": "g"
    }
  ],
  "description": "An array of regex patterns which are cut out of the file before it is inserted"
}
```

## Example Settings
```
"paste-a-file.filePattern": "**/*.{cc, cpp}",
"paste-a-file.ignoreFilePatterns": [
  "**/*.test.{cc, cpp}"
]

```


## Assign Key Binding

keybindings.json

```json
{
  "key": "alt+p",
  "command": "paste-a-file.paste"
},
```

## License

This software is released under the MIT License, see LICENSE.
