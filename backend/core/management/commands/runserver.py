import os
import sys
import environ
from django.conf import settings
from django.contrib.staticfiles.management.commands.runserver import Command as StaticfilesRunserverCommand
from pyngrok import ngrok, conf

# Load .env file
env = environ.Env()
env_file = os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env')
if os.path.exists(env_file):
    environ.Env.read_env(env_file)

class Command(StaticfilesRunserverCommand):
    help = "Starts the development server and an ngrok tunnel."

    def handle(self, *args, **options):
        # Only start ngrok in the main process (not the reloader's child process)
        # or if reloader is disabled.
        use_reloader = options.get('use_reloader', True)
        
        if not use_reloader or os.environ.get('RUN_MAIN') != 'true':
            self.start_ngrok(options)

        super().handle(*args, **options)

    def start_ngrok(self, options):
        # Check if ngrok is enabled via .env
        use_ngrok = os.environ.get('USE_NGROK', '').lower() == 'true'
        
        # Get the port
        addr = options.get('addrport') or '8000'
        port = addr.split(':')[-1] if ':' in addr else addr
        
        if not use_ngrok:
            self.stdout.write(self.style.WARNING('USE_NGROK is not enabled. Using local API URL.'))
            # Update frontend with local URL
            local_url = f'http://localhost:{port}'
            frontend_env_path = os.path.join(settings.BASE_DIR.parent, 'frontend', '.env.local')
            self.update_frontend_env(frontend_env_path, local_url)
            return
        
        self.stdout.write(self.style.SUCCESS('Starting ngrok tunnel...'))
        
        try:
            # Try to load NGROK_AUTHTOKEN from .env if not already in environment
            if not os.environ.get('NGROK_AUTHTOKEN'):
                env_path = os.path.join(settings.BASE_DIR, '.env')
                if os.path.exists(env_path):
                    with open(env_path, 'r') as f:
                        for line in f:
                            if line.strip().startswith('NGROK_AUTHTOKEN='):
                                token = line.strip().split('=', 1)[1].strip()
                                if token:
                                    ngrok.set_auth_token(token)
                                    self.stdout.write(self.style.SUCCESS('Loaded NGROK_AUTHTOKEN from .env'))
                                break

            # Connect ngrok
            # We use the default configuration. 
            # If the user has an authtoken configured in their system ngrok config, it will be used.
            public_url = ngrok.connect(port).public_url
            self.stdout.write(self.style.SUCCESS(f'ngrok tunnel established: {public_url}'))
            
            # Update frontend .env.local (gitignored)
            # Assuming frontend is at the same level as backend folder
            frontend_env_path = os.path.join(settings.BASE_DIR.parent, 'frontend', '.env.local')
            self.update_frontend_env(frontend_env_path, public_url)
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to start ngrok: {e}'))
            self.stdout.write(self.style.WARNING('Continuing without ngrok...'))



    def update_frontend_env(self, path, url):
        try:
            lines = []
            if os.path.exists(path):
                with open(path, 'r') as f:
                    lines = f.readlines()
            
            # Update or add EXPO_PUBLIC_API_BASE_URL
            new_lines = []
            found = False
            key = 'EXPO_PUBLIC_API_BASE_URL'
            value = f'{url}/api' # Appending /api as per api.ts fallback
            
            for line in lines:
                if line.startswith(f'{key}='):
                    new_lines.append(f'{key}={value}\n')
                    found = True
                else:
                    new_lines.append(line)
            
            if not found:
                if new_lines and not new_lines[-1].endswith('\n'):
                    new_lines.append('\n')
                new_lines.append(f'{key}={value}\n')
                
            with open(path, 'w') as f:
                f.writelines(new_lines)
            
            self.stdout.write(self.style.SUCCESS(f'Updated {path} with {key}={value}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to update frontend env file: {e}'))
