# Livedev
Node app to watch over your working directory and automatically load changes in the browser.

##Usage:
Launch it specifying the file to load and the port to use<br>
<code>node livedev home.html 9090</code><br>
and it will automatically open a chrome window, load your home.html on the port 9090 and start waiting for changes in the current directory.<br><br>
You can also just type<br>
<code>node livedev</code><br>
and it will look for an index.html and launch it on the port 8888.

##Authors:
Davide Brunetti <br>
Edoardo Odorico

##Modules used:
[open](https://github.com/pwnall/node-open)<br>
[express](http://expressjs.com/)<br>
[socket.io](http://socket.io/)
