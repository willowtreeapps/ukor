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

A Ukor project is organized in a single `src` folder with properties files in order to configure Ukor. The `src` folder contains a single `main` folder which contain the default built sources, optional customized flavor sources as well as test sources.

```
/Project
- src/
  - main/
  - flavor1/
  - flavor2/
  - test/
  - testflavor1/
- ukor.properties
- ukor.local
```

The `ukor.properties` file is the main ukor configuration  file for the project and should be version controlled. The `ukor.local` file is a local properties file that contains local customizations for ukor overriding the `ukor.properties` file. This file is not expected to be version controlled. 

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

## Usage
```
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

# Contributing to Ukor

Contributions and suggestions are more than welcome. Please see our [Code of Conduct](/CODE_OF_CONDUCT.md) 
as well as our [Contributing Guidelines ](/CONTRIBUTING.md) for more information.
