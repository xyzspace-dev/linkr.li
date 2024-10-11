"use server";
import { connect } from "mongoose";
import { cookies } from "next/headers";
import sessionDB from "./database/sessionDB";
import { error } from "console";
const { v4: uuidv4 } = require("uuid");
const uuids = uuidv4();
const { MONGODBURL, AUTHURL } = require("@/config.json");

async function connectDB() {
  connect(MONGODBURL, {
    dbName: "linkapp",
  })
    .then(console.log("The App is Connected to the Database"))

    .catch((error) => {
      console.log(`${error}`);
    });
}

async function getUserData(sessionID) {
  await connectDB();

  const sessionDB = require("./database/sessionDB");

  const sessionData = await sessionDB.findOne({
    UUID: sessionID,
  });

  const userID = sessionData.UserID;

  const userDB = require("./database/usersDB");

  const userData = await userDB.findOne({
    UserID: userID,
  });

  return {
    UserID: userData?.UserID,
    UUID: userData?.UUID,
    Email: userData?.Email,
    RefreshToken: userData?.RefreshToken,
    AccessToken: userData?.AccessToken,
    Links: userData?.Links,
  };
}
async function getUser(userID) {
  await connectDB();

  const userDB = require("./database/usersDB");

  const userData = await userDB.findOne({
    UserID: userID,
  });

  return userData;
}

async function createUser(userID, email, rtoken, atoken) {
  await connectDB();
  const userDB = require("./database/usersDB");

  await userDB.create({
    UserID: userID,
    UUID: uuids,
    Email: email,
    RefreshToken: rtoken,
    AccessToken: atoken,
    Links: [],
  });
}

async function updateUser(userID, atoken, rtoken, email) {
  const userDB = require("./database/usersDB");

  await connectDB();
  await userDB.findOneAndUpdate(
    {
      UserID: userID,
    },
    {
      AccessToken: atoken,
      RefreshToken: rtoken,
      Email: email,
    }
  );
}

async function getLink(link) {
  const linkDB = require("./database/linksDB");

  const linkData = await linkDB.findOne({
    Slug: link,
  });

  return linkData;
}

async function createLink(userID, slug, redirect, uuid) {
  const linkDB = require("./database/linksDB");
  const userDB = require("./database/usersDB");

  await linkDB.create({
    UserID: userID,
    UUID: uuid,
    Slug: slug,
    Redirect: redirect,
  });

  await userDB.findOneAndUpdate(
    {
      UserID: userID,
    },
    {
      $push: {
        Links: uuid,
      },
    }
  );
}

async function deleteLink(userID, slug) {
  const linkDB = require("./database/linksDB");
  const userDB = require("./database/usersDB");

  const linkData = await linkDB.findOne({
    Slug: slug,
  });

  await linkDB.findOneAndDelete({
    Slug: slug,
  });

  await userDB.findOneAndUpdate(
    {
      UserID: userID,
    },
    {
      $pull: {
        Links: linkData.UUID,
      },
    }
  );
}

async function getLinks(userID) {
  const userDB = require("./database/usersDB");
  const linkDB = require("./database/linksDB");

  const userData = await userDB.findOne({
    UserID: userID,
  });

  const links = userData.Links;

  const linksData = await linkDB.find({
    UUID: {
      $in: links,
    },
  });

  return linksData;
}

async function createSession(userID, uuid) {
  await connectDB();

  const session = await sessionDB.create({
    UserID: userID,
    UUID: uuid,
  });

  return session;
}

async function getSession(sessionID) {
  await connectDB();
  const sessionDB = require("./database/sessionDB");

  const sessionData = await sessionDB.findOne({
    UUID: sessionID,
  });

  return {
    UserID: sessionData.UserID,
    UUID: sessionData.UUID,
  };
}

async function getCookie() {
  const cookie = cookies();
  return cookie.get("session");
}

async function createCookie(uuid) {
  const cookie = cookies();
  cookie.set("session", uuid, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
  });
}

async function requireLogin(redirect) {
  const sessionID = getCookie("session").value;
  await connectDB();
  const sessionDB = require("./database/sessionDB");

  await sessionDB.deleteMany({
    UUID: sessionID,
  });

  return redirect;
}

export {
  getUser,
  createUser,
  requireLogin,
  getLink,
  createLink,
  deleteLink,
  getLinks,
  getUserData,
  createSession,
  getSession,
  getCookie,
  createCookie,
  updateUser,
};
