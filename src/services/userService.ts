import User from '../model/user';

export default class UserServices {
  static async getUsers() {
    try {
      return await User.find();
    } catch (error) {
      return error;
    }
  }

  static async createUser(userDetails: {}) {
    try {
      return await User.create(userDetails);
    } catch (error) {
      return error;
    }
  }

  static async checkUsername(username: string) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      return error;
    }
  }

  static async findUser(email: string) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      return error;
    }
  }

  static async verifyUser(email: string) {
    try {
      return await User.findOneAndUpdate(
        { email },
        { $set: { verified: true } },
        { new: true }
      );
    } catch (error) {
      return error;
    }
  }

  static async findById(_id: string) {
    try {
      return await User.findOne({ _id });
    } catch (error) {
      return error;
    }
  }

  static async updateUser(_id: string, updateDetails: {}) {
    try {
      return await User.findByIdAndUpdate(_id, updateDetails, { new: true });
    } catch (error) {
      return error;
    }
  }

  static async deleteUser(_id: string) {
    try {
      return await User.findByIdAndDelete({ _id });
    } catch (error) {
      return error;
    }
  }

  static async newQuestion(_id: string, questionId: string) {
    try {
      return await User.updateOne(
        { _id },
        {
          $addToSet: {
            questions: [questionId],
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

  static async searchUsers(searchText: any) {
    try {
      return await User.find(searchText).populate({
        path: 'questions',
        select: {
          title: 1,
          question: 1,
          feedback: 1
        }
      });
    } catch (error) {
      return error;
    }
  }
}
