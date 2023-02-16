const frisby = require('frisby');

/*
    How to write Frisby API tests 
    - not all tests will be in this file!! we will separate the tests into different files based gorupings with the endpoints
        HOWEVER! if you create a file it MUST be blank_spec.js otherwise it will not run the tests in it.
    - it(): the function that contains the test, the first parameter is a description of the test and should be detailed 
        because that is what will show up in test results 
    - the actual requests themselves: frisby.get(), frisby.post(), frisby.put(), etc for detailed documentation about these
        methods check out their website (https://docs.frisbyjs.com/)
    - .expect(): comes after the actual request you can put things you're expecting such as the status of the result
    - describe(): if tests need to be nested (aka depend on other tests) they go inside a describe("description", function() {
        it(blah blah).then(what comes after)}). this can come in handy when getting something to use in an update
    - may be updated once I have a clearer idea of how this API is gonna look
    - very high chances that I will create a constants file later on too so stay tuned for that
    xoxo vicky
*/

it('should be a teapot', function () {
  return frisby.get('http://httpbin.org/status/418')
    .expect('status', 418);
});