#!/usr/bin/env python3
"""
Startup Script for Unified Mediation Platform
Initializes database and starts the API server
"""

import os
import sys
import subprocess
import time

def check_requirements():
    """Check if required packages are installed"""
    required_packages = ['flask', 'flask-cors']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install'] + missing_packages)
            print("✅ Packages installed successfully")
        except subprocess.CalledProcessError:
            print("❌ Failed to install packages. Please install manually:")
            print(f"pip install {' '.join(missing_packages)}")
            return False
    
    return True

def initialize_database():
    """Initialize the database with test data"""
    print("🏛️ Initializing database...")
    
    try:
        from initialize_platform import init_platform
        init_platform()
        print("✅ Database initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return False

def start_api_server():
    """Start the Flask API server"""
    print("🚀 Starting API server...")
    print("📡 API will be available at: http://localhost:5000")
    print("🌐 Web interface should connect to this API")
    print("📱 Android app will load the web interface from GitHub Pages")
    print("\n" + "="*60)
    print("🎯 READY TO TEST!")
    print("="*60)
    print("\n1. Open your Android app")
    print("2. It will load the GitHub Pages interface")
    print("3. The interface will connect to this API server")
    print("4. You can now test all functionality!")
    print("\nPress Ctrl+C to stop the server")
    print("="*60)
    
    try:
        from api_server import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main startup function"""
    print("🏛️ Unified Mediation Platform Startup")
    print("="*50)
    
    # Check requirements
    if not check_requirements():
        return
    
    # Initialize database
    if not initialize_database():
        return
    
    # Start API server
    start_api_server()

if __name__ == "__main__":
    main()
