import { Request, Response, NextFunction } from 'express'; // import typescript types

export const timeout = (seconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(seconds * 1000, () => {
      res.status(408).json({ message: 'Request timeout' });
    });
    next();
  };
}; 