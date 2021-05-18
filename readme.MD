# GetCards Africa Frontend Challenge
This contains the solution to the buycoins africa challenge to clone the github repository page showing the first 20 repositories for a user

## Contributing
To run the project locally:
 - create a fork of the repo and clone to your local computer
 - Open up your github [developer settings](https://github.com/settings/tokens)
 - Create a new token and copy the new token generated.
 - Head over to local version of the app, locate the `main.js` file in the `scripts` folder
 - There's a `githubData` object in the file, should be around line 140 - 150.
 - Add the token field, so you have something like this
 ```js
const githubData = {
  token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  username,
};
 ```
