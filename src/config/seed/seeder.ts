import seeder from 'mongoose-seed';
import dotenv from 'dotenv';
import userSeed from './userSeed';
import questionSeed from './questionsSeed';

dotenv.config();

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
  // Data array containing seed data - documents organized by Model
const data = [
  userSeed,
  questionSeed
];
  // seeder.connect(process.env.DEV_MONGO_URI, options, () => {

seeder.connect(process.env.TEST_MONGO_URI, options, () => {
  // load models
  seeder.loadModels([
    './src/model/user.ts',
    './src/model/questions.ts'
  ]);

  //   clear database
  seeder.clearModels(['User', 'Question'], () => {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, (err: any, done: any) => {
      if (err) {
        console.log(err);
        return err;
      }
      if (done) {
        console.log('seeding done');
      }
      seeder.disconnect();
    });
  });
});
