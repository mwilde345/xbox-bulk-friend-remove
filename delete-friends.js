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

// Remove single friend
deleteSingleFriend = async (id) => {
  const url = `https://social.xboxlive.com/users/xuid(${userID})/people/xuid(${id})`;
  return await fetch(url, {
    credentials: "include",
    headers: {
      host: "social.xboxlive.com",
      Accept: "application/json",
      "content-type": "application/json",
      authorization: token,
      "x-xbl-contract-version": "3",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
    },
    origin: "https://www.xbox.com",
    referrer: "https://www.xbox.com/",
    method: "DELETE",
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
  console.log(friendsToDelete);
  console.log(friendsIDbyName);
  return friendsToDelete.map((tag) => friendsIDbyName[tag]);
};

// Get IDs for gamertags and use them to step through each one and delete friends
deleteFriends = async () => {
  console.log("Starting deletion, please wait...");
  const deletingArray = listOfFriendsToDelete.replaceAll("\n", "").split(",");
  const ids = await getIDs(deletingArray);
  console.log(
    "Finished fetching IDs for all gamertags in deletion list. If some failed, delete those manually. Deleting the rest now. Please wait..."
  );
  console.log(ids);
  let deletedCount = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    console.log("deleting friend", id);
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
