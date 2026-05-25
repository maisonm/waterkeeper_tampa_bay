import multiprocessing
import os

# Worker class - Uvicorn workers give async support inside Gunicorn
worker_class = "uvicorn.workers.UvicornWorker"

# (2 x CPU cores) + 1 is the standard formula for async workers
workers = int(os.getenv("WEB_CONCURRENCY", multiprocessing.cpu_count() * 2 + 1))

# Bind to all interfaces; PORT env var is standard on most cloud platforms
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"

# Restart workers after this many requests to prevent memory leaks
max_requests = 1000
max_requests_jitter = 100  # randomise restarts so they don't all happen at once

# How long a worker has to handle a request before being killed
timeout = 30

# Graceful shutdown - let in-flight requests finish
graceful_timeout = 10

# Log to stdout (captured by the platform's log aggregator)
accesslog = "-"
errorlog = "-"
loglevel = "warning"
