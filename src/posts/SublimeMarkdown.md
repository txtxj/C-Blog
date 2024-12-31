---
title: "快捷键 - MarkDown 插入代码块"
date: 2022-01-05T22:54:43+08:00
toc: true
math: md
tags: ["笔记"]
cover: https://s2.loli.net/2022/01/05/VXLbwvYEs3BFeAo.jpg
grow: 
---
快捷键 ```["alt+`"]```

由 sublime 默认的插入双引号快捷键修改而来。

### Sublime 版本

```json
[
	{ "keys": ["alt+`"], "command": "insert_snippet", "args": {"contents": "```$0```"}, "context":
		[
			{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
			{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
			{ "key": "following_text", "operator": "regex_contains", "operand": "^(?:\t| |\\)|]|\\}|>|$)", "match_all": true },
			{ "key": "preceding_text", "operator": "not_regex_contains", "operand": "[```a-zA-Z0-9_]$", "match_all": true },
			{ "key": "eol_selector", "operator": "not_equal", "operand": "string.quoted.double - punctuation.definition.string.end", "match_all": true }
		]
	},
	{ "keys": ["alt+`"], "command": "insert_snippet", "args": {"contents": "```${0:$SELECTION}```"}, "context":
		[
			{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
			{ "key": "selection_empty", "operator": "equal", "operand": false, "match_all": true }
		]
	},
	{ "keys": ["alt+`"], "command": "move", "args": {"by": "characters", "forward": true}, "context":
		[
			{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
			{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
			{ "key": "following_text", "operator": "regex_contains", "operand": "^```", "match_all": true },
			{ "key": "selector", "operator": "not_equal", "operand": "punctuation.definition.string.begin", "match_all": true },
			{ "key": "eol_selector", "operator": "not_equal", "operand": "string.quoted.double - punctuation.definition.string.end", "match_all": true },
		]
	},
	{ "keys": ["backspace"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Delete Left Right.sublime-macro"}, "context":
		[
			{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
			{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
			{ "key": "preceding_text", "operator": "regex_contains", "operand": "```$", "match_all": true },
			{ "key": "following_text", "operator": "regex_contains", "operand": "^```", "match_all": true },
			{ "key": "selector", "operator": "not_equal", "operand": "punctuation.definition.string.begin", "match_all": true },
			{ "key": "eol_selector", "operator": "not_equal", "operand": "string.quoted.double - punctuation.definition.string.end", "match_all": true },
		]
	},
]
```

### VS Code 版本

```json
[
	{ "key": "alt+oem_3", "command": "editor.action.insertSnippet", "args": {"snippet": "```$0```"}, "context":
		[
			{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
			{ "key": "selection_empty", "operator": "equal", "operand": true, "match_all": true },
			{ "key": "following_text", "operator": "regex_contains", "operand": "^(?:\t| |\\)|]|\\}|>|$)", "match_all": true },
			{ "key": "preceding_text", "operator": "not_regex_contains", "operand": "[```a-zA-Z0-9_]$", "match_all": true },
			{ "key": "eol_selector", "operator": "not_equal", "operand": "string.quoted.double - punctuation.definition.string.end", "match_all": true }
		]
	},
	{ "key": "alt+oem_3", "command": "editor.action.insertSnippet", "args": {"snippet": "```${0:$SELECTION}```"}, "context":
		[
			{ "key": "setting.auto_match_enabled", "operator": "equal", "operand": true },
			{ "key": "selection_empty", "operator": "equal", "operand": false, "match_all": true }
		]
	},
]
```

由于笔者不了解 VS Code 指令集，未能在 VS Code 中实现光标后移、成对删除两个功能。