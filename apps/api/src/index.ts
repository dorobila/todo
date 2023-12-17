import app from './server';

const port = process.env.PORT || 5001;

const start = () => {
  try {
    app.listen(port, () => {
      console.log(`api started on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
