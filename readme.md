# Livedev
Node app to watch over your working directory and automatically load changes in the browser.

##Usage:
First download and include in your project the file **client.js**:  
`<script src="client.js"></script>`  
  
Then you're ready to launch it specifying the file to load and the port to use  
`$    node livedev home.html 9090`  
and it will automatically open a chrome window, load your home.html on the port 9090 and start waiting for changes in the current directory.  
  
You can also just type  
`$    node livedev`  
and it will look for an index.html and launch it on the port 8888.

##Authors:
Davide Brunetti  
Edoardo Odorico

##Modules used:
[open](https://github.com/pwnall/node-open)  
[express](http://expressjs.com/)  
[socket.io](http://socket.io/)