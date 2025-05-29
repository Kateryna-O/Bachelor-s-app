import {
  createSession,
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { ONE_DAY, SMTP } from '../constants/index.js';
import { UsersCollection } from '../db/models/users.js';
import { sendEmail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import crypto from 'crypto';
import { logActivity } from '../utils/logActivity.js';
import { LogsCollection } from '../db/models/logs.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

// export const loginUserController = async (req, res) => {
//   const session = await loginUser(req.body);
//   const user = await UsersCollection.findById(session.userId).select(
//     '-password'
//   );
//   user.isTwoFactorVerified = false;
//   await logActivity({
//     req,
//     userId: user._id,
//     action: 'LOGIN_ATTEMPT',
//     metadata: { email: user.email },
//   });

//   if (!user.isTwoFactorVerified) {
//     // Генерація коду
//     const code = crypto.randomInt(100000, 999999).toString();

//     // Записуємо код у БД
//     user.twoFactorCode = code;
//     user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 хв
//     await user.save();

//     // Надсилаємо email
//     await sendEmail({
//       to: user.email,
//       subject: '2FA Verification Code',
//       text: `Your verification code is: ${code}`,
//       html: `<p>Your verification code is: <strong>${code}</strong></p>`,
//       from: `"Security Team" <${getEnvVar(SMTP.SMTP_USER)}>`,
//     });

//     // Відповідь без токенів — чекаємо підтвердження коду
//     return res.status(200).json({
//       status: 200,
//       message: 'Verification code sent to your email',
//       data: {
//         requires2FA: true,
//         email: user.email,
//       },
//     });
//   }

//   await logActivity({
//     req,
//     userId: user._id,
//     action: 'LOGIN_SUCCESS',
//   });

//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY),
//   });

//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY),
//   });

//   res.json({
//     status: 200,
//     message: 'Successfully logged in an user',
//     data: {
//       accessToken: session.accessToken,
//       user,
//     },
//   });
// };

export const loginUserController = async (req, res) => {
  try {
    const session = await loginUser(req.body);

    const user = await UsersCollection.findById(session.userId).select(
      '-password'
    );
    user.isTwoFactorVerified = false;

    await logActivity({
      req,
      userId: user._id,
      action: 'LOGIN_ATTEMPT',
      metadata: { email: user.email },
    });

    if (!user.isTwoFactorVerified) {
      const code = crypto.randomInt(100000, 999999).toString();

      user.twoFactorCode = code;
      user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 хв
      await user.save();

      await sendEmail({
        to: user.email,
        subject: '2FA Verification Code',
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
        from: `"Security Team" <${getEnvVar(SMTP.SMTP_USER)}>`,
      });

      await logActivity({
        req,
        userId: user._id,
        action: '2FA_CODE_SENT',
        metadata: { email: user.email },
      });

      return res.status(200).json({
        status: 200,
        message: 'Verification code sent to your email',
        data: {
          requires2FA: true,
          email: user.email,
        },
      });
    }

    await logActivity({
      req,
      userId: user._id,
      action: 'LOGIN_SUCCESS',
      metadata: { email: user.email },
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
      status: 200,
      message: 'Successfully logged in a user',
      data: {
        accessToken: session.accessToken,
        user,
      },
    });
  } catch (error) {
    await logActivity({
      req,
      userId: null,
      action: 'LOGIN_FAILED',
      metadata: {
        email: req.body?.email || 'unknown',
        reason: error.message,
      },
    });

    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    const session = await logoutUser(req.cookies.sessionId);
    await logActivity({
      req,
      userId: session?.userId || null,
      action: 'LOGOUT',
    });
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUsersSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  const user = await UsersCollection.findById(session.userId).select(
    '-password'
  );
  res.json({
    status: 200,
    message: 'Successfully refreshed a session',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email was successfully',
    data: {},
  });
};

// export const resetPasswordController = async (req, res) => {
//   await resetPassword(req.body);
//   res.json({
//     message: 'Password was successfully reset!',
//     status: 200,
//     data: {},
//   });
// };

export const resetPasswordController = async (req, res) => {
  try {
    await resetPassword(req.body);
    await logActivity({
      req,
      userId: null,
      action: 'RESET_PASSWORD_SUCCESS',
      metadata: { email: req.body.email },
    });

    res.json({
      message: 'Password was successfully reset!',
      status: 200,
      data: {},
    });
  } catch (error) {
    await logActivity({
      req,
      userId: null,
      action: 'RESET_PASSWORD_FAILED',
      metadata: {
        email: req.body.email,
        reason: error.message,
      },
    });

    return res.status(400).json({ message: 'Reset failed' });
  }
};

export const verify2FAController = async (req, res) => {
  const { email, code } = req.body;

  const user = await UsersCollection.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (
    !user.twoFactorCode ||
    !user.twoFactorExpires ||
    user.twoFactorCode !== code ||
    user.twoFactorExpires < new Date()
  ) {
    await logActivity({
      req,
      userId: user._id,
      action: '2FA_FAILED',
      metadata: {
        reason: 'Invalid or expired verification code',
        email,
      },
    });

    return res
      .status(400)
      .json({ message: 'Invalid or expired verification code' });
  }

  // Очищаємо код і позначаємо 2FA як пройдене
  user.twoFactorCode = undefined;
  user.twoFactorExpires = undefined;
  user.isTwoFactorVerified = true;
  await user.save();
  await logActivity({
    req,
    userId: user._id,
    action: '2FA_VERIFIED',
  });

  // Створюємо сесію як після логіну
  const session = await createSession(user._id);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: '2FA verification successful. Logged in.',
    data: {
      accessToken: session.accessToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    },
  });
  console.log('🔍 Верифікація 2FA запит:', req.body);
};

export const getUserLogsController = async (req, res) => {
  const logs = await LogsCollection.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });

  res.json({
    status: 200,
    message: 'User logs retrieved',
    data: logs,
  });
};
