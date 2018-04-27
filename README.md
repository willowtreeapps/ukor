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
```sh
Usage: ukor [options] [command]


  Commands:

    make [flavors...]        Bundle your channel into a zip to the build directory
    install [flavor] [roku]  Bundle then deploy your channel to a named roku
    find                     Search for rokus on the network
    validate                 Validate ukor.properties and ukor.local
    init                     Initialize a ukor project
    test                     Install, then run test on a Roku, and receive results on http
    help [cmd]               display help for [cmd]

  Options:

    -h, --help     output usage information

    -v, --verbose  Turn on verbose logging
```
### I want to make a new project
`ukor init`

### I want to build my project
`ukor make {flavor}`

### I want to install my project on a device
`ukor install {flavor} {device}`

or

`ukor install {flavor} {ip address} --auth=username:password` 

## Testing

- copy the modified `UnitTestFramework.brs` in [lib/brs/](../master/lib/brs/UnitTestFramework.brs) to your `src/test/source/` folder, so it loads at startup for when testing
  - original `UnitTestFramework.brs` can be found [here](https://github.com/rokudev/unit-testing-framework) 
- add the following snippet in your startup function, after `screen.show()` but before the event loop
```
if params.RunTests = "true"
  runner = TestRunner()
  if params.host <> invalid
    runner.logger.SetServer(params.host, params.port, params.protocol)
  else
    runner.logger.SetServerURL(param.url)
  end if
  # other setup if needed
  runner.run()
end if
```
- run `ukor test [flavor] [roku]` 

### What's happening?
Basically, we modified the rokudev `UnitTestFramework.brs` file to make a json of test results, and then `POST` that to the specified server. `ukor test <flavor>` builds and deploys the specified flavor with the `test` src folder, and then restarts the channel with parameters to run tests and point the results to the client machine. `ukor` will log the results, and also output results in `xml` and `junit` format to `.out/tests/ukorTests.[xml|junit]`. 

notes: 
- Ukor does not currently have a command to add `UnitTestFramework.brs` to the project automagically. You'll have to copy it from the repo for now.
- `UnitTestFramework.brs` is not up to date with ther current rokudev version

# Contributing to Ukor

Contributions and suggestions are more than welcome. Please see our [Code of Conduct](/CODE_OF_CONDUCT.md) 
as well as our [Contributing Guidelines ](/CONTRIBUTING.md) for more information.
