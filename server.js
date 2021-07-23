import express from 'express'; 
import { APP_PORT, DB_URL } from './config'
import router from './routes';
import { errorHandler } from './middlewares'
import mongoose from 'mongoose';
import path from 'path';
const app = express();

// Database connection
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});

global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/api',router);

app.use('/uploads',express.static('uploads'));

app.use(errorHandler);


app.listen(APP_PORT,() => {
    console.log(`server run at ${APP_PORT} port`);
});
