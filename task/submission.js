const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const axios = require('axios');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const winston = require('winston');

// Configure winston for logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'submission.log' })
  ]
});

class Submission {
  /**
   * Executes your task, optionally storing the result.
   *
   * @param {number} round - The current round number
   * @returns {Promise<string>} The sentiment analysis result
   */
  async task(round) {
    logger.info(`Starting task for round ${round}`);
    try {
      const data = await this.fetchDataFromSources([
        'https://api.api-ninjas.com/v1/emoji',
      ]);

      const overallSentiment = this.calculateOverallSentiment(data);

      // Store the result in NeDB
      await namespaceWrapper.storeSet('overallSentiment', overallSentiment);
      logger.info(`Stored sentiment result: ${overallSentiment}`);
      return overallSentiment;
    } catch (err) {
      logger.error(`Error in executing task: ${err.message}`);
      return `ERROR IN EXECUTING TASK: ${err.message}`;
    }
  }

  /**
   * Fetches data from multiple sources.
   *
   * @param {Array<string>} sources - The array of source URLs
   * @returns {Promise<Array<Object>>} The array of data objects
   */
  async fetchDataFromSources(sources) {
    const data = [];
    for (const source of sources) {
      try {
        const response = await axios.get(source);
        data.push(...response.data);
      } catch (error) {
        logger.error(`Error fetching data from ${source}: ${error.message}`);
      }
    }
    return data;
  }

  /**
   * Calculates the overall sentiment from the data.
   *
   * @param {Array<Object>} data - The array of data objects
   * @returns {string} The overall sentiment
   */
  calculateOverallSentiment(data) {
    let totalScore = 0;
    let count = 0;
    let overallSentiment = 'Neutral';

    data.forEach(item => {
      const analysis = this.analyzeSentiment(item.text + ' ' + item.emoji);
      totalScore += analysis.score;
      count++;
    });

    if (count > 0) {
      const averageScore = totalScore / count;
      overallSentiment = this.determineSentiment(averageScore);
    }

    return overallSentiment;
  }

  /**
   * Custom sentiment analysis function.
   *
   * @param {string} textWithEmoji - The text combined with emojis
   * @returns {object} The sentiment analysis result
   */
  analyzeSentiment(textWithEmoji) {
    const analysis = sentiment.analyze(textWithEmoji);
    const emojiAdjustments = this.getEmojiAdjustments();

    analysis.tokens.forEach(token => {
      if (emojiAdjustments[token]) {
        analysis.score += emojiAdjustments[token];
      }
    });

    return analysis;
  }

  /**
   * Provides custom emoji adjustments for sentiment analysis.
   *
   * @returns {object} The emoji adjustments
   */
  getEmojiAdjustments() {
    return {
      '😀': 2,
      '😭': -2,
    };
  }

  /**
   * Determines the sentiment based on the average score.
   *
   * @param {number} averageScore - The average sentiment score
   * @returns {string} The overall sentiment
   */
  determineSentiment(averageScore) {
    if (averageScore > 0) {
      return 'Positive';
    } else if (averageScore < 0) {
      return 'Negative';
    } else {
      return 'Neutral';
    }
  }

  /**
   * Submits a task for a given round
   *
   * @param {number} round - The current round number
   * @returns {Promise<any>} The submission value that you will use in audit
   */
  async submitTask(round) {
    logger.info(`Submit task called for round number ${round}`);
    try {
      const submission = await this.fetchSubmission(round);
      logger.info(`Fetched submission: ${submission}`);
      await namespaceWrapper.checkSubmissionAndUpdateRound(submission, round);
      logger.info('Submission checked and round updated');
      return submission;
    } catch (error) {
      logger.error(`Error in submission: ${error.message}`);
    }
  }

  /**
   * Fetches the submission value
   *
   * @param {number} round - The current round number
   * @returns {Promise<string>} The submission value that you will use in audit
   */
  async fetchSubmission(round) {
    logger.info('Fetching submission');
    const overallSentiment = await namespaceWrapper.storeGet('overallSentiment'); // Retrieves the value
    return overallSentiment;
  }
}

const submission = new Submission();
module.exports = { submission };
