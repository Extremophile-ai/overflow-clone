import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true,
    index: true
  },
  feedback: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      answer: {
        type: String,
        index: true
      },
      acceptAnswer: {
        type: Boolean,
        default: false
      },
      comments: [
        {
          comment: {
            type: String,
          },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      upVote: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      downVote: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

QuestionSchema.index({
  title: 'text',
  question: 'text',
  'feedback.answer': 'text',

});

export default mongoose.model('Question', QuestionSchema);
