import { Response } from "express";
import { Controller, Get, Res } from "@isorm/core";
import MainService from "./main.service";

@Controller()
class MainController {
  constructor(private service: MainService) {}

  @Get()
  getMain(@Res res: Response) {
    const hello = this.service.sayHello();

    return res.send(hello).status(200);
  }
}

export default MainController;
