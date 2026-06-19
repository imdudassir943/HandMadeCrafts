import os
import traceback
from django.http import JsonResponse

class ExceptionLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Expose a secret endpoint to view the logs
        if request.path == '/api/debug-error-logs/':
            log_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'django_errors.log')
            if os.path.exists(log_path):
                with open(log_path, 'r') as f:
                    content = f.read()
                return JsonResponse({'logs': content})
            return JsonResponse({'logs': 'No error logs found.'})
            
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        log_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'django_errors.log')
        tb = traceback.format_exc()
        
        # Log path details, request details, and traceback
        log_entry = (
            f"=== EXCEPTION CAUGHT ===\n"
            f"Path: {request.path}\n"
            f"Method: {request.method}\n"
            f"Exception: {str(exception)}\n"
            f"Traceback:\n{tb}\n"
            f"========================\n\n"
        )
        
        # Append to log file
        with open(log_path, 'a') as f:
            f.write(log_entry)
            
        # Return none to let Django handle it normally (e.g. show 500 page)
        return None
