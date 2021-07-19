import bcrypt from 'bcrypt';

const password = 'Password@123';
const hashPass = bcrypt.hashSync(password, 10);

const User = {
  model: 'User',
  documents: [
    {
      _id: '60f58610f142226347add05d',
      username: 'Powerjs',
      email: 'godspowercuche56@gmail.com',
      questions: [],
      password: hashPass,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '60f58610f142226347add05e',
      username: 'harry',
      email: 'harry212@gmail.com',
      password: hashPass,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '60f58610f142226347add05f',
      username: 'ejiofor',
      email: 'donaldagbakoba@gmail.com',
      password: hashPass,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '60382dd567c98d15dc9c8fc8',
      username: 'peter',
      email: 'peter@gmail.com',
      password: hashPass,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '60382dd567c98d15dc9c8fb4',
      username: 'francis',
      email: 'francis@gmail.com',
      password: hashPass,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
};

export default User;
