"use strict";
const express = require("express");
const router = express.Router();
const getMovement = require("../services/get_movement");
const getFromMobile = require("../services/startstepfunction");
const getVoice = require("../services/get_voice");
const getDataSetMetaData = require("../services/get_dataSetMetaData");
const getBadgeMetaData = require("../services/get_badgeMetaData");

router.get("/movement/:dataset_id", (req, res) => {
  var dataset_id = req.params.dataset_id;
  getMovement(dataset_id, req.query)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(502).json({ msg: "Could not get tasks", err: err });
    });
});

router.get("/badgeMetaData/:dataset_id/:badge_id", (req, res) => {
  var badge_id = req.params.badge_id;
  var dataset_id = req.params.dataset_id;
  getBadgeMetaData
    .getBadgeMetaData(dataset_id, badge_id)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(502).json({ msg: "Could not get tasks", err: err });
    });
});

router.get("/badgeMetaData", (req, res) => {
  getBadgeMetaData
    .getAllBadgeMetaData(req.query)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(502).json({ msg: "Could not get tasks", err: err });
    });
});

router.get("/dataSetMetaData/:dataset_id", (req, res) => {
  var dataset_id = req.params.dataset_id;
  console.log(dataset_id);
  console.log(typeof dataset_id);
  getDataSetMetaData
    .getDataSetMetaData(dataset_id)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(502).json({ msg: "Could not get tasks", err: err });
    });
});

router.get("/dataSetMetaData", (req, res) => {
  getDataSetMetaData
    .getAllDataSetMetaData(req.querry)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(502).json({ msg: "Could not get tasks", err: err });
    });
});

router.post("/", function(req, res) {
  getFromMobile(JSON.parse(req.body.toString()))
    .then(result => {
      res.json({ success: true });
    })
    .catch(err => {
      res.json({ success: false, error: err });
    });
});

router.get("/voice/:dataset_id", (req, res) => {
  var dataset_id = req.params.dataset_id;
  getVoice(dataset_id, req.query)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(502).json({ msg: "Could not get tasks", err: err });
    });
});

module.exports = router;
