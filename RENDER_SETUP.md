# Render.com Deployment Setup

## Important Settings to Check in Render Dashboard

If CSS is not building, verify these settings in your Render.com dashboard:

### 1. Build Command
Make sure the Build Command in Render matches:
```
npm install --include=dev && npm run build:all && ls -la public/css/ && test -f ./public/css/output.css || (echo 'ERROR: CSS file not generated!' && exit 1)
```

**OR** if using `render.yaml`, ensure Render is reading from it:
- Go to your service settings
- Check "Auto-Deploy" settings
- Verify that Render is using the `render.yaml` file

### 2. Environment Variables
Ensure these are set:
- `NODE_ENV=production`

### 3. Root Directory
- Should be left empty (defaults to repository root)
- OR set to `/` if needed

### 4. Node Version
- Should match your local Node version (check with `node --version`)
- Can be set in `package.json` with `"engines": { "node": ">=20.0.0" }`

### 5. Build Logs
Check the build logs in Render to see:
- If `npm install --include=dev` is installing Tailwind CSS
- If `npm run build:all` is running successfully
- If the CSS file is being created
- Any error messages

### 6. Common Issues

**Issue: CSS file not found**
- Check if `public/css/input.css` exists in the repository
- Verify the build command is running `npm run build:css`
- Check if Tailwind CSS is installed (should be in `node_modules`)

**Issue: Build succeeds but CSS missing**
- The CSS file might be generated but not committed
- Check if `output.css` is in `.gitignore` (it should be)
- The file should be generated during build, not committed

**Issue: Static files not serving**
- Verify `server.ts` is correctly pointing to the `public` directory
- Check the console logs for the static file path
- Ensure the CSS file path in `layout.ejs` is `/css/output.css`

## Testing Locally

To test the build process locally:
```bash
# Clean build
rm -rf dist public/css/output.css

# Run the build
npm install --include=dev
npm run build:all

# Verify files exist
test -f dist/server.js && echo "✓ server.js exists"
test -f public/css/output.css && echo "✓ output.css exists"
```

## If render.yaml is not being used

If Render is not reading `render.yaml`, you can manually set the build command in the dashboard:
1. Go to your service
2. Settings → Build & Deploy
3. Set Build Command to: `npm install --include=dev && npm run build:all`
4. Set Start Command to: `npm start`

