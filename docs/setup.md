# Steps to generate SENDGRID TOKEN

- Go to https://sendgrid.com and signup\login.

- After logging in, go to settings and under settings go to WEB API KEYS.

- Click on CREATE API KEY. Give name to the API key and give it full access. You will get a WEB API KEY, this is the sendgrid token.

- Add `SENDGRID_TOKEN=YOUR_TOKEN_HERE` in the .env file.

# Steps to generate GITHUB TOKEN

- Go to github settings

- Select developer settings and under developer setting select personal access tokens.

- Create the token, give name and add the following permissions `write:packages, read:packages, delete:packages, repo`.

- Add `GITHUB_TOKEN=YOUR_TOKEN_HERE` in the .env file.
