# SEGroup4Fitocity

## Deploying to `prod`

1) Ensure the backend and frontend servers work as expected with localhost:5000 and localhost:3000 respectively on the `main `branch.
2) Merge the changes into the `prod` branch.
3) Replace the following lines of code (DO NOT replace any of the instances in README.md)
    1) Replace "`host: 'localhost:3000',`" with "`host: 'fitocity.herokuapp.com',`" in `/server/Routes/auth.js`
    2) Replace "`protocol: 'http',`" with "`protocol: 'https',`" in `/server/Routes/auth.js`
    3) Replace instances of "`http://localhost:3000`" with "`https://fitocity.herokuapp.com`"
    4) Replace instances of "`http://localhost:5000`" with "`https://fitocity.herokuapp.com`"
    5) Create a new commit
    6) Run `git push heroku *your-branch-name*:main` (this assumes you have a remote pointing to the fitocity heroku repo)
