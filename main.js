/* Import CSS File */
import "./style.css";
import {
  getUser,
  checkFollowStatus,
  getUserRepos,
  followUser,
  unFollowUser,
  getUserContributions,
} from "./api";

/**
 * Your JavaScript code will be added here.
 *
 * */

//cache
let cache = {};

// Selectors
const searchInput = document.querySelector("#username-input");
const searchButton = document.querySelector(".search-button");
const formElement = document.querySelector(".search-section");
const imageElement = document.querySelector(".profile-image");
const userNameEl = document.querySelector("#user-name");
const followersCountEl = document.querySelector("#followers");
const followingCountEl = document.querySelector("#following");
const repoCountEl = document.querySelector("#repo");
const userInfoContainerEl = document.querySelector("#user-info");
const errorEl = document.querySelector(".error");
const errorText = document.querySelector(".errorText");
const loadingEl = document.querySelector(".spinner");
const loadingBtnSpinnerEl = document.querySelector(".btnSpinner");
const followBtnEl = document.querySelector(".followBtn");
const initailMessageEl = document.querySelector(".initial-message");
const toogleStatusBtnEl = document.querySelector("#toogle-follow-status");
const reposListContainerEl = document.querySelector(".repos-list");
const contributionContainerEl = document.querySelector(
  ".main-contribution-Continer"
);
const contributeContainerEl = document.querySelector(".contribution-container");
const totalContributionEl = document.querySelector("#total-contribution");

// Events
formElement.addEventListener("submit", handleSearch);
toogleStatusBtnEl.addEventListener("click", toogleFollowStatus);

function handleSearch(event) {
  event.preventDefault();

  //terminating function if searchInput is empty
  if (!searchInput.value) {
    return;
  }

  contributionContainerEl.style.display = "none";

  fetchAndUpdateFollowStatus();

  searchButton.disabled = true;
  loadingEl.style.display = "block";
  errorEl.style.display = "none";
  initailMessageEl.style.display = "none";
  userInfoContainerEl.style.display = "none";

  fetchAndDisplayUserInfo();

  fetchAndDisplayUserRepos();
  fetchAndDisplayUserContribution();
  checkCache();
}

function toogleFollowStatus() {
  if (toogleStatusBtnEl.innerText === "Unfollow") {
    unFollowUser(`${searchInput.value}`).then((data) => {
      if (data.status === 204) {
        delete cache[`/users/${searchInput.value}`];
        followBtnEl.style.paddingLeft = "45px";
        loadingBtnSpinnerEl.style.display = "block";

        //github server taking time to update data so delaying refetch request
        setTimeout(() => {
          fetchAndDisplayUserInfo();
          loadingBtnSpinnerEl.style.display = "none";
          toogleStatusBtnEl.innerText = "Follow";
          followBtnEl.style.paddingLeft = "20px";
        }, [2000]);
      }
    });
  } else if (toogleStatusBtnEl.innerText === "Follow") {
    followUser(`${searchInput.value}`).then((data) => {
      if (data.status === 204) {
        delete cache[`/users/${searchInput.value}`];
        followBtnEl.style.paddingLeft = "45px";
        loadingBtnSpinnerEl.style.display = "block";
        setTimeout(() => {
          fetchAndDisplayUserInfo();
          loadingBtnSpinnerEl.style.display = "none";
          toogleStatusBtnEl.innerText = "Unfollow";
          followBtnEl.style.paddingLeft = "20px";
        }, [2000]);
      }
    });
  }
}

const checkCache = () => {
  const now = new Date().getTime();

  //resetting cache after 10 seconds
  if (cache?.time && cache.time < now) {
    cache = {};
  }
};

const fetchAndUpdateFollowStatus = () => {
  checkFollowStatus(`${searchInput.value}`, cache).then((data) => {
    // if user is not followed
    if (data.status === 404) {
      toogleStatusBtnEl.innerText = "Follow";
    }

    // if user is  followed
    if (data.status === 204) {
      toogleStatusBtnEl.innerText = "Unfollow";
    }
  });
};

const fetchAndDisplayUserInfo = () => {
  getUser(`${searchInput.value}`, cache)
    .then((data) => {
      if (data && !data.message) {
        const { avatar_url, name, followers, following, public_repos } = data;

        userInfoContainerEl.style.display = "block";
        errorEl.style.display = "none";

        imageElement.src = avatar_url;
        userNameEl.innerText = name;
        followersCountEl.innerText = followers;
        followingCountEl.innerText = following;
        repoCountEl.innerHTML = public_repos;
      } else {
        throw new Error(
          data && data?.message
            ? data.message
            : "Something went wrong. Please try again.."
        );
      }
    })
    .catch((error) => {
      userInfoContainerEl.style.display = "none";
      contributionContainerEl.style.display = "none";
      errorEl.style.display = "block";
      errorText.innerText = error?.message;
    })
    .finally(() => {
      loadingEl.style.display = "none";
      searchButton.disabled = false;
    });
};

const fetchAndDisplayUserRepos = () => {
  getUserRepos(`${searchInput.value}`, cache).then((data) => {
    let listArray = [];
    for (let obj in data) {
      const list = document.createElement("li");
      list.innerText = data[obj]?.name;
      list.className = "repo-name";
      listArray.push(list);
    }

    //removes all current children and adds new children in parent to avoid duplication
    reposListContainerEl.replaceChildren(...listArray);
  });
};

const fetchAndDisplayUserContribution = () => {
  getUserContributions(`${searchInput.value}`, cache).then((data) => {
    let canvasBlockArray = [];

    totalContributionEl.innerText = `${data?.totalContributions} contributions in the last year`;
    for (let weeksObj in data?.weeks) {
      const week = data?.weeks[weeksObj]?.contributionDays;

      for (let daysObj in week) {
        const day = week[daysObj];

        const canvas = document.createElement("canvas");
        canvas.className = "canvas";
        canvas.style.backgroundColor =
          day.color == "#ebedf0" ? "#393433" : day.color;
        canvasBlockArray.push(canvas);
      }
    }
    if (data) {
      contributionContainerEl.style.display = "block";
    }
    contributeContainerEl.replaceChildren(...canvasBlockArray);
  });
};
