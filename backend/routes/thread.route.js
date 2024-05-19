const express = require("express");
const router = express.Router();
const {
  createThread,
  getOwnerThreads,
  getAllThreads,
  getFilterThreads,
} = require("../controllers/thread.controller");

router.post("/create-thread", createThread);
router.get("/get-threads", getAllThreads);
router.get("/filter", getFilterThreads);

module.exports = router;
