
# Requirements

- Implement the `searchUser` function to fetch and display information about a GitHub user based on the username entered in the input field `username-input`.
- Display at least the user's `avatar`, `username`, `number of followers`, and `number of public repositories` in a proper card.
- Handle cases where the entered username does not exist or when there is an error fetching the data.
- Provide appropriate error messages or notifications.
- Use the GitHub API (https://api.github.com) for fetching user data.
- Implement loading indicators to show that data is being fetched.

# Notes

- You can modify the HTML and CSS as needed to achieve the desired functionality.
- Make sure to handle asynchronous operations appropriately using promises, async/await, or callbacks.
- Consider using the fetch API or other methods for making HTTP requests.

# Bonus

- Implement a feature to display a list of the user's repositories.
- Implement caching to avoid unnecessary API requests for the same username within a short time span (local storage can be used).

# Prerequisites

## Node.js and npm:
Ensure that you have Node.js and npm (Node Package Manager) installed on your machine. You can download and install them from https://nodejs.org/.

# Procedure

## Clone the Repository:
Clone your project repository from GitHub to your local machine using the following command:

```git clone <repository-url>```

## Navigate to Project Directory:
Change your current working directory to the project folder:

```cd <project-folder>```

## Install Dependencies:
Run the following command to install project dependencies:

```npm install```

## Run the Development Server:
After the installation is complete, start the development server by running:

```npm run dev```

This command will build and serve your project. It will provide you with a local development server address (usually http://127.0.0.1:5173/).

## Open in Browser:
Open your web browser and navigate to the provided local server address (e.g., http://127.0.0.1:5173/).

