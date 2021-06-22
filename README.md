# GitScraper

A "self-hosted", serverless web-scraper for GitHub profiles. A middle-man between your site and GitHub's API.

[under construction]


## Developers!

### Notes

- We wil use TypeScript.
- Modulularize your code, we will integrate later.
- All code to be written within `functions/src`. Treat it as the root directory.
- Ask if not sure.
- DO NOT rename the `functions` directory.


This repository is "self-hosted", by this I mean you will have to set up a Firebase Account and deploy the functions on your account. Here is how you can do so:

### Create a Firebase project

First, you need to make a firebase account and then a new project. We do not need Google Analytics for this.

Then, click on the Functions tab and select "Get started"

### Upgrade your account

To deploy and use functions, you need the [Blaze plan](https://firebase.google.com/pricing), this is a pay-as-you-go plan and the free limit is MASSIVE for this kind of small project. So it's effectively free but you're free to scale how you want.

### Firebase CLI

Install the Firebase CLI

```bash
npm i -g firebase-tools
```

Then, you must log in to the CLI

```bash
firebase login
```

### Test locally

Fork and clone the repo, `cd` into it and run `npm i`.

[Follow this guide](https://firebase.google.com/docs/functions/local-emulator)

### Deploy the project

Make a new file called `.firebaserc` and paste this into it:

```
{
  "projects": {
    "default": "<<project-ID>>"
  }
}

```

The project ID will be in your project settings. Then simply run

```bash
firebase deploy
```


## Why?

### The problem
The official GitHub API rate limits you to about 60 requests an hour for `core` and 20 for `search`. Furthermore, some data simply requires some API gymnastics to retrieve. 

Generally, when you attempt real-time GitHub stats using the Official API, you need to make more than 1 request to get all the information you would need to make an appealing UI. For example, to display the latest repository, you need to first query the search API then get a URL from the response, then query and get the languages used.

You'd also typically want to query information about more than 1 repo, so you can see how quickly the rate limit will be reached especially if you refresh a couple of times or during the development of your site. Once it is reached a 401 will crash your app or it will make your UI look ugly unless you provide fallback data.

**Yeah, you can increase your limit by providing a key but you can’t really hide your key on static sites.**

Yes, the GraphQL API does exist and is better but do you really want to set up GraphQL for static sites? I don't. Besides, it's a cool little side project to spend a week on.

### The Solution
This will use Firebase Cloud Functions to run a function every couple of hours (or whatever interval) and scrape the contents of a GitHub profile via ether good ol' Web Scraping or the GitHub API itself. After that, it will store all the data as one or two documents in Firebase Realtime Database.

The user can then run another Cloud Function to fetch the data from the database. Something like this:

![Group 1 (3)](https://user-images.githubusercontent.com/55190601/122678050-aaaa7f00-d202-11eb-8063-a08a946c890a.png)
