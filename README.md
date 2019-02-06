# node-red-contrib-micropub

[Node-RED](http://nodered.org/) nodes to create new posts on Micropub weblogs.


## Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-micropub

## Usage

### Micropub Create

Create a new entry on a weblog.

The incoming message should provide the following properties.

* **payload** - a string, or a MF2 formatted object

