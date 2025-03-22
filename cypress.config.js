const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    pageLoadTimeout : 30000,
    defaultCommandTimeout : 10000,
    
    //baseUrl : 'https://practicetestautomation.com/practice-test-login/',
    username : "student",
    pwds : "Password123",

    
    failOnStatusCode: false,
  
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return require ('./cypress/plugins/index.js')(on, config)
      //"test": "echo \"Error: no test specified\" && exit 1"
      
    },
  },
});
