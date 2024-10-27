import { NestFactory } from '@nestjs/core'
import { AppModule } from '../dist/app.module.js'
import { readFile } from 'fs/promises'

type OasRoute = {
  path: string
  methods: string[]
}

type ApiRoute = {
  [key: string]: string[]
}

async function main() {
  const oasFilePath = process.argv[2]
  if (!oasFilePath?.endsWith('.json')) {
    console.error('OAS file must be json format')
    process.exit(1)
  }

  const [oasRoutes, apiRoutes] = await Promise.all([
    getOasRoutes(oasFilePath),
    getApiRoutes(),
  ])

  const missingRoutes = missingOasRoutesInApi(oasRoutes, apiRoutes)

  if (missingRoutes.length) {
    console.info(missingRoutes)
    process.exit(1)
  } else process.exit(0)
}

main()

async function getOasRoutes(oasFilePath: string) {
  const file = await readFile(oasFilePath, 'utf8')
  const json = JSON.parse(file)

  const routes: OasRoute[] = []
  Object.keys(json.paths).forEach((route) => {
    const path = route.replace(/{/g, ':').replace(/}/g, '')
    const methods = Object.keys(json.paths[route])
    routes.push({ path, methods })
  })
  return routes
}

async function getApiRoutes() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'warn'],
  })
  await app.init()

  const server = app.getHttpServer()
  const router = server._events.request._router
  const routes: ApiRoute = {}

  router.stack.forEach((layer) => {
    if (!layer.route) return
    const path = layer.route.path
    const methods = Object.keys(layer.route.methods)
    routes[path] ||= []
    routes[path].push(...methods)
  })

  return routes
}

function missingOasRoutesInApi(oasRoutes: OasRoute[], apiRoutes: ApiRoute) {
  const missingRoutes: OasRoute[] = []

  oasRoutes.forEach(({ path, methods }) => {
    if (!apiRoutes[path]) return missingRoutes.push({ path, methods })

    const missingMethods = methods.filter(
      (method) => !apiRoutes[path].includes(method),
    )
    if (missingMethods.length)
      missingRoutes.push({ path, methods: missingMethods })
  })

  return missingRoutes
}
