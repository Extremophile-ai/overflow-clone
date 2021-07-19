import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './config/database';
import routes from './routes/routes';

const app = express();

dotenv.config();

const port = process.env.PORT || 3010;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// database connection
connection();

app.use('/app', routes);

app.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: server is listening on port: ${port}`);
});