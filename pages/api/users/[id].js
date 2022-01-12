import { PrismaClient } from '@prisma/client'
import moment from 'moment';

export default async function handler(req, res) {

  console.log('req headers', req.headers);
  console.log('req params', req.query);

  const prisma = new PrismaClient();

  if (req.method === 'GET') {
    const {id} = req.query;
    const result = await prisma.user.findUnique({
      where: {id: parseInt(id, 10)},
    });
    res.status(200).json(result);

  } else if (req.method === 'DELETE') {
    const {id} = req.query;
    const result = await prisma.user.delete({
      where: {id: parseInt(id, 10)},
    });
    res.status(200).json(result);

  } else if (req.method === 'PATCH') {
    const {id} = req.query;
    const user = req.body;
    if (!!user.birthDate) {
      user.birthDate = moment.utc(user.birthDate).toDate();
    }
    const result = await prisma.user.update({
      data: {
        ...user,
      },
      where: {
        id: parseInt(id, 10),
      },
    });
    res.status(200).json(result);

  } else {
    res.status(405).json({error: 'Invalid method.'});
  }
}
