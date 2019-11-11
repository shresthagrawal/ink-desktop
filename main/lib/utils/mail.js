import { createTransport } from 'nodemailer';

export async function inviteCollaborator(collaborators) {
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
  const mailOptions = {
    from: '"Ink Collaborator" <shresthsmartboy@gmail.com>',
    to: collaborators.join(','),
    subject: "You've been invited for collaboration on Ink",
    text: 'Here you go',
  };

  transport.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Invitation sent: ' + info.response);
    }
  });
}
