# Emoji Sentiment Analyzer

## Overview

The Emoji Sentiment Analyzer is a project designed to analyze the sentiment of text combined with emojis. It fetches data from multiple sources, processes the text and emojis, and determines the overall sentiment (Positive, Negative, or Neutral). The project uses sentiment analysis with custom adjustments for specific emojis to provide accurate sentiment scores.

## Features

- Data Collection: Fetches data from multiple sources to diversify the input.
- Sentiment Analysis: Uses the Sentiment library to analyze text combined with emojis.
- Custom Emoji Adjustments: Adjusts sentiment scores based on specific emojis.
- Overall Sentiment Calculation: Calculates and stores the overall sentiment based on the average sentiment score of the data.

## Installation

1. Clone the Repository

```bash
git clone https://github.com/your-username/emoji-sentiment-analyzer.git
cd emoji-sentiment-analyzer
```

2. Install Dependencies
   Make sure you have Node.js and npm installed. Then, install the required dependencies:

```bash
npm install
```

## Usage

1. Running the Task
   The `task` function fetches data, performs sentiment analysis, and stores the result. You can run it manually for a specific round:

```javascript
const { submission } = require('./path-to-submission-file');
submission.task(roundNumber).then(result => {
  console.log('Sentiment result:', result);
});
```

2. Submitting the Task
   The `submitTask` function submits the result for a given round. You can run it manually:

```javascript
const { submission } = require('./path-to-submission-file');
submission.submitTask(roundNumber).then(result => {
  console.log('Submission result:', result);
});
```

## Project Structure

- submission.js: The main file containing the Submission class with all the functions for fetching data, analyzing sentiment, and submitting the result.
- package.json: The project configuration file with dependencies and scripts.

## Detailed Functionality

### task(round)

- Fetches data from multiple sources.
- Combines text and emojis for sentiment analysis.
- Adjusts sentiment scores based on specific emojis.
- Calculates the overall sentiment based on the average sentiment score.
- Stores the result using namespaceWrapper.

### fetchDataFromSources(sources)

- Fetches data from an array of source URLs.
- Aggregates the data into a single array.

### calculateOverallSentiment(data)

- Processes the fetched data to calculate the overall sentiment.
- Uses analyzeSentiment to analyze each item in the data.

### analyzeSentiment(textWithEmoji)

- Performs sentiment analysis on the combined text and emojis.
- Adjusts sentiment scores based on specific emojis.
  getEmojiAdjustments()
- Provides custom sentiment score adjustments for specific emojis.

### determineSentiment(averageScore)

Determines the overall sentiment based on the average sentiment score.

### submitTask(round)

- Fetches the stored sentiment result.
- Submits the result and updates the round.

### fetchSubmission(round)

- Fetches the stored sentiment result from namespaceWrapper.

## Logging

The project uses winston for logging important events and errors. Logs are output to both the console and a file (submission.log).

## Contribution

Contributions are welcome! Please feel free to submit a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
