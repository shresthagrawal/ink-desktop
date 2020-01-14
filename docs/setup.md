# Steps to generate SENDGRID TOKEN

- Go to https://sendgrid.com and login.

- If you don't have a sendgrid account create one for free.

- After logging in go to settings and under settings click on WEB API KEYS.

- Click on CREATE API KEY. Give name to the API key and give it full access.

- You will get a WEB API KEY(that is your sendgrid token). Create a .env file in repo directory and type `SENDGRID_TOKEN=YOUR_TOKEN_HERE`.

# Steps to generate GITHUB TOKEN

- Go to github settings

- Select developer settings and under developer setting select personal access tokens.

- Create the token and give name to the token along with what kind of access you wanna provide to the token.

- Copy the token and inside the same .env file type `GITHUB_TOKEN=YOUR_TOKEN_HERE`.
