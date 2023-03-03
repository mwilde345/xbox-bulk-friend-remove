token = "YOUR_TOKEN_HERE";

// Set with your own list
const listOfFriendsToDelete = `
friend1,
friend2,
friend3
`;

// Get the UUID for a gamertag
getGamerTagID = async (gamerTag) => {
  const url = `https://account.xbox.com/en-us/profile?gamertag=${gamerTag}`;
  return await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json, text/plain, */*",
      "onerf-spa": "1",
      __RequestVerificationToken: token,
    },
    referrer: "https://account.xbox.com/en-us/profile",
    method: "GET",
    mode: "cors",
  })
    .then((result) => {
      return result.json().then((data) => {
        return data.PrimaryArea.Regions[0].Modules[0].DetailViewModel.Id;
      });
    })
    .catch((e) => {
      console.log("failed to get gamertag ID", e);
    });
};

// Remove single friend
deleteSingleFriend = async (id) => {
  const url =
    "https://account.xbox.com/en-us/xbox/account/api/v1/social/RemoveFriends";
  return await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json, text/plain, */*",
      "content-type": "application/json",
      __RequestVerificationToken: token,
    },
    referrer: "https://account.xbox.com/en-us/profile",
    body: `{\n  \"xuids\": [\n    \"${id}\"\n  ]\n}`,
    method: "POST",
    mode: "cors",
  })
    .then((result) => {
      return result.ok;
    })
    .catch((e) => {
      console.log("failed to delete friend" + id, e);
    });
};

// Get IDs for a comma separated list of gamertags
getIDs = async (friendsToDelete) => {
  const ids = await Promise.all(
    friendsToDelete.map((tag) => {
      return new Promise((res) => {
        return res(getGamerTagID(tag));
      });
    })
  ).then((result) => {
    return result;
  });
  return ids;
};

// Get IDs for gamertags and use them to step through each one and delete friends
deleteFriends = async () => {
  const deletingArray = listOfFriendsToDelete.replace("\n", "").split(",");
  const ids = await getIDs(deletingArray);
  return await Promise.all(
    ids.map((id) => {
      return new Promise((res) => {
        return res(deleteSingleFriend(id));
      });
    })
  ).then((result) => {
    const successfullyDeletedCount = result.filter((r) => !!r).length;
    console.log(
      `Done! Deleted ${successfullyDeletedCount} of ${deletingArray.length}`
    );
    return true;
  });
};

console.log("You are going to remove these friends: ", listOfFriendsToDelete);
console.log("If that's ok, enter this command: deleteFriends()");
