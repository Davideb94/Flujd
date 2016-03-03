# Flujd
Node app to watch over your working directory and automatically load changes in the browser.

##Download:
It's an npm package, so just type:  
`$    npm install flujd -g`

##Usage:
First have a beer, be sure it's a cold one.  
Now you can ~~download and~~ include in your project the file `client.js`:  
`<script src="client.js" type="text/javascript"></script>`  
**note:** there's no need to download it, it's automatically retrieved from the package.  

You're now ready to launch *flujd* specifying the file to load and the port to use  
`$    flujd --source home.html --port 9090`  
and it will automatically open a chrome window, load your home.html on the port 9090 and start waiting for changes in the current working directory.  
  
You can also just type inside your working directory  
`$    flujd`  
and it will look for an index.html and launch it on the port 8888.
  
To *smartly* exit the application, type  
`q`  
at any time, and it will properly shut down Flujd.  

##Authors:
Davide Brunetti  
Edoardo Odorico

##Contacts:
davide.brunetti@edu.unito.it  
[Davide's GitHub](https://github.com/Davideb94)  
[Edo's GitHub](https://github.com/edoardoo)

##Modules used:
[open](https://github.com/pwnall/node-open)  
[express](http://expressjs.com/)  
[socket.io](http://socket.io/)  
[colors](https://github.com/Marak/colors.js)  
[minimist](https://github.com/substack/minimist)  
