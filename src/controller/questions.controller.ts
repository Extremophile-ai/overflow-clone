import { Request, Response } from 'express';
import QuestionService from '../services/questionServices';
import UserServices from '../services/userService';
import Util from '../utils/util';

const {
  askNewQuestion, replyQuestion,
  findQuestionById, addNewResponse,
  questionSearch
} = QuestionService;
const { newQuestion, searchUsers } = UserServices;
const { standardizeQuestionPayload, standardizeQuestionSearchResults, standardizeUserSearchResults } = Util;

export default class QuestionController {
  static async createNewQuestion(req: Request, res: Response) {
    try {
      const { _id } = req['decoded'].user;
      const { title, question } = req.body;
      if (!title || !question) {
        return res.status(400).json({
          error: true,
          message: 'Please enter a required field to continue.',
        });
      }
      const questionDetails = {
        title,
        owner: _id,
        question,
      };
      const askQuestion = await askNewQuestion(questionDetails);
      await newQuestion(_id, askQuestion.id);
      return res.status(200).json({
        success: true,
        message: 'Question asked successfully.',
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async addAnswer(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const { _id } = req['decoded'].user;
      const { responseType, answer } = req.body;
      const retrieveQuestion = await findQuestionById(questionId);
      if (retrieveQuestion) {
        if (responseType === 'answer') {
          // add answer
          const responseData = {
            answer,
            userId: _id,
          };
          const submitAnswer = await replyQuestion(questionId, responseData);
          if (submitAnswer) {
            return res.status(200).json({
              success: true,
              message: 'Answer submitted successfully.',
            });
          }
        }
      } else {
        return res.status(404).json({
          error: true,
          message: 'Question no longer exists.',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async addResponse(req: Request, res: Response) {
    try {
      const { questionId, feedbackId } = req.params;
      const { _id } = req['decoded'].user;
      const { comment, responseType, vote } = req.body;
      const retrieveQuestion = await findQuestionById(questionId);
      const questionFeedback = retrieveQuestion.feedback;
      const feedback = questionFeedback.find((answer: any) => answer._id.toString() === feedbackId);
      const answerPosition = questionFeedback.findIndex((answer: any) => answer._id.toString() === feedbackId);
      const userId = _id;
      if (responseType === 'comment') {
        if (!comment) {
          return res.status(400).json({
            error: true,
            message: 'Please enter a text in comment field to continue.',
          });
        } else {
          questionFeedback[answerPosition].comments = [
            ...questionFeedback[answerPosition].comments,
            { comment, userId },
          ];
          const update = {
            feedback: questionFeedback,
          };
          const newComment = await addNewResponse(questionId, update);
          if (newComment) {
            return res.status(200).json({
              success: true,
              message: 'You have successfully commented on this answer.',
            });
          }
        }
      } else if (responseType === 'vote') {
        const userVoted = questionFeedback[answerPosition];
        const upVoted = userVoted.upVote.find((findVote: any) => findVote.userId.toString() === userId);
        const downVoted = userVoted.downVote.find((findVote: any) => findVote.userId.toString() === userId);
        const upVoteArray = feedback.upVote;
        const downVoteArray = feedback.downVote;
        const upVoteIndexPosition = upVoteArray.findIndex((findVote: any) => findVote.userId.toString() === userId);
        const downVoteIndexPosition = downVoteArray.findIndex((findVote: any) => findVote.userId.toString() === userId);
        if (vote === 'upVote') {
          // check if user had voted
          if (upVoted) {
            return res.status(403).json({
              error: true,
              message: 'Sorry, you cannot upvote this answer more than once.',
            });
          }

          // check if user had previously downVoted this answer
          if (downVoted) {
            downVoteArray.splice(downVoteIndexPosition, 1);
            const update = { feedback };
            await addNewResponse(questionId, update);
          }

          questionFeedback[answerPosition].upVote = [...questionFeedback[answerPosition].upVote, { userId }];
          const update = {
            feedback: questionFeedback,
          };
          const addVote = await addNewResponse(questionId, update);
          if (addVote) {
            return res.status(200).json({
              success: true,
              message: 'You have successfully voted for this answer.',
            });
          }
        } else if (vote === 'downVote') {
          // check if user had downVoted before
          if (downVoted) {
            return res.status(403).json({
              error: true,
              message: 'Sorry, you cannot downvote this answer more than once.',
            });
          }

          // check if user had previously upVoted this answer
          if (upVoted) {
            upVoteArray.splice(upVoteIndexPosition, 1);
            const update = { feedback };
            await addNewResponse(questionId, update);
          }

          questionFeedback[answerPosition].downVote = [...questionFeedback[answerPosition].downVote, { userId }];
          const update = {
            feedback: questionFeedback,
          };
          const addVote = await addNewResponse(questionId, update);
          if (addVote) {
            return res.status(200).json({
              success: true,
              message: 'You have successfully voted against this answer.',
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async selectAnswer(req: Request, res: Response) {
    try {
      const { questionId, answerId } = req.params;
      const { _id } = req['decoded'].user;
      const { responseType } = req.body;
      const retrieveQuestion = await findQuestionById(questionId);
      const questionFeedback = retrieveQuestion.feedback;
      const feedbackPosition = questionFeedback.findIndex((feedback: any) => feedback._id.toString() === answerId);

      if (responseType === 'answer') {
      // accept answer as best
        if (retrieveQuestion.owner._id == _id) {
          questionFeedback[feedbackPosition].acceptAnswer = true;
          const update = {
            feedback: questionFeedback,
          };
          const chooseAnswer = await addNewResponse(questionId, update);
          if (chooseAnswer) {
            return res.status(200).json({
              success: true,
              message: 'You have successfully marked this answer as accepted.',
            });
          }
        } else {
          return res.status(403).json({
            error: true,
            message: "Sorry, you cannot mark this answer as accepted because you don't own the question.",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async viewQuestion(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const retrieveQuestion = await findQuestionById(questionId);
      if (retrieveQuestion) {
        const question = await standardizeQuestionPayload(retrieveQuestion);
        return res.status(200).json({
          success: true,
          message: 'Question retrieved',
          data: {
            questionData: question.questionData,
            totalAnswer: question.totalAnswer,
            answers: question.answers
          }
        });
      } else {
        return res.status(404).json({
          error: true,
          message: 'This question no longer exist',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const searchText = { $text: { $search: req.query.searchText, $language: 'en' } };
      const searchQuestions = await questionSearch(searchText);
      const userSearch = await searchUsers(searchText);
      if ((searchQuestions.length > 0) && (userSearch.length > 0)) {
        const questionSearchResults = await standardizeQuestionSearchResults(searchQuestions);
        const userSearchResult = await standardizeUserSearchResults(userSearch);
        return res.status(200).json({
          success: true,
          message: 'Search was successful.',
          data: {
            userSearchResult,
            questionSearchResults
          }
        });
      } else if (searchQuestions.length > 0) {
        const questionSearchResults = await standardizeQuestionSearchResults(searchQuestions);
        return res.status(200).json({
          success: true,
          message: 'Search was successful.',
          data: {
            questionSearchResults
          }
        });
      } else if (userSearch.length > 0) {
        const userSearchResult = await standardizeUserSearchResults(userSearch);
        return res.status(200).json({
          success: true,
          message: 'Search was successful.',
          data: {
            userSearchResult
          }
        });
      } else {
        return res.status(404).json({
          error: true,
          message: "Your search query didn't yield any results",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }
}
