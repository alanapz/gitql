import { Controller, Get } from '@nestjs/common';
import { GitService } from "src/git/git.service";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly gitService: GitService) {}

  @Get()
  async getHello(): Promise<string> {
    console.log(await this.gitService.listTreeItems("c:\\dev\\gitql\\gitql-api", "8ad89422542c359dfa1515eef711a60284f8b780"));
    return this.appService.getHello();
  }
}
