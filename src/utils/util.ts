export default class Util {
  static async standardizeQuestionPayload(retrieveQuestion: any) {
    const questionData = {
      id: retrieveQuestion._id,
      title: retrieveQuestion.title,
      question: retrieveQuestion.question,
      owner: retrieveQuestion.owner.username,
      askedOn: retrieveQuestion.createdAt,
      updatedOn: retrieveQuestion.updatedAt,
    };

    let answers: any[] = [];
    retrieveQuestion.feedback.map((feedback: any) => {
      const answer = {
        answer: feedback.answer,
        acceptAnswer: feedback.acceptAnswer,
        answeredBy: feedback.userId,
        comments: feedback.comments,
        upVote: feedback.upVote.length,
        downVote: feedback.downVote.length,
        answeredOn: feedback.createdAt,
      };
      answers.push(answer);
    });

    let totalAnswer: string;
    if (answers.length > 1) {
      totalAnswer = `${answers.length} Answers`;
    } else if (answers.length === 1) {
      totalAnswer = `${answers.length} Answer`;
    } else {
      totalAnswer = 'No answer yet';
    }

    return {
      questionData,
      totalAnswer,
      answers,
    };
  }

  static async standardizeQuestionSearchResults(results: any[]) {
    let searchResults = [];
    results.map((result: any) => {
      const resultData = {
        title: result.title,
        question: result.question,
        askedBy: {
          username: result.owner.username,
          email: result.owner.email
        },
        feedback: result.feedback,
        askedOn: result.createdAt
      };
      searchResults.push(resultData);
    });
    return searchResults;
  }

  static async standardizeUserSearchResults(results: any[]) {
    let searchResult = [];
    results.map((result: any) => {
      const resultData = {
        username: result.username,
        email: result.email,
        questions: result.questions,
        joinedOne: result.createdAt
      };
      searchResult.push(resultData);
    });
    return searchResult;
  }
}
