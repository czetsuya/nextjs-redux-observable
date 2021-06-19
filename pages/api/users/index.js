import prisma from 'lib/prisma';
import moment from 'moment';

export default async function handle(req, res) {

  console.log('req receive', req.query);

  try {
    if (req.method === 'GET') {
      const {offset = 0, limit = 20} = req.query;
      const users = await prisma.user.findMany({
        skip: parseInt(offset, 10),
        take: parseInt(limit, 10),
      });
      const count = await prisma.user.count();
      res.status(200).json({users, count});

    } else if (req.method === 'POST') {
      const user = req.body;
      if (!!user.birthDate) {
        user.birthDate = moment.utc(user.birthDate).toDate();
      }
      const result = await prisma.user.create({
        data: {
          ...user,
        },
      });
      res.status(200).json(result);

    } else {
      res.status(405).json({error: 'Invalid method.'});
    }

  } catch (error) {
    res.status(500).json(error);
  }

  console.log('res sent')
}
