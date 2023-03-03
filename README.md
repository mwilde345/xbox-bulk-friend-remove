# xbox-bulk-friend-remove

Browser hackyness to bulk remove friends because As of now Xbox web interface doesn't let you....... idk why

# THIS CAN STOP WORKING AT ANYTIME IF XBOX WEBSITE CHANGES UP THEIR API STRUCTURE. works as of Mar 3 2023

# Demo

https://youtu.be/IZvXQLVrd_s

### Step 1

- Open the Developer Console in a new Firefox window
- Sign in to your xbox account in Firefox at xbox.com

### Step 2

- Go to your xbox profile page

### Step 3

- Click on a successful network request in the network tab that was made to acccount.xbox.com

### Step 4

- Click on Cookies for that request

### Step 5

- Under request cookies, Right click `csrf` and `Copy Value`

### Step 6

- Open the `list-friends.js` file and paste in your token, make sure you surround it with quotes

### Step 7

- Copy the contents of `list-friends.js` and run it in the dev console

### Step 8

- Using the list of friend names, make a new list of the ones you want to delete, paste it into `delete-friends.js`
- also put the token in `delete-friends.js` like before

### Step 9

- Copy the contents of `delete-friends.js` and run it in the dev console

### Step 10

- If the list looks good, run `deleteFriends()` in the dev console

Profit
