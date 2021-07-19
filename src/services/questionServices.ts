import Question from '../model/questions';

export default class QuestionService {
  static async askNewQuestion(questionDetails: {}) {
    try {
      return await Question.create(questionDetails);
    } catch (error) {
      return error;
    }
  }

  static async replyQuestion(questionId: string, responseData: {}) {
    try {
      return await Question.updateOne(
        { _id: questionId },
        {
          $addToSet: {
            feedback: [responseData],
          },
        },
        {
          new: true,
        }
      );
    } catch (error) {
      return error;
    }
  }

  static async findQuestionById(questionId: string) {
    try {
      return await Question.findOne({ _id: questionId }).populate({
        path: 'owner',
        select: {
          username: 1,
          email: 1,
        }
      });
    } catch (error) {
      return error;
    }
  }

  static async addNewResponse(questionId: string, update: {}) {
    const filter = { _id: questionId };
    const newResponse = await Question.findOneAndUpdate(filter, update, {
      new: true
    });
    return newResponse;
  }

  static async questionSearch(searchText: any) {
    try {
      return await Question.find(searchText).populate({
        path: 'owner',
        select: {
          username: 1,
          email: 1,
        }
      });
    } catch (error) {
      return error;
    }
  }
}
