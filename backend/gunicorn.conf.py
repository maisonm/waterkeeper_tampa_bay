import os

# Worker class 
worker_class = "uvicorn.workers.UvicornWorker"

# Default to 1 worker so startup sync and APScheduler only run once per deploy.
workers = int(os.getenv("WEB_CONCURRENCY", "1"))

# Bind to all interfaces
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"

# Restart workers after this many requests to prevent memory leaks
max_requests = 1000
max_requests_jitter = 100  # randomise restarts so they don't all happen at once

# Sync jobs fetch external data; allow enough time for slow network I/O.
timeout = 120

# Graceful shutdown - let in flight requests finish
graceful_timeout = 10

# Log to stdout 
accesslog = "-"
errorlog = "-"
loglevel = "warning"
