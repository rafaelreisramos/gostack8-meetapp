import { isBefore } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';
import Enrollment from '../models/Enrollment';

// Sempre que um usuário se inscrever no meetup, envie um e-mail ao organizador
// contendo os dados relacionados ao usuário inscrito. O template do e-mail fica por sua
// conta :)

class EnrollmentController {
  async store(req, res) {
    const { meetup_id } = req.params;

    const meetup = await Meetup.findByPk(meetup_id);
    const user = await User.findByPk(req.userId);

    if (req.userId === meetup.user_id) {
      return res.status(400).json({
        error: "You can't enroll in a meetup created by you",
      });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: "You can't enroll in a past meetup",
      });
    }

    const enrolled = await Enrollment.findOne({
      where: {
        meetup_id: meetup.id,
        user_id: user.id,
      },
    });

    if (enrolled) {
      return res
        .status(400)
        .json({ error: 'You already enroll to this meetup' });
    }

    const checkDate = await Enrollment.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "You can't attend two meetups at same date" });
    }

    const enrollment = await Enrollment.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
