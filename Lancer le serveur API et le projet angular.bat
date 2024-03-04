@echo off
cd mon-projet-api
start cmd /k node server.js
cd..
cd my-project-website
start cmd /k ng serve
start http://localhost:4200
