import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import process from 'node:process'

const DEFAULT_PORT = 4173
const TIMEOUT_MS = 120_000

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function npxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx'
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // Keep polling until the preview server comes up.
    }

    await wait(500)
  }

  throw new Error(`Preview server did not become ready at ${url} within ${timeoutMs}ms`)
}

function findOpenPort(startPort) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const server = createServer()
      server.unref()
      server.on('error', () => {
        server.close()
        tryPort(port + 1)
      })
      server.listen(port, '127.0.0.1', () => {
        const address = server.address()
        const resolvedPort =
          address && typeof address === 'object' ? address.port : port
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }
          resolve(resolvedPort)
        })
      })
    }

    tryPort(startPort)
  })
}

function runCommand(command, args, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        ...process.env,
        ...extraEnv,
      },
    })

    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${command} ${args.join(' ')} exited with signal ${signal}`))
        return
      }
      resolve(code ?? 1)
    })
    child.on('error', reject)
  })
}

async function main() {
  const port = await findOpenPort(DEFAULT_PORT)
  const previewUrl = `http://127.0.0.1:${port}`
  const preview = spawn(npmCommand(), ['run', 'preview', '--', '--port', String(port), '--strictPort'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
  })

  let previewClosed = false
  preview.on('exit', () => {
    previewClosed = true
  })

  const stopPreview = () => {
    if (!previewClosed) {
      preview.kill('SIGTERM')
    }
  }

  process.on('exit', stopPreview)
  process.on('SIGINT', () => {
    stopPreview()
    process.exit(130)
  })
  process.on('SIGTERM', () => {
    stopPreview()
    process.exit(143)
  })

  try {
    await waitForServer(previewUrl, TIMEOUT_MS)
    const code = await runCommand(
      npxCommand(),
      ['playwright', 'test', '--config', 'playwright.config.ts'],
      {
        PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH ?? '.playwright-browsers',
        E2E_BASE_URL: `http://localhost:${port}`,
      },
    )
    process.exitCode = code
  } finally {
    stopPreview()
  }
}

await main()
