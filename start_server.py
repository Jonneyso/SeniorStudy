import http.server
import socketserver
import traceback

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        httpd.serve_forever()
except Exception as e:
    print(f"Error starting server: {e}")
    traceback.print_exc()