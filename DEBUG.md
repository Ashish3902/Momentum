# Debugging Guide for Video Issues

## Common Issues and Solutions

### 1. 400 Bad Request Error

**Possible Causes:**
- Backend server not running
- Incorrect API endpoint
- Missing or invalid authentication
- Malformed request data

**Debugging Steps:**
1. Check browser console for detailed error messages
2. Verify backend server is running on `http://localhost:8000`
3. Check API base URL in browser console (should show "API Base URL: http://localhost:8000/api")
4. Look for BackendStatus indicator in bottom-right corner

### 2. Video Not Playing

**Possible Causes:**
- Invalid video URL
- CORS issues
- Video file not accessible
- Wrong video field name in response

**Debugging Steps:**
1. Check video URL in browser console
2. Verify video file exists and is accessible
3. Check if video URL is properly formatted
4. Look for video loading errors in console

### 3. Backend Connection Issues

**Check Backend Status:**
- Look for the status indicator in the bottom-right corner
- Green = Connected
- Red = Disconnected
- Yellow = Checking

**Manual Testing:**
```bash
# Test backend health endpoint
curl http://localhost:8000/api/health

# Test videos endpoint
curl http://localhost:8000/api/videos
```

### 4. Environment Configuration

**Required Environment Variables:**
```env
VITE_API_URL=http://localhost:8000/api
```

**Create .env file in the `f` directory:**
```env
VITE_API_URL=http://localhost:8000/api
VITE_DEV_MODE=true
```

### 5. Video Data Structure

**Expected Video Object:**
```javascript
{
  _id: "video_id",
  title: "Video Title",
  description: "Video Description",
  videoFile: "https://example.com/video.mp4", // or videoUrl, url, file
  thumbnail: "https://example.com/thumbnail.jpg",
  views: 1000,
  duration: 120, // in seconds
  category: "General",
  owner: {
    _id: "user_id",
    username: "username",
    fullName: "Full Name"
  }
}
```

### 6. Console Debugging

**Check these console logs:**
- API Base URL
- API Request logs
- API Response logs
- API Error logs
- Video loading errors

### 7. Network Tab

**Check Network tab in DevTools:**
1. Look for failed requests (red)
2. Check request/response headers
3. Verify CORS headers
4. Check response status codes

### 8. Common Fixes

**If backend is not running:**
```bash
# Start your backend server
cd backend
npm start
# or
node server.js
```

**If CORS issues:**
- Ensure backend has CORS configured
- Check if frontend and backend ports match

**If video URLs are wrong:**
- Check backend video upload configuration
- Verify Cloudinary or file storage setup
- Check video file permissions

### 9. Test with Sample Videos

The app includes sample videos that should work:
- Ocean Waves Relaxation
- Mountain Sunrise Timelapse

If these don't work, the issue is likely with:
- Video player component
- CORS configuration
- Network connectivity

### 10. Getting Help

**Include in bug reports:**
1. Browser console logs
2. Network tab screenshots
3. Backend status
4. Environment configuration
5. Steps to reproduce

