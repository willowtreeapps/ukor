<br>
<p align="center">
    <img width="200px" height="200px" src="artwork/ukor-logo.svg"/>
</p>
<br>

# Ukor

A build tool for Roku projects

Features:
- Multiple flavors
- Install to device
- Project and local configuration properties
- Save installation targets and authentication details
- Set default install targets
- Search for Rokus on your local network

## Questions?

Join us in the #tooling channel on the [Roku Developers Slack](https://join.slack.com/t/rokudevelopers/shared_invite/enQtMzU5Njc5ODM5MzAyLWE2MTIxMWQ5Nzg0Y2E3ODgzYTk4NmQxMDg2YjRjYjdiMzM5ZDU4ZTc0YmM1ZmU0Mzc5MzI3ODU3MmUxOTdlNTE).

## Requirements

* Node **v7.6** or higher.

## Project setup

You can install Ukor via NPM.

```sh
npm install -g @willowtreeapps/ukor
```

A Ukor project is organized in a single `src` folder with properties files in order to configure Ukor. The `src` folder contains a single `main` folder which contain the default built sources, optional customized flavor sources as well as test sources.

```
/Project
- src/
  - main/
    - components/
    - source/
    - anyThingYouWant/
    - constants.yaml
  - flavor1/
  - flavor2/
  - test/
  - testflavor1/
- ukor.properties
- ukor.local
```

The `ukor.properties` file is the main ukor configuration  file for the project and should be version controlled. The `ukor.local` file is a local properties file that contains local customizations for ukor overriding the `ukor.properties` file. This file is not expected to be version controlled.

The `constants.yaml` file is *per-flavor*. In the file, you can define strings (or even any text to insert into a file), and can be identified with `@{some.category.id}` in brightscript OR xml source files.

### Example properties (yaml)
```yaml
buildDir: 'build'
sourceDir: 'src'
preBuild: 'scripts/main.js'
mainFlavor: 'flavorName'
flavors: {
  flavorName: {
    src: ['flavor', 'main']
  },
  flavorNameRelease: {
    base: 'flavorName',
    src: ['release']
  }
}
rokus: {
  roku2: {
    serial: '123123123',
    auth: {
      user: 'rokudev',
      pass: 'YourPassword'
    }
  }
}
```

## Constants
Each flavor can contain string resources specified in the `YAML` format by providing `constants.yaml` file. Strings can be referenced by their path specified in any `.xml` or `.brs` source files. For example,

Given a `constants.yaml` file:

```yml
strings:
  contactSupport: 'contact support at 555-555-5555'
  login:
    signIn: 'Sign in now!'
```

Strings can be references in a `*.brs` file using the following interpolation syntax `@{ <your_resource_here> }`. For example,

```yml
supportLabel.text = "@{strings.contactSupport}"
loginLabel.text = "@{strings.login.signIn}"
```

The final generated `*.brs` source file will have the strings inlined like so.

```yml
supportLabel.text = "contact support at 555-555-555"
loginLabel.text = "Sign in now!"
```

## Usage

```
Usage: ukor [options] [command]


  Commands:

    make [flavors...]             Bundle your channel into a zip to the build directory
    install [flavor] [roku] [-c]  Bundle then deploy your channel to a named roku
    package <flavor> <roku>       Package a channel flavor with a roku device
    rekey <roku>                  Rekey your device (an packageReference is required)
    lint <flavor>                 Lint a channel flavor
    console [roku]                Launch the Telnet console for the named roku
    debugger [roku]               Launch the Telnet debugger for the named roku
    find                          Search for rokus on the network
    init [flavors...]             Initialize a ukor project
    test                          Run the tests
    validate                      Validate ukor.properties and ukor.local
    help [cmd]                    display help for [cmd]

  Options:

    -h, --help     output usage information

    -v, --verbose  Turn on verbose logging
```

## Quick reference

* I want to make a new project
```
ukor init
```

* I want to build my project
```
ukor make [flavor]
```

* I want to install my project on a device
```
ukor install [flavor] [device]
```
or

```
ukor install [flavor] [ip address] --auth=[username]:[password]
```

* I want to package my project using a device
```
ukor package [flavor] [device]
```
or

```
ukor package [flavor] [ip address] --auth=[username]:[password]
```

* I want to rekey my device
```
ukor rekey [device]
```
or

```
ukor package [ip address] --auth=[username]:[password]
```

NOTE: you will need to define a `packageReference` and `packageKey` in `ukor.properties.yaml`.
`packageReference` represent device id and `packageKey` does for password


## Testing

Ukor uses `UnitTestFramework.brs` as part of its unit test runner and test reporting feature. This is especially useful if you plan on having Continuous Integration as part of your workflow.

### Setup

First, copy the modified `UnitTestFramework.brs` in [lib/brs/](../master/lib/brs/UnitTestFramework.brs) to your `src/test/source/` folder, so it loads at startup for when testing.

> Note that the original `UnitTestFramework.brs` can be found [here](https://github.com/rokudev/unit-testing-framework)

Next, dd the following snippet in your startup function, after `screen.show()` but before the event loop

```brightscript
if params.RunTests = "true"
  runner = TestRunner()
  if params.host <> invalid
    runner.logger.SetServer(params.host, params.port)
  else
    runner.logger.SetServerURL(params.url)
  end if
  ' other setup if needed
  runner.run()
end if
```

You should now be able to execute your test suite using the `test` command.

```
ukor test [flavor] [roku]
```

### What's happening?

Basically, we modified the rokudev `UnitTestFramework.brs` file to make a `JSON` of test results, and then `POST` that to the specified server. `ukor test [flavor]` builds and deploys the specified flavor with the `test` src folder, and then restarts the channel with parameters to run tests and point the results to the client machine. `ukor` will log the results, and also output results in `xml` and `junit` format to `.out/tests/ukorTests.[xml|junit]`.

notes:
- Ukor now copies `UnitTestFramework.brs` with `ukor init`!
- `UnitTestFramework.brs` is now up to date with the rokudev repo!

# Contributing to Ukor

Contributions and suggestions are more than welcome. Please see our [Code of Conduct](/CODE_OF_CONDUCT.md)
as well as our [Contributing Guidelines ](/CONTRIBUTING.md) for more information.
