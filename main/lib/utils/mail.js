import { createTransport } from 'nodemailer';
import * as userStore from '../store/user-store';

export async function inviteCollaborator(collaborators, message, project, url) {
  userStore.init();
  const transport = createTransport({
    pool: true,
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
      // FIXME: I'll revoke that token after the MVP
      user: 'apikey',
      pass:
        'redacted',
    },
  });
  // TODO: Correct the template after pitch
  let user = userStore.get();
  let body = `${ user.email } has requested your input for a new track he created on Ink.<br>` + 
             `Start collaborating here: ${ url }<br><br>` +
             `${ message.replace('\n', '<br>') }<br><br>` +
             `Cheers,<br>` +
             `${ user.email }.`
             
  const mailOptions = {
    from: '"Ink Collaborator" <matters@ununu.io>',
    to: collaborators.join(','),
    subject: "You've been invited to collaborate on " + project,
    html: body,
  };

  transport.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Invitation sent: ' + info.response);
    }
  });
}
