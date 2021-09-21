# The Biscuit Machine

The Biscuit Machine is an open source software project, used to monitor and control biscuit machines (using a [conveyor type system]("https://en.wikipedia.org/wiki/Conveyor_system"))

## Installation

The easiest way to get up and running is via [Docker]("https://www.docker.com/").

```bash
cd src
docker compose up
```

## Features

Currently we are still in a development phase, and we are still not production ready.
But even though you can still give it a try, and be ready wait for later releases.

Here's a small list of features, currently supported:

* Real-time UI used to monitor and control the machine
* Real-time communication between several connections
* Machine and biscuit packages reporting
* Users
* "Overheating" and "Oven too cold" event handlers
* Machine configurations
