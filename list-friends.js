// Inspect network request after signing in and going to your profile
// Get the 'Authorization' header value and 'xuid' from a request
token = "token here";
userID = "uid"
fetchURL = `https://peoplehub.xboxlive.com/users/xuid(${userID})/people/social/decoration/detail,preferredColor,presenceDetail,multiplayerSummary`

// Generate a list of all your friends, ignore "Suggestions"
allFriends = await fetch(fetchURL, {
  credentials: "include",
  headers: {
    Accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    "authorization": token,
    "x-xbl-contract-version": "5",
  },
  referrer: "https://www.xbox.com/",
  method: "GET",
  mode: "cors",
})
  .then((result) => {
    return result.json().then((data) => {
      console.log('friends data', data)
      const friendData = [];
      data.people.forEach((friend) => {
        friendData.push({name: friend.displayName, id: friend.xuid });
      });
      return friendData;
    });
  })
  .catch((e) => {
    console.log("failed to fetch friends list");
  });

friendsIDbyName = allFriends.reduce((acc, f) => {
  acc[f.name] = f.id;
  return acc;
}, {});

// Copy the output, make it into a list of friends you want to delete
console.log(allFriends.map(f => f.name).join(",\n"));

console.log("make a comma separated list of the friends you want to delete");
