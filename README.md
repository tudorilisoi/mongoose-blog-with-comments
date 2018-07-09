# A node/express/mongoose blog app example

## Features:
 
 - lots of comments in the code so you can (hopefully) easier figure it out
 - async/await to simplify working with promises
 - modular, add a `/server/api/<newFeature>` folder and change `server/api/api.js` to enable the newly added router and models
 - TODO demonstrates relations between mongoose collections (e.g. (blog post) -> (post comments) )
 
## Installation

- `git clone` it locally or (better) fork it with Github
- run `npm install` or `yarn` 
- run `npm run develop` in a terminal to start developing locally. The server will reload every time you make changes in the code
- `npm run test:api` will run all the tests it can find in the server folder and its subfolders. You need to name the test files after this pattern: `someArbitraryName.test.js`

### Misc.

Created for [Thinkful](https://github.com/Thinkful-Ed) students by [@tudorilisoi](https://github.com/tudorilisoi)

Feel free to contribute your pull requests and any suggestions you might have.

Reach me on twitter: [@tudorvi](https://twitter.com/tudorvi)



