# Artआलय (Resin E-Commerce) — Support & Operations Runbook
## Standard Operating Procedure (SOP): Starting, Stopping, and Troubleshooting the Application

**Document Version:** 1.0.0  
**Target Audience:** L1/L2 Technical Support Engineers, Operations Specialists, Systems Administrators  
**Default Application URL:** `http://localhost:3000`  
**Default Port:** `3000`  
**Application Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, Prisma ORM, Zustand, Node.js  

---

## 1. Quick Reference Cheat Sheet

### One-Click Helper Scripts (Windows)
For convenience, ready-to-run automation scripts are available in `scripts/`:
* **`scripts\start-dev.bat`** — Automatically frees port 3000 and starts the Next.js dev server.
* **`scripts\stop-server.bat`** — Discovers and kills any active process listening on port 3000.
* **`scripts\clean-restart.bat`** — Stops the server, flushes the `.next` cache directory, and starts cleanly.

### Command-Line Cheat Sheet

| Action | Command (Windows PowerShell) | Command (Command Prompt `cmd`) | Command (macOS / Linux) |
| :--- | :--- | :--- | :--- |
| **Start (Development)** | `npm run dev` | `npm run dev` | `npm run dev` |
| **Build (Production)** | `npm run build` | `npm run build` | `npm run build` |
| **Start (Production)** | `npm run start` | `npm run start` | `npm run start` |
| **Stop (Interactive)** | `Ctrl + C` (then `Y`) | `Ctrl + C` (then `Y`) | `Ctrl + C` |
| **Find Stale Port 3000** | `Get-NetTCPConnection -LocalPort 3000` | `netstat -ano \| findstr :3000` | `lsof -i :3000` |
| **Force Kill Port 3000** | `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force` | `taskkill /F /PID <PID>` | `kill -9 $(lsof -t -i:3000)` |
| **Clear Build Cache** | `Remove-Item -Recurse -Force .next` | `rmdir /s /q .next` | `rm -rf .next` |

---

## 2. Prerequisites & Environment Check

Before initiating or servicing the application, verify that the host machine satisfies the runtime requirements:

1. **Node.js Runtime:**
   * Verify Node version is **v18.17.0+** or **v20.x+**:
     ```powershell
     node -v
     ```
   * Verify npm is installed:
     ```powershell
     npm -v
     ```
2. **Repository Working Directory:**
   * Ensure your terminal is in the project root:
     ```powershell
     cd d:\Projects\resin_website
     ```
3. **Configuration File (`.env.local` or `.env`):**
   * Confirm `.env.local` exists in the root folder. If missing, copy it from `.env.example`:
     ```powershell
     Copy-Item .env.example .env.local
     ```
   * Key operational flags:
     * `NODE_ENV`: `"development"` or `"production"`
     * `PORT`: `3000` (default)
     * `MOCK_MODE`: `"true"` (enables offline development mode with mock data)

---

## 3. How to Start the Application

### Option A: Development Mode (Standard Support & Testing)
Used for local verification, debugging, and live file reloading.

1. Open PowerShell or Terminal in the project root:
   ```powershell
   cd d:\Projects\resin_website
   ```
2. Start the development server:
   ```powershell
   npm run dev
   ```
3. Look for the startup confirmation in the terminal logs:
   ```text
     ▲ Next.js 14.2.35
     - Local:        http://localhost:3000
     - Environments: .env.local

    ✓ Starting...
    ✓ Ready in 1343ms
   ```
4. Verify by navigating to **`http://localhost:3000`** in Chrome or Edge.

---

### Option B: Production Mode (Optimized Production Performance)
Used for pre-release testing, staging, and high-performance production serving.

1. **Generate Prisma Client (if database changes occurred):**
   ```powershell
   npm run db:generate
   ```
2. **Build the Optimized Production Bundle:**
   ```powershell
   npm run build
   ```
   *Ensure the build completes with zero errors (`Route (app)` list displays green).*
3. **Start the Production Server:**
   ```powershell
   npm run start
   ```
   *Custom Port Example (if port 3000 is reserved):*
   ```powershell
   npm run start -- -p 3001
   ```

---

### Option C: Running as a Managed Background Daemon (PM2 / NSSM)

For persistent servers that automatically restart on reboot or crash:

#### Using PM2 (Recommended for Node.js):
```bash
# Install PM2 globally (one-time)
npm install -g pm2

# Start the application with PM2
pm2 start npm --name "art-aalay" -- run start

# View live process status
pm2 status

# View live logs
pm2 logs art-aalay

# Stop the application
pm2 stop art-aalay

# Restart the application
pm2 restart art-aalay
```

---

## 4. How to Stop the Application

### Procedure 1: Clean Interactive Stop (Console Foreground)
If the application is running in an active terminal window:

