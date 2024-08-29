import { Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async get() {
    return this.userService.get();
  }

  @Post()
  async create() {
    return this.userService.create();
  }
}
