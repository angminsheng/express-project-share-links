# Express Project | ShareLinks

## 0. Methodology

1. Wireframes (sheet of paper, figma.com, ...)
2. List of routes
3. List of models
4. Create a `node/seeds.js`
5. Code!

## 1. Wireframes

![image](https://user-images.githubusercontent.com/5306791/52468571-6f570a80-2b89-11e9-8c48-177a9352bbb2.png)


## 2. List of routes

1. `GET  /`
2. `POST /add-link`
3. `GET  /like-link/:linkId`
4. `GET  /auth/signup`
5. `POST /auth/signup`
6. `GET  /auth/login`
7. `POST /auth/login`
8. `GET  /delete-link/:linkId`
9. `GET  /profile`

## FAQ

### How can I install Bootstrap with SCSS?

First, install the NPM package `bootstrap`
```
npm i bootstrap
```

Then you can write the following `public/stylesheets/style.scss`
```scss
$primary: #563d7c; // Override the default $primary color to purple

@import '../..//node_modules/bootstrap/scss/bootstrap.scss';

// I can write my own SCSS below
// ...
```