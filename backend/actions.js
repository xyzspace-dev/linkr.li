"use server";
import { connect } from "mongoose";
import { cookies } from "next/headers";
import sessionDB from "./database/sessionDB";
import { error } from "console";
import { Adamina } from "next/font/google";
import { hostname } from "os";
const { v4: uuidv4 } = require("uuid");
const { MONGODBURL, AUTHURL } = require("@/config");
function genuuid() {
  return uuidv4();
}
const uuids = genuuid();

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
    Admin: userData?.Admin,
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

async function deleteUser(userID) {
  const userDB = require("./database/usersDB");

  await connectDB();
  await userDB.deleteOne({
    UserID: userID,
  });
}

async function getHosts(url) {
  const hostDB = require("./database/hostDB");

  const hostData = await hostDB.find({}).sort();

  return hostData.map((host) => {
    return {
      UUID: host.UUID,
      URL: host.URL,
      APIKey: host.APIKey,
    };
  });
}

async function createHost(url, apikey, uuid) {
  const hostDB = require("./database/hostDB");

  await hostDB.create({
    UUID: uuid,
    URL: url,
    APIKey: apikey,
  });

  return "Host Created";
}

async function getHost(url) {
  const hostDB = require("./database/hostDB");

  const hostData = await hostDB.findOne({
    URL: url,
  });

  return {
    UUID: hostData?.UUID,
    URL: hostData?.URL,
    APIKey: hostData?.APIKey,
  };
}

async function deleteHost(uuid) {
  const hostDB = require("./database/hostDB");

  await hostDB.deleteOne({
    UUID: uuid,
  });
}

async function deleteHostLinks(uuid) {
  const linkDB = require("./database/linksDB");
  const userDB = require("./database/usersDB");

  const data = await linkDB
    .find({
      Host: uuid,
    })
    .sort();

  data.forEach(async (link) => {
    await userDB.findOneAndUpdate(
      {
        UserID: link.UserID,
      },
      {
        $pull: {
          Links: link.UUID,
        },
      }
    );

    await linkDB.deleteMany({
      Host: uuid,
    });
  });
}

async function getLink(link) {
  const linkDB = require("./database/linksDB");

  const linkData = await linkDB.findOne({
    Slug: link,
  });

  return {
    UUID: linkData?.UUID,
    UserID: linkData?.UserID,
    Slug: linkData?.Slug,
    Redirect: linkData?.Redirect,
    URL: linkData?.URL,
    Host: linkData?.Host,
  };
}

async function getLinkwithHost(link, host) {
  const linkDB = require("./database/linksDB");

  const linkData = await linkDB.findOne({
    Slug: link,
    Host: host,
  });

  return {
    UUID: linkData?.UUID,
    UserID: linkData?.UserID,
    Slug: linkData?.Slug,
    Redirect: linkData?.Redirect,
    URL: linkData?.URL,
    Host: linkData?.Host,
  };
}

async function getLinks(userID) {
  const linkDB = require("./database/linksDB");

  const linkData = await linkDB.find({ UserID: userID }).sort();

  return linkData.map((link) => {
    return {
      UUID: link?.UUID,
      UserID: link?.UserID,
      Slug: link?.Slug,
      Redirect: link?.Redirect,
      URL: link?.URL,
      Host: link?.Host,
    };
  });
}

async function createLink(userID, slug, redirect, uuid, host) {
  const linkDB = require("./database/linksDB");
  const userDB = require("./database/usersDB");
  const hostDB = require("./database/hostDB");

  const hostData = await hostDB.findOne({
    UUID: host,
  });

  await linkDB.create({
    UserID: userID,
    UUID: uuid,
    Slug: slug,
    Redirect: redirect,
    URL: hostData.URL + "/" + slug,
    Host: host,
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

  console.log(linkData.UUID);

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

  await linkDB.deleteMany({
    UUID: linkData.UUID,
  });
}

async function getLinkfromAPI(slug, key) {
  const linkDB = require("./database/linksDB");

  const hostDB = require("./database/hostDB");

  const hostData = await hostDB.findOne({
    APIKey: key,
  });

  const linkData = await linkDB.findOne({
    Host: hostData.UUID,
    Slug: slug,
  });

  return {
    UUID: linkData?.UUID,
    UserID: linkData?.UserID,
    Slug: linkData?.Slug,
    Redirect: linkData?.Redirect,
    URL: linkData?.URL,
    Host: linkData?.Host,
  };
}
async function editLink(userID, slug, redirect) {
  const linkDB = require("./database/linksDB");

  await linkDB.findOneAndUpdate(
    {
      Slug: slug,
      UserID: userID,
    },
    {
      Redirect: redirect,
    }
  );
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

async function deleteSession(userID) {
  await connectDB();
  const sessionDB = require("./database/sessionDB");

  await sessionDB.deleteMany({
    UserID: userID,
  });
}

async function getCookie() {
  const cookie = cookies();
  return cookie.get("session");
}

async function hasCookie() {
  const cookie = cookies();
  return cookie.has("session");
}

async function createCookie(uuid) {
  const cookie = cookies();
  cookie.set("session", uuid, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
  });
}

async function deleteCookie(key) {
  const cookie = cookies();
  cookie.delete(key);
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

async function getAuthCode(key) {
  const hostDB = require("./database/hostDB");

  const hostData = await hostDB.findOne({
    APIKey: key,
  });

  return hostData;
}

export {
  getUser,
  getAuthCode,
  getHosts,
  createUser,
  requireLogin,
  getLink,
  createLink,
  deleteLink,
  deleteHost,
  deleteHostLinks,
  deleteUser,
  getUserData,
  createSession,
  getLinks,
  getSession,
  getCookie,
  editLink,
  hasCookie,
  getLinkwithHost,
  createCookie,
  updateUser,
  getLinkfromAPI,
  getHost,
  deleteCookie,
  createHost,
  deleteSession,
};
