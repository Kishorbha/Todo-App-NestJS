import { Controller, Get, OnModuleInit, Res } from '@nestjs/common'
import { Response } from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'

@Controller()
export class AppController implements OnModuleInit {
  private pkg: Record<string, string>

  constructor() {}

  onModuleInit() {
    this.pkg = JSON.parse(
      readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
    )
  }

  @Get()
  hello() {
    return { message: `Hello from ${this.pkg.name}` }
  }

  @Get('docs')
  getDocs(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'oas.html'))
  }

  @Get('client')
  getClient(@Res() res: Response) {
    return res.json({
      current: this.pkg.version,
      minIosVersion: '0.0.0',
      minAndroidVersion: '0.0.0',
      maintenanceMode: false,
    })
  }
}
