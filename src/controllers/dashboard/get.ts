import { Request, Response, NextFunction } from 'express';


export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   let page = req.body.page ? parseInt(req.body.page as string) : 1;
  //   let limit = req.body.limit ? parseInt(req.body.limit as string) : 10;
  //   return res.status(200).send({ message: 'Get Order Sucessfully', success: true, data: { result } });
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).send({ message: err.message, success: false, data: {} });
  // }
};
