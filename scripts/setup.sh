#!/bin/bash

# AGI Cosmic Full Stack Setup Script
echo "🚀 Setting up AGI Cosmic Full Stack Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Node.js is installed
check_node() {
    print_header "📦 Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check if version is >= 18
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if MongoDB is available
check_mongodb() {
    print_header "🍃 Checking MongoDB..."
    if command -v mongod &> /dev/null; then
        print_status "MongoDB is installed locally"
    else
        print_warning "MongoDB not found locally. You can:"
        echo "  1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
        echo "  2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas"
        echo "  3. Continue setup and configure MongoDB URI later"
    fi
}

# Install root dependencies
install_root_deps() {
    print_header "📦 Installing root dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_status "Root dependencies installed successfully"
    else
        print_error "Failed to install root dependencies"
        exit 1
    fi
}

# Install backend dependencies
install_backend_deps() {
    print_header "🔧 Installing backend dependencies..."
    cd backend
    if [ ! -f "package.json" ]; then
        print_error "Backend package.json not found. Make sure you're in the correct directory."
        exit 1
    fi
    
    npm install
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    cd ..
}

# Install frontend dependencies
install_frontend_deps() {
    print_header "🎨 Installing frontend dependencies..."
    cd frontend
    if [ ! -f "package.json" ]; then
        print_error "Frontend package.json not found. Make sure you're in the correct directory."
        exit 1
    fi
    
    npm install
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
}

# Setup environment files
setup_env_files() {
    print_header "⚙️ Setting up environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        if [ -f "backend/.env.example" ]; then
            cp backend/.env.example backend/.env
            print_status "Created backend/.env from template"
        else
            print_warning "backend/.env.example not found"
        fi
    else
        print_status "backend/.env already exists"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        if [ -f "frontend/.env.example" ]; then
            cp frontend/.env.example frontend/.env
            print_status "Created frontend/.env from template"
        else
            print_warning "frontend/.env.example not found"
        fi
    else
        print_status "frontend/.env already exists"
    fi
}

# Create necessary directories
create_directories() {
    print_header "📁 Creating necessary directories..."
    
    # Backend directories
    mkdir -p backend/logs
    mkdir -p backend/uploads
    mkdir -p backend/tests
    
    # Frontend directories
    mkdir -p frontend/public/assets
    
    print_status "Directories created successfully"
}

# Generate JWT secret
generate_jwt_secret() {
    print_header "🔐 Generating JWT secret..."
    
    if command -v openssl &> /dev/null; then
        JWT_SECRET=$(openssl rand -base64 32)
        
        # Update backend .env file
        if [ -f "backend/.env" ]; then
            if grep -q "JWT_SECRET=" backend/.env; then
                sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" backend/.env
                rm backend/.env.bak 2>/dev/null
                print_status "JWT secret updated in backend/.env"
            else
                echo "JWT_SECRET=$JWT_SECRET" >> backend/.env
                print_status "JWT secret added to backend/.env"
            fi
        fi
    else
        print_warning "OpenSSL not found. Please manually set JWT_SECRET in backend/.env"
    fi
}

# Test installations
test_installations() {
    print_header "🧪 Testing installations..."
    
    # Test backend
    cd backend
    if npm list express &> /dev/null; then
        print_status "Backend dependencies verified"
    else
        print_error "Backend dependencies verification failed"
    fi
    cd ..
    
    # Test frontend
    cd frontend
    if npm list react &> /dev/null; then
        print_status "Frontend dependencies verified"
    else
        print_error "Frontend dependencies verification failed"
    fi
    cd ..
}

# Print next steps
print_next_steps() {
    print_header "🎉 Setup Complete! Next Steps:"
    echo ""
    echo "1. 📝 Configure your environment variables:"
    echo "   - Edit backend/.env with your MongoDB URI"
    echo "   - Add OpenAI API key (optional) for enhanced AI features"
    echo ""
    echo "2. 🍃 Start MongoDB:"
    echo "   - Local: mongod"
    echo "   - Or use MongoDB Atlas cloud service"
    echo ""
    echo "3. 🚀 Start the development servers:"
    echo "   npm run dev"
    echo ""
    echo "4. 🌐 Access your application:"
    echo "   - Frontend: http://localhost:5173"
    echo "   - Backend API: http://localhost:3001"
    echo ""
    echo "5. 📚 Read the documentation:"
    echo "   - Development Guide: DEVELOPMENT_GUIDE.md"
    echo "   - README: README.md"
    echo ""
    print_status "Happy coding! 🚀"
}

# Main execution
main() {
    print_header "🌌 AGI Cosmic Full Stack Setup"
    echo "=================================="
    
    check_node
    check_mongodb
    install_root_deps
    install_backend_deps
    install_frontend_deps
    setup_env_files
    create_directories
    generate_jwt_secret
    test_installations
    print_next_steps
}

# Run main function
main