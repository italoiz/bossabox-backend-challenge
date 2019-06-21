module.exports = {
  /**
   * Session expiration time
   *
   * Default are 20 minutes.
   *
   * @return {Number}
   */
  expiresIn: parseInt(process.env.SESSION_EXPIRES) || 60 * 60
}
