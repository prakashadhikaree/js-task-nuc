import { Octokit } from "https://esm.sh/@octokit/core";

const baseUrl = "https://api.github.com";

const options = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getUser = async (userName, cache) => {
  try {
    if (cache.hasOwnProperty(`/users/${userName}`)) {
      return cache[`/users/${userName}`];
    }
    if (!cache.hasOwnProperty(`/users/${userName}`)) {
      cache["time"] = new Date().getTime() + 10000; //setting cache time of 10 seconds
    }

    const response = await fetch(
      `${baseUrl}/users/${userName}?timestamp: ${new Date().getTime()}`,
      options
    );
    const data = await response.json();
    cache[`/users/${userName}`] = data;
    return data;
  } catch (error) {
    return Promise.reject(error?.response?.data);
  }
};

export const getUserRepos = async (userName, cache) => {
  try {
    if (cache.hasOwnProperty(`/users/${userName}/repos`)) {
      return cache[`/users/${userName}/repos`];
    }
    const response = await fetch(`${baseUrl}/users/${userName}/repos`, options);
    const data = await response.json();

    cache[`/users/${userName}/repos`] = data;
    return data;
  } catch (error) {
    return Promise.reject(error?.response?.data);
  }
};

//setting up access token for functional follow button
//Note: token expires after 30days. Expires on Sun, Jan 28 2024.
const octokit = new Octokit({
  auth: `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`,
});

export const getUserContributions = async (userName, cache) => {
  try {
    const headers = {
      Authorization: `bearer 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`,
    };
    const body = {
      query: `query {
        user(login: "${userName}") {
          name
          contributionsCollection {
            contributionCalendar {
              colors
              totalContributions
              weeks {
                contributionDays {
                  color
                  contributionCount
                  date
                  weekday
                }
                firstDay
              }
            }
          }
        }
      }`,
    };
    if (cache.hasOwnProperty(`https://api.github.com/graphql${userName}`)) {
      return cache[`https://api.github.com/graphql${userName}`];
    }
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: headers,
    });
    const data = await response.json();
    cache[`https://api.github.com/graphql${userName}`] =
      data?.data?.user?.contributionsCollection?.contributionCalendar;

    return data?.data?.user?.contributionsCollection?.contributionCalendar;
  } catch (error) {
    return Promise.reject(error?.response?.data);
  }
};

export const checkFollowStatus = async (userName, cache) => {
  try {
    if (cache.hasOwnProperty(`/user/following/${userName}`)) {
      return cache[`/user/following/${userName}`];
    }
    const response = await octokit.request(`GET /user/following/${userName}`, {
      username: `${userName}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    cache[`/user/following/${userName}`] = response;
    return response;
  } catch (error) {
    cache[`/user/following/${userName}`] = error?.response;
    return error?.response;
  }
};

export const followUser = async (userName) => {
  try {
    const response = await octokit.request(`PUT /user/following/${userName}`, {
      username: `${userName}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        accept: "application/vnd.github+json",
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};

export const unFollowUser = async (userName) => {
  try {
    const response = await octokit.request(
      `DELETE /user/following/${userName}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          accept: "application/vnd.github+json",
        },
      }
    );
    return response;
  } catch (error) {
    return error?.response;
  }
};
