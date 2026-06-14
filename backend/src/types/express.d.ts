import * as express from 'express';
import { UserPayload } from '../interfaces/auth'; 

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; 
    }
  }
}