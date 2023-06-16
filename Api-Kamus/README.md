
# Simple English Dictionary API

The Simple English Dictionary API is a user-friendly tool that offers straightforward definitions for words. It is also customizable, allowing for self-hosting to meet specific requirements. With over more than 121k words, the API contains vast amount of data.

## Features

- Provides simple English definitions for words
- Can be hosted on a platform as an API or self-hosted
- Supports GET requests with parameters for word lookup
- Returns responses in JSON format

## Usage Disclaimer

Please note that this project is intended for educational purposes only. The Simple English Dictionary API should not be used for commercial purposes without prior permission from the author.

## Usage 

The data can be accessed in various formats(is self hosting), including:

- Two big chunks of json data separated into two files in "meaningsJson/" directory
- A single JSON file called "processed/meanings.json" that contains all the words present in those two json files
- You can also opt to replace this files with files from [simple-english-dictionary](https://github.com/nightblade9/simple-english-dictionary) repository.

However, if you want to change the json schema, you may also need to update how the API works with input as well.

## Getting Started

### Prerequisites

To use the Simple English Dictionary API, you'll need:

- An internet connection (if using the hosted version)
- Node.js installed (if self-hosting)

### Installation

#### Hosted Version

No installation is required for the hosted version. Simply make GET requests to the API endpoint with the appropriate parameters.

API Endpoint: https://meanings.onrender.com/api/:word

#### Self-Hosted Version

1. Clone the repository:

```bash
git clone https://github.com/EddieCrispo/Sign-Language-Translator-Singo-.git
```

2. cd:

```bash
cd Sign-Language-Translator-Singo-
```

3. Install dependencies:

```bash
npm install
```

3. Run the express server:

```bash
npm start
```

4. Make GET requests to `http://localhost:3000/api/:word1/:word2` with the appropriate parameters.

5. login as admin at `http://localhost:3000/login` with "admin" as username and password (use this to add, edit and delete dictionary data from API and more...).

6. Change admin password and username from admin dashboard.

### Usage

Make GET requests to the API endpoint with the following parameters:

- `word` (required): The word to look up

Example request:

https://meanings.onrender.com/api/b

Example response:

```json
[
  {
    "WORD": "B",
    "MEANINGS": [
      {
        "partsOfSpeech": "Noun",
        "definition": "the 2nd letter of the Roman alphabet",
        "relatedWords": [
          "Letter",
          "Letter of the alphabet",
          "Alphabetic character"
        ],
        "exampleSentence": []
      },
      {
        "partsOfSpeech": "Noun",
        "definition": "the blood group whose red cells carry the B antigen",
        "relatedWords": ["Blood group", "Blood type"],
        "exampleSentence": []
      }
    ],
    "ANTONYMS": [],
    "SYNONYMS": [
      "Bel",
      "Vitamin b complex",
      "B complex",
      "Atomic number 5",
      "Barn"
    ]
  }
]
```

You can also add another parameter for second word like:

`https://meanings.onrender.com/api/a/b`

This will fetch data for word 'a' and also for 'b'

You can also visit the official website for [documentation](https://meanings.onrender.com)
