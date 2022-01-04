module.exports = async function() {
    process.on('uncaughtException', (err) => {
        const errorMsg = err.stack ? err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './') : err;
        logger.error('Uncaught Exception: ', errorMsg);
    });

    process.on('unhandledRejection', err => {
        logger.error('Uncaught Promise Error: ', err);
    });
}