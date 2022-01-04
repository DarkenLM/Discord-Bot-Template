module.exports = async (ratelimit) => {
    let timeObj = bot.modules.parsers.parseMS(ratelimit?.timeout)
    logger.error(
    `[RATELIMIT] Ratelimit hit!
    - Duration: ${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s
    - HTTP Method: ${ratelimit.method}
    - Endpoint: ${ratelimit.path}
    - Global: ${ratelimit.global}`
    )
};