1. Click on the terminal window running `npm run dev` or `npm run start`.
2. Press **`Ctrl + C`**.
3. When prompted: `Terminate batch job (Y/N)?`, type **`Y`** and press **Enter**.
4. The process terminates and releases port 3000.

---

### Procedure 2: Stopping Orphaned / Background Instances (Windows)
If the server window was closed without stopping, or if the process is stuck in the background holding Port 3000:

#### Method A: One-Liner PowerShell (Fastest)
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

#### Method B: Step-by-Step Port Diagnostic (PowerShell)
1. **Identify the Process ID (PID) holding port 3000:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3000 -State Listen
   ```
   *Look at the `OwningProcess` column (e.g. `14820`).*
2. **Terminate the process by PID:**
   ```powershell
   Stop-Process -Id 14820 -Force
   ```
3. **Confirm port 3000 is released:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
   ```
   *(If nothing is returned, the port is free).*

#### Method C: Standard Windows Command Prompt (`cmd.exe`)
1. Find the PID:
   ```cmd
   netstat -ano | findstr :3000
   ```
2. Kill the PID:
   ```cmd
   taskkill /F /PID <PID_NUMBER>
   ```

---

### Procedure 3: Stopping on macOS / Linux
```bash
# 1. Locate the PID listening on port 3000
lsof -i :3000

# 2. Terminate the process cleanly
kill -15 <PID>

# 3. Force kill if unresponsive
kill -9 <PID>

# One-liner force kill:
kill -9 $(lsof -t -i:3000)
```

---

## 5. Post-Start Health Verification Checklist

After starting or restarting the service, perform these four health verification steps:

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| **1. Storefront Health** | Open `http://localhost:3000` | Homepage renders with *"Handmade & Custom Resin Art"*, catalog pieces, and navbar. |
| **2. Catalog & Customizer** | Click *"Customize"* on any product card (e.g. `/customize/bespoke-teakwood-nameplate`) | 2D Customizer stage loads with authentic artisan photo preview, free-text requirements box, and zero blueprint errors. |
| **3. API Health** | In browser, open `http://localhost:3000/api/products` | Returns JSON array containing active catalog products with HTTP 200. |
| **4. Admin Portal** | Open `http://localhost:3000/login` | Login page loads cleanly with high-contrast inputs and no missing stylesheet errors. |

---

## 6. Troubleshooting Common Support Incidents

### Incident 1: `Error: listen EADDRINUSE: address already in use :::3000`
* **Symptoms:** Terminal displays `Port 3000 is in use, trying 3001 instead` or throws `EADDRINUSE`.
* **Root Cause:** A previous Node.js instance crashed or was closed without releasing the TCP port.
* **Resolution:**
  1. Terminate the stale process holding port 3000:
     ```powershell
     Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
     ```
  2. Rerun `npm run dev`.

---

### Incident 2: `404 Error when loading application` / Missing `_next/static` Chunks
* **Symptoms:** Browser shows a blank white page or Next.js 404 error; server logs indicate `GET /_next/static/chunks/main-app.js 404`.
* **Root Cause:** Build cache corruption in `.next/` caused by simultaneous builds or interrupted hot module reload (HMR).
* **Resolution:**
  1. Stop the application (`Ctrl + C` or kill process).
  2. Delete the `.next` directory:
     ```powershell
     Remove-Item -Recurse -Force .next
     ```
  3. Restart the application:
     ```powershell
     npm run dev
     ```

---

### Incident 3: Module / Package Mismatch after Git Pull
* **Symptoms:** `Cannot find module ...` or `Type error in TSX`.
* **Resolution:**
  1. Install / update project dependencies:
     ```powershell
     npm install
     ```
  2. Regenerate Prisma Client:
     ```powershell
     npx prisma generate
     ```
  3. Run TypeScript preflight check:
     ```powershell
     node ./node_modules/typescript/bin/tsc --noEmit
     ```
     *(Must output 0 errors).*

---

### Incident 4: Database Connection Errors
* **Symptoms:** Prisma throws connection refused to `postgresql://...`
* **Root Cause:** Local PostgreSQL service is stopped or network unreachable.
* **Resolution:**
  * For development and testing, verify that `MOCK_MODE="true"` is configured in `.env.local`. When `MOCK_MODE="true"`, all product catalog, order, and auth workflows operate seamlessly using memory/file storage with zero database blockage.

---

## 7. Escalation Matrix

If the issue cannot be resolved following the above procedures:

| Level | Role | Scope / Trigger | Contact |
| :--- | :--- | :--- | :--- |
| **L1** | Support Engineer | Port conflict, server start/stop, cache clearing (`.next`) | Internal L1 Support Desk |
| **L2** | Software Engineer | Build failure, TypeScript compile error, Prisma schema drift | Dev Team On-Call |
| **L3** | Lead Architect / PO | Database corruption, third-party payment/logistics outage | BMAD PO / System Architect |
