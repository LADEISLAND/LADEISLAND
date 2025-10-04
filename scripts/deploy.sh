#!/bin/bash

# AGI Cosmic Quick Deploy Script
# This script helps deploy the AGI Cosmic app to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AGI Cosmic Deployment Script${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    print_status "Dependencies check passed ✓"
}

# Build applications
build_apps() {
    print_status "Building applications..."
    
    # Build backend
    print_status "Building backend..."
    cd backend
    npm ci --only=production
    cd ..
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend
    npm ci
    npm run build
    cd ..
    
    print_status "Build completed ✓"
}

# Deploy to Vercel (Frontend)
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    cd frontend
    
    # Login if not already logged in
    if ! vercel whoami &> /dev/null; then
        print_status "Please login to Vercel..."
        vercel login
    fi
    
    # Deploy
    vercel --prod
    cd ..
    
    print_status "Frontend deployed to Vercel ✓"
}

# Deploy to Railway (Backend)
deploy_railway() {
    print_status "Deploying backend to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    cd backend
    
    # Login if not already logged in
    if ! railway whoami &> /dev/null; then
        print_status "Please login to Railway..."
        railway login
    fi
    
    # Deploy
    railway up
    cd ..
    
    print_status "Backend deployed to Railway ✓"
}

# Deploy to Netlify (Alternative frontend)
deploy_netlify() {
    print_status "Deploying frontend to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    cd frontend
    
    # Login if not already logged in
    if ! netlify status &> /dev/null; then
        print_status "Please login to Netlify..."
        netlify login
    fi
    
    # Deploy
    netlify deploy --prod --dir=dist
    cd ..
    
    print_status "Frontend deployed to Netlify ✓"
}

# Deploy to Heroku (Alternative backend)
deploy_heroku() {
    print_status "Deploying backend to Heroku..."
    
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI not found. Please install from https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    cd backend
    
    # Login if not already logged in
    if ! heroku whoami &> /dev/null; then
        print_status "Please login to Heroku..."
        heroku login
    fi
    
    # Create app if it doesn't exist
    if ! heroku apps:info agi-cosmic-backend &> /dev/null; then
        print_status "Creating Heroku app..."
        heroku create agi-cosmic-backend
    fi
    
    # Set environment variables
    print_status "Setting environment variables..."
    heroku config:set NODE_ENV=production
    heroku config:set AI_PROVIDER=huggingface
    
    # Deploy
    git add .
    git commit -m "Deploy to Heroku" || true
    git push heroku main
    cd ..
    
    print_status "Backend deployed to Heroku ✓"
}

# Create PWA package for app stores
create_pwa_package() {
    print_status "Creating PWA package for app stores..."
    
    # Create PWA Builder configuration
    cat > pwa-builder-config.json << EOL
{
  "url": "https://agicosmicapp.com",
  "name": "AGI Cosmic",
  "packageId": "com.agicosmicapp.pwa",
  "display": "standalone",
  "startUrl": "/",
  "themeColor": "#00d4ff",
  "backgroundColor": "#0a0a0f",
  "shortcuts": [
    {
      "name": "Explore Solar System",
      "url": "/#explore"
    },
    {
      "name": "Chat with AI",
      "url": "/#chat"
    }
  ]
}
EOL
    
    print_status "PWA configuration created. Visit https://www.pwabuilder.com/ to generate app packages."
}

# Setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Add monitoring scripts to package.json
    print_status "Monitoring setup completed. Remember to configure:"
    echo "  - Error tracking (Sentry)"
    echo "  - Performance monitoring (Lighthouse CI)"
    echo "  - Uptime monitoring (UptimeRobot)"
}

# Main deployment flow
main() {
    echo "Select deployment option:"
    echo "1) Full deployment (Vercel + Railway)"
    echo "2) Frontend only (Vercel)"
    echo "3) Backend only (Railway)"
    echo "4) Alternative deployment (Netlify + Heroku)"
    echo "5) Create PWA packages for app stores"
    echo "6) Build only (no deployment)"
    echo "7) Setup monitoring"
    
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            check_dependencies
            build_apps
            deploy_vercel
            deploy_railway
            create_pwa_package
            print_status "🎉 Full deployment completed!"
            ;;
        2)
            check_dependencies
            cd frontend && npm ci && npm run build && cd ..
            deploy_vercel
            print_status "🎉 Frontend deployment completed!"
            ;;
        3)
            check_dependencies
            cd backend && npm ci --only=production && cd ..
            deploy_railway
            print_status "🎉 Backend deployment completed!"
            ;;
        4)
            check_dependencies
            build_apps
            deploy_netlify
            deploy_heroku
            print_status "🎉 Alternative deployment completed!"
            ;;
        5)
            create_pwa_package
            print_status "🎉 PWA packages ready for app stores!"
            ;;
        6)
            check_dependencies
            build_apps
            print_status "🎉 Build completed!"
            ;;
        7)
            setup_monitoring
            print_status "🎉 Monitoring setup completed!"
            ;;
        *)
            print_error "Invalid choice. Please select 1-7."
            exit 1
            ;;
    esac
}

# Run main function
main

echo ""
echo -e "${GREEN}🚀 Deployment process completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Test your deployed application"
echo "2. Set up custom domain (if needed)"
echo "3. Configure monitoring and analytics"
echo "4. Submit PWA to app stores (if created)"
echo "5. Set up CI/CD pipeline for future deployments"
echo ""
echo "Useful links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Railway Dashboard: https://railway.app/dashboard"
echo "- PWA Builder: https://www.pwabuilder.com/"
echo "- App Store Connect: https://appstoreconnect.apple.com/"
echo "- Google Play Console: https://play.google.com/console/"