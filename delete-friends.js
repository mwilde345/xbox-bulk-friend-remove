token = "YOUR_TOKEN_HERE";

// how many milliseconds to wait between requests to avoid throttling.
sleepTime = 500;

sleep = async () => {
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
};

// Set with your own list
listOfFriendsToDelete = `
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
        const id = data.PrimaryArea.Regions[0].Modules[0].DetailViewModel.Id;
        console.log("SUCCESS id for ", gamerTag, " is ", id);
        return id;
      });
    })
    .catch((e) => {
      console.error("FAIL to get gamertag ID for", gamerTag);
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
      console.log("SUCCESS delete friend " + id);
      return result.ok;
    })
    .catch((e) => {
      console.error("FAIL to delete friend " + id);
    });
};

// Get IDs for a comma separated list of gamertags
getIDs = async (friendsToDelete) => {
  const ids = [];
  for (let i = 0; i < friendsToDelete.length; i++) {
    const tag = friendsToDelete[i];
    let id = await getGamerTagID(tag);
    ids.push(id);
    console.log("...");
    await sleep();
  }
  return ids;
};

// Get IDs for gamertags and use them to step through each one and delete friends
deleteFriends = async () => {
  console.log("Starting deletion, please wait...");
  const deletingArray = listOfFriendsToDelete.replace("\n", "").split(",");
  const ids = await getIDs(deletingArray);
  console.log(
    "Finished fetching IDs for all gamertags in deletion list. If some failed, delete those manually. Deleting the rest now. Please wait..."
  );
  let deletedCount = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const successfulDeletion = await deleteSingleFriend(id);
    deletedCount += successfulDeletion ? 1 : 0;
    console.log("...");
    await sleep();
  }
  console.log(`Done! Deleted ${deletedCount} of ${deletingArray.length}`);
  return true;
};

console.log("You are going to remove these friends: ", listOfFriendsToDelete);
console.log("If that's ok, enter this command: deleteFriends()");
