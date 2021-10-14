import mongoose from 'mongoose';

export async function connect() {
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
    const connStr = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

    mongoose.connection.on('error', 
        (error) => console.log('[M] Error ', error) 
        || process.exit(0));
    mongoose.connection.on('connecting', 
        () => console.log('[M] Connecting'));
    mongoose.connection.on('connected', 
        () => console.log('[M] Connected'));
    mongoose.connection.on('disconnecting', 
        () => console.log('[M] Disconnecting'));
    mongoose.connection.on('disconnected', 
        () => console.log('[M] Disconnected'));

    await mongoose.connect(connStr);
}