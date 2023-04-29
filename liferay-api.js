const fs = require("node:fs");
const { blob } = require("node:stream/consumers");
const path = require('path');

const AVAILABLE_ACTION = {
  showAllPost: fetchBlogPosting,
  postBlogData,
  uploadImage,
};

const AVAILABLE_ACTION_DESC = {
  showAllPost: "show data of all the post",
  postBlogData: "posting a blog",
  uploadImage: "for uploading image to server",
};

const USER_NAME = "test@liferay.com";
const PASSWORD = "learn";

const AUTH = btoa(`${USER_NAME}:${PASSWORD}`);

const SITE_ID = 20121;

//**  base64.encode(username + ":" + password))

//* Buffer.from(username + ":" + password).toString('base64')
async function fetchBlogPosting() {
  try {
    const res = await fetch(
      `http://localhost:8080/o/headless-delivery/v1.0/sites/${SITE_ID}/blog-postings`,
      {
        headers: {
          Authorization: `Basic ${AUTH}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      const blogData = await res.json();
      console.log(blogData);
    } else {
      console.log(res.status);
    }
  } catch (err) {
    console.log(err);
  }
}

async function uploadImage() {
  try {
    // let fileUrl = "../../Downloads/poke.jpg";
    const fileUrl = "/home/me/Downloads/poke.jpg";
    const data = await blob(fs.createReadStream(fileUrl));
    const fileName = path.parse(fileUrl).base;

    const stats = fs.statSync(fileUrl);
    console.log(stats);
    const formData = new FormData();

    formData.append("file", data, fileName);
    const res = await fetch(
      `http://localhost:8080/o/headless-delivery/v1.0/sites/${SITE_ID}/blog-posting-images`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Basic ${AUTH}`,
        },
      }
    );

    const imagePostRes = await res.json();

    if (res.ok) {
      console.log(imagePostRes);
    } else {
      console.log(res.status, "error status", imagePostRes);
    }
  } catch (err) {
    console.log(err);
  }
}

async function postBlogData() {
const body = {articleBody: "sdsd",
  datePublished: new Date(),
  description: "sdsdsd",
  image: {
    caption: "",
    imageId: 0,
  },
  headline: "sdsdsd",
  keywords: ["sdsdsd"],
  viewableBy: "Anyone",
}
  // {
  //   // alternativeHeadline: "saved this using node fetchdsds",
  //   articleBody: "Hi there this is the post from nodesdsdsd",
  //   // creator: { name: "Tushar Mehta" },
  //   datePublished: new Date().getTime(),
  //   description: "testing post blog datasdsd",
  //   image: {
  //   caption: "",
  //   imageId: 0,
  // },
  //   // friendlyUrlPath: "testBlo",
  //   headline: "Hi there posting this data from jsasssddasasas",
  //   keywords: ["testsd"],
  //   viewableBy: "Anyone",
  // };

  // image: {
  //   caption: "stringsdsdsdsdssd",
  //   imageId: 0,
  // },
  try {
    const res = await fetch(
      `http://localhost:8080/o/headless-delivery/v1.0/sites/${SITE_ID}/blog-postings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${AUTH}`,
        },
        body: JSON.stringify(body),
      }
    );

    const postRes = await res.json();

    if (res.ok) {
      console.log(postRes);
    } else {
      console.log(res.status, "error status", postRes);
    }
  } catch (err) {
    console.log(err);
  }
}

// fetchBlogPosting();

const action = process.argv[2];

function emptyAction() {
  console.log("no action such action exist");
  console.log("available actions --->", AVAILABLE_ACTION_DESC);
}

const actionToRun = AVAILABLE_ACTION[action] || emptyAction;

actionToRun();
