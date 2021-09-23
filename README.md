# The Biscuit Machine

The Biscuit Machine is an open source software project, used to monitor and control biscuit machines (using a [conveyor type system](https://en.wikipedia.org/wiki/Conveyor_system))

## Installation

The easiest way to try out the project is via [Docker](https://www.docker.com/).

```bash
cd src
docker-compose up
```

## Features

Currently we are still in a development phase, and we are still not production ready.
But even though you can still give it a try.

Here's a small list of features, currently supported:

- Real-time UI used to monitor and control the machine
- Real-time communication between several connections
- Machine and biscuit packages reporting (currently you can check the reports only in the database)
- Users
- Machine configurations

## Limitations

As mentioned above, we are still not production ready, so here are some limitations

- One machine, per user (Multiple machines per user, can be easily added, but for the sake of simplicity for now we will support just one)
- In memory saga repository is used for the saga, again for the sake of simplicitly, but there are multiple options for persistant repositories that can be easily implemented.
- The UI may not be really responsive on different devices :/
- The UI state management may not be really good, and can be drastically improved with a flux pattern.

## Manual setup

If you want to contrubute to this project, you will need some tools for development.

- [The .NET Core SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/en/)
- Running MSSQL Server instance (personally I keep mine in a docker container)

### Server

- Apply the migrations by following the commands described in the [DATABASE.md](.\src\server\Infrastructure\TheBiscuitMachine.Infrastructure\DATABASE.md)

- Run these commands

```bash
cd src\server\Web\TheBiscuitMachine.Web
dotnet run
```

### UI

- Run the following commands

```bash
cd src\ui
yarn start
