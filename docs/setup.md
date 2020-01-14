# Setup

Prior to launching the application for the first time, you'll need to specify some environment variables. They are listed below. If you need to provide a token, the appropriate steps are explained in detail.

* `SENDGRID_TOKEN`: A token for using the [SendGrid](https://sendgrid.com/) service.
  - You can create an account at sendgrid.com using their free tier.
  - After logging in, navigate via ‘Settings’ to ‘API Keys’.
  - Click on ‘Create API Key’. Provide the new token with full access.
* `GITHUB_USER`: Your username on GitHub.
* `GITHUB_TOKEN`: A [personal token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) for your GitHub account.
  - Go to your GitHub account's settings.
  - Navigate to ‘Developer settings’, then ‘Personal access tokens’.
  - Create the token and give name to the token along with what kind of access you wanna provide to the token. Required are all `repo` permissions.