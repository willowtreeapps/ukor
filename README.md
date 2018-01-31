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
Each flavor can contain a `constants.yaml`. The strings defined in this file will be added to any `.xml` or `.brs` source files. You can identify the string based on its path in the yaml file. The constants file is idea behind the constants file is similar to Android resource files.

### Example
constants.yaml
```
strings:
  contactSupport: 'contact support at 555-555-5555'
  login:
    signIn: 'Sign in now!'
```
source file (brs)
```
supportLabel.text = "@{strings.contactSupport}"
loginLabel.text = "@{strings.login.signIn}"
```
final built source file (brs)
```
supportLabel.text = "contact support at 555-555-555"
loginLabel.text = "Sign in now!"
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
### I want to make a new project
`ukor init`

### I want to build my project
`ukor make {flavor}`

### I want to install my project on a device
`ukor install {flavor} {device}`

or

`ukor install {flavor} {ip address} --auth=username:password` 

# Contributing to Ukor

Contributions and suggestions are more than welcome. Please see our [Code of Conduct](/CODE_OF_CONDUCT.md) 
as well as our [Contributing Guidelines ](/CONTRIBUTING.md) for more information.
