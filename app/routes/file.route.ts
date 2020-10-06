/**
 * @description holds file routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { ResponseCode } from '../util/constant';
import { FileController } from '../controllers/file.controller';
import { File } from '../models/file.model';

const subRoutes = {
  root: '/'
}

const router = Router();

const fileController = new FileController();

router.post(subRoutes.root, async (req: Request, res: Response) => {
  // Upload a file
  let id = await fileController.createFile(res.locals.ctx, req.body.payload as File);
  res.status(ResponseCode.CREATED).json({ id });
 });

router.get(subRoutes.root, async (req: Request, res: Response) => {
 // Download a file
 let file = await fileController.downloadFile(res.locals.ctx, req.query.id);
 res.status(ResponseCode.OK).json({ file });
});

export = router;
