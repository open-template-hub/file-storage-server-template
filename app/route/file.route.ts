/**
 * @description holds file routes
 */

import { authorizedBy, ResponseCode, UserRole, } from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { FileController } from '../controller/file.controller';
import { File } from '../interface/file.interface';

const subRoutes = {
  root: '/',
  me: '/me',
  public: '/public',
};

export const router = Router();

const fileController = new FileController();

router.get( subRoutes.public, async ( req: Request, res: Response ) => {
  // Download a file
  let file = await fileController.downloadFile( res.locals.ctx, req.query.id );
  res.status( ResponseCode.OK ).json( { file } );
} );

router.post(
    subRoutes.me,
    authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ),
    async ( req: Request, res: Response ) => {
      // Upload a file
      let id = await fileController.createFile(
          res.locals.ctx,
          req.body.payload as File
      );
      res.status( ResponseCode.CREATED ).json( { id } );
    }
);

router.get(
    subRoutes.me,
    authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ),
    async ( req: Request, res: Response ) => {
      // Download a file
      let file = await fileController.downloadFile( res.locals.ctx, req.query.id );
      res.status( ResponseCode.OK ).json( { file } );
    }
);
