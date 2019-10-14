import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: 'New enrollment',
      template: 'enrollment',
      context: {
        organizer: meetup.User.name,
        attendee: `${user.name} <${user.email}>`,
        meetup: meetup.title,
      },
    });
  }
}

export default new EnrollmentMail();
