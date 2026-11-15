# Tiny static server for local testing:  python3 tests/serve.py  ->  http://localhost:8765
import http.server, functools, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
http.server.ThreadingHTTPServer(("127.0.0.1", 8765), functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)).serve_forever()
