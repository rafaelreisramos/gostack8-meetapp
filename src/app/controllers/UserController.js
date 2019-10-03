import User from '../models/User';

class UserController {
  async store(req, res) {
    const user = await User.create(req.body);

    return res.send(user);
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    /**
     * User can update his own email so we check by id.
     * userId cames from session jwt authentication middleware.
     */
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
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
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    console.log(user);

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
