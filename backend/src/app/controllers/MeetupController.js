import { parseISO, isBefore } from 'date-fns';
import * as Yup from 'yup';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      order: ['date'],
      attributes: ['id', 'date', 'title', 'description', 'location'],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const date = parseISO(req.body.date);

    if (isBefore(date, new Date())) {
      res.status(400).json({ error: 'Past dates are not allowed' });
    }

    const meetup = await Meetup.create({
      user_id: req.userId,
      ...req.body
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation fails.' });
    }

    const meetup = await Meetup.findByPk(req.params.meetup_id);

    if (meetup.user_id !== req.userId) {
      res.status(401).json({
        error: "You dont't have permission to change this meetup",
      });
    }

    const date = parseISO(meetup.date);

    if (isBefore(date, new Date())) {
      res.status(400).json({
        error: "You can't update past meetups",
      });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetup_id);

    if (meetup.user_id !== req.userId) {
      res.status(401).json({
        error: "You dont't have permission to delete this meetup",
      });
    }

    const date = parseISO(meetup.date);

    if (isBefore(date, new Date())) {
      res.status(400).json({
        error: "You can't delete past meetups",
      });
    }

    const { id } = meetup;

    await meetup.destroy();

    return res.json({ message: `Meetup ${id} deleted` });
  }
}

export default new MeetupController();
