import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import dns from "node:dns"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, ".env")

if (existsSync(envPath)) process.loadEnvFile(envPath)

const dnsServers = process.env.DNS_SERVERS
    ?.split(",")
    .map(server => server.trim())
    .filter(Boolean)

if (dnsServers?.length) {
    try {
        dns.setServers(dnsServers)
    } catch {
        console.warn("DNS_SERVERS invalido; se usan los servidores DNS de sistema")
    }
}

export const config = {
    port: Number(process.env.PORT) || 2026,
    mongoUri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017",
    dbName: process.env.DB_NAME ?? "recetario",
    jwtSecret: process.env.JWT_SECRET ?? "Clave secreta",
    jwtExpires: process.env.JWT_EXPIRES ?? "2h",
    corsOrigin: process.env.CORS_ORIGIN ?? "*"
}
