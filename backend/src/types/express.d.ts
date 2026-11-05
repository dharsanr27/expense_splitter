import * as express from 'express';
import { UserPayload } from './index.js'; 

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; 
    }
  }
}
