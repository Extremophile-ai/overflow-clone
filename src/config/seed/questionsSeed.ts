const Question = {
  model: 'Question',
  documents: [
    {
      _id: '60f07dfd1e6dd2a968a7a01c',
      title: 'new question',
      question: 'a very complicated new question',
      owner: '60f58610f142226347add05e',
      feedback: [
        {
          _id: '60f0be819d217f5b5863e6e9',
          userId: '60f58610f142226347add05e',
          answer: 'normal level answer',
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
};

export default Question;
