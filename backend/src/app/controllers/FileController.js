import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

class FileController {
  store(req, res) {
    return res.json({ ok: true });
  }
}

export default new FileController();
