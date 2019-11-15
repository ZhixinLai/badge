"use strict";
const express = require("express");
const router = express.Router();
const getMovement = require("../services/get_movement");
const getFromMobile = require("../services/startstepfunction");
const getVoice = require("../services/get_voice");

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

router.post("/movement", function(req, res) {
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
