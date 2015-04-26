# Generator for Requirejs, Grunt and Backbone [![Build status](https://travis-ci.org/smulyono/generator-rgb.svg?branch=master)](https://travis-ci.org/smulyono/generator-rgb)

> Yeoman generators for scaffolding a lightweight and simple Backbone with AMD support (requirejs) which also includes
> grunt tasks for minifications and optimization

## Features

* [x] Backbone with AMD (requirejs) supports
* [x] HTML5 template with modernizr
* [x] Less supports
* [x] Requirejs optimization script
* [x] Assets optimization (Javascript and CSS) and aggregation

## Getting Started

Make sure you have Yeoman installed : 
```bash
$ npm install -g yo
```

Then install rgb generators : 
```bash
$ npm install -g generator-rgb
```

You can also just link them for local installation:
```bash
$ npm link
```

__OK__, now we ready to start creating some apps. First, let's create directory and run generators from the directory : 
```bash
$ mkdir newApp && cd $_
$ yo rgb 
```

It will ask for your basic modules application description.


### Available Tasks 

__For development__:
```bash
$ npm start
```

__For building the optimized scripts__:
```bash
$ npm run build
OR
$ grunt build
```

__For running in production mode__:
```bash
$ npm run start_live
OR
$ grunt connect:live
```

## License

__MIT__

## Future Features
* [ ] Almond replacement for more requirejs optimization
* [ ] React page with backbone boilerplate
* [ ] Famo.us page with requirejs/backbone boilerplate
* [ ] Multi SPA organization layouts 
  * [ ] Support creating individual SPA sites
  * [ ] Support creating individual pages

