import Joi from 'joi';

const signupValidation = (User: any) => {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'uk', 'co'] } }).min(5)
      .max(100)
      .required()
      .empty()
      .messages({
        'any.required': 'Sorry, email field is required',
        'string.empty': 'Please enter your email address',
        'string.email': 'Please enter a valid email',
      }),
    password: Joi.string().empty().min(5)
      .max(1024)
      .required()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/))
      .messages({
        'string.pattern.base': 'Passwords must be at least 5 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
        'any.required': 'Sorry, password field is required',
        'string.empty': 'Sorry, password is required',
        'string.min': 'password should have a minimum length of 5',
      }),
    username: Joi.string().alphanum().min(3)
      .max(255)
      .empty()
      .messages({
        'string.empty': 'Please, enter a username',
        'string.alphanum': 'Sorry, Username must contain only alphanumeric characters',
        'string.min': 'username should have a minimum length of 3 and a maximum length of 255',
      }),
  });
  return schema.validate(User);
};

const loginValidation = (User) => {
  const schema = Joi.object({

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'uk', 'co'] } }).min(5)
      .max(100)
      .required()
      .empty()
      .messages({
        'any.required': 'Sorry, email field is required',
        'string.empty': 'Please enter your email address',
        'string.email': 'Please enter a valid email',
      }),
    password: Joi.string().empty().min(5)
      .max(1024)
      .required()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/))
      .messages({
        'string.pattern.base': 'Passwords must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
        'any.required': 'Sorry, password field is required',
        'string.empty': 'Sorry, password is required',
        'string.min': 'password should have a minimum length of 5',
      }),
  });
  return schema.validate(User);
};

export {
  signupValidation,
  loginValidation,
};
