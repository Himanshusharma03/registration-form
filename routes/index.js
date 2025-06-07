var express = require("express");
var router = express.Router();
const userModule = require("./users");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/admin", (req, res, next) => {
  res.render("admin", { error: req.flash("error") });
});

router.post("/admin", function (req, res) {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    req.session.isAdmin = true;
    return res.redirect("/userdetails");
  } else {
    return res.render("admin", {
      error: "Invalid username or password",
    });
  }
});

router.get("/userdetails", async (req, res) => {
  if (!req.session.isAdmin) return res.redirect("/admin");
  let allusers = await userModule.find();
  res.render("userdetails", { registration: allusers });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});

router.get("/registrationForm", (req, res) => {
  res.render("registrationForm", { error: req.flash("error") });
});

router.get("/submit", (req, res) => {
  res.render("submit");
});

router.post("/submit", async (req, res) => {
  let {
    name,
    email,
    phone,
    address,
    dob,
    tenth_year,
    tenth_percentage,
    twelth_year,
    twelth_percentage,
    graduation_year,
    graduation_percentage,
    postgraduation_year,
    postgraduation_percentage,
  } = req.body;

  try {
    const existingUser = await userModule.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.render("registrationForm", {error:"User with this email or phone number is already exists."});
    }

    const registeredUser = await userModule.create({
      name,
      email,
      phone,
      address,
      dob,
      education: {
        tenth: {
          year: tenth_year,
          percentage: tenth_percentage,
        },
        twelth: {
          year: twelth_year,
          percentage: twelth_percentage,
        },
        graduation: {
          year: graduation_year,
          percentage: graduation_percentage,
        },
        postgraduation: {
          year: postgraduation_year,
          percentage: postgraduation_percentage,
        },
      },
    });

    // console.log(registeredUser);
    // res.send(registeredUser);
    // console.log("DOB:", req.body.dob);
    res.render("submit");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

router.get("/delete/:id", async (req, res) => {
  let users = await userModule.findOneAndDelete({ _id: req.params.id });
  res.redirect("/userdetails");
});

router.get("/edit/:id", async (req, res) => {
  let users = await userModule.findOne({ _id: req.params.id });
  res.render("edit", { users });
});

router.post("/update/:id", async (req, res) => {
  let {
    name,
    email,
    phone,
    address,
    dob,
    tenth_year,
    tenth_percentage,
    twelth_year,
    twelth_percentage,
    graduation_year,
    graduation_percentage,
    postgraduation_year,
    postgraduation_percentage,
  } = req.body;

  let users = await userModule.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name,
      email,
      phone,
      address,
      dob,
      education: {
        tenth: {
          year: tenth_year,
          percentage: tenth_percentage,
        },
        twelth: {
          year: twelth_year,
          percentage: twelth_percentage,
        },
        graduation: {
          year: graduation_year,
          percentage: graduation_percentage,
        },
        postgraduation: {
          year: postgraduation_year,
          percentage: postgraduation_percentage,
        },
      },
    },
    { new: true }
  );
  res.redirect("/userdetails");
});

module.exports = router;
