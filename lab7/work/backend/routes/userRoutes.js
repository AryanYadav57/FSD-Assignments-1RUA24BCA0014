import { Router } from "express";
import { users } from "../data/users.js";

const router = Router();

router.get("/even", (_request, response) => {
  response.json({ count: users.filter((user) => user.id % 2 === 0).length, users: users.filter((user) => user.id % 2 === 0) });
});

router.get("/odd", (_request, response) => {
  response.json({ count: users.filter((user) => user.id % 2 !== 0).length, users: users.filter((user) => user.id % 2 !== 0) });
});

export default router;
