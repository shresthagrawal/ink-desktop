import { createTransport } from "nodemailer";

export async function inviteCollaborator(collaborators) {
  // For the pitch put the user name and pass
  let transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'username',
      pass: 'password'
    }
  });

  let mailOptions = {
    from: '"Ink Invite Collaborator" <shresthsmartboy@gmail.com>',
    to: collaborators,
    subject: 'Inviting you to work on the awesome project',
    text: 'Here you go'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Invitation sent: ' + info.response);
    }
  });
}
