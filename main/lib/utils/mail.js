import { createTransport } from 'nodemailer';
import * as userStore from '../store/user-store';

export async function inviteCollaborators(
  collaborators,
  message,
  projectName,
  projectHash
) {
  userStore.init();
  collaborators = !Array.isArray(collaborators)
    ? [collaborators]
    : collaborators;

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
  const user = userStore.get();
  const body = `${user.email} has requested your input for a new track they created on Ink.
Start collaborating here: https://ununu.io/collaborate/${projectHash}

Their message:
${message}

Cheers,
ununu.`.replace(/\n/g, '<br>');

  const mailOptions = {
    from: '"Ink Collaborator" <matters@ununu.io>',
    to: collaborators.join(','),
    subject: `You've been invited to collaborate on ${projectName}`,
    html: body,
  };

  return await transport.sendMail(mailOptions);
}
