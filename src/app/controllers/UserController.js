import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(401).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.send({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(8)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { oldPassword } = req.body;
    let { email } = req.body;

    /**
     * User can update his own email so we check by id.
     * userId cames from session jwt authentication middleware.
     */
    const user = await User.findByPk(req.userId);

    /**
     * Since email is not requires we have to check if it really exists
     */
    if (email && email !== user.email) {
      /**
       * This checks if another user already uses this email.
       *
       * At this point we know that this user already exists as checked by
       * session controller middleware.
       */
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User email already exists' });
      }
    } else {
      email = user.email;
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
