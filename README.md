
Seafoam Desktop
===============

The Seafoam Desktop project provides a graphical user interface around the [Seafoam](https://github.com/shopify/seafoam)
tool for working with compiler graphs.

Development
-----------

Seafoam Desktop is a React-based Electron app. As such, you'll need a functioning Node environment if you would like to
build Seafoam Desktop from source. We use `npm` to manage dependencies and execute custom scripts. A non-exhaustive
list of technologies used in this project are:

* React
* Electron
* Electron Forge
* TypeScript
* Node
* Ant Design System

To get started:

```bash
$ git clone https://github.com/Shopify/seafoam-desktop.git
$ cd seafoam-desktop
$ npm install
$ npm run prepare
$ npm start
```

Executing `npm start` will start up the Electron application and a local web server running the React portion of the
project. _package.json_ lists several other scripts to help with code formatting, linting, building an Electron
distribution, and so on.

### Prerequisites

As an Electron-based application, you'll need to have Node installed. Our CI system tests against both the current
version of Node and the most recent LTS. Since Electron packages up the Node environment in the final distribution,
we do not need to support a wide range of Node versions.

If on macOS and using Homebrew, you can install Node:

```bash
$ brew install node
```

On other operating systems, you'll probably be best off using whichever Node version manager you use on that platform
and install a compatible version. npm is included with Node.js installations.

As a wrapper around Seafoam, this project requires Seafoam to exist on the target system. In particular, the `seafoam`
command must be available on the `PATH`. The Seafoam docs have [installation steps](https://github.com/shopify/seafoam#installation)
for a variety of systems.

### Project Goals

The principle goal of this project is to make working with a collection of compiler graphs easy. Seafoam is a fantastic
tool, but requires invocation of multiple sub-commands to interrogate a compiler dump file and render the output from
the desired compiler phase. When actively working on improving a narrow area of interest, the cost of working with the
CLI is not problematic. However, that workflow is not conducive to browsing and serendipitous discovery. The goal of
Seafoam Desktop is to simplify invocation of Seafoam command sequences with a streamlined view over the filesystem.

### Why Electron?

In order to make working with compiler graphs fast and easy, we need access to the filesystem. While we could package
all of the Seafoam Desktop functionality into a web service, uploading compiler graph files, of which there may be many
and they may be multiple megabytes each, would make for a slow workflow. Additionally, each developer interested in
looking at compiler graphs would need to stand a server up or work with a trusted third party.

Having established that we want local system access and a GUI, that helped narrow the solution space down. We also wanted
the GUI to be cross-platform, since compiler work is often cross-platform. Finally, we needed something we could make
functional in the time constraints of a hackathon and that could ideally make use of in-house Shopify talent. Shopify
makes heavy use of React and React Native. Unfortunately, the React Native desktop story isn't great on Linux, so we
had to disqualify that as an option. Electron was one of the last options that matched all criteria, so we went with it.

### General Notes

* When running Seafoam Desktop in development on macOS, the application name in the menu will appear as "Electron". The
name will be correct when running from a built distribution.
* If doing active development, please ensure you've run `npm run prepare`, which will set up git pre-commit hooks. The
project does have CI configured, but it's best to catch linting and formatting issues before you've pushed commits.

