import multiprocessing
import os

# Worker class 
worker_class = "uvicorn.workers.UvicornWorker"

# (2 x CPU cores) + 1 
workers = int(os.getenv("WEB_CONCURRENCY", multiprocessing.cpu_count() * 2 + 1))

# Bind to all interfaces
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"

# Restart workers after this many requests to prevent memory leaks
max_requests = 1000
max_requests_jitter = 100  # randomise restarts so they don't all happen at once

# How long a worker has to handle a request before being killed
timeout = 30

# Graceful shutdown - let in flight requests finish
graceful_timeout = 10

# Log to stdout 
accesslog = "-"
errorlog = "-"
loglevel = "warning"
