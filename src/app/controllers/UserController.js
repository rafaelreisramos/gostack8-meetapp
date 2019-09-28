import User from '../models/User';

class UserController {
  async store(req, res) {
    this.user = await User.create(req.body);

    return res.send(this.user);
  }
}

export default new UserController();
