import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";

@Controller("users")
class UsersController {
  @Get("")
  protected getTest(req: Request, res: Response) {
    console.log("TESTTTTTTTTTT");
    return res.apiSuccess<null>({
      status: 200,
      message: "lala",
      code: 2001,
      data: null,
    });
  }
}

export default UsersController;
