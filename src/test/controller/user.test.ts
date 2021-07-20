import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import {
  user1,
  user1a,
  user1b,
  user1Login,
} from './user.data';

chai.should();
chai.use(chaiHttp);

describe('/app/user/signup should handle user signup flow', () => {
  it('it should not create a user with incomplete sign up details.', (done) => {
    chai
      .request(server)
      .post('/app/user/signup')
      .set('Accept', 'application/json')
      .send({
        email: 'joseph@klluster.com',
        password: 'Dem@test1',
        username: ''
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it('it should create a user with complete details successfully', (done) => {
    chai
      .request(server)
      .post('/app/user/signup')
      .set('Accept', 'application/json')
      .send(user1)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have
          .property('message')
          .eql(
            'New user account created successfully.',
          );
        done();
      });
  });
  it('it should not create a user with an already registered email', (done) => {
    chai
      .request(server)
      .post('/app/user/signup')
      .set('Accept', 'application/json')
      .send(user1a)
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });
  it('it should not create a user with an existing username', (done) => {
    chai
      .request(server)
      .post('/app/user/signup')
      .set('Accept', 'application/json')
      .send(user1b)
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });
});

describe('/app/user/login should handle user login flow', () => {
  it('it should not let a user with incomplete login details sign in', (done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send({
        email: 'michael@klluster.com',
        password: ''
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it('it should not login a user with an incorrect password', (done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send({
        email: 'michael@klluster.com',
        password: 'Dem@test11',
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it('it should not not login a user with an unregistered email', (done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send({
        email: 'mathew@klluster.com',
        password: 'Dem@test1',
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it('it should login a registered user with complete details successfully', (done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send(user1Login)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have
          .property('message')
          .eql(
            'logged in successfully.',
          );
        done();
      });
  });
});
