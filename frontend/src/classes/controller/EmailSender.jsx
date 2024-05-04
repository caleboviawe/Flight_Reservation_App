import axios from 'axios';

class EmailSender {
  constructor() {
    this.email = '';
    this.subject = '';
    this.message = '';
  }

  setEmail(email) {
    this.email = email;
  }

  setSubject(subject) {
    this.subject = subject;
  }

  setMessage(message) {
    this.message = message;
  }

  sendMail() {
    return axios.get('http://localhost:3001/sendEmail', {
      params: {
        email: this.email,
        subject: this.subject,
        message: this.message,
      },
    });
  }
}

export default EmailSender;