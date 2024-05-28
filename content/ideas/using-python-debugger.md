---
title: Using Python Debugger PDB
subtitle: 
summary: Summary of the example
date: 2024-03-21
draft: true
slug: using-python-debugger
tags:
  - til
  - python
---
This is a Today *I* Learned, meaning this is for me, written in my voice the way I want.

I wouldn't say I'm new to debuggers since I've used them in various IDEs over the years for several languages. What I am new to is using the barebone version of them straight from the terminal.

I'm on the journey of migrating to Vim and learning a new way to operate. I've started looking into nvim-dap plus dap-ui but the default options are difficult to configure, an information overload, and hard to have run consistently across projects. Which lead me to PDB and this [crash course by assotile](https://www.youtube.com/watch?v=0LPuG825eAk).

Other tools claim to be easy, PDB is truly easy. Simple to configure, move around, and explore.

How to install `pdb`?
Fortunately PDB comes baked into modern Python versions (3.7+). You now just have to set breakpoints in your code.

Ways to set breakpoints
The classic way to set a breakpoint is to import pdb then call set trace method like so:
```
import pdb
pdb.set_trace()
```
In Python 3.7+ they've added a convenience method:
`breakpoint()`

Once set you're ready to run with a debugger.

Run your python as normal. You should the pdb repl:

```
> /Users/rodrigomoran/Workspace/scratch/using_pdb/main.py(6)main()
-> for user in users:
(Pdb) 
```

Showing help
`help`
```
(Pdb) help

Documented commands (type help <topic>):
========================================
EOF    c          d        h         list      q        rv       undisplay
a      cl         debug    help      ll        quit     s        unt      
alias  clear      disable  ignore    longlist  r        source   until    
args   commands   display  interact  n         restart  step     up       
b      condition  down     j         next      return   tbreak   w        
break  cont       enable   jump      p         retval   u        whatis   
bt     continue   exit     l         pp        run      unalias  where    

Miscellaneous help topics:
==========================
exec  pdb

(Pdb) h c
      Usage: c(ont(inue))
      
      Continue execution, only stop when a breakpoint is encountered.
(Pdb) 
```
Quiting

```
(Pdb) q
```

Continue til next breakpoint
```
(Pdb) c
```

Step into function
```
(Pdb) s
```

Step out

https://docs.python.org/3/library/pdb.html