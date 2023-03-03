// Inspect network request after signing in and going to your profile
// Get the "csrf" request cookie, Copy Value, paste here as a string
token = "YOUR_TOKEN_HERE";

// Generate a list of all your friends, ignore "Suggestions"
allFriends = await fetch("https://account.xbox.com/en-us/social/api/Friends?", {
  credentials: "include",
  headers: {
    Accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    __RequestVerificationToken: token,
    "onerf-spa": "1",
  },
  referrer: "https://account.xbox.com/en-us/Profile",
  body: '{\n  "ShowGroupHeaders": true,\n  "WebApiUrl": "/en-us/social/api/Friends?"\n}',
  method: "POST",
  mode: "cors",
})
  .then((result) => {
    return result.json().then((data) => {
      const allFriends = [];
      data.XboxFriendGroupEntityCollection.filter(
        (c) => c.GroupTitle !== "Suggestions"
      ).forEach((c) => {
        c.XboxFriendGroupContent.filter((friend) => {
          return "OnlineState" in friend;
        }).forEach((friend) => {
          allFriends.push(friend.DisplayName);
        });
      });
      return allFriends;
    });
  })
  .catch((e) => {
    console.log("failed to fetch friends list");
  });

// Copy the output, make it into a list of friends you want to delete
console.log(allFriends.join(",\n"));

console.log("make a comma separated list of the friends you want to delete");
