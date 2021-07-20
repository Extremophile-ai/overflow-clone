import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import { user1Login } from './user.data';
import { question1, question2 } from './question.data';

chai.should();
chai.use(chaiHttp);

describe('Handle Asking Question Functionalities', () => {
  let userToken: string;
  before((done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send(user1Login)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.token;
        done();
      });
  });
  it('it should not let unauthenticated users to ask questions', (done) => {
    chai
      .request(server)
      .post('/app/user/ask-questions')
      .send(question1)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have
          .property('message')
          .eql('Sorry, you have to login.');
        done();
      });
  });
  it('should not let logged in users ask questions without titles', (done) => {
    chai
      .request(server)
      .post('/app/user/ask-questions')
      .set('Authorization', `Bearer ${userToken}`)
      .send(question2)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property('message')
          .eql('Please enter a required field to continue.');
        done();
      });
  });
  it('should let a logged in user to ask questions', (done) => {
    chai
      .request(server)
      .post('/app/user/ask-questions')
      .set('Authorization', `Bearer ${userToken}`)
      .send(question1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('Question asked successfully.');
        done();
      });
  });
});

describe('Handle Answering Question Functionalities', () => {
  let userToken2: string;
  before((done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send({
        email: 'harry212@gmail.com',
        password: 'Password@123',
      })
      .end((err, res) => {
        if (err) throw err;
        userToken2 = res.body.token;
        done();
      });
  });
  it('it should not let unauthenticated users to answer questions', (done) => {
    chai
      .request(server)
      .post('/app/user/add-answer/60f07dfd1e6dd2a968a7a01c')
      .send({
        responseType: 'answer',
        answer: 'A typical answer to question',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have
          .property('message')
          .eql('Sorry, you have to login.');
        done();
      });
  });
  it('should let a logged user to answer questions', (done) => {
    chai
      .request(server)
      .post('/app/user/add-answer/60f07dfd1e6dd2a968a7a01c')
      .set('Authorization', `Bearer ${userToken2}`)
      .send({
        responseType: 'answer',
        answer: 'A typical answer to question',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('Answer submitted successfully.');
        done();
      });
  });
});

describe('Handle Comments, Upvote and Downvote Functionalities', () => {
  let userToken3: string;
  before((done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send({
        email: 'harry212@gmail.com',
        password: 'Password@123',
      })
      .end((err, res) => {
        if (err) throw err;
        userToken3 = res.body.token;
        done();
      });
  });
  it('it should not let unauthenticated users to add response to questions', (done) => {
    chai
      .request(server)
      .post(
        '/app/user/add-comment/60f07dfd1e6dd2a968a7a01c/60f0be819d217f5b5863e6e9'
      )
      .send({
        responseType: 'comment',
        comment: 'A typical comment to question',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have
          .property('message')
          .eql('Sorry, you have to login.');
        done();
      });
  });
  it('should let a logged in user to add comment to answers or questions', (done) => {
    chai
      .request(server)
      .post(
        '/app/user/add-comment/60f07dfd1e6dd2a968a7a01c/60f0be819d217f5b5863e6e9'
      )
      .set('Authorization', `Bearer ${userToken3}`)
      .send({
        responseType: 'comment',
        comment: 'A typical comment to question',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('You have successfully commented on this answer.');
        done();
      });
  });
  it('should let a logged in user to downVote answers to questions', (done) => {
    chai
      .request(server)
      .post(
        '/app/user/add-comment/60f07dfd1e6dd2a968a7a01c/60f0be819d217f5b5863e6e9'
      )
      .set('Authorization', `Bearer ${userToken3}`)
      .send({
        responseType: 'vote',
        vote: 'downVote',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('You have successfully voted against this answer.');
        done();
      });
  });
  it('should let a logged in user to upVote answers to questions', (done) => {
    chai
      .request(server)
      .post(
        '/app/user/add-comment/60f07dfd1e6dd2a968a7a01c/60f0be819d217f5b5863e6e9'
      )
      .set('Authorization', `Bearer ${userToken3}`)
      .send({
        responseType: 'vote',
        vote: 'upVote',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('You have successfully voted for this answer.');
        done();
      });
  });
});

describe('Handle Acceptance of An Answer as Most Accurate Functionalities', () => {
  let userToken: string;
  let userToken4: string;
  before((done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send(user1Login)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.token;
        done();
      });
  });
  before((done) => {
    chai
      .request(server)
      .post('/app/user/login')
      .set('Accept', 'application/json')
      .send({
        email: 'harry212@gmail.com',
        password: 'Password@123',
      })
      .end((err, res) => {
        if (err) throw err;
        userToken4 = res.body.token;
        done();
      });
  });
  it('it should not let unauthenticated users to mark answers as accepted', (done) => {
    chai
      .request(server)
      .post(
        '/app/user/select-answer/60f07dfd1e6dd2a968a7a01c/60f0be819d217f5b5863e6e9'
      )
      .send({
        responseType: 'answer',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have
          .property('message')
          .eql('Sorry, you have to login.');
        done();
      });
  });
  it('should not let users accept an answer to questions they do not own', (done) => {
    chai
      .request(server)
      .post(
        '/app/user/select-answer/60f07dfd1e6dd2a968a7a01c/60f0be819d217f5b5863e6e9'
      )
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        responseType: 'answer',
      })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have
          .property('message')
          .eql(
            "Sorry, you cannot mark this answer as accepted because you don't own the question."
          );
        done();
      });
  });
  it('should let a logged in user to accept answers to questions they own', (done) => {
    chai
      .request(server)
      .post(
        '/app/user/select-answer/60f07dfd1e6dd2a968a7a01c/60f0be819d217f5b5863e6e9'
      )
      .set('Authorization', `Bearer ${userToken4}`)
      .send({ responseType: 'answer' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('You have successfully marked this answer as accepted.');
        done();
      });
  });
});

describe('Handle Viewing of questions', () => {
  it('it should let users view questions', (done) => {
    chai
      .request(server)
      .get('/app/user/view-questions/60f07dfd1e6dd2a968a7a01c')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('it should let user search for questions, answers and other users', (done) => {
    chai
      .request(server)
      .get('/app/user/search?searchText=complicated question')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
