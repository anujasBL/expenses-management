# Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended for Hackathons)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Set project name
   - Set build command: `npm run build`
   - Set output directory: `dist`

5. **Your app will be deployed to:** `https://your-project.vercel.app`

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Drag and drop the `dist` folder to Netlify**

3. **Or use Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   netlify deploy --dir=dist --prod
   ```

### Option 3: GitHub Pages

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Push to gh-pages branch:**
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

## 🔧 Pre-Deployment Checklist

- [ ] `npm run build` succeeds without errors
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] All environment variables are configured
- [ ] API endpoints are accessible (if using external API)

## 🌍 Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```env
VITE_APP_ENVIRONMENT=production
VITE_API_BASE_URL=https://your-api-domain.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT_IMPORT=true
VITE_ENABLE_CHARTS=true
```

### Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable from your `.env.production` file

## 📱 Testing Deployment

After deployment, test:

- [ ] Page loads without errors
- [ ] Responsive design works on mobile
- [ ] All interactive elements function
- [ ] Data persistence works (localStorage)
- [ ] No console errors

## 🚨 Troubleshooting

### Build Failures

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 18.18.0+
   ```

2. **Clear dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check TypeScript errors:**
   ```bash
   npm run type-check
   ```

### Runtime Errors

1. **Check browser console for errors**
2. **Verify environment variables are set**
3. **Check API endpoints are accessible**

### Performance Issues

1. **Optimize bundle size:**
   ```bash
   npm run build
   # Check dist folder size
   ```

2. **Enable compression on hosting platform**
3. **Use CDN for static assets**

## 🎯 Hackathon Deployment Tips

1. **Keep it simple** - Focus on core functionality
2. **Test locally first** - Ensure `npm run build` works
3. **Use Vercel** - Fastest deployment option
4. **Document your API** - If using external services
5. **Have a backup plan** - Multiple hosting options ready

## 📊 Post-Deployment

1. **Share your live URL** with the hackathon judges
2. **Document any known issues** or limitations
3. **Prepare a demo script** highlighting key features
4. **Monitor performance** and user feedback

---

**Remember: A working deployed app is better than a perfect local app!**
