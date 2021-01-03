/**
 * @description holds file routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { ResponseCode } from '@open-template-hub/common';
import { FileController } from '../controller/file.controller';
import { File } from '../interface/file.interface';

const subRoutes = {
  root: '/',
  me: '/me',
  public: '/public',
};

export const publicRoutes = [subRoutes.public];

export const router = Router();

const fileController = new FileController();

router.get(subRoutes.public, async (req: Request, res: Response) => {
  // Download a file
  let file = await fileController.downloadFile(res.locals.ctx, req.query.id);
  res.status(ResponseCode.OK).json({ file });
});

router.post(subRoutes.me, async (req: Request, res: Response) => {
  // Upload a file
  let id = await fileController.createFile(
    res.locals.ctx,
    req.body.payload as File
  );
  res.status(ResponseCode.CREATED).json({ id });
});

router.get(subRoutes.me, async (req: Request, res: Response) => {
  // Download a file
  let file = await fileController.downloadFile(res.locals.ctx, req.query.id);
  res.status(ResponseCode.OK).json({ file });
});
