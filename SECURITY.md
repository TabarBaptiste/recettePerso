# Security Considerations

## Current Security Measures

### File Upload Security
- **File Type Validation**: Only images (JPEG, JPG, PNG, GIF, WebP) are accepted
- **File Size Limit**: Maximum file size is 5MB
- **Filename Sanitization**: Uploaded files are renamed with timestamp and random suffix to prevent conflicts and path traversal attacks
- **Storage Location**: Files are stored outside the web root in a dedicated uploads directory

### Authentication
- Frontend-only access code protection for creating, modifying, and deleting recipes
- Note: This is NOT secure for production use with sensitive data

## Known Limitations and Recommendations

### Rate Limiting
**Issue**: The file upload endpoints (POST /api/recipes, PUT /api/recipes/:id, DELETE /api/recipes/:id) are not rate-limited, which could lead to:
- Denial of Service (DoS) attacks through repeated uploads
- Disk space exhaustion
- Resource exhaustion on the server

**Recommendation**: Add rate limiting middleware such as `express-rate-limit` to protect against abuse:
```typescript
import rateLimit from 'express-rate-limit';

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many uploads, please try again later'
});

router.post('/', uploadLimiter, upload.single('image'), async (req, res) => {
  // ... handler code
});
```

### Backend Authentication
**Issue**: The current access code protection is implemented only in the frontend and can be easily bypassed by making direct API calls.

**Recommendation**: Implement proper backend authentication using JWT tokens, API keys, or OAuth for production use.

### Storage Considerations
- Uploaded images are stored on the local filesystem
- For production deployments, consider using cloud storage (AWS S3, Cloudflare R2, etc.) to ensure:
  - Scalability across multiple server instances
  - Automatic backups
  - CDN integration for better performance
  - Persistence in serverless/container environments

### Input Validation
**Current Implementation**:
- File type validation based on MIME type and extension
- File size limit (5MB)

**Issue**: The current file validation relies on client-provided MIME type and file extension, which can be easily spoofed. A malicious user could upload a non-image file by manipulating the file extension and MIME type.

**Recommendations**:
1. **Server-side content validation**: Use image processing libraries (like `sharp` or `jimp`) to verify uploaded files are actual valid images:
   ```typescript
   import sharp from 'sharp';
   
   // In the route handler, after multer processes the file:
   try {
     await sharp(req.file.path).metadata();
     // If this doesn't throw, the file is a valid image
   } catch (error) {
     // Not a valid image, delete and reject
     fs.unlinkSync(req.file.path);
     return res.status(400).json({ error: 'Invalid image file' });
   }
   ```
2. **Virus/malware scanning** in production environments
3. **Content moderation** if the app becomes multi-user
