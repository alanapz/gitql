import { Injectable } from '@nestjs/common';

const check = require("../../check");


@Injectable()
export class BlobService {

    getHello(): string {
        return 'Hello World!';
    }
}
