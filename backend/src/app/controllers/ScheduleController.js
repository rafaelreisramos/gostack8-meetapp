import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const { page } = req.query;
    const date = req.query.date ? parseISO(req.query.date) : req.query.date;

    if (!page || !date) {
      return res.status(400).json('error: Missing query parameters');
    }

    const ITENS_PER_PAGE = 10;

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
      order: ['date'],
      attributes: ['id', 'date', 'title', 'description', 'location'],
      limit: ITENS_PER_PAGE,
      offset: (page - 1) * ITENS_PER_PAGE,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new ScheduleController();
