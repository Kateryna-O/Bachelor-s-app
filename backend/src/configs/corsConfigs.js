export const corsConfigs = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
    // Якщо origin відсутній (наприклад, для серверних запитів) або він є у списку — дозволяємо
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
