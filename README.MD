<h2 align="center">
   Discussion Forum<br/>
  <a href="https://frontend-beta-jade-56.vercel.app/login" target="_blank">Link</a>
</h2>

<br/>

<center>

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) &nbsp;

</center>

## 📹 Video at the end! ⬇️

### Note: `Trying to deploy in vercel. Not environment issues but other vercel issues, Please do check the video`

### Note: `Trying to deploy in vercel facing vercel issues, Please do check the video`

## Built with

This project was built using these technologies.

- React.js
- Node.js
- Express.js
- Mongoose/Mongodb
- JWT
- Bootstrap
- CSS3
- VsCode
- Vercel

## Features

1. Users will be able to initiate new discussion threads on various topics.
2. Visitors to a thread will be able to comment on posts within it.
3. Each thread will have a `title`, `description`, and `Category`.

## Getting Started

Clone down this repository. You will need `node.js` and `git` installed globally on your machine.

## 🛠 Installation and Setup Instructions

1. Installation: `npm install`

2. In the project directory, you can run: `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.

## Usage Instructions

- Open the project folder and navigate to `/src/components/` for the Frontend. <br/>
- Navigate to `/src/routes/` for the Backend. <br/>
  You will find all the components used, and you can edit your information accordingly.

## Backend Design Choices

### Entities Used

- User
- Post
- Comment
- Reply
- Thread

All the design decisions for users and threads are straightforward. Particularly for post comments and replies (1-level comments), we use an `array of replies`, which is of type `Comment`, to store the replies of a comment.

## APIs

### Authentication

- **Login**: When a user logs in, we generate a JWT token and return it in the cookies to the user.
- **Logout**: The JWT token is invalidated or cleared from the cookies.
- **Protected Routes**: For every subsequent request, the client sends the token with it to authenticate itself for all the protected routes. `Middleware`

### Threads

- **Create Thread**: API to create a new discussion thread.
- **Get Threads**: API to fetch all threads.
- **Get Thread by ID**: API to fetch a specific thread by its ID.

### Posts

- **Create Post**: API to create a new post in a thread.
- **Get Posts**: API to fetch all posts in a thread.

### Comments

- **Create Comment**: API to add a comment to a post.
- **Get Comments**: API to fetch all comments for a post.
- **Reply to Comment**: API to reply to a specific comment.

## Further Development that can be made

- Enhance the UI for better user experience.
- Media in posts

## 📹 Video Demo

[Watch the video demonstration of the project](https://drive.google.com/file/d/1kEv4d2Yqn8OCabNSq32a3o6kk7tOueEl/view?usp=drive_link)
